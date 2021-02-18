<template>
  <div></div>
</template>

<script>
import echarts from "echarts";

export default {
  props: {
    options: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      chart: null
    };
  },

  watch: {
    options: {
      async handler(val) {
        const isRendering =
          !this.$el ||
          (this.$el &&
            this.$el.firstChild &&
            this.$el.firstChild.style.width === "0px");

        if (isRendering) {
          this.clearChart();
          await this.$nextTick();
          this.$el && this.$el.removeAttribute("_echarts_instance_");
          this.chart = echarts.init(this.$el, null, {
            renderer: "svg"
          });
        }

        this.chart.setOption(this.getOption(val));
      },
      immediate: true
    }
  },

  beforeDestroy() {
    this.clearChart();
  },

  methods: {
    clearChart() {
      if (!this.chart) return;
      this.chart.dispose();
      this.chart = null;
    },
    getOption(options) {
      const data = options.map(({ value, name, color }) => ({
        value,
        name: `${name}(${value})`,
        itemStyle: { color },
        icon: "circle"
      }));

      return {
        legend: {
          orient: "vertical",
          x: this.$el.clientWidth < 400 ? "60%" : "70%",
          y: "center",
          data
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: {d}%"
        },
        series: [
          {
            center: [this.$el.clientWidth < 400 ? "30%" : "35%", "50%"],
            name: "",
            type: "pie",
            radius: ["50%", "70%"],
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
            data
          }
        ]
      };
    }
  }
};
</script>
