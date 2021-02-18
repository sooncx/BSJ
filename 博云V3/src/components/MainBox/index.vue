<template>
  <div
    class="ManageBox"
    :style="{padding: mypadding}"
  >
    <div
      v-if="$slots.upside"
      class="ManageBox__upside"
    >
      <slot name="upside" />
    </div>

    <div
      v-if="$slots.content"
      class="ManageBox__content"
    >
      <slot name="header" />
    </div>;
    <Drag
      v-if="draggable"
      v-model:defaultWidth=leftWidth
      class="ManageBox__content"
    >
      <div
        class="ManageBox__left"
        :style="{ padding: leftPadding }"
      >
        <slot name="left" />
      </div>
      <div
        class="ManageBox__right"
        :style="{ padding: rightPadding }"
      >
        <slot name="right" />
      </div>
    </Drag>
    <div
      class="ManageBox__content"
      v-if="!draggable"
    >
      <div
        :style="{ width: leftWidth, padding: leftPadding }"
        class="ManageBox__left"
      >
        <slot name="left" />
      </div>
      <div
        class="ManageBox__right"
        :style="{ padding: rightPadding }"
      >
        <slot name="right" />
      </div>
    </div>
    <slot />
  </div>

</template>
<script lang="ts">
import { defineComponent, toRefs } from "vue";
import Drag from "@/components/Drag/index.vue";
export default defineComponent({
  components: {
    Drag,
  },
  props: {
    draggable: {
      type: Boolean,
      default: true,
    },
    leftWidth: {
      type: String,
      default: "240px",
    },
    mypadding: {
      type: String,
      default: "0 16px",
    },
    leftPadding: {
      type: String,
      default: "16px",
    },
    rightPadding: {
      type: String,
      default: "16px",
    },
  },
  setup(props) {
    // const {
    //   draggable,
    //   leftWidth,
    //   mypadding,
    //   rightPadding,
    //   leftPadding,
    // } = toRefs(props);
    return {
      ...toRefs(props),
    };
  },
});
</script>

<style lang="less" scoped>
.ManageBox {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f7f7f7;
  box-sizing: border-box;
  padding: 0 16px;
  overflow: hidden;
  &__header {
    margin-top: 10px;
    height: 140px;
    overflow: hidden;
    background: transparent;
    padding: 0;
    width: calc(100% + 20px);
    margin-left: -10px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
  }
  &__upside2 {
    height: 50px;
    overflow: hidden;
    background: #fff;
    padding: 0 16px;
    display: flex;
    align-items: center;
    margin-bottom: 1px;
  }
  &__upside {
    margin-top: 10px;
    height: 50px;
    overflow: hidden;
    background: #fff;
    padding: 0 16px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
  }
  &__footer {
    height: 40%;
    display: flex;
    overflow: hidden;
    margin-bottom: 16px;
  }
  &__content2 {
    display: flex;
    overflow: hidden;
    margin-bottom: 16px;
  }
  &__content {
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  &__left {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #fff;
    padding: 16px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  &__right {
    flex: 1;
    box-sizing: border-box;
    height: 100%;
    background: #fff;
    margin-left: 16px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      width: 6px;
      background-color: rgba(144, 147, 153, 0.3);
      transition: background-color 0.3s;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: rgba(144, 147, 153, 0.5);
    }
    &::-webkit-scrollbar-thumb:active {
      background-color: rgba(144, 147, 153, 0.5);
    }
  }
}
</style>
