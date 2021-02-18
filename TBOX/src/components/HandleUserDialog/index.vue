<template>
  <div>
    <el-dialog
      :visible="visible"
      :title="title"
      @close="$emit('update:visible', false)"
      @closed="initState()"
      width="600px"
    >
      <el-form
        :model="model"
        ref="form"
        :rules="rules"
        label-width="90px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="用户名:"
              prop="userName"
            >
              <el-input
                v-model="model.userName"
                autocomplete="off"
                maxlength="10"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="密码:"
              prop="password"
              maxlength="12"
            >
              <el-input
                v-model="model.password"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="邮箱地址:"
              prop="emailAddress"
            >
              <el-input
                v-model="model.emailAddress"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="手机:"
              prop="phone"
            >
              <el-input
                v-model="model.phone"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="type === 'add'">
          <el-col :span="24">
            <el-form-item label="绑定车组:">
              <div v-if="checkedKeys.length">
                已绑定{{checkedKeys.length}}个组织
                <el-button
                  type="text"
                  @click="BindGroup.visible = true"
                >重新绑定组织</el-button>
              </div>
              <div v-else>
                新账号请
                <el-button
                  @click="BindGroup.visible = true"
                  type="text"
                >选择绑定组织</el-button>
                或
                <el-button
                  style="margin:0"
                  type="text"
                  @click="AddGroup.visible = true"
                >创建一个组织</el-button>
              </div>
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
          @click="handleApiFn()"
        >确定</el-button>
      </template>
    </el-dialog>

    <!-- 绑定车组dialog开始 -->
    <BindGroupDialog
      ref="BindGroup"
      type="save"
      :visible.sync="BindGroup.visible"
      :params="BindGroup.params"
      @onSave="keys => checkedKeys = keys"
    />
    <!-- 绑定车组dialog结束 -->

    <!-- 添加组织dialog开始 -->
    <AddGroupDialog
      :visible.sync="AddGroup.visible"
      @onSubmit="gid => {checkedKeys = [gid];BindGroup.params = {checkedKeys: [gid]}}"
    />
    <!-- 添加组织dialog结束 -->
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import BindGroupDialog from "@/components/BindGroupDialog/index.vue";
import AddGroupDialog from "@/components/AddGroupDialog/index.vue";

export default {
  components: {
    BindGroupDialog,
    AddGroupDialog
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
    /**
     * @param {add | modify} 参数名 type
     */
    type: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      model: {
        userName: "",
        password: "",
        phone: "",
        emailAddress: ""
      },
      rules: {
        userName: [
          {
            required: true,
            message: "用户名不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空", //this.$t("login.password_rules"),
            trigger: "blur"
          }
        ],
        emailAddress: [
          {
            required: true,
            message: "邮箱地址不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            required: true,
            message: "手机号码不能为空", //this.$t("login.password_rules"),
            trigger: "blur"
          },
          {
            pattern: /^1[3-9][0-9]\d{8}$/,
            message: "请输入正确的手机号", //this.$t("login.password_rules"),
            trigger: "blur"
          }
        ]
      },
      checkedKeys: [],
      //绑定车组dialog props
      BindGroup: {
        visible: false,
        params: null
      },
      //添加组织dialog props
      AddGroup: {
        visible: false
      }
    };
  },

  computed: {
    title() {
      const titleObj = {
        modify: "修改用户",
        add: "新增用户"
      };

      return titleObj[this.type];
    }
  },

  watch: {
    params(val) {
      if (this.type === "modify") {
        Object.keys(this.model).map(
          key => val[key] && (this.model[key] = val[key])
        );
      }
    }
  },

  methods: {
    ...mapMutations(["COMMIT_USERLIST"]),
    initState() {
      this.$refs.form.resetFields();
      this.checkedKeys = [];
      this.$refs.BindGroup.initState();
    },
    async add() {
      const { parentId, userRights, stateType } = this.params;
      const params = {
        parentId,
        userRights,
        stateType,
        ...this.model,
        organizationIds: this.checkedKeys.join(",")
      };
      return await this.$API.doAddUser(params);
    },
    async modify() {
      const { userId, stateType, userRights } = this.params;
      const params = {
        userId,
        stateType,
        userRights,
        ...this.model
      };
      return await this.$API.doUpdateUser(params);
    },
    async handleApiFn() {
      try {
        await this.$refs.form.validate();
        const { msg } = await this[this.type]();

        //更新用户列表
        const { data } = await this.$API.doShowUserMessage();
        this.COMMIT_USERLIST(data);

        this.$msg({
          showClose: true,
          message: msg,
          type: "success"
        });
        this.$emit("update:visible", false);
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
