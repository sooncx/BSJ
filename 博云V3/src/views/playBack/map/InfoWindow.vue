<template>
  <div class="playback-infowindow">
    <div class="infowindow__header">
      {{ infoWindowData.type === "stopPoint" ? "经常停留点" : "" }}
      <!-- 轨迹停车点 -->
      <div class="closeBtn" @click="closeInfoWindow">
        <i class="iconfont icon-guanbi1"></i>
      </div>
    </div>
    <template v-if="infoWindowData.type === 'trackPoint'">
      <div
        class="infowindow__item"
        v-if="
          infoWindowData.data && infoWindowData.data.date.indexOf('~~') !== -1
        "
      >
        <span class="infowindow__title">开始：</span>
        <p class="infowindow__content">
          {{ infoWindowData.data && infoWindowData.data.date.split("~~")[0] }}
        </p>
      </div>
      <div
        class="infowindow__item"
        v-if="
          infoWindowData.data && infoWindowData.data.date.indexOf('~~') !== -1
        "
      >
        <span class="infowindow__title">结束：</span>
        <p class="infowindow__content">
          {{ infoWindowData.data && infoWindowData.data.date.split("~~")[1] }}
        </p>
      </div>

      <div class="infowindow__item" v-else>
        <span class="infowindow__title">时间：</span>
        <p class="infowindow__content">
          {{ infoWindowData.data && infoWindowData.data.date }}
        </p>
      </div>
      <div
        class="infowindow__item"
        v-if="
          infoWindowData.data && infoWindowData.data.date.indexOf('~~') !== -1
        "
      >
        <span class="infowindow__title">停车：</span>
        <p class="infowindow__content">
          {{
            timesFun(
              infoWindowData.data.date.split("~~")[0],
              infoWindowData.data.date.split("~~")[1]
            )
          }}
          <span
            style="color: #e57511; cursor: pointer"
            v-if="infoWindowData.data.hasNoLocation"
            @click="showDetail"
            >（包含不定位数据）</span
          >
        </p>
      </div>
      <div class="infowindow__item" v-else>
        <span class="infowindow__title">速度：</span>
        <p class="infowindow__content">
          {{ infoWindowData.data && infoWindowData.data.speed }}km/h
        </p>
      </div>
      <div class="infowindow__item">
        <span class="infowindow__title">里程：</span>
        <p class="infowindow__content">
          {{ infoWindowData.data && infoWindowData.data.mileage }}km
        </p>
      </div>
      <div class="infowindow__item">
        <span class="infowindow__title">地址：</span>
        <p class="infowindow__content">
          {{ infoWindowData.data && infoWindowData.data.address }}
        </p>
      </div>
    </template>
    <template v-if="infoWindowData.type === 'alarmPoint'">
      <div class="infowindow__item">
        <span class="infowindow__title--long">报警类型：</span>
        <p class="infowindow__content">
          {{
            infoWindowData.data &&
            (infoWindowData.data.alarmtype || infoWindowData.data.type)
          }}
        </p>
      </div>
      <div class="infowindow__item">
        <span class="infowindow__title--long">开始时间：</span>
        <p class="infowindow__content">
          {{ infoWindowData.data && infoWindowData.data.timeBegin }}
        </p>
      </div>
      <div class="infowindow__item">
        <span class="infowindow__title--long">结束时间：</span>
        <p class="infowindow__content">
          {{ infoWindowData.data && infoWindowData.data.timeEnd }}
        </p>
      </div>
      <div class="infowindow__item">
        <span class="infowindow__title--long">报警地址：</span>
        <p class="infowindow__content">
          {{ infoWindowData.data && infoWindowData.data.address }}
        </p>
      </div>
    </template>
    <template v-if="infoWindowData.type === 'stopPoint'">
      <div class="infowindow__item">
        <span class="infowindow__title--long">停车时长：</span>
        <p class="infowindow__content">
          {{ infoWindowData.data && infoWindowData.data.spaceTimeTotal }}
        </p>
      </div>
      <div class="infowindow__item">
        <span class="infowindow__title--long">停车次数：</span>
        <p class="infowindow__content">
          {{ infoWindowData.data && infoWindowData.data.n }}
        </p>
      </div>
      <div class="infowindow__item">
        <span class="infowindow__title--long">停车地址：</span>
        <p class="infowindow__content">
          {{ infoWindowData.data && infoWindowData.data.address }}
        </p>
      </div>
      <p style="color: #e6a23c; font-size: 12px; margin-top: 4px">
        最近一个月内多次停留且时间较长
      </p>
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject, PropType } from "vue";
import { timesFun } from "@/utils";

export default defineComponent({
  setup(props, { emit }) {
    const infoWindowData = <any>inject("infoWindowData");

    const closeInfoWindow = () => {
      emit("closeInfoWindow");
    };

    const tableControl = <any>inject("tableControl");
    const showDetail = () => {
      tableControl.value.showDetail(infoWindowData.value.data);
    };
    return { closeInfoWindow, timesFun, showDetail, infoWindowData };
  },
});
</script>
<style lang="less" scoped>
.playback-infowindow {
  width: 300px;
  padding: 10px 16px;
  background: #fff;
  box-shadow: 0 10px 20px 2px rgba(0, 0, 0, 0.294);
  position: relative;

  .closeBtn {
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 10px;
    .iconfont {
      font-size: 14px;
    }
  }
  .infowindow {
    &__header {
      color: #333;
      font-size: 16px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
    }

    &__item {
      display: flex;
      color: #999;
      line-height: 18px;
      font-size: 12px;
    }

    &__title {
      width: 40px;
      text-align: right;
      &--long {
        width: 70px;
      }
    }
    &__content {
      flex: 1;
      color: #666;
    }
  }

  &::after {
    content: "";
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #fff;
    position: absolute;
    left: 50%;
    bottom: -10px;
    transform: translateX(-50%);
  }
}
</style>
