<template>
  <div class="table">
    <!-- 表格  -->
    <div class="table_body detailTable" ref="tableBox">
      <el-table
        :data="tableAllData"
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
              <span @click="mode(scope.row,'show')">查看</span>
              <span v-if="scope.row.status === 3" @click="mode(scope.row,'complete')" >完成</span>
              <span v-if="scope.row.status < 3" @click="mode(scope.row,'edit')">修改</span>
              <span v-if="scope.row.status < 3 " @click="mode(scope.row,'cancel')">取消</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页功能 --> 
    <div class="table_page">
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
import { defineComponent,toRefs,reactive, nextTick,watch  } from "vue";
import router from "@/router";
export default defineComponent({
  components: {
  },
  props:{
    // 标签页索引
    activeTabIndex:{
      type: Number,
      default: 0
    },
    // 表格数据
    tableAllData: {
      type: Array as any,
    },
    // 分页总数
    total: {
      type: Number,
      default: 0
    },
    // 表格Loading
    tableLoading: {
      type: Boolean,
      default: false
    },
    // 分页数量
    pageSize: {
      type: Number,
      default: 0,
    },
    // 当前页
    pageNumber: {
      type: Number,
      default: 0
    }
  },
  setup(props,{emit}){

    // 不同的标签页对应不同的表格头
    const headerArray:any = {
      0: [0,1,2,10,11,12,3,4,5,6,7,8,9,13],       // 全部
      1: [0,1,3,4,5,6,8,9,13],                    // 待确认
      2: [0,1,2,3,4,5,6,8,9,13],                  // 待安装
      3: [0,1,2,10,3,4,5,6,8,9,13],               // 已安装
      4: [0,1,2,10,12,3,4,5,6,7,8,9,13],          // 已完成
      5: [0,1,11,3,4,5,6,9,13],                   // 已取消
    };
    
    // 表头数据源
    const tableHead = [
      { align: 'center', title: '创建时间',dataIndex: 'createTime',width: 165 },
      { align: 'center', title: '预安装时间',dataIndex: 'installTime',width: 165 },
      { align: 'center', title: '确认时间',dataIndex: 'confirmTime',width: 165 },
      { align: 'center', title: '工单状态',dataIndex: 'status',width: 90},
      { align: 'center', title: '安装人员',dataIndex: 'installWorkerName',width: 150 },
      { align: 'center', title: '车主',dataIndex: 'carOwner',width: 90 },
      { align: 'center', title: '车辆列表',dataIndex: 'carList',width: 210},
      { align: 'center', title: '安装位置',dataIndex: 'installPosition',width: 90},
      { align: 'center', title: '安装地点',dataIndex: 'address',width: 100 },
      { align: 'center', title: '设备号',dataIndex: 'terminalNo',width: 200},
      { align: 'center', title: '上传安装信息时间',dataIndex: 'installedTime',width: 165 },
      { align: 'center', title: '取消时间',dataIndex: 'cancelTime',width: 165 },
      { align: 'center', title: '完成时间',dataIndex: 'finishTime',width: 165 },
      { align: 'center', title: '备注',dataIndex: 'remark',width: 160 },
    ];

    const data = reactive({
      tableHead,                                // 表头
      headerArray,                              // 表头数据源
      pagination :{                             // 分页配置
        showTotal: (total:string) => `共 ${total} 条数据`,  // 显示总数
        showSizeChanger: true,                  // 是否允许选中 指定数量
        pageSize: 0,                            // 分页数量
        total: 0,
        current:0,
        pageSizeOptions: ['40','60','80','100'], // 指定数量
      },
      tableData : <any>[],                      // 表格数据
      column: <any>[],                          // 表头列
      offsetHeight: <any>null,
      tableBox: <any>null,
    });

     // 切换表头
    const changeTableHeader = () => {
      let tableHeader = [];
      data.tableData = [];
      for(let i=0; i< data.headerArray[props.activeTabIndex].length; i++){
        tableHeader.push(data.tableHead[data.headerArray[props.activeTabIndex][i]]);
      }
      data.column = tableHeader;
    }

    // 监听表格数据
    watch(()=>props.tableAllData,()=>{
      data.tableData = props.tableAllData;
      data.pagination.total = props.total;
      data.pagination.current = props.pageNumber;
      data.pagination.pageSize = props.pageSize;
    });
  
    nextTick(() => {
      data.offsetHeight = data.tableBox.offsetHeight;
      changeTableHeader();
    });

    // 监听标签页
    watch(()=>props.activeTabIndex,()=>{
      changeTableHeader();
    });
    
    // 表格多选数据
    const handleSelectionChange = (e:any) => {
      emit('selectionChange',e);
    }

    
    // 车辆跳转监控中心
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
    // 获取状态对应的文案和class
    const getStatusStr = (status:number, type:string) => {
      let typeStr = '';
      let titleStr = '';
      switch (status) {
        case 1:
          typeStr = 'warning';
          titleStr = '待确认';
          break;
        case 2:
          typeStr = 'error';
          titleStr = '待安装';
          break;
        case 3:
          typeStr =  'processing';
          titleStr = '已安装';
          break;
        case 4:
          typeStr = 'success';
          titleStr = '已完成';
          break;
        case 5:
          typeStr = 'default';
          titleStr = '已取消';
          break;
        case 6:
            typeStr = 'default';
            titleStr = '其他';
            break;
      }
      if(type === 'tag') return typeStr;
      return titleStr;
    }

    
    // 分页功能
    const currentChange = (page: number, pageSize: number) => {
      emit('currentChange',page,pageSize);
    };

    // 功能聚合
    const mode = (row:any,value:any) => {
      emit('type', value, row);
    }
    return {
      mode,
      currentChange,
      handleSelectionChange,
      getStatusStr,
      changeTableHeader,
      toMonitorCenter,
      ...toRefs(data),
    }
  }
})
</script>
<style lang="less" scoped>
@import "../../../dataReport/module/css/index";
.table{
  height: 100%;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  
  .table_body{
    width: 100%;
    flex:1;
    border: 1px solid #e8e8e8;
    position: relative;
    .workPlate{
      cursor: pointer;
      span{
        color:#0E60DB;
      }
    }
  }
  .table_page{
    text-align: right;
    padding: 10px;
  }
}
</style>