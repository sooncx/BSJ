<template>
  <span :class="getClass">
    <CaretRightOutlined :style="style" />
  </span>
</template>
<script lang="ts">
  import type { PropType } from 'vue';

  import { defineComponent, computed } from 'vue';
  import { CaretRightOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    name: 'BasicArrow',
    components: { CaretRightOutlined },
    props: {
      // Expand contract, expand by default
      expand: {
        type: Boolean as PropType<boolean>,
        default: true,
      },
      style: {
        type: Object as PropType<any>,
        default: { color: '#fff' },
      },
    },
    setup(props) {
      const getClass = computed(() => {
        const preCls = 'base-arrow';
        const cls = [preCls];
        props.expand && cls.push(`${preCls}__active`);
        return cls;
      });

      return {
        getClass,
      };
    },
  });
</script>
<style lang="less" scoped>
  .base-arrow {
    transform: rotate(-90deg);
    transition: all 0.3s ease 0.1s;
    transform-origin: center center;

    &.right {
      transform: rotate(0deg);

      > span {
        transition: all 0.3s ease 0.1s !important;
      }
    }

    &__active {
      transform: rotate(90deg);
    }

    &.right.base-arrow__active {
      span {
        transform: rotate(90deg);
      }
    }
  }
</style>
