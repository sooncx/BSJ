<template>
  <div
    class="DragBox"
    ref="DragBox"
  >
    <div
      class="DragBox__bar"
      @mousedown.left="handleMousedown"
      @dblclick.stop="expand(3)"
    >
      <div class="left">
        <span>总:{{vehCounts.totalNum}}</span>
        <span>在线:{{vehCounts.onlineNum}}</span>
        <span>离线:{{vehCounts.offlineNum}}</span>
      </div>
      <div
        class="right"
        @mousedown.stop
      >
        <i
          class="iconfont icon-shezhi1"
          @click.stop="showOptionFn"
        ></i>
        <i
          @click.stop="expand"
          class="iconfont icon-up"
        ></i>
        <i
          @click.stop="shrink"
          class="iconfont icon-up"
          style="transform: rotate(180deg)"
        ></i>
      </div>
    </div>
    <div class="DragBox__content">
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
import { set } from "lodash";
import {
  computed,
  defineComponent,
  nextTick,
  onUnmounted,
  reactive,
  ref,
  toRefs,
  watch,
} from "vue";
import { debounce } from "../../../assets/js/base";
import { useFunction } from "../function";
import router from "@/router";
export default defineComponent({
  props: {
    // maxHeight: {
    //   type: Number,
    //   default: 400,
    // },
    // secondHeight: {
    //   type: Number,
    //   default: document.body.clientHeight / 2,
    // },
    // maxWidth: {
    //   type: Number,
    //   default: document.body.clientWidth - 325,
    // },
    // secondWidth: {
    //   type: Number,
    //   default: document.body.clientWidth / 2,
    // },
    // minHeight: {
    //   type: Number,
    //   default: 40,
    // },
    // minWidth: {
    //   type: Number,
    //   default: 400,
    // },
    defaultHeigth: {
      type: Number,
      default: 40,
    },
    defaultWidth: {
      type: Number,
      default: 400,
    },
    dragResize: {
      type: Boolean,
      default: false,
    },
    tableResize: {
      type: Boolean,
      default: false,
    },
    showOptions: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { getUserVehicleCount } = useFunction();
    const data = reactive({
      vehCounts: {
        offlineNum: 0,
        onlineNum: 0,
        totalNum: 0,
      },
    });
    const DragBox = ref<HTMLDivElement | null>(null) as any;
    let isDrag = ref(false);
    let initY = ref(0);
    let initX = ref(0);
    let upsideH = ref(0);
    let upsideW = ref(0);
    let expanded = ref(1);
    let H = ref(0);
    let W = ref(0);
    const { defaultHeigth, defaultWidth, dragResize } = toRefs(props);
    nextTick(() => {
      data.vehCounts = {
        offlineNum: 0,
        onlineNum: 0,
        totalNum: 0,
      };
      H.value = document.body.clientHeight - 125;
      W.value = document.body.clientWidth - 325;
      DragBox.value.style.width = defaultWidth.value + "px";
      DragBox.value.style.height = defaultHeigth.value + "px";
      if (DragBox.value.clientHeight > document.body.clientHeight - 150) {
        DragBox.value.style.height = document.body.clientHeight - 150 + "px";
      }
      DragBox.value.style.height = defaultHeigth.value + "px";
      window.onresize = () => {
        if (router.currentRoute.value.name != "monitorCenter") return;
        debounce(() => {
          H = computed(() => {
            return document.body.clientHeight - 125;
          });
          W = computed(() => {
            return document.getElementsByClassName("ToolBar__content")[0]
              .clientWidth;
          });
          if (DragBox.value.clientHeight >= H.value) {
            DragBox.value.style.height = H.value + "px";
          }
          if (DragBox.value.clientWidth >= W.value) {
            DragBox.value.style.width = W.value + "px";
          }
        }, 10);
      };
      watch(dragResize, (val) => {
        setTimeout(() => {
          W = computed(() => {
            return document.getElementsByClassName("ToolBar__content")[0]
              .clientWidth;
          });
          if (DragBox.value.clientWidth >= W.value) {
            DragBox.value.style.width = W.value + "px";
          }
        }, 100);
      });
      getVehicleCount();
    });
    async function getVehicleCount() {
      const res = await getUserVehicleCount();
      if (!res || !res.data) return;
      data.vehCounts = {
        offlineNum: res.data.offlineNum || 0,
        onlineNum: res.data.onlineNum || 0,
        totalNum: res.data.totalNum || 0,
      };
    }
    function clearEventListener() {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMousemove);
    }
    function handleMouseUp(e: any) {
      emit("update:tableResize", !props.tableResize);
      if (e.button !== 0) return;
      setTimeout(() => {
        clearEventListener();
        isDrag.value = false;
      }, 0);
      setTimeout(() => {
        let dom = document.getElementsByClassName("mapBox")[0] as any;
        let DragBoxDom = document.getElementsByClassName("DragBox")[0] as any;
        dom.classList.remove("notuserSelect");
        DragBoxDom.classList.remove("notuserSelect");
      }, 2000);
    }
    function handleMousemove(e: any) {
      let dom = document.getElementsByClassName("mapBox")[0] as any;
      let DragBoxDom = document.getElementsByClassName("DragBox")[0] as any;
      dom.classList.add("notuserSelect");
      DragBoxDom.classList.add("notuserSelect");
      DragBox.value.style.transition = "none";
      let changeH = upsideH.value + (initY.value - e.clientY);
      let changeW = upsideW.value + (initX.value - e.clientX);
      setTimeout(() => {
        //小于最小高度则设为最小高度
        changeH <= defaultHeigth.value && (changeH = defaultHeigth.value);
        //大于最大高度则设为最大高度
        changeH >= H.value && (changeH = H.value);
        // 小于最小宽度度则设为最小宽度
        changeW <= defaultWidth.value && (changeW = defaultWidth.value);
        // 大于最大宽度则设为最大宽度
        changeW >= W.value && (changeW = W.value);
        emitOnChange(changeH, changeW);
      }, 0);
    }
    function handleMousedown(e: any) {
      isDrag.value = true;
      initY.value = e.clientY;
      initX.value = e.clientX;
      upsideH.value = DragBox.value.offsetHeight;
      upsideW.value = DragBox.value.offsetWidth;
      clearEventListener();
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mousemove", handleMousemove);
    }
    function emitOnChange(changeH: number, changeW: number) {
      DragBox.value.style.height = parseInt(changeH as any) + "px";
      DragBox.value.style.width = parseInt(changeW as any) + "px";
    }
    function showOptionFn() {
      emit("update:showOptions", !props.showOptions);
      if (DragBox.value.clientHeight == 40) {
        emit("update:showOptions", true);
        expand();
      }
    }
    function expand(type = -1) {
      emit("update:tableResize", !props.tableResize);
      DragBox.value.style.transition = "all 0.5s";
      const DragBarH = DragBox.value.style.height.split("px")[0];
      const DragBarW = DragBox.value.style.width.split("px")[0];
      const MaxH = Math.floor(H.value);
      const MaxW = Math.floor(W.value);
      if (type == 3) {
        emitOnChange(H.value, W.value);
        expanded.value = 3;
        return;
      }
      // 高度大于2/3或宽度大于2/3则放到最大
      if (
        DragBarH >= parseInt(((MaxH / 3) * 2) as any) ||
        DragBarW >= parseInt(((MaxW / 3) * 2) as any)
      ) {
        expanded.value = 3;
        emitOnChange(H.value, W.value);
        return;
      }
      // 高度小于2/3且宽度小于2/3则放到中等
      if (
        DragBarH < parseInt(((MaxH / 3) * 2) as any) &&
        DragBarW < parseInt(((MaxW / 3) * 2) as any)
      ) {
        expanded.value = 2;
        emitOnChange((H.value / 3) * 2, (W.value / 3) * 2);
        return;
      }
      if (expanded.value > 3) {
        expanded.value = 3;
      }
      if (expanded.value < 1) {
        expanded.value = 1;
      }
      // 中等状态
      if (expanded.value == 2) {
        emitOnChange((H.value / 3) * 2, (W.value / 3) * 2);
      } else if (expanded.value == 3) {
        // 最大状态
        emitOnChange(H.value, W.value);
      }
      setTimeout(() => {
        DragBox.value.style.transition = "none";
      }, 500);
    }
    function shrink() {
      emit("update:tableResize", !props.tableResize);
      DragBox.value.style.transition = "all 0.5s";
      const DragBarH = DragBox.value.style.height.split("px")[0];
      const DragBarW = DragBox.value.style.width.split("px")[0];
      const MaxH = Math.floor(H.value);
      const MaxW = Math.floor(W.value);
      // 高度大于2/3或宽度大于2/3则缩到到2/3
      if (
        DragBarH > parseInt(((MaxH / 3) * 2) as any) ||
        DragBarW > parseInt(((MaxW / 3) * 2) as any)
      ) {
        expanded.value = 2;
        emitOnChange((H.value / 3) * 2, (W.value / 3) * 2);
        return;
      }
      // 高度小于2/3且宽度小于2/3则缩到最小
      if (
        DragBarH <= parseInt(((MaxH / 3) * 2) as any) &&
        DragBarW <= parseInt(((MaxW / 3) * 2) as any)
      ) {
        expanded.value = 1;
        emitOnChange(defaultHeigth.value, defaultWidth.value);
        return;
      }
      if (expanded.value > 3) {
        expanded.value = 3;
      }
      if (expanded.value < 1) {
        expanded.value = 1;
      }
      // 中等状态
      if (expanded.value == 3) {
        emitOnChange((H.value / 3) * 2, (W.value / 3) * 2);
      } else if (expanded.value == 2) {
        // 最大状态
        emitOnChange(defaultHeigth.value, defaultWidth.value);
      }
      setTimeout(() => {
        DragBox.value.style.transition = "none";
      }, 500);
    }
    onUnmounted(() => {
      clearEventListener();
    });
    return {
      DragBox,
      expand,
      shrink,
      expanded,
      handleMousedown,
      showOptionFn,
      ...toRefs(props),
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped >
.DragBox {
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 9;
  &__bar {
    cursor: move;
    color: #fff;
    width: 100%;
    height: 40px;
    background: #f23c3c;
    display: flex;
    justify-content: space-between;
    .left {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-left: 10px;
      span {
        padding-right: 10px;
      }
    }
    .right {
      width: 100px;
      cursor: default;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      i {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        cursor: pointer;
        padding: 0 10px;
        color: #fdd0d0;
        &:hover {
          color: #fff;
        }
      }
    }
  }
  &__content {
    height: calc(100% - 40px);
    width: 100%;
    overflow: hidden;
    background: #fff;
  }
}
</style>