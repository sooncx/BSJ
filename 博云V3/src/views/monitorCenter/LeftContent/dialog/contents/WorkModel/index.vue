<template>
  <div class="WorkModel">
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="formData"
      class="demo-form-inline"
      label-width="50px"
    >
      <el-form-item label="">
        <el-radio
          v-model="radio"
          label="1"
        >闹钟模式</el-radio>
        <a-time-picker
          :disabled="radio != '1'"
          v-model:value="formData.alarmModel"
          format="HH:mm"
          placeholder=""
        />
      </el-form-item>
      <el-form-item
        label=""
        prop="timingModel"
      >
        <el-radio
          v-model="radio"
          label="2"
        >定时模式</el-radio>
        <el-input
          :disabled="radio != '2'"
          style="width:300px"
          v-model="formData.timingModel"
          placeholder="范围1-999999秒"
        ></el-input>
      </el-form-item>
      <el-form-item
        label=""
        prop="wakeupModel"
      >
        <el-radio
          v-model="radio"
          label="3"
        >定时唤醒模式</el-radio>
        <el-input
          :disabled="radio != '3'"
          style="width:300px"
          v-model="formData.wakeupModel"
          placeholder="范围10-1440分钟"
        ></el-input>
      </el-form-item>
      <el-form-item
        label=""
        prop="type"
      >
        <el-radio
          v-model="radio"
          label="4"
        >点名模式</el-radio>
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
import dayJs from "dayjs";
import moment from "moment";
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
    const { sendCommandDown, showMsg, getWorkMode } = useFunction();
    const checkTimingModel = (rule: any, value: any, callback: any) => {
      if (data.radio != "2") {
        callback();
        return;
      }
      if (!value) {
        return callback(new Error("定时模式值不能为空"));
      }
      setTimeout(() => {
        if (value < 1 || value > 999999) {
          callback(new Error("范围1~999999"));
        } else {
          callback();
        }
      }, 100);
    };
    const checkWakeupModel = (rule: any, value: any, callback: any) => {
      if (data.radio != "3") {
        callback();
        return;
      }
      if (!value) {
        return callback(new Error("定时唤醒模式值不能为空"));
      }
      setTimeout(() => {
        if (value < 10 || value > 1440) {
          callback(new Error("范围10~1440"));
        } else {
          callback();
        }
      }, 100);
    };
    const data = reactive({
      ruleForm: null as any,
      formData: {
        alarmModel: moment("00:00", "HH:mm"),
        timingModel: "",
        wakeupModel: "",
      },
      radio: "1",
      async getWorkModeData() {
        const res = await getWorkMode({
          vehicleId: props.vehInfo.V,
        });
        if (res) {
          let arr = res.split(",");
          data.radio = arr[0].toString();
          if (arr[0] == 1) {
            data.formData.alarmModel = moment(arr[1], "HH:mm");
          } else if (arr[0] == 2) {
            data.formData.timingModel = arr[1];
          } else if (arr[0] == 3) {
            data.formData.wakeupModel = arr[1];
          }
        }
      },
      async sendCommand() {
        if (!props.command) return;
        let params = {
          vehicleId: props.vehInfo.V,
          commandType: props.command.param || null,
        } as any;
        if (data.radio == "1") {
          params.commandMsg = [
            data.radio,
            dayJs(data.formData.alarmModel as any).format("HH:mm"),
          ].join(",");
        } else if (data.radio == "2") {
          params.commandMsg = [data.radio, data.formData.timingModel].join(",");
        } else if (data.radio == "3") {
          params.commandMsg = [data.radio, data.formData.wakeupModel].join(",");
        } else {
          params.commandMsg = [data.radio, 0].join(",");
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
        data.formData.alarmModel = moment("00:00", "HH:mm");
      },
      confirm() {
        data.submitForm("ruleForm");
      },
      rules: {
        timingModel: [{ validator: checkTimingModel, trigger: "blur" }],
        wakeupModel: [{ validator: checkWakeupModel, trigger: "blur" }],
      },
    });
    watch(
      () => props.visible,
      (val) => {
        nextTick(() => {
          val && data.resetForm("ruleForm");
          val && data.getWorkModeData();
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
.WorkModel {
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  padding: 20px 16px;
  .el-radio {
    width: 100px;
  }
}
.dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100%;
}
.tip {
  width: 338px;
  height: 55px;
  background: #deebff;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 11px 37px;
  font-size: 12px;
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;
  color: #0e60db;
  line-height: 16px;
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