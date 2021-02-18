<template>
  <!-- 内容自定义 -->
  <div
    class="content"
    v-if="hasSimData"
  >
    <div class="sim">
      <img
        src="../../../../../../assets/img/dialog/sim.png"
        alt=""
      />
    </div>
    <div class="inputs">
      <el-form
        ref="ruleForm"
        :rules="rules"
        :model="formData"
        class="demo-form-inline"
        label-width="100px"
      >
        <el-form-item
          label="车牌号码"
          prop="plate"
        >
          <el-input v-model="formData.plate" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item
          label="SIM卡号"
          prop="sim"
        >
          <el-input v-model="formData.sim" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item
          label="总流量(M)"
          prop="traffic"
        >
          <el-input v-model="formData.traffic" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item
          label="已用"
          prop="used"
        >
          <el-input v-model="formData.used" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item
          label="剩余"
          prop="left"
        >
          <el-input v-model="formData.left" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <div
    class="errorContent"
    v-if="!hasSimData"
  >
    <img
      src="../../../../../../assets/img/dialog/error.png"
      alt=""
    />
    <div>抱歉，查询(车牌号{{ formData.plate }})流量失败，可能是以下原因</div>
    <div class="error">
      <div>查询异常</div>
      <div>查询异常</div>
      <div>查询异常</div>
    </div>
  </div>
  <div class="footer">
    <span class="dialog-footer">
      <!-- 用于布局的无用dom -->
      <span></span>
      <span>
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
  computed,
  defineComponent,
  nextTick,
  reactive,
  toRefs,
  watch,
} from "vue";
export default defineComponent({
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      ruleForm: null as any,
      formData: {
        plate: "",
        sim: "",
        traffic: "",
        used: "",
        left: "",
      },
      hasSimData: true,
      submitForm: function (formName: any) {
        data.ruleForm.validate((valid: any) => {
          if (valid) {
            // alert("submit!");
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
        emit("update:visible", false);
        data.resetForm("ruleForm");
      },
      getData() {
        data.hasSimData = true;
        console.log("流量查询");
      },
      rules: {},
    });
    nextTick(() => {
      watch(
        () => props.visible,
        (val) => {
          if (val) {
            data.getData();
          }
        },
        {
          immediate: true,
        }
      );
    });
    return {
      ...toRefs(props),
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
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
.content {
  width: 100%;
  height: 100%;
  padding: 60px 70px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.errorContent {
  width: 100%;
  height: 100%;
  padding: 60px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img {
    margin-bottom: 20px;
  }
  & > div {
    white-space: nowrap;
    margin-bottom: 20px;
  }
  .error {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-left: 130px;
    width: 100%;
    div {
      position: relative;
      display: flex;
      align-items: center;
      height: 24px;
      &::before {
        width: 8px;
        height: 8px;
        content: "";
        position: absolute;
        left: -15px;
        top: 8px;
        border-radius: 6px;
        background: #0e60db;
      }
    }
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
::v-deep(.el-input__inner) {
  width: 250px;
}
</style>