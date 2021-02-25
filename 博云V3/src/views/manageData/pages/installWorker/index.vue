<template>
  <div class="content">
    <div class="header">
      <div class="header__left">
        <a-button type="primary" @click="showData(null,'add')">新建人员</a-button>
        <a-button @click="deleteData(null)">批量删除</a-button>
      </div>
      <div class="header__right">
        <a-input v-model:value="search.name" placeholder="请输入安装人员名称"></a-input>
        <SelectDate v-model:value="rangeDate" dateType="date" />
        <a-button type="primary" @click="onSearch">
          <template #icon><i class="iconfont icon icon-sousuo"></i></template>
          查询</a-button>
      </div>
    </div>
    <div class="body">
      <div class="body__table detailTable" ref="tableBox">
        <el-table
          :data="tableData"
          v-loading="tableLoading"
          style="width: 100%;position:absolute;"
          :height="offsetHeight"
          @selection-change="handleSelectionChange"
          size="small"
          border
        >
          <el-table-column align="center" type="selection" prop="序号" width="55"></el-table-column>
          <el-table-column align="center" prop="name" label="姓名"></el-table-column>
          <el-table-column align="center" prop="phone" label="联系方式"></el-table-column>
          <el-table-column align="center" prop="createTime" label="加入日期"></el-table-column>
          <el-table-column align="center" prop="username" label="账号"></el-table-column>
          <el-table-column align="center" prop="password" label="密码"></el-table-column>
          <el-table-column align="center" prop="allCounts" label="订单数">
            <template #default="scope">
              <span class="orderNumber" @click="goWorkSheet('workSheet',scope.row)">{{scope.row.allCounts}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="confirmCounts" label="待确认订单数">
            <template #default="scope">
              <span class="orderNumber" @click="goWorkSheet('confirmCounts',scope.row)">{{scope.row.confirmCounts}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="processiveCounts" label="待安装订单数">
            <template #default="scope">
              <span class="orderNumber" @click="goWorkSheet('processiveCounts',scope.row)">{{scope.row.processiveCounts}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="remark" label="备注"></el-table-column>
          <el-table-column align="center" prop="button" label="操作">
            <template #default="scope">
              <div class="setting">
                <span @click="showData(scope.row,'edit')">修改</span>
                <span @click="deleteData(scope.row);">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
    <installWorkerModal v-bind="$attrs" @installWorkerHandOk="installWorkerHandOk" v-model:visible="modalVisible" :dataItem="modalItem" :type="modalType"></installWorkerModal>
  </div>
</template>

<script lang="ts">
import { defineComponent,toRefs,nextTick,ref,reactive } from "vue";
import { installWorkerModal } from "@/views/manageData/module/index";
import SelectDate from "@/views/manageData/module/src/SelectDate.vue";
import API from "@/api/manageData";
import { Modal  } from 'ant-design-vue';
import { ElMessage } from 'element-plus';
import router from "@/router";
export default defineComponent({
  components: {
    installWorkerModal,
    SelectDate
  },
  setup() {
    const data = reactive({
      search:{ 
        name: '',                             // 搜索安装人员名字
        pageSize: 0, 
        pageNumber: 0,
        startTime: '',                        // 开始时间
        endTime: '',                          // 结束时间
      },
      rangeDate: [],                          // 日期选择值
      tableData : <any>[],                    // 表格数据
      pagination :{                           // 分页配置
        showTotal: (total:string) => `共 ${total} 条数据`,  // 显示总数
        showSizeChanger: true,                // 是否允许选中 指定数量
        pageSize: 40,                         // 分页数量
        total: 0,
        current:1,
        pageSizeOptions: ['40','60','80','100'], //指定数量
      },
      modalVisible: false,                    // 窗口显示状态
      modalType: '',                          // 窗口显示类型 新增或修改
      modalItem: null,                        // 窗口默认内容
      tableSelectsData: <any>[],              // 表格多选值
      tableLoading: false,                    // 表格Loding
      tableBox: <any>null,
      offsetHeight: <any>null,
    });

    // 获取数据
    const getData = async () => {
      data.tableLoading = true;
      data.tableData = [];
      try {
        data.search.pageSize = data.pagination.pageSize;
        data.search.pageNumber = data.pagination.current;
        data.search.startTime = data.rangeDate[0];
        data.search.endTime = data.rangeDate[1];
        const { obj,flag,msg } = await API.pageInstallWorkerListByCondition(data.search);
        if(flag !== 1) throw msg;
        data.pagination.total = obj.total;
        data.tableData = obj.data;
      } catch (error) {
        ElMessage.error(error);
      }
      data.tableLoading = false;
    }

    // 搜索功能
    const onSearch = () => {
      data.pagination.current = 1;
      getData();
    }

    // 窗口回调成功
    const installWorkerHandOk = () => {
      ElMessage.success('添加/修改成功');
      getData();
    }

    // 分页功能
    const currentChange = (page: number, pageSize: number) => {
      data.pagination.current = page;
      data.pagination.pageSize = pageSize;
      getData();
    };

    // 表格多选
    const handleSelectionChange = (item:Array<Object>) => {
      data.tableSelectsData = item;
    }

    // 删除数据
    const deleteData = (record:any) => {
      // 判断是否选择表格数据
      if(record === null && data.tableSelectsData.length === 0){
        ElMessage.error('请在表格中选择需要删除的安装人员');
        return false;
      }
      Modal.confirm({
        title: '删除人员',
        content: '是否删除该安装人员（该操作不可逆）？',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          if(record === null){
            deleteInstallWorkers();         // 批量删除
          }else{
            deleteInstallWorker(record);    // 单个删除
          }
          setTimeout(()=>{
            getData()
          },500);
        }
      });
    }
    // 批量删除功能
    const deleteInstallWorkers = async () => {
      let userIds = '';
      data.tableSelectsData.forEach((item:any)=>{
        userIds += item.userId + ','
      });
      try {
        const { flag,msg } = await API.deleteInstallWorkers({userIds:userIds.substring(0,userIds.length-1)});
        if(flag !== 1) throw msg;
        ElMessage.success('删除成功');
        getData();
      } catch (error) {
        ElMessage.error(error);
      }
    }

    // 单独删除功能
    const deleteInstallWorker = async (item:any) => {
      try {
        const { flag,msg } = await API.deleteInstallWorker({userId:item.userId});
        if(flag !== 1) throw msg;
        ElMessage.success('删除成功');
        getData();
      } catch (error) {
        ElMessage.error(error);
      }
    }

    // 显示
    const showData = (record:any, type:string) => {
      data.modalVisible = true,
      data.modalType = type;
      data.modalItem = record;
    }

    nextTick(() => {
      getData();
      data.offsetHeight = data.tableBox.offsetHeight;
    });

    // 跳转到工单页面
    const goWorkSheet = (type:string,item:any) => {
      router.push({
        name: "workSheet",
        params: {
          type,
          installWorkerId:item.userId,
          installWorkerName:item.name
        },
      });
    }
    return {
      goWorkSheet,
      showData,
      onSearch,
      deleteData,
      installWorkerHandOk,
      currentChange,
      handleSelectionChange,
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
@import "../../../dataReport/module/css/index";
.content{
  height: 100%;
  width: 100%;
  background-color: white;
  display: flex;
  flex-direction:column;
  .header{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 15px;
    &__left,&__right{
      display: flex;
      flex-wrap: wrap;
    }
    &__left button:first-child{
      margin-left: 0px;
    }
    input{
      width: 200px;
      margin-right:8px;
    }
    button{
      margin-left: 8px;
    }
  }
  .body{
    flex:1;
    display: flex;
    flex-direction:column;
    &__table{
      flex:1;
      position: relative;
      border: 1px solid #e8e8e8;
      .orderNumber{
        cursor: pointer;
        color:#0E60DB;
      }
    }
    &__page{
      padding: 10px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
