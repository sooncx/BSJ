<template>
  <div class="TimeZone">
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="formData"
      class="demo-form-inline"
      label-width="80px"
    >
      <el-form-item
        label="时区方位"
        prop="direct"
      >
        <el-select
          v-model="formData.direct"
          placeholder="请选择类型"
        >
          <el-option
            label="东经"
            value="E"
          ></el-option>
          <el-option
            label="西经"
            value="W"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="整时区"
        prop="timezone"
      >
        <el-input
          style="width:300px"
          v-model="formData.timezone"
          placeholder="整时区"
        ></el-input>
      </el-form-item>
      <div class="check">
        <el-checkbox v-model="checked"></el-checkbox>
      </div>
      <el-form-item
        label="半时区"
        prop="halfTimezone"
      >
        <el-select
          :disabled="!checked"
          v-model="formData.halfTimezone"
          placeholder="请选择类型"
        >
          <el-option
            label="15"
            value="15"
          ></el-option>
          <el-option
            label="30"
            value="30"
          ></el-option>
          <el-option
            label="45"
            value="45"
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
import { defineComponent, reactive, toRefs, watch } from "vue";
import { useFunction } from "../../../../function";
export default defineComponent({
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
      checked: false,
      ruleForm: null as any,
      formData: {
        timezone: "",
        direct: "E",
        halfTimezone: "15",
        halfTimezoneOpen: false,
      },
      async sendCommand() {
        if (!props.command) return;
        let params = {
          vehicleId: props.vehInfo.V,
          commandType: props.command.param || null,
          commandMsg: data.checked
            ? [
                [
                  "GMT",
                  data.formData.direct,
                  data.formData.timezone,
                  data.formData.halfTimezone,
                ].join(","),
                "#",
              ].join("")
            : [
                ["GMT", data.formData.direct, data.formData.timezone].join(","),
                "#",
              ].join(""),
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
        timezone: [
          { required: true, message: "请输入时区" },
          {
            pattern: /^\-?([0-9]|10|11|12)$/,
            message: "整时区范围在0~±12",
            trigger: "blur",
          },
        ],
      },
    });
    watch(
      () => props.visible,
      (val) => {
        if (!val) {
          data.resetForm('ruleForm')
        }
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
.TimeZone {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.check {
  display: inline-block;
  position: absolute;
  left: 130px;
  top: 235px;
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
::v-deep(.el-select) {
  width: 300px;
}
</style>