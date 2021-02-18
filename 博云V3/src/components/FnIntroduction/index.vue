<template>
  <el-popover
    placement="right-start"
    popper-class="poperSize-mini"
    title=""
    width="440"
    trigger="hover"
  >
    <template #reference>
      <slot />
    </template>
    <div class="functionInfo-box">
      <section class="chunk-box">
        <div class="c-title">查询规则</div>
        <div class="c-cont">
          <p>
            <span class="c-red">有线设备</span
            >轨迹每次查询区间不能超过31天，轨迹记录默认保存3个月
          </p>
          <p>
            <span class="c-red">无线设备</span
            >轨迹每次查询区间不能超过90天，轨迹记录默认保存1年
          </p>
          <p>
            <span class="c-red">静止时间</span
            >用于筛选静止时间大于或等于所输入值的停留<span class="c-red"
              >轨迹</span
            >
          </p>
          <p>
            <span class="c-red">经常停留点</span>查询车辆<span class="c-red"
              >最近一个月内</span
            >停留时间大于<span class="c-red">30分钟</span>的经常停留点
          </p>
          <!-- <p><span class="c-red">停留时间</span>用于筛选停留时间大于或等于所输入值的经常<span class="c-red">停留点</span></p> -->
        </div>
      </section>
      <section class="chunk-box">
        <div class="c-title">特殊设备的里程显示为估算值：</div>
        <div class="c-cont">
          <p class="c-red">（注：针对于设备KM-01,KM-02,GT02D,A5E-3）</p>
          <p>
            该设备不支持里程数据上传，显示里程为<span class="c-red">估算值</span
            >，仅供参考使用！当发生以下情况，可能会导致里程<span class="c-red"
              >有误差</span
            >：
          </p>
          <p>
            1.当设备处于<span class="c-red">GPS信号弱</span
            >状态时（例如：停车场或处于GPS信号弱的地方）；
          </p>
          <p>2.当设备处于<span class="c-red">基站定位</span>时；</p>
          <p>3.其他可能导致<span class="c-red">定位异常</span>情况；</p>
        </div>
      </section>
    </div>
  </el-popover>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
});
</script>
<style lang="less" scoped>
.col-left {
  color: #0e60db;
  cursor: help;
}

.functionInfo-box {
  font-size: 12px;
  .chunk-box {
    margin-bottom: 10px;
    .c-red {
      color: red;
    }
    > .c-title {
      margin-bottom: 5px;
      font-weight: 16px;
      font-weight: 600;
    }
    > .c-cont {
      padding-left: 2em;
      > p + p {
        margin-top: 5px;
      }
    }
  }
}
</style>
