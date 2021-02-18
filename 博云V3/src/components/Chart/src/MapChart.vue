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
  reactive,
  onActivated,
} from "vue";
import echarts from "echarts";
import "echarts/map/js/china";
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
  },
  setup(props) {
    const testData = reactive({
      data: [
        {
          name: "南海诸岛",
          value: 0,
        },
        {
          name: "北京",
          value: 0,
        },
        {
          name: "天津",
          value: 0,
        },
        {
          name: "上海",
          value: 0,
        },
        {
          name: "重庆",
          value: 0,
        },
        {
          name: "河北",
          value: 0,
        },
        {
          name: "河南",
          value: 0,
        },
        {
          name: "云南",
          value: 0,
        },
        {
          name: "辽宁",
          value: 0,
        },
        {
          name: "黑龙江",
          value: 0,
        },
        {
          name: "湖南",
          value: 0,
        },
        {
          name: "安徽",
          value: 0,
        },
        {
          name: "山东",
          value: 0,
        },
        {
          name: "新疆",
          value: 0,
        },
        {
          name: "江苏",
          value: 0,
        },
        {
          name: "浙江",
          value: 0,
        },
        {
          name: "江西",
          value: 0,
        },
        {
          name: "湖北",
          value: 0,
        },
        {
          name: "广西",
          value: 0,
        },
        {
          name: "甘肃",
          value: 0,
        },
        {
          name: "山西",
          value: 0,
        },
        {
          name: "内蒙古",
          value: 0,
        },
        {
          name: "陕西",
          value: 0,
        },
        {
          name: "吉林",
          value: 0,
        },
        {
          name: "福建",
          value: 0,
        },
        {
          name: "贵州",
          value: 0,
        },
        {
          name: "广东",
          value: 0,
        },
        {
          name: "青海",
          value: 0,
        },
        {
          name: "西藏",
          value: 0,
        },
        {
          name: "四川",
          value: 0,
        },
        {
          name: "宁夏",
          value: 0,
        },
        {
          name: "海南",
          value: 0,
        },
        {
          name: "台湾",
          value: 0,
        },
        {
          name: "香港",
          value: 0,
        },
        {
          name: "澳门",
          value: 0,
        },
      ],
    });
    const chartRef = ref<HTMLDivElement | null>(null);
    const { setOptions, resize } = useECharts(chartRef as Ref<HTMLDivElement>);
    let chartInstance = null;
    function getOption() {
      return {
        tooltip: {
          triggerOn: "mousemove",
          formatter: function (params: any) {
            const a = "<span>" + params.name + "</span>";
            const b =
              '<span style="color:' +
              "rgba(23, 240, 204)" +
              '">' +
              params.value +
              "%</span>";
            return [a, b].join(" :  ");
          },
          backgroundColor: "rgba(29, 38, 71)",
          // 额外附加的阴影
          extraCssText: "box-shadow:0 0 4px rgba(11, 19, 43,0.8);",
        },
        visualMap: {
          min: 0,
          max: 1000,
          left: 26,
          bottom: 40,
          showLabel: !0,
          text: ["高", "低"],
          pieces: [
            {
              gt: 100,
              label: "> 100 人",
              color: "rgba(57, 111, 255)",
            },
            {
              gte: 10,
              lte: 100,
              label: "10 - 100 人",
              color: "rgba(50, 97, 222)",
            },
            {
              gte: 1,
              lt: 10,
              label: "1 - 9 人",
              color: "rgba(42, 82, 189)",
            },
            {
              gt: 0,
              lt: 1,
              label: "疑似",
              color: "rgba(35, 68, 156)",
            },
            {
              value: 0,
              color: "rgba(27, 53, 122)",
            },
          ],
          show: false,
        },
        geo: {
          map: "china",
          roam: !1,
          scaleLimit: {
            min: 1,
            max: 2,
          },
          zoom: 1,
          label: {
            show: true,
            color: "#b0d5ff", //省份标签字体颜色
          },
          emphasis: {
            label: {
              show: false,
              color: "#fff", //省份标签字体颜色
              fontSize: 12,
            },
          },
          itemStyle: {
            normal: {
              shadowBlur: 1,
              shadowColor: "rgba(18, 32, 70,0.4)",
              borderColor: "rgba(42, 82, 189)",
            },
            emphasis: {
              areaColor: "rgba(23, 240, 204)",
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              borderWidth: 0,
            },
          },
        },
        series: [
          {
            name: "地域分布",
            type: "map",
            geoIndex: 0,
            data: testData.data,
          },
        ],
      };
    }
    async function DrawChart() {
      setOptions(await getOption());
    }
    nextTick(() => {
      DrawChart();
    });
    onActivated(() => {
      resize();
    });
    // watch(
    //   options,
    //   (val) => {
    //     const el = chartRef.value as any;
    //     DrawChart();
    //   },
    //   { deep: true }
    // );
    return { chartRef };
  },
});
</script>
