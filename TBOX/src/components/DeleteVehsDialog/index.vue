<template>
  <el-dialog
    :visible="visible"
    title="删除车辆"
    @close="$emit('update:visible', false)"
    @closed="$refs.form.resetFields()"
    :width="params ? '500px' : '600px'"
  >
    <el-form
      :model="model"
      ref="form"
      :rules="rules"
      label-width="90px"
      v-show="!params"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="车牌号:"
            prop="plates"
          >
            <el-input
              size="small"
              v-model="model.plates"
              type="textarea"
              autocomplete="off"
              placeholder="多个车牌号用回车键隔开"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <Result
      v-show="params"
      title="是否确认删除车辆"
    />

    <template slot="footer">
      <el-button
        type="info"
        plain
        size="small"
        @click="$emit('update:visible', false)"
      >取消</el-button>
      <el-button
        type="primary"
        plain
        size="small"
        @click="doDeleteVehicle()"
      >确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapMutations } from "vuex";
import Result from "@/components/Result/index.vue";

export default {
  components: {
    Result
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    params: {
      type: Array,
      default: undefined
    }
  },

  data() {
    return {
      model: {
        plates: ""
      },
      rules: {
        plates: [
          {
            required: true,
            message: "车牌号不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ]
      },
      defaultProps: {
        children: "children",
        label: "organizationName"
      }
    };
  },

  watch: {
    params(val) {
      if (!val) {
        this.model.plates = "";
        return;
      }

      this.model.plates = val.map(item => item.plate).join(",");
    }
  },

  methods: {
    ...mapMutations(["COMMIT_GROUPLIST"]),
    async doDeleteVehicle() {
      try {
        await this.$refs.form.validate();
        const params = {
          plates: this.model.plates.split(/[\n\s+,]/g).join(",")
        };
        const { msg } = await this.$API.doDeleteVehicle(params);

        this.$msg({
          showClose: true,
          message: msg,
          type: "success"
        });
        this.$emit("update:visible", false);
        this.$emit("onDeleteVehsOk");

        //更新树状图数据
        const { data } = await this.$API.doShowOrganization();
        this.COMMIT_GROUPLIST(data);
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
</style>
