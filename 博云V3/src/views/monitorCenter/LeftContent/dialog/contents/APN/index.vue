<template>
  <div class="APN">
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="formData"
      class="demo-form-inline"
      label-width="80px"
    >
      <el-form-item
        label="网络名"
        prop="name"
      >
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item
        label="账号"
        prop="account"
      >
        <el-input v-model="formData.account"></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
      >
        <el-input v-model="formData.password"></el-input>
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
        name: "",
        account: "",
        password: "",
      },
      async sendCommand() {
        if (!props.command) return;
        let params = {
          vehicleId: props.vehInfo.V,
          commandType: props.command.param || null,
        } as any;
        if (data.formData.account != "" && data.formData.password != "") {
          params.commandMsg = [
            [
              "APN",
              data.formData.name,
              data.formData.account,
              data.formData.password,
            ].join(","),
            "#",
          ].join("");
        } else {
          params.commandMsg = [["APN", data.formData.name].join(","), "#"].join(
            ""
          );
        }
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
        name: [{ required: true, message: "请输入网络名" }],
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
.APN {
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
</style> 