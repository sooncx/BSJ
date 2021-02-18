<template>
  <div class="exportAlarm">
    <div class="exportAlarm__btn"><i class="iconfont icon-daochu"></i>导出</div>

    <ul class="exportAlarm__list">
      <li v-for="(item, index) in list" :key="index">
        <a-checkbox v-model:checked="item.checked" @change="onCheckChange">
          {{ item.name }}({{ item.value }})
        </a-checkbox>
      </li>
      <li>
        <a-checkbox v-model:checked="allchecked" @change="onAllChange"
          >全选</a-checkbox
        >
      </li>
      <li>
        <a-button type="primary" :disabled="exportFlag" @click="exportAll"
          >导出全部</a-button
        >
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  inject,
  ref,
  watchEffect,
  Ref,
  unref,
  defineAsyncComponent,
} from "vue";
import { riskDataType } from "../type";
import API from "@/api/riskControlCenter";

export default defineComponent({
  name: "exportAlarm",
  setup(props) {
    const list = ref([
      {
        key: "concernList",
        name: "重点关注",
        value: 0,
        checked: false,
        param: 3,
      },
      {
        key: "riskTotalNum",
        name: "风险车辆",
        value: 0,
        checked: false,
        param: 4,
      },
      {
        key: "removeNum",
        name: "拆除报警",
        value: 0,
        checked: false,
        param: 5,
      },
      {
        key: "electricNum",
        name: "掉电报警",
        value: 0,
        checked: false,
        param: 7,
      },
      {
        key: "longStopNum",
        name: "超长停车",
        value: 0,
        checked: false,
        param: 11,
      },
      {
        key: "twoNum",
        name: "二押点",
        value: 0,
        checked: false,
        param: 1,
      },
      {
        key: "superNum",
        name: "出省警报",
        value: 0,
        checked: false,
        param: 8,
      },
      {
        key: "stopNum",
        name: "异常停留报警",
        value: 0,
        checked: false,
        param: 9,
      },
      {
        key: "regionNum",
        name: "区域警报",
        value: 0,
        checked: false,
        param: 2,
      },
      {
        key: "speedNum",
        name: "超速警报",
        value: 0,
        checked: false,
        param: 12,
      },
      {
        key: "urgentNum",
        name: "紧急警报",
        value: 0,
        checked: false,
        param: 13,
      },
      {
        key: "other",
        name: "其他报警",
        value: 0,
        checked: false,
        param: 14,
      },
    ]);

    const riskData = <Ref<riskDataType>>inject("riskData");

    watchEffect(() => {
      if (!unref(riskData)) return;
      list.value[0].value = riskData.value.concernList;
      list.value[1].value = riskData.value.riskTotalNum;
      list.value[2].value = riskData.value.removeNum;
      list.value[3].value = riskData.value.electricNum;
      list.value[4].value = riskData.value.longStopNum;
      list.value[5].value = riskData.value.twoNum;
      list.value[6].value = riskData.value.superNum;
      list.value[7].value = riskData.value.stopNum;
      list.value[8].value = riskData.value.regionNum;
      list.value[9].value = riskData.value.speedNum;
      list.value[10].value = riskData.value.urgentNum;
      list.value[11].value = riskData.value.other;
    });

    const onCheckChange = () => {
      try {
        list.value.forEach((item) => {
          exportFlag.value = true;
          if (item.checked) {
            throw (exportFlag.value = false);
          }
        });
      } catch (error) {}

      // 全选状态同步
      const arr = list.value.filter((item) => item.checked);
      allchecked.value = arr.length === list.value.length;
    };

    const allchecked = ref<boolean>(false);
    const exportFlag = ref<boolean>(true);

    const onAllChange = () => {
      list.value.forEach((item) => {
        item.checked = allchecked.value;
      });
      exportFlag.value = !allchecked.value;
    };

    const updateexportmsg = <
      (val: boolean, keys: string, type: string) => void
    >inject("UPDATE_EXPORTMSG");
    const exportAll = () => {
      updateexportmsg(
        true,
        list.value
          .map((item) => {
            if (item.checked) {
              return item.param;
            }
          })
          .filter(Boolean)
          .join(","),
        "all"
      );
    };

    return {
      list,
      onCheckChange,
      allchecked,
      onAllChange,
      exportFlag,
      exportAll,
    };
  },
});
</script>
<style lang="less" scoped>
.exportAlarm {
  width: 60px;
  position: relative;
  cursor: pointer;
  border: 1px solid #fff;
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;

  &__btn {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: 30px;
    padding-right: 5px;
    font-size: 14px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    text-align: left;
    color: #333333;
    background: #fff;
    border-top-right-radius: 3px;
    border-top-left-radius: 3px;
  }

  &__list {
    transition-duration: 0.4s;
    transition-property: transform opacity;
    animation-timing-function: ease-out;
    opacity: 0;
    transform: scale(0.1511, 0);
    transform-origin: 100% 0%;
    position: absolute;
    top: 29px;
    right: -1px;
    width: 400px;
    padding: 10px;
    border: 1px solid #0e60db;
    background: #fff;
    z-index: 90;
    border-radius: 3px;
    border-top-right-radius: 0;

    li {
      float: left;
      width: 50%;
      height: 37px;
      line-height: 37px;
      padding-left: 20px;
      font-weight: 400;
      font-size: 14px;
    }
  }

  &:hover {
    border: 1px solid #0e60db;

    .exportAlarm__btn {
      position: relative;
      z-index: 100;
      color: #0e60db;
    }

    .exportAlarm__list {
      opacity: 1;
      transform: scale(1);
    }
  }
}
</style>
