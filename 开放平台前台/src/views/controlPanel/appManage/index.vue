<template>
  <section class="appManage">
    <div
      class="cover"
      v-if="firstRun == null"
    ></div>
    <div class="appManage__header">
      <h2>我的应用</h2>
      <el-popover
        placement="left-start"
        title="提示"
        width="220"
        trigger="manual"
        style="z-index:999"
        content="点击创建新应用进行下一步操作。"
        v-model="TipVisible"
      >

        <div
          slot="reference"
          ref="btn"
          class="addBtn"
          @click="createApp"
        >创建新应用</div>
      </el-popover>

    </div>

    <div class="appManage__container">
      <el-table
        :data="tableData"
        style="min-width: 100%;"
        class="limitBuy__table"
      >
        <el-table-column
          prop="bindName"
          label="应用名称"
        ></el-table-column>
        <el-table-column
          prop="appName"
          label="应用类型"
        ></el-table-column>
        <el-table-column
          prop="bindUsername"
          label="绑定应用的账号"
        ></el-table-column>
        <el-table-column
          prop="key"
          label="key"
          min-width="100"
        >
          <template slot-scope="scope">
            <div class="copyBox">
              <p>{{scope.row.key}}</p>
              <i
                class="el-icon-document-copy"
                v-clipboard:copy="scope.row.key"
                v-clipboard:success="onCopy"
                title="复制"
              ></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="operation">
              <span @click="revise(scope.row)">修改</span>
              <span @click="del(scope.row)">解绑</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="580px"
    >
      <template slot="title">
        <h3 style="text-align:left">新建应用</h3>
      </template>
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="130px"
      >
        <el-form-item
          prop="name"
          label="应用名称"
          style="text-align:left"
          :rules="[
            { required: true, message: '请输入应用名称', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="addForm.name"
            size="small"
            style="width:90%;"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="appType"
          label="应用类型"
          style="text-align:left"
          v-if="formType === 'add'"
          :rules="[
            { required: true, message: '请选择应用类型', trigger: 'change' },
          ]"
        >
          <el-select
            v-model="addForm.appType"
            placeholder="请选择应用类型"
            size="small"
            style="width:90%;text-align:left"
          >
            <el-option
              v-for="item in appTypeList"
              :key="item.appId"
              :label="item.name"
              :value="item.appId"
              :disabled="item.binded"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="key"
          v-if="formType === 'revise'"
          style="text-align:left"
          prop="key"
          :rules="[
            { required: true, message: '请输入key', trigger: 'blur' },
          ]"
        >
          <el-input
            :disabled="true"
            v-model="addForm.key"
            size="small"
            style="width:90%;"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="username"
          label="应用账号"
          style="text-align:left"
          :rules="[
            { required: true, message: '请输入应用账号', trigger: 'blur' },
          ]"
          v-if="addForm.appType !== 4 && formType === 'add'"
        >
          <el-input
            v-model="addForm.username"
            size="small"
            style="width:90%;"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          label="应用密码"
          style="text-align:left"
          :rules="[
            { required: true, message: '请输入应用密码', trigger: 'blur' },
          ]"
          v-if="addForm.appType !== 4 && formType === 'add'"
        >
          <el-input
            v-model="addForm.password"
            size="small"
            style="width:90%;"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="phone"
          label="手机号码"
          style="text-align:left"
          :rules="[
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { type: 'number', message: '手机号码必须为数字值'}
          ]"
          v-if="addForm.bindType == 2"
        >
          <el-input
            v-model.number="addForm.phone"
            size="small"
            type="age"
            style="width:90%;"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          prop="verifyCode"
          label="验证码"
          style="text-align:left"
          :rules="[
            { required: true, message: '请输入手机验证码', trigger: 'blur' },
          ]"
          v-if="addForm.bindType == 2"
        >
          <el-input
            v-model="addForm.verifyCode"
            size="small"
            style="width:90%;"
          >
            <el-button
              slot="append"
              @click="sendCode"
              :disabled="verifyCodeFlag"
              size="mini"
              style="width:140px"
            >
              {{ typeof(verifyCodeStr) === 'string' ? verifyCodeStr : verifyCodeStr+'s后可再次发送' }}
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item
          prop="checkIpType"
          label="请求校验方式"
          style="text-align:left"
        >
          <el-radio-group
            v-model="addForm.checkIpType"
            size="small"
          >
            <el-radio-button label="1">需要</el-radio-button>
            <el-radio-button label="2">不需要</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          prop="ip"
          label="ip"
          style="text-align:left"
          v-if="addForm.checkIpType == 1"
          :rules="[
            { required: true, message: '请输入ip', trigger: 'blur' },
          ]"
        >
          <el-input
            style="width:90%;"
            type="textarea"
            :rows="4"
            placeholder="请输入ip"
            v-model="addForm.ip"
          >
          </el-input>
        </el-form-item>
        <p class="formTips">
          只有IP白名单内的服务器才能成功发起调用格式: 212.66.26.45,英文半角逗号分隔。如果不想对IP做任何限制，选否
          <span>（谨慎使用，key如果泄露配额会被其用户消费，上线前可以用作Debug，线上正式key请设置合理的IP白名单）</span>
        </p>
      </el-form>
      <span solt="footer">
        <el-button
          type="primary"
          @click="submitForm('addForm')"
        >
          {{formType === 'add' ? '新建' : '修改'}}
        </el-button>
        <el-button @click="dialogVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
export default {
  data() {
    return {
      firstRun: localStorage.getItem("firstRun") || null,
      visable: false,
      dialogVisible: false,
      appTypeList: [],
      formType: "add",
      TipVisible: false,
      addForm: {
        name: null,
        appType: null,
        username: null,
        password: null,
        phone: null,
        verifyCode: null,
        key: null,
        checkIpType: 1,
        ip: null,
        bindType: 1
      },
      appId: null,
      verifyCodeStr: "获取验证码",
      verifyCodeFlag: false,
      verifyCodeTimer: null,
      tableData: []
    };
  },
  created() {
    this.getAppTypeData();
    this.getTableData();
  },
  computed: {
    // firstRun() {
    //   return localStorage.getItem("firstRun") == null;
    //   // localStorage.setItem("firstRun", "1"); // 然后储存一个firstRun
    // }
  },
  watch: {
    firstRun: {
      handler(val) {
        console.log(val, val == null, "firstRun");
        if (!val) {
          this.$nextTick(() => {
            // this.$refs.btn.dispatchEvent(new MouseEvent("click"));
            this.TipVisible = true;
          });
        }
      },
      immediate: true
    }
  },
  methods: {
    getAppTypeData() {
      this.$API.listDefaultApp({}).then(res => {
        // console.log(res);
        this.appTypeList = res.obj;
      });
    },
    getTableData() {
      this.$API.listBindApplication({}).then(res => {
        // console.log(res);
        this.tableData = res.obj;
      });
    },
    async sendCode() {
      if (!this.addForm.phone) {
        this.$refs.addForm.validateField("phone");
        return;
      }
      if (
        !/^[1](([3][0-9])|([4][5,7,9])|([5][0-9])|([6][6])|([7][3,5,6,7,8])|([8][0-9])|([9][8,9]))[0-9]{8}$/.test(
          this.addForm.phone
        )
      ) {
        this.$msg.error("请输入正确的手机号码");
        return;
      }
      if (!this.addForm.appType) {
        this.$refs.addForm.validateField("appType");
        return;
      }

      if (this.verifyCodeFlag) return;
      // 发送验证码
      const data = await this.$API.generateVerifyCodeAPP({
        phone: this.addForm.phone,
        appType: this.addForm.appType
      });

      if (data.flag !== 1) {
        this.$msg.error(data.msg);
        return;
      }

      clearInterval(this.verifyCodeTimer);
      this.verifyCodeFlag = true;
      this.verifyCodeStr = 60;
      this.verifyCodeTimer = setInterval(() => {
        if (this.verifyCodeStr === 1) {
          this.verifyCodeStr = "获取验证码";
          this.verifyCodeFlag = false;
          clearInterval(this.verifyCodeTimer);
        } else {
          this.verifyCodeStr--;
        }
      }, 1000);
    },
    switchType(val) {
      if (val === 1) {
        this.addForm.phone = null;
        this.addForm.verifyCode = null;
      } else {
        this.addForm.username = null;
        this.addForm.password = null;
      }
    },
    createApp() {
      localStorage.setItem("firstRun", 1);
      // localStorage.removeItem("firstRun");
      this.TipVisible = false;
      this.firstRun = 1;
      this.dialogVisible = true;
      this.formType = "add";
      if (this.$refs.addForm) {
        this.$refs.addForm.resetFields();
      }
      this.addForm.name = null;
      this.addForm.key = null;
      this.addForm.appType = null;
      this.addForm.username = null;
      this.addForm.password = null;
      this.addForm.checkIpType = 1;
      this.addForm.ip = null;
      this.addForm.bindType = 1;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const info = JSON.parse(JSON.stringify(this.addForm));
          info.bindType = info.appType === 4 ? 0 : 1;

          if (info.checkIpType === 1 && !this.checkIpv6(info.ip)) {
            return;
          }

          if (this.formType === "add") {
            this.$API
              .bindApp(info)
              .then(() => {
                this.dialogVisible = false;
                this.getTableData();
                this.getAppTypeData();
              })
              .catch(err => {
                this.$msg.error(err.msg);
              });
          } else {
            info.userAppId = this.appId;
            this.$API
              .modifyUserAppInfo(info)
              .then(() => {
                this.dialogVisible = false;
                this.getTableData();
                this.getAppTypeData();
              })
              .catch(err => {
                this.$msg.error(err.msg);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    revise(row) {
      console.log(row);
      this.formType = "revise";
      this.dialogVisible = true;
      this.addForm.name = row.bindName;
      this.addForm.key = row.key;
      this.addForm.ip = row.ip;
      this.addForm.checkIpType = row.checkIpType ? row.checkIpType : 2;
      this.appId = row.userAppId;
    },
    del(row) {
      console.log(row);
      this.$confirm("此操作将解绑改应用, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$API.unbindApp({ userAppId: row.userAppId }).then(res => {
            if (res.flag === 1) {
              this.$msg.success(res.msg);
              this.getTableData();
              this.getAppTypeData();
              this.$refs.addForm.resetFields();
            } else {
              this.$msg.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$msg({
            type: "info",
            message: "已取消解绑"
          });
        });
    },
    // 检测多个ip地址用逗号分隔
    checkIpv6(ip) {
      const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      const valdata = ip.split(",");
      try {
        valdata.forEach(item => {
          if (reg.test(item) === false) {
            this.$msg.error("Ip格式不正确");
            throw Error();
          }
        });
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    onCopy() {
      this.$msg.success("复制成功");
    }
  }
};
</script>
<style lang="scss" scoped>
.appManage {
  height: 100%;
  &__header {
    height: 40px;
    line-height: 40px;
    width: 100%;
    display: flex;
    align-items: center;
    padding-right: 20px;
    box-sizing: border-box;
    justify-content: space-between;
    h2 {
      font-size: 18px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
    .addBtn {
      width: 102px;
      height: 32px;
      line-height: 32px;
      background: rgba(8, 86, 234, 1);
      font-size: 14px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      cursor: pointer;
      z-index: 999;
    }
  }

  &__container {
    margin-top: 17px;
    height: calc(100% - 57px);
    background: #fff;
    box-sizing: border-box;
    padding: 24px;
  }

  .copyBox {
    display: flex;
    align-items: center;
    i {
      display: block;
      width: 40px;
      text-align: right;
      color: rgba(8, 86, 234, 1);
      cursor: pointer;
    }
  }
}
.operation {
  span {
    color: rgba(8, 86, 234, 1);
    display: inline-block;
    width: 40px;
    cursor: pointer;
  }
}
.formTips {
  width: 90%;
  margin: 10px auto;
  text-align: left;
  line-height: 25px;
  span {
    color: rgba(255, 0, 0, 0.8);
  }
}
::v-deep .el-table th {
  background: rgba(250, 250, 250, 1);
  color: rgba(51, 51, 51, 1);
}
::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background: #0856ea;
  border-color: #0856ea;
  box-shadow: -1px 0 0 0 #0856ea;
}
::v-deep .el-button--primary {
  background-color: #0856ea;
  border-color: #0856ea;
}
.cover {
  width: calc(100vw);
  height: calc(100vh - 60px);
  background: rgb(0, 0, 0);
  opacity: 0.5;
  z-index: 99;
  position: absolute;
  bottom: 0;
  right: 0;
}
.coverTip {
  position: absolute;
  right: 130px;
  top: 90px;
}
</style>
