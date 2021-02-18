<template>
  <div class="login">
    <div class="login__bg">
      <div class="box"></div>
    </div>
    <el-row
      type="flex"
      justify="center"
    >
      <el-col :span="12" style="width:1000px">
        <el-row
          type="flex"
          justify="center"
          class="login__from"
        >
          <el-col :span="12">
            <div class="login__form__left">
              <div class="login__form__left__top">
                <p class="title">Hello !</p>
                <p class="title2">
                  欢迎登陆
                  <span class>重柴尾气排放监测平台</span>
                </p>
              </div>
              <el-form
                class="login__form__left__main"
                :model="loginForm"
                :rules="rules"
                ref="loginForm"
              >
                <el-form-item prop="username">
                  <el-input
                    type="input"
                    v-model="loginForm.username"
                    autocomplete="off"
                    placeholder="账号"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    type="password"
                    v-model="loginForm.password"
                    autocomplete="off"
                    placeholder="密码"
                  ></el-input>
                </el-form-item>
                <el-row :gutter="22">
                  <el-col :span="12">
                    <el-form-item prop="code">
                      <el-input
                        v-model="loginForm.code"
                        placeholder="请输入验证码"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <div
                      class="coderight"
                      @click="identifyCode = makeCode()"
                    >
                      <Identify :identifyCode="identifyCode" />
                    </div>
                  </el-col>
                </el-row>
                <el-form-item>
                  <button
                    class="login__form__left__button"
                    type="primary"
                    @click.prevent="login()"
                  >登录</button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col
            :span="12"
            class="login__form__right"
          >
            <div class="login__form__right__bg"></div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
import Identify from "@/components/Identify/index.vue";

export default {
  components: { Identify },
  props: {},
  data() {
    return {
      identifyCode: this.makeCode(),
      loginForm: {
        username: "",
        password: "",
        code: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "账号不能为空！",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "'密码不能为空！",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            trigger: "blur",
            message: "验证码不能为空"
          },
          {
            trigger: "blur",
            validator: (rule, value, callback) =>
              value.toLocaleLowerCase() ===
              this.identifyCode.toLocaleLowerCase()
                ? callback()
                : callback(new Error("请输入正确的验证码"))
          }
        ]
      }
    };
  },

  methods: {
    ...mapMutations(["COMMIT_USER"]),
    ...mapActions(["DISPATCH_CLEARCHACE"]),
    async login() {
      try {
        await this.$refs.loginForm.validate();
        const { username, password } = this.loginForm;
        const { data } = await this.$API.doLoginAdmin({
          userName: username,
          password
        });
        await this.DISPATCH_CLEARCHACE({ Vue: this });
        this.COMMIT_USER(data);
        this.$router.push("/");
      } catch (error) {
        console.error(error);
        this.identifyCode = this.makeCode();
        this.$msg({
          showClose: true,
          message: error ? error.msg : "请输入正确的字段",
          type: "error"
        });
      }
    },
    makeCode() {
      const codes = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(
        ""
      );
      return new Array(4)
        .fill("")
        .map(() => {
          const i = randomNum(0, codes.length);
          return codes[i];
        })
        .join("");

      function randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.login {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &__bg {
    flex: 1;
    position: fixed;
    display: flex;
    align-items: center;
    align-items: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-width: 1000px;
    z-index: -10;
    zoom: 1;
    background-color: #fff;
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-position: center 0;
    background-image: url("../../assets/img/login/login_bg.png");
  }
  &__form {
    &__left {
      padding: 60px;
      background-color: #ffffff;
      &__top {
        font-family: Microsoft YaHei;
        font-weight: Regular;
        line-height: 44px;
        padding-bottom: 66px;
        .title {
          font-size: 2em;
          color: #333333;
        }
        .title2 {
          font-size: 1.5em;
          color: #999999;
          span {
            color: #45af4b;
          }
        }
      }
      &__main {
        /deep/.el-input__inner {
          max-width: 310px;
          border-radius: 20px;
          background-color: #f5f5f5;
        }
      }
      &__button {
        width: 149px;
        height: 48px;
        border: 0px;
        background: linear-gradient(-90deg, #45af4b, #6bd771);
        box-shadow: 0px 6px 8px 0px #14ae1d;
        border-radius: 24px;
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
        line-height: 44px;
        user-select: none;
        outline: 0;
        cursor: pointer;
      }
    }
    &__right {
      &__bg {
        height: 100%;
        background-repeat: no-repeat;
        background-size: cover;
        -webkit-background-size: cover;
        -o-background-size: cover;
        background-position: center 0;
        background-image: url("../../assets/img/login/login_center.png");
      }
    }
  }
}
</style>
