<template>
  <Modal
    v-bind="$attrs"
    :title="current.title"
    width="1000px"
    :footer="null"
    :bodyStyle="{ padding: '0' }"
    :destroyOnClose="true"
  >
    <div style="min-height: 450px">
      <AlarmDetail v-bind="$attrs" v-if="type === 'alarm'" />
      <AccDetail v-bind="$attrs" v-if="type === 'acc'" />
      <MileageDetail v-bind="$attrs" v-if="type === 'mileage'" />
    </div>
  </Modal>
</template>
<script lang="ts">
import { computed, defineAsyncComponent, defineComponent, PropType } from "vue";
import { Modal } from "@/components/Modal";

export default defineComponent({
  props: {
    type: {
      type: String as PropType<string>,
      default: "",
    },
  },
  components: {
    Modal,
    AlarmDetail: defineAsyncComponent(
      () => import("../../pages/alarmInfo/Detail.vue")
    ),
    AccDetail: defineAsyncComponent(
      () => import("../../pages/drivingStatistics/Detail.vue")
    ),
    MileageDetail: defineAsyncComponent(
      () => import("../../pages/mileageReport/Detail.vue")
    ),
  },
  setup(props) {
    const current = computed(() => {
      let title = "";
      switch (props.type) {
        case "alarm":
          title = "报警明细";
          break;
        case "acc":
          title = "ACC明细";
          break;
        case "mileage":
          title = "里程明细";
          break;
      }
      return {
        title,
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
