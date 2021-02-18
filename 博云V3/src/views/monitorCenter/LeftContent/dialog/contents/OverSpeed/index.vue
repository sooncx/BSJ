<template>
  <div class="overSpeed">
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="formData"
      class="demo-form-inline"
      label-width="120px"
    >
      <el-form-item
        label="超速阈值(km/h)"
        prop="speedLimit"
      >
        <el-input
          style="width:300px"
          v-model="formData.speedLimit"
          placeholder="超速阈值(km/h)"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
  <div class="footer">
    <span class="dialog-footer">
      <span v-if="isGroup">
        <el-checkbox v-model="checked">对该车组下的所有车组进行设置</el-checkbox>
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
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  nextTick,
  reactive,
  toRefs,
  watch,
  watchEffect,
} from "vue";
import { useFunction } from "../../../../function";
export default defineComponent({
  props: {
    dialogData: {
      type: Object || Array,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    isGroup: {
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
    groupInfo: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit }) {
    const { sendCommandDown, showMsg, groupDown } = useFunction();
    const data = reactive({
      checked: false,
      ruleForm: null as any,
      formData: {
        speedLimit: "",
      },
      async sendCommand() {
        if (!props.command) return;
        let params = {
          commandType: props.command.param || null,
          commandMsg: data.formData.speedLimit || "",
        } as any;
        if (data.checked) {
          params.selectedSubGroup = 1;
        }
        let res = null;
        if (props.vehInfo && props.vehInfo.V) {
          params.vehicleId = props.vehInfo.V;
          res = await sendCommandDown(params);
        }
        if (props.groupInfo && props.groupInfo.gi) {
          params.groupId = props.groupInfo.gi;
          res = await groupDown(params);
        }
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
        data.checked = false;
      },
      confirm() {
        data.submitForm("ruleForm");
      },
      rules: {
        speedLimit: [{ required: true, message: "请输入超速阈值" }],
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
.overSpeed {
  width: 100%;
  height: 150px;
  padding-top: 20px;
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