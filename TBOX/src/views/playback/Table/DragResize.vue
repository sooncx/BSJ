<template>
  <div
    class="DragResize"
    ref="DragResize"
  >
    <div
      class="DragResize__bar"
      @mousedown.left="handleMousedown"
    >
      <el-button
        class="DragResize__button"
        :class="{DragResize__button_expanded: expanded}"
        @click="handleExpandBtnClick()"
        type="text"
        icon="el-icon-arrow-up"
      ></el-button>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    maxHeight: {
      type: Number,
      default: document.body.clientHeight - 80
    },
    minHeight: {
      type: Number,
      default: 48
    },
    defaultHeigth: {
      type: Number,
      default: 240
    }
  },

  data() {
    return {
      isDrag: false,
      initY: 0,
      upsideH: 0,
      expanded: true //是否展开
    };
  },

  mounted() {
    this.$refs.DragResize.style.height = this.defaultHeigth + "px";
  },

  beforeDestroy() {
    this.clearEventListener()
  },

  methods: {
    async handleExpandBtnClick() {
      this.$refs.DragResize.style.transition = "height 0.3s";
      this.expanded
        ? this.emitOnChange(this.minHeight)
        : this.emitOnChange(this.defaultHeigth);
      await this.$sleep(500);
      this.$refs.DragResize.style.transition = "none";
    },
    async handleMousedown(e) {
      this.isDrag = true;
      this.initY = e.clientY;
      this.upsideH = this.$refs.DragResize.offsetHeight;
      this.clearEventListener();
      document.addEventListener("mousemove", this.handleMousemove);
      document.addEventListener("mouseup", this.handleMouseUp);
    },
    handleMousemove(e) {
      let changeH = this.upsideH + (this.initY - e.clientY);
      //小于最小宽度则设为最小宽度
      changeH < this.minHeight && (changeH = this.minHeight);
      //大于容器一半宽度则设为容器一半宽度
      changeH > this.maxHeight && (changeH = this.maxHeight);
      this.emitOnChange(changeH);
    },
    emitOnChange(changeH) {
      this.expanded = changeH > this.minHeight;
      this.$emit("onChange", changeH);
      this.$refs.DragResize.style.height = changeH + "px";
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
.DragResize {
  height: 240px;
  overflow: hidden;

  &__bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 48px;
    display: flex;
    align-items: center;
    z-index: 99;
    user-select: none;
    cursor: n-resize;
  }

  &__button {
    position: absolute;
    right: 10px;
    font-size: 20px;
    transition: transform 0.3s;

    &_expanded {
      transform: rotate(180deg);
    }
  }
}
</style>
