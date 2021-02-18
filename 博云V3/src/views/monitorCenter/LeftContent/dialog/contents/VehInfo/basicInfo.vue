<template>
  <div class="basicInfoRef">
    <div class="tipBar">
      <span v-if="tipType == 1">编辑车牌号会自动匹配相关联车辆信息</span>
      <span v-else-if="tipType == 2">暂无匹配数据</span>
      <span v-else>同步完成，蓝色输入框为同步的数据，点击这里<span
          class="setback"
          @click="getBack"
        >撤回</span>同步</span>
      <el-tooltip
        placement="bottom-end"
        effect="light"
      >
        <template #content>
          <div class="tipDetail">
            <div class="tipDetail_header">可能同步的时候有以下字段</div>
            <div class="tipDetail_content">
              所属车组:车架号;发动机号;车型;服务密码;车主;备注;续费年限;证件号;联系方式;车主地址;安装人员;安装地址。
            </div>
            <div class="tipDetail_footer">
              如以上某个字段为空,则当前字段不同步
            </div>
          </div>
        </template>
        <i class="iconfont icon-yiwen"></i>
      </el-tooltip>

    </div>
    <el-form
      ref="ruleForm"
      :inline="true"
      :model="formData"
      class="demo-form-inline"
      :rules="rules"
    >
      <!-- <div class="item"> -->
      <el-form-item
        label="车牌号码"
        prop="plate"
      >
        <el-input
          :class="{connect_input:hasClass('plate')}"
          v-model="formData.plate"
          clearable
          @blur="setConnectData('plate')"
          @focus="getConnectFlag = false"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="SIM卡号"
        prop="sim"
      >
        <el-input
          v-model="formData.sim"
          clearable
        ></el-input>
      </el-form-item>
      <!-- </div> -->
      <!-- <div class="item"> -->
      <el-form-item
        label="设备类型"
        prop="terminalType"
      >
        <el-select
          filterable
          v-model="formData.terminalType"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in terminalTypeOptions"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="设备号码"
        prop="terminalNo"
      >
        <el-input
          v-model="formData.terminalNo"
          clearable
        ></el-input>
      </el-form-item>
      <!-- </div> -->
      <!-- <div class="item"> -->
      <el-form-item label="所属车组">
        <GroupSelect
          ref="inputRef"
          v-model:value="group"
          v-model:show="visible"
        />
      </el-form-item>
      <el-form-item
        v-if="formData.terminalType == 'LA-01'"
        label="MAC"
        prop="mac"
      >
        <el-input
          v-model="formData.mac"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        label="车架号码"
        prop="frameNo"
      >
        <el-input
          :class="{connect_input:hasClass('frameNo')}"
          v-model="formData.frameNo"
          clearable
          @blur="setConnectData('frameNo')"
          @focus="getConnectFlag = false"
        ></el-input>
      </el-form-item>
      <!-- </div> -->
      <!-- <div class="item"> -->
      <el-form-item
        label="发动机号"
        prop="engineNo"
      >
        <el-input
          :class="{connect_input:hasClass('engineNo')}"
          v-model="formData.engineNo"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        label="车辆类型"
        prop="vehicleType"
        :class="{connect_input:hasClass('vehicleType')}"
      >
        <el-input
          v-model="formData.vehicleType"
          clearable
        ></el-input>
      </el-form-item>
      <!-- </div> -->
      <!-- <div class="item"> -->
      <el-form-item
        label="ICCID"
        prop="iccid"
      >
        <el-input
          v-model="formData.iccid"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        label="服务密码"
        prop="serviceCode"
      >
        <el-input
          :class="{connect_input:hasClass('serviceCode')}"
          v-model="formData.serviceCode"
          clearable
        ></el-input>
      </el-form-item>
      <!-- </div> -->
      <!-- <div class="item"> -->
      <el-form-item
        label="激活时间"
        prop="activationTmeStr"
      >
        <el-date-picker
          :disabled="true"
          format="YYYY-MM-DD HH:mm:ss"
          v-model="formData.activationTmeStr"
          type="datetime"
          clearable
          placeholder="暂无日期时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="安装时间"
        prop="installDate"
      >
        <el-date-picker
          format="YYYY-MM-DD HH:mm:ss"
          v-model="formData.installDate"
          type="datetime"
          clearable
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </el-form-item>
      <!-- </div> -->
      <!-- <div class="item"> -->
      <el-form-item
        label="车主名称"
        prop="owner"
      >
        <el-input
          :class="{connect_input:hasClass('owner')}"
          v-model="formData.owner"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        label="续费年限"
        prop="displayYear"
      >
        <el-select
          v-model="formData.displayYear"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="(item, index) in displayYearOptions"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- </div> -->
      <!-- <div
        class="item"
        v-if="type == 'modify'"
      > -->
      <div
        class="radio"
        v-if="type == 'modify'"
      >
        <el-form-item label="状态">
          <el-radio-group
            v-model="formData.settle"
            @change="changeRadio"
          >
            <el-radio :label="1">结清</el-radio>
            <el-radio :label="0">未结清</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <!-- </div> -->
      <div class="item remark">
        <el-form-item
          label="备注信息"
          prop="remark"
        >
          <el-input
            :class="{connect_input:hasClass('remark')}"
            v-model="formData.remark"
            type="textarea"
            resize="none"
            :rows="3"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="footer">
      <span class="dialog-footer">
        <!-- 用于布局的无用dom -->
        <span></span>
        <span>
          <el-button @click="close">取 消</el-button>
          <el-button
            type="primary"
            @click="confirm"
            v-permission="type == 'add'?1:permission"
          >确 定</el-button>
        </span>
      </span>
    </div>
  </div>
  <Eldialog
    :title="formData.settle == 1?'结清':'结清撤回'"
    width="630px"
    v-model:visible="settleVisible"
  >
    <template v-slot:form>
      <Settlement
        v-model:visible="settleVisible"
        :vehicleId="vehInfo.V"
        :settleType="formData.settle == 1?'settle':'settleBack'"
        @SettlementCancle="SettlementCancle"
        @SettlementConfirm="SettlementConfirm"
      />
    </template>
  </Eldialog>

</template>
<script lang="ts">
import {
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  toRefs,
  watch,
  inject,
  defineAsyncComponent,
} from "vue";
import GroupSelect from "@/components/GroupSelect/index.vue";
import { useStore } from "vuex";
import lodash from "lodash";
import { useFunction } from "../../../../function";
export default defineComponent({
  components: {
    GroupSelect,
    Eldialog: defineAsyncComponent(
      () => import("@/components/Eldialog/index.vue")
    ),
    Settlement: defineAsyncComponent(() => import("../Settlement/index.vue")),
  },
  props: {
    vehInfo: {
      type: Object,
      default: null,
    },
    addGroupInfo: {
      type: Object,
      default: null,
    },
    activeName: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "add",
    },
    basicInfoData: {
      type: Object,
      default: () => {},
    },
    visible: {
      type: Boolean,
      default: false,
    },
    permission: {
      type: Number,
      default: 1,
    },
  },
  emits: ["SettlementConfirm", "update:basicInfoData", "update:visible"],
  setup(props, { emit }) {
    const { getVehicleDateByPlate } = useFunction();
    const editVehOk = inject("editVehOk") as Function;
    const showToggle = inject("showToggle") as any;
    const store = useStore();
    const data = reactive({
      tipType: 1,
      settleVisible: false,
      settleShow: true,
      inputRef: null,
      ruleForm: null as any,
      getConnectFlag: false, // 用于判断是否进行关联数据补完标识
      connectData: null,
      group: {},
      FormDataMap: new Map([
        ["plate", { value: "" }],
        ["frameNo", { value: "" }],
        ["engineNo", { value: "" }],
        ["vehicleType", { value: "" }],
        ["serviceCode", { value: "" }],
        ["owner", { value: "" }],
        ["remark", { value: "" }],
      ]),
      FormDataSet: new Set(),
      copyFormData: {
        plate: "",
        frameNo: "",
        engineNo: "",
        vehicleType: "",
        serviceCode: "",
        owner: "",
        remark: "",
      } as any,
      formData: {
        plate: "",
        sim: "",
        mac: "",
        terminalType: store.state.vehTypes[0].typemap,
        terminalNo: "",
        groupId: null,
        groupName: "",
        frameNo: "",
        engineNo: "",
        vehicleType: "",
        iccid: "",
        serviceCode: "",
        activationTmeStr: "",
        installDate: null,
        owner: "",
        settle: 0,
        displayYear: 0,
        remark: "",
      } as any,
      terminalTypeOptions: [],
      displayYearOptions: [
        {
          name: "未选择",
          value: 0,
        },
        {
          name: "1年",
          value: 1,
        },
        {
          name: "2年",
          value: 2,
        },
        {
          name: "3年",
          value: 3,
        },
        {
          name: "4年",
          value: 4,
        },
        {
          name: "5年",
          value: 5,
        },
      ],
      rules: {
        plate: [
          { required: true, message: "请输入车牌号" },
          {
            pattern: /^.{1,20}$/,
            message: "车牌号最多20位", //this.$t("login.username_rules"),
            trigger: "blur",
          },
        ],
        frameNo: [
          {
            pattern: /^[A-Za-z0-9]{16,17}$/,
            message: "车架号为16~17位数字和字母", //this.$t("login.username_rules"),
            trigger: "blur",
          },
        ],
        sim: [
          { required: true, message: "请输入sim卡号" },
          // {
          //   pattern: /^1[3-9][0-9]\d{8}$/,
          //   message: "请输入正确的sim卡号",
          //   trigger: "blur",
          // },
          {
            pattern: /^\d{11,13}$/,
            message: "sim卡号为11位~13位", //this.$t("login.username_rules"),
            trigger: "blur",
          },
        ],
        terminalType: [{ required: true, message: "请选中设备类型" }],
        terminalNo: [{ required: true, message: "请输入设备号" }],
        groupId: [{ required: true, message: "请选则所属车组" }],
        mac: [{ required: true, message: "请输入蓝牙mac地址" }],
      },
      submitForm: function (formName: any) {
        data.ruleForm.validate((valid: any) => {
          if (valid) {
            emit("update:basicInfoData", data.formData);
            editVehOk();
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      resetForm: function (formName: any) {
        data.ruleForm.resetFields();
        data.group = {};
      },
      confirm() {
        data.submitForm("ruleForm");
      },
      close() {
        data.resetForm("ruleForm");
        emit("update:visible", false);
      },
      changeRadio(val: any) {
        data.settleVisible = true;
      },
      SettlementCancle() {
        const copyData = lodash.cloneDeep(props.basicInfoData);
        setTimeout(() => {
          data.formData.settle = copyData.settle as any;
        }, 100);
      },
      SettlementConfirm() {
        emit("SettlementConfirm");
      },
      hasClass(type: string) {
        if (
          data.FormDataSet.has(type) &&
          data.FormDataMap.get(type) &&
          (data.FormDataMap.get(type) as any).value == data.formData[type]
        ) {
          return true;
        }
        return false;
      },
      // 撤回关联数据补完
      getBack() {
        data.tipType = 1;
        data.getConnectFlag = true;
        [...data.FormDataSet].map((item: any) => {
          if (
            data.FormDataSet.has(item) &&
            data.FormDataMap.get(item) &&
            (data.FormDataMap.get(item) as any).value == data.formData[item]
          ) {
            data.FormDataSet.delete(item);
            data.formData[item] = "";
          }
        });
      },
      // 获取关联数据
      async getConnectData() {
        data.getConnectFlag = true;
        const params = {
          plate: data.formData.plate,
          groupId: data.formData.groupId,
          vehicleId: props.vehInfo ? props.vehInfo.V : null,
          frameNo: data.formData.frameNo,
        };
        data.connectData = await getVehicleDateByPlate(params);
      },
      // 当车牌或车架号发生变化且通过表单验证时，查询关联数据并替换对应空输入框值
      // 撤回后清空之前替换的空输入框。
      // 设置关联数据
      async setConnectData(type: string) {
        function setInputData(res: any) {
          let obj = {} as any;
          if (res && res.brand) {
            obj = { ...res, vehicleType: res.brand || "" };
          } else {
            obj = { ...res };
          }
          // 查询出关联数据并替换掉对应的为空的输入框
          [...data.FormDataMap.keys()].map((item: any) => {
            if (data.formData[item] == "" && obj[item] && obj[item] != "") {
              data.formData[item] = obj[item]; // 替换空输入框
              data.FormDataMap.set(item, { value: data.formData[item] });
              data.FormDataSet.add(item);
            }
          });
          data.tipType = 3;
        }
        if (data.connectData && !data.getConnectFlag) {
          setInputData(data.connectData);
        } else {
          if (!data.getConnectFlag) {
            return;
          }
          const frameNoRegu = /^[A-Za-z0-9]{16,17}$/;
          const plateRegu = /^.{0,20}$/;
          if (
            (data.formData.frameNo != "" &&
              !frameNoRegu.test(data.formData.frameNo)) ||
            (data.formData.plate != "" && !plateRegu.test(data.formData.plate))
          ) {
            return;
          }
          await data.getConnectData();
          if (!data.connectData) {
            data.tipType = 2;
          } else {
            setInputData(data.connectData);
          }
        }
      },
    });
    const { activeName } = toRefs(props);
    nextTick(() => {
      data.settleVisible = false;
      let arr = [];
      for (let i in store.state.vehTypes) {
        arr.push({
          name: store.state.vehTypes[i].type,
          value: store.state.vehTypes[i].typemap,
        });
      }
      data.terminalTypeOptions = arr as any;
      watch(
        () => data.formData.plate,
        (val: any, old: any) => {
          if (
            (val != "" && old != "" && val != old) ||
            (val != "" && old == "")
          ) {
            data.getConnectFlag = true;
          }
        }
      );
      watch(
        () => data.formData.frameNo,
        (val: any, old: any) => {
          if (
            (val != "" && old != "" && val != old) ||
            (val != "" && old == "")
          ) {
            data.getConnectFlag = true;
          }
        }
      );
      watch(
        showToggle,
        (val) => {
          if (!val) {
            data.tipType = 1;
            data.connectData = null;
            data.FormDataSet = new Set();
            data.FormDataMap = new Map([
              ["plate", { value: "" }],
              ["frameNo", { value: "" }],
              ["engineNo", { value: "" }],
              ["vehicleType", { value: "" }],
              ["serviceCode", { value: "" }],
              ["owner", { value: "" }],
              ["remark", { value: "" }],
            ]);
            data.resetForm("ruleForm");
          }
        },
        {
          immediate: true,
        }
      );
      watch(
        () => props.basicInfoData,
        (val) => {
          const copyData = lodash.cloneDeep(val);
          data.formData = copyData as any;
          if (data.formData.activationTmeStr == "无") {
            data.formData.activationTmeStr = "";
          }
          data.group = {
            gi: copyData.groupId,
            gn: copyData.groupName,
          } as any;
        },
        {
          deep: true,
        }
      );
      watch(
        () => props.addGroupInfo,
        (val) => {
          if (!val) return;
          data.group = {
            gi: val.groupId,
            gn: val.groupName,
          } as any;
        },
        {
          immediate: true,
        }
      );
      watch(activeName, (val, old) => {
        if (val != "1" && old == "1") {
          emit("update:basicInfoData", data.formData);
        }
      });
      watch(
        () => data.group,
        (val: any) => {
          if (
            [null, undefined].includes(val) ||
            [null, undefined].includes(val.gi)
          )
            return;
          data.formData.groupId = val.gi;
          data.formData.groupName = val.gn;
        },
        {
          deep: true,
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
.tipBar {
  width: 100%;
  height: 30px;
  background: #e0efff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  color: #77b6f4;
  .icon-yiwen {
    position: absolute;
    right: 10px;
    color: #77b6f4;
    cursor: help;
  }
  .setback {
    color: red;
    cursor: pointer;
  }
}
.tipDetail {
  display: flex;
  flex-direction: column;
  padding: 10px;
  max-width: 250px;
  justify-content: space-between;
  &_header {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 15px;
  }
  &_content {
    color: #666;
    margin-bottom: 15px;
    line-height: 25px;
  }
  &_footer {
    color: red;
  }
}
::v-deep(.el-input__inner),
::v-deep(.el-date-editor) {
  width: 250px;
  height: 34px;
  border-radius: 0;
}
::v-deep(.el-form-item__label) {
  width: 110px;
  text-align: right;
}
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.radio {
  width: calc(50% - 14px);
  float: left;
  // padding-left: 25px;
}
::v-deep(.el-form-item) {
  margin-bottom: 15px;
}
.remark {
  width: 100%;
  ::v-deep(.el-textarea__inner) {
    width: 620px;
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
.connect_input {
  ::v-deep(.el-input__inner) {
    background: rgb(227, 238, 255) !important;
  }
  ::v-deep(.el-textarea__inner) {
    background: rgb(227, 238, 255) !important;
  }
}
</style>