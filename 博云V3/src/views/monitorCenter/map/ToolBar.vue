<template>
  <div class="ToolBar" :class="{ showVideo: videoFlag }">
    <div class="ToolBar__content">
      <div class="left" :title="selectedVeh && address">
        {{ selectedVeh && address }}
      </div>
      <div class="right">
        <div class="right__button">
          <a-select
            v-model:value="defaultType"
            style="width: 100px"
            size="small"
          >
            <a-select-option v-for="item in type" :key="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </div>
        <div
          class="right__items"
          :style="{
            width: !videoFlag ? '350px' : switcFlag ? '390px' : '220px',
          }"
        >
          <template v-if="!videoFlag || switcFlag">
            <a-tooltip placement="bottom">
              <template #title>
                <span>{{ Satellite ? "卫星地图关" : "卫星地图开" }}</span>
              </template>
              <div class="iconBox" @click="toolBarFn('卫星地图')">
                <i
                  class="iconfont icon icon-weixingyuntu"
                  :style="{ color: Satellite ? 'blue' : '' }"
                ></i>
              </div>
            </a-tooltip>
            <a-tooltip placement="bottom">
              <template #title>
                <span>{{ Traffic ? "路况图关" : "路况图开" }}</span>
              </template>
              <div class="iconBox" @click="toolBarFn('路况图')">
                <i
                  class="iconfont icon icon-hongludeng"
                  :style="{ color: Traffic ? 'blue' : '' }"
                ></i>
              </div>
            </a-tooltip>
            <a-tooltip placement="bottom">
              <template #title>
                <span>{{ Cluster ? "聚合关" : "聚合开" }}</span>
              </template>
              <div class="iconBox" @click="toolBarFn('聚合')">
                <i
                  class="iconfont icon icon-juji"
                  :style="{ color: Cluster ? 'blue' : '' }"
                ></i>
              </div>
            </a-tooltip>
            <a-tooltip placement="bottom">
              <template #title>
                <span>区域查车</span>
              </template>
              <div class="iconBox" @click="toolBarFn('区域查车')">
                <i class="iconfont icon icon-quyuguanli"></i>
              </div>
            </a-tooltip>
            <a-tooltip placement="bottom">
              <template #title>
                <span>测距</span>
              </template>
              <div class="iconBox" @click="toolBarFn('测距')">
                <i class="iconfont icon icon-chizi"></i>
              </div>
            </a-tooltip>
            <a-tooltip placement="bottom">
              <template #title>
                <span>位置点</span>
              </template>
              <div class="iconBox" @click="toolBarFn('位置点')">
                <i
                  class="iconfont icon icon-weizhidian"
                  :style="{
                    color:
                      slideBoxType == '位置点' && slideBoxShow ? 'blue' : '',
                  }"
                ></i>
              </div>
            </a-tooltip>
            <a-tooltip placement="bottom">
              <template #title>
                <span>围栏</span>
              </template>
              <div class="iconBox" @click="toolBarFn('围栏')">
                <i
                  class="iconfont icon icon-langan"
                  :style="{
                    color: slideBoxType == '围栏' && slideBoxShow ? 'blue' : '',
                  }"
                ></i>
              </div>
            </a-tooltip>
            <a-tooltip placement="bottom">
              <template #title>
                <span>二押点</span>
              </template>
              <div class="iconBox" @click="toolBarFn('二押点')">
                <i
                  class="iconfont icon icon-weizhi"
                  :style="{
                    color:
                      slideBoxType == '二押点' && slideBoxShow ? 'blue' : '',
                  }"
                ></i>
              </div>
            </a-tooltip>
            <a-tooltip placement="bottom" v-if="hasOcar">
              <template #title>
                <span>Ocar出入库</span>
              </template>
              <div class="iconBox" @click="toolBarFn('Ocar出入库')">
                <i class="iconfont icon icon-churuku"></i>
              </div>
            </a-tooltip>
          </template>
          <template v-else>
            <a-tooltip placement="bottom">
              <template #title>
                <span>关闭直播</span>
              </template>
              <div class="iconBox" @click="toolBarFn('关闭直播')">
                <i class="iconfont icon icon-guanbichuangkou"></i>
              </div>
            </a-tooltip>
            <a-tooltip placement="bottom">
              <template #title>
                <span>一宫格</span>
              </template>
              <div class="iconBox" @click="toolBarFn('一宫格')">
                <i
                  class="iconfont icon icon-yigongge"
                  :style="{ color: videoNum === 1 ? 'blue' : '' }"
                ></i>
              </div>
            </a-tooltip>
            <a-tooltip placement="bottom">
              <template #title>
                <span>四宫格</span>
              </template>
              <div class="iconBox" @click="toolBarFn('四宫格')">
                <i
                  class="iconfont icon icon-sigongge"
                  :style="{ color: videoNum === 4 ? 'blue' : '' }"
                ></i>
              </div>
            </a-tooltip>
            <a-tooltip placement="bottom">
              <template #title>
                <span>六宫格</span>
              </template>
              <div class="iconBox" @click="toolBarFn('六宫格')">
                <i
                  class="iconfont icon icon-gongge2"
                  :style="{ color: videoNum === 6 ? 'blue' : '' }"
                ></i>
              </div>
            </a-tooltip>
            <a-tooltip placement="bottom">
              <template #title>
                <span>八宫格</span>
              </template>
              <div class="iconBox" @click="toolBarFn('八宫格')">
                <i
                  class="iconfont icon icon-gongge3"
                  :style="{ color: videoNum === 8 ? 'blue' : '' }"
                ></i>
              </div>
            </a-tooltip>
          </template>
          <a-tooltip placement="bottom" v-if="videoFlag">
            <template #title>
              <span>视频布局</span>
            </template>
            <div class="iconBox" @click="toolBarFn('视频布局')">
              <i class="iconfont icon icon-weibiaoti-"></i>
            </div>
          </a-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  watch,
  inject,
  computed,
  Ref,
} from "vue";
import { useFunction } from "../function";
import { useStore } from "vuex";
export default defineComponent({
  props: {
    selectedVeh: {
      type: Object,
      default: null,
    },
    // Cluster: {
    //   type: Boolean,
    //   default: true,
    // },
  },
  setup(props, { emit }) {
    const store = useStore();
    let slideBoxShow = inject("slideBoxShow") as any; // 围栏/位置点/二押点侧边栏visible
    let updateSlideBoxShow = inject("updateSlideBoxShow") as Function;
    const hasOcar = computed(() => {
      if (!store.state.vehTypes) {
        return false;
      }
      const res = store.state.vehTypes.filter((item: any) => {
        return item.typemap == "OCAR-3";
      });
      return res && res[0] && res[0].typemap == "OCAR-3" ? true : false;
    });
    const { getAddress } = useFunction();
    let mapType = inject("mapType") as any;
    let Cluster = inject("Cluster") as any;
    let updateMapType = inject("updateMapType") as Function;
    const updateCluster = inject("updateCluster") as any;
    const ToolData = reactive({
      type: ["百度地图", "高德地图"],
      defaultType: (mapType.value as any) == "Bmap" ? "百度地图" : "高德地图",
      Satellite: false,
      Traffic: false,
      slideBoxType: "",
      address: "",
      switcFlag: true,
    });
    let { Satellite, Traffic, slideBoxType } = toRefs(ToolData);
    watch(
      () => ToolData.defaultType,
      (newVal, oldVal) => {
        const type = newVal == "百度地图" ? "Bmap" : "Amap";
        updateMapType(type);
      }
    );
    watch(mapType, () => {
      setTimeout(() => {
        resert();
      }, 100);
    });
    watch(
      () => props.selectedVeh,
      async (val) => {
        if (!val) return;
        const res = await getAddress([
          {
            lat: val.Y,
            lng: val.X,
          },
        ]);
        if (res && res[0] && res[0].address) {
          ToolData.address = [val.P, res[0].address].join(" : ");
        } else {
          ToolData.address = [val.P, "暂无地址"].join(" : ");
        }
      },
      {
        immediate: true,
      }
    );
    function resert() {
      slideBoxType.value = "";
      updateSlideBoxShow(false);
    }
    function openSlideBox(type: string) {
      if (!slideBoxShow.value) {
        updateSlideBoxShow(true);
      } else if (slideBoxType.value == type) {
        updateSlideBoxShow(false);
      }
      slideBoxType.value = type;
    }

    const videoNum = <Ref<number>>inject("videoNum");
    const updateVideoNum = inject("updateVideoNum") as Function;
    const videoFlag = <Ref<boolean>>inject("videoFlag");
    function toolBarFn(type: string) {
      if (type == "卫星地图") {
        Satellite.value = !Satellite.value;
        emit("toolBarFn", type, Satellite.value);
      } else if (type == "路况图") {
        Traffic.value = !Traffic.value;
        emit("toolBarFn", type, Traffic.value);
      } else if (type == "聚合") {
        updateCluster(!Cluster.value);
      } else if (["围栏", "二押点", "位置点"].includes(type)) {
        openSlideBox(type);
        emit("toolBarFn", type);
      } else if (type === "视频布局") {
        ToolData.switcFlag = !ToolData.switcFlag;
      } else if (type === "关闭直播") {
        videoFlag.value = false;
      } else if (type === "一宫格") {
        updateVideoNum(1);
      } else if (type === "四宫格") {
        updateVideoNum(4);
      } else if (type === "六宫格") {
        updateVideoNum(6);
      } else if (type === "八宫格") {
        updateVideoNum(8);
      } else {
        emit("toolBarFn", type);
      }
    }

    return {
      toolBarFn,
      Cluster,
      hasOcar,
      videoFlag,
      videoNum,
      ...toRefs(props),
      ...toRefs(ToolData),
    };
  },
});
</script>
<style lang="less" scoped>
.ToolBar {
  position: absolute;
  top: 10px;
  z-index: 9;
  width: 100%;
  height: 46px;
  background: transparent;
  padding: 0 10px;

  &.showVideo {
    padding: 0;
    top: 0;
  }

  &__content {
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    background: #fff;
    box-shadow: 0 1px 10px 1px rgba(0, 0, 0, 0.129);
    .left {
      color: #999;
      line-height: 46px;
      padding: 0 10px;
      flex: 1;
      min-width: 150px;
      height: 100%;
      overflow: hidden; /*超出部分隐藏*/
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /*规定段落中的文本不进行换行 */
      font-size: 14px;
    }
    .right {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 500px;
      height: 100%;
      &__button {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        margin-right: 20px;
      }
      &__items {
        width: 350px;
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    }
  }
}
.iconBox {
  width: 27px;
  height: 27px;
  // box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.336);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1px;
  cursor: pointer;
  color: gray;
  &:hover {
    i {
      color: blue;
    }
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
  }
}
::v-deep(.ant-select-single:not(.ant-select-customize-input)
    .ant-select-selector) {
  border-radius: 20px;
  border-color: #bbc6d3;
}
::v-deep(.ant-select-focused:not(.ant-select-disabled).ant-select-single:not(.ant-select-customize-input)
    .ant-select-selector) {
  box-shadow: none;
  border-color: #bbc6d3;
}
</style>