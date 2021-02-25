<template>
  <div class="tip">
    {{title}}
  </div>
</template>
<script lang="ts">
import { defineComponent} from "vue";
export default defineComponent({
  name: "tipModal",     // 统一弹窗头部的标题
  props: {
    title: {
      type: String,
      default: '',
    },
  }
});
</script>
<style lang="less" scoped>
.tip{
  font-size:12px;
  width: 100%;
  height: 25px;
  line-height: 25px;
  margin-bottom: 10px;
  background-color: #e8f3ff;
  text-align: center;
  color:#147adf;
}
</style>