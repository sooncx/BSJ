<template>
  <div class="content">
    <div class="header">
      <!-- 标签页 -->
      <div class="tabs">
        <div class="tabs__item" :class="{active: activeTabIndex===item.value}" @click="selectTabs(item.value)" v-for="(item,index) in tabsItem" :key="index">{{item.title}}</div>
      </div>
      <!-- 搜索功能 -->
      <div class="search">
        <div class="search__left">
          <div class="item">
            <a-button type="primary" @click="showData(null,'add')">新建工单</a-button>
            <a-button type="primary" @click="confirmData(null,'delete')">删除工单</a-button>
          </div>
        </div>
        <div class="search__right">
          <div class="item">
            <a-select
              v-model:value="searchType"
              style="width: 120px"
              ref="select"
            >
              <a-select-option
              v-for="item in searchTypeOption"
              :key="item.value"
              :value="item.value">
                {{item.label}}
              </a-select-option>
            </a-select>
          </div>
          <div class="item">
            <a-input
              v-if="searchType !== 2"
              v-model:value="search.searchValues" 
              placeholder="安装人员、车主、车牌号、设备号"
              style="width: 235px;"
            ></a-input>
          </div>
          <div class="item">
            <a-select
              v-if="searchType === 2"
              v-model:value="installWorkerName"
              style="width: 248px"
              placeholder="安装人员"
              @change="installWokerChange"
            >
              <a-select-option 
              v-for="item in installWorkerList"
              :value="item.userId"
              :key="item.userId"
              >
                {{item.name}}<span v-if="item.flag === 2">(已离职)</span>
              </a-select-option>
            </a-select>
          </div>
          <div class="item">
            <a-select
              v-model:value="terminalTypeValue"
              placeholder="设备类型"
              style="width: 120px;margin-right:8px;"
            >
              <a-select-option v-for="(item,index) in vehTypes" :key="index" :value="item.type" >
                {{item.typemap}}
              </a-select-option>
            </a-select>
          </div>
          <div class="item">
            <SelectDate v-model:value="rangeDate" dateType="date" />
          </div>
          <div class="item">
            <a-button type="primary" @click="onSearch()">
              <template #icon><i class="iconfont icon icon-sousuo"></i></template>
              查询</a-button>
            <a-button @click="onExport()">
              <template #icon><i class="iconfont icon icon-daochu"></i></template>
              导出</a-button>
          </div>
        </div>
      </div>
    </div>
    <div class="body">
      <!-- 表格  -->
      <div class="table_body detailTable" ref="tableBox">
        <el-table
          :data="tableData"
          v-if="column.length !== 0"
          border
          style="width: 100%;position:absolute;"
          :height="offsetHeight"
          size="small"
          v-loading="tableLoading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            v-for="(item, index) in column"
            :key="index"
            :label="item.title"
            :prop="item.dataIndex"
            :min-width="item.width"
            :align="item.align"
          >
            <template #default="scope" v-if="['installWorkerName','status','carList','installPosition','terminalNo'].includes(item.dataIndex)">
              <template  v-if="item.dataIndex === 'status'">
                <a-tag :color="getStatusStr(scope.row.status,'tag')">{{getStatusStr(scope.row.status,'title')}}</a-tag>
              </template>
              <template  v-if="item.dataIndex === 'carList'">
                <p v-for="(item,index) in scope.row.workSheetDeviceVo" :key="index" class="workPlate" @click="toMonitorCenter(scope.row,item)"><span>{{item.plate}}</span>({{item.terminalType}})</p>
              </template>
              <template v-if="item.dataIndex === 'installPosition'">
                <span v-for="(item,index) in scope.row.workSheetDeviceVo" :key="index">{{item.installPosition}}</span>
              </template>
              <template v-if="item.dataIndex === 'terminalNo'">
                <span v-for="(item,index) in scope.row.workSheetDeviceVo" :key="index">{{item.terminalNo}}<br/></span>
              </template>
              <template  v-if="item.dataIndex === 'installWorkerName'">
                {{scope.row.installWorkerName}}<span v-if="scope.row.installWorkerFlag === 2">(已离职)</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="120" header-align="center">
            <template #default="scope">
              <div class="setting">
                <span @click="showData(scope.row,'show')">查看</span>
                <span v-if="scope.row.status === 3" @click="confirmData(scope.row,'complete')" >完成</span>
                <span v-if="scope.row.status < 3" @click="showData(scope.row,'edit')">修改</span>
                <span v-if="scope.row.status < 3 " @click="confirmData(scope.row,'cancel')">取消</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页功能 --> 
      <div class="body__page">
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
    <!-- 查看工单 -->
    <carWorkSheetModal v-model:visible="modalVisible" :type="modalType" :dataItem="modalItem" @workSheetHandOk="workSheetHandOk" ></carWorkSheetModal>
  </div>
</template>
<script lang="ts">
import { defineComponent,toRefs,reactive,nextTick,watch  } from "vue";
import { carWorkSheetModal } from "@/views/manageData/module/index";
import SelectDate from "@/views/manageData/module/src/SelectDate.vue";
import { useStore } from "vuex";
import { Modal  } from 'ant-design-vue';  
import router from "@/router";
import API from "@/api/manageData";
import { 
  parament,
  getStatusStr,
  deleteWorkSheet,
  changestatusWorkSheet,
} from "./index";
import { ElMessage } from "element-plus";
export default defineComponent({
  components: {
    carWorkSheetModal,
    SelectDate
  },
  setup() {
    const store = useStore();
    const data = reactive({
      activeTabIndex: 0,
      searchType: 0,
      terminalTypeValue: '全部设备',
      search:{ 
        searchType: -1,
        searchValues: <string | null>'',
        terminalType: <any>null,
        userId: -1,
        status: 0,
        endTime: '',
        pageNumber: 1,
        pageSize: 50,
        startTime: ''
      },
      rangeDate: ['',''],
      tableData : <any>[],      //表格数据
      pagination :{             // 分页配置
        showTotal: (total:string) => `共 ${total} 条数据`,  // 显示总数
        showSizeChanger: true,  // 是否允许选中 指定数量
        pageSize: 40,           // 分页数量
        total: 0,
        current:1,
        pageSizeOptions: ['40','60','80','100'], //指定数量
      },
      column: <any>[],
      modalVisible: false,
      modalType: 'add',
      modalItem: null,
      selectedRowKeys: <any>[],
      tableLoading: false,
      installWorkerList: <any>[],
      installWorkerName: <any>null,
      vehTypes: store.state.vehTypes,
      offsetHeight: <any>null,
      offsetWidth: <any>null,
      tableBox: <any>null,
      ...parament
    });
    data.vehTypes.unshift({type:'',typemap:'全部设备'});
    watch(
      () => data.activeTabIndex,
      () => {
        data.column = [];
        data.tableData = [];
        nextTick(() => {
          changeTableHeader();
          getData();
        });
      }
    );
    nextTick(() => {
      data.offsetHeight = data.tableBox.offsetHeight;
      data.offsetWidth = data.tableBox.offsetWidth;
      getInstallWorker();
    });
    //车辆跳转监控中心
    const toMonitorCenter = (row:any,item:any) => {
      router.push({
        name: "monitorCenter",
        params: {
          vehicleId: item.deviceId,
          groupId: item.groupId,
          plate: item.plate,
        },
      });
    }
    
    //处理工单
    const confirmData = (record:any, type:string) => {
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

      if(type=== 'delete' && data.selectedRowKeys.length === 0){
        ElMessage.error('请在表格中选择需要删除的工单');
        return false;
      }
      Modal.confirm({
        title: msg + '工单',
        content:'是否'+msg+'该工单（该操作不可逆）',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          if(type === 'delete') deleteWorkSheet(data.selectedRowKeys);
          if(type === 'complete') changestatusWorkSheet(4,record.id);
          if(type === 'cancel') changestatusWorkSheet(5,record.id);
          setTimeout(function (){
            getData();
          },500);
        }
      });
    }
    // 选择安装人员
    const installWokerChange = (item:any,row:any) => {
      data.search.searchValues = row.value;
      data.search.userId = row.key;
      data.installWorkerName = row.value;
    }
    // 表格多选数据
    const handleSelectionChange = (e:any) => {
      data.selectedRowKeys = e;
    }

    //导出
    const onExport = () => {
      data.search.searchType = data.search.searchValues !== '' ? data.searchType : -1;
      data.search.startTime = data.rangeDate[0];
      data.search.endTime = data.rangeDate[1];
      API.exportWorkSheet({...data.search,type:0});
    }

    // 新增或修改工单 成功回调
    const workSheetHandOk = (type:string) => {
      if(type === 'add'){
        data.activeTabIndex = 1;
      }
      getData();
    }
        
    //查询
    const onSearch = () => {
      data.pagination.current = 1;
      getData();
    }

    // 分页功能
    const currentChange = (page: number, pageSize: number) => {
      data.pagination.current = page;
      data.pagination.pageSize = pageSize;
      getData();
    };

    // 获取工单数据
    const getData = async () => {
      data.tableLoading = true;
      data.tableData = [];
      try {
        data.search.terminalType = data.terminalTypeValue;
        //判断设备是否全部设备类型
        if(data.terminalTypeValue === '全部设备'){
          data.search.terminalType = '';
        }
        //判断是否有搜索条件
        data.search.searchType = data.search.searchValues !== '' ? data.searchType : -1;
        data.search.pageSize = data.pagination.pageSize;
        data.search.pageNumber = data.pagination.current;
        data.search.startTime = data.rangeDate[0];
        data.search.endTime = data.rangeDate[1];
        const { obj,flag,msg } = await API.pageWorkSheetListByCondition(data.search);
        if(flag !== 1){
          throw msg;
        }
        data.pagination.total = obj.total;
        data.tableData = obj.data;
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
        const { type, installWorkerId, installWorkerName } = router.currentRoute.value.params;
        switch(type){
          case 'workSheet':
            data.activeTabIndex = 0;
            break;
          case 'confirmCounts':
            data.activeTabIndex = 1;
            break;
          case 'processiveCounts':
            data.activeTabIndex = 2;
            break;
        }
        data.search.searchValues = installWorkerName as any;
        data.search.userId = installWorkerId as any;
        data.installWorkerName = installWorkerName;
        data.searchType = 2;
        data.pagination.total = 0;
        data.tableData = [];
      }
      nextTick(()=>{
        changeTableHeader();
        getData();
      });
      },{ deep: true, immediate: true,}
    );
    const selectTabs = (name:number) =>{
      data.activeTabIndex = name;
    }

    // 切换表头
    const changeTableHeader = () => {
      let tableHeader = [];
      for(let i=0; i< parament.headerArray[data.activeTabIndex].length; i++){
        tableHeader.push(parament.tableHead[parament.headerArray[data.activeTabIndex][i]]);
      }
      data.selectedRowKeys = [];
      data.search.status = data.activeTabIndex;
      data.column = tableHeader;
    }

    //获取安装人员列表
    const getInstallWorker = async () => {
      const { obj } = await API.pageInstallWorker();
      data.installWorkerList = obj;
    }

    // 查看 修改 新建工单功能
    const showData = (record:any, type:string) => {
      data.modalVisible = true;
      data.modalType = type;
      data.modalItem = record;
    }
    return {
      toMonitorCenter,
      changeTableHeader,
      onSearch,
      onExport,
      getStatusStr,
      installWokerChange,
      handleSelectionChange,
      showData,
      workSheetHandOk,
      selectTabs,
      currentChange,
      confirmData,
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
@import "../../../dataReport/module/css/index";
@import "./index.less";
</style>
