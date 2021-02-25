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
  inject,
  Ref,
} from "vue";
export default defineComponent({
  props: {},
  setup(props) {
    const videoFlag = <Ref<boolean>>inject("videoFlag");
    const data = reactive({
      slideBox: ref<HTMLDivElement | null>(null),
    });
    let slideBoxShow = inject("slideBoxShow") as any; // 围栏/位置点/二押点侧边栏visible
    watch(slideBoxShow, (val) => {
      nextTick(() => {
        if (val) {
          (data.slideBox as any).style.top = videoFlag.value ? `0px` : `56px`;
          (data.slideBox as any).style.height = videoFlag.value
            ? `calc(100% - 10px)`
            : `calc(100% - 70px)`;
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
  transition: all 0.2s;
  overflow: hidden;
}
</style>