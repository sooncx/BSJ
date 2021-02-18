<template>
  <el-dialog
    :visible="visible"
    title="车辆转移"
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
        <el-col :span="24">
          <el-form-item
            label="转移到:"
            prop="organization"
          >
            <TreeSelect
              v-model="model.organization"
              :data="treeData"
              :props="defaultProps"
              icon="icon-truckgroup"
              node-key="organizationId"
            />
          </el-form-item>
        </el-col>
      </el-row>
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
              :disabled="!!params"
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
        type="primary"
        plain
        size="small"
        @click="doMoveVehicle()"
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
    params: [Array]
  },

  data() {
    return {
      model: {
        organization: null,
        plates: ""
      },
      rules: {
        organization: [
          {
            required: true,
            message: "组织不能为空", //this.$t("login.username_rules"),
            trigger: "change"
          },
          { type: 'object', message: '所属组织不能为空'}
        ],
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
      if (!val) {
        this.model.plates = "";
        return;
      }

      this.model.plates = val.map(item => item.plate).join(",");
    }
  },

  methods: {
    ...mapMutations(["COMMIT_GROUPLIST"]),
    async doMoveVehicle() {
      try {
        await this.$refs.form.validate();
        const params = {
          organizationId: this.model.organization.organizationId,
          plates: this.model.plates.split(/[\n\s+,]/g).join(",")
        };
        const { msg } = await this.$API.doMoveVehicle(params);

        this.$msg({
          showClose: true,
          message: msg,
          type: "success"
        });
        this.$emit("update:visible", false);
        this.$emit("onTransferVehsOk");

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
