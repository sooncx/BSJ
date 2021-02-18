<template>
  <el-dialog
    :visible="visible"
    @close="$emit('update:visible', false)"
    @closed="$refs.form.resetFields()"
    width="550px"
  >
    <div
      slot="title"
      class="Diatitle"
    >
      <span>修改密码</span>
    </div>
    <el-form
      :model="model"
      ref="form"
      :rules="rules"
      label-width="100px"
    >
      <el-row>
        <el-col :span="16">
          <el-form-item
            label="旧密码:"
            prop="oldPassword"
          >
            <el-input
              size="small"
              v-model.trim="model.oldPassword"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item
            label="新密码:"
            prop="newPassword"
          >
            <el-input
              size="small"
              v-model.trim="model.newPassword"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item
            label="新密码确认:"
            prop="comfirmNewPassword"
          >
            <el-input
              size="small"
              v-model.trim="model.comfirmNewPassword"
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
        @click="doUpdate()"
      >确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "editDialog",
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    }
  },
  computed: {
    ...mapState(["USER"])
  },
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.model.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      model: {
        oldPassword: "",
        newPassword: "",
        comfirmNewPassword: ""
      },
      rules: {
        oldPassword: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" }
          //   {
          //     pattern: /^[a-zA-Z0-9]{1,12}$/,
          //     message: "长度1-12位,英文字母+数字"
          //   }
        ],
        comfirmNewPassword: [
          {
            required: true,
            message: "请再次输入新密码",
            validator: validatePass2,
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    data: {
      handler(val) {
        console.log(val);
        this.model.oldPassword = val.password;
      }
    }
  },
  methods: {
    async doUpdate() {
      if (
        this.model.newPassword === ""
        || this.model.oldPassword === ""
        || this.model.comfirmNewPassword === ""
      ) {
        this.$msg({
          showClose: true,
          message: "输入框不能为空",
          type: "error"
        });
        return;
      }
      try {
        if (this.data) {
          const params = {
            userId: this.data.userId,
            newPassword: this.model.newPassword
          };
          await this.$API.modifyPassword(params);
        } else {
          const params = {
            username: this.USER.userId,
            oldPassword: this.model.oldPassword,
            newPassword: this.model.newPassword
          };
          await this.$API.changePws(params);
        }
        this.$emit("update:visible", false);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
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
</style>
