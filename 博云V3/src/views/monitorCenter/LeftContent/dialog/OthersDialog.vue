<template>
  <Eldialog
    v-bind="$attrs"
    :title="title"
    :titleTip="titleTip"
    :width="width"
    :dialogTop="dialogTop"
  >
    <template
      v-slot:all
      v-if="['OBD数据', '清除紧急报警', '断开油电', '恢复油电', '定时回传', '设置回传时间', '录音', '电话回拨', '开锁', '关锁', '里程保养设置', '里程重置'].includes(DialogType)"
    >
      <OBD
        v-bind="$attrs"
        :vehInfo="vehInfo"
        v-if="['OBD数据'].includes(DialogType)"
      />
      <RemoveAlarm
        v-bind="$attrs"
        v-if="['清除紧急报警'].includes(DialogType)"
      />
      <CutOffOilElectricity
        v-bind="$attrs"
        :vehInfo="vehInfo"
        :command="command"
        v-if="['断开油电'].includes(DialogType)"
      />
      <RestoreOilElectricity
        v-bind="$attrs"
        :vehInfo="vehInfo"
        :command="command"
        v-if="['恢复油电'].includes(DialogType)"
      />
      <TimingBack
        v-bind="$attrs"
        :vehInfo="vehInfo"
        :command="command"
        v-if="['定时回传'].includes(DialogType)"
      />
      <BackTimeSetting
        v-bind="$attrs"
        :vehInfo="vehInfo"
        :command="command"
        v-if="['设置回传时间'].includes(DialogType)"
      />
      <Recoeding
        v-bind="$attrs"
        :vehInfo="vehInfo"
        :command="command"
        v-if="['录音'].includes(DialogType)"
      />
      <BackDial
        v-bind="$attrs"
        :vehInfo="vehInfo"
        :command="command"
        v-if="['电话回拨'].includes(DialogType)"
      />
      <OpenLock
        v-bind="$attrs"
        v-if="['开锁'].includes(DialogType)"
      />
      <CloseLock
        v-bind="$attrs"
        v-if="['关锁'].includes(DialogType)"
      />
      <MileageResert
        v-bind="$attrs"
        :vehInfo="vehInfo"
        :command="command"
        v-if="['里程重置'].includes(DialogType)"
      />
      <MileageMaintenance
        v-bind="$attrs"
        v-if="['里程保养设置'].includes(DialogType)"
      />
    </template>
    <template
      v-slot:form
      v-else
    >
      <OverSpeed
        :isGroup="isGroup"
        v-bind="$attrs"
        :vehInfo="vehInfo"
        :groupInfo="groupInfo"
        :command="command"
        v-if="['超速设置'].includes(DialogType)"
      />
      <ScheduSend
        v-bind="$attrs"
        :vehInfo="vehInfo"
        :command="command"
        v-if="['调度下发'].includes(DialogType)"
      />
      <TimeZone
        v-bind="$attrs"
        :vehInfo="vehInfo"
        :command="command"
        v-if="['时区设置'].includes(DialogType)"
      />
      <ServerSetting
        v-bind="$attrs"
        :vehInfo="vehInfo"
        :command="command"
        v-if="['服务器参数设置'].includes(DialogType)"
      />
      <BindCitys
        :isGroup="isGroup"
        :groupInfo="groupInfo"
        :vehInfo="vehInfo"
        v-bind="$attrs"
        v-if="['绑定省市区'].includes(DialogType)"
      />
      <WireLessBack
        :isGroup="isGroup"
        v-bind="$attrs"
        :vehInfo="vehInfo"
        :groupInfo="groupInfo"
        :command="command"
        v-if="['无线回传'].includes(DialogType)"
      />
      <TrafficSearch
        v-bind="$attrs"
        v-if="['流量查询'].includes(DialogType)"
      />
      <Acar
        v-bind="$attrs"
        :vehInfo="vehInfo"
        :command="command"
        v-if="['Acar设置'].includes(DialogType)"
      />
      <A5M
        v-bind="$attrs"
        :vehInfo="vehInfo"
        :command="command"
        v-if="['A5M设置'].includes(DialogType)"
      />
      <WorkModel
        v-bind="$attrs"
        :vehInfo="vehInfo"
        :command="command"
        v-if="['工作模式'].includes(DialogType)"
      />
      <Settlement
        v-bind="$attrs"
        :vehicleId="vehInfo.V"
        settleType="settle"
        v-if="['结清'].includes(DialogType)"
      />
      <APN
        v-bind="$attrs"
        :vehInfo="vehInfo"
        :command="command"
        v-if="['APN参数设置'].includes(DialogType)"
      />
      <SettlementBack
        v-bind="$attrs"
        :vehicleId="vehInfo.V"
        settleType="settleBack"
        v-if="['结清撤回'].includes(DialogType)"
      />
      <SendInstruction
        v-bind="$attrs"
        v-if="['指令下发'].includes(DialogType)"
      />
      <RecordingLibrary
        v-bind="$attrs"
        :vehInfo="vehInfo"
        v-if="['录音库'].includes(DialogType)"
      />
      <PhotoLibrary
        v-bind="$attrs"
        :vehInfo="vehInfo"
        v-if="['照片库'].includes(DialogType)"
      />
      <Switch
        v-bind="$attrs"
        :DialogType="DialogType"
        :vehInfo="vehInfo"
        :command="command"
        v-if="['震动报警开关', '碰撞报警开关', '自动录音开关'].includes(DialogType)"
      />
    </template>
  </Eldialog>
</template>
<script lang="ts">
import {
  defineComponent,
  toRefs,
  defineAsyncComponent,
  ref,
  watch,
  computed,
  reactive,
  onUpdated,
} from "vue";
import Eldialog from "@/components/Eldialog/index.vue";
export default defineComponent({
  components: {
    Eldialog,
    Switch: defineAsyncComponent(() => import("./contents/Switch/index.vue")),
    OverSpeed: defineAsyncComponent(
      () => import("./contents/OverSpeed/index.vue")
    ),
    ScheduSend: defineAsyncComponent(
      () => import("./contents/ScheduSend/index.vue")
    ),
    TimeZone: defineAsyncComponent(
      () => import("./contents/TimeZone/index.vue")
    ),
    ServerSetting: defineAsyncComponent(
      () => import("./contents/ServerSetting/index.vue")
    ),
    BindCitys: defineAsyncComponent(
      () => import("./contents/BindCitys/index.vue")
    ),
    WireLessBack: defineAsyncComponent(
      () => import("./contents/WireLessBack/index.vue")
    ),
    TrafficSearch: defineAsyncComponent(
      () => import("./contents/TrafficSearch/index.vue")
    ),
    OBD: defineAsyncComponent(() => import("./contents/OBD/index.vue")),
    Acar: defineAsyncComponent(() => import("./contents/Acar/index.vue")),
    A5M: defineAsyncComponent(() => import("./contents/A5M/index.vue")),
    WorkModel: defineAsyncComponent(
      () => import("./contents/WorkModel/index.vue")
    ),
    RemoveAlarm: defineAsyncComponent(
      () => import("./contents/RemoveAlarm/index.vue")
    ),
    Settlement: defineAsyncComponent(
      () => import("./contents/Settlement/index.vue")
    ),
    CutOffOilElectricity: defineAsyncComponent(
      () => import("./contents/CutOffOilElectricity/index.vue")
    ),
    RestoreOilElectricity: defineAsyncComponent(
      () => import("./contents/RestoreOilElectricity/index.vue")
    ),
    TimingBack: defineAsyncComponent(
      () => import("./contents/TimingBack/index.vue")
    ),
    BackTimeSetting: defineAsyncComponent(
      () => import("./contents/BackTimeSetting/index.vue")
    ),
    APN: defineAsyncComponent(() => import("./contents/APN/index.vue")),
    Recoeding: defineAsyncComponent(
      () => import("./contents/Recording/index.vue")
    ),
    BackDial: defineAsyncComponent(
      () => import("./contents/BackDial/index.vue")
    ),
    OpenLock: defineAsyncComponent(
      () => import("./contents/OpenLock/index.vue")
    ),
    CloseLock: defineAsyncComponent(
      () => import("./contents/CloseLock/index.vue")
    ),
    MileageResert: defineAsyncComponent(
      () => import("./contents/MileageResert/index.vue")
    ),
    MileageMaintenance: defineAsyncComponent(
      () => import("./contents/MileageMaintenance/index.vue")
    ),
    SettlementBack: defineAsyncComponent(
      () => import("./contents/Settlement/index.vue")
    ),
    SendInstruction: defineAsyncComponent(
      () => import("./contents/SendInstruction/index.vue")
    ),
    RecordingLibrary: defineAsyncComponent(
      () => import("./contents/RecordingLibrary/index.vue")
    ),
    PhotoLibrary: defineAsyncComponent(
      () => import("./contents/PhotoLibrary/index.vue")
    ),
  },
  props: {
    vehInfo: {
      type: Object,
      default: null,
    },
    DialogType: {
      type: String,
      default: "",
    },
    title: {
      type: String,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    groupInfo: {
      type: Object,
      default: () => {},
    },
    command: {
      type: Object,
      default: () => null,
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      titleTip: "",
    });
    watch(
      () => props.DialogType,
      (val) => {
        data.titleTip = "";
        switch (val) {
          case "无线回传":
            data.titleTip =
              "优先级：定时模式>星期模式>闹钟模式,若设置多个模式，按优先级生效第一个";
            break;
          default:
            break;
        }
      },
      {
        immediate: true,
      }
    );
    const dialogTop = computed(() => {
      if (
        [
          "清除紧急报警",
          "断开油电",
          "恢复油电",
          "定时回传",
          "设置回传时间",
          "录音",
          "电话回拨",
          "开锁",
          "关锁",
          "里程重置",
          "里程保养设置",
        ].includes(props.DialogType)
      ) {
        return "35vh";
      } else {
        return "15vh";
      }
    });
    const width = computed(() => {
      if (["OBD数据"].includes(props.DialogType)) {
        return "680px";
      } else if (["无线回传"].includes(props.DialogType)) {
        return "640px";
      } else if (["工作模式"].includes(props.DialogType)) {
        return "600px";
      } else if (
        [
          "清除紧急报警",
          "断开油电",
          "恢复油电",
          "定时回传",
          "设置回传时间",
          "录音",
          "电话回拨",
          "开锁",
          "关锁",
          "里程重置",
          "里程保养设置",
          "震动报警开关",
          "震动报警开关",
          "碰撞报警开关",
          "自动录音开关",
        ].includes(props.DialogType)
      ) {
        return "380px";
      } else {
        return "630px";
      }
    });
    return {
      width,
      dialogTop,
      ...toRefs(props),
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
</style>