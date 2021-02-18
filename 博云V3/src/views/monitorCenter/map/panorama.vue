<template>
  <div
    id="panorama"
    ref="panoramaRef"
  >
  </div>
  <div
    class="close"
    @click="close"
    v-if="visible"
  >
    <i class="iconfont icon-guanbi1"></i>
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, ref, toRefs, watch } from "vue";
import BMap from "BMap"; // 引入百度地图
export default defineComponent({
  props: {
    location: {
      type: Object,
      default: () => {
        return { lng: null, lat: null };
      },
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { visible, location } = toRefs(props) as any;
    const panoramaRef = ref<HTMLDivElement | null>(null) as any;
    let map = null as any;
    let panorama = null as any;
    function init() {
      nextTick(async () => {
        map = new BMap.Map("panorama");
        await map.centerAndZoom(
          new BMap.Point(location.value.lng, location.value.lat),
          12
        );
        panorama = new BMap.Panorama("panorama");
        await panorama.setPov({ heading: -40, pitch: 6 });
        //根据经纬度坐标展示全景图
        await panorama.setPosition(
          new BMap.Point(location.value.lng, location.value.lat)
        );
        const panoramaService = new BMap.PanoramaService();
        panoramaService.getPanoramaByLocation(
          new BMap.Point(location.value.lng, location.value.lat),
          (data: any) => {
            if (data == null) {
              map && map.clearOverlays && map.clearOverlays();
              map = null;
              (document.getElementById(
                "panorama"
              ) as any).innerHTML = `<div style="height: 100%;width: 100%; background: rgb(226, 226, 226);  display: flex;align-items: center;justify-content: center;">暂无街景</div>`;
              return;
            }
          }
        );
      });
    }
    watch(
      visible,
      (val) => {
        nextTick(async () => {
          if (val) {
            panoramaRef.value.style.width = `calc(30%)`;
            panoramaRef.value.style.minWidth = `400px`;
            panoramaRef.value.innerHTML = "";
            init();
          } else {
            panoramaRef.value.style.minWidth = 0;
            panoramaRef.value.style.width = 0;
            map && map.clearOverlays && map.clearOverlays();
            panorama = null;
            map = null;
          }
        });
      },
      {
        immediate: true,
      }
    );
    function close() {
      emit("update:visible", false);
    }
    return {
      close,
      panoramaRef,
      ...toRefs(props),
    };
  },
});
</script>
<style lang="less" scoped>
#panorama {
  position: absolute;
  right: 10px;
  bottom: 0;
  z-index: 999;
  width: 0;
  min-width: 0;
  height: calc(100% - 56px);
  transition: all 0.2s;
  background: #fff;
}
.close {
  position: absolute;
  right: 20px;
  top: 70px;
  height: 25px;
  width: 25px;
  border-radius: 50px;
  background: #fff;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background: #333;
    i {
      color: red;
    }
  }
  i {
    font-size: 12px;
    &:hover {
      color: red;
    }
  }
}
</style>