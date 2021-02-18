<template>
  <el-dialog
    class="interfaceEdit"
    :visible="visible"
    @close="$emit('update:visible', false)"
    @closed="$refs.form.resetFields()"
    width="550px"
  >
    <div
      slot="title"
      class="Diatitle"
    >
      <span>{{editType === "add"?"新增接口":"修改接口"}}</span>
    </div>
    <el-form
      label-position="left"
      :model="model"
      ref="form"
      :rules="rules"
      label-width="90px"
    >
      <el-row>
        <el-col :span="16">
          <el-form-item
            label="接口名称:"
            prop="interfaceName"
          >
            <el-input
              size="small"
              v-model.trim="model.name"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item
            label="URL:"
            prop="URL"
          >
            <el-input
              size="small"
              v-model.trim="model.url"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item
            label="QPS:"
            prop="QPS"
          >
            <el-input
              size="small"
              v-model.trim="model.interfaceQps"
              onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item
            label="每日限额:"
            prop="interfaceDayLimit"
          >
            <el-input
              size="small"
              v-model.trim="model.interfaceDayLimit"
              onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
              autocomplete="off"
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
        @click="$emit('save', model)"
      >保存</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "editDialog",
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object
    },
    editType: {
      type: String,
      default: "add"
    }
  },
  watch: {
    formData: {
      handler(val) {
        console.log(val);
        this.model = { ...val };
      },
      deep: true
    }
  },
  data() {
    return {
      model: {
        name: "",
        url: "",
        interfaceDayLimit: "",
        interfaceQps: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "接口名称不能为空",
            trigger: "blur"
          }
        ],
        interfaceDayLimit: [
          {
            required: true,
            message: "每日限额不能为空",
            trigger: "blur"
          }
        ],
        url: [
          {
            required: true,
            message: "URL不能为空",
            trigger: "blur"
          }
        ],
        interfaceQps: [
          {
            required: true,
            message: "QPS不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  }
};
</script>
<style lang="scss" scoped>
.interfaceEdit {
  .Diatitle {
    text-align: left;
  }
  ::v-deep .el-dialog__header {
    background: #f3f3f3;
    padding: 15px 20px;
  }
  ::v-deep .el-input__inner {
    border-radius: 0;
    width: 400px;
  }
  ::v-deep .el-dialog__headerbtn {
    top: 15px;
  }
  ::v-deep .el-button--small {
    border-radius: 0;
  }
}
</style>
