<template>
  <div class="main">
    <div class="nav">
      <img
        src="../../assets/img/home/logo.png"
        class="logo"
        @click="$router.push('/home')"
      />
      <div class="nav_user">
        <!-- <img src="../../assets/img/controlPanel/user.png" />
        <span>{{LOGINUSER.username}}</span> -->
        <el-dropdown
          placement="bottom-end"
          trigger="hover"
        >
          <span
            class="user"
            @click="jump('userCenter')"
          >
            <img src="../../assets/img/controlPanel/user.png" />
            <span>{{LOGINUSER && LOGINUSER.username}}</span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item @click.native="dialogVisible = true">修改密码</el-dropdown-item> -->
            <el-dropdown-item @click.native="loginOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="controlPanel">
      <el-menu
        :collapse="visible"
        class="controlPanel__menu el-menu-vertical-demo"
        :text-color="'#333'"
        background-color="#fff"
        active-text-color="#0856EA"
        :default-active="$route.name"
        :default-openeds="['1']"
        @select="selectTag"
      >
        <el-menu-item index="appManage">
          <i class="iconfont icon-yingyong"></i>
          <span slot="title">应用管理</span>
        </el-menu-item>
        <el-submenu index="1">
          <template slot="title">
            <i class="iconfont icon-edu"></i>
            <span
              slot="title"
              style="padding-right:80px"
            >额度管理</span>
          </template>
          <el-menu-item index="limitBuy">
            <i class=""></i>
            <span slot="title">我的额度</span>
          </el-menu-item>
          <!-- <el-menu-item index="limitApplyRecord">
            <i class></i>
            <span slot="title">配额申请记录</span>
          </el-menu-item> -->
          <el-menu-item index="limitEquity">
            <i class></i>
            <span slot="title">额度权益</span>
          </el-menu-item>
        </el-submenu>

        <el-menu-item index="userCenter">
          <i class="iconfont icon-gerenzhongxin"></i>
          <span slot="title">个人中心</span>
        </el-menu-item>
        <el-menu-item index="Documentation">
          <i class="iconfont el-icon-document"></i>
          <span slot="title">帮助文档</span>
        </el-menu-item>
      </el-menu>
      <div class="controlPanel_right">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
// @ is an alias to /src

export default {
  name: "controlPanel",
  components: {},
  data() {
    return {
      visible: false
    };
  },
  mounted() {
    this.getUserMsg();
  },
  computed: {
    ...mapState(["LOGINUSER"])
  },
  methods: {
    ...mapMutations(["COMMIT_USER", "COMMIT_LOGINUSER"]),
    async getUserMsg() {
      try {
        const { obj } = await this.$API.getUserMsg();
        await this.COMMIT_USER(obj);
      } catch (error) {
        console.log(error, "error");
        this.$msg({
          showClose: true,
          message: error.msg,
          type: "error"
        });
      }
    },
    selectTag(key) {
      if (this.$route.name !== key) {
        this.$router.push({ name: key });
      }
    },
    loginOut() {
      this.$confirm
        .confirm("此操作将退出登录, 是否继续?", "提示", {
          showCancel: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.$msg({
            type: "success",
            message: "退出成功!"
          });
          localStorage.removeItem("LOGINUSER");
          this.COMMIT_LOGINUSER(null);
          this.$router.replace("/home");
        })
        .catch(err => {
          console.log(err);
          this.$msg({
            type: "info",
            message: "已取消退出"
          });
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.main {
  height: 100%;
  .nav {
    flex: 1;
    height: 60px;
    background: black;
    display: flex;
    align-items: center;
    color: #fff;
    .logo {
      height: 32px;
      margin-right: auto;
      padding-left: 20px;
      cursor: pointer;
    }
    &_user {
      margin-left: auto;
      padding-right: 20px;
      display: flex;
      align-items: center;
      img {
        width: 32px;
        height: 32px;
      }
      span {
        color: #fff;
        margin-left: 5px;
      }
    }
    .user {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 20px;
      border: none;
      outline: none;
      cursor: pointer;
      img {
        width: 30px;
        height: 30px;
        border: none;
        outline: none;
      }
      span {
        color: #fff;
        margin-left: 5px;
      }
    }
  }
  .controlPanel {
    height: 100%;
    background: #f0f2f5;
    display: flex;
    flex-direction: row;
    &__menu {
      text-align: left;
      overflow-y: auto;
      overflow-x: hidden;
      font-size: 14px;
      font-family: Microsoft YaHei;
      .iconfont {
        margin-right: 10px;
      }
    }
    &__icon {
      margin-right: 10px;
      font-size: 6px;
    }
    &_right {
      padding: 10px 10px 20px 10px;
      display: flex;
      flex-flow: column;
      font-family: PingFang SC;
      width: 100%;
      flex: 1;
      height: calc(100vh - 60px);
      box-sizing: border-box;
      overflow: hidden;
    }
  }
}
.el-menu {
  border-right: none;
}
.el-menu-item {
  &:hover {
    border-right: 2px solid #0856ea;
    background: $sellectItem !important;
    color: #0856ea !important;
    .iconfont {
      color: #0856ea !important;
    }
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 220px;
  min-height: 400px;
}
::v-deep .el-submenu__title:hover {
  & > i {
    margin-right: -2px !important;
  }
  .iconfont {
    margin-right: 8px !important;
    color: #0856ea !important;
  }
  & > span {
    padding-left: 2px !important;
  }
  border-right: 2px solid #0856ea;
  background: $sellectItem !important;
  color: #0856ea !important;
}
.el-menu-item.is-active {
  background-color: $sellectItem !important;
  border-right: 2px solid #0856ea;
  color: #0856ea;
  span {
    color: #0856ea !important;
  }
}
</style>
