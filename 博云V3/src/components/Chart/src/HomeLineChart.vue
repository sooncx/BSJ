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
interface YdataType {
  name: string;
  unit: string;
  areaColor: string;
  lineColor: string;
  pointColor: string;
  data: any[];
}
interface optionType {
  left: string;
  right: string;
  top: string;
  bottom: string;
  Xdata: any[];
  Ydatas: YdataType[];
}
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
      type: Object as PropType<Object>,
      default: () => {},
    },
    titles: {
      type: Object,
      default: () => {
        return {
          left: "",
          right: "",
        };
      },
    },
  },
  setup(props) {
    const { options } = toRefs(props);
    const chartRef = ref<HTMLDivElement | null>(null);
    const { setOptions, resize } = useECharts(chartRef as Ref<HTMLDivElement>);
    let chartInstance = null;
    function getOption(options: optionType) {
      const legend: any[] = [];
      options.Ydatas.map((item) => {
        legend.push(item.name);
      });
      // 指定图表的配置项和数据
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line", // 默认为直线，可选为：'line' | 'shadow' | 'cross'
          },
          confine: true,
          formatter: function (params: any) {
            let showHtm = "";
            let unit = "";
            for (let i = 0; i < params.length; i++) {
              unit = options.Ydatas[i].unit || "";
              //名称
              let name = params[i].seriesName;
              //值
              let value = params[i].value;
              showHtm +=
                params[i].marker + name + " : " + value + unit + "<br>";
            }
            //x坐标值
            let Xname = params[0].name;
            showHtm = Xname + "<br>" + showHtm;
            return showHtm;
          },
        },
        legend: {
          data: legend,
          top: "10px",
          textStyle: {
            color: "#fff",
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: options.Xdata,
        },
        textStyle: {
          color: "#fff",
        },
        yAxis: [
          {
            type: "value",
            name: props.titles.left,
            splitLine: {
              lineStyle: {
                type: "dashed",
                color: "#536D86"
              },
            },
          },
          {
            type: "value",
            name: props.titles.right,
            axisLabel: {
              formatter: "{value}%",
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
          },
        ],
        grid: {
          left: options.left || "30px",
          right: options.right || "45px",
          bottom: options.bottom || "5%",
          top: options.top || "6%",
          containLabel: true,
        },
        series: [],
      };
      option.series = [];
      options.Ydatas.map((item) => {
        (option.series as any).push({
          data: item.data,
          yAxisIndex: item.name.indexOf("百分比") != -1 ? 1 : 0,
          type: "line",
          name: item.name,
          areaStyle: {
            color: item.areaColor,
            opacity: 0.3,
            origin: "start",
          },
          lineStyle: {
            color: item.lineColor,
            width: 2,
          },
          symbol: "circle", //折线点设置为实心点
          symbolSize: 0, //折线点的大小
          itemStyle: {
            normal: {
              color: item.pointColor, //折线点的颜色
            },
          },
          smooth: false,
        });
      });
      return option;
    }
    async function DrawChart(val: optionType) {
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
