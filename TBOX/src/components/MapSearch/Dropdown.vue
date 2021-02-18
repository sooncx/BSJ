<template>
  <div
    class="Dropdown"
  >
    <div
      class="Dropdown__item"
      v-for="(item, index) in tips"
      :key="index"
      @click="$emit('onLocalChange', item)"
    >
      <span
        class="Dropdown__label"
        :title="item.name"
      >{{ item.name }}</span>
      <span
        class="Dropdown__desc"
        :title="item.district"
      >{{ item.district }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tips: {
      type: Array,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.Dropdown {
  @include scrollBar();
  min-width: 360px;
  max-height: 350px;
  z-index: 3999;
  display: block;
  padding: 6px 0;
  box-sizing: border-box;
  position: absolute;
  top: calc(100% - 1px);
  background: #fff;
  border-top: 1px solid #e4e6e7;
  box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
  border-radius: 0 0 2px 2px;

  &__item {
    font-size: 14px;
    padding: 0 20px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #606266;
    height: 34px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    align-items: center;

    &:hover {
      background: #f5f7fa;
    }

    &_on {
      color: #3385ff;
    }
  }

  &__label {
    @include ellipsis();
    flex: 1;
  }

  &__desc {
    @include ellipsis();
    margin-left: 5px;
    flex: 1;
    color: #8492a6;
    font-size: 13px;
    text-align: right;
  }
}
</style>
