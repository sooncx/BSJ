<template>
  <div class="manageData">
    <el-menu
      class="manageData__menu"
      :text-color="'#666666'"
      :default-active="$route.name"
      @select="key => $route.name !== key && $router.push({name: key})"
    >
      <el-menu-item index="userManage">
        <i class="manageData__icon iconfont icon-user1"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
      <el-menu-item index="vehManage">
        <i class="manageData__icon iconfont icon-truck"></i>
        <span slot="title">车辆管理</span>
      </el-menu-item>
      <el-menu-item index="vehTypeManage">
        <i class="manageData__icon iconfont icon-type"></i>
        <span slot="title">车型管理</span>
      </el-menu-item>
      <el-menu-item index="importVehsExcel">
        <i class="manageData__icon iconfont icon-upload"></i>
        <span slot="title">批量导入</span>
      </el-menu-item>
    </el-menu>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<style lang="scss" scoped>
.manageData {
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
