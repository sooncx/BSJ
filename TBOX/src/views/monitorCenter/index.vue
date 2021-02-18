<template>
  <Drag
    class="monitorCenter"
    :min-width="300"
    defaultWidth="300px"
  >
    <LeftContent
      slot="left"
      :vehInfo.sync="vehInfo"
      :vehGroup.sync="vehGroup"
      :vehIndices.sync="vehIndices"
      @updateGroup="handleGroupData"
      @onZoomMarker="ZoomMarker()"
      class="monitorCenter__left"
    />

    <div
      class="monitorCenter__right"
      slot="right"
    >
      <Toolbar
        :map="map"
        :vehInfo="vehInfo"
        :clusterVisible="cluster.visible"
        @toggleCluster="toggleCluster(true)"
      />

      <!-- 地图开始 -->
      <div
        class="monitorCenter__map"
        ref="map"
      >
        <!-- 刷新位置开始 -->
        <div
          class="refresh"
          v-show="refresh.timer"
        >
          <span class="refresh__num">{{refresh.num}}</span>秒后刷新
        </div>
        <!-- 刷新位置结束 -->

        <!-- 底部信息窗口开始 -->
        <UndersideInfoWindow
          :vehInfo="vehInfo"
          v-if="vehInfo"
        />
        <!-- 底部信息窗口结束 -->
      </div>
      <!-- 地图结束 -->

      <!-- 信息窗口开始 -->
      <InfoWindow
        ref="InfoWindow"
        :vehInfo="vehInfo"
        @onClose="infoWindow.close()"
        v-if="vehInfo"
      />
      <!-- 信息窗口结束 -->
    </div>
  </Drag>
</template>

<script>
import GPS from "@/assets/js/GPS";
import { getCarIcon } from "@/assets/js/base";
import Drag from "@/components/Drag/index.vue";
import LeftContent from "./LeftContent.vue";
import InfoWindow from "./InfoWindow.vue";
import Toolbar from "./Toolbar.vue";
import UndersideInfoWindow from "./UndersideInfoWindow.vue";

export default {
  components: {
    Drag,
    LeftContent,
    InfoWindow,
    Toolbar,
    UndersideInfoWindow
  },

  data() {
    return {
      map: null,
      infoWindow: {
        instance: null,
        visible: false
      }, //当前信息窗口
      markerMap: new Map(), //当前地图车辆
      vehGroup: { gids: new Set(), data: [] }, //当前车组车辆
      vehIndices: { value: new Map(), timestamp: 0 }, //当前已选车辆索引
      vehInfo: null, //当前车辆信息
      vid: null, //当前车辆id
      vehsLimit: 100, //当前地图车辆限制, 超过100开启聚合
      cluster: {
        instance: null, //点聚合实例
        visible: true
      },
      refresh: {
        //轮询定时器
        timer: null,
        num: 0
      }
    };
  },

  watch: {
    //监听索引变化
    vehIndices() {
      //处理索引变化
      this.handleIndices();
      //重新刷新轮询
      this.handlePolingRefresh();
    },
    async vehInfo(nowVal, curVal) {
      if (!nowVal) return;

      //map setCenter LngLat
      if (!curVal || nowVal.vehicleId !== curVal.vehicleId) {
        this.ZoomMarker();
      }
    }
  },

  mounted() {
    this.initMap();
  },

  methods: {
    //延迟渲染地图
    initMap() {
      this.map = new AMap.Map(this.$refs.map, {
        center: [117.000923, 36.675807],
        zoom: 11
      });
    },
    //重新刷新轮询
    handlePolingRefresh() {
      if (this.vehIndices.value.size === 0) {
        clearInterval(this.refresh.timer);
        this.refresh = {
          timer: null,
          num: 0
        };
      } else {
        !this.refresh.timer && this.pollingRefresh();
      }
    },
    //轮询
    pollingRefresh() {
      clearInterval(this.refresh.timer);
      this.refresh.num = 10;
      this.refresh.timer = setInterval(async () => {
        this.refresh.num === 0 ? (this.refresh.num = 10) : this.refresh.num--;
        if (this.refresh.num === 0) {
          if(this.$route.path !== "/monitorCenter") return;
          //每10秒获取车组数据
          try {
            const gids = [...this.vehGroup.gids];
            const {
              data
            } = await this.$API.getVehicleMonitoringByOrganizationId({
              organizationIds: gids.join(",")
            });
            this.handleGroupData(gids, data);
          } catch (error) {
            console.error(error);
            this.$msg({
              showClose: true,
              message: error.msg,
              type: "warning"
            });
          }
        }
      }, 1000);
      this.$off("hook:beforeDestroy");
      this.$once("hook:beforeDestroy", () => {
        clearInterval(this.refresh.timer);
      });
    },
    //处理车组数据排序 以及 更新索引内最新数据
    handleGroupData(gids, data) {
      //有多个车组时则需要排序
      if (gids.length > 1) {
        //建立车组点击顺序的映射
        const gidsMap = new Map(gids.map((gid, i) => [gid, i]));
        //按树状图点击先后顺序来排序
        data.sort(
          (a, b) =>
            gidsMap.get(b.organizationId) - gidsMap.get(a.organizationId)
        );
      }

      let vehIndices = new Map(this.vehIndices.value);
      data.map(item => {
        //更新当前车辆信息
        this.vehInfo &&
          this.vehInfo.vehicleId === item.vehicleId &&
          (this.vehInfo = Object.freeze(item));
        //更新索引内最新数据
        vehIndices.has(item.vehicleId) && vehIndices.set(item.vehicleId, item);
      });

      //更新已选车辆索引
      this.vehIndices = {
        value: vehIndices,
        timestamp: Date.now()
      };
      //更新车组数据
      this.vehGroup = {
        data: Object.freeze(data),
        gids: new Set(gids)
      };
    },
    //处理车辆索引变化
    async handleIndices() {
      if (this.$route.path !== "/monitorCenter") return;
      if (this.vehIndices.value.size === 0) {
        this.infoWindow = null;
        this.vehInfo = null;
        //清除点聚合
        this.cluster.instance && this.cluster.instance.clearMarkers();
        this.cluster.instance = null;
        //清除地图上所有点
        this.map && this.map.remove([...this.markerMap.values()]);
        this.markerMap = new Map();
        this.map && this.map.clearMap();
        return;
      }
      this.showVehGroup();
    },
    //多车模式
    async showVehGroup() {
      //清除点聚合
      if (!this.cluster.visible) {
        this.cluster.instance && this.cluster.instance.clearMarkers();
        this.cluster.instance = null;
      }

      let markerMap = this.markerMap;
      //删除索引内不存在的车辆
      [...markerMap.keys()].map(vid => {
        if (!this.vehIndices.value.has(vid)) {
          markerMap.get(vid).setMap(null);
          markerMap.delete(vid);
        }
      });
      //添加或删除车辆
      let renderNum = 0;
      let changeNum = 0;
      const vehs = [...this.vehIndices.value.values()];
      for (let i = 0; i < vehs.length; i++) {
        const nowVehInfo = { ...vehs[i] }; //复制防止内存泄露

        //如果markerMap内存有该车辆
        if (markerMap.has(nowVehInfo.vehicleId)) {
          const { lon, lat } = GPS.gcj_encrypt(nowVehInfo.lat, nowVehInfo.lon);
          const marker = markerMap.get(nowVehInfo.vehicleId);
          const oldVehInfo = marker.getExtData(); //获取旧数据
          marker.setExtData(nowVehInfo); //设置最新数据

          //超过数量限制则代表开聚合，不setMap影响性能
          vehs.length > this.vehsLimit
            ? marker.setMap(null)
            : marker.setMap(this.map);

          if (
            nowVehInfo.lon !== oldVehInfo.lon ||
            nowVehInfo.lat !== oldVehInfo.lat
          ) {
            //位置改变时才设置车辆位置
            changeNum++;
            await batchSetPosition.bind(this)(
              marker,
              [lon, lat],
              changeNum,
              50,
              50
            );
          }

          if (nowVehInfo.state !== oldVehInfo.state) {
            //如果图片信息有变化则重新设置图片
            changeNum++;
            await batchSetContent.bind(this)(
              marker,
              nowVehInfo,
              changeNum,
              50,
              50
            );
          }
        } else {
          //如果markerMap内没存有该车辆
          renderNum++;
          await batchMarker.bind(this)(nowVehInfo, i, vehs, renderNum, 50, 50); //分批渲染
        }
      }

      //地图上车辆大于100辆自动开启聚合
      if (
        !this.cluster.visible &&
        this.vehIndices.value.size > this.vehsLimit
      ) {
        this.cluster.visible = true;
        this.$msg({
          showClose: true,
          message: `由于地图车辆超过${this.vehsLimit}辆, 开启聚合以优化性能`,
          type: "warning"
        });
      }
      //设置点聚合
      this.cluster.visible && this.toggleCluster();

      //分批设置marker Content
      function batchSetContent(marker, item, changeNum, num, ms) {
        //changeNum代表当前渲染到多少辆了， num代表每多少辆暂停会执行， ms代表暂停多少毫秒
        return new Promise(resolve => {
          marker.setContent(
            `<img style="width: 32px;height:35px;transform: rotate(${
              item.F
            }deg);" src="${getCarIcon(item)}" />`
          );

          if (changeNum % num === 0) {
            //每num辆则等ms再渲染
            setTimeout(() => {
              resolve();
            }, ms);
          } else {
            resolve();
          }
        });
      }
      //分批设置marker位置
      function batchSetPosition(marker, position, changeNum, num, ms) {
        //changeNum代表当前渲染到多少辆了， num代表每多少辆暂停会执行， ms代表暂停多少毫秒
        return new Promise(resolve => {
          marker.setPosition(new AMap.LngLat(...position));

          if (changeNum % num === 0) {
            //每num辆则等ms再渲染
            setTimeout(() => {
              resolve();
            }, ms);
          } else {
            resolve();
          }
        });
      }
      //分批渲染函数
      function batchMarker(item, index, vehs, renderNum, num, ms) {
        //renderNum代表当前渲染到多少辆了， num代表每多少辆暂停会执行， ms代表暂停多少毫秒
        return new Promise(resolve => {
          const { lon, lat } = GPS.gcj_encrypt(item.lat, item.lon);
          let marker = new AMap.Marker({
            map: vehs.length > this.vehsLimit ? null : this.map,
            position: [lon, lat], // 位置
            offset: new AMap.Pixel(-16, -17.5), // 设置图标偏移度
            content: `<img style="width: 32px;height:35px;transform: rotate(${
              item.F
            }deg);" src="${getCarIcon(item)}" />`,
            label: {
              content: `<div class="bsj-infowindow"><span>${item.plate}</span><span>${item.organizationName}</span></div>` //设置文本标注内容
            },
            extData: item
          });

          marker.on("click", () => {
            //更新车辆信息
            this.vehInfo = Object.freeze(item);
            item.vehicleId === this.vehInfo.vehicleId &&
              this.infoWindow.open(this.map);
          });

          this.markerMap.set(item.vehicleId, marker);

          if (renderNum % num === 0) {
            //每num辆则等ms再渲染
            setTimeout(() => {
              resolve();
            }, ms);
          } else {
            resolve();
          }
        });
      }
    },
    //移至当前车辆
    async ZoomMarker() {
      if (!this.$refs.InfoWindow) await this.$nextTick();
      const { lon, lat } = GPS.gcj_encrypt(this.vehInfo.lat, this.vehInfo.lon);
      this.infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -20),
        isCustom: true,
        autoMove: false,
        content: this.$refs.InfoWindow.$el
      });

      this.infoWindow.open(this.map, [lon, lat]);
      this.map.setCenter([lon, lat]);
      this.map.panBy(0, 30);
    },
    //设置点聚合
    toggleCluster(flag) {
      if (flag) {
        if (
          this.cluster.visible &&
          this.vehIndices.value.size > this.vehsLimit
        ) {
          this.$msg({
            showClose: true,
            message: `地图车辆超过${this.vehsLimit}辆, 不能关闭`,
            type: "warning"
          });
          return;
        }
        this.cluster.visible = !this.cluster.visible;
        this.cluster.visible
          ? this.$msg({
              showClose: true,
              message: "聚合开启",
              type: "success"
            })
          : this.$msg({
              showClose: true,
              message: "聚合关闭",
              type: "success"
            });
      }

      if (this.cluster.visible) {
        if (this.cluster.instance) {
          this.cluster.instance.setMarkers([...this.markerMap.values()]);
        } else {
          this.markerMap.size > 0 &&
            (this.cluster.instance = new AMap.MarkerClusterer(
              this.map,
              [...this.markerMap.values()],
              { maxZoom: 17, gridSize: 80 }
            ));
        }
      } else {
        this.showVehGroup();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.monitorCenter {
  height: 100%;
  display: flex;

  &__left {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  &__right {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  &__address {
    overflow: hidden;
  }

  &__map {
    flex: 1;
    position: relative;
  }
}

.refresh {
  border: 1px solid #ebedf0;
  height: 24px;
  line-height: 24px;
  box-sizing: border-box;
  padding: 0 5px;
  background: #fff;
  border-radius: 3px;
  font-size: 10px;
  z-index: 999;
  box-shadow: 0 0 3px 1px RGBA(16, 68, 114, 0.2);
  font-weight: bold;
  color: #969799;
  position: absolute;
  left: 10px;
  top: 10px;

  &__num {
    color: $primary;
    margin-right: 4px;
  }
}

/deep/ .amap-marker-label {
  /deep/ .bsj-infowindow {
    span {
      &:nth-child(1) {
        font-size: 13px;
        font-weight: bold;
      }

      &:nth-child(2) {
        color: #7d7e80;
        font-size: 10px;
      }
    }
  }
}

/deep/ .amap-info-contentContainer {
  border-radius: 0;
  padding: 0;
}

</style>
