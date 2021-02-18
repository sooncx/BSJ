<template>
  <div class="NotFount">
    <img src="../../assets/img/404.png" alt="" />
    <p>找不到该页面，请<span @click="$router.replace('/monitorCenter')">返回</span></p>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
});
</script>
<style lang="less" scoped>
.NotFount {
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;

  p {
    font-size: 24px;
    color: #333;
    margin-top: 53px;
    span {
      color: rgba(24, 116, 229, 1);
      cursor: pointer;
    }
  }
}
</style>
