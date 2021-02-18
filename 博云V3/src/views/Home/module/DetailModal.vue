<template>
  <Modal
    v-bind="$attrs"
    :centered="true"
    :footer="null"
    :width="current.width"
    :title="current.title"
    :bodyStyle="current.style"
  >
    <VehStateDetail v-bind="$attrs" v-if="type === 'vehState'" />
  </Modal>
</template>
<script lang="ts">
import { defineComponent, computed, defineAsyncComponent } from "vue";
import { Modal } from "@/components/Modal";

export default defineComponent({
  components: {
    Modal,
    VehStateDetail: defineAsyncComponent(() => import("./VehStateDetail.vue")),
  },
  props: {
    type: {
      type: String,
    },
  },
  setup(props) {
    const current = computed(() => {
      let title = null;
      let width = null;
      let style = null;

      switch (props.type) {
        case "vehState":
          width = 1200;
          style = { background: "#18253A", padding: 0 };
          break;
      }

      return {
        title,
        width,
        style,
      };
    });

    return {
      current,
    };
  },
});
</script>
<style lang="less" scoped>
</style>