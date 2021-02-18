<template>
  <Eldialog
    v-bind="$attrs"
    :width="width"
    title="输入信息"
    @closed="closed"
  >
    <template v-slot:form>
      <div
        class="allVehAlarms"
        v-if="type == 'all'"
      >
        <el-form
          ref="ruleForm"
          :rules="rules"
          :model="formData"
          class="demo-form-inline"
          label-width="80px"
        >
          <el-form-item
            label="联系人"
            prop="contact"
          >
            <el-input v-model="formData.contact"></el-input>
          </el-form-item>
          <el-form-item
            label="联系电话"
            prop="contactNumber"
          >
            <el-input v-model="formData.contactNumber"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div
        class="singleVehAlarms"
        v-else
      >
        <div class="left">
          <el-form
            :model="vehFormData"
            class="demo-form-inline"
            label-width="80px"
          >
            <el-form-item label="车牌号">
              <el-input
                v-model="vehFormData.P"
                :disabled="true"
              ></el-input>
            </el-form-item>
            <el-form-item label="所属车组">
              <el-input
                v-model="vehFormData.N"
                :disabled="true"
              ></el-input>
            </el-form-item>
            <el-form-item label="报警时间">
              <el-input
                v-model="vehFormData.D"
                :disabled="true"
              ></el-input>
            </el-form-item>

            <el-form-item label="报警类型">
              <el-input
                v-model="vehFormData.T"
                :disabled="true"
              ></el-input>
            </el-form-item>
            <el-form-item label="报警地址">
              <el-input
                type="textarea"
                resize="none"
                :rows="3"
                v-model="vehFormData.address"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="right">
          <el-form
            ref="ruleForm"
            :model="vehFormData"
            :rules="rules"
            class="demo-form-inline"
            label-width="80px"
          >
            <el-form-item label="问题类型">
              <el-radio-group v-model="vehFormData.result">
                <el-radio :label="1">测试</el-radio>
                <el-radio :label="2">误报</el-radio>
                <el-radio :label="3">安装事故</el-radio>
                <el-radio :label="4">其他</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="联系人"
              prop="contact"
            >
              <el-input v-model="vehFormData.contact"></el-input>
            </el-form-item>
            <el-form-item
              label="联系电话"
              prop="contactNumber"
            >
              <el-input v-model="vehFormData.contactNumber"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="vehFormData.remark"
                type="textarea"
                resize="none"
                :rows="3"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
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
  </Eldialog>
</template>
<script lang="ts">
import {
  defineComponent,
  toRefs,
  defineAsyncComponent,
  ref,
  nextTick,
  computed,
  reactive,
  watch,
} from "vue";
import Eldialog from "@/components/Eldialog/index.vue";
import { useFunction } from "../../function";
export default defineComponent({
  components: {
    Eldialog,
  },
  props: {
    alarmInfo: {
      type: Object || Array,
      default: null,
    },
    type: {
      type: String,
      default: "single",
    },
  },
  emits: ["handleOk", "update:visible"],
  setup(props, { emit }) {
    const {
      showMsg,
      normalShowMsg,
      showAMsg,
      processAlarm,
      getAddress,
    } = useFunction();
    const data = reactive({
      ruleForm: null as any,
      formData: {
        contact: "",
        contactNumber: "",
      },
      vehFormData: {
        contact: "",
        contactNumber: "",
        remark: "",
        result: 1,
        P: "",
        N: "",
        D: "",
        T: "",
        address: "暂无数据",
      } as any,
      rules: {
        contact: [{ required: true, message: "请输入联系人" }],
        contactNumber: [{ required: true, message: "请输入联系电话" }],
      },
      submitForm: function (formName: any) {
        data.ruleForm.validate((valid: any) => {
          if (valid) {
            data.dealAlarm();
          } else {
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
      closed() {
        data.resetForm("ruleForm");
        data.vehFormData.result = 1;
        data.vehFormData.remark = "";
        data.vehFormData.address = "暂无数据";
        emit("update:visible",false);
      },
      async dealAlarm() {
        let params = {
          result: "",
          remark: "",
          contact: "",
          contactNumber: "",
          obj: [] as any,
        } as any;
        if (props.type == "all") {
          delete params.remark;
          params.result = 4;
          params.contact = data.formData.contact;
          params.contactNumber = data.formData.contactNumber;
          props.alarmInfo.map((item: any) => {
            params.obj.push({
              alarmId: item.A,
              groupId: item.G,
              vehicleId: item.V,
              alarmType: item.T,
            });
          });
        } else {
          params = {
            result: data.vehFormData.result,
            remark: data.vehFormData.remark,
            contact: data.vehFormData.contact,
            contactNumber: data.vehFormData.contactNumber,
            obj: {
              alarmId: props.alarmInfo.A,
              groupId: props.alarmInfo.G,
              vehicleId: props.alarmInfo.V,
              alarmType: props.alarmInfo.T,
            },
          };
        }
        const res = await processAlarm(params);
        if (res == 1) {
          showAMsg("处理报警成功");
          emit("handleOk");
          emit("update:visible", false);
        }
      },
    });
    nextTick(() => {
      watch(
        () => props.alarmInfo,
        async (val: any) => {
          if (!val) return;
          if (props.type == "all") {
            console.log(val, "alarmInfo");
          } else if (props.type == "single") {
            for (let i in val) {
              data.vehFormData[i] = val[i];
            }
            const address = await getAddress([{ lat: val.W, lng: val.J }]);
            data.vehFormData.address = address[0].address;
          }
        },
        {
          deep: true,
        }
      );
    });
    const width = computed(() => {
      return props.type == "all" ? "500px" : "850px";
    });
    return {
      width,
      ...toRefs(data),
      ...toRefs(props),
    };
  },
});
</script>
<style lang="less" scoped>
.allVehAlarms {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.singleVehAlarms {
  width: 100%;
  height: 100%;
  padding: 20px 16px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  .left {
  }
  .right {
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
::v-deep(.el-input__inner),
::v-deep(.el-textarea__inner) {
  width: 300px;
}
</style>