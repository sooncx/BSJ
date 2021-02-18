<template>
  <div class="monitorCenter">
    <div class="monitorCenter__content">
      <div class="monitorCenter__upside">
        <div class="monitorCenter__update-time">数据更新时间：2019-09-09 16：21</div>

        <!-- 电池信息开始 -->
        <el-row>
          <el-col :span="4">
            <div class="battery">
              <Battery />
              <div class="battery__item">
                <span class="battery__label">工作状态</span>
                <span class="battery__text battery__text_warning">放电</span>
              </div>

              <div class="battery__item">
                <span class="battery__label">SOC电量计</span>
                <span class="battery__text battery__text_primary">70%</span>
              </div>
            </div>
          </el-col>
          <el-col :span="20">
            <BatteryInfo />
          </el-col>
        </el-row>
        <!-- 电池信息结束 -->

        <!-- 电池图表开始 -->
        <el-row
          type="flex"
          class="monitorCenter__chart"
        >
          <el-col
            :span="5"
            class="chart-card"
          >
            <div class="chart-card__title">电池容量</div>
            <Chart
              class="chart-card__content"
              :option="capacityChartOption"
            />
          </el-col>
          <el-col
            :span="5"
            class="chart-card"
          >
            <div class="chart-card__title">充放电间隔</div>
            <Chart
              class="chart-card__content"
              :option="interValChartOption"
            />
          </el-col>
          <el-col
            :span="5"
            class="chart-card"
          >
            <div class="chart-card__title">电流统计</div>
            <Chart
              class="chart-card__content"
              :option="countChartOption"
            />
          </el-col>
          <el-col
            :span="9"
            class="chart-card"
          >
            <div class="chart-card__content">
              <div class="chart-card__gauge">
                <Gauge />
                <div class="chart-card__gauge-label">电芯温度</div>
              </div>
              <div class="chart-card__gauge">
                <Gauge />
                <div class="chart-card__gauge-label">均衡板温度</div>
              </div>
              <div class="chart-card__gauge">
                <Gauge />
                <div class="chart-card__gauge-label">环境温度</div>
              </div>
            </div>
          </el-col>
        </el-row>
        <!-- 电池图表结束 -->
      </div>

      <div class="monitorCenter__underside">
        <div class="monitorCenter__underside-item">
          <BatteryFaultCount />
        </div>

        <div class="monitorCenter__underside-item">
          <div
            class="monitorCenter__map"
            ref="map"
            :style="{top: isMapEnlarge ? 0 : '61%', left: isMapEnlarge ? 0 : 'calc(50% + 8px)'}"
          >
            <i
              @click="isMapEnlarge = !isMapEnlarge"
              class="monitorCenter__map-zoom iconfont"
              :class="isMapEnlarge ? 'icon-suoxiao' : 'icon-enlarge'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "@/components/Chart/index.vue";
import Battery from "./Battery.vue";
import BatteryInfo from "./BatteryInfo.vue";
import Gauge from "./Gauge.vue";
import BatteryFaultCount from "./BatteryFaultCount.vue";

export default {
  components: {
    Chart,
    Battery,
    BatteryInfo,
    Gauge,
    BatteryFaultCount
  },

  data() {
    return {
      capacityChartOption: {},
      interValChartOption: {},
      countChartOption: {},
      map: null,
      isMapEnlarge: false //地图是否放大
    };
  },

  async mounted() {
    await this.$sleep();
    this.initCapacityChart();
    this.initInterValChart();
    this.initCountChartOption();
    this.initMap();
  },

  methods: {
    getLineChartOptions({ options, color, formatter }) {
      return {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
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
            data: options.map(item => item.label),
            axisLabel: {
              color: "rgba(51,51,51,1)"
            },
            axisLine: {
              lineStyle: {
                color: "rgba(223,223,223,1)"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              color: "rgba(51,51,51,1)",
              formatter
            },
            axisLine: {
              lineStyle: {
                color: "rgba(223,223,223,1)"
              }
            },
            splitLine: {
              lineStyle: {
                color: "rgba(223,223,223,1)"
              }
            }
          }
        ],
        series: [
          {
            name: "Online quantity",
            type: "bar",
            data: options.map(item => item.value),
            itemStyle: {
              normal: { color }
            },
            barWidth: 10,
            barGap: "0%"
          }
        ]
      };
    },
    initCapacityChart() {
      const options = [
        { label: "标称容量", value: 4 },
        { label: "当前容量", value: 3.5 },
        { label: "剩余容量", value: 1 }
      ];

      this.capacityChartOption = this.getLineChartOptions({
        options,
        color: "rgba(0,211,184,1)",
        formatter: "{value} Ah"
      });
    },
    initInterValChart() {
      const options = [
        { label: "标称容量", value: 4 },
        { label: "当前容量", value: 3.5 },
        { label: "剩余容量", value: 1 }
      ];

      this.interValChartOption = this.getLineChartOptions({
        options,
        color: "rgba(52,151,234,1)",
        formatter: "{value} 天"
      });
    },
    initCountChartOption() {
      const options = [
        { label: "00:00-08:00", value: 1.5 },
        { label: "08:00-16:00", value: 1 },
        { label: "16:00-24:00", value: 2 }
      ];

      this.countChartOption = {
        xAxis: {
          type: "category",
          data: options.map(({ label }) => label),
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "rgba(51,51,51,1)"
          },
          axisLine: {
            lineStyle: {
              color: "rgba(223,223,223,1)"
            }
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "10%",
          containLabel: true
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "rgba(51,51,51,1)",
            formatter: "{value} A"
          },
          axisLine: {
            lineStyle: {
              color: "rgba(223,223,223,1)"
            }
          },
          splitLine: {
            lineStyle: {
              color: "rgba(223,223,223,1)"
            }
          }
        },
        textStyle: {
          fontSize: 10,
          color: "white"
        },
        series: [
          {
            data: options.map(({ value }) => value),
            type: "line",
            name: "电流(A)",
            itemStyle: {
              normal: {
                color: "#2BE3EA"
              }
            },
            lineStyle: {
              normal: {
                color: "rgba(52,151,234,1)"
              }
            },
            areaStyle: {
              color: "rgba(52,151,234,.3)"
            }
          }
        ]
      };
    },
    initMap() {
      this.map = new BSJMap.Map(this.$refs.map, {
        center: [105, 37.5],
        zoom: document.body.clientWidth > 1600 ? 4 : 3
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.monitorCenter {
  $gap: 16px;
  height: 100%;
  background: rgba(248, 248, 248, 1);
  display: flex;

  &__content {
    margin: $gap;
    display: flex;
    flex: 1;
    overflow: hidden;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  &__upside {
    padding: $gap;
    background: #fff;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__chart {
    flex: 1;
    overflow: hidden;
  }

  &__underside {
    margin-top: $gap;
    display: flex;
    height: 39%;
  }

  &__underside-item {
    flex: 1;
    overflow: hidden;
    background: #fff;

    & + & {
      margin-left: $gap;
    }
  }

  &__map {
    position: absolute;
    right: 0;
    bottom: 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    transform:transition3d(0,0,0);
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  }

  &__map-zoom {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 34px;
    height: 34px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: rgba(0, 211, 184, 1);
    user-select: none;
    z-index: 1;

    &:hover {
      opacity: 0.8;
    }
  }

  &__update-time {
    font-size: 12px;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 16px;
    padding: 0 16px 32px;
  }
}

.battery {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;

  &__item {
    margin-top: 16px;

    & + & {
      margin-top: 10px;
    }
  }

  &__label {
    font-size: 13px;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 16px;
    margin-right: 5px;

    &::after {
      content: ":";
    }
  }

  &__text {
    font-size: 13px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 16px;

    &_warning {
      color: rgba(244, 118, 26, 1);
    }

    &_primary {
      color: rgba(0, 211, 184, 1);
    }
  }
}

.chart-card {
  flex: 1;
  background: rgba(247, 247, 247, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  & + & {
    margin-left: 10px;
  }

  &__title {
    font-size: 14px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    padding: 16px;
  }

  &__content {
    flex: 1;
    display: flex;
    padding: 16px;
    overflow: hidden;
  }

  &__gauge {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px;
  }

  &__gauge-label {
    font-size: 14px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    margin-top: 5px;
  }
}
</style>
