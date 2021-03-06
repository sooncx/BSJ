<template>
  <div
    ref="mapRef"
    class="mapBox"
  ></div>
  <InfoWindow
    ref="InfoWindowRef"
    v-model:selectedVeh="selectedVeh"
    v-show="selectedVeh"
    @closeInfoWindow="closeInfoWindow"
    @infoWindowFn="infoWindowFn"
  />
  <Panorama
    v-model:visible="PanoramaShow"
    v-model:location="PanoramaData"
  />
</template>
<script lang="ts">
import {
  ref,
  Ref,
  defineComponent,
  nextTick,
  reactive,
  onActivated,
  watch,
  toRefs,
  computed,
  inject,
  defineAsyncComponent,
  onUnmounted,
  onUpdated,
} from "vue";
import { useBmap } from "./Bmap";
import { message } from "ant-design-vue";
import { TwoCoordinateAzimuth } from "@/assets/js/base";
import GPS from "@/assets/js/GPS";
export default defineComponent({
  components: {
    InfoWindow: defineAsyncComponent(() => import("./infoWindow.vue")),
    Panorama: defineAsyncComponent(() => import("./panorama.vue")),
  },
  props: {
    Satellite: {
      type: Boolean,
      default: false,
    },
    Traffic: {
      type: Boolean,
      default: false,
    },
    centerPoint: {
      type: Array,
      default: () => [],
    },
    mapZoom: {
      type: Number,
      default: 10,
    },
    selectedVeh: {
      type: Object,
      default: null,
    },
    selectedAllVehs: {
      type: Object,
      default: () => new Map(),
    },
  },
  emits: ["popFn"],
  setup(props, { emit }) {
    const mapRef = ref<HTMLDivElement | null>(null);
    const InfoWindowRef = ref<HTMLDivElement | null>(null);
    const vehsLimit = ref(1000);
    let Cluster = inject("Cluster") as boolean; // 聚合开关标识
    let updateCluster = inject("updateCluster") as Function; // 聚合标识修改函数
    let updateSelectedVeh = inject("updateSelectedVeh") as Function; // 修改选中车辆
    let choseAssociatedVehs = inject("choseAssociatedVehs") as any; // 选中关联车辆
    let updateNowMapRef = inject("updateNowMapRef") as Function; // 地图ref
    let associatedVehs = inject("associatedVehs") as any; // 关联车辆
    let mapType = inject("mapType") as any;
    let PanoramaShow = ref(false);
    let PanoramaData = ref({}) as any;
    let traceOpen = ref(false);
    let trackVehs = ref([]) as any;
    let {
      Satellite,
      Traffic,
      centerPoint,
      selectedVeh,
      selectedAllVehs,
    } = toRefs(props);
    let mapZoom = inject("mapZoom") as any;
    let res = null;
    res = useBmap(
      mapRef as Ref<HTMLDivElement>,
      centerPoint.value as any,
      mapZoom
    );
    updateNowMapRef(res);
    const {
      initMap,
      mapObj,
      clearMap,
      setCenterAndZoom,
      setMinZoom,
      setMaxZoom,
      setSatellite,
      SetTraffic,
      getDistance,
      drawRectangle,
      overlays,
      zoomMarker,
      DistanceToolOpen,
      mouseToolOpen,
      toggleCluster,
      showAllVehs,
      closeInfoWindow,
      ClusterChangeFlag,
      track,
      mapScroll,
      drawCircle,
      deleteCircle,
      drawAllPoints,
      clearAllPoints,
      zoomOverlay,
      drawAllFences,
      clearAllFences,
      setFenceZoom,
      removeHomeAndCompany,
      newMarker,
      drawTwoChargePoints,
      clearAllTwoChargePoints,
      setZoomAndCenter,
      dwawAssociateMarker,
    } = res;
    initMap(); // 初始化地图
    mapScroll(true); // 开启鼠标滚轮缩放
    DistanceToolOpen(); //测距工具
    mouseToolOpen(); // 绘图工具
    nextTick(() => {
      // 监听卫星图层切换
      watch(
        Satellite,
        (val) => {
          setSatellite(mapType.value, val);
        },
        {
          immediate: true,
        }
      );
      // 今天路况图层切换
      watch(
        Traffic,
        (val) => {
          SetTraffic(mapType.value, val);
        },
        {
          immediate: true,
        }
      );
      // 监听聚焦切换
      watch(
        Cluster as any,
        async (val) => {
          ClusterChangeFlag.value &&
            toggleCluster(
              selectedAllVehs.value,
              InfoWindowRef as Ref<HTMLDivElement>,
              vehsLimit.value
            );
        },
        {
          immediate: true,
        }
      );
      watch(
        choseAssociatedVehs,
        (val: any, old: any) => {
          if (!InfoWindowRef.value) return;
          setTimeout(() => {
            judgeIsZoomMarker(val, old) &&
              zoomMarker(
                val,
                InfoWindowRef as Ref<HTMLDivElement>,
                true // 是否聚焦和缩放到选中设备
              );
          }, 100);
        },
        {
          immediate: true,
        }
      );
      watch(
        associatedVehs,
        (val: any) => {
          if (!val || val.length == 0) {
            dwawAssociateMarker([]);
          } else {
            let arr = [] as any;
            val.map((item: any, index: number) => {
              if (index > 0) {
                arr.push(item);
              }
            });
            dwawAssociateMarker(arr);
          }
        },
        {
          immediate: true,
        }
      );
      watch(
        traceOpen,
        (val, old) => {
          if (!val) {
            trackTaggle(false, val);
            trackVehs.value = [];
          }
          if (!old && val) {
            trackVehs.value.push(props.selectedVeh);
          }
        },
        {
          immediate: true,
        }
      );

      // 监听当前选中车辆
      watch(
        selectedVeh,
        (val, old: any) => {
          // 切换车辆关闭追踪和街景
          if ((!val && old) || (val && old && val.V != old.V)) {
            PanoramaShow.value = false;
            traceOpen.value = false;
            removeHomeAndCompany();
          }
          if (val && old && val.V != old.V) {
            PanoramaShow.value = false;
          }
          setTimeout(() => {
            judgeIsZoomMarker(val, old) &&
              zoomMarker(
                val,
                InfoWindowRef as Ref<HTMLDivElement>,
                !traceOpen.value
              );
            // 开启追踪
            if (traceOpen.value) {
              trackVehs.value.push(val);
              trackTaggle(true, val);
            }
          }, 100);
        },
        {
          immediate: true,
          deep: true,
        }
      );
      // 监听当前已选所有车辆
      watch(
        selectedAllVehs,
        (val, old: any) => {
          // 若已选车辆为空，清除所有车辆圆形围栏
          if (!val || (val && val.size == 0)) {
            deleteCircle([], true);
          }
          // 若取消车辆，则清除取消车辆的圆形围栏
          else if (val && old && old.size > val.size) {
            deleteCircle([...val.keys()]);
          }
          showAllVehs(
            val,
            InfoWindowRef as Ref<HTMLDivElement>,
            vehsLimit.value
          );
        },
        {
          immediate: true,
          deep: true,
        }
      );
    });
    // 追踪切换
    function trackTaggle(isOpen: boolean, veh: any) {
      if (isOpen) {
        track(trackVehs.value, veh, true);
      } else {
        track([], veh, false);
        traceOpen.value = false;
      }
    }
    //判断是否跳转当前车辆
    function judgeIsZoomMarker(nowVal: any, curVal: any) {
      if (!nowVal) return false;
      if (mapType.value != "Bmap") return false;
      if (!curVal) return true;
      if (nowVal.isAssociate) {
        return true;
      } else if (nowVal.V === curVal.V) {
        return nowVal.Y === curVal.Y && nowVal.X === curVal.X ? false : true;
      } else {
        return true;
      }
    }
    function infoWindowFn(event: any, item: any) {
      const veh = props.selectedVeh;
      switch (item.label) {
        case "跟踪":
          traceOpen.value = item.open;
          break;
        case "街景":
          const res = GPS.gcj_encrypt(veh.Y, veh.X);
          const { lon, lat } = GPS.bd_encrypt(res.lat, res.lon);
          PanoramaData.value = { lng: lon, lat: lat };
          PanoramaShow.value = true;
          break;
        default:
          break;
      }
      emit("popFn", event, item);
    }
    onUnmounted(() => {
      traceOpen.value = false;
    });
    return {
      mapRef,
      mapObj,
      setSatellite,
      SetTraffic,
      getDistance,
      drawRectangle,
      InfoWindowRef,
      closeInfoWindow,
      infoWindowFn,
      PanoramaShow,
      PanoramaData,
      mapScroll,
      drawCircle,
      deleteCircle,
      drawAllPoints,
      clearAllPoints,
      zoomOverlay,
      drawAllFences,
      clearAllFences,
      setFenceZoom,
      removeHomeAndCompany,
      newMarker,
      drawTwoChargePoints,
      clearAllTwoChargePoints,
      setZoomAndCenter,
      ...toRefs(props),
    };
  },
});
</script>
<style lang="less" scoped>
.mapBox {
  width: 100%;
  height: 100%;
}
::v-deep(.Bmap-infowindow) {
  display: inline-flex;
  flex-direction: column;
  padding: 3px 10px;
  font-size: 10px;
  border: none;
  color: #333;
  box-shadow: 0 1px 5px 1px rgba(0, 0, 0, 0.294);
  &::before {
    content: "";
    position: absolute;
    display: block;
    transform: translate(-50%, -50%) rotate(-45deg);
    left: 50%;
    z-index: 9;
    width: 10px;
    height: 10px;
    bottom: -9px;
    background: #fff;
    z-index: 1;
    box-shadow: -2px 2px 2px rgba(0, 0, 0, 0.104);
  }
}
::v-deep(.BmapLabel) {
  font-size: 13px !important;
  font-weight: bold !important;
  padding: 0 !important;
}
::v-deep(.AllPoints__AmapLabel) {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 3px 8px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.349);
  p,
  a,
  span {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  span {
    padding: 0 4px;
  }
}
</style>