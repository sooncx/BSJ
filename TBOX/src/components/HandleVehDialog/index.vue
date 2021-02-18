<template>
  <el-dialog
    :visible="visible"
    :title="title"
    @close="$emit('update:visible', false)"
    @closed="initModel()"
    top="5vh"
    width="700px"
  >
    <el-form
      :model="model"
      ref="form"
      :rules="rules"
      label-width="130px"
      :disabled="type === 'disabled'"
      size="mini"
    >
      <el-tabs v-model="activeTab">
        <!-- 必填项开始 -->
        <el-tab-pane
          label="必填项"
          name="required"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="车牌号码:"
                prop="plate"
              >
                <el-input
                  size="small"
                  v-model.trim="model.plate"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="所属组织:"
                prop="organization"
              >
                <TreeSelect
                  v-model="model.organization"
                  :data="treeData"
                  :props="defaultProps"
                  node-key="organizationId"
                  icon="icon-truckgroup"
                  :disabled="type === 'addToGroup' || type === 'correct'"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="设备SIM号:"
                prop="sim"
              >
                <el-input
                  size="small"
                  v-model.trim="model.sim"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="车辆颜色:"
                prop="plateColor"
              >
                <el-input
                  size="small"
                  v-model.trim="model.plateColor"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="车辆类型:"
                prop="vehicleType"
              >
                <TypeSelect
                  type="vehicleType"
                  v-model="model.vehicleType"
                  size="small"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="排放标准:"
                prop="emissionStandard"
              >
                <TypeSelect
                  type="emissionStandard"
                  v-model="model.emissionStandard"
                  size="small"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="发动机型号:"
                prop="engineType"
              >
                <el-input
                  size="small"
                  v-model.trim="model.engineType"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="设备号:"
                prop="equipmentNumber"
              >
                <el-input
                  size="small"
                  v-model.trim="model.equipmentNumber"
                  placeholder="必填20位, 不足则自动补0"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="车架号:"
                prop="frameNo"
              >
                <el-input
                  size="small"
                  v-model.trim="model.frameNo"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="VIN号:"
                prop="vin"
              >
                <el-input
                  size="small"
                  v-model.trim="model.vin"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="车主名称:"
                prop="ownerName"
              >
                <el-input
                  size="small"
                  v-model.trim="model.ownerName"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="联系号码:"
                prop="ownerPhone"
              >
                <el-input
                  size="small"
                  v-model.trim="model.ownerPhone"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="imei:"
                prop="imei"
              >
                <el-input
                  size="small"
                  v-model.trim="model.imei"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="iccId:"
                prop="iccId"
              >
                <el-input
                  size="small"
                  v-model.trim="model.iccId"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="燃油类型:"
                prop="fuelType"
              >
                <TypeSelect
                  type="fuelType"
                  v-model="model.fuelType"
                  size="small"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="初次登记日期:"
                prop="productionTime"
              >
                <el-date-picker
                  v-model="model.productionTime"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                  size="small"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="车主地址:"
                prop="ownerAddress"
              >
                <el-input
                  size="small"
                  v-model.trim="model.ownerAddress"
                  type="textarea"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <!-- 必填项结束 -->

        <!-- 不是必填项开始 -->
        <el-tab-pane
          label="可选项"
          name="optional"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="车辆年款:">
                <el-input
                  size="small"
                  v-model.trim="model.annualMoney"
                  autocomplete="off"
                  maxlength="10"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="车辆品牌:">
                <el-input
                  size="small"
                  v-model.trim="model.brand"
                  autocomplete="off"
                  maxlength="10"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="车辆型号:">
                <el-input
                  size="small"
                  v-model.trim="model.model"
                  autocomplete="off"
                  maxlength="10"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="行业类型:">
                <el-input
                  size="small"
                  v-model.trim="model.industryType"
                  autocomplete="off"
                  maxlength="10"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="排量:">
                <el-input
                  size="small"
                  v-model.trim="model.displacement"
                  autocomplete="off"
                  maxlength="10"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="额定功率:">
                <el-input
                  size="small"
                  v-model.trim="model.ratedPower"
                  autocomplete="off"
                  maxlength="10"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="总客数:"
                prop="totalNo"
              >
                <el-input
                  size="small"
                  v-model.trim="model.totalNo"
                  autocomplete="off"
                  maxlength="3"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最大允许总质量:">
                <el-input
                  size="small"
                  v-model.trim="model.maxQuality"
                  autocomplete="off"
                  maxlength="10"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="尿素箱容积:">
                <el-input
                  size="small"
                  v-model.trim="model.ureaBox"
                  autocomplete="off"
                  maxlength="10"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="车辆生产企业:">
                <el-input
                  size="small"
                  v-model.trim="model.vehicleCompany"
                  autocomplete="off"
                  maxlength="10"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="整车质量:">
                <el-input
                  size="small"
                  v-model.trim="model.weight"
                  autocomplete="off"
                  maxlength="10"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <!-- 不是必填项结束 -->
      </el-tabs>
    </el-form>

    <template slot="footer">
      <el-button
        type="info"
        plain
        size="small"
        @click="$emit('update:visible', false)"
      >取消</el-button>
      <el-button
        v-show="type !== 'disabled'"
        type="primary"
        plain
        size="small"
        @click="handleApiFn()"
      >确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import day from "dayjs";
import { mapState, mapMutations } from "vuex";
import TreeSelect from "@/components/TreeSelect/index.vue";
import TypeSelect from "@/components/TypeSelect/index.vue";
import { toTreeData } from "@/assets/js/base";

const defaultModel = {
  plate: "",
  organization: null,
  sim: "",
  plateColor: "",
  vehicleType: 0,
  emissionStandard: 0,
  engineType: "",
  equipmentNumber: "",
  frameNo: "",
  vin: "",
  ownerPhone: "",
  ownerName: "",
  imei: "",
  iccId: "",
  fuelType: 0,
  ownerAddress: "",
  annualMoney: "",
  brand: "",
  model: "",
  industryType: "",
  displacement: "",
  ratedPower: "",
  totalNo: "",
  maxQuality: "",
  ureaBox: "",
  vehicleCompany: "",
  weight: "",
  faultType: 0,
  productionTime: ""
};

export default {
  components: {
    TreeSelect,
    TypeSelect
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: null
    },
    /**
     * @param {add | addToGroup | modify | disabled | correct} 参数名 type
     */
    type: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      model: {
        ...JSON.parse(JSON.stringify(defaultModel))
      },
      rules: {
        plate: [
          {
            required: true,
            message: "车牌号不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          },
          {
            pattern: /^.{0,8}$/,
            message: "车牌号不能大于8位", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        organization: [
          {
            required: true,
            message: "所属组织不能为空", //this.$t("login.username_rules"),
            trigger: "change"
          },
          { type: "object", message: "所属组织不能为空" }
        ],
        sim: [
          {
            required: true,
            message: "设备SIM号不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          },
          {
            pattern: /^\d{11,13}$/,
            message: "设备SIM号为11-13位", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        plateColor: [
          {
            required: true,
            message: "车牌颜色不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        vehicleType: [
          {
            required: true,
            message: "车辆类型不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        emissionStandard: [
          {
            required: true,
            message: "排放标准不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        engineType: [
          {
            required: true,
            message: "发动机型号不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        equipmentNumber: [
          {
            required: true,
            message: "设备号不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          },
          {
            pattern: /^\d{0,20}$/,
            message: "设备号不能大于20位", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        frameNo: [
          {
            required: true,
            message: "车架号不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        vin: [
          {
            required: true,
            message: "VIN号不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        ownerName: [
          {
            required: true,
            message: "车主名称不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        ownerPhone: [
          {
            required: true,
            message: "联系号码不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          },
          {
            pattern: /^1[3-9][0-9]\d{8}$/,
            message: "请输入正确的手机号", //this.$t("login.password_rules"),
            trigger: "blur"
          }
        ],
        imei: [
          {
            required: true,
            message: "imei不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        iccId: [
          {
            required: true,
            message: "iccId不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        fuelType: [
          {
            required: true,
            message: "燃油类型不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        ownerAddress: [
          {
            required: true,
            message: "车主地址不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        totalNo: [
          {
            pattern: /^\d{0,3}$/,
            message: "总客数为0-3位", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        productionTime: [
          {
            required: true,
            message: "初次登记日期不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          },
          {
            trigger: "blur",
            validator: (rule, value, callback) =>
              day(value).valueOf() > Date.now()
                ? callback(new Error("不能大于当前日期"))
                : callback()
          }
        ]
      },
      defaultProps: {
        children: "children",
        label: "organizationName"
      },
      activeTab: "required"
    };
  },

  computed: {
    ...mapState(["GROUPLIST", "USER"]),
    treeData() {
      return toTreeData(this.GROUPLIST, {
        id: "organizationId",
        parentId: "parentId"
      });
    },
    title() {
      const titleObj = {
        addToGroup: "添加车辆",
        add: "添加车辆",
        modify: "修改车辆",
        correct: "修改车辆",
        disabled: "车辆信息"
      };

      return titleObj[this.type];
    }
  },

  watch: {
    async params(val) {
      if (!val) return;
      this.activeTab = "required";
      const { organizationId, organizationName, ...otherParams } = this.params;
      this.model.organization = { organizationId, organizationName };
      Object.keys(this.model).map(
        key =>
          otherParams[key] !== undefined && (this.model[key] = otherParams[key])
      );

      if (this.type === "correct") {
        !this.$refs.form && (await this.$nextTick());
        this.$refs.form.validate();
      }
    }
  },

  methods: {
    ...mapMutations(["COMMIT_GROUPLIST"]),
    initModel() {
      this.$refs.form.resetFields();
      this.model = JSON.parse(JSON.stringify(defaultModel));
    },
    async add(_params) {
      const params = {
        ..._params,
        userId: this.USER.userId
      };
      return await this.$API.doAddVehicle(params);
    },
    async modify(_params) {
      const { addVehicleTime, vehicleId } = this.params;

      const params = {
        ..._params,
        addVehicleTime,
        vehicleId
      };
      return await this.$API.doUpdateVehicle(params);
    },
    async handleApiFn() {
      try {
        await this.$refs.form.validate();

        const { organization, equipmentNumber, ...otherParams } = this.model;
        const { organizationId } = organization;
        const _params = {
          organizationId,
          ...otherParams,
          //设备号自动补0
          equipmentNumber:
            new Array(20 - String(equipmentNumber).length).fill(0).join("") +
            equipmentNumber
        };

        if (this.type === "correct") {
          this.$emit("onCorrectOk", { ...this.params, ..._params });
          this.$emit("update:visible", false);
          return;
        }

        const apiFnObj = {
          addToGroup: "add",
          add: "add",
          modify: "modify"
        };

        const { msg } = await this[apiFnObj[this.type]](_params);

        if (this.type === "add") {
          const { data } = await this.$API.doShowOrganization();
          this.COMMIT_GROUPLIST(data);
        }

        this.$msg({
          showClose: true,
          message: msg,
          type: "success"
        });
        this.$emit("update:visible", false);
        this.$emit("onHandleVehOk");
      } catch (error) {
        this.$msg({
          showClose: true,
          message: error ? error.msg : "请输入正确字段",
          type: "error"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>
