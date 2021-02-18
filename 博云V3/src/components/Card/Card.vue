<template>
  <div class="Card">
    <slot name="header" />
    <div class="Card__header" v-if="!$slots.header">
      <span :title="title">
        {{title}}
        <slot name="title" />
      </span>
      <span
        :title="button"
        @click="emitFn"
      >
        {{button}}
        <i v-if="button" class="iconfont icon-right"></i>
        <slot name="button" />
      </span>
    </div>
    <div class="Card__content">
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, toRefs } from "vue";
import { RightOutlined } from "@ant-design/icons-vue";
interface proprType {
  title: string;
  button: string;
}
export default defineComponent({
  props: {
    title: {
      type: String,
      default: "",
    },
    button: {
      type: String,
      default: "",
    },
  },
  components: {
    RightOutlined,
  },
  setup(props: proprType, { emit }) {
    const { button, title } = toRefs(props);
    function emitFn() {
      if (button.value == "") return;
      emit("buttonFn");
    }
    return {
      title,
      emitFn,
    };
  },
});
</script>
<style lang="less" scoped>
@import "./card.less";
</style>