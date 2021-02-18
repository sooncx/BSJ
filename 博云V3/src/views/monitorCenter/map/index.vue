<template>
  <div class="Map">
    <ToolBar
      v-model:mapType="mapType"
      v-model:selectedVeh="selectedVeh"
      v-model:slideBoxShow="slideBoxShow"
      @toolBarFn="toolBarFn"
    />
    <SlideBox v-model:slideBoxShow="slideBoxShow">
      <Point
        v-if="slideBoxType == '二押点'"
        v-model:pointData="slideBoxData"
      />
      <Fence
        v-else-if="slideBoxType == '围栏'"
        v-model:fenceData="slideBoxData"
      />
      <Location
        v-else
        v-model:locationData="slideBoxData"
      />
    </SlideBox>
    <Bmap
      ref="Bmap"
      v-if="mapType == 'Bmap'"
      :centerPoint="$attrs.centerPoint"
      :selectedAllVehs="$attrs.selectedAllVehs"
      :selectedVeh="selectedVeh"
      v-model:mapType="mapType"
      :Satellite="Satellite"
      :Traffic="Traffic"
      @popFn="popFn"
    />
    <Amap
      ref="Amap"
      v-if="mapType == 'Amap'"
      :centerPoint="$attrs.centerPoint"
      :selectedAllVehs="$attrs.selectedAllVehs"
      :selectedVeh="selectedVeh"
      v-model:mapType="mapType"
      :Satellite="Satellite"
      :Traffic="Traffic"
      @popFn="popFn"
    />
    <AssociateVehs v-model:selectedVeh="selectedVeh" />
    <TableBox
      v-model:dragResize="dragResize"
      v-model:tableResize="tableResize"
      v-model:showOptions="showOptions"
    >
      <Table
        v-model:tableResize="tableResize"
        v-model:showOptions="showOptions"
      />
    </TableBox>
    <FenceDialog
      v-model:mapType="mapType"
      v-model:visible="fenceDialogVisible"
      v-model:vehInfo="fenceDialogVehInfo"
      v-model:fenceData="fenceDialogData"
      :fenceType="fenceType"
      @FenceOkFn="FenceOkFn"
    />
    <!-- <div class="test">
      <el-cascader-panel
        :props="{expandTrigger:'hover'}"
        :options="options"
        @change="selectChange"
      ></el-cascader-panel>
    </div> -->
    <OptionsMene
      id="infowindow"
      ref="OptionsMene"
      v-model:popoverVisible="popoverVisible"
      v-model:popMouseEvent="popMouseEvent"
      v-model:vehInfo="selectedVeh"
      v-model:listData="popoverList"
      v-model:popType="popType"
      v-model:menuType="menuType"
      type="modify"
      :marginLeft="-70"
    >
      <template v-slot:content>
        <el-cascader-panel
          :props="{expandTrigger:'hover'}"
          :options="options"
          @change="selectChange"
        ></el-cascader-panel>
        <!-- <div id="test">
          <a-cascader
            :options="options"
            expand-trigger="hover"
            placeholder="Please select"
            @change="selectChange"
          />
        </div> -->
      </template>
    </OptionsMene>
    <AreaDialog
      v-model:DialogType="DialogType"
      v-model:visible="areaDialogVisible"
      v-model:vehInfo="selectedVeh"
      v-model:title="areaDialogTitle"
    />
    <AreaVehsDialog
      v-model:visible="areaVehDialogVisible"
      v-model:areaVehDialogData="areaVehDialogData"
    />
    <CloudTwoChargeDialog v-model:visible="CloudTwoChargeVisible" />
    <TwoChargeBindVehDialog v-model:visible="TwoChargeBindVehVisible" />
    <OcarDialog v-model:visible="OcarVisible" />
    <div
      class="cycleBox"
      v-if="selectGroupId.size > 0"
    >
      <p>{{cycleCecond}}</p>
      <span>秒后刷新</span>
    </div>
  </div>
  <div id="mapLabel_detailBox"></div>
</template>
<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  toRefs,
  ref,
  watch,
  nextTick,
  computed,
  provide,
  inject,
} from "vue";
import { useFunction } from "../function";
import { GetGeo } from "@/api/apiFn";
import { debounce } from "@/assets/js/base";
import OptionsMene from "@/components/OptionsMenu/index.vue";
export default defineComponent({
  components: {
    ToolBar: defineAsyncComponent(() => import("./ToolBar.vue")),
    Bmap: defineAsyncComponent(() => import("./Bmap.vue")),
    Amap: defineAsyncComponent(() => import("./Amap.vue")),
    SlideBox: defineAsyncComponent(() => import("../SlideBox/index.vue")),
    Point: defineAsyncComponent(() => import("../SlideBox/point.vue")),
    Fence: defineAsyncComponent(() => import("../SlideBox/fence.vue")),
    Location: defineAsyncComponent(() => import("../SlideBox/location.vue")),
    TableBox: defineAsyncComponent(() => import("../table/DragBox.vue")),
    AssociateVehs: defineAsyncComponent(() => import("./AssociateVehs.vue")),
    FenceDialog: defineAsyncComponent(
      () => import("../../../components/Fence/index.vue")
    ),
    OptionsMene,
    AreaDialog: defineAsyncComponent(() => import("./dialog/index.vue")),
    Table: defineAsyncComponent(() => import("../table/myTable.vue")),
    AreaVehsDialog: defineAsyncComponent(
      () => import("./dialog/content/areaVehs/index.vue")
    ),
    CloudTwoChargeDialog: defineAsyncComponent(
      () => import("./dialog/content/cloudTwoCharge/index.vue")
    ),
    TwoChargeBindVehDialog: defineAsyncComponent(
      () => import("../../../components/BindVehs/index.vue")
    ),
    OcarDialog: defineAsyncComponent(() => import("./dialog/Ocar.vue")),
  },
  props: {
    dragResize: {
      type: Boolean,
      default: false,
    },
    selectedVeh: {
      type: Object,
      default: null,
    },
    selectGroupId: {
      type: Object,
      default: () => new Set(),
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      OcarVisible: false,
      tableResize: false,
      showOptions: false,
      cycleTimer: null as any,
      fenceType: "addFence",
      Satellite: false, // 卫星图层
      Traffic: false, // 路况图层
      mapType: "Amap", // 地图类型
      popoverList: [],
      slideBoxData: [],
      popoverVisible: false,
      popMouseEvent: {},
      areaVehDialogData: {},
      areaVehDialogVisible: false,
      CloudTwoChargeVisible: false,
      TwoChargeBindVehVisible: false,
      attentionList: ["高", "中", "低", "修改备注", "清除关注"],
      popType: "",
      DialogType: "",
      menuType: "",
      slideBoxShow: false,
      slideBoxType: "",
      toolBarType: "",
      fenceDialogVisible: false,
      fenceDialogVehInfo: null as any,
      fenceDialogData: null as any,
      areaDialogVisible: false,
      areaDialogTitle: "",
      Bmap: ref<HTMLDivElement | null>(null),
      Amap: ref<HTMLDivElement | null>(null),
      OptionsMene: ref<HTMLDivElement | null>(null),
      options: [
        {
          value: "1",
          label: "多边形",
          children: [
            {
              value: "1-1",
              label: "查看",
            },
            {
              value: "1-2",
              label: "设置",
            },
          ],
        },
        {
          value: "2",
          label: "圆形",
          children: [
            {
              value: "2-1",
              label: "查看",
            },
            {
              value: "2-2",
              label: "200米半径",
            },
            {
              value: "2-3",
              label: "自定义半径",
            },
            {
              value: "2-4",
              label: "删除",
            },
          ],
        },
        {
          value: "3",
          label: "停留点",
          children: [
            {
              value: "3-1",
              label: "查看",
            },
            {
              value: "3-2",
              label: "设置",
            },
            {
              value: "3-3",
              label: "删除",
            },
          ],
        },
        {
          value: "4",
          label: "绑定省市区",
        },
        {
          value: "5",
          label: "添加位置点",
        },
      ],
    });
    const {
      showMsg,
      normalShowMsg,
      showAMsg,
      getPathIdByVehicleId,
      SelectPointByUserId,
      labelDetailFn,
      DeletePoint,
      getArea,
      GetVehicleCircle,
      saveRoundFence,
      updateRoundFence,
      deleteRoundFence,
      GetVehicleStayPoint,
      deleteStoppingPoint,
      GetTwoChargeByUserId,
      saveVehicleConcern,
      deleteVehicleConcern,
    } = useFunction();
    let cycleCecond = inject("cycleCecond") as any;
    let updateCycleCecond = inject("updateCycleCecond") as Function;
    // 位置点，围栏，二押点侧边面板事件
    const slideBoxFn = async (type: string, val = null as any) => {
      data.fenceDialogVehInfo = null;
      switch (type) {
        case "聚焦到选中位置点":
          nowMapRef.value.zoomOverlay(val);
          break;
        case "位置点显示切换":
          val
            ? nowMapRef.value.drawAllPoints(data.slideBoxData as any)
            : nowMapRef.value.clearAllPoints();
          break;
        case "关闭位置点面板":
          data.slideBoxShow = false;
          nowMapRef.value.clearAllPoints();
          break;
        case "添加位置点":
          data.fenceDialogVisible = true;
          data.fenceType = "addPoint";
          break;
        case "删除位置点成功":
          showAMsg("位置点删除成功!");
          data.slideBoxData = await SelectPointByUserId();
          nowMapRef.value.drawAllPoints(data.slideBoxData as any);
          break;
        case "添加围栏":
          data.fenceDialogVisible = true;
          data.fenceType = "addFence";
          break;
        case "聚焦到选中围栏":
          nowMapRef.value.zoomOverlay(val, "围栏");
          break;
        case "围栏显示切换":
          val
            ? nowMapRef.value.drawAllFences(data.slideBoxData as any)
            : nowMapRef.value.clearAllFences();
          break;
        case "关闭围栏面板":
          data.slideBoxShow = false;
          nowMapRef.value.clearAllFences();
          break;
        case "删除围栏成功":
          showAMsg("围栏删除成功!");
          data.slideBoxData = await getArea();
          nowMapRef.value.drawAllFences(data.slideBoxData as any);
          break;
        case "修改围栏":
          data.fenceType = "changeFence";
          data.fenceDialogVisible = true;
          data.fenceDialogData = { ...val };
          break;
        case "围栏绑车":
          data.fenceType = "bindCar";
          data.fenceDialogVisible = true;
          data.fenceDialogData = { ...val };
          break;
        case "聚焦到选中二押点":
          nowMapRef.value.drawTwoChargePoints([val]);
          nowMapRef.value.zoomOverlay(val, "二押点");
          break;
        case "关闭二押点面板":
          data.slideBoxShow = false;
          nowMapRef.value.clearAllTwoChargePoints();
          break;
        case "添加二押点":
          data.fenceDialogVisible = true;
          data.fenceType = "addTwoChargePoints";
          break;
        case "删除二押点成功":
          showAMsg("二押点删除成功!");
          data.slideBoxData = await GetTwoChargeByUserId();
          let arrSet = new Set();
          data.slideBoxData.map((item: any) => {
            arrSet.add(item.chargeId);
          });
          // 若删除的点是当前选中点，则清空地图二押点，否则保持不变 val是当前选中二押点
          if (!arrSet.has(val.chargeId)) {
            nowMapRef.value.drawTwoChargePoints([]);
          }
          break;
        case "云端二押点":
          data.CloudTwoChargeVisible = true;
          break;
        case "二押点绑车":
          data.TwoChargeBindVehVisible = true;
          break;
        default:
          break;
      }
    };

    // 围栏,位置点,停留点(fence弹窗)接口调用结束事件
    // showInMap用于判断是否在操作结束后将围栏/点等覆盖物显示在地图上，默认显示
    async function FenceOkFn(type: string, showInMap = true) {
      switch (type) {
        case "添加位置点成功":
          if (showInMap && data.slideBoxShow && data.slideBoxType == "位置点") {
            data.slideBoxData = await SelectPointByUserId();
            nowMapRef.value.drawAllPoints(data.slideBoxData as any);
          }
          break;
        case "添加围栏成功":
          if (showInMap && data.slideBoxShow && data.slideBoxType == "围栏") {
            data.slideBoxData = await getArea();
            nowMapRef.value.drawAllFences(data.slideBoxData as any);
          }
          break;
        case "修改围栏成功":
          data.slideBoxData = await getArea();
          nowMapRef.value.drawAllFences(data.slideBoxData as any);
          break;
        case "围栏绑车成功":
          break;
        case "添加二押点成功":
          if (showInMap && data.slideBoxShow && data.slideBoxType == "二押点") {
            data.slideBoxData = await GetTwoChargeByUserId();
            // nowMapRef.value.drawTwoChargePoints(data.slideBoxData as any);
          }
        default:
          break;
      }
    }

    provide("slideBoxFn", slideBoxFn);
    // 地图操作结束事件
    const MapFn = async (type: string, val = null as any) => {
      switch (type) {
        case "区域查车":
          let point = {
            lat1: val[0][1],
            lat2: val[2][1],
            lon1: val[0][0],
            lon2: val[2][0],
          };
          data.areaVehDialogVisible = true;
          data.areaVehDialogData = point;
          break;
        default:
          break;
      }
    };
    provide("MapFn", MapFn);
    // 信息窗区域选项的弹窗的按钮事件
    const dialogFn = async (flag: boolean, val = null) => {
      if (flag) {
        switch (data.DialogType) {
          // 自定义圆形围栏半径
          case "2-3":
            const cycleParams = {
              groupId: props.selectedVeh.M,
              vehicleId: props.selectedVeh.V,
              radii: val,
              lat: props.selectedVeh.Y,
              lon: props.selectedVeh.X,
            };
            const cycleRes = await saveRoundFence(cycleParams);
            if (cycleRes == 1) {
              nowMapRef.value.deleteCircle(props.selectedVeh.V);
            }
            break;
          // 删除圆形围栏
          case "2-4":
            const res = await deleteRoundFence(props.selectedVeh.V);
            if (res == 1) {
              nowMapRef.value.deleteCircle(props.selectedVeh.V);
            }
            break;
          // 删除停留点
          case "3-3":
            const params = {
              groupId: props.selectedVeh.M,
              vehicleId: props.selectedVeh.V,
              staypoint: "",
            };
            const flag = await deleteStoppingPoint(params);
            if (flag == 1) {
              showAMsg("成功删除停留点!");
              nowMapRef.value.removeHomeAndCompany();
            }
            break;
          default:
            break;
        }
      }
    };
    provide("dialogFn", dialogFn); // 用于区域选项的弹窗的按钮事件
    // 当前地图ref
    const nowMapRef = inject("nowMapRef") as any;
    // 功能弹窗ref
    const OptionsMeneRef = computed(() => {
      if (!data.OptionsMene) return;
      return data.OptionsMene as any;
    });
    // 地图顶部工具栏事件
    async function toolBarFn(type: string, flag = false) {
      nextTick(async () => {
        data.toolBarType = type;
        switch (type) {
          case "卫星地图":
            data.Satellite = flag;
            break;
          case "路况图":
            data.Traffic = flag;
            break;
          case "聚合":
            break;
          case "围栏":
            data.slideBoxData = [];
            data.slideBoxType = type;
            setTimeout(async () => {
              if (data.slideBoxShow) {
                data.slideBoxData = await getArea();
                nowMapRef.value.drawAllFences(data.slideBoxData as any);
              } else {
                nowMapRef.value.clearAllFences();
              }
            }, 200);
            break;
          case "二押点":
            data.slideBoxData = [];
            data.slideBoxType = type;
            setTimeout(async () => {
              if (data.slideBoxShow) {
                data.slideBoxData = await GetTwoChargeByUserId();
                // nowMapRef.value.drawTwoChargePoints(data.slideBoxData as any);
              } else {
                nowMapRef.value.clearAllTwoChargePoints();
              }
            }, 200);
            break;
          case "区域查车":
            nowMapRef.value.drawRectangle("区域查车");
            debounce(() => {
              showAMsg("在地图上按住鼠标左键拖动绘制矩形。");
            }, 300);

            break;
          case "测距":
            nowMapRef.value.getDistance(true);
            debounce(() => {
              showAMsg("在地图上单击鼠标左键开始测距，双击结束测距。");
            }, 300);
            break;
          case "位置点":
            data.slideBoxData = [];
            data.slideBoxType = type;
            setTimeout(async () => {
              if (data.slideBoxShow) {
                data.slideBoxData = await SelectPointByUserId();
                nowMapRef.value.drawAllPoints(data.slideBoxData as any);
              } else {
                nowMapRef.value.clearAllPoints();
              }
            }, 200);
            break;
          case "Ocar出入库":
            data.OcarVisible = true;
            break;
          default:
            break;
        }
      });
    }
    // 轮询
    function cycle() {
      if (data.cycleTimer) {
        window.clearInterval(data.cycleTimer);
      }
      let second = 10;
      updateCycleCecond(second);
      data.cycleTimer = setInterval(() => {
        if (second == 0) {
          cycle();
          return;
        }
        second--;
        updateCycleCecond(second);
      }, 1000);
    }
    // 信息窗口功能弹窗显示/隐藏事件
    function popFn(event: any, item: any) {
      data.menuType = "";
      data.popType = item.label;
      switch (item.label) {
        case "设置":
          data.popoverList = [];
          break;
        case "关注":
          data.popoverList = data.attentionList as any;
          break;
        case "区域":
          data.menuType = "area";
          data.popoverList = [];
          break;
        case "OBD数据":
          OptionsMeneRef.value.popFn({ name: "OBD数据" });
          break;
        default:
          break;
      }
      if (["设置", "区域", "关注"].includes(item.label)) {
        data.popoverVisible = true;
        const { clientX, clientY } = event;
        data.popMouseEvent = { clientX, clientY };
      }
    }
    // 区域弹窗事件
    async function selectChange(val: any[]) {
      data.popoverVisible = false;
      data.DialogType = val[val.length - 1];
      data.fenceDialogVehInfo = { ...props.selectedVeh };
      switch (val[val.length - 1]) {
        // 多边形围栏查看
        case "1-1":
          data.areaDialogVisible = true;
          data.areaDialogTitle = "查看围栏";
          break;
        // 多边形围栏设置
        case "1-2":
          data.fenceDialogVisible = true;
          data.fenceType = "addFence";
          break;
        // 圆形围栏查看
        case "2-1":
          const params = {
            groupId: props.selectedVeh.M,
            vehicleId: props.selectedVeh.V,
          };
          const res: any = await GetVehicleCircle(params);
          // 画圆形围栏
          nowMapRef.value.drawCircle(
            props.selectedVeh.V,
            { lng: res.lon, lat: res.lat },
            res.radii
          );
          // 聚焦到围栏
          nowMapRef.value.setZoomAndCenter(16, { lng: res.lon, lat: res.lat });
          break;
        // 圆形围栏设置200米半径
        case "2-2":
          const cycleParams = {
            groupId: props.selectedVeh.M,
            vehicleId: props.selectedVeh.V,
            radii: 200,
            lat: props.selectedVeh.Y,
            lon: props.selectedVeh.X,
          };
          const cycleRes = await saveRoundFence(cycleParams);
          if (cycleRes == 1) {
            nowMapRef.value.deleteCircle(props.selectedVeh.V);
          }
          break;
        // 圆形围栏设置自定义半径
        case "2-3":
          data.areaDialogVisible = true;
          break;
        // 删除圆形围栏
        case "2-4":
          data.areaDialogVisible = true;
          break;
        // 停留点查看
        case "3-1":
          const stayPointRes = await GetVehicleStayPoint({
            groupId: props.selectedVeh.M,
            vehicleId: props.selectedVeh.V,
          });
          if (!stayPointRes) {
            showMsg("无停留点!");
            return;
          };
          const arr = stayPointRes.split(";");
          if (arr.length == 0) return;
          let home: any = {
            lng: null,
            lat: null,
            type: "home",
            address: "",
            name: props.selectedVeh.P,
          };
          let company: any = {
            lng: null,
            lat: null,
            type: "company",
            address: "",
            name: props.selectedVeh.P,
          };
          arr.map((item: any) => {
            if (item.split(",")[0] == "1") {
              home.lat = parseFloat(item.split(",")[1]);
              home.lng = parseFloat(item.split(",")[2]);
            } else if (item.split(",")[0] == "2") {
              company.lat = parseFloat(item.split(",")[1]);
              company.lng = parseFloat(item.split(",")[2]);
            }
          });
          nowMapRef.value.newMarker(
            [home, company],
            "homeAndCompany",
            true,
            true
          );
          break;
        // 停留点设置
        case "3-2":
          data.fenceDialogVisible = true;
          data.fenceType = "addStayPoint";
          break;
        // 停留点删除
        case "3-3":
          data.areaDialogVisible = true;
          break;
        // 绑定省市区
        case "4":
          data.popType = "设置";
          OptionsMeneRef.value.popFn({ name: "绑定省市区" });
          break;
        // 添加位置点
        case "5":
          data.fenceDialogVisible = true;
          data.fenceType = "addPoint";
          break;
        default:
          break;
      }
    }
    // 监听侧边栏状态，关闭后清除相关覆盖物
    watch(
      () => data.slideBoxShow,
      (val) => {
        nextTick(() => {
          if (!val) {
            nowMapRef.value && nowMapRef.value.clearAllPoints(); // 清除位置点
            nowMapRef.value && nowMapRef.value.clearAllFences(); // 清除围栏
            nowMapRef.value && nowMapRef.value.clearAllTwoChargePoints(); // 清除二押点
          }
        });
      }
    );
    // 用于ant ui 联级面板功能
    // watch(
    //   () => data.menuType,
    //   (val) => {
    //     if (val == "area") {
    //       setTimeout(() => {
    //         const dom = document.getElementById("test");
    //         const AntCascader = (dom as any).getElementsByClassName(
    //           "ant-cascader-picker"
    //         )[0];
    //         AntCascader.dispatchEvent(new MouseEvent("click"));
    //       }, 100);
    //     }
    //   }
    // );
    watch(
      () => data.popoverVisible,
      (val) => {
        if (!val) {
          data.menuType = "";
        }
      }
    );
    // 是否开启轮询
    watch(
      () => props.selectGroupId,
      (val) => {
        nextTick(() => {
          if (val && val.size > 0) {
            cycle();
          } else {
            window.clearInterval(data.cycleTimer);
          }
        });
      },
      {
        deep: true,
      }
    );
    nextTick(() => {
      labelDetailFn();
    });
    return {
      toolBarFn,
      selectChange,
      popFn,
      FenceOkFn,
      cycleCecond,
      ...toRefs(data),
      ...toRefs(props),
    };
  },
});
</script>
<style lang="less" scoped>
.Map {
  width: 100%;
  height: 100%;
}
::v-deep(.el-cascader-menu) {
  min-width: 120px !important;
}
::v-deep(.el-cascader-node) {
  padding: 0 20px;
}
::v-deep(.el-cascader-panel.is-bordered) {
  border-radius: 0 !important;
  font-size: 12px !important;
}
#test {
  width: 0;
  height: 0;
  margin-top: -50px;
  ::v-deep(.ant-input),
  ::v-deep(.ant-cascader-input) {
    border: none;
    width: 0;
    height: 0;
  }
}
</style>
<style lang="less">
.ant-cascader-menus {
  padding: 0 5px !important;
}
.cycleBox {
  position: absolute;
  z-index: 8;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  left: 10px;
  top: 65px;
  font-size: 12px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.26);
  p {
    width: 15px;
    text-align: right;
    padding-right: 3px;
    color: blue;
  }
  span {
    padding-right: 5px;
  }
}
#mapLabel_detail {
  background: #fff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.301);
  padding: 5px;
  font-size: 12px;
  color: #666;
  max-width: 300px;
  white-space: normal;
  word-break: break-all;
  line-height: 16px;
}
.TwoChargePoints__AmapLabel {
  max-width: 300px;
}
#infowindow {
  .el-cascader-menu__list {
    padding: 0 !important;
  }
  .el-cascader-menu {
    min-width: 100px !important;
  }
  .el-cascader-node {
    padding: 0 10px;
  }
  .el-cascader-menu__wrap {
    height: 170px;
  }
}
.test {
  position: absolute;
  z-index: 99999;
  background: #fff;
  top: 200px;
  left: 200px;
}
</style>