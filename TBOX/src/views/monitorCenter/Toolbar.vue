<template>
  <!-- 头部工具栏和地址开始 -->
  <div class="toolbar">
    <Marquee
      :text="address"
      class="toolbar__address"
    />
    <div
      class="toolbar__tool"
      @click="setSatellite()"
    >
      <i
        class="toolbar__icon iconfont icon-satellite-variant"
        :class="{toolbar__icon_on: Satellite.visible}"
      />
      {{Satellite.visible ? '卫星关' : '卫星开'}}
    </div>
    <div
      class="toolbar__tool"
      @click="setTraffic()"
    >
      <i
        class="toolbar__icon iconfont icon-Trafficlights"
        :class="{toolbar__icon_on: Traffic.visible}"
      />
      {{Traffic.visible ? '路况关' : '路况开'}}
    </div>
    <div
      class="toolbar__tool"
      @click="$emit('toggleCluster')"
    >
      <i
        class="toolbar__icon iconfont icon-combination1"
        :class="{toolbar__icon_on: clusterVisible}"
      />
      {{clusterVisible ? '聚合关' : '聚合开'}}
    </div>
  </div>
  <!-- 头部工具栏和地址结束 -->
</template>

<script>
import Marquee from "@/components/Marquee/index.vue";

export default {
  components: {
    Marquee
  },

  props: {
    map: [Object, null],
    vehInfo: [Object, null],
    clusterVisible: [Boolean]
  },

  data() {
    return {
      Satellite: {
        //卫星图
        visible: false,
        instance: null
      },
      Traffic: {
        //路况图
        visible: false,
        instance: null
      },
      address: "" //当前地址
    };
  },

  watch: {
    async vehInfo(nowVal, curVal) {
      if (!nowVal) {
        this.address = "";
        return;
      }

      //get change address
      if (!curVal || (nowVal.lon !== curVal.lon && nowVal.lat !== curVal.lat)) {
        const [{ address }] = await this.$API.GetGeo([nowVal]);
        this.address = address;
      }
    }
  },

  methods: {
    //设置卫星图
    setSatellite() {
      if (this.Satellite.instance === null) {
        this.Satellite.instance = new AMap.TileLayer.Satellite();
        this.Satellite.instance.setMap(this.map);
      }
      if (this.Satellite.visible) {
        this.Satellite.visible = false;
        this.Satellite.instance.hide();
      } else {
        this.Satellite.visible = true;
        this.Satellite.instance.show();
      }
    },
    //设置路况图
    setTraffic() {
      let flag = 0;
      if (this.Traffic.instance === null) {
        this.Traffic.instance = new AMap.TileLayer.Traffic({
          zIndex: 10
        });
        this.Traffic.instance.setMap(this.map);
        flag = 1;
      }
      if (this.Traffic.visible && flag != 1) {
        this.Traffic.visible = false;
        this.Traffic.instance.hide();
      } else {
        this.Traffic.visible = true;
        this.Traffic.instance.show();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  align-items: center;
  height: 33px;
  padding: 0 10px;
  border-bottom: 1px solid rgba(#999, 0.3);
  overflow: hidden;

  &__address {
    flex: 1;
  }

  &__tool {
    cursor: pointer;
    user-select: none;
    display: inline-flex;
    align-items: center;

    & + & {
      margin-left: 10px;
    }
  }

  &__icon {
    transition: 0.5s;
    margin-right: 5px;

    &:hover {
      color: rgba($primary, 0.8);
    }

    &_on {
      color: $primary;
    }
  }
}
</style>
