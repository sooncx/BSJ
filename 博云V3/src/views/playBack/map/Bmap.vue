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
import BMap from "BMap"; // 引入百度地图
import BMapLib from "BMapLib";
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
    let totalMaker: any[] = [];

    let map: any = null;
    const initMap = () => {
      nextTick(() => {
        if (!unref(mapRef)) return;
        map = new BMap.Map(mapRef.value, { enableMapClick: false });
        var point = new BMap.Point(116.404, 39.915); // 创建点坐标
        map.centerAndZoom(point, 12); // 初始化地图，设置中心点坐标和地图级别
        map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      });
    };

    initMap();

    // 移动到某个经纬度
    const panTo = (position: any) => {
      map.panTo(position);
    };

    const setFitView = (points?: any, margins: number[] = [0, 0, 0, 0]) => {
      map.setViewport(points ? points : totalMaker, {
        margins: margins,
      });
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
      map.clearOverlays();
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
      // console.log(type,arr)
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
      let markParams: any = {
        icon: new BMap.Icon(
          params.image,
          new BMap.Size(params.width, params.height)
        ),
        offset: new BMap.Size(params.offsetW, params.offsetH),
      };

      if (params.angle) {
        markParams.rotation = params.angle;
      }

      const delta = GPS.delta(params.lat, params.lon);
      const bdPoint = GPS.bd_encrypt(delta.lat, delta.lon);

      var newMarker = new BMap.Marker(
        new BMap.Point(bdPoint.lon, bdPoint.lat),
        markParams
      );

      if (params.label) {
        const label = new BMap.Label(params.label, {
          offset: new BMap.Size(-25, 32),
          position: new BMap.Point(bdPoint.lon, bdPoint.lat),
        });
        label.setStyle({
          "border-radius": "4px",
          "background-color": "white",
          padding: "5px 10px",
          "border-width": 0,
          "box-shadow": "0 2px 6px 0 rgba(236, 233, 233, .1)",
          "text-align": "center",
          color: "#666",
        });
        newMarker.setLabel(label);
      }
      map.addOverlay(newMarker);
      newMarker.addEventListener("mouseover", () => {
        updateinfowindowdata({
          data: infoWindowData,
          type: infoWindowData.infoWindowType || infoWindowData.type,
        });
        showInfowindow(newMarker);
      });
      totalMaker.push(newMarker.getPosition());
      return newMarker;
    };

    // 创建多边形围栏pc为多边形
    let PolygonList: any[] = [];
    const createPolygon = (pointList: any[]) => {
      let usePath: any[] = [];
      pointList.forEach((item: any) => {
        const delta = GPS.delta(item.oriLat, item.oriLon);
        const { lat, lon } = GPS.bd_encrypt(delta.lat, delta.lon);

        usePath.push(new BMap.Point(lon, lat));
      });

      const newPoly = new BMap.Polygon(usePath, {
        strokeColor: "#FF33FF",
        fillColor: "#1791fc",
        strokeWeight: 3,
        strokeOpacity: 0.2,
        fillOpacity: 0.3,
        zIndex: 50,
      });

      map.addOverlay(newPoly);
      PolygonList.push(newPoly);
      return newPoly;
    };

    // 创建圆形围栏
    const createCircle = (params: any) => {
      const delta = GPS.delta(params.lat, params.lon);
      const { lat, lon } = GPS.bd_encrypt(delta.lat, delta.lon);

      const newCircle = new BMap.Circle(
        new BMap.Point(lon, lat),
        params.radii,
        {
          strokeColor: "rgb(151, 149, 145)", // 线颜色
          fillColor: "rgb(151, 149, 145)", //填充颜色
          fillOpacity: 0.2, // 填充的透明度
          strokeOpacity: 0.2, // 线透明度
          strokeWeight: 4, // 线宽
          strokeStyle: "solid", // 线样式
        }
      );

      map.addOverlay(newCircle);
      return newCircle;
    };

    // 绘制轨迹
    let polyline: any = [];
    let polylineArr: any[] = [];
    let angleArr: any[] = [];
    const drawOriginLine = (pointList: any[]) => {
      map.removeOverlay(polyline);
      polyline = [];
      angleArr = [];

      const lineArr = pointList.map((item: any) => {
        const delta = GPS.delta(item.a, item.o);
        const { lat, lon } = GPS.bd_encrypt(delta.lat, delta.lon);
        angleArr.push(item.d);
        return new BMap.Point(lon, lat);
      });
      polyline = new BMap.Polyline(lineArr, {
        strokeColor: "#44AEFF",
        strokeOpacity: 1, // 线透明度
        strokeWeight: 4, // 线宽
        strokeStyle: "solid", // 线样式
      });

      map.addOverlay(polyline);
      totalMaker = totalMaker.concat(polyline.getPath());
      polylineArr = polyline.getPath();

      return polyline;
    };

    // 绘制移动后的线
    let passpolyline: any = [];
    const drawPassLine = async () => {
      map.removeOverlay(passpolyline);
      passpolyline = [];
      let arr: any[] = [];

      await polylineArr.forEach((item: any, index: number) => {
        index <= state.playIndex && arr.push(item);
      });

      passpolyline = new BMap.Polyline(arr, {
        strokeColor: "#1ECC46",
        strokeOpacity: 1, // 线透明度
        strokeWeight: 4, // 线宽
        strokeStyle: "solid", // 线样式
      });
      map.addOverlay(passpolyline);
    };

    // 创建移动车
    let carMarker: any = null;
    const drawCar = () => {
      carMarker && map.removeOverlay(carMarker);
      carMarker = null;
      carMarker = new BMap.Marker(polylineArr[state.playIndex], {
        icon: new BMap.Icon(
          require("@/assets/img/playback/car.png"),
          new BMap.Size(32, 35)
        ),
        rotation: angleArr[state.playIndex],
      });
      // 百度地图车辆超出可视区域自动跟随
      let doubleZoom = map.getZoom() / 2;
      let SouthWest = new BMap.Point(
        map.getBounds().getSouthWest().lng + 0.04 / doubleZoom,
        map.getBounds().getSouthWest().lat + 0.025 / doubleZoom
      );
      let NorthEast = new BMap.Point(
        map.getBounds().getNorthEast().lng - 0.04 / doubleZoom,
        map.getBounds().getNorthEast().lat - 0.025 / doubleZoom
      );
      let bound = new BMap.Bounds(SouthWest, NorthEast);
      if (!bound.containsPoint(polylineArr[state.playIndex])) {
        map.panTo(polylineArr[state.playIndex]);
      }
      map.addOverlay(carMarker);
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

    // 创建轨迹 点击marker
    let selectMarker: any = null;
    const createSelectMarker = (vehInfo: any) => {
      selectMarker && map.removeOverlay(selectMarker);
      selectMarker = new BMap.Marker(polylineArr[vehInfo.index - 1], {
        icon: new BMap.Icon(
          require("@/assets/img/playback/track_selectedMarkImg.png"),
          new BMap.Size(36, 36)
        ),
      });

      map.panTo(polylineArr[vehInfo.index - 1]);
      map.addOverlay(selectMarker);
      updateinfowindowdata({
        data: vehInfo,
        type: "trackPoint",
      });
      showInfowindow(selectMarker);
    };

    // 百度地图infowindow
    const InfoWindowRef = ref();
    let infoBox: any = null;
    // 关闭信息窗口
    function closeInfoWindow() {
      infoBox && infoBox.close && infoBox.close();
    }
    function showInfowindow(marker: any) {
      nextTick(async () => {
        infoBox && infoBox.close && infoBox.close();
        infoBox = null;
        if (!InfoWindowRef) await nextTick();
        infoBox = new BMapLib.InfoBox(map, InfoWindowRef.value.$el, {
          closeIconUrl: require("../../../assets/img/map/close.png"),
          offset: new BMap.Size(0, 20),
        });
        infoBox.open(marker);
        const imgDom: any = document
          .getElementsByClassName("infoBox")[0]
          .getElementsByTagName("img")[0];
        if (imgDom) {
          imgDom.style = "display: none";
        }
      });
    }

    // 测距工具
    let DistanceToolObject = null as any;
    function DistanceToolOpen() {
      nextTick(() => {
        DistanceToolObject = new BMapLib.DistanceTool(map, { lineStroke: 2 });
        DistanceToolObject.addEventListener("drawend", (e: any) => {});
      });
    }
    DistanceToolOpen();
    function getDistance(open = false) {
      if (open) {
        DistanceToolObject.open();
      } else {
        DistanceToolObject.close();
      }
    }

    // 轨迹回放控制
    const updatemapcontrol = <any>inject("UPDATE_MAPCONTROL");
    updatemapcontrol({
      play: doplay,
      pause: doPause,
      drawOriginLine,
      drawCar,
      drawPassLine,
      createSelectMarker,
      createMarker,
      showInfowindow,
      panTo,
      show,
      hide,
      createPolygon,
      createCircle,
      setFitView,
      getPoints,
      clearAll,
      getDistance
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
}
</style>