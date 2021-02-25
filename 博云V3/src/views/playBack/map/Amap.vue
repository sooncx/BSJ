<template>
  <div ref="mapRef" class="mapBox"></div>
  <InfoWindow ref="InfoWindowRef" @closeInfoWindow="closeInfoWindow" />
</template>
<script lang="ts">
import {
  defineComponent,
  nextTick,
  ref,
  Ref,
  unref,
  inject,
  PropType,
  defineAsyncComponent,
  onUnmounted,
} from "vue";
import AMap from "AMap"; // 引入高德地图
import GPS from "@/assets/js/GPS";
import { useStore } from "vuex";

export default defineComponent({
  components: {
    InfoWindow: defineAsyncComponent(() => import("./InfoWindow.vue")),
  },
  props: {
    speed: {
      type: Number as PropType<number>,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const { state, commit } = useStore();
    const updateinfowindowdata = <(val: { type: string; data: any }) => void>(
      inject("UPDATE_INFOWINDOWDATA")
    );

    const mapRef = ref<HTMLDivElement | null>(null);
    let overlays: any[] = [];

    let map: any = null;
    const initMap = () => {
      nextTick(() => {
        if (!unref(mapRef)) return;
        map = new AMap.Map(mapRef.value, {
          resizeEnable: true,
          center: [116.404, 39.915],
          zoom: 12,
        });
      });
    };

    initMap();

    const setFitView = (points?: any, margins: number[] = [0, 0, 0, 0]) => {
      if (points) {
        map.setFitView(points, true, [
          margins[0],
          margins[2],
          margins[3],
          margins[1],
        ]);
      } else {
        map.setFitView(overlays, true, [
          margins[0],
          margins[2],
          margins[3],
          margins[1],
        ]);
      }
    };

    // 移动到某个经纬度
    const panTo = (position: any) => {
      map.panTo(position, 0);
    };

    // 显示覆盖物
    const show = (marker: any) => {
      marker && marker.show();
    };

    // 隐藏覆盖物
    const hide = (marker: any) => {
      marker && marker.hide();
    };

    // 清除覆盖物
    const clearAll = () => {
      map.clearMap();
      carMarker = null;
    };

    const getPoints = (mark: any, type: string) => {
      let points = [];
      switch (type) {
        case "marker":
          points = mark.getPosition();
          break;
        case "polyline":
          points = mark.getPath();
          break;
        case "polygon":
          console.log("type:", type, "Position", mark.getPath());
          points = mark.getPath();
          break;
        case "circle":
          console.log("type:", type, "Position", mark.getCenter());
          points.push(mark.getCenter());
          break;
        case "label":
          console.log("type:", type, "Position", mark.getPosition());
          points.push(mark.getPosition());
          break;

        default:
          break;
      }
      return points;
    };

    // 创建覆盖物
    const createMarker = (
      params: {
        image: string;
        width: number;
        height: number;
        offsetW: number;
        offsetH: number;
        angle?: number;
        lat: number;
        lon: number;
        label?: string;
      },
      infoWindowData: any
    ) => {
      const { lat, lon } = GPS.delta(params.lat, params.lon);

      const markParams: any = {
        map: map,
        icon: new AMap.Icon({
          size: new AMap.Size(params.width, params.height),
          image: params.image,
          imageSize: new AMap.Size(params.width, params.height),
        }),
        position: new AMap.LngLat(lon, lat),
        offset: new AMap.Pixel(params.offsetW, params.offsetH),
      };

      if (params.angle) {
        markParams.angle = params.angle;
      }

      if (params.label) {
        markParams.label = {
          content: '<div class="bsj-map-label">' + params.label + "</div>",
          contentStr: params.label,
          offset: new AMap.Pixel(0, 32),
          direction: "center",
        };
      }

      const newMarker = new AMap.Marker(markParams);
      overlays.push(newMarker);

      newMarker.on("mouseover", () => {
        updateinfowindowdata({
          data: infoWindowData,
          type: infoWindowData.infoWindowType || infoWindowData.type,
        });
        showInfowindow(newMarker);
      });

      return newMarker;
    };

    // 创建多边形围栏pc为多边形
    const createPolygon = (pointList: any[]) => {
      let usePath: any[] = [];
      pointList.forEach((item: any) => {
        const { lat, lon } = GPS.delta(item.oriLat, item.oriLon);

        usePath.push(new AMap.LngLat(lon, lat));
      });

      const newPoly = new AMap.Polygon({
        map: map,
        path: usePath,
        strokeColor: "#FF33FF",
        fillColor: "#1791fc",
        strokeWeight: 3,
        strokeOpacity: 0.2,
        fillOpacity: 0.3,
        zIndex: 50,
      });
      return newPoly;
    };

    // 创建圆形围栏
    const createCircle = (params: any) => {
      const { lat, lon } = GPS.delta(params.lat, params.lon);
      const newCircle = new AMap.Circle({
        center: new AMap.LngLat(lon, lat),
        radius: params.radii,
        strokeColor: "rgb(151, 149, 145)", // 线颜色
        fillColor: "rgb(151, 149, 145)", //填充颜色
        fillOpacity: 0.2, // 填充的透明度
        strokeOpacity: 0.2, // 线透明度
        strokeWeight: 4, // 线宽
        strokeStyle: "solid", // 线样式
      });
      map.add(newCircle);

      return newCircle;
    };

    // 绘制轨迹
    let polyline: any = [];
    let polylineArr: any[] = [];
    let angleArr: any[] = [];
    const drawOriginLine = (pointList: any[]) => {
      map.remove(polyline);
      polyline = [];
      angleArr = [];

      const lineArr = pointList.map((item: any) => {
        const { lat, lon } = GPS.delta(item.a, item.o);
        angleArr.push(item.d);
        return new AMap.LngLat(lon, lat);
      });

      polyline = new AMap.Polyline({
        map: map,
        path: lineArr,
        strokeColor: "#44AEFF", //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 4, //线宽
        strokeStyle: "solid", //线样式
      });

      overlays.push(polyline);
      polylineArr = polyline.getPath();

      return polyline;
    };

    // 绘制移动后的线
    let passpolyline: any = null;
    const drawPassLine = async () => {
      let arr: any[] = [];

      await polylineArr.forEach((item: any, index: number) => {
        index <= state.playIndex && arr.push(item);
      });

      if (passpolyline) {
        passpolyline.setPath(arr);
      } else {
        passpolyline = new AMap.Polyline({
          map: map,
          path: arr,
          strokeColor: "#1ECC46",
          strokeOpacity: 1, // 线透明度
          strokeWeight: 4, // 线宽
          strokeStyle: "solid", // 线样式
        });
      }
    };

    // 创建移动车
    let carMarker: any = null;
    const drawCar = () => {
      if (carMarker) {
        carMarker.setPosition(polylineArr[state.playIndex]);
        carMarker.setAngle(angleArr[state.playIndex]);
      } else {
        carMarker = new AMap.Marker({
          map: map,
          position: polylineArr[state.playIndex],
          angle: angleArr[state.playIndex],
          icon: new AMap.Icon({
            size: new AMap.Size(32, 35),
            image: require("@/assets/img/playback/car.png"),
            imageSize: new AMap.Size(32, 35),
          }),
          offset: new AMap.Pixel(-16, -13),
        });
      }

      // 高德地图车辆超出可视区域自动跟随
      const doubleZoom = map.getZoom() / 2;
      let Bounds = map.getBounds(); // 地图可视区域
      let SouthWest = Bounds.getSouthWest();
      let NorthEast = Bounds.getNorthEast();
      SouthWest = new AMap.LngLat(
        SouthWest.getLng() + 0.04 / doubleZoom,
        SouthWest.getLat() + 0.025 / doubleZoom
      );
      NorthEast = new AMap.LngLat(
        NorthEast.getLng() + 0.04 / doubleZoom,
        NorthEast.getLat() + 0.025 / doubleZoom
      );
      Bounds = new AMap.Bounds(SouthWest, NorthEast);
      if (!Bounds.contains(polylineArr[state.playIndex])) {
        map.panTo(polylineArr[state.playIndex]);
      }
    };

    // 轨迹回放开始
    let animationTimer: any = null;
    const doplay = () => {
      if (state.playIndex < polylineArr.length) {
        animationTimer && clearTimeout(animationTimer);
        drawPassLine();
        drawCar();

        animationTimer = setTimeout(() => {
          state.playIndex++;
          commit("COMMIT_PLAYINDEX", state.playIndex);
          doplay();
        }, 570 / props.speed);
      } else if (state.playIndex >= polylineArr.length) {
        doPause();
      }
    };

    // 轨迹回放暂停
    const doPause = () => {
      animationTimer && clearTimeout(animationTimer);
    };

    onUnmounted(() => {
      clearTimeout(animationTimer);
    });

    // 高德地图infowindow
    const InfoWindowRef = ref();
    let infoWindow: any = null;
    // 关闭信息窗口
    function closeInfoWindow() {
      infoWindow && infoWindow.close && infoWindow.close();
    }
    const showInfowindow = (marker: any) => {
      nextTick(async () => {
        infoWindow && infoWindow.close && infoWindow.close();
        infoWindow = null;
        if (!InfoWindowRef) await nextTick();
        infoWindow = new AMap.InfoWindow({
          isCustom: true,
          autoMove: false,
          content: InfoWindowRef.value.$el,
          offset: new AMap.Pixel(0, -30),
        });
        infoWindow.open(map, getPoints(marker, "marker"));
      });
    };

    // 测距工具
    let DistanceToolObject = null as any;
    function DistanceToolOpen() {
      nextTick(() => {
        DistanceToolObject = new AMap.RangingTool(map);
        DistanceToolObject.on("end", function () {
          DistanceToolObject.turnOff();
        });
      });
    }
    DistanceToolOpen();
    function getDistance(open = false) {
      DistanceToolObject && map && map.remove(DistanceToolObject);
      if (open) {
        DistanceToolObject.turnOn();
      } else {
        DistanceToolObject.turnOff();
      }
    }

    // 轨迹回放控制
    const updatemapcontrol = <any>inject("UPDATE_MAPCONTROL");
    updatemapcontrol({
      play: doplay,
      pause: doPause,
      drawOriginLine,
      setFitView,
      createMarker,
      createPolygon,
      createCircle,
      getPoints,
      panTo,
      show,
      hide,
      showInfowindow,
      drawCar,
      drawPassLine,
      clearAll,
      getDistance,
    });

    return {
      mapRef,
      InfoWindowRef,
      closeInfoWindow,
    };
  },
});
</script>
<style lang="less" scoped>
.mapBox {
  width: 100%;
  height: 100%;

  ::v-deep(.amap-marker-label) {
    border-radius: 4px;
    background-color: white;
    padding: 5px 10px;
    border-width: 0;
    box-shadow: 0 2px 6px 0 rgba(236, 233, 233, 0.1);
    text-align: center;
    color: #666;
  }
}
</style>
