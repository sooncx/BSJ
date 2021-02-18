<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, Ref, onMounted } from "vue";
import echarts from "echarts";
import { useECharts } from "@/hooks/web/useECharts";

export default defineComponent({
  name: "LineChart",
  props: {
    width: {
      type: String as PropType<string>,
      default: "100%",
    },
    height: {
      type: String as PropType<string>,
      default: "100%",
    },
    data: {
      type: Array as PropType<number[]>,
      default: []
    }
  },
  setup(props) {
    const chartRef = ref<HTMLDivElement | null>(null);
    const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
    let chartInstance = null;

    onMounted(() => {
      setOptions({
        color: ["#FF7723"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          top: "3%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [
              "0时",
              "1时",
              "2时",
              "3时",
              "4时",
              "5时",
              "6时",
              "7时",
              "8时",
              "9时",
              "10时",
              "11时",
              "12时",
              "13时",
              "14时",
              "15时",
              "16时",
              "17时",
              "18时",
              "19时",
              "20时",
              "21时",
              "22时",
              "23时",
            ],
            axisTick: {
              alignWithLabel: true,
              show: false, // 坐标轴刻度
            },
            // 坐标轴
            axisLine: {
              show: false,
            },
            axisLabel: {
              interval: 0,
            },
            splitLine: {
              // 网格线
              lineStyle: {
                type: "dashed", // 设置网格线类型 dotted：虚线   solid:实线
                color: "#CCCCCC",
              },
              show: true, // 隐藏或显示
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            // 坐标轴刻度
            axisTick: {
              show: false,
            },
            // 坐标轴
            axisLine: {
              show: false,
            },
            splitLine: {
              // 网格线
              lineStyle: {
                type: "dashed", // 设置网格线类型 dotted：虚线   solid:实线
                color: "#CCCCCC",
              },
              show: true, // 隐藏或显示
            },
          },
        ],
        series: [
          {
            name: "总停留时间(分钟)",
            type: "bar",
            barWidth: "60%",
            data: props.data,
          },
        ],
      });
    });

    return {
      chartRef,
    };
  },
});
</script>