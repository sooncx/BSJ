<template>
  <div class="body">
    <!-- 用户信息 -->
    <div class="body__left">
      <UserInfo></UserInfo>
      <UserTree
      @type="settingFun"
      ></UserTree>
    </div>
    <div class="body__right">
      <!-- 表格信息 -->
      <UserTable
        v-model:seleceUserId="seleceUserId"
        ref="refTable"
        @type="settingFun"
      ></UserTable>
    </div>
    <!-- 新增用户弹层 -->
    <userInfoModal
    v-model:visible="addUserVisible" 
    :type="addUserType" 
    :userId="selectUserId" 
    @addUserModalHandleOk="addUserModalHandleOk"></userInfoModal>
    <!-- 绑定车组 -->
    <carGroupBindModal
    v-model:visible="carGroupBindModalVisible"
    @handleOk="carGroupBindHandleOk"
    :selectUserId="selectUserId"
    ></carGroupBindModal>
  </div>
</template>
<script lang="ts">
import { defineComponent,Ref,reactive,inject, toRefs } from "vue";
import UserInfo from "./info.vue";
import UserTree from "./tree.vue";
import UserTable from "./table.vue";
import API from "@/api/manageData";
import { Modal  } from 'ant-design-vue';
import { ElMessage } from 'element-plus';
import { userInfoModal,carGroupBindModal } from "@/views/manageData/module/index";
import { useInit } from '@/hooks/web/useInit';
export default defineComponent({
  components: {
    UserInfo,
    UserTable,
    UserTree,
    userInfoModal,
    carGroupBindModal
  },
  setup() {
    const InitUse = useInit();
    const resTreeData = () => {
      InitUse.getUserAllData(); // 重新获取用户树列表数据 放入缓存
      setTimeout(()=>{
        data.refTable.getData();
      },500)
    }
    const data = reactive({
      selectUserId: 0,                        // 选择ID
      refTable: <any>null,
      carGroupBindModalVisible: false,        // 绑定车辆窗口显示状态
      addUserVisible: false,                  // 新增或修改用户窗口显示状态
      addUserType: 'add'                      // 窗口类型
    });

    // 注册用户id 注入器
    const seleceUserId = <Ref<() => void>>inject("seleceUserId");

    // 绑车
    const bindCar = async (item:any) => {
      data.selectUserId = item.userId
      data.carGroupBindModalVisible = true;
    }

    // 新增用户
    const addUser = (type:string,item:any=null) => {
      data.addUserVisible = true;
      data.addUserType = type;
      data.selectUserId = 0;
      if(type !== 'add') data.selectUserId = item.userId;
    }

    // 删除用户
    const deleteUser = (item:any) => {
      Modal.confirm({
        title: '删除人员',
        content: '重要提示：帐号被删时，该帐号下的加车币，钻石将返回上一级账号！',
        okText: '确定',
        cancelText: '取消',
        async onOk() {
          try {
            const { flag,msg } = await API.deleteClientUser({userId:item.userId,type:0});
            if(flag == -1) throw msg;
            // 判断是否有子账户 16005
            if(flag === 16005){
              resDeleteUser(item.userId);return;
            }
            ElMessage.success('删除成功');
            resTreeData();
          } catch (error) {
            ElMessage.error(error);
          }
        }
      });
    }

    //提示有子用户删除
    const resDeleteUser = (userId:any) => {
      Modal.confirm({
        title: '删除人员',
        content: '重要提示：该用户下还有子用户,是否继续删除该用户？',
        okText: '确定',
        cancelText: '取消',
        async onOk() {
          try {
            const {flag,msg} = await API.deleteClientUser({userId,type:1});
            if(flag !== 1) throw msg;
            ElMessage.success('删除成功');
            resTreeData();
          } catch (error) {
            ElMessage.error(error);
          }
        }
      });
    }

    // 功能聚合
    const settingFun = (type:string,item:any) => {
      if(type === 'editInfo') bindCar(item);
      // 添加
      if(type === 'add'){
        if(item === null){
          addUser('add');return;
        }
        addUser('addParent',item);
      }
      // 修改
      if(type === 'edit') addUser('edit',item);
      // 删除
      if(type === 'delete') deleteUser(item);
    }

    //用户绑定车组
    const carGroupBindHandleOk = async (item:any) => {
      let gvids = [] as any;
      item.forEach((item:any)=>{
        gvids.push(item.gi);
      });
      try {
        const {flag,msg} = await API.bindUserGroup({userId:data.selectUserId,groupIds:gvids.join(",")});
        if(flag !== 1) throw msg;
        ElMessage.success('绑定成功');
      } catch (error) {
        ElMessage.error(error);
      }
    }

    //添加子用户成功
    const addUserModalHandleOk = () => {
      resTreeData();
    }
    return {
      addUserModalHandleOk,
      carGroupBindHandleOk,
      settingFun,
      seleceUserId,
      ...toRefs(data)
    };
  },
});
</script>

<style lang="less" scoped>
.body{
  height: 100%;
  width: 100%;
  overflow: auto;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  &__right{
    flex:1;
  }
  &__left{
    width: 285px;
    display: flex;
    flex-direction: column;
  }
}
</style>