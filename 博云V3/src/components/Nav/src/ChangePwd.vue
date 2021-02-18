<template>
  <div class="changePass">
    <a-form
      :rules="rules"
      :model="form"
      ref="ruleForm"
      v-bind="{
        labelCol: { span: 7 },
        wrapperCol: { span: 11 },
      }"
    >
      <a-form-item label="旧密码" name="bPwd">
        <a-input-password v-model:value="form.bPwd" />
      </a-form-item>
      <a-form-item label="新密码" name="nPwd">
        <a-input-password v-model:value="form.nPwd" />
      </a-form-item>
      <a-form-item label="再次确认" name="checkPass">
        <a-input-password v-model:value="form.checkPass" />
      </a-form-item>
    </a-form>
  </div>
  <div class="changePass__footer">
    <a-button @click="$emit('update:visible', false)">取消</a-button>
    <a-button type="primary" @click="submit">确定</a-button>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { ElMessage } from "element-plus";
import API from "@/api/httpApi";

export default defineComponent({
  props: {
    visible: Boolean,
  },
  setup(props, { emit }) {
    const ruleForm = ref();

    let validateOldPass = async (rule: any, value: any) => {
      if (value === "") {
        return Promise.reject("请输入旧密码");
      } else {
        return Promise.resolve();
      }
    };

    let validatePass = async (rule: any, value: any) => {
      if (value === "") {
        return Promise.reject("请输入新密码");
      } else {
        if (data.form.checkPass !== "") {
          ruleForm && (ruleForm.value as any).validateField("checkPass");
        }
        return Promise.resolve();
      }
    };
    let validatePass2 = async (rule: any, value: any, callback: any) => {
      if (value === "") {
        return Promise.reject("请再次输入新密码");
      } else if (value !== data.form.nPwd) {
        return Promise.reject("两次输入的密码不一致!");
      } else {
        return Promise.resolve();
      }
    };

    const data = reactive({
      rules: {
        bPwd: [{ validator: validateOldPass, trigger: "blur" }],
        nPwd: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
      form: {
        bPwd: "",
        nPwd: "",
        checkPass: "",
      },
    });

    // 提交
    const submit = async () => {
      try {
        await (ruleForm.value as any).validateField();
        const info = JSON.parse(JSON.stringify(data.form));
        delete info.checkPass;
        const { flag, msg } = await API.modifyPwd(info);
        if (flag === 1) {
          ElMessage.success("修改成功");
          emit('update:visible', false);
        } else {
          ElMessage.error(msg);
        }
      } catch (error) {
        ElMessage.error(error.msg ? error.msg : error);
      }
    };

    return {
      ruleForm,
      ...toRefs(data),
      submit,
    };
  },
});
</script>
<style lang="less" scoped>
.changePass {
  width: 440px;
  height: 270px;
  display: flex;
  align-items: center;
  justify-content: center;

  .ant-form {
    width: 100%;
  }

  .ant-input {
    width: 216px;
  }

  ::v-deep(.ant-form-item-label > label) {
    color: #333;
  }

  &__footer {
    height: 44px;
    width: 440px;
    border-top: 1px solid #d9e0e9;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    button {
      margin-right: 16px;
    }
  }
}
</style>
