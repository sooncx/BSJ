<template>
  <div
    class="HeatMap"
    ref="map"
  >

    <div
      ref="visualMap"
      class="visualMap"
    ></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { mapState } from "vuex";
import GPS from "@/assets/js/GPS";

export default {
  data() {
    return {
      map: null
    };
  },

  computed: {
    ...mapState(["USER"])
  },

  mounted() {
    this.initMap();
  },

  methods: {
    //延迟渲染地图
    async initMap() {
      await this.$nextTick();
      await this.$sleep();

      this.map = new AMap.Map(this.$refs.map, {
        center: [105, 37.5],
        zoom: document.body.clientWidth > 1600 ? 4 : 3
      });

      //设置底图样式
      // this.map.setMapStyle("amap://styles/grey");
      if (this.USER.hotArea.length) {
        const code = JSON.parse(this.USER.hotArea[0]).code.toString();
        const district = new AMap.DistrictSearch({
          level: "district",
          extensions: "all"
        });
        district.search(code, (status, result) => {
          if (status === "complete") {
            new AMap.Polygon({
              path: result.districtList[0].boundaries,
              map: this.map,
              strokeColor: "rgba(61,121,248,1)", // 线颜色
              fillColor: "rgba(61,121,248,.1)",
              strokeStyle: "dashed", // 线样式
              strokeWeight: 1, // 线宽
            });
            this.map.setFitView();
          }
        });
      }

      //获取热力图数据
      this.getHeatData();
    },

    //获取热力图数据
    async getHeatData() {
      const { data } = await this.$API.vehicleHot();
      let heatmap = new AMap.Heatmap(this.map, {
        radius: 25, //给定半径
        opacity: [0, 0.8]
      });

      const heatData = data.map(item => {
        const { lon, lat } = GPS.gcj_encrypt(item.lat, item.lon);

        return {
          lng: lon,
          lat,
          count: 1
        };
      });

      heatmap.setDataSet({
        data: heatData,
        max: heatData.length
      });

      this.initVisualMap(heatData.length);
    },

    //范围条
    initVisualMap(len) {
      const option = {
        visualMap: {
          bottom: 0,
          right: 10,
          min: 0,
          max: len,
          itemWidth: 10,
          itemHeight: 100,
          inRange: {
            color: [
              "blue",
              "rgb(117,211,248)",
              "rgb(0, 255, 0)",
              "#ffea00",
              "red"
            ]
          },
          orient: "horizontal",
          text: [len, 0]
        }
      };

      const chart = echarts.init(this.$refs.visualMap, null, {
        renderer: "svg"
      });

      chart.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
.HeatMap {
  width: 100%;
  height: 100%;
  background: rgb(252, 249, 242);
  position: relative;
}

.visualMap {
  position: absolute;
  right: 0;
  bottom: 10px;
  width: 200px;
  height: 40px;
  z-index: 1;
}
</style>
