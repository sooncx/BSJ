<template>
  <div class="SendInstruction">
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="formData"
      class="demo-form-inline"
      label-width="80px"
    >
      <el-form-item
        label="工作模式"
        prop="type"
      >
        <el-select
          v-model="formData.type"
          placeholder=""
        >
          <el-option
            v-for="(item, index) in typeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
} from "vue";
export default defineComponent({
  components: {},
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
      visible: false,
      time: "",
      formData: {
        type: "自定义",
        code: "",
      },

      typeOptions: [
        {
          label: "自定义",
          value: "自定义",
        },
        {
          label: "省电模式-实时追踪模式",
          value: "省电模式-实时追踪模式",
        },
        {
          label: "省电模式-深度省电模式",
          value: "省电模式-深度省电模式",
        },
        {
          label: "省电模式-智能省电模式",
          value: "省电模式-智能省电模式",
        },
      ],
      setTime: function () {
        data.visible = false;
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
    watch(
      () => data.formData.type,
      (val) => {
        switch (val) {
          case "自定义":
            data.formData.code = "";
            break;
          case "省电模式-实时追踪模式":
            data.formData.code = "<SPBSJ*P:BSJGPS*3P:0>";
            break;
          case "省电模式-深度省电模式":
            data.formData.code = "";
            data.visible = true;
            break;
          case "省电模式-智能省电模式":
            data.formData.code = "<SPBSJ*P:BSJGPS*3P:2>";
            break;
          default:
            break;
        }
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
.SendInstruction {
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
::v-deep(.el-select) {
  width: 300px;
}
</style>