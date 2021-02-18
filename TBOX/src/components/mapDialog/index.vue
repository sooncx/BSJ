<template>
  <div ref="container"></div>
</template>
<script>
import { getCarIcon } from "@/assets/js/base";

export default {
  props: {
    coordinate: {
      type: Object,
      default: null
    },
    address: {
      type: String,
      default: null
    },
    vehicleType: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      map: null,
      marker: null
    };
  },
  mounted() {
    this.init(this.coordinate.lon, this.coordinate.lat);
  },
  watch: {
    coordinate(val) {
      this.init(val.lon, val.lat);
    },
    immediate: true
  },
  methods: {
    init(lon, lat) {
      //////////////////////////////初始化地图
      this.map = new AMap.Map(this.$refs.container, {
        resizeEnable: true,
        center: [lon, lat],
        zoom: 13
      });
      this.addMarker();
    },
    addMarker() {
      this.marker = new AMap.Marker({
        position: [this.coordinate.lon, this.coordinate.lat],
        offset: new AMap.Pixel(-16, -17.5), // 设置图标偏移度
        content: `<img style="width: 32px;height:35px;" src="${getCarIcon({ state: 0, vehicleType: this.vehicleType })}" />`
      });
      this.marker.setLabel({
        content: `<div class='bsj-infowindow'>${this.address}</div>` //设置文本标注内容
      });
      this.marker.setMap(this.map);
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.el-map,
div {
  width: 100%;
  height: 500px;
}
</style>


