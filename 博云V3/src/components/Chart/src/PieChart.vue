<template>
  <div
    ref="dom"
    class="Chart"
  ></div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  onUnmounted,
  onMounted,
  nextTick,
  watch,
} from "vue";
import echarts from "echarts";
import { debounce } from "../../../assets/js/base";
interface ObjectOf<V> {
  [_: string]: V;
}
class objs {
  "value": number;
  "name": string;
  "color": string;
}
interface propsType {
  options: any[];
}
interface list {
  options: ObjectOf<objs>;
}
const charts: any[] = [];
export default defineComponent({
  props: {
    options: {
      type: Array,
      default: [],
    },
  },
  setup(props: propsType) {
    const { options } = props;
    watch(
      options,
      (val) => {
        clearChart();
        DrawChart(options);
      },
      { deep: true }
    );
    let chart: any = null;
    const count = ref("0");
    const dom = ref(null);
    function clearChart() {
      if (!chart) return;
      chart.dispose();
      chart = null;
    }
    function cx() {
      const data: {
        [index: number]: number;
        length: number;
        callee: Function;
      } = arguments;
      console.log(data, "data");
    }
    async function DrawChart(val: any[]) {
      const el = dom.value as any;
      if (el && !chart) {
        el.removeAttribute("_echarts_instance_");
        el.innerHTML = "";
      }
      //   chart = echarts.init(el, null as any, {
      //     renderer: "svg",
      //   });
      chart = echarts.init(el);
      chart.setOption(await getOption(val));
      charts.push(chart);
    }
    function getOption(options: any[]) {
      const el = dom.value as any;
      const data = options.map(({ value, name, color }) => ({
        value,
        name: `${name}(${value})`,
        itemStyle: { color },
        icon: "circle",
        textStyle: {
          color: "#fff",
        },
      }));
      let total = 0;
      data.forEach((res: any) => {
        total += parseFloat(res.value);
      });
      count.value = [total, "总"].join("\n");
      return {
        legend: {
          orient: "vertical",
          x: el.clientWidth < 400 ? "50%" : "60%",
          y: "center",
          // selectedMode: false,
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
                  // return count.value;
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
    nextTick(() => {
      DrawChart(options);
    });
    function resize() {
      charts.map((item) => {
        item && item.resize();
      });
      //   chart && chart.resize();
    }
    onMounted(() => {
      window.addEventListener("resize", () => {
        debounce(() => {
          resize();
        }, 200);
      });
    });
    onUnmounted(() => {
      clearChart();
    });
    return {
      dom,
    };
  },
});
</script>
<style lang="less" scoped>
.Chart {
  width: 100%;
  height: 100%;
}
</style>

