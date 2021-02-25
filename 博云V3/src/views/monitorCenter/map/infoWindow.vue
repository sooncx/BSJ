<template>
  <div class="infoWindow">
    <div class="header">
      <div class="plateLine">
        <span class="plate">{{ selectedVeh && selectedVeh.P }}</span>
        <span class="other">
          [
          <span class="state">{{selectedVeh && selectedVeh.T}}</span>
          {{selectedVeh && selectedVeh.E != ''?' / ':''}}
          <span
            class="charge"
            :class="{
              chargeL:selectedVeh && selectedVeh.E != '' && parseInt(selectedVeh.E) < 30,
              chargeH:selectedVeh && selectedVeh.E != '' && parseInt(selectedVeh.E) >= 30,
            }"
            v-if="selectedVeh && selectedVeh.E != ''"
          >{{selectedVeh && '电量: ' + selectedVeh.E + "%"}}</span>
          ]
        </span>
        <i
          v-if="selectedVeh && selectedVeh.CL"
          class="iconfont"
          :class="getLevel(selectedVeh.CL)"
        ></i>
        <el-tooltip
          v-if="selectedVeh && selectedVeh.voltage"
          class="item"
          effect="light"
          :content="chargeLevel(selectedVeh.voltage)"
          placement="top"
        >
          <i
            :style="{cursor:'help'}"
            class="iconfont"
            :class="getChargeType(selectedVeh.longStayTer, selectedVeh.voltage)"
          ></i>
        </el-tooltip>
        <i
          v-else-if="selectedVeh"
          class="iconfont"
          :class="getChargeType(selectedVeh.longStayTer, selectedVeh.voltage)"
        ></i>
      </div>
      <div
        @click="infoWindowFn($event, {label: 'OBD数据'})"
        class="obdBtn"
        v-if="selectedVeh && selectedVeh.T == 'OCAR-5'"
      >
        OBD数据
      </div>
      <div
        class="closeBtn"
        @click="closeInfoWindow"
      >
        <i class="iconfont icon-guanbi1"></i>
      </div>
    </div>
    <div class="content">
      <div class="content__items">
        <div>
          速度: <span>{{ otherFormat(selectedVeh, "S", "km/h") }}</span>
        </div>
      </div>
      <div
        class="content__items"
        v-if="selectedVeh && selectedVeh.longStayTer != 0"
      >
        <div>
          里程: <span>{{ mileFormat(selectedVeh, "L", "km") }}</span>
        </div>
      </div>
      <div class="content__items">
        <div>
          定位: <span>{{ localFormat(selectedVeh, "G") }}</span>
        </div>
      </div>
      <div class="content__items">
        <div>
          {{ stateFormat(selectedVeh, "Z") }}
          <span>{{ otherFormat(selectedVeh, "d") }}</span>
        </div>
      </div>
      <div
        class="content__items"
        v-if="directFormat(selectedVeh, 'F') != '--'"
      >
        <div>
          方向: <span>{{ directFormat(selectedVeh, "F") }}</span>
        </div>
      </div>
      <div
        class="content__items"
        v-if="otherFormat(selectedVeh, 'R') != '--'"
      >
        <div>
          信号时间: <span>{{ otherFormat(selectedVeh, "R") }}</span>
        </div>
      </div>
      <div
        class="content__items"
        v-if="otherFormat(selectedVeh, 'PT') != '--'"
      >
        <div>
          定位时间: <span>{{ otherFormat(selectedVeh, "PT") }}</span>
        </div>
      </div>
      <div
        class="content__items"
        v-if="alarmFormat(selectedVeh, 'B') != '--'"
      >
        <div class="alarm">
          报警: <span>{{ alarmFormat(selectedVeh, "B") }}</span>
        </div>
      </div>
    </div>
    <div class="footer">
      <div
        v-for="item in footerOptions"
        :key="item"
        class="items"
      >
        <div
          @click.stop="infoWindowFn($event, item)"
          v-if="['设置', '区域', '关注'].includes(item.label)"
        >
          <i
            class="iconfont optionsBtn"
            :class="[item.icon]"
          ></i>
          <div class="optionsBtn">{{ item.label }}</div>
        </div>
        <div
          @click="infoWindowFn($event, item)"
          v-else-if="!['轨迹'].includes(item.label)"
        >
          <i
            class="iconfont optionsBtn"
            :class="[item.icon, item.open ? 'iconOn' : '']"
          ></i>
          <div
            class="optionsBtn"
            :class="item.open ? 'iconOn' : ''"
          >
            {{ item.label }}
          </div>
        </div>
        <el-popover
          placement="bottom"
          :width="80"
          trigger="hover"
          v-else
          popper-class="trackPopver"
        >
          <template #reference>
            <div>
              <i
                class="iconfont optionsBtn"
                :class="[item.icon, item.open ? 'iconOn' : '']"
              ></i>
              <div
                class="optionsBtn"
                :class="item.open ? 'iconOn' : ''"
              >
                {{ item.label }}
              </div>
            </div>
          </template>
          <div class="trackBtn">
            <span @click="infoWindowFn($event, item, 'amap')">高德地图</span>
            <span @click="infoWindowFn($event, item, 'bmap')">百度地图</span>
          </div>
        </el-popover>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  watch,
  defineAsyncComponent,
  onMounted,
  inject,
  onUnmounted,
  nextTick,
  onUpdated,
} from "vue";
import router from "@/router";
import { TwoCoordinateAzimuth } from "@/assets/js/base";
import lodash from "lodash";
export default defineComponent({
  components: {
    // OptionsMene: defineAsyncComponent(
    //   () => import("@/components/OptionsMenu/index.vue")
    // ),
  },
  props: {
    selectedVeh: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, { emit }) {
    let updateSelectedAllVehs = inject("updateSelectedAllVehs") as Function;
    let updateSelectedVeh = inject("updateSelectedVeh") as Function; // 修改选中车辆
    let timer = null as any;
    let mapType = inject("mapType") as any;
    const data = reactive({
      options: [
        {
          value: "1",
          label: "多边形",
          children: [
            {
              value: "1-1",
              label: "查看",
            },
            {
              value: "1-2",
              label: "设置",
            },
          ],
        },
        {
          value: "2",
          label: "圆形",
          children: [
            {
              value: "2-1",
              label: "查看",
            },
            {
              value: "2-2",
              label: "200米半径",
            },
            {
              value: "2-3",
              label: "自定义半径",
            },
            {
              value: "2-4",
              label: "删除",
            },
          ],
        },
        {
          value: "3",
          label: "停留点",
          children: [
            {
              value: "3-1",
              label: "查看",
            },
            {
              value: "3-2",
              label: "设置",
            },
            {
              value: "3-3",
              label: "删除",
            },
          ],
        },
        {
          value: "4",
          label: "绑定省市区",
        },
        {
          value: "5",
          label: "添加位置点",
        },
      ],
      attentionList: ["高", "中", "低", "修改备注", "清除关注"],
      chargeLevel(level: any) {
        if (!level) return;
        if (Number(level) >= 3.95) {
          return "电量充足";
        } else if (Number(level) >= 3.8) {
          return "电量适中";
        } else {
          return "电量不足";
        }
      },
      getChargeType(type: any, level: any) {
        let icon = "";
        let color = "";
        if (type == 0) {
          icon = "icon-youxian charge";
        } else if (type == 1) {
          icon = "icon-quedian- charge";
        }
        if (!level) {
          color = "";
        } else if (Number(level) >= 3.95) {
          color = "chargeH";
        } else if (Number(level) >= 3.8) {
          color = "chargeM";
        } else {
          color = "chargeL";
        }
        return [icon, color].join(" ");
      },
      getLevel(level: any) {
        switch (level) {
          case 1:
            return "icon-gao levelH";
            break;
          case 2:
            return "icon-zhong levelM";
            break;
          case 3:
            return "icon-di levelL";
            break;
          default:
            return "";
            break;
        }
      },
      footerOptions: [
        {
          label: "跟踪",
          icon: "icon-genzong",
          open: false,
        },
        {
          label: "轨迹",
          icon: "icon-guiji",
        },
        {
          label: "街景",
          icon: "icon-jiejing",
        },
        {
          label: "设置",
          icon: "icon-shezhi1",
        },
        {
          label: "区域",
          icon: "icon-weizhi",
        },
        {
          label: "关注",
          icon: "icon-attention",
        },
      ],
      directFormat(val: any, prop: string) {
        if (!val) return "--";
        let direct = val[prop];
        if (isNaN(parseFloat(direct))) return "--";
        let sum = parseFloat(direct) / 90;
        let rotate = (parseFloat(direct) % 90).toFixed(0);
        if (sum == 0) {
          return "正北方向";
        }
        if (sum <= 1) {
          return sum == 1 ? "正东方向" : "北偏东" + rotate + "度";
        } else if (sum <= 2) {
          return sum == 2 ? "正南方向" : "东偏南" + rotate + "度";
        } else if (sum <= 3) {
          return sum == 3 ? "正西方向" : "南偏西" + rotate + "度";
        } else {
          return sum == 4 ? "正北方向" : "西偏北" + rotate + "度";
        }
      },
      otherFormat(val: any | number, prop: string, unit = "") {
        if (!val || [null, undefined, "", " "].includes(val[prop])) return "--";
        return val[prop] + unit;
      },
      mileFormat(val: any | number, prop: string, unit = "") {
        if (
          !val ||
          [null, undefined, "", " "].includes(val[prop]) ||
          val[prop] < 0
        )
          return "--";
        if (val[prop] == 0) {
          return "0km";
        }
        return parseFloat(val[prop].toFixed(1)) / 1000 + unit;
      },
      localFormat(val: any, prop: string) {
        if ([null, undefined, "", " "].includes(val)) return "--";
        switch (val[prop].toString()) {
          case "0":
            return "GPS信号弱";
            break;
          case "1":
            return "卫星";
            break;
          case "2":
            return "WIFI";
            break;
          case "3":
            return "多基站";
            break;
          case "4":
            return "单基站";
            break;
          case "5":
            return "混合定位";
            break;
          default:
            return "--";
            break;
        }
      },
      stateFormat(val: any, prop: string) {
        if ([null, undefined, "", " "].includes(val)) return "--";
        switch (val[prop].toString()) {
          case "0":
            return "离线:";
            break;
          case "1":
            return "行驶:";
            break;
          case "2":
            return "停车:";
            break;
          case "3":
            return "从未上线";
            break;
          case "4":
            return "过期:";
            break;
          default:
            return "状态:";
            break;
        }
      },
      timeFormat(val: any, prop1: string, prop2: string) {
        if ([null, undefined, "", " "].includes(val)) return "--";
        switch (val[prop1].toString()) {
          case "0":
            return val[prop2];
            break;
          case "1":
            return val[prop2];
            break;
          case "2":
            return val[prop2];
            break;
          case "3":
            return "";
            break;
          case "4":
            return val[prop2];
            break;
          default:
            return "--";
            break;
        }
      },
      alarmFormat(val: any, prop: string) {
        if ([null, undefined, "", " "].includes(val) || !val[prop]) return "--";
        const obj: any = JSON.parse(val[prop]);
        return obj.name;
      },
    });
    watch(
      mapType,
      (val) => {
        // 切换地图关闭追踪
        timer && window.clearInterval(timer);
      },
      {
        immediate: true,
      }
    );
    // 监听当前选中车辆,切换车辆关闭追踪
    watch(
      () => props.selectedVeh,
      (val, old: any) => {
        if (!val || (val && old && val.V != old.V)) {
          data.footerOptions[0].open = false;
          timer && window.clearInterval(timer);
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );
    function closeInfoWindow() {
      emit("closeInfoWindow");
    }
    function jump(mapType: string) {
      let routeData = router.resolve({
        path: "playBack",
        // query: { vehInfo: JSON.stringify(props.selectedVeh) },
        query: {
          vehicleId: props.selectedVeh.V,
          plate: props.selectedVeh.P,
          time: props.selectedVeh.R,
          mapType: mapType,
        },
      });
      window.open(routeData.href, "_blank");
    }
    function testChange(veh: any) {
      let path = [{ lat: veh.Y, lng: veh.X }];
      timer = setInterval(async () => {
        path.push({
          lat: veh.Y + Math.random() / 100,
          lng: veh.X + Math.random() / 100,
        });
        let oldVeh = JSON.parse(JSON.stringify(veh));
        oldVeh.Y = path[path.length - 1].lat;
        oldVeh.X = path[path.length - 1].lng;
        if (path.length > 1) {
          oldVeh.F = TwoCoordinateAzimuth(
            {
              lat: path[path.length - 2].lat,
              lng: path[path.length - 2].lng,
            },
            {
              lat: path[path.length - 1].lat,
              lng: path[path.length - 1].lng,
            }
          );
        }
        await updateSelectedVeh({ ...oldVeh });
        const test = new Map();
        test.set(oldVeh.V, { ...oldVeh });
        await updateSelectedAllVehs(test);
      }, 2000);
    }
    function infoWindowFn(event: any, item: any, mapType = "amap") {
      switch (item.label) {
        case "跟踪":
          item.open = !item.open;
          data.footerOptions[0].open = item.open;
          // if (item.open) {
          //   testChange(props.selectedVeh);
          // } else {
          //   timer && window.clearInterval(timer);
          // }
          break;
        case "轨迹":
          jump(mapType);
          break;
        default:
          break;
      }
      emit("infoWindowFn", event, item);
    }
    onUnmounted(() => {
      timer && window.clearInterval(timer);
    });
    return {
      infoWindowFn,
      ...toRefs(data),
      closeInfoWindow,
    };
  },
});
</script>
<style lang="less" scoped>
.infoWindow {
  width: 400px;
  background: #fff;
  box-shadow: 0 10px 20px 2px rgba(0, 0, 0, 0.294);
  .header {
    height: 38px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    .plateLine {
      .plate {
        font-size: 14px;
        font-family: PingFang SC Bold, PingFang SC Bold-Bold;
        font-weight: 700;
        color: #333333;
      }
      .other {
        font-size: 12px;
        font-family: PingFang SC Bold, PingFang SC Bold-Bold;
        color: #333333;
        position: relative;
        top: -1px;
      }
      i {
        padding-left: 5px;
      }
    }
    .obdBtn {
      color: rgb(2, 145, 211);
      cursor: pointer;
      margin-left: auto;
      margin-right: 10px;
      font-size: 12px;
      margin-top: 2px;
      &:hover {
        color: rgb(45, 167, 223) !important;
      }
    }
    .closeBtn {
      i {
        cursor: pointer;
        font-size: 12px;
        color: #666666;
        &:hover {
          color: red;
        }
      }
    }
  }
  .content {
    border-top: 1px solid #ededed;
    border-bottom: 1px solid #ededed;
    flex: 1;
    width: 100%;
    padding: 10px;
    flex-wrap: wrap;
    display: flex;

    &__items {
      &:nth-child(1) {
        width: 50%;
      }
      &:nth-child(2) {
        width: 50%;
      }
      &:nth-child(3) {
        width: 50%;
      }
      &:nth-child(4) {
        width: 50%;
      }
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 30px;
      width: 100%;
      div {
        font-size: 14px;
        flex: 5;
        color: #666;
        span {
          color: #333333;
        }
      }
      .alarm {
        color: red;
        line-height: 20px;
        span {
          color: red;
        }
      }
    }
  }
  .footer {
    height: 60px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    .items {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #075ed2;
      i {
        cursor: pointer;
        padding-bottom: 5px;
      }
      div {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        div {
          font-size: 12px;
          font-family: PingFang SC Medium, PingFang SC Medium-Medium;
          font-weight: 500;
        }
      }
      &:hover {
        color: rgb(28, 172, 255) !important;
      }
    }
    &::after {
      content: "";
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid #fff;
      position: absolute;
      bottom: -10px;
    }
  }
}
.trackBtn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  span {
    padding: 3px 0;
    cursor: pointer;
    &:hover {
      color: blue;
    }
  }
}
.levelH {
  color: #cf1c24;
}
.levelM {
  color: #ff841f;
}
.levelL {
  color: #00c45c;
}
.iconOn {
  color: #cf1c24;
}
.charge {
  color: #075ed2;
}
.chargeH {
  color: #00ad0d !important;
}
.chargeM {
  color: #ff841f !important;
}
.chargeL {
  color: #d8463a !important;
}
</style>
<style lang="less">
.trackPopver {
  padding: 5px 2px !important;
}
</style>