<template>
  <div class="pabelBox">
    <el-form
      ref="ruleForm"
      :inline="true"
      :model="formData"
      class="demo-form-inline"
      label-width="140px"
      :rules="rules"
    >
      <div class="item">
        <el-form-item
          label="当前里程(公里)"
          prop="currentMileage"
        >
          <el-input
            v-model="formData.currentMileage"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="上次保养里程(KM)"
          prop="lastMileage"
        >
          <el-input
            v-model="formData.lastMileage"
            clearable
          ></el-input>
        </el-form-item>
      </div>
      <div class="item">
        <el-form-item
          label="上次保养时间"
          prop="lastMaintainTime"
        >
          <el-date-picker
            v-model="formData.lastMaintainTime"
            type="date"
            clearable
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="提前提醒(天)"
          prop="leadTime"
        >
          <el-input
            v-model="formData.leadTime"
            clearable
          ></el-input>
        </el-form-item>
      </div>
      <div class="item">
        <el-form-item
          label="提前提醒(KM)"
          prop="advanceKilometers"
        >
          <el-input
            v-model="formData.advanceKilometers"
            clearable
          ></el-input>
        </el-form-item>
      </div>
      <div class="item remark">
        <el-form-item label="备注">
          <el-input
            v-model="formData.remark"
            type="textarea"
            resize="none"
            :rows="5"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="tip">
      <div>
        <div>里程默认为10000公里保养一次，可设置提前保养里程提醒。</div>
        <div>日期默认为1年保养一次，可设置提前保养日期提醒。</div>
      </div>
    </div>
    <div class="footer">
      <span class="dialog-footer">
        <!-- 用于布局的无用dom -->
        <span></span>
        <span>
          <el-button @click="close">取 消</el-button>
          <el-button
            type="primary"
            @click="confirm"
          >确 定</el-button>
        </span>
      </span>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, reactive, toRefs, watch } from "vue";
import dayJs from "dayjs";
import lodash from "lodash";
import { useFunction } from "../../../../function";
export default defineComponent({
  props: {
    activeName: {
      type: String,
      default: "",
    },
    vehInfo: {
      type: Object,
      default: null,
    },
    maintenceData: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, { emit }) {
    const { maintenanceSettings, showAMsg } = useFunction();
    const data = reactive({
      ruleForm: null as any,
      formData: {
        currentMileage: "",
        lastMileage: "",
        lastMaintainTime: "",
        leadTime: "",
        advanceKilometers: "",
        remark: "",
      },
      rules: {
        currentMileage: [{ required: true, message: "请输入当前里程" }],
        lastMileage: [{ required: true, message: "请输入上次保养里程" }],
        lastMaintainTime: [{ required: true, message: "请输入上次保养时间" }],
        leadTime: [{ required: true, message: "请输入提前提醒天数" }],
        advanceKilometers: [{ required: true, message: "请输入提前提醒里程" }],
      },
      submitForm: function (formName: any) {
        data.ruleForm.validate((valid: any) => {
          if (valid) {
            data.saveData();
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
      close() {
        data.resetForm("ruleForm");
        emit("update:visible", false);
      },
      async saveData() {
        const params = {
          ...data.formData,
          vehicleId: props.vehInfo.V,
        };
        params.lastMaintainTime = dayJs(params.lastMaintainTime).format(
          "YYYY-MM-DD"
        );
        const res = await maintenanceSettings(params);
        if (res == 1) {
          showAMsg("保存保养信息成功");
          emit("update:visible", false);
        }
      },
    });
    const { activeName } = toRefs(props);
    nextTick(() => {
      watch(
        () => props.maintenceData,
        (val) => {
          if (!val) return;
          const copyData = lodash.cloneDeep(val);
          data.formData = copyData as any;
        },
        {
          deep: true,
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
.pabelBox {
  margin-top: 15px;
}
::v-deep(.el-input__inner),
::v-deep(.el-date-editor) {
  width: 230px;
  height: 34px;
  border-radius: 0;
}
::v-deep(.el-form-item__label) {
  width: 100px;
  text-align: right;
}
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.radio {
  width: 50%;
  float: left;
  padding-left: 25px;
}
::v-deep(.el-form-item) {
  margin-bottom: 15px;
}
.remark {
  width: 100%;
  ::v-deep(.el-textarea) {
    width: 618px;
  }
}
.tip {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
  & > div {
    width: 748px;
    height: 80px;
    padding-left: 24px;
    display: flex;
    flex-direction: column;
    background: #eff5ff;
    align-items: flex-start;
    justify-content: space-evenly;
    font-size: 13px;
    font-family: PingFang SC Bold, PingFang SC Bold-Bold;
    color: #005afd;
    line-height: 24px;
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