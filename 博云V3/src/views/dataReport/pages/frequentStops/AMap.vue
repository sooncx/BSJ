<template>
  <div ref="mapRef" class="mapBox"></div>
</template>
<script lang="ts">
import { defineComponent, ref, unref, nextTick, watchEffect } from "vue";
import AMap from "AMap"; // 引入高德地图
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

    let map: any = null;
    const initMap = () => {
      nextTick(() => {
        if (!unref(mapRef)) return;
        map = new AMap.Map(mapRef.value, {
          resizeEnable: true,
          center: [116.404, 39.915],
          zoom: 12,
        });

        createMarker();
      });
    };

    let marker: any = null;
    const createMarker = () => {
      const { lon, lat } = GPS.delta(props.curData?.aB, props.curData?.oB);
      marker = new AMap.Marker({
        map: map,
        position: new AMap.LngLat(lon, lat),
      });
    };

    watchEffect(() => {
      if (!props.mapType) {
        marker && map.setFitView(marker, true);
      }
    });

    initMap();

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
