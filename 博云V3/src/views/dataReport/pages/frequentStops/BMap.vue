<template>
  <div ref="mapRef" class="mapBox"></div>
</template>
<script lang="ts">
import { defineComponent, ref, unref, nextTick, watchEffect } from "vue";
import BMap from "BMap"; // 引入百度地图
import GPS from "@/assets/js/GPS";

export default defineComponent({
  props: {
    /**
     * true 为百度  false为高德
     */
    mapType: {
      type: Boolean,
      default: true,
    },
    curData: {
      type: Object,
    },
  },
  setup(props) {
    const mapRef = ref<HTMLDivElement | null>(null);
    let timer: any = null; // 处理立即移动坐标乱飞的问题

    let map: any = null;
    const initMap = () => {
      nextTick(() => {
        if (!unref(mapRef)) return;
        map = new BMap.Map(mapRef.value, { enableMapClick: false });
        var point = new BMap.Point(116.404, 39.915); // 创建点坐标
        map.centerAndZoom(point, 12); // 初始化地图，设置中心点坐标和地图级别
        map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

        clearTimeout(timer);
        timer = setTimeout(() => {
          createMarker();
        }, 300);
      });
    };

    initMap();

    let marker: any = null;
    const createMarker = () => {
      marker && map.removeOverlay(marker);
      marker = null;

      const delta = GPS.delta(props.curData?.aB, props.curData?.oB);
      const { lon, lat } = GPS.bd_encrypt(delta.lat, delta.lon);

      marker = new BMap.Marker(new BMap.Point(lon, lat));

      map.addOverlay(marker);
      map.centerAndZoom(marker.getPosition(), 19);
    };

    watchEffect(() => {
      if (props.mapType) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          marker && map.centerAndZoom(marker.getPosition(), 19);
        }, 200);
      }
    });

    return {
      mapRef,
    };
  },
});
</script>
<style lang="less" scoped>
.mapBox {
  width: 100%;
  height: 500px;
}
</style>
