<template>
  <div class="reportCenter">
    <el-menu
      class="reportCenter__menu"
      :text-color="'#666666'"
      :default-active="$route.name"
      @select="key => $route.name !== key && $router.push({name: key})"
    >
      <el-menu-item index="offLine">
        <i class="reportCenter__icon iconfont icon-offline"></i>
        <span slot="title">离线报表</span>
      </el-menu-item>
      <el-menu-item index="dailyOilWear">
        <i class="reportCenter__icon iconfont icon-licheng"></i>
        <span slot="title">里程报表</span>
      </el-menu-item>
      <el-menu-item index="nox">
        <i class="reportCenter__icon iconfont icon-buhege"></i>
        <span slot="title">不合格报表</span>
      </el-menu-item>
      <el-menu-item index="illegal">
        <i class="reportCenter__icon iconfont icon-weigui"></i>
        <span slot="title">违规报表</span>
      </el-menu-item>
      <el-menu-item index="OBDHistory">
        <i class="reportCenter__icon iconfont icon-lishi"></i>
        <span slot="title">OBD历史报表</span>
      </el-menu-item>
    </el-menu>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<style lang="scss" scoped>
.reportCenter {
  height: 100%;
  background: #eaedf1;
  display: flex;
  flex-direction: row;
  &__menu {
    padding: 15px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    box-shadow: 2px 0px 4px 0px rgba(0, 0, 0, 0.05);
  }

  &__icon {
    margin-right: 10px;
    font-size: 16px
  }
}
</style>
