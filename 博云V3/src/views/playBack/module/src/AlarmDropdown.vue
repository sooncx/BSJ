<template>
  <a-dropdown placement="topCenter" v-model:visible="dorpdownVisible">
    <a-checkbox v-model:checked="data.checked" @change="allChange">{{
      data.text
    }}</a-checkbox>
    <template #overlay>
      <div class="alarmList">
        <p class="alarmList__desc">请选择报警类型显示</p>
        <a-checkbox-group
          v-model:value="alarmVal"
          :options="alarmlist"
          @change="handleChange"
        />
      </div>
    </template>
  </a-dropdown>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from "vue";

export default defineComponent({
  name: "alarmDropdown",
  props: {
    data: {
      type: Object as PropType<object>,
      default: {
        text: "报警点",
        checked: true,
      },
    },
  },
  setup(props, { emit }) {
    const allChange = (e: any) => {
      emit("update:data", {
        text: "报警点",
        checked: e.target.checked,
      });
    };

    const dorpdownVisible = ref(false);
    const alarmVal = ref([
      "isIllegalRemove",
      "abnormalStayAlarm",
      "powerDown",
      "lowVoltage",
      "shockAlarm",
      "emergencyAlarm",
      "bcarIsAlarm",
      "collideAlarm",
      "twoChargeAlarm",
      "separateAlarm",
      "lightAlarm",
      "outAdminAreaAlarm",
      "outCircleAlarm",
      "inRegionAlarm",
      "outRegionAlarm",
      "pryingAlarm",
      "scissorsAlarm",
      "lowerPowerAlarm",
      "illegalAreaAlarm",
      "accelerateAlarm",
      "slowDownAlarm",
      "swerveAlarm",
      "areaOverSpeedAlarm",
    ]);
    const alarmlist = ref([
      {
        label: "防拆除报警",
        value: "isIllegalRemove",
      },
      {
        label: "异常停留报警",
        value: "abnormalStayAlarm",
      },
      {
        label: "终端主电源掉电",
        value: "powerDown",
      },
      {
        label: "终端主电源欠压",
        value: "lowVoltage",
      },
      {
        label: "震动报警",
        value: "shockAlarm",
      },
      {
        label: "紧急报警",
        value: "emergencyAlarm",
      },
      {
        label: "Bcar拆除报警",
        value: "bcarIsAlarm",
      },
      {
        label: "碰撞报警",
        value: "collideAlarm",
      },
      {
        label: "二押点报警",
        value: "twoChargeAlarm",
      },
      {
        label: "分离报警",
        value: "separateAlarm",
      },
      {
        label: "光感报警",
        value: "lightAlarm",
      },
      {
        label: "超出区域报警",
        value: "outAdminAreaAlarm",
        // 这个就是出省报警
      },
      {
        label: "圆形区域报警",
        value: "outCircleAlarm",
      },
      {
        label: "进区域报警",
        value: "inRegionAlarm",
      },
      {
        label: "出区域报警",
        value: "outRegionAlarm",
      },
      {
        label: "撬锁报警",
        value: "pryingAlarm",
      },
      {
        label: "剪锁报警",
        value: "scissorsAlarm",
      },
      {
        label: "低压报警",
        value: "lowerPowerAlarm",
      },
      {
        label: "非法区域报警",
        value: "illegalAreaAlarm",
      },
      {
        label: "急加速报警",
        value: "accelerateAlarm",
      },
      {
        label: "急减速报警",
        value: "slowDownAlarm",
      },
      {
        label: "急转弯报警",
        value: "swerveAlarm",
      },
      {
        label: "区域超速报警",
        value: "areaOverSpeedAlarm",
      },
    ]);

    const handleChange = (e: string[]) => {
      const labelList = e.map((item) => {
        return alarmlist.value.filter((items) => items.value === item)[0].label;
      });
      emit("update:alarmLabel", labelList);
      emit("update:alarmlist", e);
    };

    return {
      allChange,
      dorpdownVisible,
      alarmlist,
      alarmVal,
      handleChange,
    };
  },
});
</script>
<style lang="less" scoped>
.alarmList {
  background: #fff;
  padding: 10px 20px;
  width: 530px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  &__desc {
    font-size: 12px;
    margin-bottom: 10px;
  }
  .ant-checkbox-group {
    ::v-deep(.ant-checkbox-wrapper) {
      width: 33.3%;
      min-width: 150px;
      line-height: 26px;
      margin: 0;
    }
  }
}
</style>

