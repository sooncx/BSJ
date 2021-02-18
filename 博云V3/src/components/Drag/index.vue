<template>
  <div
    ref="drag"
    class="drag"
    :style="{cursor: isDrag ? 'e-resize' : 'auto', pointerEvents: isDrag ? 'none' : 'auto'}"
  >
    <!-- 上部分开始 -->
    <div
      class="drag__left"
      ref="leftContent"
    >
      <slot name="left"></slot>
    </div>
    <!-- 上部分结束 -->

    <!-- 下部分开始 -->
    <div
      class="drag__right"
      ref="rightContent"
    >
      <!-- 拖拽框开始 -->
      <div
        class="drag__bar"
        :class="{drag__bar_on: isDrag}"
        @mousedown.left="handleMousedown"
      >
        <div class="drag__bar-con">
          <i
            class="drag__trigger-bar"
            v-for="(item, index) in new Array(8)"
            :key="index"
          ></i>
        </div>
      </div>
      <!-- 拖拽框结束 -->
      <div class="drag__content">
        <slot name="right"></slot>
      </div>
    </div>
    <!-- 下部分结束 -->
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
export default defineComponent({
  props: {
    minWidth: {
      type: Number,
      default: 300,
    },
    defaultWidth: {
      type: String,
      default: "300px",
    },
    dragResize: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { minWidth, defaultWidth } = toRefs(props);
    const options = reactive({
      isDrag: false,
      initX: 0,
      leftW: 0,
      drag: ref<HTMLDivElement | null>(null),
      leftContent: ref<HTMLDivElement | null>(null),
      rightContent: ref<HTMLDivElement | null>(null),
    });
    onMounted(() => {
      (options.leftContent as any).style.width = defaultWidth.value;
    });
    function handleMousemove(e: HTMLDivElement | any) {
      emit("update:dragResize", !props.dragResize);
      let changeW: any = options.leftW - (options.initX - e.clientX);
      //小于最小宽度则设为最小宽度
      changeW < minWidth.value && (changeW = minWidth.value);
      //大于容器一半宽度则设为容器一半宽度
      const halfW = (options.drag as any).clientWidth / 2;
      changeW > halfW && (changeW = halfW);
      (options.leftContent as any).style.width = changeW + "px";
    }
    function handleMouseUp(e: HTMLDivElement | any) {
      if (e.button !== 0) return;
      clearEventListener();
      options.isDrag = false;
    }
    function clearEventListener() {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMousemove);
    }
    async function handleMousedown(e: HTMLDivElement | any) {
      options.isDrag = true;
      options.initX = e.clientX;
      options.leftW = (options.leftContent as any).offsetWidth;
      clearEventListener();
      document.addEventListener("mousemove", handleMousemove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return {
      ...toRefs(options),
      handleMousedown,
      handleMouseUp,
      handleMousemove,
    };
  },
});
</script>

<style lang="less" scoped>
.drag {
  display: flex;
  height: 100%;
  // &__left {
  //   min-width: 200px;
  // }
  &__right {
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  &__bar {
    width: 10px;
    width: 6px;
    height: 100%;
    background: rgba(gray, 0.1);
    border-top: none;
    border-bottom: none;
    cursor: e-resize;
    user-select: none;
    position: relative;

    &:hover {
      background: rgba(gray, 0.2);
    }

    &_on {
      background: rgba(gray, 0.2);
    }
  }

  &__bar-con {
    position: absolute;
    overflow: hidden;
    left: 1px;
    top: 50%;
    height: 32px;
    transform: translateY(-50%);
  }

  &__trigger-bar {
    width: 4px;
    height: 1px;
    background: rgba(23, 35, 61, 0.25);
    float: left;
    margin-top: 3px;
  }

  &__content {
    overflow: hidden;
    flex: 1;
    height: 100%;
  }
}
</style>
