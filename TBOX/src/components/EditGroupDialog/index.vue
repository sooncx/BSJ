<template>
  <el-dialog
    :visible="visible"
    title="修改组织"
    @close="$emit('update:visible', false)"
    @closed="$refs.form.resetFields()"
    width="600px"
  >
    <el-form
      :model="model"
      ref="form"
      :rules="rules"
      label-width="90px"
    >
      <el-row>
        <el-col :span="16">
          <el-form-item
            label="组织名称:"
            prop="organizationName"
          >
            <el-input
              size="small"
              v-model.trim="model.organizationName"
              autocomplete="off"
              maxlength="10"
            />
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
        type="primary"
        plain
        size="small"
        @click="doUpdateOrganization()"
      >确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: undefined
    }
  },

  data() {
    return {
      model: {
        organizationName: ""
      },
      rules: {
        organizationName: [
          {
            required: true,
            message: "组织名称不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ]
      }
    };
  },

  watch: {
    params(val) {
      if (!val) return;
      this.model.organizationName = val.organizationName;
    }
  },

  methods: {
    ...mapMutations(["COMMIT_GROUPLIST"]),
    async doUpdateOrganization() {
      try {
        await this.$refs.form.validate();
        const { organizationId } = this.params;
        const params = {
          organizationId,
          ...this.model
        };
        const { msg } = await this.$API.doUpdateOrganization(params);

        this.$msg({
          showClose: true,
          message: msg,
          type: "success"
        });
        this.$emit("update:visible", false);
        this.$emit("onEditGroupOk");

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
