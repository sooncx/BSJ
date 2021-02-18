<template>
  <div class="associate">
    <div class="associate_header">
      <div class="title">
        设备列表 {{ "( " + tableList.length + " / " + tableList.length + " )" }}
      </div>
      <el-tooltip
        placement="top"
        effect="light"
      >
        <template #content>
          <div class="tip">
            如果您的车牌号填写的内容包含标准的车牌。我们则推算为同一辆车。例如：“李磊
            粤A12345 有线”与 “粤A12345 无线1 后备箱”在同一辆车上
          </div>
        </template>
        <i class="iconfont icon-yiwen"></i>
      </el-tooltip>
      <el-tooltip
        placement="top"
        effect="light"
      >
        <template #content>
          <div class="tip">
            此车辆关联设备列表根据<span>{{ carType }}匹配</span>
          </div>
        </template>
        <div class="typeBtn">{{ carType }}</div>
      </el-tooltip>
      <i
        class="iconfont icon-up"
        :class="showList ? 'icon_dowm' : 'icon_up'"
        @click="zoom"
      ></i>
    </div>
    <div
      class="associate_content"
      :class="showList ? 'showList' : 'hideList'"
    >
      <div
        class="vehItem"
        v-for="(item, index) in tableList"
        :key="index"
        @click="handelVeh(item)"
        @mouseenter="showDetail($event, item)"
        @mouseleave="hideDetail()"
      >
        <i class="iconfont icon-car"></i>
        {{
          item.P + "(" + getVehState(item.Z, item.d, item.timeInterval) + ")"
        }}
      </div>
    </div>
  </div>
  <div class="associate_detailBox">
    <div
      class="items"
      v-if="choseVeh && choseVeh.V == tableList[0].V"
    >
      左侧列表最后选中车辆
    </div>
    <div
      v-else
      class="items"
      v-for="(item, index) in detailList"
      :key="index"
    >
      <div class="label">{{ item.label }}</div>
      <div class="detail">{{ item.value }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject, reactive, toRefs, watch } from "vue";
import { message } from "ant-design-vue";
import GPS from "@/assets/js/GPS";
export default defineComponent({
  props: {
    selectedVeh: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    let associatedVehs = inject("associatedVehs");
    let updateChoseAssociatedVehs = inject(
      "updateChoseAssociatedVehs"
    ) as Function;
    const data = reactive({
      carType: "",
      showList: false,
      choseVeh: null,
      tableList: [] as any,
      detailList: [
        {
          label: "信号时间:",
          value: "",
        },
        {
          label: "定位:",
          value: "",
        },
        {
          label: "车辆状态:",
          value: "",
        },
        // {
        //   label: "报警:",
        //   value: "",
        // },
        // {
        //   label: "距离目标设备:",
        //   value: "",
        // },
      ],
      handelVeh(veh: any) {
        if (!veh.X || !veh.Y) {
          message.warning("车辆不可选");
          return;
        }
        // data.carType = veh.carType == 0 ? "车牌" : "车架号";
        updateChoseAssociatedVehs({ ...veh });
      },
      zoom() {
        data.showList = !data.showList;
      },
      getVehState(state: number, time: string, timeInterval: string) {
        if (timeInterval) {
          return "[" + timeInterval + "回传]";
        }
        switch (state) {
          case 0:
            return "离线" + time;
            break;
          case 1:
            return "行驶" + time;
            break;
          case 2:
            return "停车" + time;
            break;
          case 3:
            return "从未上线";
            break;
          case 4:
            return "过期";
            break;
          default:
            break;
        }
      },
      getLocation(state: number) {
        switch (state) {
          case 0:
            return "不定位";
            break;
          case 1:
            return "GPS";
            break;
          case 2:
            return "WIFI";
            break;
          case 3:
            return "多基站";
            break;
          case 4:
            return "单基站";
            break;
          default:
            return "不定位";
            break;
        }
      },
      getState(state: number) {
        switch (state) {
          case 0:
            return "从未上线";
            break;
          case 1:
            return "行驶";
            break;
          case 2:
            return "停车";
            break;
          case 3:
            return "离线";
            break;
          case 4:
            return "过期";
            break;
          default:
            break;
        }
      },
      showDetail(e: any, veh: any) {
        data.choseVeh = veh;
        data.detailList = [
          {
            label: "信号时间:",
            value: "",
          },
          {
            label: "定位:",
            value: "",
          },
          {
            label: "车辆状态:",
            value: "",
          },
        ];
        data.detailList[0].value = veh.NOW;
        data.detailList[1].value = data.getLocation(veh.G);
        data.detailList[2].value = data.getVehState(
          veh.Z,
          veh.d,
          veh.timeInterval
        ) as any;
        if (veh.B) {
          data.detailList.push({
            label: "报警:",
            value: "",
          });
          data.detailList[data.detailList.length - 1].value = veh.B
            ? JSON.parse(veh.B).alarmInfo[0].alarmType
            : "";
        }
        if (veh.distance) {
          data.detailList.push({
            label: "距离目标设备:",
            value: "",
          });
          data.detailList[data.detailList.length - 1].value =
            veh.distance.toFixed(2) + "米";
        }

        const screenH = document.documentElement.clientHeight;
        const dom = document.getElementsByClassName(
          "associate_detailBox"
        )[0] as any;
        const clientY = e.clientY;
        const clientX = e.clientX;
        dom && (dom.style.display = "flex");
        dom && (dom.style.left = clientX + 20 + "px");
        dom && (dom.style.bottom = screenH - clientY + "px");
      },
      hideDetail() {
        data.choseVeh = null;
        const dom = document.getElementsByClassName(
          "associate_detailBox"
        )[0] as any;
        dom && (dom.style.display = "none");
      },
    });
    watch(
      associatedVehs as any,
      (val) => {
        if (val && val[0]) {
          data.carType = val[0].carType == 0 ? "车牌" : "车架号";
        }
        data.tableList = val;
        let list = [];
        data.tableList.map((item: any, index: number) => {
          if (item.X && item.Y) {
            data.tableList[index].distance = GPS.distance(
              props.selectedVeh.Y,
              props.selectedVeh.X,
              item.Y,
              item.X
            );
          }
        });
        const dom = document.getElementsByClassName("associate")[0] as any;
        if (val && val.length > 0) {
          dom && (dom.style.bottom = 0);
          data.showList = true;
        } else {
          data.choseVeh = null;
          data.showList = false;
          dom && (dom.style.bottom = "-30px");
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );
    return {
      updateChoseAssociatedVehs,
      associatedVehs,
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.associate {
  min-width: 280px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.26);
  position: absolute;
  left: 0px;
  bottom: -30px;
  background: #fff;
  transition: all 0.4s;
  z-index: 9;
  &_header {
    height: 30px;
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgb(218, 218, 218);
    padding: 0 5px;
    .title {
      margin-right: 10px;
    }
    i {
      margin-right: 10px;
      font-size: 14px;
      cursor: help;
    }
    .typeBtn {
      padding: 3px 8px;
      background: rgb(49, 167, 246);
      color: #fff;
      border-radius: 2px;
      font-size: 12px;
      cursor: help;
    }
    .icon-up {
      transition: all 0.4s;
      cursor: pointer;
      margin-left: auto;
      &:hover {
        color: blue;
      }
    }
  }
  &_content {
    max-height: 200px;
    overflow-y: auto;
    width: 100%;
    transition: all 0.4s;
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      width: 6px;
      background-color: rgba(144, 147, 153, 0.3);
      transition: background-color 0.3s;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: rgba(144, 147, 153, 0.5);
    }
    &::-webkit-scrollbar-thumb:active {
      background-color: rgba(144, 147, 153, 0.5);
    }
    .vehItem {
      padding: 4px 5px;
      font-size: 12px;
      color: #666;
      display: flex;
      align-items: center;
      cursor: pointer;
      &:nth-child(2n + 1) {
        background-color: #f6f6f6;
      }
      &:hover {
        background: #f1efef;
      }
      &:active {
        color: rgb(62, 166, 214);
      }
      &:nth-child(1) i {
        color: brown;
      }
      i {
        padding-right: 5px;
        color: #333;
        font-size: 20px;
      }
    }
  }
  &_detailBox {
    position: fixed;
    background: #fff;
    z-index: 9999;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.246);
    padding: 5px 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    bottom: -500px;
    .items {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 5px 0;
      .label {
        font-weight: bold;
        padding-right: 5px;
        color: #333;
      }
      .detail {
        color: #666;
      }
    }
  }
}
.tip {
  width: 180px;
  display: flex;
  line-height: 18px;
  color: #666;
  flex-wrap: wrap;
  span {
    color: blue;
  }
}
.showList {
  max-height: 200px !important;
}
.hideList {
  max-height: 0 !important;
}
.disable {
  cursor: not-allowed !important;
}
.icon_dowm {
  transform: rotate(180deg) !important;
}
.icon_up {
  transform: rotate(0deg) !important;
}
</style>