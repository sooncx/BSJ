<template>
  <Drag
    class="monitorCenter"
    v-model:dragResize="dragResize"
  >
    <template v-slot:left>
      <div class="left">
        <LeftContent
          v-model:selectedVeh="selectedVeh"
          v-model:selectedAllVehs="selectedAllVehs"
          v-model:selectGroupId="selectGroupId"
          v-model:SearchValue="SearchValue"
        />
      </div>
    </template>
    <template v-slot:right>
      <div
        class="right"
        id="DragRight"
      >
        <Map
          v-model:selectedVeh="selectedVeh"
          v-model:selectedAllVehs="selectedAllVehs"
          v-model:dragResize="dragResize"
          v-model:centerPoint="centerPoint"
          v-model:selectGroupId="selectGroupId"
        />
      </div>
    </template>
  </Drag>
</template>
<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  ref,
  reactive,
  toRefs,
  watch,
  provide,
  inject,
} from "vue";
import API from "@/api/vehGroup";
import { useStore } from "vuex";
export default defineComponent({
  name: "monitorCenter",
  components: {
    Drag: defineAsyncComponent(() => import("@/components/Drag/index.vue")),
    Map: defineAsyncComponent(() => import("./map/index.vue")),
    LeftContent: defineAsyncComponent(() => import("./LeftContent/index.vue")),
  },
  setup(props) {
    const store = useStore();
    const data = reactive({
      centerPoint: [114.410658, 33.113539],
      mapZoom: 10,
      selectGroupId: new Set(),
      dragResize: false,
      selectedVeh: null, // 当前选中车辆
      selectedAllVehs: new Map(), // 当前已选所有车辆
      SearchValue: null,
    });
    const updateVehGroupData = inject("updateVehGroupData") as Function;
    // 轮询秒数
    let cycleCecond = ref(10) as any;
    provide("cycleCecond", cycleCecond);
    const updateCycleCecond = (val: number) => {
      cycleCecond.value = val;
    };
    provide("updateCycleCecond", updateCycleCecond);

    // 地图类型
    let mapType_type = ref("Amap") as any;
    provide("mapType_type", mapType_type);
    const updateMapType = (val: number) => {
      mapType_type.value = val;
    };
    provide("updateMapType", updateMapType);

    // 聚合切换
    let Cluster = ref(true); // 聚合开关
    provide("Cluster", Cluster);
    const updateCluster = (val: boolean) => {
      Cluster.value = val;
    };
    provide("updateCluster", updateCluster);

    // 关联车辆数据
    let choseAssociatedVehs = ref(null) as any; // 选中关联车辆
    provide("choseAssociatedVehs", choseAssociatedVehs);
    const updateChoseAssociatedVehs = (val: any) => {
      choseAssociatedVehs.value = val;
    };
    provide("updateChoseAssociatedVehs", updateChoseAssociatedVehs);
    //---
    let associatedVehs = ref([]) as any; // 关联车辆
    provide("associatedVehs", associatedVehs);
    const updateAssociatedVehs = (val: any) => {
      associatedVehs.value = val;
    };
    provide("updateAssociatedVehs", updateAssociatedVehs);

    //----
    // 注意这里的data.selectedVeh和mapZoom不是响应式的，之所以会响应因为selectedVeh已经通过props方式传递
    // 此处的updateSelectedVeh只是为了方便在地图相关函数中修改data.selectedVeh的值，mapZoom只是用于跨多级组件传值
    provide("mapZoom", data.mapZoom);

    // 更新已选车辆
    const updateSelectedAllVehs = (val: any) => {
      data.selectedAllVehs = val;
    };
    provide("updateSelectedAllVehs", updateSelectedAllVehs);

    // 更新当前选中车辆
    const updateSelectedVeh = (val: any) => {
      data.selectedVeh = val;
    };
    provide("updateSelectedVeh", updateSelectedVeh);

    // 车辆列表刷新标识
    let vheResert = ref(false);
    provide("vheResert", vheResert);

    // 模拟模糊搜索车辆
    let chosedVeh = ref(null) as any;
    provide("chosedVeh", chosedVeh);
    const updateChosedVeh = (val: any) => {
      chosedVeh.value = val;
    };
    provide("updateChosedVeh", updateChosedVeh);

    // 地图实例
    let nowMapRef = ref(null) as any;
    provide("nowMapRef", nowMapRef);
    const updateNowMapRef = (val: any) => {
      nowMapRef.value = val;
    };
    provide("updateNowMapRef", updateNowMapRef);

    const OptionMenuDialogFn = async (type: string) => {
      switch (type) {
        case "刷新车辆列表":
          vheResert.value = !vheResert.value;
          break;
        case "刷新车组列表":
          updateVehGroupData();
          break;
        case "刷新车辆车组列表":
          updateVehGroupData();
          vheResert.value = !vheResert.value;
          break;
        default:
          break;
      }
    };
    provide("OptionMenuDialogFn", OptionMenuDialogFn); // 用于车辆设置弹窗弹窗的按钮事件
    // async function getVehGroupData() {
    //   try {
    //     const { obj } = await API.loadGroups({ concernNeed: true });
    //     store.commit("COMMIT_ALLGROUPLIST", obj.data);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    return {
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.left {
  height: 100%;
}
.right {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>