<template>
  <Model
    @confirm="confirm"
    @cancle="cancle"
  >
    <i class="iconfont icon-tixing"></i>
    <span>确定解除该车辆的紧急报警？</span>
  </Model>
</template>
<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  toRefs,
  watch,
  nextTick,
} from "vue";
import Model from "./model.vue";
export default defineComponent({
  components: { Model },
  props: {
    dialogData: {
      type: Object || Array,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      confirm() {
        emit("update:visible", false);
      },
      cancle() {
        emit("update:visible", false);
      },
    });
    return {
      ...toRefs(props),
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.icon-tixing {
  color: #d62223;
  padding-right: 5px;
}
</style>