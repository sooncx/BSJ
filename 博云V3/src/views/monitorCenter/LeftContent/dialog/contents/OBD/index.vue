<template>
  <div class="title">
    <p>OBD数据</p>
    <div>{{second}}</div>
    <span>秒后刷新</span>
    <i
      class="iconfont icon-refresh"
      @click="refleshFn"
    ></i>
    <span
      class="tip"
      v-if="showTip"
    >刷新成功</span>
  </div>
  <div class="OBD">
    <div
      class="item"
      v-for="(item, index) in [...list.values()]"
      :key="index"
    >
      <div>
        <p>{{item.label}}</p>
        <span>{{format(item.value, item)}}</span>
      </div>
    </div>
  </div>
  <div class="footer">
    <span class="dialog-footer">
      <!-- 用于布局的无用dom -->
      <span></span>
      <span>
        <el-button @click="$emit('update:visible', false)">关 闭</el-button>
      </span>
    </span>
  </div>
</template>
<script lang="ts">
import { values } from "lodash";
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  toRefs,
  watch,
  nextTick,
} from "vue";
import { useFunction } from "../../../../function";
const arr: any = [
  ["plate", { label: "车牌号码:", value: "--" }],
  ["barometricPressure", { label: "大气压:", value: "--" }],
  ["engineErrorNum", { label: "发动机故障码个数:", value: "--" }],
  ["engineLoad", { label: "发动机负荷:", value: "--" }],
  ["engineRPM", { label: "发动机转速:", value: "--" }],
  [
    "engineRunTime",
    { label: "发动机启动后运行时间(s):", value: "--", unit: "秒" },
  ],
  [
    "environmentTemperature",
    { label: "车辆环境温度:", value: "--", unit: "℃" },
  ],
  ["faultMileage", { label: "故障行驶里程:", value: "--", unit: "米" }],
  ["fuelLevel", { label: "剩余油量:", value: "--", unit: "%" }],
  ["fuelPressure", { label: "燃油压力:", value: "--" }],
  ["fuelTrim", { label: "长期燃油修正:", value: "--" }],
  ["intakePressure", { label: "进气歧管压力:", value: "--" }],
  ["lampStatus", { label: "故障码灯状态:", value: "--" }],
  ["mileageType", { label: "里程类型:", value: "--" }],
  ["pedalPosition", { label: "油门踏板位置:", value: "--" }],
  ["sensorAir", { label: "空气流量:", value: "--" }],
  ["sparkAngle", { label: "点火提前角:", value: "--" }],
  ["speed", { label: "速度:", value: "--", unit: "km/h" }],
  ["temperatureAir", { label: "进气口温度:", value: "--", unit: "℃" }],
  ["temperatureCoolant", { label: "水箱温度:", value: "--", unit: "℃" }],
  ["throttleSensor", { label: "绝对节气门位置传感器:", value: "--" }],
  ["totalConsumption", { label: "总燃油油耗能量:", value: "--" }],
  ["totalMileage", { label: "总里程:", value: "--", unit: "公里" }],
  ["voltage", { label: "电瓶电压:", value: "", unit: "V" }],
];
export default defineComponent({
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    vehInfo: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const { getOBDVehicleInfo } = useFunction();
    const data = reactive({
      showTip: false,
      second: 10,
      list: new Map(arr),
      timer: null as any,
      rules: {},
      refleshFn() {
        setTimeout(() => {
          data.showTip = true;
        }, 500);
        setTimeout(() => {
          data.showTip = false;
        }, 2000);
        data.reflesh();
      },
      reflesh() {
        data.list = new Map(arr);
        data.second = 10;
        data.timer && window.clearInterval(data.timer);
        data.getOBDData();
        data.timer = setInterval(() => {
          if (data.second == 0) {
            setTimeout(() => {
              data.showTip = true;
            }, 500);
            setTimeout(() => {
              data.showTip = false;
            }, 2000);
            data.reflesh();
            return;
          }
          data.second--;
        }, 1000);
      },
      format(value: any, item: any) {
        if (item.unit) {
          return value + item.unit;
        }
        return value;
      },
      async getOBDData() {
        const res = await getOBDVehicleInfo({
          vehicleId: props.vehInfo.V,
        });
        if (res) {
          const obj = { ...res, plate: props.vehInfo.P };
          for (let i in obj) {
            data.list.set(i, {
              unit: (data.list.get(i) as any).unit || null,
              label: (data.list.get(i) as any).label,
              value: obj[i],
            });
          }
        }
      },
    });
    nextTick(() => {
      data.showTip = false;
      data.list = new Map(arr);
      watch(
        () => props.visible,
        (val) => {
          if (val) {
            data.reflesh();
          } else {
            data.timer && window.clearInterval(data.timer);
          }
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
.OBD {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  display: flex;
  padding: 20px 16px;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .item {
    height: 30px;
    width: 45%;
    display: flex;
    div {
      display: flex;
      align-items: center;
      p {
        min-width: 160px;
        margin-right: 10px;
        text-align: right;
        color: #b1b1b1;
      }
      span {
        max-width: 180px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
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
.title {
  height: 50px;
  width: 100%;
  padding: 0px 16px;
  display: flex;
  border-bottom: 1px solid #e4e7eb;
  align-items: center;
  div {
    font-size: 12px;
    width: 15px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    color: #0e60db;
    text-align: right;
  }
  p {
    font-size: 15px;
    font-family: PingFang SC, PingFang SC-Bold;
    font-weight: 700;
    color: #0e60db;
    padding-right: 12px;
  }
  span {
    font-size: 12px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    color: #999999;
  }
  i {
    font-size: 12px;
    cursor: pointer;
    margin-left: 10px;
    color: #0e60db;
    &:hover {
      color: #5398ff;
    }
    &:active {
      transform: rotate(-720deg);
      transition: all 1s;
    }
  }
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
.tip {
  color: rgb(1, 167, 1) !important;
  padding-left: 10px;
}
</style>