<template>
  <div class="scheduSend">
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="formData"
      class="demo-form-inline"
      label-width="70px"
    >
      <el-form-item
        label="选择类型"
        prop="type"
      >
        <el-select
          v-model="formData.type"
          placeholder="请选择类型"
        >
          <el-option
            v-for="(item, index) in typeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <div class="codeBox">
          <el-input
            :rows="8"
            resize="none"
            type="textarea"
            v-model="formData.code"
          ></el-input>
        </div>
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
  <Eldialog
    v-model:visible="visible"
    width="400px"
    title="输入回传时间间隔,范围10-720分钟"
  >
    <template v-slot:form>
      <div class="dialog">
        <el-input
          v-model="time"
          style="width:200px;margin-right: 20px"
        ></el-input>
        <el-button
          type="primary"
          @click="setTime"
        >确 定</el-button>
      </div>
    </template>
  </Eldialog>
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
  components: {
    Eldialog: defineAsyncComponent(
      () => import("@/components/Eldialog/index.vue")
    ),
  },
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
        data.formData.code = `<SPBSJ*P:BSJGPS*3P:${data.time}>`;
        data.visible = false;
      },
      async sendCommand() {
        if (!props.command) return;
        let params = {
          vehicleId: props.vehInfo.V,
          commandType: props.command.param || null,
          commandMsg: data.formData.code || "",
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
.scheduSend {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 22px;
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
</style>