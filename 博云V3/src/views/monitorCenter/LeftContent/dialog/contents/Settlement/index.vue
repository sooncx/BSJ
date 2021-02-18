<template>
  <Tip
    v-bind="$attrs"
    v-if="isSettleFirst == '是' && settleType == 'settle'"
    v-model:isSettleFirst="isSettleFirst"
  />
  <SettleTable
    v-bind="$attrs"
    v-model:dialogData="dialogData"
    :vehicleId="vehicleId"
    :settleType="settleType"
    v-else
    @SettlementCancle="$emit('SettlementCancle')"
    @SettlementConfirm="$emit('SettlementConfirm')"
  />
</template>
<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  ref,
  toRefs,
  watch,
  watchEffect,
  nextTick,
} from "vue";
import router from "@/router";
import Eldialog from "@/components/Eldialog/index.vue";
import { Modal } from "@/components/Modal";
import SettleTable from "./SettleTable.vue";
import Tip from "./tip.vue";
import { useFunction } from "@/views/monitorCenter/function";
export default defineComponent({
  components: {
    Eldialog,
    SettleTable,
    Tip,
    Modal,
  },
  props: {
    settleType: {
      type: String,
      default: "settle",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    vehicleId: {
      type: Number || String,
      default: "",
    },
    msgType: {
      type: String,
      default: "jieqing",
    },
  },
  emits: ["SettlementCancle", "SettlementConfirm"],
  setup(props, { emit }) {
    const { querySettleDetail } = useFunction();
    const data = reactive({
      isSettleFirst: "是",
      dialogData: [],
      async getData() {
        const res = await querySettleDetail(props.vehicleId);
        data.dialogData = [...res] as any;
        console.log(data.dialogData, "data.dialogData");
      },
    });
    nextTick(() => {
      watch(
        () => props.visible,
        (val) => {
          if (val) {
            data.getData();
          }
          data.isSettleFirst = localStorage.getItem("isSettleFirst")
            ? (localStorage.getItem("isSettleFirst") as any)
            : "是";
        },
        {
          immediate: true,
        }
      );
    });
    return {
      ...toRefs(props),
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.Settlement {
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 10px 16px;
  .header {
    height: 20px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 14px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    color: #333333;
  }
  .content {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    .leftMessageBox {
      width: 100%;
      padding: 0 10px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      .user {
        height: 36px;
        width: 36px;
        background: #dfdfdf;
        border-radius: 50px;
        margin-right: 10px;
      }
      .leftinfo {
        max-width: 80%;
        padding: 8px 10px;
        border-radius: 3px;
        background: #eeeeee;
        position: relative;
        font-size: 12px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
        &::after {
          width: 0;
          height: 0;
          content: "";
          border-top: 5px solid transparent;
          border-right: 7px solid #eeeeee;
          border-bottom: 5px solid transparent;
          position: absolute;
          left: -6px;
          top: 12px;
        }
      }
    }
    .rightMessageBox {
      width: 100%;
      padding: 0 10px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;
      .user {
        height: 36px;
        width: 36px;
        background: #dfdfdf;
        border-radius: 50px;
        margin-left: 10px;
        margin-top: -5px;
      }
      .rightinfo {
        max-width: 80%;
        padding: 8px 10px;
        border-radius: 3px;
        background: #eeeeee;
        position: relative;
        font-size: 12px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
        &::after {
          width: 0;
          height: 0;
          content: "";
          border-top: 5px solid transparent;
          border-left: 7px solid #eeeeee;
          border-bottom: 5px solid transparent;
          position: absolute;
          right: -6px;
          top: 9px;
        }
      }
    }
  }
}
.dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100%;
}
.footer {
  width: 100%;
  height: 60px;
  padding: 10px 16px;
  border-top: 1px solid #d9e0e9;
  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
::v-deep(.el-button) {
  border-radius: 0 !important;
}
::v-deep(.el-button--primary) {
  background: #0e60db !important;
  border-color: #0e60db !important;
  &:hover {
    opacity: 0.8;
  }
}
</style>