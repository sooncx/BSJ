<template>
  <el-dialog
    v-model="show"
    width="900px"
    @opened="opened"
    @closed="closed"
  >
    <template #header>
      <div
        class="title"
        v-if="['addFence', 'bindCar', 'changeFence'].includes(showType)"
      >
        <p>围栏设置</p>
        <span>开始绘制后，单击绘点，双击结束绘制
        </span>
      </div>
      <div
        class="title"
        v-if="showType == 'addStayPoint'"
      >
        <p>经常停留点设置</p>
        <i
          class="iconfont icon-yiwen"
          @mouseenter="tipShow = true"
          @mouseleave="tipShow = false"
        ></i>
      </div>
    </template>
    <div
      class="fence"
      v-if="show"
    >
      <div class="left">
        <div class="searchInput">
          <el-input
            size="small"
            id='FenceAmapkeyword'
            v-model="something"
            placeholder="请输入所在地"
          />
        </div>
        <div class="mapBox">
          <div
            class="toolBox"
            :style="{height:(fenceType !='addStayPoint' && showType != 'bindCar')?'90px':'60px'}"
          >
            <!-- 位置点 -->
            <el-tooltip
              placement="left"
              effect="light"
              v-if="fenceType =='addPoint'"
            >
              <template #content>
                绘制位置点
              </template>
              <div @click="toolFn('绘制位置点')">
                <i class="iconfont icon-bianji"></i>
              </div>
            </el-tooltip>

            <!-- 二押点 -->
            <el-tooltip
              placement="left"
              effect="light"
              v-if="fenceType =='addTwoChargePoints'"
            >
              <template #content>
                绘制二押点
              </template>
              <div @click="toolFn('绘制二押点')">
                <i class="iconfont icon-bianji"></i>
              </div>
            </el-tooltip>

            <!-- 围栏 -->
            <el-tooltip
              placement="left"
              effect="light"
              v-if="(!['addStayPoint', 'addPoint', 'addTwoChargePoints'].includes(fenceType) && showType != 'bindCar')"
            >
              <template #content>
                绘制围栏
              </template>
              <div @click="toolFn('绘制围栏')">
                <i class="iconfont icon-huizhi"></i>
              </div>
            </el-tooltip>

            <el-tooltip
              placement="left"
              effect="light"
            >
              <template #content>
                测距
              </template>
              <div @click="toolFn('测距')">
                <i class="iconfont icon-chizi"></i>
              </div>
            </el-tooltip>
            
            <el-tooltip
              placement="left"
              effect="light"
            >
              <template #content>
                卫星图
              </template>
              <div @click="toolFn('卫星图')">
                <i
                  class="iconfont icon-weixingyuntu"
                  :class="satelliteBtn?'iconOn':''"
                ></i>
              </div>
            </el-tooltip>

          </div>
          <!-- 地图dom -->
          <div
            ref="FenceMapRef"
            style="height:100%;width:100%"
          ></div>
          <!--  -->
        </div>
      </div>
      <div class="right">
        <div v-if="['addFence','changeFence'].includes(showType)">
          <div class="item">
            <p>区域名称</p>
            <el-input
              placeholder="请输入区域名称"
              v-model="areaName"
              clearable
            >
            </el-input>
          </div>
          <div class="item">
            <p>区域类型</p>
            <el-select
              v-model="areaType"
              placeholder="请选择"
            >
              <el-option
                v-for="item in areaTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="item">
            <p>停留时间（分）</p>
            <el-input
              placeholder="请输入内容"
              v-model="stayTime"
              clearable
            >
            </el-input>
          </div>
          <div class="btn">
            <div
              @click="nextStep"
              v-if="['addFence'].includes(showType)"
            >下一步</div>
            <div
              @click="saveChange"
              v-if="['changeFence'].includes(showType)"
            >保存</div>
          </div>
        </div>
        <div v-if="showType == 'addStayPoint'">
          <div class="item">
            <p>家庭地址 <i
                class="iconfont icon-weizhi1 home_icon"
                @click="zoomPoint('home')"
              ></i></p>
            <el-input
              placeholder="请输入家庭地址"
              v-model="homeAddress"
              clearable
              id='FenceHome'
              type="textarea"
              resize="none"
              :rows="5"
            >
            </el-input>
          </div>
          <div class="item">
            <p>公司地址 <i
                class="iconfont icon-weizhi1 company_icon"
                @click="zoomPoint('company')"
              ></i></p>
            <el-input
              placeholder="请输入公司地址"
              v-model="companyAddress"
              clearable
              id='FenceCompany'
              type="textarea"
              resize="none"
              :rows="5"
            >
            </el-input>
          </div>
          <div class="btn">
            <div @click="enable">启用</div>
          </div>
        </div>
        <div v-if="showType == 'bindCar'">
          <div class="bindCar">
            <div class="bindCar__item">
              <p>区域名称:</p>
              <span>{{areaName}}</span>
            </div>
            <div class="bindCar__item">
              <p>区域类型:</p>
              <span>{{areaTypeFormat(areaType)}}</span>
            </div>
            <div class="inputSearch">
              <VehGroupSelect
                v-model:value="searchValue"
                :inputStyle="{width: '100%'}"
              />
            </div>
            <div class="selectList">
              <div
                v-for="(item, index) in [...choseData.values()]"
                :key="index"
                :style="{background:(item.flag === 0 &&choseItems.has(item.groupId)) || (item.flag === 1 && choseItems.has(item.vehicleId))?'rgb(246, 152, 152) !important':index%2==0?'#fff':'#e9e8e8'}"
                @click="choseItem(item)"
              >
                {{item.flag === 0?'车组-'+item.groupName:item.flag === 1?'车辆-'+item.plate:''}}
              </div>
            </div>
            <div class="tip">按车组绑定时不会自动包含下级车组</div>
            <div class="btns">
              <div
                class="clear"
                @click="clearAll"
              >清空</div>
              <div
                class="delete"
                @click="deleteSelect"
              >删除所选</div>
              <div
                class="save"
                @click="saveBind"
              >保存</div>
            </div>
          </div>
        </div>
        <div v-if="showType == 'addPoint'">
          <div class="item">
            <p>位置点名称</p>
            <el-input
              placeholder="请输入位置点名称"
              v-model="pointName"
              clearable
            >
            </el-input>
          </div>
          <div class="item">
            <p>位置点类型</p>
            <el-select
              v-model="pointType"
              placeholder="请选择"
            >
              <el-option
                v-for="item in pointTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="btn">
            <div @click="savePoint">保存</div>
          </div>
        </div>

        <div v-if="showType == 'addTwoChargePoints'">
          <div class="item">
            <p>二押点名称</p>
            <el-input
              placeholder="请输入二押点名称"
              v-model="TwoChargeName"
              clearable
            >
            </el-input>
          </div>
          <div class="item">
            <p>二押点的范围为(米):</p>
            <el-input
              placeholder="请输入二押点的范围"
              v-model="TwoChargeRadius"
              clearable
            >
            </el-input>
          </div>
          <div class="item">
            <p>停留时间：60分钟</p>
          </div>
          <div class="btn">
            <div @click="saveTwoChargPoint">添加</div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="popContent"
      v-if="tipShow"
    >
      <div>
        <p>用法:</p>
        <div>图上任选两点，作为家庭住址以及公司地址。</div>
      </div>
      <div>
        <p>逻辑:</p>
        <div>当车辆连续三天不经过您设置的两点(范围1000米),系统会自动推送车辆异常停留报警。</div>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  Ref,
  nextTick,
  watch,
  onMounted,
  computed,
} from "vue";
import { useAmap } from "../../views/monitorCenter/map/Amap";
import { VehGroupSelect } from "@/components/VehGroup/index";
import { message } from "ant-design-vue";
import GPS from "@/assets/js/GPS";
import { useFunction } from "../../views/monitorCenter/function";
import { GetGeo } from "@/api/apiFn";
import {
  AmapGetAddress,
  AmapGetOneAddress,
} from "../../views/monitorCenter/map/mapFn";
export default defineComponent({
  components: {
    VehGroupSelect,
  },
  props: {
    mapType: {
      type: String,
      default: "Amap",
    },
    fenceType: {
      type: String,
      default: "addFence",
    },
    title: {
      type: String,
      default: "围栏",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    vehInfo: {
      type: Object,
      default: null,
    },
    fenceData: {
      type: Object,
      default: null,
    },
    getStayPointDataBySelf: {
      type: Boolean,
      default: true,
    },
    // 停留点选项，停留点数据可以从外部传入也可以在内部获取（内部有根据vehid获取当前车辆的停留点函数）
    // 不传该值则默认从内部获取，外部传入数据用于设置某个停留点不显示等操作
    stayPointOption: {
      type: Object,
      default: () => {
        return {
          company: { lng: null, lat: null, address: "" } as any,
          home: { lng: null, lat: null, address: "" } as any,
        };
      },
    },
  },
  emits: ["enable", "update:visible", "setAddress", "FenceOkFn"],
  setup(props, { emit }) {
    const { mapType, fenceType } = toRefs(props);
    let showType = ref(fenceType.value);
    const FenceMapRef = ref<HTMLDivElement | null>(null);
    let AmapObj = null as any;
    const {
      AddPoint,
      showMsg,
      normalShowMsg,
      showAMsg,
      addPath,
      updatePath,
      getVehicleInfo,
      bindVehicleToPath,
      GetVehicleStayPoint,
      getAddress,
      saveStoppingPoint,
      deleteStoppingPoint,
      addTwoCharge,
    } = useFunction();
    const data = reactive({
      tipShow: false,
      satelliteBtn: false,
      searchValue: "" as any,
      choseData: new Map(),
      choseItems: new Set(),
      homeAddress: "" as any,
      companyAddress: "" as any,
      something: "",
      areaName: "",
      stayTime: "0",
      areaType: 1,
      pointName: "",
      pointType: "1",
      TwoChargeRadius: 50 as any,
      TwoChargeName: "",
      changeFenceData: null as any,
      newPathId: null,
      bindFenceData: null as any,
      stayPointsData: {
        company: { lng: null, lat: null, address: "" } as any,
        home: { lng: null, lat: null, address: "" } as any,
      },
      useVehInfo: true,
      clear() {
        data.tipShow = false;
        data.satelliteBtn = false;
        data.searchValue = "" as any;
        data.choseData = new Map();
        data.choseItems = new Set();
        data.homeAddress = "" as any;
        data.companyAddress = "" as any;
        data.something = "";
        data.areaName = "";
        data.stayTime = "0";
        data.areaType = 1;
        data.pointName = "";
        data.pointType = "1";
        data.changeFenceData = null;
        data.newPathId = null;
        data.bindFenceData = null;
        data.TwoChargeRadius = 50;
        data.TwoChargeName = "";
        data.stayPointsData = {
          company: { lng: null, lat: null, address: "" },
          home: { lng: null, lat: null, address: "" },
        };
        data.useVehInfo = true;
      },
      pointTypeOptions: [
        {
          value: "1",
          label: "写字楼",
        },
        {
          value: "2",
          label: "工厂",
        },
        {
          value: "3",
          label: "停车场",
        },
        {
          value: "4",
          label: "住宅",
        },
        {
          value: "5",
          label: "维修厂",
        },
        {
          value: "6",
          label: "租赁公司",
        },
      ],
      areaTypeOptions: [
        {
          value: 1,
          label: "禁止驶入区域",
        },
        {
          value: 0,
          label: "禁止驶出区域",
        },
        {
          value: 2,
          label: "蓝牙物流锁区域",
        },
        {
          value: 3,
          label: "限速区域",
        },
      ],
      areaTypeFormat(type: any) {
        switch (type.toString()) {
          case "0":
            return "禁止驶出区域";
            break;
          case "1":
            return "禁止驶入区域";
            break;
          case "2":
            return "蓝牙物流锁区域";
            break;
          case "3":
            return "限速区域";
            break;
          default:
            break;
        }
      },
      choseItem: function (item: any) {
        // 车组
        if (item.flag === 0) {
          if (data.choseItems.has(item.groupId)) {
            data.choseItems.delete(item.groupId);
          } else {
            data.choseItems.add(item.groupId);
          }
        }
        // 车辆
        else if (item.flag === 1) {
          if (data.choseItems.has(item.vehicleId)) {
            data.choseItems.delete(item.vehicleId);
          } else {
            data.choseItems.add(item.vehicleId);
          }
        }
      },
      clearAll() {
        data.choseData = new Map();
        data.choseItems = new Set();
      },
      deleteSelect() {
        [...data.choseItems].map((item: any) => {
          data.choseData.delete(item);
        });
        data.choseItems = new Set();
      },
      // 围栏绑车
      async saveBind() {
        let vids = [] as any;
        let gids = [] as any;
        [...data.choseData.values()].map((item: any) => {
          if (item.flag === 0) {
            gids.push(item.groupId);
          } else if (item.flag === 1) {
            vids.push(item.vehicleId);
          }
        });
        let params = {
          pathId: data.newPathId || props.fenceData.pathId,
        } as any;
        if (vids.length > 0) {
          params.vids = vids.join(",");
        }
        if (gids.length > 0) {
          params.gids = gids.join(",");
        }
        const res = await bindVehicleToPath(params);
        if (res == 1) {
          emit("FenceOkFn", "围栏绑车成功");
          emit("update:visible", false);
        }
      },
      // 保存位置点
      async savePoint() {
        if (!AmapObj.drawPointsObj.value && !data.useVehInfo) {
          showMsg("请先绘制位置点!");
          return;
        } else if (data.pointName == "") {
          showMsg("请输入位置点名称!");
          return;
        } else {
          let pointData = {
            name: data.pointName,
            type: data.pointType,
            lon: null,
            lat: null,
            color: 0,
          };
          if (data.useVehInfo) {
            const { lon, lat } = GPS.gcj_encrypt(
              props.vehInfo.Y,
              props.vehInfo.X
            ) as any;
            pointData.lon = lon;
            pointData.lat = lat;
          } else if (AmapObj.drawPointsObj.value) {
            pointData.lon = AmapObj.drawPointsObj.value[0].lng;
            pointData.lat = AmapObj.drawPointsObj.value[0].lat;
          }
          const res = (await AddPoint(pointData)) as any;
          if (res == 1) {
            showAMsg("添加位置点成功!");
            emit("FenceOkFn", "添加位置点成功", true);
            emit("update:visible", false);
          }
        }
      },
      async saveTwoChargPoint() {
        if (!AmapObj.drawPointsObj.value && !data.useVehInfo) {
          showMsg("请先绘制二押点!");
          return;
        } else if (data.TwoChargeName == "") {
          showMsg("请输入二押点名称!");
          return;
        } else if (data.TwoChargeRadius == "") {
          showMsg("请输入二押点的范围!");
          return;
        } else {
          let params = {
            name: data.TwoChargeName,
            radius: data.TwoChargeRadius,
            lon: null,
            lat: null,
            stopTime: 60,
          };
          if (data.useVehInfo) {
            const { lon, lat } = GPS.gcj_encrypt(
              props.vehInfo.Y,
              props.vehInfo.X
            ) as any;
            params.lon = lon;
            params.lat = lat;
          } else if (AmapObj.drawPointsObj.value) {
            params.lon = AmapObj.drawPointsObj.value[0].lng;
            params.lat = AmapObj.drawPointsObj.value[0].lat;
          }
          const res = await addTwoCharge(params);
          if (res == 1) {
            showAMsg("添加二押点成功!");
            emit("FenceOkFn", "添加二押点成功", true);
            emit("update:visible", false);
          }
        }
      },
      // 新建围栏和修改围栏下一步绑车操作
      async nextStep() {
        if (
          !AmapObj ||
          !AmapObj.pathObj.value ||
          AmapObj.pathObj.value.length === 0
        ) {
          message.warning("请先绘制围栏!");
          return;
        } else if (data.areaName === "" || data.stayTime === "") {
          message.warning("请输入区域名称和停留时间!");
          return;
        }
        let lnglatList = [] as any;
        AmapObj.pathObj.value.map((item: any) => {
          lnglatList.push({
            orilon: item[0],
            orilat: item[1],
          });
        });
        const areaData = {
          pathName: data.areaName,
          pathType: 3,
          param: data.areaType,
          settingTime: data.stayTime,
          pointList: lnglatList,
        };
        const res = await addPath(areaData);
        if (res && res.pathId) {
          emit("FenceOkFn", "添加围栏成功", true);
          data.newPathId = res.pathId;
          showMsg("添加围栏成功, 进行围栏绑车操作");
          getBindData();
          showType.value = "bindCar";
        }
      },
      // 保存围栏修改
      async saveChange() {
        if (
          !data.changeFenceData &&
          (!AmapObj ||
            !AmapObj.pathObj.value ||
            AmapObj.pathObj.value.length == 0)
        ) {
          message.warning("请先绘制围栏!");
          return;
        } else if (data.areaName === "" || data.stayTime === "") {
          message.warning("请输入区域名称和停留时间!");
          return;
        }
        const areaData = {
          pathId: props.fenceData.pathId,
          pathName: data.areaName,
          pathType: 3,
          param: data.areaType,
          settingTime: data.stayTime,
          pointList: null,
        };
        if (data.changeFenceData) {
          areaData.pointList = data.changeFenceData.pointList;
        } else if (AmapObj.pathObj.value.length > 2) {
          let lnglatList = [] as any;
          AmapObj.pathObj.value.map((item: any) => {
            lnglatList.push({
              orilon: item[0],
              orilat: item[1],
            });
          });
          areaData.pointList = lnglatList;
        }
        const res = await updatePath(areaData);
        if (res == 1) {
          emit("FenceOkFn", "修改围栏成功");
          showMsg("修改围栏成功, 进行围栏绑车操作");
          getBindData();
          showType.value = "bindCar";
        }
      },
      // 聚焦到选中停留点
      zoomPoint(type: string) {
        if (type == "home") {
          if (!data.stayPointsData.home.lat || !data.stayPointsData.home.lng) {
            return;
          }
          AmapObj.setZoomAndCenter(14, data.stayPointsData.home, false);
        } else {
          if (
            !data.stayPointsData.company.lat ||
            !data.stayPointsData.company.lng
          ) {
            return;
          }
          AmapObj.setZoomAndCenter(14, data.stayPointsData.company, false);
        }
      },
    });
    watch(
      () => props.visible,
      () => {
        data.clear();
        showType.value = fenceType.value;
      },
      {
        immediate: true,
      }
    );
    const show = computed({
      get: () => props.visible,
      set: (val) => {
        emit("update:visible", val);
      },
    });
    // 获取围栏绑车数据
    async function getBindData() {
      const pathId = data.newPathId || props.fenceData.pathId;
      const res = await getVehicleInfo(pathId);
      const { g, v } = res;
      if (g && g.length > 0) {
        g.map((item: any) => {
          data.choseData.set(item.groupId, { ...item, flag: 0 });
        });
      }
      if (v && v.length > 0) {
        v.map((item: any) => {
          data.choseData.set(item.vehicleId, { ...item, flag: 1 });
        });
      }
    }
    async function opened() {
      nextTick(async () => {
        if (props.vehInfo) {
          data.useVehInfo = true;
          AmapObj = useAmap(
            FenceMapRef as Ref<HTMLDivElement>,
            [props.vehInfo.X, props.vehInfo.Y],
            10
          );
        } else {
          data.useVehInfo = false;
          AmapObj = useAmap(FenceMapRef as Ref<HTMLDivElement>);
        }
        // 初始化地图
        AmapObj.initMap();
        // 显示车辆位置点
        props.vehInfo &&
          ["addFence", "addPoint"].includes(fenceType.value) &&
          AmapObj.newMarker([{ lng: props.vehInfo.X, lat: props.vehInfo.Y }]);
        // 显示家和公司位置点位置点
        if (showType.value == "addStayPoint") {
          showTwoPoints();
        }
        AmapObj.DistanceToolOpen(); //测距工具
        AmapObj.mouseToolOpen(); // 绘图工具
        let showMarker = ["addPoint", "addTwoChargePoints"].includes(
          showType.value
        )
          ? true
          : false;
        AmapObj.inputSearch("FenceAmapkeyword", showMarker);
        // 添加停留点，会在地图上绘制当前车辆位置点
        if (showType.value == "addStayPoint") {
          AmapObj.inputSearch("FenceHome", true, "home");
          AmapObj.inputSearch("FenceCompany", true, "company");
        }
        // 修改围栏，先在地图上绘制选中修改的围栏
        else if (["changeFence"].includes(showType.value)) {
          data.changeFenceData = props.fenceData;
          data.areaType = props.fenceData.param;
          data.areaName = props.fenceData.pathName;
          data.stayTime = props.fenceData.settingTime;
          nextTick(() => {
            AmapObj.drawAllFences([props.fenceData], true);
          });
        }
        // 围栏绑车
        else if (["bindCar"].includes(showType.value)) {
          data.bindFenceData = props.fenceData;
          data.areaType = props.fenceData.param;
          data.areaName = props.fenceData.pathName;
          data.stayTime = props.fenceData.settingTime;
          nextTick(() => {
            AmapObj.drawAllFences([props.fenceData], true);
            getBindData();
          });
        }
        watch(
          () => AmapObj.inputSearchObj,
          (val) => {
            enable(false);
          },
          {
            deep: true,
          }
        );
      });
    }
    // 根据当前车辆信息查询停留点数据并显示在地图上
    async function showTwoPoints() {
      if (props.getStayPointDataBySelf) {
        const stayPointRes = await GetVehicleStayPoint({
          groupId: props.vehInfo.M,
          vehicleId: props.vehInfo.V,
        });
        if (!stayPointRes) return;
        const arr = stayPointRes.split(";");
        // 若该车没有设置经常停留点
        if (arr.length == 0) {
          data.homeAddress = "";
          data.companyAddress = "";
          return;
        }
        arr.map((item: any) => {
          if (item.split(",")[0] == "1") {
            data.stayPointsData.home.lat = parseFloat(item.split(",")[1]);
            data.stayPointsData.home.lng = parseFloat(item.split(",")[2]);
          } else if (item.split(",")[0] == "2") {
            data.stayPointsData.company.lat = parseFloat(item.split(",")[1]);
            data.stayPointsData.company.lng = parseFloat(item.split(",")[2]);
          }
        });
      } else {
        data.stayPointsData = props.stayPointOption as any;
      }
      AmapObj.newMarker(
        [
          {
            ...data.stayPointsData.home,
            type: "home",
          },
          {
            ...data.stayPointsData.company,
            type: "company",
          },
        ],
        "homeAndCompany",
        false,
        true
      );
      // 从后台获取的停留点数据是wg84格式,需要纠偏后再显示在高德地图上
      AmapGetOneAddress(data.stayPointsData.home).then((res: any) => {
        data.homeAddress = res.address;
      });
      AmapGetOneAddress(data.stayPointsData.company).then((res: any) => {
        data.companyAddress = res.address;
      });
    }
    function closed() {
      showType.value = "addFence";
      emit("update:visible", false);
      AmapObj.clearMap();
      AmapObj = null;
      data.satelliteBtn = false;
      data.something = "";
      data.areaName = "";
      data.stayTime = "0";
      data.areaType = 1;
    }
    function toolFn(type: String) {
      switch (type) {
        case "绘制围栏":
          // 若重绘围栏，则情况围栏数据
          if (showType.value == "changeFence") {
            data.changeFenceData = null;
            AmapObj.clearAllFences();
          }
          AmapObj.drawRectangle("多边形围栏", "polygon");
          break;
        case "测距":
          AmapObj.getDistance(true);
          break;
        case "卫星图":
          data.satelliteBtn
            ? AmapObj.setSatellite(mapType.value, false)
            : AmapObj.setSatellite(mapType.value, true);
          data.satelliteBtn = !data.satelliteBtn;
          break;
        case "绘制位置点":
          AmapObj.clearMap();
          data.useVehInfo = false;
          AmapObj.drawClickMarker();
          break;
        case "绘制二押点":
          AmapObj.clearMap();
          data.useVehInfo = false;
          AmapObj.drawClickMarker();
          break;
        default:
          break;
      }
    }
    // 启用
    async function enable(doEmit = true) {
      let homeLocation = {
        lng: data.stayPointsData.home.lng,
        lat: data.stayPointsData.home.lat,
      };
      let companylocation = {
        lng: data.stayPointsData.company.lng,
        lat: data.stayPointsData.company.lat,
      };
      // 模糊搜索后获取选中位置的经纬度并根据经纬度获取地址
      if (AmapObj.inputSearchObj.value.has("FenceHome")) {
        if (AmapObj.inputSearchObj.value.get("FenceHome").poi.location) {
          const locationCopy = AmapObj.inputSearchObj.value.get("FenceHome").poi
            .location;
          // 模糊搜索返回的经纬度需要纠偏后(转换成wg84)再传给后台存储
          const changeHome: any = GPS.gcj_decrypt_exact(
            locationCopy.lat,
            locationCopy.lng
          );
          homeLocation = { lng: changeHome.lon, lat: changeHome.lat };
          let homeLocationAddress = {
            lng: locationCopy.lng,
            lat: locationCopy.lat,
          };
          // 用高德地图的方法获取地址
          AmapGetOneAddress(homeLocationAddress, false).then((res: any) => {
            data.homeAddress = res.address || "暂无位置数据";
          });
        }
      }
      if (AmapObj.inputSearchObj.value.has("FenceCompany")) {
        if (AmapObj.inputSearchObj.value.get("FenceCompany").poi.location) {
          const locationCopy = AmapObj.inputSearchObj.value.get("FenceCompany")
            .poi.location;
          // 模糊搜索返回的经纬度需要纠偏后(转换成wg84)再传给后台存储
          const changeCompany: any = GPS.gcj_decrypt_exact(
            locationCopy.lat,
            locationCopy.lng
          );
          companylocation = { lng: changeCompany.lon, lat: changeCompany.lat };
          let companylocationAddress = {
            lng: locationCopy.lng,
            lat: locationCopy.lat,
          };
          // 用高德地图的方法获取地址
          AmapGetOneAddress(companylocationAddress, false).then((res: any) => {
            data.companyAddress = res.address || "暂无位置数据";
          });
        }
      }
      data.stayPointsData = {
        company: {
          address: data.companyAddress,
          ...companylocation,
        },
        home: { address: data.homeAddress, ...homeLocation },
      };
      if (doEmit) {
        // 是否转换成wg84
        // const changeHome = GPS.gcj_decrypt_exact(
        //   data.stayPointsData.home.lat,
        //   data.stayPointsData.home.lng
        // );
        // data.stayPointsData.home.lat = changeHome.lat;
        // data.stayPointsData.home.lng = changeHome.lon;

        // const changeCompany = GPS.gcj_decrypt_exact(
        //   data.stayPointsData.company.lat,
        //   data.stayPointsData.company.lng
        // );
        // data.stayPointsData.company.lat = changeCompany.lat;
        // data.stayPointsData.company.lng = changeCompany.lon;
        let homeData = null;
        if (
          !data.stayPointsData.home ||
          ["null", null].includes(data.stayPointsData.home.lat) ||
          ["null", null].includes(data.stayPointsData.home.lng)
        ) {
          homeData = null;
        } else {
          homeData = [
            1,
            data.stayPointsData.home.lat,
            data.stayPointsData.home.lng,
            1000,
          ].join(",");
        }
        let companyData = null;
        if (
          !data.stayPointsData.company ||
          ["null", null].includes(data.stayPointsData.company.lat) ||
          ["null", null].includes(data.stayPointsData.company.lng)
        ) {
          companyData = null;
        } else {
          companyData = [
            2,
            data.stayPointsData.company.lat,
            data.stayPointsData.company.lng,
            1000,
          ].join(",");
        }
        const params = {
          groupId: props.vehInfo.M,
          vehicleId: props.vehInfo.V,
          staypoint:
            homeData && companyData
              ? [homeData, companyData].join(";")
              : homeData
              ? homeData
              : companyData
              ? companyData
              : "",
        };
        const res = await saveStoppingPoint(params);
        if (res == 1) {
          emit("enable", {
            path: AmapObj.pathObj.value,
          });
          emit("setAddress", data.stayPointsData);
          emit("update:visible", false);
        }
      }
    }
    nextTick(() => {
      watch(
        () => data.searchValue,
        (val) => {
          if (!val) return;
          if (val.flag === 1) {
            data.choseData.set(val.vehicleId, val);
          } else if (val.flag === 0) {
            data.choseData.set(val.groupId, val);
          }
        },
        {
          deep: true,
        }
      );
    });
    return {
      toolFn,
      FenceMapRef,
      opened,
      closed,
      showType,
      enable,
      show,
      ...toRefs(props),
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.title {
  height: 50px;
  width: 100%;
  padding: 0px 16px;
  display: flex;
  border-bottom: 1px solid #e4e7eb;
  align-items: center;
  p {
    font-size: 15px;
    font-family: PingFang SC, PingFang SC-Bold;
    font-weight: 700;
    color: #0e60db;
    padding-right: 12px;
  }
  span {
    font-size: 12px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    color: #999999;
  }
}
.fence {
  height: 60vh;
  width: 100%;
  min-height: 450px;
  display: flex;
  padding: 16px;
  .left {
    flex: 6.5;
    padding-right: 10px;
    display: flex;
    flex-direction: column;
    position: relative;
    .searchInput {
      z-index: 999;
      position: absolute;
      width: calc(100% - 10px);
      padding: 10px;
    }
    .mapBox {
      width: 100%;
      flex: 1;
      .toolBox {
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.26);
        position: absolute;
        right: 20px;
        bottom: 50px;
        z-index: 999;
        width: 30px;
        height: 90px;
        background: #fff;
        display: flex;
        flex-direction: column;
        div {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-bottom: 1px solid #d9e0e9;
          height: 30px;
          width: 100%;
          &:hover {
            color: blue;
          }
        }
        & > div:nth-child(3) {
          border-bottom: none !important;
        }
      }
    }
  }
  .right {
    flex: 3.5;
    padding-left: 10px;
    .item {
      padding: 10px 5px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      p {
        padding-bottom: 10px;
        // width: 170px;
        // overflow: hidden; /*超出部分隐藏*/
        // text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /*规定段落中的文本不进行换行 */
      }
    }
    .btn {
      position: absolute;
      bottom: 20px;
      right: 20px;
      & > div {
        width: 70px;
        height: 30px;
        background: #0e60db;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        cursor: pointer;
        &:hover {
          background: #2978f0;
        }
      }
    }
  }
}
.popContent {
  width: 280px;
  height: 130px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.493);
  position: absolute;
  z-index: 99999;
  left: 80px;
  top: 40px;
  & > div {
    font-size: 12px;
    font-family: PingFang SC, PingFang SC-Bold;
    font-weight: 700;
    color: #ffffff;
    line-height: 20px;
    p {
      color: #ffffff;
    }
    div {
      font-weight: 400;
    }
  }
}
.bindCar {
  &__item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-bottom: 15px;
    p {
      padding-right: 10px;
    }
    span {
      color: #0e60db;
    }
  }
  .inputSearch {
    width: 100%;
    margin-bottom: 15px;
  }
  .selectList {
    width: 100%;
    height: 30vh;
    min-height: 240px;
    border: 1px solid #d9e0e9;
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    & > div {
      cursor: pointer;
      padding: 10px 5px;
      margin-bottom: 1px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      &:hover {
        color: rgb(0, 119, 255);
      }
    }
  }
  .tip {
    font-size: 12px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    color: #999999;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
    position: absolute;
    bottom: 20px;
    right: 10px;
    div {
      margin-left: 10px;
      width: 70px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #d9e0e9;
      cursor: pointer;
      &:hover {
        background: rgb(241, 241, 241);
      }
    }
    .clear {
      background: #fff;
    }
    .delete {
      background: #fff;
    }
    .save {
      background: #0e60db;
      color: #fff;
      &:hover {
        background: #2978f0;
      }
    }
  }
}
::v-deep(.el-textarea__inner) {
  border-radius: 0;
}
::v-deep(.el-input__inner) {
  border-radius: 0;
  background: #fff;
}
::v-deep(.el-select) {
  width: 100%;
}
.iconOn {
  color: blue;
}
.icon-weizhi1 {
  cursor: pointer;
  &:hover {
    color: #ef8113;
  }
}
.home_icon {
  color: #1abf8d;
}
.company_icon {
  color: #37a1ef;
}
::v-deep(.el-popover.el-popper) {
  padding: 0 !important;
  max-width: 400px !important;
  width: auto !important;
  background: transparent;
}
::v-deep(.el-popper__arrow),
::v-deep(.el-popper__arrow::before) {
  width: 0 !important;
  height: 0 !important;
  content: "" !important;
  border: none !important;
}
</style>
<style lang="less">
.amap-sug-result {
  z-index: 999999 !important;
}
.tangram-suggestion-main {
  z-index: 999999 !important;
}
</style>