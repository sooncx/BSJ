<template>
  <div class="DisconnectOilElectricity">
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="formData"
      class="demo-form-inline"
      label-width="150px"
    >
      <el-form-item
        label="输入密码"
        prop="password"
      >
        <el-input
          style="width:300px"
          v-model="formData.password"
          placeholder="密码"
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
import { defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
  props: {
    dialogData: {
      type: Object || Array,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const data = reactive({
      checked: false,
      ruleForm: null as any,
      formData: {
        password: "",
      },
      submitForm: function (formName: any) {
        data.ruleForm.validate((valid: any) => {
          if (valid) {
            alert("submit!");
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
    return {
      ...toRefs(props),
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.DisconnectOilElectricity {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
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
}
</style>