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

<script>
export default {
  props: {
    minWidth: {
      type: Number,
      default: 200
    },
    defaultWidth: {
      type: String,
      default: "240px"
    }
  },

  data() {
    return {
      isDrag: false,
      initX: 0,
      leftW: 0
    };
  },

  mounted() {
    this.$refs.leftContent.style.width = this.defaultWidth;
  },

  beforeDestroy() {
    this.clearEventListener()
  },

  methods: {
    async handleMousedown(e) {
      this.isDrag = true;
      this.initX = e.clientX;
      this.leftW = this.$refs.leftContent.offsetWidth;
      this.clearEventListener();
      document.addEventListener("mousemove", this.handleMousemove);
      document.addEventListener("mouseup", this.handleMouseUp);
    },
    handleMousemove(e) {
      let changeW = this.leftW - (this.initX - e.clientX);
      //小于最小宽度则设为最小宽度
      changeW < this.minWidth && (changeW = this.minWidth);
      //大于容器一半宽度则设为容器一半宽度
      const halfW = this.$refs.drag.clientWidth / 2;
      changeW > halfW && (changeW = halfW);
      this.$refs.leftContent.style.width = changeW + "px";
    },
    handleMouseUp(e) {
      if (e.button !== 0) return;
      this.clearEventListener();
      this.isDrag = false;
    },
    clearEventListener() {
      document.removeEventListener("mouseup", this.handleMouseUp);
      document.removeEventListener("mousemove", this.handleMousemove);
    }
  }
};
</script>

<style lang="scss" scoped>
.drag {
  display: flex;
  height: 100%;

  &__right {
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  &__bar {
    width: 10px;
    width: 6px;
    height: 100%;
    background: rgba(#18C18B, 0.1);
    border-top: none;
    border-bottom: none;
    cursor: e-resize;
    user-select: none;
    position: relative;

    &:hover {
      background: rgba(#18C18B, 0.2);
    }

    &_on {
      background: rgba(#18C18B, 0.2);
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
