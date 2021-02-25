<template>
  <div class="userTable">
    <!-- 设备详情 -->
    <div class="userTable__top">
      <div class ="userTable__top__left">
        <carHeader type="dev"></carHeader>
      </div>
      <div class="userTable__top__right">
        <a-button v-permission="160102" type="primary" @click="model('add')">
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
              <span v-permission="160102" @click="model('add',scope.row)">新增下级</span>
              <span v-permission="160101" @click="model('edit',scope.row)">修改</span>
              <span v-permission="160105" @click="model('editInfo',scope.row)">绑车</span>
              <span v-permission="160106" @click="resPassword(scope.row.userId)">重置密码</span>
              <span v-if="checkUserDelete()" v-permission="160104" @click="model('delete',scope.row)">删除</span>
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
  </div>
</template>
<script lang="ts">  
import { defineComponent,toRefs,nextTick,ref,watch,reactive } from "vue";
import { carHeader } from "@/views/manageData/module/index";
import API from "@/api/manageData";
import { ElMessage } from 'element-plus';
import { getAccountType } from "@/views/manageData/module/src/function";
import store from "@/store/index";
import { Modal  } from 'ant-design-vue';
export default defineComponent({
  components:{
    carHeader
  },
  props: {
    // 选择用户ID
    seleceUserId: {
      type: Number,
      default:  0
    }
  },
  setup(props,{emit}) {
  const data = reactive({
    tableData : <any>[],                              // 表格数据
    pagination :{                                     // 分页配置
      showTotal: (total:string) => `共 ${total} 条数据`,  // 显示总数
      showSizeChanger: true,                          // 是否允许选中 指定数量
      pageSize: 30,                                   // 分页数量
      total: 0,
      current: 1,
      pageSizeOptions: ['10','20','30','40'], //指定数量
    },
    tableLoading: false,                              // 表格Loding
    userId: 0,                                        // 树选择用户id
    stateUserId: 0,                                   // 当前登录用户id
  });

  // 获取数据
  const getData = async () => {
    // 用户id 默认为空 不获取数据
    if(data.userId === 0) return;
    data.tableLoading = true;
    try {
      const { obj,flag,msg } = await API.pageUser({
        userId:data.userId,
        type:0,
        pageNumber: data.pagination.current,
        pageSize: data.pagination.pageSize
      });
      if(flag !== 1) throw msg;
      data.tableData = obj.data;
      data.pagination.total = obj.total;
    } catch (error) {
      ElMessage.error(error);
    }
    data.tableLoading = false;
  }
      
  // 重置密码
  const resPassword = async (userId:any) => {
    //先获取重置密码
    const { obj  } = await API.resetUserPassword({userId,type:0});
    Modal.confirm({
      title: '重置密码',
      content: '将该用户的密码重置为随机密码 '+ obj,
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        try {
          const {flag, msg} = await API.resetUserPassword({userId,type:1});
          if(flag !== 1) throw msg;
          ElMessage.success('重置成功');
        } catch (error) {
          ElMessage.error(error);
        }
      }
    });
  }

  // 分页
  const currentChange = (page: number, pageSize: number) => {
    data.pagination.current = page;
    data.pagination.pageSize = pageSize;
    getData();
  };

  // 导出数据
  const onExport = () =>{
    if(data.userId){
      API.exportUser({userId:data.userId}); return;
    }
    ElMessage.error('请选择用户组');
  }

  // 监听选择用户ID
  watch(()=>props.seleceUserId, (value)=>{
    if(!value) return;
    data.userId = props.seleceUserId;
    getData()
  });

  // 权限监控 判断是否可以删除功能
  const checkUserDelete = () => {
    return store.state.USER.checkUser === 0;
  }
  
  // 获取当前登录用户的ID
  data.stateUserId = store.state.USER.userId;
  const tableBox = ref();
  const offsetHeight = ref();
  nextTick(() => {
    offsetHeight.value = tableBox.value.offsetHeight;
  });

  // 功能聚合
  const model = (type:any,value:any=null) => {
    emit('type',type,value);
  }
  return {
    model,
    checkUserDelete,
    tableBox,
    onExport,
    offsetHeight,
    resPassword,
    getData,
    getAccountType,
    currentChange,
    ...toRefs(data)
  };
  },
});
</script>
<style lang="less" scoped>
@import "../../../dataReport/module/css/index.less";

.userTable{
  width: 100%;
  background-color: #ffffff;
  display: flex;
  height: 100%;
  flex-direction: column;
  &__top{
    width: 100%;
    height: 51px;
    line-height: 51px;
    padding:0 17px;
    font-size: 14px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .userTable__top__left{
      span{
        color:#0E60DB;
      }
    }
    .userTable__top__right button:first-child{
      color:while;
      margin-right:12px;
    }
  }
  &__content{
    overflow-y: auto;
    flex:1;
  }
  &__pager {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 20px;
    border-top: 1px solid #d9e0e9;
  }
}
</style>
