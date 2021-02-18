<template>
  <section class="Nav">
    <div class="Nav__logo">
      <img
        src="@/assets/img/home/logo.png"
        draggable="false"
      />
    </div>
    <div class="Nav__content">
      <div
        class="Nav__item"
        :class="{Nav__item_on: !!$route.path.match(item.value)}"
        v-for="item in menuList"
        :key="item.value"
        @click="$route.name !== item.value && $router.push({name: item.value})"
      >{{item.label}}</div>
    </div>
    <el-dropdown
      placement="bottom-end"
      trigger="hover"
    >
      <span class="Nav__user">
        <i class="Nav__user-icon iconfont icon-user"></i>
        {{USER ? USER.userName : ''}}
        <i class="Nav__dropdown-icon iconfont icon-dropdown"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="dialogVisible = true">修改密码</el-dropdown-item>
        <el-dropdown-item @click.native="loginOut">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <el-form
        :model="pwdInfo"
        ref="pwdInfo"
        :rules="rules"
        v-if="dialogVisible"
        label-width="80px"
      >
        <el-form-item
          label="旧密码"
          prop="oldPassword"
        >
          <el-input
            v-model="pwdInfo.oldPassword"
            type="password"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="newPassword"
        >
          <el-input
            v-model="pwdInfo.newPassword"
            type="password"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="二次确认"
          prop="repeat_pwd"
        >
          <el-input
            v-model="pwdInfo.repeat_pwd"
            type="password"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>

      <template slot="footer">
        <el-button
          type="info"
          plain
          size="small"
          @click="dialogVisible = false"
        >取消</el-button>
        <el-button
          type="primary"
          @click.native="confirm"
          size="small"
        >确 定</el-button>
      </template>
    </el-dialog>
  </section>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  data() {
    let validatePass2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.pwdInfo.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      menuList: [
        { value: "home", label: "首页" },
        { value: "monitorCenter", label: "实时监控" },
        { value: "playback", label: "轨迹回放" },
        // { value: "report", label: "报表中心" },
        // { value: "environmental", label: "环境监测" },
        { value: "reportCenter", label: "报表中心" },
        { value: "manageData", label: "资料管理" }
      ],
      pwdInfo: {
        oldPassword: "",
        newPassword: "",
        repeat_pwd: ""
      },
      rules: {
        oldPassword: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9]{1,12}$/,
            message: "长度1-12位,英文字母+数字"
          }
        ],
        repeat_pwd: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },

  computed: {
    ...mapState(["USER"])
  },

  watch: {
    dialogVisible(val) {
      if (val === true) {
        Object.keys(this.pwdInfo).forEach(key => {
          this.pwdInfo[key] = "";
        });
      }
    }
  },
  methods: {
    ...mapMutations(["COMMIT_USER"]),
    ...mapActions(["DISPATCH_CLEARCHACE"]),
    async confirm() {
      try {
        await this.$refs.pwdInfo.validate();
        const { oldPassword, newPassword } = this.pwdInfo;
        await this.$API.doUpdate({ oldPassword, newPassword });
        this.dialogVisible = true;
        this.loginOut();
      } catch (error) {
        console.error(error);
        this.$msg({
          showClose: true,
          message: error ? error.msg : "请输入正确的字段",
          type: "error"
        });
      }
    },
    async loginOut() {
      try {
        await this.$API.doLoginOut({});
        this.COMMIT_USER(null);
        this.$router.push("/login");
        this.DISPATCH_CLEARCHACE({ Vue: this });
      } catch (error) {
        console.error(error);
        this.$msg({
          showClose: true,
          message: error.msg,
          type: "error"
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.Nav {
  height: 60px;
  line-height: 60px;
  display: flex;
  background: #2a83de;

  &__logo {
    display: flex;
    align-items: center;
    width: 320px;
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #ffffff;
    user-select: none;

    img {
      width: 100%;
    }
  }

  &__content {
    flex: 1;
    display: flex;
    user-select: none;
  }

  &__item {
    color: #88b4e0;
    border-bottom: 2px solid transparent;
    padding: 0 20px;
    transition: border-color 0.3s, background-color 0.3s, color 0.3s;
    cursor: pointer;

    &:hover {
      color: #fff;
      background: #4195ec;
    }

    &_on {
      color: #fff;
      border-color: #afd7ff;
      background: #4195ec;
    }
  }

  &__user {
    padding: 0 40px;
    color: #fff;
    cursor: pointer;
    outline: none;
    display: flex;
    align-items: center;
    font-size: 16px;
    user-select: none;
  }

  &__user-icon {
    margin-right: 10px;
    font-size: 22px;
  }

  &__dropdown-icon {
    margin-left: 10px;
    font-size: 14px;
  }
}
</style>
