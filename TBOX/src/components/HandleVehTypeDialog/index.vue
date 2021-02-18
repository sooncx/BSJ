<template>
  <el-dialog
    :visible="visible"
    :title="title"
    @close="$emit('update:visible', false)"
    @closed="initModel()"
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
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="车辆类型:"
            prop="model"
          >
            <el-input
              size="small"
              v-model.trim="model.model"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
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
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="排放标准:"
            prop="emissionStandard"
          >
            <TypeSelect
              v-model="model.emissionStandard"
              type="emissionStandard"
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="排气类型:"
            prop="exhaust"
          >
            <TypeSelect
              v-model="model.exhaust"
              type="exhaust"
              size="small"
            />
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
              v-model="model.fuelType"
              type="fuelType"
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="尿素箱容积:"
            prop="ureaBox"
          >
            <el-input
              size="small"
              v-model.trim="model.ureaBox"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item
            label="车辆生产企业:"
            prop="vehicleCompany"
          >
            <el-input
              size="small"
              v-model.trim="model.vehicleCompany"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="车辆品牌:"
            prop="brand"
          >
            <el-input
              size="small"
              v-model.trim="model.brand"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
         <el-col :span="12">
          <el-form-item
            label="额定功率:"
            prop="ratedPower"
          >
            <el-input
              size="small"
              v-model.trim="model.ratedPower"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="最高转速:"
            prop="maximumSpeed"
          >
            <el-input
              size="small"
              v-model.trim="model.maximumSpeed"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
         <el-col :span="12">
          <el-form-item
            label="最大功率:"
            prop="maximumPower"
          >
            <el-input
              size="small"
              v-model.trim="model.maximumPower"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="最大总质量:"
            prop="maxQuality"
          >
            <el-input
              size="small"
              v-model.trim="model.maxQuality"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>

      </el-row>
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
import TypeSelect from "@/components/TypeSelect/index.vue";

const defaultModel = {
  model: "",
  engineType: "",
  emissionStandard: 0,
  fuelType: 0,
  ureaBox: "",
  vehicleCompany: "",
  brand: "",
  ratedPower: "",
  maximumSpeed: "",
  maximumPower: "",
  maxQuality: "",
  exhaust: 0
};

export default {
  components: {
    TypeSelect
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    /**
     * @param {add | modify | disabled} 参数名 type
     */
    params: {
      type: Object,
      default: null
    },
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
        model: [
          {
            required: true,
            message: "车辆类型不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          },
        ],
        engineType: [
          {
            required: true,
            message: "发动机型号不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        emissionStandard: [
          {
            required: true,
            message: "排放标准不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          },
        ],
        exhaust: [
          {
            required: true,
            message: "排放标准不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          },
        ],
        fuelType: [
          {
            required: true,
            message: "燃油类型不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        ureaBox: [
          {
            required: true,
            message: "尿素箱容积不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        vehicleCompany: [
          {
            required: true,
            message: "车辆生产企业不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        brand: [
          {
            required: true,
            message: "车辆品牌不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        ratedPower: [
          {
            required: true,
            message: "额定功率不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        maximumSpeed: [
          {
            required: true,
            message: "最高转速不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        maximumPower: [
          {
            required: true,
            message: "最大功率不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        maxQuality: [
          {
            required: true,
            message: "最大总质量不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
      },
      defaultProps: {
        children: "children",
        label: "organizationName"
      }
    };
  },

  computed: {
    title() {
      const titleObj = {
        add: "添加车型",
        modify: "修改车型",
        disabled: "车型信息"
      };

      return titleObj[this.type];
    }
  },

  watch: {
    params(val) {
      if (!val) return;
      Object.keys(this.model).map(
        key =>
          this.params[key] !== undefined && (this.model[key] = this.params[key])
      );
    }
  },

  methods: {
    initModel() {
      this.$refs.form.resetFields();
      this.model = JSON.parse(JSON.stringify(defaultModel));
    },
    async add() {
      return await this.$API.doAddVehicleModel(this.model);
    },
    async modify() {
      const params = {
        ...this.model,
        modelId: this.params.modelId
      };
      return await this.$API.doUpdateVehicleModel(params);
    },
    async handleApiFn() {
      try {
        await this.$refs.form.validate();

        const apiFnObj = {
          add: "add",
          modify: "modify"
        };

        const { msg } = await this[apiFnObj[this.type]]();

        this.$msg({
          showClose: true,
          message: msg,
          type: "success"
        });
        this.$emit("update:visible", false);
        this.$emit("onHandleVehTypeOk");
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
