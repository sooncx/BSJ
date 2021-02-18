<template>
  <div class="riskCenter">
    <div class="riskCenter__header">
      <p>
        风控警报
        <ExportAlarm />
      </p>
      <RiskAlarm />
    </div>
    <div class="riskCenter__chart">
      <div>
        <TrendChart />
      </div>
    </div>
  </div>
  <ExportFilter
    v-model:visible="exportVisible"
    :keys="exportKeys"
    :type="exportType"
  />
</template>
<script lang="ts">
import {
  defineAsyncComponent,
  defineComponent,
  provide,
  reactive,
  ref,
  toRefs,
} from "vue";
import { RiskAlarm, ExportAlarm, TrendChart } from "./module";
import { riskDataType } from "./module/type";

export default defineComponent({
  name: "riskCenter",
  components: {
    RiskAlarm,
    ExportAlarm,
    TrendChart,
    TrendModal: defineAsyncComponent(
      () => import("./module/src/TrendModal.vue")
    ),
    ExportFilter: defineAsyncComponent(
      () => import("./module/src/ExportFilter.vue")
    ),
  },
  setup() {
    const riskData = ref<riskDataType | null>(null);
    provide("riskData", riskData);
    provide("UPDATE_RISKDATA", (val: riskDataType) => {
      riskData.value = val;
    });

    const updateRiskData = ref(null);
    provide("updateRiskData", updateRiskData);
    provide("UPDATE_UPDATERISKDATA", (val: any) => {
      updateRiskData.value = val;
    });

    const exportVisible = ref(false);
    const exportType = ref("");
    const exportKeys = ref("");
    provide("UPDATE_EXPORTMSG", (val: boolean, keys: string, type: string) => {
      exportVisible.value = val;
      exportType.value = type;
      exportKeys.value = keys;
    });

    return {
      exportVisible,
      exportType,
      exportKeys,
    };
  },
});
</script>
<style lang="less" scoped>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  border-radius: 6px;
  width: 6px;
  background-color: rgba(144, 147, 153, 0.3);
  transition: background-color 0.3s;
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(144, 147, 153, 0.5);
}
::-webkit-scrollbar-thumb:active {
  background-color: rgba(144, 147, 153, 0.5);
}

.riskCenter {
  height: 100%;
  background: #f4f6f9;
  display: flex;
  flex-flow: column;

  &__header {
    margin-bottom: 10px;
    background: #fff;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;

    > p {
      font-size: 18px;
      font-family: Segoe UI, Segoe UI-Bold;
      font-weight: 700;
      text-align: left;
      color: #333333;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 15px 0;
      margin: 0;
      min-width: 1400px;
    }
  }

  &__chart {
    width: 100%;
    overflow-x: auto;
    flex: 1;
    > div {
      min-width: 1400px;
      display: flex;
      justify-content: space-between;
      height: 100%;
    }
  }
}
</style>
