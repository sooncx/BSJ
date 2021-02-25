<template>
  <Drag
    class="monitorCenter"
    id="monitorCenter"
    v-model:dragResize="dragResize"
  >
    <template v-slot:left>
      <div class="left">
        <LeftContent
          v-model:selectedVeh="selectedVeh"
          v-model:selectedAllVehs="selectedAllVehs"
          v-model:selectGroupId="selectGroupId"
          v-model:SearchValue="SearchValue"
          @outPutVideo="outPutVideo"
        />
      </div>
    </template>
    <template v-slot:right>
      <div class="right">
        <Map
          v-if="!videoFlag"
          v-model:selectedVeh="selectedVeh"
          v-model:selectedAllVehs="selectedAllVehs"
          v-model:dragResize="dragResize"
          v-model:centerPoint="centerPoint"
          v-model:selectGroupId="selectGroupId"
        />
        <Drag
          v-else
          :halfWFlag="false"
          :minWidth="DragMinWidth"
          :defaultWidth="DragDefaultWidth"
          class="monitorCenter"
          v-model:dragResize="dragResize"
        >
          <template v-slot:upside>
            <ToolBar
              v-model:selectedVeh="selectedVeh"
              @toolBarFn="toolBarFn"
            />
          </template>
          <template v-slot:left>
            <div class="left">
              <Tachograph
                v-model:visible="tachographVisible"
                :vehInfo="tachographData"
              />
            </div>
          </template>
          <template v-slot:right>
            <div class="right">
              <Map
                ref="MapRef"
                v-model:selectedVeh="selectedVeh"
                v-model:selectedAllVehs="selectedAllVehs"
                v-model:dragResize="dragResize"
                v-model:centerPoint="centerPoint"
                v-model:selectGroupId="selectGroupId"
              />
            </div>
          </template>
        </Drag>
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
  computed,
} from "vue";
import API from "@/api/vehGroup";
import { useStore } from "vuex";
export default defineComponent({
  name: "monitorCenter",
  components: {
    Drag: defineAsyncComponent(() => import("@/components/Drag/index.vue")),
    Map: defineAsyncComponent(() => import("./map/index.vue")),
    LeftContent: defineAsyncComponent(() => import("./LeftContent/index.vue")),
    ToolBar: defineAsyncComponent(() => import("./map/ToolBar.vue")),
    Tachograph: defineAsyncComponent(
      () => import("@/components/Tachograph/index.vue")
    ),
  },
  setup(props) {
    const store = useStore();
    const data = reactive({
      centerPoint: [114.410658, 33.113539],
      mapZoom: 10,
      MapRef: ref<HTMLDivElement | null>(null),
      selectGroupId: new Set(),
      dragResize: false,
      selectedVeh: null, // 当前选中车辆
      selectedAllVehs: new Map(), // 当前已选所有车辆
      SearchValue: null,
    });
    // 功能弹窗ref
    const NowMapRef = computed(() => {
      if (!data.MapRef) return;
      return data.MapRef as any;
    });
    //
    const DragMinWidth = computed(() => {
      const dom = document.getElementsByClassName("drag__right")[0];
      if (dom) {
        return 400;
      }
    });
    const DragDefaultWidth = computed(() => {
      const dom = document.getElementsByClassName("drag__right")[0];
      if (dom) {
        return [dom.clientWidth * 0.7, "px"].join("");
      }
    });
    const updateVehGroupData = inject("updateVehGroupData") as Function;
    // 轮询秒数
    let cycleCecond = ref(10) as any;
    provide("cycleCecond", cycleCecond);
    const updateCycleCecond = (val: number) => {
      cycleCecond.value = val;
    };
    provide("updateCycleCecond", updateCycleCecond);

    // 行车记录仪
    let tachograph = ref(null) as any;
    provide("tachograph", tachograph);
    const updateTachograph = (val: object) => {
      tachograph.value = val;
      console.log(tachograph.value);
    };
    provide("updateTachograph", updateTachograph);

    // 视频显示
    const videoFlag = ref(false);
    provide("videoFlag", videoFlag);

    // 视频数量
    const videoNum = ref(1);
    provide("videoNum", videoNum);
    provide("updateVideoNum", (val: number) => {
      videoNum.value = val;
    });

    // 地图类型
    let mapType = ref("Bmap") as any;
    provide("mapType", mapType);
    const updateMapType = (val: string) => {
      mapType.value = val;
    };
    provide("updateMapType", updateMapType);

    // 地图侧边栏显示标识
    let slideBoxShow = ref(false) as any;
    provide("slideBoxShow", slideBoxShow);
    const updateSlideBoxShow = (val: boolean) => {
      slideBoxShow.value = val;
    };
    provide("updateSlideBoxShow", updateSlideBoxShow);

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
    async function toolBarFn(type: string, flag = false) {
      NowMapRef && NowMapRef.value.toolBarFn(type, flag);
    }
    const tachographVisible = ref(false);
    const tachographData = ref(null);
    function outPutVideo(val: { name: string; vehInfo: any }) {
      if (val.name === "行车记录仪") {
        tachographVisible.value = true;
        tachographData.value = val.vehInfo;
      }
    }
    watch(tachograph, (val: { name: string; vehInfo: any }) => {
      if (val.name === "行车记录仪") {
        tachographVisible.value = true;
        tachographData.value = val.vehInfo;
      }
    });
    return {
      ...toRefs(data),
      toolBarFn,
      videoFlag,
      outPutVideo,
      tachographVisible,
      tachographData,
      DragMinWidth,
      DragDefaultWidth,
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