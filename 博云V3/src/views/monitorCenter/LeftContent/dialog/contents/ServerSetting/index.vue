<template>
  <div class="serverSetting">
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="formData"
      class="demo-form-inline"
      label-width="80px"
    >
      <span class="select">
        <el-select
          v-model="formData.type"
          placeholder="请选择类型"
        >
          <el-option
            label="ip"
            value="0"
          ></el-option>
          <el-option
            label="域名"
            value="1"
          ></el-option>
        </el-select>
      </span>
      <el-form-item
        label=""
        prop="ip"
      >
        <el-input
          v-model="formData.ip"
          style="width:300px"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="端口"
        prop="port"
      >
        <el-input
          v-model="formData.port"
          style="width:300px"
        ></el-input>
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
    const data = reactive({
      ruleForm: null as any,
      formData: {
        type: "0",
        ip: "",
        port: "",
      },
      async sendCommand() {
        if (!props.command) return;
        let params = {
          vehicleId: props.vehInfo.V,
          commandType: props.command.param || null,
          commandMsg: [
            "SERVER",
            data.formData.type,
            data.formData.ip,
            data.formData.port,
            "0#",
          ].join(","),
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
      rules: {},
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
.serverSetting {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  .codeBox {
    width: 300px;
    margin-left: -75px;
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
.select {
  position: relative;
  bottom: -40px;
  ::v-deep(.el-input__inner) {
    border: none;
    width: 80px;
  }
}
</style>