<template>
  <div class="pabelBox">
    <el-form
      ref="ruleForm"
      :inline="true"
      :model="formData"
      class="demo-form-inline"
      :rules="rules"
    >
      <div class="item">
        <el-form-item label="是否首保">
          <el-select v-model="formData.type" placeholder="请选择">
            <el-option label="是首保" value="1"></el-option>
            <el-option label="非首保" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登记日期" prop="loginTime">
          <el-date-picker
            v-model="formData.loginTime"
            type="date"
            clearable
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="item">
        <el-form-item label="保险公司" prop="insuranceCompany">
          <el-select
            v-model="formData.insuranceCompany"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="(item, index) in insuranceCompanyList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提醒日期" prop="leadTime">
          <el-input
            v-model="formData.leadTime"
            clearable
            placeholder="输入提前天数"
          ></el-input>
        </el-form-item>
      </div>
      <div class="item">
        <el-form-item label="险种明细" prop="insuranceType">
          <el-select
            v-model="formData.insuranceType"
            multiple
            clearable
            collapse-tags
            filterable
            placeholder="请选择"
            @change="insuranceChange"
          >
            <el-option
              v-for="(item, index) in insuranceList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="总金额(元)" prop="amountMoney">
          <el-input v-model="formData.amountMoney" clearable></el-input>
        </el-form-item>
      </div>
      <div class="item remark">
        <el-form-item label="备注信息">
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
        <div>
          首保 在没有填写续保次数的时候；提醒日期=(登记日期+1年）-提前提醒N天
        </div>
        <div>
          续保:在填写了续保次数的时候，提醒日期=登记日期+1年+（续保次数*1）-提前提醒N天
        </div>
      </div>
    </div>
    <div class="footer">
      <span class="dialog-footer">
        <!-- 用于布局的无用dom -->
        <span></span>
        <span>
          <el-button @click="$emit('update:visible', false)">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
      </span>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, reactive, toRefs, watch } from "vue";
import { useStore } from "vuex";
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
    insuranceData: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, { emit }) {
    const store = useStore() as any;
    const { insertInsuranceDate, showAMsg } = useFunction();
    const data = reactive({
      ruleForm: null as any,
      formData: {
        type: "2",
        loginTime: "",
        leadTime: "",
        insuranceType: [],
        insuranceCompany: "",
        amountMoney: "",
        remark: "",
      },
      rules: {
        loginTime: [{ required: true, message: "请输入登记日期" }],
        insuranceCompany: [{ required: true, message: "请选择保险公司" }],
        leadTime: [{ required: true, message: "请输入提醒日期" }],
        insuranceType: [{ required: true, message: "请选择险种明细" }],
        amountMoney: [{ required: true, message: "请输入总金额" }],
      },
      insuranceCompanyList: [],
      insuranceList: [],
      insuranceChange() {
        console.log(data.formData.insuranceType);
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
        params.loginTime = dayJs(params.loginTime).format("YYYY-MM-DD");
        params.insuranceType = params.insuranceType.join(",") as any;
        const res = await insertInsuranceDate(params);
        if (res == 1) {
          showAMsg("保存保险信息成功");
          emit("update:visible", false);
        }
      },
    });
    const { activeName } = toRefs(props);
    nextTick(() => {
      data.insuranceCompanyList = store.state.insurance;
      data.insuranceList = store.state.insuranceType;
      watch(
        () => props.insuranceData,
        (val) => {
          if (!val) return;
          const copyData = lodash.cloneDeep(val);
          let arr = [] as any;
          copyData.insuranceType.split(",").map((item: string) => {
            arr.push(parseInt(item));
          });
          copyData.insuranceType = arr;
          copyData.type = copyData.type.toString();
          copyData.insuranceCompany = parseInt(copyData.insuranceCompany);
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
  width: 250px !important;
  height: 34px !important;
  border-radius: 0;
}
::v-deep(.el-select__tags) {
  // 用于解决多选框换行问题
  .el-select__input {
    max-width: 50px !important;
  }
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
    width: 658px;
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