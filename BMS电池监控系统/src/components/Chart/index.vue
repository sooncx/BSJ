<template>
  <div class="Chart"></div>
</template>

<script>
import echarts from "echarts";

export default {
  props: {
    option: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      chart: null
    };
  },

  watch: {
    option(val) {
      if (!val) {
        this.clearChart();
        return;
      }

      const isRenderFail =
        !this.$el ||
        (this.$el &&
          this.$el.firstChild &&
          this.$el.firstChild.style.width === "0px");

      if (isRenderFail || !this.chart) {
        this.clearChart();
        if (this.$el) {
          this.$el.removeAttribute("_echarts_instance_");
          this.$el.innerHTML = "";
        }
        this.chart = echarts.init(this.$el, null, {
          renderer: "svg"
        });
      }
      this.chart.setOption(val);
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
    }
  }
};
</script>
