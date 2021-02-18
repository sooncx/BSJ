<template>
  <div
    ref="chartRef"
    :style="{ height, width }"
  ></div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  Ref,
  onMounted,
  toRefs,
  nextTick,
  watch,
  onActivated,
} from "vue";
import echarts from "echarts";
import { useECharts } from "@/hooks/web/pieChart";

export default defineComponent({
  props: {
    width: {
      type: String as PropType<string>,
      default: "100%",
    },
    height: {
      type: String as PropType<string>,
      default: "100%",
    },
    options: {
      type: Array as PropType<Object>,
      default: () => [],
    },
  },
  setup(props) {
    const { options } = toRefs(props);
    const chartRef = ref<HTMLDivElement | null>(null);
    const { setOptions, resize } = useECharts(chartRef as Ref<HTMLDivElement>);
    let chartInstance = null;
    function getOption(options: any[]) {
      const el = chartRef.value as any;
      const data = options.map(({ value, name, color }) => ({
        value,
        name: `${name}(${value})`,
        itemStyle: { color },
        icon: "circle",
        textStyle: {
          color: "#fff",
        },
      }));
      return {
        color: ['#005AFD', '#04AAE1', '#9604E1', '#0BA91D', '#E19604', '#6D6D6D'],
        legend: {
          orient: "vertical",
          x: el.clientWidth < 400 ? "50%" : "60%",
          y: "center",
          data,
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: {d}%",
        },
        series: [
          {
            center: [el.clientWidth < 400 ? "25%" : "35%", "50%"],
            name: "",
            type: "pie",
            radius: el.clientWidth < 400 ? ["30%", "35%"] : ["55%", "65%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: "center",
                textStyle: {
                  fontSize: el.clientWidth < 400 ? 12 : 14,
                  padding: [5, 0, 0, 0],
                  color: "#fff",
                },
                formatter: () => {
                  return "";
                },
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data,
          },
        ],
      };
    }
    async function DrawChart(val: any[]) {
      setOptions(await getOption(val));
    }
    nextTick(() => {
      DrawChart(options.value as any);
    });
    onActivated(() => {
      resize();
    });
    watch(
      options,
      (val) => {
        const el = chartRef.value as any;
        DrawChart(options.value as any);
      },
      { deep: true }
    );
    return { chartRef };
  },
});
</script>
