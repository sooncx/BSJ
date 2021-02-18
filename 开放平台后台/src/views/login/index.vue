<template>
  <div class="login">
    <div class="loginbg"></div>
    <div class="loginBox">
      <div class="loginBox__left">
        <div class="line">
          <h1>博云接口</h1>
          <p>后台管理系统</p>
        </div>
      </div>
      <div class="loginBox__right">
        <el-form
          ref="form"
          :model="form"
        >
          <el-form-item>
            <input
              type="text"
              v-model="form.name"
              placeholder="账号"
              class="items"
              @keyup.enter="login"
            />
          </el-form-item>
          <el-form-item>
            <input
              type="password"
              v-model="form.password"
              placeholder="密码"
              class="items"
              @keyup.enter="login"
            />
          </el-form-item>
          <el-form-item>
            <div
              class="button"
              @click="login"
            >登录</div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "Login",
  components: {},
  data() {
    return {
      form: {
        name: "",
        password: ""
      }
    };
  },
  computed: {
    ...mapState(["USER"])
  },
  methods: {
    ...mapMutations(["COMMIT_APPLIST", "COMMIT_USERLIST", "COMMIT_USER", "COMMIT_RENEWLIST"]),
    ...mapActions(["DISPATCH_CLEARCHACE"]),
    async getAppList() {
      try {
        const { obj } = await this.$API.listApplication();
        await this.COMMIT_APPLIST(obj);
      } catch (error) {
        console.log(error);
      }
    },
    async getUserList() {
      try {
        const { obj } = await this.$API.userInfoList();
        await this.COMMIT_USERLIST(obj);
        console.log(obj, "userlist");
      } catch (error) {
        console.log(error);
      }
    },
    async getAllRenews() {
      try {
        const { obj } = await this.$API.getAllRenews();
        await this.COMMIT_RENEWLIST(obj);
      } catch (error) {
        console.log(error);
      }
    },
    async login() {
      if (this.form.name === "") {
        this.$msg.error("登录账号不能为空!");
        return;
      }
      if (this.form.password === "") {
        this.$msg.error("登录密码不能为空!");
        return;
      }
      try {
        const params = {
          username: this.form.name,
          password: this.form.password
        };
        const { flag, obj } = await this.$API.login(params);
        if (flag === 1) {
          await this.COMMIT_USER(obj);
          this.$router.push({ name: "home" });
          this.getAppList();
          this.getUserList();
          this.getAllRenews();
        }
      } catch (error) {
        console.log(error);
        this.$msg.error(error.msg);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.loginbg {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
  background: radial-gradient(circle, #1da6ed, #0856ea);
}
.loginBox {
  width: 868px;
  height: 463px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  display: flex;

  &__left {
    width: 434px;
    height: 463px;
    background: url("../../assets/img/login/login_bg.png") no-repeat;
    background-size: 100% 100%;
    font-family: PingFang SC;
    display: flex;
    align-items: center;
    justify-content: center;

    .line {
      position: relative;
      &::after {
        position: absolute;
        content: "";
        top: 70px;
        width: 106px;
        height: 4px;
        background: #0856ea;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    h1 {
      font-size: 36px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      margin-bottom: 61px;
    }
    p {
      font-size: 20px;
      color: rgba(255, 255, 255, 1);
    }
  }

  &__right {
    flex: 1;
    padding: 100px 75px;
    .items {
      width: 222px;
      line-height: 44px;
      padding: 0 24px;
      background: #efefef;
      outline: none;
      border: none;
      margin-bottom: 16px;
    }
    .button {
      width: 270px;
      height: 54px;
      margin: 23px auto;
      cursor: pointer;
      line-height: 54px;
      background: linear-gradient(
        -90deg,
        rgba(24, 149, 237, 1),
        rgba(8, 86, 234, 1)
      );
      border-radius: 4px;
      font-size: 20px;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
    }
  }
}
</style>
