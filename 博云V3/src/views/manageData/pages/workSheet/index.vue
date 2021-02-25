<template>
  <div class="content">
    <div class="header">
      <!-- 标签页 -->
      <div class="tabs">
        <div class="tabs__item" :class="{active: activeTabIndex===item.value}" @click="selectTabs(item.value)" v-for="(item,index) in tabsItem" :key="index">{{item.title}}</div>
      </div>
      <!-- 搜索功能 -->
      <searchCom
      @type="settingFun"
      @onSearch="onSearch"
      ></searchCom>
    </div>
    <div style="flex:1;">
      <!-- 表格  -->
      <tableCom
      :activeTabIndex="activeTabIndex"
      :tableAllData="tableData"
      :total="total"
      :tableLoading="tableLoading"
      :pageNumber="search.pageNumber"
      :pageSize="search.pageSize"
      @onSearch="onSearch"
      @currentChange="currentChange"
      @selectionChange="selectionChange"
      @type="settingFun"
      ></tableCom>
    </div>
    <!-- 查看工单 -->
    <carWorkSheetModal v-model:visible="modalVisible" :type="modalType" :dataItem="modalItem" @workSheetHandOk="workSheetHandOk" ></carWorkSheetModal>
  </div>
</template>
<script lang="ts">
import { defineComponent,toRefs,reactive,nextTick,watch  } from "vue";
import searchCom from "./search.vue";
import tableCom from "./table.vue";
import { carWorkSheetModal } from "@/views/manageData/module/index";
import { Modal  } from 'ant-design-vue';  
import API from "@/api/manageData";
import router from "@/router";
import { ElMessage } from "element-plus";
export default defineComponent({
  components: {
    carWorkSheetModal,
    searchCom,
    tableCom
  },
  setup() {
    const data = reactive({
      activeTabIndex: 0,                // 标签页
      search:<any>{},                   // 搜索条件
      modalVisible: false,              // 弹窗显示状态
      modalType: 'add',                 // 弹窗类型
      modalItem: null,                  // 弹窗数据
      tableData: <any>[],               // 表格数据
      tableLoading: false,              // 表格Loading
      tableSelectsRow: <any>[],         // 表格多选值 
      total: 0,                         // 总数
      tabsItem: [                       // 标签页内容
        { title: '全部',value: 0 },
        { title: '待确认',value: 1 },
        { title: '待安装',value: 2 },
        { title: '已安装',value: 3 },
        { title: '已完成',value: 4 },
        { title: '已取消',value: 5 },
      ],
    });
    
    // 完成和取消工单
    const changestatusWorkSheet = async (status:number,id:number) => {
      try {
        const {flag,msg} = await API.updateWorkSheetStatus({id,status});
        if(flag !== 1) throw msg;
        if(status === 5) ElMessage.success('取消成功');
        if(status === 4) ElMessage.success('完成成功');
      } catch (error) {
        ElMessage.error(error);
      }
    }

    // 删除工单
    const deleteWorkSheet = async (selectedRowKeys:any) => {
      let ids = '';
      selectedRowKeys.forEach((item:any)=>{
        ids += item.id + ',';
      });
      ids = ids.substring(0,ids.length-1);
      try {
        const {flag,msg} = await API.deleteWorkSheet({ids});
        if(flag !== 1) throw msg;
        ElMessage.success('删除成功');
      } catch (error) {
        ElMessage.error(error);
      }
    }
    
    // 处理工单
    const confirmData = (record:any, type:string,selectedRowKeys:any=[]) => {
      let msg:string = '';
      switch(type){
        case 'delete':
          msg = '删除';
          break;
        case 'complete':
          msg = '完成';
          break;
        case 'cancel':
          msg = '取消';
      }
      // 删除工单判断是否有选择数据
      if(type=== 'delete' && selectedRowKeys.length === 0){
        ElMessage.error('请在表格中选择需要删除的工单');
        return false;
      }
      Modal.confirm({
        title: msg + '工单',
        content:'是否'+msg+'该工单（该操作不可逆）',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          if(type === 'delete') deleteWorkSheet(selectedRowKeys);
          if(type === 'complete') changestatusWorkSheet(4,record.id);
          if(type === 'cancel') changestatusWorkSheet(5,record.id);
          setTimeout(function (){
            getData();
          },500);
        }
      });
    }

    // 搜索条件整合
    const checkSearch = () => {
      let params = {
        ...data.search
      }
      params.searchType = data.search.searchValues !== '' ? data.search.searchType : -1;
      return params;
    }
    
    // 导出
    const onExport = () => {
      API.exportWorkSheet({...checkSearch(),type:0});
    }

    // 新增或修改工单 成功回调
    const workSheetHandOk = (type:string) => {
      if(type === 'add'){
        data.activeTabIndex = 1;
      }
      getData();
    }
        
    // 查询
    const onSearch = (search:any) => {
      data.search = search;
      data.search.pageNumber = 1;
      getData();
    }

    // 获取工单数据
    const getData = async () => {
      data.tableLoading = true;
      try {
        const { obj,flag,msg } = await API.pageWorkSheetListByCondition(checkSearch());
        if(flag !== 1) throw msg;
        data.tableData = obj.data;
        data.total = obj.total;
      } catch (error) {
        ElMessage.error(error);
      }
      data.tableLoading = false;
    }
    
    // 监听路由路径
    watch(() => router.currentRoute.value.name,(val, old: any) => {
      if (!val || val != "workSheet") return;
      if (!router.currentRoute.value || !router.currentRoute.value.params) return;
      if (router.currentRoute.value.params.type) {
        const { type } = router.currentRoute.value.params;
        switch(type){
          case 'workSheet':             // 全部
            data.activeTabIndex = 0;
            break;
          case 'confirmCounts':         // 待确认
            data.activeTabIndex = 1;
            break;
          case 'processiveCounts':      // 待安装
            data.activeTabIndex = 2;
            break;
        }
      }
      },{ deep: true, immediate: true,}
    );

    // 选择标签页
    const selectTabs = (index:number) =>{
      data.activeTabIndex = index;
      data.search.status = index;
      data.tableData = [];
      getData();
    }

    // 分页功能
    const currentChange = (page: number, pageSize: number) => {
      data.search.pageNumber = page;
      data.search.pageSize = pageSize;
      getData();
    };


    // 查看 修改 新建工单功能
    const showData = (record:any, type:string) => {
      data.modalVisible = true;
      data.modalType = type;
      data.modalItem = record;
    }

    // 功能聚合
    const settingFun = (type:any,value:any=null) => {
      // 添加  查看  修改
      if(type === 'add' || type === 'show' || type === 'edit'){
        showData(value,type);return;
      }
      // 删除 
      if(type === 'delete'){
        confirmData(value,'delete',data.tableSelectsRow);return;
      }
      // 完成 取消
      if(type === 'complete' || type === 'cancel'){
        confirmData(value,type);return;
      }
      // 导出
      if(type === 'export'){
        onExport();return;
      }
    }

    // 表格多选
    const selectionChange = (row:any) => {
      data.tableSelectsRow = row;
    }
    return {
      selectionChange,
      settingFun,
      currentChange,
      onSearch,
      onExport,
      showData,
      workSheetHandOk,
      selectTabs,
      confirmData,
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>

.content{
  height: 100%;
  overflow: hidden;
  display: flex;
  padding-top:5px;
  flex-direction: column;
  background-color: rgb(255, 255, 255);
  .header{
    .tabs{
      width:100%;
      display: flex;
      flex-wrap: wrap;
      border-bottom: 1px solid #e8e8e8;
      &__item{
        padding: 0 36px;
        font-size: 14px;
        line-height: 50px;
        font-family: PingFang-SC-Bold;
        font-weight: 700;
        color: #acb0b7;
        cursor: pointer;
      }
      .active{
        color: #1184e5;
        border-bottom: 3px solid #1184e5;
      }
    }
    
  }
}

::v-deep(.ant-table-wrapper){
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
