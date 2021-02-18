<template>
  <div class="title">
    <p>请输入账号密码,并确认</p>
    <span></span>
  </div>
  <div class="RestoreOilElectricity">
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="formData"
      class="demo-form-inline"
      label-width="0px"
    >
      <el-form-item
        label=""
        prop="password"
      >
        <el-input
          style="width:250px"
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
        password: "",
      },
      async sendCommand() {
        if (!props.command) return;
        let params = {
          vehicleId: props.vehInfo.V,
          commandType: props.command.param || null,
          commandMsg: data.formData.password,
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
        password: [{ required: true, message: "请输入账号密码" }],
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
.RestoreOilElectricity {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  display: flex;
  padding: 20px 16px 0 16px;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .item {
    height: 30px;
    width: 45%;
    display: flex;
    div {
      display: flex;
      align-items: center;
      p {
        min-width: 150px;
        margin-right: 10px;
        text-align: right;
        color: #b1b1b1;
      }
      span {
        max-width: 180px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
.dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100%;
}
.title {
  height: 50px;
  width: 100%;
  padding: 0px 16px;
  display: flex;
  border-bottom: 1px solid #e4e7eb;
  align-items: center;
  p {
    font-size: 15px;
    font-family: PingFang SC, PingFang SC-Bold;
    font-weight: 700;
    color: #0e60db;
    padding-right: 12px;
  }
  span {
    font-size: 12px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    color: #999999;
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
.icon-tixing {
  color: #d62223;
  padding-right: 5px;
}
</style>