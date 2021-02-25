<template>
  <a-modal
    title="结清撤回"
    v-model:visible="show"
    :confirm-loading="carSettleListConfirmLoading"
    width="700px"
    :maskClosable="false"
    :footer="null"
    class="carSettleList"
  >
    <Settlement
      :vehicleId="vehicleId"
      :visible="show"
      settleType="settleBack"
      @SettlementConfirm="SettlementConfirm"
      @SettlementCancle="SettlementCancle"
    />
  </a-modal>
</template>

<script lang="ts">
import { defineComponent,defineAsyncComponent,computed,reactive, toRefs} from "vue";
export default defineComponent({
  name: "carSettleListModal",
  props: {
    // 车辆ID
    vehicleId:{
      type: Number,
      default: 0,
    },
    // 显示状态
    visible:{
      type:Boolean,
      default: false,
    }
  },
  components:{
    Settlement: defineAsyncComponent(
      () => import("@/views/monitorCenter/LeftContent/dialog/contents/Settlement/index.vue")
    ),
  },
  setup(props, { emit }) {
    const data = reactive({
      carSettleListConfirmLoading: false,
      devNo: '',
      settVisible: true,
    });
    // 结清功能确认回调
    const SettlementConfirm = () => {
      emit('settlementConfirm');
      emit("update:visible", false);
    }
    // 结清功能取消回调
    const SettlementCancle = () => {
      emit("update:visible", false);
    }
    //监听显示功能
    const show = computed({
      get: () => props.visible,
      set: (val) => {
        emit("update:visible", val);
      },
    });
    return {
      show,
      SettlementCancle,
      SettlementConfirm,
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.carSettleList{
  .firstTitle {
    text-align: center;
    font-size: 22px;
    padding: 5px 0;
    color: #2E8DED;
    font-weight: bold;
  }
  .title {
    margin-top: 30px;
    font-weight: bold;
    font-size: 17px;
  }
  .listNotice{
    padding-left:24px;
    li{
      list-style-type: disc!important;
      color: #2E8DED;
      font-size: 16px;
      line-height: 26px;
      span{
        color: #383636;
        font-size: 14px;
      }
    }
  }
}
</style>