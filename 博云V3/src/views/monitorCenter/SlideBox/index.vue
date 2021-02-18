<template>
  <div
    class="slideBox"
    ref="slideBox"
  >
    <slot />
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  reactive,
  ref,
  toRefs,
  watch,
} from "vue";
export default defineComponent({
  props: {
    slideBoxShow: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const data = reactive({
      slideBox: ref<HTMLDivElement | null>(null),
    });
    const { slideBoxShow } = toRefs(props);
    watch(slideBoxShow, (val) => {
      nextTick(() => {
        if (val) {
          (data.slideBox as any).style.height = `calc(100% - 70px)`;
          (data.slideBox as any).style.opacity = 1;
        } else {
          (data.slideBox as any).style.height = 0;
          (data.slideBox as any).style.opacity = 0;
        }
      });
    });
    return {
      ...toRefs(data),
      ...toRefs(props),
    };
  },
});
</script>
<style lang="less" scoped>
.slideBox {
  width: 300px;
  height: 0;
  background: #fff;
  box-shadow: 0 5px 10px 0px rgba(0, 0, 0, 0.464);
  z-index: 99;
  top: 56px;
  right: 10px;
  position: absolute;
  transition: all .2s;
  overflow: hidden;
}
</style>