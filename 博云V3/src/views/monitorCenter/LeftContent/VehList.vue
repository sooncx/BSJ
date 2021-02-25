<template>
  <div class="VehList">
    <div class="VehItemBox">
      <div class="inputSearch">
        <VehFuzzySearch
          v-model:value="FuzzySearch"
          :groupVisible="false"
          :inputStyle="{ width: '100%' }"
        />
      </div>
      <div class="itemBar">
        <div
          @click="choseItem(item.value)"
          class="item"
          v-for="(item, index) in items"
          :key="index"
          :style="{
            background: selectItem == item.value ? '#075ED2' : '',
            color: selectItem == item.value ? '#fff' : '',
          }"
        >
          {{ item.label }}{{ "(" + item.count + ")" }}
        </div>
      </div>
      <div
        class="btnBar"
        v-show="!vehloading"
        v-if="tableData.length > 0"
      >
        <div class="Paging">
          <div
            class="Paging__prev"
            :class="currentPage > 1 ? 'work' : ''"
            @click="currentChange('prev')"
          >
            上一页
          </div>
          <div class="Paging__pages">
            {{ currentPage }}/{{ Math.ceil(total / mypageSize) }}
          </div>
          <div
            class="Paging__next"
            :class="currentPage < Math.ceil(total / mypageSize) ? 'work' : ''"
            @click="currentChange('next')"
          >
            下一页
          </div>
        </div>
        <div
          class="btn"
          @click="allVehFn"
          :class="{
            btnDisable: loading || usingVehsCounts == 0,
          }"
        >
          {{ isChoseAllVeh() ? "取消全选" : "全部选择" }}
        </div>
      </div>
      <div
        v-loading="vehloading"
        v-show="vehloading"
        class="itemList"
      ></div>
      <div
        class="itemList"
        v-show="!vehloading"
      >
        <div
          v-if="tableData.length == 0"
          class="empty"
        >暂无数据</div>
        <div
          v-else
          class="vehItem"
          @click="(stopScroll = true), choseVeh(item)"
          @dblclick="cancleVeh(item)"
          v-for="(item, index) in tableData.slice(
            ((currentPage % 6 == 0 ? 6 : currentPage % 6) - 1) * mypageSize,
            (currentPage % 6 == 0 ? 6 : currentPage % 6) * mypageSize
          )"
          :key="index"
          :class="{
            veh_active: selectedVeh && selectedVeh.V == item.V,
            veh_on:
              selectVehId.has(item.V) &&
              (!selectedVeh || selectedVeh.V !== item.V),
            veh_disable: [3, 4].includes(item.Z),
            veh_cannotActive:
              cannotSelectedVeh && cannotSelectedVeh.V == item.V,
          }"
          :style="{ background: index % 2 == 0 ? '#F7F7F7' : '' }"
        >
          <div
            class="left"
            :class="{
              veh_alarm: item && item.B && item.B != '',
              veh_stop: item && item.Z == 2,
              veh_drive: item && item.Z == 1,
            }"
          >
            <i class="iconfont icon-car1"></i>
            <div :title="item.P">{{ item.P }}</div>
          </div>
          <div
            class="middle"
            :class="{
              veh_alarm: item && item.B && item.B != '',
              veh_stop: item && item.Z == 2,
              veh_drive: item && item.Z == 1,
            }"
          >
            <i
              class="iconfont"
              v-if="showChargeType"
              :class="getChargeType(item.longStayTer)"
            ></i>
            <i
              class="iconfont"
              :class="getLevel(item.CL)"
              @click.stop="getMouseEvent($event, item, '关注')"
            ></i>
            <div :title="getVehState(item.Z, item.d, item.timeInterval)">
              {{ getVehState(item.Z, item.d, item.timeInterval) }}
            </div>
          </div>
          <div class="vedio">
            <i
              class="iconfont icon-zhibobofangshexiangjiguankanmianxing"
              @click.stop="showVideo(item)"
            ></i>
          </div>
          <div
            class="right_renew"
            v-if="[4].includes(item.Z)"
            @click.stop="charge(item)"
          >
            续费
          </div>
          <div
            v-else
            class="right"
            @click.stop="getMouseEvent($event, item, '侧边设置')"
            @dblclick.stop
          >
            <i class="iconfont icon-shezhi1"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
  <OptionsMene
    id="vehListMenu"
    v-model:popoverVisible="popoverVisible"
    v-model:popMouseEvent="popMouseEvent"
    :listData="popoverList"
    :popType="popType"
    v-model:vehInfo="vehInfo"
    type="modify"
  >
  </OptionsMene>
  <!-- 续费窗口 -->
  <carRechargeModal
    v-model:visible="carRechargeModelVisible"
    :carRechargeNumber="0"
    :dataItem="selectTableItem"
  ></carRechargeModal>
</template>
<script lang="ts">
import {
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  toRefs,
  watch,
  computed,
  defineAsyncComponent,
  inject,
  Ref,
} from "vue";
import router from "@/router";
import { deepClone } from "../../../assets/js/base";
import VehFuzzySearch from "@/components/VehGroup/src/VehFuzzySearch.vue";
import API from "../../../api/monitorCenter";
import lodash from "lodash";
import { debounce } from "@/assets/js/base";
import { useFunction } from "../function";
import { carRechargeModal } from "@/views/manageData/module/index";
import { useStore } from "vuex";
export default defineComponent({
  components: {
    OptionsMene: defineAsyncComponent(
      () => import("@/components/OptionsMenu/index.vue")
    ),
    VehFuzzySearch,
    carRechargeModal,
  },
  props: {
    selectedVeh: {
      type: Object,
      default: null,
    },
    selectedAllVehs: {
      type: Object,
      default: () => new Map(),
    },
    selectGroupId: {
      type: Object,
      default: () => new Set(),
    },
    SearchValue: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["outPutVideo", "update:selectedVeh", "update:selectedAllVehs", "update:SearchValue"],
  setup(props, { emit }) {
    const store = useStore();
    const { showMsg, querySettleDetail } = useFunction();
    const vheResert = inject("vheResert") as any;
    let updateAssociatedVehs = inject("updateAssociatedVehs") as Function;
    let cycleCecond = inject("cycleCecond") as any;
    let updateTachograph = inject("updateTachograph") as Function;
    // const OptionMenuDialogFn = inject("OptionMenuDialogFn") as Function;
    const chosedVeh = inject("chosedVeh") as any;
    const videoFlag = <Ref<boolean>>inject("videoFlag");
    const data = reactive({
      popType: "侧边设置", // 指令列表类型
      popoverList: [] as any, // 指令列表
      carRechargeModelVisible: false, // 续费弹窗visible
      selectTableItem: [] as any, // tab栏类型数据
      cannotSelectedVeh: null, // 当前要选中的不可选车辆
      vehInfo: null as any, // 当前选中车辆
      FuzzySearch: null as any, // 模糊搜索数据
      selectItem: 0, // 当前选中tab栏
      selectVehId: new Set(), // 选中车辆id集合
      vehlistMap: new Map(), // 车辆列表集合
      total: 0,
      loading: false,
      vehloading: false,
      usingVehsCounts: 0, // 可选车辆总数
      popoverRef: null,
      popoverVisible: false,
      popMouseEvent: {}, // 车辆选项点击位置,用于设置指令列表展示位置
      currentPage: 1,
      realCurrentPage: 1,
      pageSize: 1200,
      mypageSize: 200,
      tableData: [],
      searchVehId: null, // 模糊搜索车辆id
      clickTimer: null as any, // 单击选中/双击取消车辆定时器
      stopScroll: false, // 是否允许车辆列表滚动到选中车辆位置标识
      items: [
        {
          label: "全部",
          value: 0,
          count: 0,
        },
        {
          label: "在线",
          value: 1,
          count: 0,
        },
        {
          label: "离线",
          value: 2,
          count: 0,
        },
      ],
      showVideo(veh: any) {
        let obj = { name: "行车记录仪", vehInfo: veh };
        updateTachograph(obj);
        videoFlag.value = true;
        emit("outPutVideo", { ...obj });
      },
      choseItem: function (value: number) {
        data.selectItem = value;
        data.currentPage = 1;
        loadVehicles();
      },
      // 续费
      charge(item: any) {
        data.carRechargeModelVisible = true;
        data.selectTableItem = [
          {
            expireTime: item.EP,
            plate: item.P,
            NOW: item.NOW,
            groupId: item.M,
            vehicleId: item.V,
          },
        ];
      },
      // 获取关联车辆数据
      async getAssociateData(veh: any) {
        if (!AssociateOpen.value) return;
        const res = await querySettleDetail(props.selectedVeh.V);
        let arr = [] as any;
        res &&
          res.map((item: any) => {
            arr.push({ ...item, isAssociate: true });
          });
        updateAssociatedVehs(arr);
      },
      // 选中车辆
      choseVeh: function (veh: any) {
        if ([4].includes(veh.Z)) {
          showMsg("车辆已过期!");
          return;
        }
        if ([3].includes(veh.Z)) {
          showMsg("车辆从未上线!");
          return;
        }
        if (data.clickTimer) {
          window.clearTimeout(data.clickTimer);
          data.clickTimer = null;
        }
        data.clickTimer = window.setTimeout(() => {
          handleOnVehItemClick({ ...veh }, true);
          //handleOnVehItemClick({ ...veh, voltage: 1, E: 11 }, true);
          data.selectVehId.add(veh.V);
        }, 200);
      },
      // 取消选中车辆
      cancleVeh(veh: any) {
        data.stopScroll = false;
        if ([3, 4].includes(veh.Z)) return;
        if (data.clickTimer) {
          window.clearTimeout(data.clickTimer);
          data.clickTimer = null;
        }
        handleOnVehItemClick(veh, false);
        data.selectVehId.delete(veh.V);
      },
      // 全选/取消全选车辆
      allVehFn() {
        let copyVeh = null;
        let copyAllVehs = new Map();
        if (!data.isChoseAllVeh()) {
          data.selectVehId = new Set();
          for (let item of data.tableData) {
            if (![3, 4].includes((item as any).Z)) {
              copyAllVehs.set((item as any).V, item);
              data.selectVehId.add((item as any).V);
            }
          }
          if (!props.selectedVeh) {
            copyVeh = null;
            [...copyAllVehs.values()].map((item) => {
              if (![3, 4].includes((item as any).Z)) {
                copyVeh = item;
              }
            });
          } else {
            copyVeh = lodash.cloneDeep(props.selectedVeh);
          }
        } else {
          copyAllVehs = new Map();
          copyVeh = null;
          data.selectVehId = new Set();
        }
        emit("update:selectedVeh", copyVeh);
        emit("update:selectedAllVehs", copyAllVehs);
      },
      // 判断是否全选车辆列表所有可选车辆
      isChoseAllVeh() {
        if (
          data.usingVehsCounts == data.selectVehId.size &&
          data.selectVehId.size != 0
        ) {
          return true;
        }
        return false;
      },
      // 获取车辆类型
      getVehState(state: number, time: string, timeInterval: string) {
        if (timeInterval) {
          return "[" + timeInterval + "回传]";
        }
        switch (state) {
          case 0:
            return "离线" + "(" + time + ")";
            break;
          case 1:
            return "行驶" + "(" + time + ")";
            break;
          case 2:
            return "停车" + "(" + time + ")";
            break;
          case 3:
            return "从未上线";
            break;
          case 4:
            return "过期";
            break;
          default:
            return "从未上线";
            break;
        }
      },
      // 获取车辆关注度
      getLevel(level: any) {
        switch (level) {
          case 1:
            return "icon-gao levelH";
            break;
          case 2:
            return "icon-zhong levelM";
            break;
          case 3:
            return "icon-di levelL";
            break;
          default:
            return "";
            break;
        }
      },
      // 获取车辆充放电类型
      getChargeType(type: any) {
        switch (type) {
          case 0:
            return "icon-youxian charge";
            break;
          case 1:
            return "icon-quedian- charge";
          default:
            break;
        }
      },
      currentChange(type: any) {
        if (type == "next") {
          data.currentPage < Math.ceil(data.total / data.mypageSize) &&
            data.currentPage++;
        } else {
          data.currentPage > 1 && data.currentPage--;
        }
      },
    });
    // 关联车辆数据
    const AssociateOpen = computed(() => {
      if (!store.state.systemSetList || store.state.systemSetList.length == 0) {
        return false;
      }
      let config = false;
      store.state.systemSetList.map((item: any) => {
        if (item.permissionId == 7) {
          config = item.checked;
        }
      });
      return config;
    });
    watch(AssociateOpen, (val) => {
      if (!val) {
        updateAssociatedVehs([]);
      }
    });
    // 判断是否显示充放电图标
    const showChargeType = computed(() => {
      if (!store.state.systemSetList || store.state.systemSetList.length == 0) {
        return false;
      }
      let config = false;
      store.state.systemSetList.map((item: any) => {
        if (item.permissionId == 8) {
          config = item.checked;
        }
      });
      return config;
    });
    nextTick(() => {
      // 监听当前页数
      watch(
        () => data.currentPage,
        (val: number, old: number) => {
          if (val <= 0) {
            data.currentPage = 1;
            setTimeout(() => {
              loadVehicles();
            }, 100);
          }
          // 每次查询1200条数据，前端分页200条一页，即6页为一个周期,每当页数大于0且增加时且变为6的倍数+1时（如第6页变第7页），或者减少时且变为6的倍数时（如第7页变第6页），需要重新获取新一页的数据
          // 并且前端分页的当前展示页数为当前页数对6求余数，若余数为0，则为当前页本身，否则等于余数，如当前为第7页，则去请求后台第2页数据，前端每页显示200条,展示后台数据的第(7 % 6 = 1)页。
          // 若当前页为12，则去请求台第2页数据,前端每页展示200条，展示后台数据的第（12 % 6 = 0?6:12 % 6）6页。
          if (
            (val > old && (val - 1) % 6 == 0) ||
            (val < old && val % 6 == 0)
          ) {
            data.realCurrentPage = Math.ceil(val / 6);
            setTimeout(() => {
              loadVehicles();
            }, 100);
          }
        }
      );
      // 监听当前选中车辆
      watch(
        () => props.selectedVeh,
        (val, old: any) => {
          nextTick(() => {
            if (!val) {
              updateAssociatedVehs([]);
              return;
            }
            // 获取最新关联车辆数据
            data.getAssociateData(val);
            // 在地图上切换车辆后找到该车在车辆列表的页数，跳转到该页
            const i = data.tableData.findIndex(({ V }) => V == val.V) + 1;
            data.currentPage = Math.ceil(i / data.mypageSize);
            // 查询当前选中车辆的关联车辆
            setTimeout(() => {
              // 点击veh列表和非切换车辆不会触发滚动效果
              if (
                (val && val.V && old && old.V && val.V != old.V) ||
                (val && val.V && !old)
              ) {
                scrollToSelectVeh();
              }
            }, 200);
            // debounce(() => {}, 100);
          });
        },
        {
          immediate: true,
        }
      );
      // 监听路由路径，用于其它模块跳转到监控中心并选中车辆
      watch(
        () => router.currentRoute.value.name,
        (val, old: any) => {
          if (!val || val != "monitorCenter") return;
          if (!router.currentRoute.value || !router.currentRoute.value.params)
            return;
          if (router.currentRoute.value.params.vehicleId) {
            const {
              vehicleId,
              groupId,
              plate,
            } = router.currentRoute.value.params;
            setTimeout(() => {
              const vehdata = {
                flag: 1,
                groupId: parseInt(groupId as any),
                plate: plate,
                vehicleId: parseInt(vehicleId as any),
              };
              data.FuzzySearch = { ...vehdata };
            }, 500);
          }
        },
        {
          deep: true,
          immediate: true,
        }
      );
      // 其它页面或模块导致类似选中车辆变化的操作，如点击关联车辆列表不会导致选中当前车辆变化，但是要触发选中车辆变化的相关函数
      watch(
        chosedVeh,
        (val, old) => {
          if (
            !val ||
            (val && props.selectedVeh && val.V == props.selectedVeh.V)
          )
            return;
          setTimeout(() => {
            const vehdata = {
              flag: 1,
              groupId: parseInt(val.G as any),
              plate: val.P,
              vehicleId: parseInt(val.V as any),
            };
            data.FuzzySearch = { ...vehdata };
          }, 100);
        },
        {
          immediate: true,
        }
      );
      // 模糊搜索
      watch(
        () => data.FuzzySearch,
        (val: any) => {
          data.searchVehId = null;
          if (!val) return;
          data.selectItem = 0;
          // 模糊查询车组,选中该车组
          if (val.flag == 0) {
            emit("update:SearchValue", { ...val });
          }
          // 模糊查询车辆/sim/设备号等
          else if (val.flag == 1) {
            data.currentPage = 1;
            data.searchVehId = val.vehicleId;
            emit("update:SearchValue", { ...val });
            selectSearchVeh();
            let timer = null as any;
            let times = 0;

            function selectSearchVeh() {
              times++;
              timer = setTimeout(() => {
                if (data.vehlistMap.has(val.vehicleId)) {
                  setTimeout(() => {
                    data.choseVeh(data.vehlistMap.get(val.vehicleId));
                    if ([3, 4].includes(data.vehlistMap.get(val.vehicleId).Z)) {
                      data.cannotSelectedVeh = data.vehlistMap.get(
                        val.vehicleId
                      );
                      scrollToCannotSelectVeh();
                    } else {
                      data.cannotSelectedVeh = null;
                    }
                  }, 100);
                } else if (times <= 5) {
                  selectSearchVeh();
                } else {
                  timer && timer && window.clearTimeout(timer);
                  return;
                }
              }, 200);
            }
          }
        },
        {
          deep: true,
        }
      );
      // 监听选中车组
      watch(
        () => props.selectGroupId,
        async (val, old: any) => {
          // 若选中车组为空
          if (val && val.size == 0) {
            emit("update:selectedVeh", null);
            emit("update:selectedAllVehs", new Map());
            data.vehlistMap = new Map();
            data.currentPage = 1;
            data.vehloading = false;
            updateAssociatedVehs([]);
          }
          // 重新获取车辆数据
          await loadVehicles();
          // 取消车组操作
          cancleGroup();
        },
        {
          deep: true,
        }
      );
      // 监听刷新车辆列表标识
      watch(vheResert, (val: boolean) => {
        loadVehicles(false);
      });
      // 监听轮询秒数
      watch(cycleCecond, (val: number) => {
        if (val === 0 && router.currentRoute.value.name == "monitorCenter") {
          data.vehloading = false;
          loadVehicles(false);
        }
      });
    });

    // 获取车辆分类统计数据
    async function GetGroupVehNum() {
      const params = {
        groupIds: [...(props.selectGroupId as any)].join(","),
      };
      try {
        const { flag, msg, obj } = await API.GetGroupVehNum(params);
        if (flag) {
          data.items[0].count = obj.allNum;
          data.items[1].count = obj.allOnlineCount;
          data.items[2].count = obj.allNum - obj.allOnlineCount;
        }
      } catch (error) {
        console.log(error.msg);
      }
    }
    function clearVehData() {
      data.tableData = [];
      data.total = 0;
      data.selectVehId = new Set();
      data.usingVehsCounts = 0;
      data.items[0].count = 0;
      data.items[1].count = 0;
      data.items[2].count = 0;
    }
    // 获取车辆数据
    async function loadVehicles(lodaingFlag = true) {
      data.cannotSelectedVeh = null;
      if (props.selectGroupId && props.selectGroupId.size == 0) {
        clearVehData();
        return;
      }
      const params = {
        groupId: [...(props.selectGroupId as any)].join(","),
        showVehId: props.selectedAllVehs
          ? [...props.selectedAllVehs.keys()].join(",")
          : null,
        searchVehId: data.searchVehId || null,
        state: data.selectItem,
        alarmPermission: 0,
        pageNumber: !data.searchVehId ? data.realCurrentPage : null, // 若模糊搜索车辆，则不传pageNumber
        pageSize: data.pageSize,
      };
      try {
        data.vehloading = lodaingFlag;
        data.loading = true;
        GetGroupVehNum();
        const { flag, msg, obj } = await API.loadVehicles(params);
        if (flag == 1) {
          // 若模糊搜索查询车辆不在其所属车组下，这时传入searchVehId查询结果可能为空，清除searchVehId做模糊搜索车组查询
          // 此情况暂时只出现在报警列表车辆不在当前环境下，存在车组，车组下却不存在该车，会导致查询结果为空
          if (!obj) {
            data.vehloading = false;
            if (data.searchVehId) {
              data.searchVehId = null;
              setTimeout(() => {
                loadVehicles();
              }, 100);
            }
            return;
          }
          data.searchVehId = null;
          if (obj.searchLocation) {
            data.currentPage = Math.ceil(obj.searchLocation / data.mypageSize);
          }
          data.vehlistMap = new Map();
          data.tableData = obj.data ? obj.data : [];
          data.total = obj.total || 0;
          data.usingVehsCounts = 0;
          data.tableData.map((item: any, index: number) => {
            data.vehlistMap.set(item.V, item);
            // 重点关注和无线回传的组织id覆盖其下的车辆所属车组id
            if (obj.groupId && ["-1", "-2"].includes(obj.groupId)) {
              (data.tableData[index] as any).M = obj.groupId;
            }
            if (![3, 4].includes(item.Z)) {
              data.usingVehsCounts++;
            }
          });
          setTimeout(() => {
            data.vehloading = false;
          }, 500);
        } else {
          data.vehloading = false;
        }
        setTimeout(() => {
          data.loading = false;
          if (props.selectedVeh) {
            let copyVeh = data.vehlistMap.get(props.selectedVeh.V);
            emit("update:selectedVeh", copyVeh);
          }
          if (props.selectedAllVehs.size > 0) {
            let arrMap = new Map();
            [...props.selectedAllVehs.keys()].map((key: any) => {
              arrMap.set(key, data.vehlistMap.get(key));
            });
            emit("update:selectedAllVehs", arrMap);
          }
        }, 200);
      } catch (error) {
        data.vehloading = false;
        data.loading = false;
        console.log(error.msg);
      }
    }

    // 取消车组操作
    function cancleGroup() {
      let copyVeh = lodash.cloneDeep(props.selectedVeh);
      let copyAllVehs = lodash.cloneDeep(props.selectedAllVehs);
      let vehListSet = new Set(); // 全部可选车辆数据
      data.tableData.map((item: any) => {
        if (![3, 4].includes(item.Z)) {
          vehListSet.add(item.V);
        }
      });
      // 若已选车辆所属车组已取消或已选车辆不在当前可选车辆列表中，则从已选车辆中清除已取消的车组下的车辆
      [...props.selectedAllVehs.values()].map((item: any) => {
        if (!props.selectGroupId.has(item.M) && !vehListSet.has(item.V)) {
          copyAllVehs.delete(item.V);
          data.selectVehId.delete(item.V);
        }
      });
      emit("update:selectedAllVehs", copyAllVehs);
      // 若取消当前选中车辆的所属车组，清空当前选中车辆,选中当前可选列表第一辆车
      if (props.selectedVeh && !vehListSet.has(props.selectedVeh.V)) {
        data.selectVehId.delete(props.selectedVeh.V);
        copyVeh = props.selectedAllVehs.get([...vehListSet.keys()][0]);
        emit("update:selectedVeh", copyVeh);
      }
    }
    // 点击车辆操作
    function handleOnVehItemClick(veh: any, flag: boolean) {
      let copyVeh = null;
      let copyAllVehs = new Map();
      // 选中
      if (flag) {
        if (!props.selectedAllVehs.has(veh.V)) {
          copyAllVehs = new Map([
            [veh.V, veh],
            ...(props.selectedAllVehs as any),
          ]);
          emit("update:selectedAllVehs", copyAllVehs);
        }
        copyVeh = { ...veh };
        emit("update:selectedVeh", copyVeh);
      } else {
        // 取消选中
        copyAllVehs = lodash.cloneDeep(props.selectedAllVehs as any);
        const arr = [...props.selectedAllVehs.values()];
        const i = arr.findIndex(({ V }) => V == veh.V);
        // 若取消车辆是当前选中车辆，则选中上次选中车辆
        if (veh.V && veh.V == arr[0].V) {
          copyVeh = arr[i + 1] || arr[i - 1];
        } else {
          copyVeh = arr[0];
        }
        copyAllVehs.delete(veh.V);
        emit("update:selectedVeh", copyVeh);
        emit("update:selectedAllVehs", copyAllVehs);
      }
      // setTimeout(() => {
      // 点击veh列表不会触发滚动效果
      // scrollToSelectVeh();
      // }, 200);
    }
    // 滚动到查询的不可选中车辆
    function scrollToCannotSelectVeh() {
      setTimeout(() => {
        const cannotActiveDom = document.getElementsByClassName(
          "veh_cannotActive"
        )[0];
        cannotActiveDom && cannotActiveDom.scrollIntoView();
        data.vehloading = false;
        setTimeout(() => {
          data.cannotSelectedVeh = null;
        }, 1500);
      }, 500);
    }
    // 滚动到选中车辆
    function scrollToSelectVeh() {
      const activeDom = document.getElementsByClassName("veh_active")[0];
      debounce(() => {
        !data.stopScroll && activeDom && activeDom.scrollIntoView();
        data.vehloading = false;
      }, 50);
      setTimeout(() => {
        data.stopScroll = false;
      }, 100);
    }
    function setTableData(num = data.total) {
      const arr: any = [];
      for (let i = 0; i < num; i++) {
        arr.push({
          plate: "粤B12345" + i,
          V: "V" + i,
          orginizationId: "orginizationId" + i,
          organizationName: "组织名" + i,
          type: 0,
          direct: parseInt((Math.random() * 360) as any),
          chargeType: parseInt((Math.random() * 2) as any),
          state: parseInt(Math.random().toFixed(0)) + 1,
          level: parseInt((Math.random() * 3) as any),
          time: parseInt((Math.random() * 1000).toFixed(0)) + "天",
          lat: Math.random() * 50,
          lng: Math.random() * 100,
        });
      }
      // data.tableData = arr;
    }
    // 关注度设置
    function getMouseEvent(event: any, vehInfo: Object, type: string) {
      data.popoverList = [];
      data.popoverVisible = true;
      data.popType = type;
      data.popoverList =
        type == "关注" ? ["高", "中", "低", "修改备注", "清除关注"] : [];
      data.vehInfo = { ...vehInfo };
      const { clientX, clientY } = event;
      data.popMouseEvent = { clientX, clientY };
    }
    return {
      showChargeType,
      getMouseEvent,
      ...toRefs(data),
      ...toRefs(props),
    };
  },
});
</script>
<style lang="less" scoped>
.VehList {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  justify-content: space-between;
  .VehItemBox {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    .inputSearch {
      padding: 8px 6px;
      width: 100%;
    }
    .itemBar {
      width: 100%;
      height: 35px;
      background: #f7f7f7;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .item {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #a3a3a3;
        font-size: 12px;
        cursor: pointer;
        &:hover {
          // background: #075ed2;
          color: #075ed2;
        }
      }
    }
    .btnBar {
      height: 37px;
      width: 100%;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      font-size: 12px;
      font-family: PingFang SC Medium, PingFang SC Medium-Medium;
      font-weight: 500;
      color: #075ed2;
      .Paging {
        display: flex;
        align-items: center;
        & > div {
          padding-left: 10px;
          color: gray;
        }
        // &__prev {
        // }
        // &__pages {
        // }
        // &__next {
        // }
      }
      .btn {
        cursor: pointer;
        &:hover {
          color: blue;
        }
      }
    }
    .itemList {
      width: 100%;
      flex: 1;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        width: 6px;
        background-color: rgba(105, 107, 112, 0.3);
        transition: background-color 0.3s;
      }
      &::-webkit-scrollbar-thumb:hover {
        background-color: rgba(109, 112, 119, 0.5);
      }
      &::-webkit-scrollbar-thumb:active {
        background-color: rgba(123, 126, 133, 0.5);
      }
      .vehItem {
        cursor: pointer;
        height: 32px;
        width: 100%;
        display: flex;
        align-items: center;
        &:not(.veh_disable) {
          &:hover {
            background: #f8f8f8 !important;
          }
        }
        & > div {
          display: flex;
          align-items: center;
          font-size: 12px;
          i {
            margin-right: 5px;
            cursor: pointer;
          }
        }
        .left {
          width: calc(45% - 10px);
          height: 100%;
          padding-left: 10px;
          font-size: 14px;
          div {
            overflow: hidden; /*超出部分隐藏*/
            text-overflow: ellipsis; /* 超出部分显示省略号 */
            white-space: nowrap; /*规定段落中的文本不进行换行 */
          }
        }
        .middle {
          width: calc(50% - 35px);
          height: 100%;
          padding-left: 10px;
          div {
            overflow: hidden; /*超出部分隐藏*/
            text-overflow: ellipsis; /* 超出部分显示省略号 */
            white-space: nowrap; /*规定段落中的文本不进行换行 */
          }
        }
        .right_renew {
          width: 30px;
          margin-right: 5px;
          font-size: 12px;
          cursor: pointer;
          position: relative;
          right: -2px;
          &:hover {
            color: blue;
          }
        }

        .vedio,
        .right {
          width: 20px;
          height: 100%;
          position: relative;
          right: -10px;
          i {
            font-size: 14px;
            cursor: pointer;
            color: #7e91aa;
            &:hover {
              color: blue;
            }
          }
        }
        .vedio {
          right: 0px;
        }
      }
    }
  }
}
.levelH {
  color: #cf1c24;
}
.levelM {
  color: #ff841f;
}
.levelL {
  color: #00c45c;
}
.charge {
  color: #075ed2;
}
.veh {
  &_active {
    background: #bbe7ff !important;
  }
  &_on {
    background: #e0f4ff !important;
  }
  &_disable {
    cursor: not-allowed !important;
    background: #e4e4e4 !important;
  }
  &_cannotActive {
    animation: myanimate 1s infinite !important;
    transition: all 1s;
  }
  &_alarm {
    color: red !important;
  }
  &_stop {
    color: blue !important;
  }
  &_drive {
    color: green !important;
  }
}
@keyframes myanimate {
  0% {
    opacity: 1;
    color: #333;
  }
  50% {
    opacity: 0.5;
    color: red;
  }
  100% {
    opacity: 1;
    color: #333;
  }
}
.btnDisable {
  color: #a3a3a3;
  cursor: not-allowed !important;
  &:hover {
    color: #a3a3a3 !important;
  }
}
.work {
  cursor: pointer;
  &:hover {
    color: blue !important;
  }
}
.empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #075ed2;
}
</style>