<template>
  <el-dialog
    :visible="visible"
    title="添加设备"
    @close="$emit('update:visible', false)"
    @closed="$refs.form.resetFields()"
    width="700px"
  >
    <el-form
      :model="model"
      ref="form"
      :rules="rules"
      label-width="100px"
      :inline="true"
    >
      <!-- <el-row v-if="params ? params.organizationName : true">
        <el-col :span="12">
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
      </el-row> -->
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="电池编号:"
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
        <el-col :span="12">
          <el-form-item
            label="设备号:"
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
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="SIM卡号:"
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
        <el-col :span="12">
          <el-form-item
            label="设备类型"
            prop="organizationName"
          >
            <el-select
              v-model="value"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="安装时间:"
            prop="organizationName"
          >
            <el-date-picker
              v-model="value"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="激活时间:"
            prop="organizationName"
          >
            <el-date-picker
              v-model="value"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="服务密码:"
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
      <el-row>
        <el-col>
          <el-form-item
            label="备注信息:"
          >
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="textarea"
            >
            </el-input>
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
import { toTreeData } from "@/assets/js/base";

export default {
  components: {},
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
      value: "",
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
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
.el-select,
.el-date-editor {
  width: 200px !important;
}
.el-textarea {
  width: 530px !important;
}
</style>
