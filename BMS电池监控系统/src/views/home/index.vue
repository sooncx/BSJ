<template>
  <div class="home">
    <!-- 热力图开始 -->
    <HeatMap />
    <!-- 热力图结束 -->

    <div class="home__left">
      <Card style="flex: 4">
        <div slot="title">
          <img :src="require('@/assets/img/home/logo.png')" />
          <div style="margin-top:5px">Fault type</div>
        </div>
        <Chart :option="faultOption" />
      </Card>
      <Card
        title="Real-time alarm data"
        style="flex: 3"
      >
        <Table />
      </Card>
      <Card
        title="Battery type"
        style="flex: 2"
      >
        <Chart :option="batteryTypeOption" />
      </Card>

      <CoutList :options="countOptions" />
    </div>

    <div class="home__underside">
      <Card title="Real-time status">
        <Chart :option="realStausOption" />
      </Card>
      <div
        class="home__underside-item"
        style="flex:13;"
      >
        <BatteryStatusList :options="batteryStatusOptions" />
      </div>
      <div
        class="home__underside-item"
        style="flex:10;"
      >
        <BatteryAlarmList :options="batteryAlarmOptions" />
      </div>
      <Card title="Fault type">
        <Chart :option="onlineRateOption" />
      </Card>
    </div>
  </div>
</template>

<script>
import Chart from "@/components/Chart/index.vue";
import HeatMap from "./HeatMap.vue";
import Card from "./Card.vue";
import Table from "./Table.vue";
import BatteryStatusList from "./BatteryStatusList.vue";
import BatteryAlarmList from "./BatteryAlarmList.vue";
import CoutList from "./CoutList.vue";

export default {
  components: {
    HeatMap,
    Card,
    Chart,
    Table,
    BatteryStatusList,
    BatteryAlarmList,
    CoutList
  },

  data() {
    return {
      faultOption: {},
      batteryTypeOption: {},
      realStausOption: {},
      onlineRateOption: {},
      countOptions: [
        {
          label: "Total number of devices",
          startVal: 0,
          endVal: 512
        },
        {
          label: "Daily Reresh Number",
          startVal: 0,
          endVal: 512
        },
        { label: "Daily Increased Number", startVal: 0, endVal: 25 }
      ],
      batteryStatusOptions: [
        {
          label: "The number of charges in the month",
          startVal: 433,
          endVal: 433,
          icon: require("@/assets/img/home/Charging.png")
        },
        {
          label: "Number of discharges in the month",
          startVal: 312,
          endVal: 312,
          icon: require("@/assets/img/home/Discharge.png")
        },
        {
          label: "Number of short circuits",
          startVal: 56,
          endVal: 56,
          icon: require("@/assets/img/home/ShortCircuit.png")
        }
      ],
      batteryAlarmOptions: [
        {
          label: "Overcharge",
          startVal: 123,
          endVal: 123,
          icon: "icon-chongdianguoliang"
        },
        {
          label: "Overdraw quantity",
          startVal: 456,
          endVal: 456,
          icon: "icon-fangdianguoliang"
        },
        {
          label: "Balanced open quantity",
          startVal: 233,
          endVal: 233,
          icon: "icon-junhengxing"
        },
        {
          label: "Number of protection",
          startVal: 414,
          endVal: 414,
          icon: "icon-dunpai"
        }
      ]
    };
  },

  mounted() {
    this.initFault();
    this.initBatteryType();
    this.initRealStatus();
    this.initOnlineRate();

    setInterval(() => {
      this.countOptions = this.countOptions.map(item => ({
        ...item,
        startVal: item.endVal,
        endVal: item.endVal + Math.floor(Math.random() * 5)
      }));
    }, 10 * 1000);
  },

  methods: {
    initFault() {
      const options = [
        {
          value: 5,
          name: "Cell Over Voltage",
          color: "rgba(18,195,118,1)"
        },
        {
          value: 6,
          name: "Cell Under Voltage",
          color: "rgba(18,80,195,1)"
        },
        { value: 7, name: "Pack Over Voltage", color: "rgba(211,178,22,1)" },
        {
          value: 4,
          name: "Pack Under Voltage",
          color: "rgba(195,43,18,1)"
        },
        {
          value: 6,
          name: "Charge Over Temperature",
          color: "rgba(101,18,195,1)"
        },
        {
          value: 8,
          name: "Charge Under Temperature",
          color: "rgba(76,203,193,1)"
        },
        { value: 3, name: "sampling", color: "rgba(2,131,201,1)" },
        {
          value: 10,
          name: "Discharge Over Temperature",
          color: "rgba(229,133,108,1)"
        },
        {
          value: 12,
          name: "Discharge Under Temperature",
          color: "rgba(157,60,189,1)"
        },
        {
          value: 9,
          name: "MOS high temperature",
          color: "rgba(211,129,22,1)"
        },
        {
          value: 8,
          name: "Charging overcurrent",
          color: "rgba(47,160,32,1)"
        },
        {
          value: 7,
          name: "Discharge overcurrent",
          color: "rgba(83,77,164,1)"
        },
        {
          value: 6,
          name: "Short circuit protection",
          color: "rgba(186,32,181,1)"
        },
        { value: 5, name: "Bad Cell", color: "rgba(169,213,75,1)" }
      ];

      const data = options.map(({ value, name, color }) => ({
        value,
        name: `${name}(${value})`,
        itemStyle: { color },
        icon: "circle"
      }));

      let legendData = [...data];
      legendData.splice(7, 0, "\n");

      this.faultOption = {
        legend: {
          orient: "vertical",
          x: "0",
          y: "center",
          data: legendData,
          textStyle: {
            color: "#fff"
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: {d}%"
        },
        series: [
          {
            center: ["85%", "50%"],
            name: "",
            type: "pie",
            radius: ["0%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            roseType: "area",
            data
          }
        ]
      };
    },
    initBatteryType() {
      const options = [
        {
          value: 512,
          name: "Manganese lithium battery",
          color: "rgba(8,197,164,1)"
        },
        // {
        //   value: 512,
        //   name: "Lithium iron phosphate battery",
        //   color: "rgba(198,91,33,1)"
        // }
      ];

      const data = options.map(({ value, name, color }) => ({
        value,
        name: `${name}(${value})`,
        itemStyle: { color },
        icon: "circle"
      }));

      this.batteryTypeOption = {
        legend: {
          orient: "vertical",
          x: "50%",
          y: "center",
          data,
          textStyle: {
            color: "#fff"
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: {d}%"
        },
        series: [
          {
            center: ["25%", "50%"],
            name: "",
            type: "pie",
            radius: ["60%", "80%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            roseType: "area",
            data
          }
        ]
      };
    },
    initRealStatus() {
      this.realStausOption = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: [],
          textStyle: {
            color: "#fff"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "10%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
            axisLabel: {
              color: "#fff"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              color: "#fff",
            },
            axisLine: {
              lineStyle: {
                color: "#3c3c44"
              }
            },
            splitLine: {
              lineStyle: {
                color: "#3c3c44"
              }
            },
          },
          {
            type: "value",
            axisLabel: {
              color: "#fff",
              formatter: "{value} ℃"
            },
            axisLine: {
              lineStyle: {
                color: "#3c3c44"
              }
            },
            splitLine: {
              lineStyle: {
                color: "#3c3c44"
              }
            },
          }
        ],
        series: [
          {
            name: "Number of charges",
            type: "bar",
            data: [120, 132, 101, 134, 90, 230],
            itemStyle: {
              normal: { color: "rgba(8,197,164,1)" }
            },
            barGap: "0%",
            barWidth: 10
          },
          {
            name: "Number of discharges",
            type: "bar",
            data: [60, 72, 51, 77, 45, 110, 105],
            itemStyle: {
              normal: { color: "rgba(198,91,33,1)" }
            },
            barWidth: 10
          },
          {
            name: "Charging temperature",
            type: "line",
            yAxisIndex: 1,
            data: [23, 24, 27, 21, 43, 36],
            itemStyle: {
              normal: { color: "rgba(35,103,226,1)" }
            }
          },
          {
            name: "Discharge temperature",
            type: "line",
            yAxisIndex: 1,
            data: [33, 34, 40, 34, 53, 53],
            itemStyle: {
              normal: { color: "rgba(107,35,226,1)" }
            }
          }
        ]
      };
    },
    initOnlineRate() {
      this.onlineRateOption = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: [],
          textStyle: {
            color: "#fff"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "10%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["10-10", "10-11", "10-12", "10-13", "10-14", "10-15"],
            axisLabel: {
              color: "#fff"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              color: "#fff"
            },
            axisLine: {
              lineStyle: {
                color: "#3c3c44"
              }
            },
            splitLine: {
              lineStyle: {
                color: "#3c3c44"
              }
            },
          }
        ],
        series: [
          {
            name: "Online quantity",
            type: "bar",
            data: [320, 332, 301, 334, 390, 330],
            itemStyle: {
              normal: { color: "rgba(24,98,220,1)" }
            },
            barWidth: 10,
            barGap: "0%"
          },
          {
            name: "Number of sleeps",
            type: "bar",
            data: [120, 132, 101, 134, 90, 230],
            itemStyle: {
              normal: { color: "rgba(198,91,33,1)" }
            },
            barWidth: 10,
            barGap: "0%"
          },
          {
            name: "Offline quantity",
            type: "bar",
            data: [60, 72, 51, 77, 45, 110, 105],
            itemStyle: {
              normal: { color: "rgba(145,145,145,1)" }
            },
            barWidth: 10
          }
        ]
      };
    }
  }
};
</script>

<style lang="scss" scoped>
$gap: 16px; //容器间隙
$bg: rgba(28, 28, 32, 1);

.home {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  ::v-deep .Card {
    width: calc(100vw / 3);
    background: $bg;

    .Chart {
      height: 100%;
    }
  }

  &__left {
    position: absolute;
    left: 0;
    top: 0;
    padding: 0 $gap;
    box-sizing: border-box;
    height: 70%;
    display: flex;
    flex-direction: column;

    ::v-deep .Card {
      margin-top: $gap;
    }
  }

  &__underside {
    width: 100%;
    height: 30%;
    position: absolute;
    left: 0;
    bottom: 0;
    padding: $gap;
    display: flex;
    box-sizing: border-box;
  }

  &__underside-item {
    border-left: 1px solid rgba(60, 60, 68, 1);
    background: $bg;

    &:nth-of-type(3) {
      margin-right: $gap;
    }
  }
}
</style>
