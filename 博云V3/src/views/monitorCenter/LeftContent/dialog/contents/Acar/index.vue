<template>
  <div class="Acar">
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="formData"
      class="demo-form-inline"
      label-width="120px"
    >
      <el-form-item
        label="子母机报警"
        prop="alarm"
      >
        <el-select
          v-model="formData.alarm"
          placeholder="请选择类型"
        >
          <el-option
            label="开启"
            value="0"
          ></el-option>
          <el-option
            label="关闭"
            value="1"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="报警次数"
        prop="alarmNumber"
      >
        <el-input v-model="formData.alarmNumber"></el-input>
      </el-form-item>
      <el-form-item
        label="间隔时间"
        prop="alarmTime"
      >
        <el-input v-model="formData.alarmTime"></el-input>
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
    const checkAlarmNumber = (rule: any, value: any, callback: any) => {
      if (!value) {
        return callback(new Error("报警次数不能为空"));
      }
      setTimeout(() => {
        if (value < 1 || value > 200) {
          callback(new Error("范围1~200"));
        } else {
          callback();
        }
      }, 100);
    };
    const checkAlarmTime = (rule: any, value: any, callback: any) => {
      if (!value) {
        return callback(new Error("间隔时间不能为空"));
      }
      setTimeout(() => {
        if (value < 1 || value > 999) {
          callback(new Error("范围1~999"));
        } else {
          callback();
        }
      }, 100);
    };
    const data = reactive({
      ruleForm: null as any,
      formData: {
        alarm: "0",
        alarmNumber: "",
        alarmTime: "",
      },
      async sendCommand() {
        if (!props.command) return;
        let params = {
          vehicleId: props.vehInfo.V,
          commandType: props.command.param || null,
          commandMsg: [
            data.formData.alarm,
            data.formData.alarmNumber,
            data.formData.alarmTime,
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
      rules: {
        alarmNumber: [{ validator: checkAlarmNumber, trigger: "blur" }],
        alarmTime: [{ validator: checkAlarmTime, trigger: "blur" }],
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
.Acar {
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