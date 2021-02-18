<template>
  <a-button @click="shooModal" :style="btnStyle" class="active">{{
    checkedFlag.length === 0
      ? "选择报警类型"
      : checkedFlag.length === options.length
      ? "已全选报警"
      : `已选择${checkedFlag.length}项报警`
  }}</a-button>
  <Modal
    :checkboxFlag="true"
    v-model:checkboxChecked="checkAllVal"
    :checkboxFn="changeAll"
    :onOk="submit"
    title="选中警报"
    v-model:visible="visible"
    width="680px"
  >
    <a-checkbox-group
      v-model:value="checkedlist"
      :options="options"
      @change="listChange"
    />
  </Modal>
</template>
<script lang="ts">
import { defineComponent, ref, PropType } from "vue";
import { Modal } from "@/components/Modal/index";

export default defineComponent({
  name: "AlarmModalBtn",
  components: { Modal },
  props: {
    value: {
      type: Array as PropType<string[]>,
      default: [],
    },
    btnStyle: {
      type: Object as PropType<object>,
      default: { 'margin-left': '16px' }
    },
    /**
     * 报警列表类型
     */
    type: {
      type: String as PropType<"ALARM" | "OBD" | "LOCK">,
      default: "ALARM",
    },
  },
  setup(props, { emit }) {
    const visible = ref(false);
    const checkedlist = ref<string[]>([]);
    const checkedFlag = ref<string[]>([]);
    const ALARM_options = ref([
      {
        label: "超速报警",
        value: "overSpeed",
      },
      {
        label: "防拆除报警",
        value: "isIllegalRemove",
      },
      {
        label: "GPS天线开路报警",
        value: "GPSAntennaState",
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
        label: "终端出区域报警",
        value: "outAreaAlarm",
      },
      {
        label: "终端进区域报警",
        value: "inAreaAlarm",
      },
      {
        label: "进出围栏报警",
        value: "inRegionAlarm,outRegionAlarm",
      },
      {
        label: "超出区域报警",
        value: "outAdminAreaAlarm",
      },
      {
        label: "圆形区域报警",
        value: "outCircleAlarm",
      },
      {
        label: "异常停留报警",
        value: "abnormalStayAlarm",
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
        label: "ACAR蓝牙报警",
        value: "acarBts",
      },
      {
        label: "BCAR蓝牙报警",
        value: "bcarBts",
      },
      {
        label: "伪基站报警",
        value: "pseudoLbs",
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

    const OBD_option = ref([
      {
        label: "OBD碰撞报警",
        value: "obdCollision",
      },
      {
        label: "OBD拖车报警",
        value: "obdTrailer",
      },
      {
        label: "OBD翻车报警",
        value: "obdRollover",
      },
      {
        label: "OBD低电压报警",
        value: "obdLowVoltage",
      },
      {
        label: "汽车点火上报",
        value: "obdIgnition",
      },
      {
        label: "汽车熄火上报",
        value: "obdFlameOut",
      },
      {
        label: "车机拔出报警(带电池)",
        value: "obdPullOut",
      },
      {
        label: "车机插上报警(带电池)",
        value: "obdPlugIn",
      },
      {
        label: "定位过长报警",
        value: "obdPosLong",
      },
      {
        label: "怠速过长报警",
        value: "obdIdleLong",
      },
      {
        label: "GID FLASH 故障报警",
        value: "obdFlash",
      },
      {
        label: "GID CAN 模块故障报警",
        value: "obdCAN",
      },
      {
        label: "GID 3D 传感器故障报警",
        value: "obd3D",
      },
      {
        label: "GID GPS 模块故障报警",
        value: "obdGPS",
      },
    ]);

    const LOCK_option = ref([
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
    ]);

    const options = ref<{
      label: string;
      value: string
    }[]>(
      props.type === "ALARM"
        ? ALARM_options.value
        : props.type === "OBD"
        ? OBD_option.value
        : props.type === "LOCK"
        ? LOCK_option.value
        : []
    );

    const shooModal = () => {
      visible.value = true;

      checkedlist.value = checkedFlag.value.length === 0 ? [] : props.value;
      checkAllVal.value = checkedFlag.value.length === options.value.length;
    };

    // 全选
    const checkAllVal = ref(false);
    const changeAll = (e: any) => {
      checkAllVal.value = e.target.checked;
      if (e.target.checked) {
        checkedlist.value = options.value.map((i) => i.value);
      } else {
        checkedlist.value = [];
      }
    };

    // 多选组变化
    const listChange = () => {
      checkAllVal.value = checkedlist.value.length === options.value.length;
    };

    const submit = () => {
      checkedFlag.value = checkedlist.value;
      emit("update:value", checkedlist.value);
      visible.value = false;
    };

    return {
      visible,
      shooModal,
      changeAll,
      checkAllVal,
      checkedlist,
      checkedFlag,
      options,
      listChange,
      submit,
    };
  },
});
</script>
<style lang="less" scoped>
.active {
  color: #3381e8;
  background-color: #fff;
  border-color: #3381e8;
}
.ant-checkbox-group {
  ::v-deep(.ant-checkbox-wrapper) {
    width: 33.3%;
    min-width: 150px;
    line-height: 30px;
    margin: 0;
  }
}
</style>
