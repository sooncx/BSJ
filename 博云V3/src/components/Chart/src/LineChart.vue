<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  Ref,
  watchEffect,
} from "vue";
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
    itemColor: {
      type: String as PropType<string>,
      default: "#0E9CFF",
    },
    areaColor: {
      type: String as PropType<string>,
      default: "#CEEAFF",
    },
    data: {
      type: Array as PropType<number[]>,
      default: [0, 0, 0, 0, 0, 0, 0],
    },
  },
  setup(props) {
    const chartRef = ref<HTMLDivElement | null>(null);
    const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

    watchEffect(() => {
      setOptions({
        tooltip: {
          trigger: "axis",
          // axisPointer: {
          //   type: "cross",
          // },
          formatter: function (params: any) {
            return (
              params[0].axisValueLabel +
              "<br>" +
              params[0].marker +
              params[0].value +
              "辆"
            );
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
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
          data: [
            getDay(-6),
            getDay(-5),
            getDay(-4),
            getDay(-3),
            getDay(-2),
            getDay(-1),
            getDay(0),
          ],
        },
        yAxis: {
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
        grid: {
          top: "15%",
          bottom: "15%",
          right: "6%",
          left: "10%",
        },
        series: [
          {
            data: props.data,
            type: "line",
            itemStyle: {
              color: props.itemColor,
            },
            areaStyle: {
              color: props.areaColor,
            },
          },
        ],
      });
    });

    function getDay(day: number) {
      let today = new Date();
      let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
      today.setTime(targetday_milliseconds);
      let tMonth: number = today.getMonth();
      let tDate: number = today.getDate();
      return tMonth + 1 + "-" + tDate;
    }

    return { chartRef };
  },
});
</script>
