<template>
  <el-dialog
    :visible="visible"
    title="批量加车"
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
        <el-col :span="20">
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
              width="360px"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item
            label="选择文件:"
            prop="multipartFile"
          >
            <el-upload
              drag
              action=""
              :http-request="({file}) => model.multipartFile = file"
              :show-file-list="false"
            >
              <i class="el-icon-upload"></i>
              <div
                class="el-upload__text"
                v-html="model.multipartFile ? model.multipartFile.name : '将excel文件拖到此处，或<em>点击上传</em>'"
              ></div>
              <div
                class="el-upload__tip"
                slot="tip"
              >首次使用,<el-button
                  type="text"
                  style="padding: 0"
                  @click="doDownFile()"
                >请点击下载最新导入模板!</el-button>
              </div>
            </el-upload>
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
        @click="doImportExcelVehicle()"
      >确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { toTreeData } from "@/assets/js/base";
import TreeSelect from "@/components/TreeSelect/index.vue";

const defaultModel = {
  organization: null,
  multipartFile: null
};

export default {
  components: {
    TreeSelect
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      model: {
        ...JSON.parse(JSON.stringify(defaultModel))
      },
      rules: {
        organization: [
          {
            required: true,
            message: "所属组织不能为空", //this.$t("login.username_rules"),
            trigger: "change"
          },
          { type: "object", message: "所属组织不能为空" }
        ],
        multipartFile: [
          {
            required: true,
            message: "导入文件不能为空", //this.$t("login.username_rules"),
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
    ...mapState(["GROUPLIST", "USER"]),
    treeData() {
      return toTreeData(this.GROUPLIST, {
        id: "organizationId",
        parentId: "parentId"
      });
    }
  },

  methods: {
    async doDownFile() {
      const params = {
        sessionId: this.USER.sessionId
      };
      this.$API.doDownFile(params);
    },
    async doImportExcelVehicle() {
      try {
        await this.$refs.form.validate();

        let params = new FormData();
        params.append("organizationId", this.model.organization.organizationId);
        params.append("multipartFile", this.model.multipartFile);

        this.$emit("update:visible", false);
        this.$emit("updateStatus", "loading");

        const { msg } = await this.$API.doImportExcelVehicle(params);
        this.$msg({
          showClose: true,
          message: msg,
          type: "success"
        });

        this.$emit("updateStatus", "success");
      } catch (error) {
        console.error(error);
        this.$emit("updateStatus", "fail");
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
/deep/ .el-dialog__body {
  padding: 30px 30px 30px 20px;
}
</style>
