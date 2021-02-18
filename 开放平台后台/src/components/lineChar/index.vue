<template>
  <div class="lineChar">
    <div class="header">
      <div
        class="header_btn"
        @click="zoomup"
      >
        <i
          class="el-icon-arrow-left"
          v-if="zoom"
        ></i>
        {{zoom?"返回":"使用详情"}}
        <i
          v-if="!zoom"
          class="el-icon-arrow-right"
        ></i>
      </div>
      <el-button-group>
        <el-button
          v-for="(item, index) in dayBtns"
          :key="index"
          :type="item.type"
          size="mini"
          @click="selectDay(index)"
        >{{item.label}}</el-button>
      </el-button-group>
    </div>
    <div
      class="charBox"
      id="main"
    ></div>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "lineChar",
  components: {},
  props: {
    zoom: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      max: 10,
      myChart: null,
      dayBtns: [
        {
          label: "日",
          type: "primary",
          value: 1
        },
        {
          label: "周",
          type: "",
          value: 2
        },
        {
          label: "月",
          type: "",
          value: 3
        }
      ]
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.drawChart();
    });
    window.onresize = () => {
      this.$nextTick(() => {
        this.myChart.resize();
      });
    };
  },
  methods: {
    zoomup() {
      this.$emit("update:zoom", !this.zoom);
      setTimeout(() => {
        this.max = this.zoom ? 100 : 10;
        this.myChart.resize();
      }, 10);
    },
    selectDay(index) {
      switch (index) {
        case 0:
          this.dataCountTxt = "较昨日";
          break;
        case 1:
          this.dataCountTxt = "较上周";
          break;
        case 2:
          this.dataCountTxt = "较上月";
          break;
        default:
          break;
      }
      this.dayBtns.forEach((item, i) => {
        if (item) {
          this.dayBtns[i].type = "";
        }
      });
      this.dayBtns[index].type = "primary";
    },
    drawChart() {
      // 基于准备好的dom，初始化echarts实例
      const that = this;
      this.myChart = echarts.init(document.getElementById("main"));
      // 指定图表的配置项和数据
      const option = {
        icon: "",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow' | 'cross'
          },
          formatter(val) {
            if (val) {
              // console.log(val);
              let htmlStr = "";
              if (val.length > 0) {
                for (let i = 0; i < that.max; i++) {
                  if (val[i]) {
                    const { seriesName, value } = val[i];
                    htmlStr += `<div>${seriesName} : ${value}次</div>`;
                  }
                }
                return htmlStr;
              }
            }
          }
        },
        // legend: {
        //   x: "left"
        //   //   data: ["调用接口数"]
        // },
        grid: {
          left: "1%",
          right: "1%",
          bottom: "3%",
          containLabel: true
        },

        yAxis: [
          {
            type: "value",
            name: "调用接口数",
            min: 0,
            // max: 1000,
            // axisLine: {
            //     lineStyle: {
            //         color: "rgb(175, 38, 4)",
            //     }
            // },
            axisLabel: {
              formatter: "{value} 次"
            }
          }
        ],
        xAxis: {
          type: "category",
          data: [1, 2, 3]
        },
        series: [
          //   {
          //     name: "接口1",
          //     type: "bar",
          //     // stack: "接口",
          //     barWidth: 30,
          //     color: "rgb(70, 153, 226)",
          //     label: {
          //       normal: {
          //         show: true,
          //         position: "inside"
          //       }
          //     },
          //     data: [
          //       {
          //         value: 11,
          //         interface: [
          //           { name: 1, count: 20 },
          //           { name: 2, count: 30 },
          //           { name: 2, count: 30 }
          //         ]
          //       },
          //       {
          //         value: 22,
          //         interface: [
          //           { name: 1, count: 20 },
          //           { name: 2, count: 30 },
          //           { name: 2, count: 30 }
          //         ]
          //       },
          //       {
          //         value: 33,
          //         interface: [
          //           { name: 1, count: 20 },
          //           { name: 2, count: 30 },
          //           { name: 2, count: 30 }
          //         ]
          //       }
          //     ]
          //   }
          {
            name: "接口2",
            type: "bar",
            stack: "接口",
            barWidth: 30,
            // color: "rgb(70, 153, 226)",
            label: {
              normal: {
                show: true,
                position: "inside"
              }
            },
            data: [34, 89, 73]
          },
          {
            name: "接口3",
            type: "bar",
            stack: "接口",
            barWidth: 30,
            // color: "rgb(70, 153, 226)",
            label: {
              normal: {
                show: true,
                position: "inside"
              }
            },
            data: [11, 32, 73]
          },
          {
            name: "接口4",
            type: "bar",
            stack: "接口",
            barWidth: 30,
            // color: "rgb(70, 153, 226)",
            label: {
              normal: {
                show: true,
                position: "inside"
              }
            },
            data: [11, 22, 33]
          }
        ]
      };
      this.myChart.setOption(option);
    }
  }
};
</script>
<style lang="scss" scoped>
.lineChar {
  padding: 20px;
  height: calc(100% - 40px);
  flex: 1;
  .header {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &_btn {
      color: #0856ea;
      cursor: pointer;
    }
  }
  .charBox {
    height: calc(100% - 40px);
    flex: 1;
  }
}
</style>
