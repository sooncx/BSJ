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
import { defineComponent,toRefs,nextTick,ref } from "vue";
import { installWorkerModal } from "@/views/manageData/module/index";
import SelectDate from "@/views/manageData/module/src/SelectDate.vue";
import router from "@/router";
import { 
  data,
  currentChange,
  handleSelectionChange,
  showData,
  onSearch,
  getData,
  installWorkerHandOk,
  deleteData
} from "./index";
export default defineComponent({
  components: {
    installWorkerModal,
    SelectDate
  },
  setup() {
    const tableBox:any = ref(null);
    const offsetHeight = ref();
    nextTick(() => {
      getData();
      offsetHeight.value = tableBox.value.offsetHeight;  // 减去表头高度
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
      tableBox,
      offsetHeight,
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
@import "./index.less";
</style>
