<template>
  <transition name="el-fade-in">
    <div
      class="dialog-mask"
      v-show="visabled"
      @click="close"
    >
      <div
        class="dialog-wrapper animated"
        :class="{'fadeInUp':visabled,'fadeInOut':!visabled}"
        ref="dialogWrapper"
      >
        <div :class="{'myshow':mytest}">
          <div
            class="loginDialog"
            @click.stop
          >
            <div class="left">
              <img
                src="../../assets/img/login/logo.png"
                alt
              />
              <p>Welcome</p>
            </div>

            <div class="right">

              <h2>{{loginTitle}}</h2>
              <p>{{titleDetail}}</p>

              <div class="form">
                <el-form
                  :rules="rules"
                  :model="fromData"
                  class="demo-form-inline"
                  ref="ruleForm"
                >
                  <el-form-item
                    label="手机号"
                    prop="phoneNo"
                  >
                    <el-input
                      v-model.number="fromData.phoneNo"
                      placeholder=""
                      :inline="true"
                      onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
                      maxlength="16"
                      @keyup.enter.native="submitForm('ruleForm')"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="验证码"
                    prop="verificationCode"
                    v-if="showType === 'phoneLogin' || showType === 'regist'"
                  >
                    <el-input
                      v-model="fromData.verificationCode"
                      placeholder=""
                      maxlength="16"
                      @keyup.enter.native="submitForm('ruleForm')"
                    ></el-input>
                    <span
                      class="el-input_code"
                      @click="getVerifyCode"
                      v-if="VerifyFlag"
                    >{{VerifyText}}</span>
                    <span
                      v-else
                      class="el-input_code"
                    >{{VerifyText}}</span>
                  </el-form-item>
                  <el-form-item
                    label="密码"
                    prop="password"
                    v-if="showType === 'passwordLogin' || showType === 'regist'"
                  >
                    <el-input
                      :type="passwordShow?'':'password'"
                      v-model="fromData.password"
                      placeholder=""
                      maxlength="16"
                      @keyup.enter.native="submitForm('ruleForm')"
                    ></el-input>
                    <i
                      class="el-input_code iconfont pwdBtn"
                      @click="passwordShow = !passwordShow"
                      :class="passwordShow?'icon-yanjing':'icon-yanjing1'"
                    ></i>
                    <!--:class="safeSetting.password.isShow?'icon-yanjing':'icon-yanjing1'" -->
                  </el-form-item>
                </el-form>
                <div class="loginType">
                  <p
                    v-for="(item, index) in loginType"
                    :key="index"
                    @click="jump(item.value)"
                  >{{item.label}}</p>
                </div>
                <!-- <el-checkbox v-model="checked">下次直接登录</el-checkbox> -->
                <div class="loginBtn">
                  <p @click="submitForm('ruleForm')">{{showType === "regist"?"确定":"登录"}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState, mapMutations } from "vuex";

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    // phoneLogin , passwordLogin , regist
    showType: {
      type: String,
      default: "passwordLogin"
    }
  },
  data() {
    return {
      passwordShow: false,
      mytest: false,
      Timer: null,
      fromData: {
        phoneNo: "",
        password: "",
        verificationCode: ""
      },
      rules: {
        phoneNo: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          {
            pattern: /^1[3-9][0-9]\d{8}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        verificationCode: [
          { required: true, message: "请输入验证码", trigger: "blur" }
        ]
      },
      VerifyText: "获取验证码",
      VerifyFlag: true,
      loginTitle: "密码登录",
      titleDetail: "请输入手机号与密码进行登录",
      visabled: this.show,
      loginType: [
        { label: "短信登录", value: "phoneLogin" },
        // { label: "密码登录", value: "passwordLogin" },
        { label: "免费注册", value: "regist" }
      ]
    };
  },
  computed: {
    ...mapState(["USER", "sessionId"])
  },
  watch: {
    show() {
      this.visabled = this.show;
      if (!this.show) {
        clearInterval(this.Timer);
      }
    },
    showType: {
      handler() {
        // clearInterval(this.Timer);
        // this.Timer = null;
        // this.VerifyText = "获取验证码";
        if (this.$refs.ruleForm) {
          this.$refs.ruleForm.resetFields();
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations(["COMMIT_USER", "COMMIT_LOGINUSER", "COMMIT_registTag"]),
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("submit!!");
          if (this.showType === "regist") {
            this.regist();
          } else {
            this.login();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    clear() {
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields();
      }
      this.fromData = {
        phoneNo: "",
        password: "",
        verificationCode: ""
      };
      clearInterval(this.Timer);
      this.Timer = null;
      this.VerifyText = "获取验证码";
    },
    async jump(val) {
      this.mytest = true;
      this.fromData = {
        phoneNo: "",
        password: "",
        verificationCode: ""
      };
      setTimeout(() => {
        if (val === "phoneLogin") {
          this.loginTitle = "手机快捷登录";
          this.titleDetail = "使用手机号快捷登录，无账号将自动注册";
          this.loginType = [
            { label: "密码登录", value: "passwordLogin" },
            { label: "免费注册", value: "regist" }
          ];
        } else if (val === "passwordLogin") {
          this.loginTitle = "密码登录";
          this.titleDetail = "请输入手机号与密码进行登录";
          this.loginType = [
            { label: "短信登录", value: "phoneLogin" },
            { label: "免费注册", value: "regist" }
          ];
        } else {
          this.loginTitle = "免费注册";
          this.titleDetail = "欢迎注册博云开放平台";
          this.loginType = [
            { label: "密码登录", value: "passwordLogin" },
            { label: "短信登录", value: "phoneLogin" }
          ];
        }
      }, 300);
      setTimeout(() => {
        this.$emit("update:showType", val);
      }, 100);
      setTimeout(() => {
        this.mytest = false;
      }, 810);
      await this.$emit("update:showType", val);
    },
    close() {
      this.$emit("update:show", false);
      // this.clear();
    },
    async getUserMsg() {
      try {
        const { obj } = await this.$API.getUserMsg();
        this.COMMIT_USER(obj);
      } catch (error) {
        console.log(error);
        this.$msg({
          showClose: true,
          message: error.msg,
          type: "error"
        });
      }
    },
    async getVerifyCode() {
      if (this.VerifyText !== "获取验证码") {
        return;
      }
      if (this.fromData.phoneNo === "" || !this.fromData.phoneNo) {
        this.$msg({
          showClose: true,
          message: "请输入手机号!",
          type: "error"
        });
        return;
      }
      this.VerifyFlag = false;
      clearInterval(this.Timer);
      try {
        const { flag } = await this.$API.getVerifyCode({
          phone: this.fromData.phoneNo,
          type: this.showType === "phoneLogin" ? 1 : 0
        });

        if (flag === 1) {
          this.VerifyText = 60;
          this.Timer = setInterval(() => {
            if (this.VerifyText > 1) {
              this.VerifyText--;
            } else {
              this.VerifyText = "获取验证码";
              this.VerifyFlag = true;
            }
          }, 1000);
        }
      } catch (error) {
        this.VerifyText = "获取验证码";
        this.VerifyFlag = true;
        this.$msg({
          showClose: true,
          message: error.msg,
          type: "error"
        });
      }
    },
    async login() {
      try {
        const params = {};
        if (this.showType === "passwordLogin") {
          params.loginType = 1;
          params.username = this.fromData.phoneNo;
          params.password = this.fromData.password;
        } else if (this.showType === "phoneLogin") {
          params.loginType = 2;
          params.phone = this.fromData.phoneNo;
          params.verifyCode = this.fromData.verificationCode;
        }
        const { obj, flag } = await this.$API.login(params);
        if (flag === 1) {
          if (this.showType === "phoneLogin") {
            await this.COMMIT_registTag("first");
          }
          await this.COMMIT_LOGINUSER(obj);
          this.$emit("update:show", false);
          // console.log(this.sessionId);
          // this.getUserMsg();
        }
      } catch (error) {
        console.log(error);
        await this.COMMIT_LOGINUSER(null);
        this.$msg({
          showClose: true,
          message: error.msg,
          type: "error"
        });
      }
    },
    async regist() {
      try {
        const params = {
          registerType: 2,
          phone: this.fromData.phoneNo,
          password: this.fromData.password,
          verifyCode: this.fromData.verificationCode
        };
        const { flag } = await this.$API.regist(params);
        if (flag === 1) {
          const info = {
            loginType: 1,
            username: this.fromData.phoneNo,
            password: this.fromData.password
          };
          const data = await this.$API.login(info);

          if (data.flag === 1) {
            await this.COMMIT_LOGINUSER(data.obj);
            this.$emit("update:show", false);
            this.jump("phoneLogin");
          }
        }
      } catch (error) {
        console.log(error);
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
.dialog-mask {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 999;
  display: table;
  animation-duration: 0.2s;
  .dialog-wrapper {
    display: table-cell;
    vertical-align: middle;
  }
}
@keyframes fadeInUp {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(55%, -55%, 0) scale3d(0, 0, 0);
    -ms-transform: translate3d(55%, -55%, 0) scale3d(0, 0, 0);
    transform: translate3d(55%, -55%, 0) scale3d(0, 0, 0);
  }
  100% {
    opacity: 1;
    -webkit-transform: none;
    -ms-transform: none;
    transform: none;
  }
}
@keyframes fadeInOut {
  0% {
    opacity: 1;
    -webkit-transform: none;
    -ms-transform: none;
    transform: none;
  }
  100% {
    opacity: 0;
    -webkit-transform: translate3d(55%, -55%, 0) scale3d(0, 0, 0);
    -ms-transform: translate3d(55%, -55%, 0) scale3d(0, 0, 0);
    transform: translate3d(55%, -55%, 0) scale3d(0, 0, 0);
  }
}
.fadeInUp {
  transition: all 0.4s;
  -webkit-animation: fadeInUp 0.4s;
  animation: fadeInUp 0.4s;
}

.fadeInOut {
  transition: all 0.4s;
  -webkit-animation: fadeInOut 0.4s;
  animation: fadeInOut 0.4s;
}

.loginDialog {
  position: relative;
  background: #fff;
  width: 680px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, 0%);
  z-index: 2026;
  display: flex;
  .left {
    background: rgba(4, 33, 89, 1);
    width: 300px;
    display: flex;
    flex: 1;
    justify-content: center;
    flex-flow: column;
    p {
      font-size: 30px;
      font-family: Arial;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      margin-top: 27px;
    }
    img {
      width: 49px;
      margin: 0 auto;
    }
  }
  .right {
    flex: 1;
    box-sizing: border-box;
    padding: 34px 60px 40px;
    width: 380px;
    font-family: PingFang SC;
    text-align: left;
    h2 {
      font-size: 18px;
      font-weight: bold;
      color: rgba(30, 37, 50, 1);
      line-height: 30px;
    }
    p {
      font-size: 12px;
      color: rgba(132, 132, 132, 1);
      line-height: 30px;
    }
  }
  .form {
    margin-top: 36px;
    .formItem {
      font-family: PingFang SC;
      margin-bottom: 26px;
      position: relative;
      p {
        font-size: 14px;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 30px;
      }
      input {
        border: none;
        width: 100%;
        outline: none;
        line-height: 30px;
        border-bottom: 1px solid rgba(211, 211, 211, 1);
        box-sizing: border-box;
      }
      .code {
        position: absolute;
        right: 0;
        bottom: 13px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(8, 86, 234, 1);
        z-index: 1111;
        cursor: pointer;
      }
    }
    .loginType {
      display: flex;
      justify-content: space-between;
      // margin-top: -20px;
      p {
        cursor: pointer;
        color: #0856ea;
        &:hover {
          color: #3b80ff;
        }
      }
    }
  }
  .loginBtn {
    display: flex;
    justify-content: flex-end;
    margin-top: 25px;
    p {
      width: 116px;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      text-align: center;
      background: rgba(8, 86, 234, 1);
      box-shadow: 0px 8px 17px 1px rgba(10, 71, 187, 0.2);
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
    }
  }
}
.myshow {
  opacity: 1;
  transform: translateX(0%);
  animation: test 0.8s;
}
.myhide {
  opacity: 0;
  transform: translateX(100%);
  transition: 0.5s;
}
@keyframes test {
  0% {
    transform: translateX(0%);
    opacity: 1;
  }
  49% {
    transform: translateX(50%);
    opacity: 0;
  }
  50% {
    transform: translateX(-50%);
    opacity: 0;
  }
  51% {
    transform: translateX(-50%);
    opacity: 0;
  }
  100% {
    transform: translateX(0%);
    opacity: 1;
  }
}
::v-deep .el-input__inner {
  border: none;
  border-radius: 0;
  border-bottom: 1px solid rgba(211, 211, 211, 1);
  padding-left: 0;
  background: #fff !important;
}
::v-deep .el-form-item__label {
  line-height: 20px;
  &::before {
    content: none !important;
  }
}
.el-input_code {
  position: absolute;
  top: 20px;
  right: 0;
  color: #0856ea;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    color: #3b80ff;
  }
}
.pwdBtn {
  cursor: pointer;
  display: inline-block;
  width: 37px;
  height: 33px;
  text-align: center;
  line-height: 33px;
}
</style>
