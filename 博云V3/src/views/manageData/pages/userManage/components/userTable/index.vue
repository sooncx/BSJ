<template>
  <div class="userTable">
    <!-- 设备详情 -->
    <div class="userTable__top">
      <div class ="userTable__top__left">
        <i :class="['iconfont', 'icon', 'icon-shebei']"></i>
        设备数量： 全部<span>（{{totalNum}}）</span> 在线<span>（{{onlineNum}}）</span> 离线<span>（{{offNum}}）</span>
      </div>
      <div class="userTable__top__right">
        <a-button v-permission="160102" type="primary" @click="addUser('add')">
          新增用户
        </a-button>
        <a-button @click="onExport" >
          <template v-permission="160107" #icon><i :class="['iconfont', 'icon', 'icon-daochu']"></i></template>
          导出
        </a-button>
      </div>
    </div>
    <!-- 用户表格 -->
    <div class="userTable__content detailTable" ref="tableBox">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        :height="offsetHeight"
        border
        size="small"
      >
        <el-table-column
          prop="name"
          label="登录账户"
          align="center">
        </el-table-column>
        <el-table-column
          prop="corpName"
          align="center"
          label="客户名称">
        </el-table-column>
        <el-table-column
          prop="accountType"
          align="center"
          label="账号类型">
          <template #default="scope">
            {{getAccountType(scope.row.accountType)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="parentName"
          align="center"
          label="上级账户">
        </el-table-column>
        <el-table-column
          prop="parentCorp"
          align="center"
          label="上级公司名">
        </el-table-column>
        <el-table-column
          prop="phone"
          align="center"
          label="手机号码">
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="button"
          width="220"
          align="center"
          label="操作">
          <template #default="scope">
            <div class="setting" v-if="scope.row.userId !== stateUserId">
              <span v-permission="160102" @click="addUser('addParent',scope.row)">新增下级</span>
              <span v-permission="160101" @click="addUser('edit',scope.row)">修改</span>
              <span v-permission="160105" @click="bindCar(scope.row)">绑车</span>
              <span v-permission="160106" @click="resPassword(scope.row.userId)">重置密码</span>
              <span v-if="checkUserDelete()" v-permission="160104" @click="deleteUser(scope.row)">删除</span>
            </div>
            <span v-else>
              -
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="userTable__pager">
      <a-pagination
        show-size-changer
        :page-size-options="pagination.pageSizeOptions"
        :total="pagination.total"
        :show-total="(total) => `共: ${pagination.total} 条`"
        size="small"
        v-model:pageSize="pagination.pageSize"
        v-model:current="pagination.current"
        @change="currentChange"
        @showSizeChange="currentChange"
      />
    </div>
    <!-- 新增用户弹层 -->
    <addUserModal 
    v-bind="$attrs" 
    v-model:visible="addUserVisible" 
    :type="addUserType" 
    :userId="selectUserId" 
    @addUserModalHandleOk="addUserModalHandleOk"></addUserModal>
    <!-- 绑定车组 -->
    <carGroupBindModal
    v-model:visible="carGroupBindModalVisible"
    @handleOk="carGroupBindHandleOk"
    :selectUserId="selectUserId"
    ></carGroupBindModal>
  </div>
</template>
<script lang="ts">  
import { defineComponent,toRefs,nextTick,ref,watch } from "vue";
import { addUserModal } from "@/views/manageData/module/index";
import { 
  data, 
  getData, 
  bindCar, 
  addUser, 
  resPassword,
  currentChange,
  deleteUser,
  onExport,
  getUserVehicleCount,
  carGroupBindHandleOk,
  addUserModalHandleOk,
} from './index';
import { carGroupBindModal } from "@/views/manageData/module/index";
import { getAccountType } from "@/views/manageData/module/src/function";
import store from "@/store/index";
export default defineComponent({
  components:{
    addUserModal,
    carGroupBindModal
  },
  props: {
    seleceUserId: {
      type: Number,
      default:  0
    }
  },
  setup(props) {
    data.tableData = [];
    watch(()=>props.seleceUserId, (value)=>{
      if(!value) return;
      data.userId = props.seleceUserId;
      getData()
    });
    // 权限监控 判断是否可以删除功能
    const checkUserDelete = () => {
      return store.state.USER.checkUser === 0;
    }
    data.stateUserId = store.state.USER.userId;
    const tableBox = ref();
    const offsetHeight = ref();
    nextTick(() => {
      getUserVehicleCount();
      offsetHeight.value = tableBox.value.offsetHeight;
    });
    return {
      checkUserDelete,
      tableBox,
      onExport,
      offsetHeight,
      resPassword,
      getUserVehicleCount,
      getData,
      addUserModalHandleOk,
      carGroupBindHandleOk,
      getAccountType,
      currentChange,
      deleteUser,
      addUser,
      bindCar,
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
@import "./index.less";
@import "../../../../../dataReport/module/css/index.less";
</style>
