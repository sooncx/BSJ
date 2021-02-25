<template>
  <div class="LeftContent">
    <div class="tree">
      <Tree v-bind="$attrs" />
    </div>
    <div class="list">
      <List v-bind="$attrs" />
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  toRefs,
  watch,
} from "vue";
export default defineComponent({
  components: {
    List: defineAsyncComponent(() => import("./VehList.vue")),
    Tree: defineAsyncComponent(() => import("./TreeList.vue")),
  },
  props: {},
  emits: ["outPutVideo"],
  setup(props, { emit }) {
    const data = reactive({});
    return {
      ...toRefs(data),
      ...toRefs(props),
    };
  },
});
</script>
<style lang="less" scoped>
.LeftContent {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .tree {
    width: 100%;
    height: 30%;
  }
  .list {
    border-top: 2px solid #ededed;
    width: 100%;
    height: 70%;
  }
}
</style>