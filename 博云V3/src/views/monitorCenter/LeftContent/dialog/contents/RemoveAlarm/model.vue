<template>
  <div class="title"></div>
  <div class="confirmModel">
    <slot />
  </div>
  <div class="footer">
    <span class="dialog-footer">
      <!-- 用于布局的无用dom -->
      <span></span>
      <span>
        <el-button
          size="small"
          @click="cancle"
        >取 消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="confirm"
        >确 定</el-button>
      </span>
    </span>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  toRefs,
  watch,
  nextTick,
} from "vue";
export default defineComponent({
  props: {},
  emits: ["cancle", "confirm"],
  setup(props, { emit }) {
    const data = reactive({
      cancle() {
        emit("cancle");
      },
      confirm() {
        emit("confirm");
      },
    });
    return {
      ...toRefs(props),
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.title {
  height: 30px;
  width: 20px;
  position: absolute;
  background: #fff;
  right: 10px;
  top: 10px;
}
.confirmModel {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  display: flex;
  padding: 20px 16px;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .item {
    height: 30px;
    width: 45%;
    display: flex;
    div {
      display: flex;
      align-items: center;
      p {
        min-width: 150px;
        margin-right: 10px;
        text-align: right;
        color: #b1b1b1;
      }
      span {
        max-width: 180px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
.dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100%;
}
.footer {
  width: 100%;
  height: 44px;
  padding: 5px 16px;
  border-top: 1px solid #d9e0e9;
  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
::v-deep(.el-button) {
  border-radius: 0 !important;
}
::v-deep(.el-button--primary) {
  background: #0e60db !important;
  border-color: #0e60db !important;
  &:hover {
    opacity: 0.8;
  }
}
</style>