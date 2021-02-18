<template>
  <ul class="trendDtail">
    <li
      v-for="(item, index) in list"
      :key="index"
      :class="`trendDtail--${item.size}`"
    >
      <span>{{ item.title }}</span>
      <p v-if="item.key === 'state'">{{ row[item.key] === 1 ? '已过期' : '即将过期' }}</p>
      <p v-else>{{ row[item.key] }}</p>
    </li>
  </ul>
  <div class="footerBtn" v-if="trendType === 'expire'">
    <a-button style="margin-right: 10px" @click="$emit('update:visible', false)"
      >取消</a-button
    >
    <a-button type="primary" @click="showMdal">续费</a-button>
  </div>
  <carRechargeModal
    v-model:visible="carRechargeModelVisible"
    :carRechargeNumber="0"
    :dataItem="selectTableItem"
    @submitData="carRechargeComplete"
  ></carRechargeModal>
</template>
<script lang="ts">
import { defineComponent, inject, reactive, ref, toRefs } from "vue";
import { detailData } from "./columns";
import { carRechargeModal } from "@/views/manageData/module/index";
import dayJs from "dayjs";

export default defineComponent({
  props: {
    visible: Boolean,
    trendType: String,
    row: {
      type: Object,
    },
  },
  components: { carRechargeModal },
  setup(props, { emit }) {
    const list = ref(
      props.trendType === "insurance"
        ? detailData.insurance
        : props.trendType === "maintain"
        ? detailData.maintain
        : props.trendType === "electric"
        ? detailData.electric
        : props.trendType === "expire"
        ? detailData.expire
        : []
    );

    // 续费
    const carRechargeModel = reactive({
      carRechargeModelVisible: false,
      selectTableItem: [
        {
          expireTime: props.row?.expireDate,
          plate: props.row?.plate,
          NOW: dayJs(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss"),
          groupId: props.row?.groupId,
          vehicleId: props.row?.vehicleId,
        },
      ],
      showMdal() {
        console.log(carRechargeModel.selectTableItem);
        carRechargeModel.carRechargeModelVisible = true;
      },
      updateTrendData: <() => void>inject('updateTrendData'),
      // 续费完成
      carRechargeComplete() {
        carRechargeModel.updateTrendData();
        emit('update:visible', false);
      }
    });

    return {
      list,
      ...toRefs(carRechargeModel),
    };
  },
});
</script>
<style lang="less" scoped>
.trendDtail {
  display: flex;
  flex-wrap: wrap;
  padding: 0 24px 20px 0;
  li {
    width: 50%;
    display: flex;
    align-items: center;
    margin-top: 15px;
    span {
      flex: 1;
      text-align: right;
      margin-right: 20px;
    }
    p {
      width: 200px;
      min-height: 34px;
      background: #f5f5f5;
      padding: 5px 10px;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      text-align: left;
      color: #999999;
      border: 1px solid #d9e0e9;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &.trendDtail--full {
      width: 100%;

      p {
        width: 523px;
      }
    }
  }
}
.footerBtn {
  height: 50px;
  border-top: 1px solid #d9e0e9;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 25px;
}
</style>
