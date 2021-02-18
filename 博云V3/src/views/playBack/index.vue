<template>
  <div class="playback">
    <!-- 地图 -->
    <Map v-model:mapType="mapType" v-model:speed="speed" />
    <!-- 筛选 -->
    <Filter
      v-model:mapType="mapType"
      v-model:speed="speed"
      v-model:loading="loading"
    />
    <!-- 表格 -->
    <ContentBox v-model:mapType="mapType"></ContentBox>
    <!-- 地图控件 -->
    <MapToolbar />
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, provide, ref } from "vue";
import { Map, Filter, ContentBox, MapToolbar } from "./module";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "playback",
  components: {
    Map,
    Filter,
    ContentBox,
    MapToolbar,
  },
  setup() {
    document.title = '博云车联-轨迹回放';
    const route = useRoute();
    const mapData = reactive({
      mapType: route.query.mapType === "amap" ? "Amap" : "Bmap",
    });

    const loading = ref(false);
    const speed = ref(5);

    // 筛选参数
    const filter = ref(null);
    provide("filter", filter);
    provide("UPDATE_FILTER", (val: any) => {
      filter.value = val;
    });

    // 表格数据展开/收缩
    const tableExpand = ref(null);
    provide("tableExpand", tableExpand);
    provide("UPDATE_TABLEEXPAND", (val: any) => {
      tableExpand.value = val;
    });

    // 不定位数据详情展示
    const tableControl = ref(null);
    provide("tableControl", tableControl);
    provide("UPDATE_TABLECONTROL", (val: any) => {
      tableControl.value = val;
    });

    // 轨迹总数
    const playbackTotal = ref(0);
    provide("playbackTotal", playbackTotal);

    // 地图控制
    const mapControl = ref(null);
    provide("mapControl", mapControl);
    provide("UPDATE_MAPCONTROL", (val: any) => {
      mapControl.value = val;
    });

    // 弹窗体信息
    const infoWindowData = ref({
      type: "trackPoint",
      data: null,
    });
    provide("infoWindowData", infoWindowData);
    provide("UPDATE_INFOWINDOWDATA", (val: any) => {
      infoWindowData.value = val;
    });

    return {
      ...toRefs(mapData),
      loading,
      speed,
    };
  },
});
</script>
<style lang="less" scoped>
.playback {
  height: 100%;
  width: 100%;
}
</style>
