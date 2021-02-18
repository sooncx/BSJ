<template>
  <div class="empty">
    <div class="empty__image">
      <img :src="image" alt="">
    </div>
    <div class="empty__desc">
      <p>暂无数据</p>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  props: {
    image: {
      type: String,
      default: require('@/assets/img/nothing.png'),
    }
  }
}
</script>
<style lang="less" scoped>
.empty {
  padding: 50px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  &__desc {
    margin-top: 20px;
    color: #999;
  }
}
</style>
