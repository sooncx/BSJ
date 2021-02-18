<template>
  <div class="home">
    <div class="home_slideBar">
      <el-menu
        :collapse="visible"
        class="home_slideBar_menu el-menu-vertical-demo"
        :text-color="'#333'"
        background-color="#fff"
        active-text-color="#0856EA"
        :default-active="$route.name"
        :default-openeds="[]"
        @select="selectTag"
      >
        <el-menu-item index="control">
          <i class="iconfont"></i>
          <span slot="title">控制台</span>
        </el-menu-item>
        <el-menu-item index="userManage">
          <i class="iconfont"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
        <el-menu-item index="limitManage">
          <i class="iconfont"></i>
          <span slot="title">额度管理</span>
        </el-menu-item>
        <el-menu-item index="interfaceManage">
          <i class="iconfont"></i>
          <span slot="title">接口管理</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="home_content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  components: {},
  data() {
    return {
      visible: false
    };
  },
  methods: {
    selectTag(key) {
      if (this.$route.name !== key) {
        this.$router.push({ name: key });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  // min-width: 1080px;
  height: 100%;
  background: #f5f5fa;
  overflow: auto;
  display: flex;
  &_slideBar {
    height: 100vh;
    background: #f0f2f5;
    display: flex;
    flex-direction: row;
    width: 220px;
    // border: 1px solid pink;
    &_menu {
      height: 100%;
      text-align: left;
      overflow-y: auto;
      overflow-x: hidden;
      font-size: 14px;
      font-family: Microsoft YaHei;
      .iconfont {
        margin-right: 10px;
      }
    }
  }
  &_content {
    padding: 20px;
    display: flex;
    flex-flow: column;
    font-family: PingFang SC;
    width: calc(100vw - 220px);
    height: calc(100vh - 50px);
    box-sizing: border-box;
    overflow: hidden;
  }
}
.el-menu {
  border-right: none;
}
.el-menu-item {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
