<template>
  <div
    class="HeatMap"
    :class="`HeatMap_${mapType}`"
    ref="map"
  >

  </div>
</template>

<script>
export default {
  data() {
    return {
      map: null,
      mapType: JSON.parse(localStorage.getItem("BSJMapOpts")).mapType
    };
  },

  mounted() {
    this.initMap();
  },

  methods: {
    //延迟渲染地图
    async initMap() {
      await this.$nextTick();
      await this.$sleep();

      this.map = new BSJMap.Map(this.$refs.map, {
        center: [105, 37.5],
        zoom: document.body.clientWidth > 1600 ? 4 : 3
      });

      // this.map.setLayers([
      //     new AMap.TileLayer({
      //       getTileUrl:
      //         "http://mt{1,2,3,0}.google.cn/vt/lyrs=m@221097413,traffic&hl=en&gl=en&x=[x]&y=[y]&z=[z]&s=Galil"
      //     })
      //   ]);

      //设置底图样式
      this.map.setMapStyle("dark");

      const posList = [
        [95.204866, 39.489547],
        [105, 37.5],
        [124.208772, 44.57709],
        [108.915804, 26.256871],
        [108.915804, 39.489547],
        [138.974397, 36.158194]
      ];

      for (let i = 0; i < posList.length; i++) {
        const size = 30 + Math.floor(Math.random() * 20);

        new BSJMap.Marker({
          map: this.map,
          position: posList[i], // 位置
          icon: new BSJMap.Icon({
            image: require("@/assets/img/home/gif.gif"),
            imageSize: [size, size],
            size: [size, size],
          }),
          zIndex: 999
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.HeatMap {
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss">
// 不同地图设置不同地图颜色
.HeatMap {
  &_AMap {
    background: rgb(42, 42, 42);
  }

  &_GMap {
    > div {
      background-color: #17263c !important;
    }
  }
}
</style>
