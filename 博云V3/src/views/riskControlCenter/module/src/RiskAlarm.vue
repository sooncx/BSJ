<template>
  <ul class="risAlarm">
    <li v-for="(item, index) in riskAlarmData" :key="index">
      <div>
        <span>{{ item.name }}</span>
        <img
          :src="require(`@/assets/img/riskCenter/alarm${index}.png`)"
          alt=""
        />
      </div>
      <strong @click="showModal(item)">{{ item.value }}</strong>
    </li>
  </ul>
  <risk-modal v-model:visible="visible" :curData="modalData" />
  <tips-modal v-model:visible="tipVisible" :typeLayer="typeLayer" @nextStep="nextStep" />
</template>
<script lang="ts">
import {
  defineComponent,
  inject,
  ref,
  defineAsyncComponent,
  reactive,
  provide,
} from "vue";
import API from "@/api/riskControlCenter";
import APIType from "@/api/riskControlCenter/type";
import { riskDataType } from "../type";

interface riskType {
  key: string;
  param?: string;
  name: string;
  value: number | string;
  exportKey?: string | number
}

export default defineComponent({
  name: "riskAlarm",
  components: {
    RiskModal: defineAsyncComponent(() => import("./RiskModal.vue")),
    TipsModal: defineAsyncComponent(() => import("./TipsModal.vue")),
  },
  setup() {
    const riskAlarmData = ref(<riskType[]>[
      {
        key: "concernList",
        name: "重点关注",
        value: 0,
        exportKey: 3
      },
      {
        key: "riskTotalNum",
        name: "风险车辆",
        value: 0,
        exportKey: 4
      },
      {
        key: "carVehOfflineNum",
        name: "多设备离线",
        value: 0,
      },
      {
        key: "separateNum",
        param: "10",
        name: "分离警报",
        value: 0,
      },
      {
        key: "removeNum",
        param: "7",
        name: "拆除警报",
        value: 0,
        exportKey: 5
      },
      {
        key: "electricNum",
        param: "6",
        name: "掉电警报",
        value: 0,
        exportKey: 7
      },
      {
        key: "longStopNum",
        name: "超长停车",
        value: 0,
        exportKey: 11
      },
      {
        key: "twoNum",
        param: "3",
        name: "二押点警报",
        value: 0,
        exportKey: 1
      },
      {
        key: "superNum",
        param: "0",
        name: "出省警报",
        value: 0,
        exportKey: 8
      },
      {
        key: "stopNum",
        param: "4",
        name: "异常停留",
        value: 0,
        exportKey: 9
      },
      {
        key: "regionNum",
        param: "1",
        name: "区域警报",
        value: 0,
        exportKey: 2
      },
      {
        key: "speedNum",
        param: "5",
        name: "超速警报",
        value: 0,
        exportKey: 12
      },
      {
        key: "urgentNum",
        param: "8",
        name: "紧急警报",
        value: 0,
        exportKey: 13
      },
      {
        key: "other",
        param: "9",
        name: "其他警报",
        value: 0,
        exportKey: 14
      },
    ]);

    const updateriskdata = <(val: riskDataType) => void>(
      inject("UPDATE_RISKDATA")
    );

    const getriskdata = <(val: any) => void>(inject("UPDATE_UPDATERISKDATA"));

    const getData = async () => {
      const pageOne = await API.pageHomePageOne();
      const pageTwo = await API.pageHomePageTwo();
      const pageRisk = await API.pageHomePageRisk();

      riskAlarmData.value[0].value = pageTwo.obj.concernList; // 重点关注
      riskAlarmData.value[1].value = pageRisk.obj.riskTotalNum; // 风险车辆
      riskAlarmData.value[2].value = pageOne.obj.carVehOfflineNum; // 多设备离线
      riskAlarmData.value[3].value = pageTwo.obj.separateNum; // 分离警报
      riskAlarmData.value[4].value = pageTwo.obj.removeNum; // 拆除警报
      riskAlarmData.value[5].value = pageTwo.obj.electricNum; // 掉电警报
      riskAlarmData.value[6].value = pageOne.obj.longStopNum; // 超长停车
      riskAlarmData.value[7].value = pageTwo.obj.twoNum; // 二押点警报
      riskAlarmData.value[8].value = pageTwo.obj.superNum; // 出省警报
      riskAlarmData.value[9].value = pageTwo.obj.stopNum; // 异常停留
      riskAlarmData.value[10].value = pageTwo.obj.regionNum; // 区域警报
      riskAlarmData.value[11].value = pageTwo.obj.speedNum; // 超速警报
      riskAlarmData.value[12].value = pageTwo.obj.urgentNum; // 紧急警报
      riskAlarmData.value[13].value = pageTwo.obj.other; // 其他警报

      const info = {
        concernList: pageTwo.obj.concernList,
        riskTotalNum: pageRisk.obj.riskTotalNum,
        carVehOfflineNum: pageOne.obj.carVehOfflineNum,
        separateNum: pageTwo.obj.separateNum,
        removeNum: pageTwo.obj.removeNum,
        electricNum: pageTwo.obj.electricNum,
        longStopNum: pageOne.obj.longStopNum,
        twoNum: pageTwo.obj.twoNum,
        superNum: pageTwo.obj.superNum,
        stopNum: pageTwo.obj.stopNum,
        regionNum: pageTwo.obj.regionNum,
        speedNum: pageTwo.obj.speedNum,
        urgentNum: pageTwo.obj.urgentNum,
        other: pageTwo.obj.other,
      };

      updateriskdata(info);
    };

    getData();

    getriskdata(getData);

    const visible = ref(false);
    const tipVisible = ref(false);
    const typeLayer = ref("");
    provide("visible", visible);
    const modalData = ref(<riskType | null>null);
    const showModal = (row: riskType) => {
      modalData.value = row;
      if (
        (row.key === "riskTotalNum" &&
          !localStorage.getItem("isRiskTotalNumFirst")) ||
        (row.key === "carVehOfflineNum" &&
          !localStorage.getItem("isCarVehOfflineNumFirst")) ||
        (row.key === "separateNum" &&
          !localStorage.getItem("isSeparateNumFirst"))
      ) {
        tipVisible.value = true;
        typeLayer.value = row.key;
        return;
      }
      visible.value = true;
    };

    const nextStep = () => {
      tipVisible.value = false;
      visible.value = true;
    }

    return {
      riskAlarmData,
      visible,
      tipVisible,
      typeLayer,
      modalData,
      showModal,
      nextStep,
    };
  },
});
</script>
<style lang="less" scoped>
.risAlarm {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 15px 15px;
  min-width: 1400px;

  li {
    display: flex;
    flex: 1;
    width: 13.55%;
    min-width: 13.55%;
    max-width: 13.55%;
    height: 120px;
    align-items: center;
    border: 1px solid #e4e7eb;
    box-sizing: border-box;
    font-family: PingFang SC, PingFang SC-Bold;
    margin-top: 15px;
    position: relative;
    div {
      width: 50%;
      display: flex;
      flex-flow: column;
      padding-left: 10%;
      span {
        font-size: 14px;
        font-weight: 700;
      }
      img {
        margin-top: 8px;
        width: 36px;
        height: 36px;
      }
    }
    strong {
      text-align: center;
      width: 50%;
      font-size: 34px;
      font-weight: 400;
      cursor: pointer;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    &::before,
    &::after {
      pointer-events: none;
      position: absolute;
      content: "";
      left: 0px;
      width: 100%;
      box-sizing: border-box;
      height: 5px;
      opacity: 0;
      transition-duration: 0.3s;
      transition-property: opacity;
      background-repeat: no-repeat;
    }

    &::before {
      bottom: 100%;
      background: radial-gradient(
        at 50% 150%,
        rgba(0, 0, 0, 0.6) 0%,
        rgba(0, 0, 0, 0) 80%
      );
    }

    &::after {
      top: 100%;
      background: radial-gradient(
        at 50% -50%,
        rgba(0, 0, 0, 0.6) 0%,
        rgba(0, 0, 0, 0) 80%
      );
    }

    &:hover::before,
    &:hover::after {
      opacity: 1;
    }
  }
}
</style>
