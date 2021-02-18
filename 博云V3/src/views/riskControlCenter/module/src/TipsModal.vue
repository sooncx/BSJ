<template>
  <Modal
    :visible="visible"
    :zIndex="1002"
    :title="
      typeLayer === 'riskTotalNum'
        ? '风险车辆'
        : typeLayer === 'carVehOfflineNum'
        ? '多设备离线'
        : typeLayer === 'separateNum'
        ? '分离报警'
        : typeLayer === 'sim'
        ? '查流量'
        : '结清'
    "
    :width="
      typeLayer === 'riskTotalNum' ||
      typeLayer === 'carVehOfflineNum' ||
      typeLayer === 'separateNum'
        ? 1150
        : 630
    "
    :footer="null"
    :bodyStyle="{ padding: '0' }"
    :destroyOnClose="true"
    :maskClosable="false"
    :draggable="false"
    :closable="false"
  >
    <div
      style="
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: space-around;
      "
      :style="{
        height:
          typeLayer === 'riskTotalNum'
            ? '495px'
            : typeLayer === 'carVehOfflineNum' || typeLayer === 'separateNum'
            ? '450px'
            : typeLayer === 'sim'
            ? '500px'
            : '600px',
      }"
    >
      <Settlement @nextStep="nextStep" :msgType="typeLayer" />
    </div>
  </Modal>
</template>
<script>
import { defineAsyncComponent, defineComponent, reactive, toRefs } from "vue";

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    typeLayer: {
      type: String,
    },
  },
  emits: ["nextStep"],
  components: {
    Modal: defineAsyncComponent(() =>
      import("@/components/Modal/src/Modal.vue")
    ),
    Settlement: defineAsyncComponent(() =>
      import(
        "@/views/monitorCenter/LeftContent/dialog/contents/Settlement/tip.vue"
      )
    ),
  },
  setup(props, { emit }) {
    const nextStep = () => {
      emit("nextStep");
    };

    return {
      nextStep,
    };
  },
});
</script>
