<template>
  <div class="A5M">
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="formData"
      class="demo-form-inline"
      label-width="150px"
    >
      <el-form-item
        label="模式设置"
        prop="alarm"
      >
        <el-select
          v-model="formData.modelType"
          placeholder="请选择类型"
        >
          <el-option
            label="非运单模式"
            value="0"
          ></el-option>
          <el-option
            label="运单模式"
            value="1"
          ></el-option>
        </el-select>
        <i
          class="iconfont icon-yiwen"
          @mouseenter="show = true"
          @mouseleave="show = false"
        ></i>
      </el-form-item>
      <el-form-item
        label="回传间隔"
        prop="backInterval"
      >
        <el-input v-model="formData.backInterval"></el-input>
      </el-form-item>
    </el-form>
  </div>
  <div class="footer">
    <span class="dialog-footer">
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
  </div>
  <div
    class="popContent"
    v-if="show"
  >
    <div>
      <p>非运单模式:</p>
      <div>设备开关开启才能工作,终端按设置的回传间隔唤醒，上传位置数据</div>
    </div>
    <div>
      <p>运单模式:</p>
      <div>设备开关关闭的情况下,终端也会按设置的回传间隔唤醒，上传位置数据</div>
    </div>
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
import { useFunction } from "../../../../function";
export default defineComponent({
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    command: {
      type: Object,
      default: () => null,
    },
    vehInfo: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit }) {
    const { sendCommandDown, showMsg } = useFunction();
    const checkBackInterval = (rule: any, value: any, callback: any) => {
      if (!value) {
        return callback(new Error("回传间隔不能为空"));
      }
      setTimeout(() => {
        if (value < 1 || value > 255) {
          callback(new Error("范围1~255"));
        } else {
          callback();
        }
      }, 100);
    };
    const data = reactive({
      show: false,
      ruleForm: null as any,
      formData: {
        modelType: "0",
        backInterval: "",
      },
      async sendCommand() {
        if (!props.command) return;
        let params = {
          vehicleId: props.vehInfo.V,
          commandType: props.command.param || null,
          commandMsg: [
            data.formData.backInterval,
            data.formData.modelType,
          ].join("|"),
        } as any;
        const res = await sendCommandDown(params);
        if (res == 1) {
          showMsg("命令已下发，结果请查看命令下发报表");
          emit("update:visible", false);
        }
      },
      submitForm: function (formName: any) {
        data.ruleForm.validate((valid: any) => {
          if (valid) {
            data.sendCommand();
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      resetForm: function (formName: any) {
        data.ruleForm.resetFields();
      },
      confirm() {
        data.submitForm("ruleForm");
      },
      rules: {
        backInterval: [{ validator: checkBackInterval, trigger: "blur" }],
      },
    });
    watch(
      () => props.visible,
      (val) => {
        nextTick(() => {
          val && data.resetForm("ruleForm");
        });
      },
      {
        immediate: true,
      }
    );
    return {
      ...toRefs(props),
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.A5M {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  height: 60px;
  padding: 10px 16px;
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
::v-deep(.el-input__inner) {
  width: 300px;
}
.icon-yiwen {
  cursor: pointer;
  margin-left: 10px;
}
.popContent {
  position: absolute;
  right: 50px;
  top: 160px;
  width: 280px;
  height: 140px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.493);
  & > div {
    font-size: 12px;
    font-family: PingFang SC, PingFang SC-Bold;
    font-weight: 700;
    color: #ffffff;
    line-height: 16px;
    p {
      color: #ffffff;
    }
    div {
      font-weight: 400;
    }
  }
}
</style> 