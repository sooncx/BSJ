<template>
  <section class="userCenter">
    <div class="userCenter__header">
      <h2>个人中心</h2>
    </div>

    <div class="userCenter__container">
      <div class="left">
        <div>
          <h4>基本资料</h4>
          <div class="formItems">
            <p>用户名</p>
            <span>{{userMsg.userName}}</span>
          </div>
          <div class="formItems">
            <p>昵称</p>
            <div class="unset" v-if="userMsg.name.isShow">
              <span>{{userMsg.name.value ? userMsg.name.value : '未设置'}}</span>
              <i class="iconfont icon-bianji" @click="userMsg.name.isShow = false"></i>
            </div>
            <el-input
              v-else
              v-model="userMsg.name.value"
              placeholder="请输入内容"
              size="small"
              style="width:200px"
            ></el-input>
          </div>
          <div class="formItems">
            <p>生日</p>
            <div class="unset" v-if="userMsg.birthday.isShow">
              <span>{{userMsg.birthday.value ? userMsg.birthday.value : '未设置'}}</span>
              <i class="iconfont icon-bianji" @click="userMsg.birthday.isShow = false"></i>
            </div>
            <el-date-picker
              v-else
              v-model="userMsg.birthday.value"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期"
              style="width:200px"
              size="small"
            ></el-date-picker>
          </div>
          <div class="formItems">
            <p>性别</p>
            <div class="unset" v-if="userMsg.sex.isShow">
              <span>{{userMsg.sex.value ? userMsg.sex.value == 1 ? '男':'女' : '未设置'}}</span>
              <i class="iconfont icon-bianji" @click="userMsg.sex.isShow = false"></i>
            </div>
            <el-radio-group v-model="userMsg.sex.value" size="small" v-else>
              <el-radio-button label="1">男</el-radio-button>
              <el-radio-button label="2">女</el-radio-button>
            </el-radio-group>
          </div>
          <div class="formItems">
            <p>企业名称</p>
            <div class="unset" v-if="userMsg.company.isShow">
              <span>{{userMsg.company.value ? userMsg.company.value : '未设置'}}</span>
              <i class="iconfont icon-bianji" @click="userMsg.company.isShow = false"></i>
            </div>
            <el-input
              v-else
              v-model="userMsg.company.value"
              placeholder="请输入内容"
              size="small"
              style="width:200px"
            ></el-input>
          </div>

          <div
            class="fromBtn"
            v-if="!userMsg.sex.isShow |
            !userMsg.birthday.isShow |
            !userMsg.name.isShow |
            !userMsg.company.isShow |
            !safeSetting.email.isShow"
          >
            <el-button type="primary" size="small" @click="submit">确定</el-button>
            <el-button size="small" @click="userCancel">取消</el-button>
          </div>
        </div>
      </div>
      <div class="right">
        <h4>安全设置</h4>
        <div class="formItems">
          <p>绑定手机</p>
          <p>{{safeSetting.phone.value}}</p>
          <span style="color:#0856EA;cursor:pointer;margin-left:37px" @click="dialogClick('phone')">
            点击修改
          </span>
          <!-- <div class="unset" v-if="safeSetting.phone.isShow">
            <span>{{safeSetting.phone.value ? safeSetting.phone.value : '未设置'}}</span>
            <i class="iconfont icon-bianji" @click="safeSetting.phone.isShow = false"></i>
          </div>
          <el-input
            v-else
            v-model="safeSetting.phone.value"
            placeholder="请输入内容"
            size="small"
            style="width:200px"
          ></el-input> -->
        </div>
        <div class="formItems">
          <p>绑定邮箱</p>
          <div class="unset" v-if="safeSetting.email.isShow">
            <span>{{safeSetting.email.value ? safeSetting.email.value : '未设置'}}</span>
            <i class="iconfont icon-bianji" @click="safeSetting.email.isShow = false"></i>
          </div>
          <div v-else>
            <el-input
              v-model="safeSetting.email.value"
              placeholder="请输入内容"
              size="small"
              style="width:200px"
            ></el-input>
            <!-- <el-button
              type="primary"
              size="small"
              @click="submit('safeSetting')"
              style="margin-left:20px;">确定</el-button>
            <el-button size="small" @click="userCancel('safeSetting')">取消</el-button> -->
          </div>
        </div>
        <div class="formItems">
          <p>登录密码</p>
          <span style="display:inline-block;min-width:90px;text-align:left">
            {{safeSetting.password.isShow?'******':safeSetting.password.value}}
          </span>
          <span
            class="iconfont pwdBtn"
            :class="safeSetting.password.isShow?'icon-yanjing':'icon-yanjing1'"
            @click="safeSetting.password.isShow=!safeSetting.password.isShow"
          ></span>
          <span style="color:#0856EA;cursor:pointer" @click="pwdDialog=true">点击修改</span>
        </div>
        <!-- <div class="fromBtn" v-if="!safeSetting.phone.isShow |
          !safeSetting.email.isShow">
          <el-button type="primary" size="small" @click="submit('safeSetting')">确定</el-button>
          <el-button size="small" @click="userCancel('safeSetting')">取消</el-button>
        </div> -->
      </div>
    </div>
    <!-- 修改手机 -->
    <el-dialog :visible.sync="phoneDialog" width="500px">
      <template slot="title">
        <h3 style="text-align:left">修改绑定手机</h3>
      </template>
      <el-form ref="phoneForm" :model="phoneForm" label-width="80px">
        <el-form-item label="手机号" style="text-align:left" v-if="!phoneForm.phoneToken">
          <p>{{safeSetting.phone.value}}</p>
        </el-form-item>
        <el-form-item label="新手机号" style="text-align:left" v-else>
          <el-input size="small" placeholder="请输入新手机号" style="width:100%" v-model="phoneForm.phone">
          </el-input>
        </el-form-item>
        <el-form-item prop="oldCode" label="验证码" style="text-align:left">
          <el-input size="small" style="width:100%" v-model="phoneForm.code">
            <el-button
              slot="append"
              @click="sendCode"
              :disabled="verifyCodeFlag"
              size="mini"
              style="width:140px"
            >{{ typeof(verifyCodeStr) === 'string' ? verifyCodeStr : verifyCodeStr+'s后可再次发送' }}
            </el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <div solt="footer" class="dialogFooter">
        <el-button @click="phoneDialog=false" size="small">取消</el-button>
        <el-button type="primary"
        @click="phoneSubmit('next')"
        size="small"
        v-if="!phoneForm.phoneToken">下一步</el-button>
        <el-button
        type="primary"
        @click="phoneSubmit('revise')"
        size="small"
        v-else>确定</el-button>
      </div>
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog :visible.sync="pwdDialog" width="500px">
      <template slot="title">
        <h3 style="text-align:left">修改密码</h3>
      </template>
      <el-form ref="form" :model="pwdForm" label-width="80px">
        <el-form-item label="手机号" style="text-align:left">
          <p>{{safeSetting.phone.value}}</p>
        </el-form-item>
        <el-form-item prop="code" label="验证码" style="text-align:left">
          <el-input size="small" style="width:100%" v-model="pwdForm.code">
            <el-button
              slot="append"
              @click="sendCode"
              :disabled="verifyCodeFlag"
              size="mini"
              style="width:140px"
            >{{ typeof(verifyCodeStr) === 'string' ? verifyCodeStr : verifyCodeStr+'s后可再次发送' }}
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="newPwd" label="新密码" style="text-align:left">
          <el-input size="small" style="width:100%" v-model="pwdForm.newPwd" maxlength="16">
          </el-input>
        </el-form-item>
      </el-form>
      <div solt="footer" class="dialogFooter">
        <el-button @click="pwdDialog=false" size="small">取消</el-button>
        <el-button type="primary" @click="submitForm" size="small">保存</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      pwdDialog: false,
      phoneDialog: false,
      verifyCodeFlag: false,
      verifyCodeStr: "获取验证码",
      verifyCodeTimer: null,
      userMsg: {
        userName: "",
        name: {
          isShow: true,
          value: ""
        },
        birthday: {
          isShow: true,
          value: ""
        },
        sex: {
          isShow: true,
          value: ""
        },
        company: {
          isShow: true,
          value: ""
        }
      },
      safeSetting: {
        phone: {
          isShow: true,
          value: ""
        },
        email: {
          isShow: true,
          value: ""
        },
        password: {
          isShow: true,
          value: ""
        }
      },
      pwdForm: {
        code: null,
        newPwd: null
      },
      phoneForm: {
        phoneForm: null,
        phone: null,
        code: null,
      }
    };
  },
  computed: {
    ...mapState(["USER"]),
  },
  watch: {
    USER: {
      handler() {
        this.loadData();
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getUser() {
      this.$API.getUserMsg().then(res => {
        // console.log(res);
        if (res.flag === 1) {
          const user = res.obj;
          this.userMsg.userName = user.phone ? user.phone : null;
          this.userMsg.name.value = user.nickName ? user.nickName : null;
          this.userMsg.birthday.value = user.birthday ? user.birthday : null;
          this.userMsg.sex.value = user.sex ? user.sex : null;
          this.userMsg.company.value = user.company ? user.company : null;
          this.safeSetting.phone.value = user.phone ? user.phone : null;
          this.safeSetting.email.value = user.email ? user.email : null;
          this.safeSetting.password.value = user.password ? user.password : null;
        }
      });
    },
    loadData() {
      this.userMsg.userName = this.USER.phone ? this.USER.phone : null;
      this.userMsg.name.value = this.USER.nickName ? this.USER.nickName : null;
      this.userMsg.birthday.value = this.USER.birthday ? this.USER.birthday : null;
      this.userMsg.sex.value = this.USER.sex ? this.USER.sex : null;
      this.userMsg.company.value = this.USER.company ? this.USER.company : null;
      this.safeSetting.phone.value = this.USER.phone ? this.USER.phone : null;
      this.safeSetting.email.value = this.USER.email ? this.USER.email : null;
      this.safeSetting.password.value = this.USER.password ? this.USER.password : null;
    },
    submit() {
      let info = Object;
      info = {
        company: this.userMsg.company.value,
        birthday: this.userMsg.birthday.value,
        nickName: this.userMsg.name.value,
        sex: this.userMsg.sex.value,
        email: this.safeSetting.email.value
      };

      this.$API.modifyUser(info).then(res => {
        // console.log(res);
        if (res.flag === 1) {
          this.$msg.success(res.msg);
          this.getUser();
          this.userMsg.name.isShow = true;
          this.userMsg.birthday.isShow = true;
          this.userMsg.sex.isShow = true;
          this.userMsg.company.isShow = true;
          this.safeSetting.email.isShow = true;
        } else {
          this.$msg.error(res.msg);
        }
      });
    },
    userCancel() {
      this.userMsg.name.isShow = true;
      this.userMsg.birthday.isShow = true;
      this.userMsg.sex.isShow = true;
      this.userMsg.company.isShow = true;
      this.safeSetting.email.isShow = true;
    },
    async sendCode() {
      if (this.phoneForm.phoneToken && !(/^[1](([3][0-9])|([4][5,7,9])|([5][0-9])|([6][6])|([7][3,5,6,7,8])|([8][0-9])|([9][8,9]))[0-9]{8}$/).test(this.phoneForm.phone)) {
        this.$msg.error("请输入正确的手机号码");
        return;
      }
      const info = {
        phone: this.phoneForm.phoneToken ? this.phoneForm.phone : this.safeSetting.phone.value,
        type: this.phoneForm.phoneToken ? 1 : 2,
      };
      const data = await this.$API.getVerifyCode(info);
      if (data.flag !== 1) {
        this.$msg.error(data.msg);
        return;
      }
      clearInterval(this.verifyCodeTimer);
      this.verifyCodeFlag = true;
      this.verifyCodeStr = 60;
      this.verifyCodeTimer = setInterval(() => {
        if (this.verifyCodeStr === 1) {
          this.clearTime();
        } else {
          this.verifyCodeStr--;
        }
      }, 1000);
    },
    clearTime() {
      clearInterval(this.verifyCodeTimer);
      this.verifyCodeFlag = false;
      this.verifyCodeStr = "获取验证码";
    },
    submitForm() {
      const info = {
        phone: this.safeSetting.phone.value,
        verifyCode: this.pwdForm.code,
        newPassword: this.pwdForm.newPwd,
        modifyType: 2
      };
      this.$API.modifyPassword(info).then(res => {
        if (res.flag === 1) {
          this.pwdDialog = false;
          this.getUser();
          this.$msg.success(res.msg);
        } else {
          this.$msg.error(res.msg);
        }
      });
    },
    dialogClick(type) {
      if (type === 'phone') {
        this.phoneDialog = true;
        this.phoneForm.phone = null;
        this.phoneForm.phoneToken = null;
        this.phoneForm.code = null;
      }
      this.clearTime();
    },
    phoneSubmit(type) {
      if (!this.phoneForm.code) {
        this.$msg.error('请输入验证码');
        return;
      }
      if (type === 'next') {
        const info = {
          phone: this.safeSetting.phone.value,
          verifyCode: this.phoneForm.code
        };
        this.$API.modifyPhoneFirst(info).then(res => {
          if (res.flag === 1) {
            this.phoneForm.phoneToken = res.obj;
            this.phoneForm.code = null;
            this.clearTime();
          } else {
            this.$msg.error(res.msg);
          }
        });
      } else {
        if (!this.phoneForm.phone) {
          this.$msg.error('请输入手机号码');
          return;
        }
        if (!(/^[1](([3][0-9])|([4][5,7,9])|([5][0-9])|([6][6])|([7][3,5,6,7,8])|([8][0-9])|([9][8,9]))[0-9]{8}$/).test(this.phoneForm.phone)) {
          this.$msg.error("请输入正确的手机号码");
          return;
        }
        const info = {
          phoneToken: this.phoneForm.phoneToken,
          phone: this.phoneForm.phone,
          verifyCode: this.phoneForm.code
        };
        this.$API.modifyPhoneSecond(info).then(res => {
          if (res.flag === 1) {
            this.phoneDialog = false;
            this.getUser();
          } else {
            this.$msg.error(res.msg);
          }
        });
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.userCenter {
  &__header {
    height: 40px;
    line-height: 40px;
    width: 100%;
    display: flex;
    align-items: center;
    padding-right: 20px;
    box-sizing: border-box;
    justify-content: flex-start;
    h2 {
      font-size: 18px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
  }

  &__container {
    margin-top: 17px;
    flex: 1;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 4px 8px 0px rgba(91, 95, 107, 0.08);
    padding: 24px;
    display: flex;
    font-family: PingFang SC;
    .left {
      width: 30%;
      min-width: 400px;
      border-right: 1px solid #f1f1f1;
      padding: 0 20px;
      box-sizing: border-box;
    }
    .right {
      padding-left: 40px;
      box-sizing: border-box;
    }
    .formItems {
      display: flex;
      align-items: center;
      margin-bottom: 25px;
      height: 33px;
      line-height: 33px;
      p {
        font-size: 14px;
        width: 90px;
        text-align: left;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
      }
      input {
        outline: none;
        border: none;
      }
      .pwdBtn {
        cursor: pointer;
        display: inline-block;
        width: 37px;
        height: 33px;
        text-align: center;
        line-height: 33px;
      }
    }
    .unset {
      span {
        color: #333;
        margin-right: 16px;
      }
      i {
        font-size: 16px;
        cursor: pointer;
      }
      i:hover {
        color: #0856ea;
      }
    }
    h4 {
      font-size: 16px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      text-align: left;
      margin: 20px 0 40px;
    }
  }
}
.dialogFooter {
  text-align: right;
}
</style>
