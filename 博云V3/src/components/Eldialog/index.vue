<template>
  <el-dialog
    v-model="show"
    :width="width"
    @opened="opened"
    @closed="closed"
    :top="dialogTop"
    :custom-class="dialogClass"
    :close-on-click-modal="false"
  >
    <!-- title自定义 -->
    <slot name="title" />
    <!-- 默认title -->
    <template
      #title
      v-if="!$slots.title && !$slots.all"
    >
      <div class="title">
        <p>{{title}}</p>
        <span>{{titleTip}}</span>
      </div>
    </template>
    <!-- 内容自定义 -->
    <div
      class="content"
      v-if="!$slots.form && !$slots.all"
    >
      <slot name="content" />
    </div>
    <!-- footer自定义 -->
    <slot
      name="footer"
      v-if="!$slots.form && !$slots.all"
    />
    <!-- 默认footer -->
    <template
      #footer
      v-if="showBtn && !$slots.footer && !$slots.form && !$slots.all"
    >
      <span class="dialog-footer">
        <span v-if="showCheck">
          <el-checkbox v-model="checked">{{checkTitle}}</el-checkbox>
        </span>
        <!-- 用于布局的无用dom -->
        <span></span>
        <span>
          <el-button @click="$emit('update:visible', false)">取 消</el-button>
          <el-button
            type="primary"
            @click="confirm"
          >确 定</el-button>
        </span>
      </span>
    </template>
    <!-- 内容和footer自定义 -->
    <slot name="form" />
    <!-- 全部自定 -->
    <slot name="all" />
  </el-dialog>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onUpdated,
  reactive,
  toRefs,
  watch,
} from "vue";
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "800px",
    },
    DialogType: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    titleTip: {
      type: String,
      default: "",
    },
    showBtn: {
      type: Boolean,
      default: true,
    },
    showCheck: {
      type: Boolean,
      default: false,
    },
    isCheck: {
      type: Boolean,
      default: false,
    },
    checkTitle: {
      type: String,
      default: "对该车组下的所有车辆进行设置",
    },
    dialogTop: {
      type: String,
      default: "15vh",
    },
    dialogClass: {
      type: String,
      default: "eldialog_class",
    },
  },
  emits: ["confirmOk", "update:visible", "update:isCheck", "closed"],
  setup(props, { emit }) {
    const { DialogType, isCheck } = toRefs(props);
    const data = reactive({
      others: {},
      checked: false,
      closed: function () {
        emit("update:visible", false);
        emit("closed");
      },
      opened: function () {},
    });
    const show = computed({
      get: () => props.visible,
      set: (val) => {
        emit("update:visible", val);
      },
    });
    function confirm() {
      emit("confirmOk", DialogType.value, data.others);
    }
    nextTick(() => {
      data.checked = isCheck.value;
      setTimeout(() => {
        watch(
          () => data.checked,
          (val) => {
            emit("update:isCheck", val);
          }
        );
      }, 100);
    });
    return {
      confirm,
      show,
      ...toRefs(props),
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.title {
  height: 50px;
  width: 100%;
  padding: 0px 16px;
  display: flex;
  border-bottom: 1px solid #e4e7eb;
  align-items: center;
  p {
    font-size: 15px;
    font-family: PingFang SC, PingFang SC-Bold;
    font-weight: 700;
    color: #0e60db;
    padding-right: 12px;
  }
  span {
    font-size: 12px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    color: #999999;
  }
}
.content {
  width: 100%;
  height: 100%;
  padding: 10px 16px;
  transition: all 0.5s;
}
.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
<style lang="less">
.eldialog_class {
  .el-dialog__headerbtn {
    top: 15px !important;
  }
}
</style>