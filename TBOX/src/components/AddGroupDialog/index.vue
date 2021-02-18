<template>
  <el-dialog
    :visible="visible"
    title="添加组织"
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
      <el-row v-if="params ? params.organizationName : true">
        <el-col :span="16">
          <el-form-item label="上级组织:" prop="organization">
            <TreeSelect
              v-model="model.organization"
              :data="treeData"
              :props="defaultProps"
              icon="icon-truckgroup"
              node-key="organizationId"
              :disabled="!!params"
            />
          </el-form-item>
        </el-col>
      </el-row>
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
        @click="doAddOrganization()"
      >确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import TreeSelect from "@/components/TreeSelect/index.vue";
import { toTreeData } from "@/assets/js/base";

export default {
  components: {
    TreeSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: undefined
    },
  },

  data() {
    return {
      model: {
        organization: null, //上级组织
        organizationName: "" //当前新建组织名称
      },
      rules: {
        organization: [
          {
            required: true,
            message: "上级组织不能为空", //this.$t("login.username_rules"),
            trigger: "change"
          },
          { type: "object", message: "上级组织不能为空" }
        ],
        organizationName: [
          {
            required: true,
            message: "组织名称不能为空", //this.$t("login.username_rules"),
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

  computed: {
    ...mapState(["GROUPLIST"]),
    treeData() {
      return toTreeData(this.GROUPLIST, {
        id: "organizationId",
        parentId: "parentId"
      });
    }
  },

  watch: {
    params(val) {
      if (!val) return;
      const { organizationId, organizationName } = val;
      this.model.organization = { organizationId, organizationName };
    }
  },

  methods: {
    ...mapMutations(["COMMIT_GROUPLIST"]),
    async doAddOrganization() {
      try {
        await this.$refs.form.validate();
        console.log(this.model.organization);
        const params = {
          parentId: this.model.organization.organizationId,
          organizationName: this.model.organizationName
        };
        const { msg, data } = await this.$API.doAddOrganization(params);

        this.$msg({
          showClose: true,
          message: msg,
          type: "success"
        });
        this.$emit("update:visible", false);
        this.$emit("onSubmit", data.organizationId);

        //更新树状图数据
        const res = await this.$API.doShowOrganization();
        this.COMMIT_GROUPLIST(res.data);
      } catch (error) {
        console.error(error);
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
