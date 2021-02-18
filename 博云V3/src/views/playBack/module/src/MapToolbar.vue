<template>
  <ul class="mapToolBar">
    <li @click="startRuler">
      <i class="iconfont icon-chizi"></i>
      测距
    </li>
  </ul>
</template>
<script lang="ts">
import { defineComponent, inject, reactive, toRefs } from "vue";
import { useMessage } from '@/hooks/web/useMessage';

export default defineComponent({
  setup() {
    const data = reactive({
      message: useMessage(),
      mapControl: <() => void>inject("mapControl"),
      startRuler() {
        console.log(this);
        this.message.success('开始测距...双击将结束测距');
        this.mapControl.getDistance(true);
      },
    });

    return {
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.mapToolBar {
  position: absolute;
  top: 10px;
  right: 20px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0px 6px 10px 0px rgba(0, 0, 0, 0.05);
  z-index: 500;
  li {
    display: flex;
    align-items: center;
    padding: 5px 10px;
    &:hover {
      background: #0e60db;
      color: #fff;
    }
  }
  .iconfont {
    margin-right: 5px;
    font-size: 14px;
  }
}
</style>
