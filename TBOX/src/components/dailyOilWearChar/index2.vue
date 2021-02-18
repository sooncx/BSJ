<template>
  <div id="app">
    <div class="btnBox">
      <span
        v-for="(item,index) in btnList"
        :key="index"
      >
        <el-button
          size="small"
          :type="item.type"
          round
          @click="select(index)"
        >{{item.btntxt}}</el-button>
      </span>
    </div>

    <div
      id="main2"
      style="width: 100%;
      height: 400px;"
    >
    </div>
  </div>
</template>
<script>
import echarts from "echarts";

export default {
  name: "app",
  props: {},
  data() {
    return {
      flag: 0,
      btnList: [
        { btntxt: "昨天", type: "success" },
        { btntxt: "近三天", type: "" },
        { btntxt: "近七天", type: "" }
      ]
    };
  },
  watch: {},
  methods: {
    select(index) {
      this.flag = index;
      for (let i in this.btnList) {
        this.btnList[i].type = "";
      }
      this.btnList[index].type = "success";
    },

    drawChart() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("main2"));
      // 指定图表的配置项和数据
      let option = {
        icon: "circle",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          x: "left",
          data: ["里程（km）", "油耗（L）", "百公里油耗（L/百公里）"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },

        yAxis: [
          {
            type: "value"
          },
          {
            type: "value",
            min: 0,
            max: 125,
            interval: 25,
            axisLabel: {
              formatter: "{value} %"
            }
          }
        ],
        xAxis: {
          type: "category",
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        series: [
          {
            name: "油耗（L）",
            type: "bar",
            stack: "总量",
            color: "#50D166",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "里程（km）",
            type: "bar",
            stack: "总量",
            color: "#1272F0",
            label: {
              normal: {
                show: true,
                position: "insideLeft"
              }
            },
            data: [320, 302, 301, 334, 390, 330, 320]
          },
          {
            name: "百公里油耗（L/百公里）",
            type: "line",
            stack: "总量",
            color: "#F2C53E",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: [220, 182, 191, 234, 290, 330, 310]
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      this.$nextTick(() => {
        myChart.setOption(option);
      });
    }
  },
  mounted() {
    this.drawChart();
  }
};
</script>
<style lang="scss" scoped>
.btnBox {
  position: absolute;
  right: 80px;
  z-index: 99;
  span {
    margin-right: 20px;
  }
}
</style>
