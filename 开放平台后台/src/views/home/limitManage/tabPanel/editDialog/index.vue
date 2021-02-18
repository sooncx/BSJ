<template>
  <el-dialog
    class="limitEdit"
    :visible="visible"
    @close="$emit('update:visible', false)"
    @closed="$refs.form.resetFields()"
    width="550px"
  >
    <div
      slot="title"
      class="Diatitle"
    >
      <span>{{formData.showBtn === 2?'QPS/日额度修改':'总额度修改'}}</span>
    </div>
    <el-form
      label-position="left"
      :model="model"
      ref="form"
      label-width="100px"
    >
      <el-row v-if="formData.showBtn === 2">
        <el-col :span="16">
          <el-form-item
            label="QPS:"
            prop="QPS"
          >
            <el-input
              size="small"
              v-model.trim="model.qps"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item
            label="每日限制(次):"
            prop="interfaceDayLimit"
          >
            <el-input
              size="small"
              v-model.trim="model.dayLimit"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :span="16">
          <el-form-item
            label="总额度:"
            prop="invokeLimit"
          >
            <el-input
              size="small"
              v-model.trim="model.invokeLimit"
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
    }
  },
  watch: {
    formData: {
      handler(val) {
        this.model = { ...val, showBtn: val.showBtn };
      },
      deep: true
    }
  },
  data() {
    return {
      model: {
        userAppId: "",
        dayLimit: "",
        qps: "",
        invokeLimit: ""
      }
    };
  }
};
</script>
<style lang="scss" scoped>
.limitEdit {
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
  ::v-deep .el-form-item__content {
    text-align: left;
  }
}
</style>
