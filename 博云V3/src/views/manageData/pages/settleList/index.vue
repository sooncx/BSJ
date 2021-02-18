<template>
  <div class="content">
    <div class="content__header">
      <carRechargeHeader :headerAppend="headerAppend"></carRechargeHeader>
    </div>
    <div class="content__body">
      <div class="content__body__search">
        <div class="content__body__search__left">
          <div class="item">
            <label>车辆车组</label>
            <div class="group">
              <VehGroupSelect v-model:value="search.VehGroup" />
            </div>
          </div>
        </div>
        <div class="content__body__search__right">
          <a-button type="primary" @click="onSearch">
            <template #icon><i class="iconfont icon icon-sousuo"></i></template>搜索
          </a-button>
          <a-button @click="onExport">
            <template #icon><i class="iconfont icon icon-daochu"></i></template>导出
          </a-button>
        </div>
      </div>
      <div class="content__body__table">
        <div class="table detailTable" ref="tableBox">
          <el-table
            v-loading="tableLoading"
            :data="tableData"
            style="width: 100%;position:absolute;"
            :height="offsetHeight"
            border
            size="small"
          >
            <el-table-column
              prop="plate"
              align="center"
              label="车牌号">
            </el-table-column>
            <el-table-column
              prop="groupName"
              align="center"
              label="车组名称">
            </el-table-column>
            <el-table-column
              prop="frameNo"
              align="center"
              label="车架号">
            </el-table-column>
            <el-table-column
              prop="sim"
              align="center"
              label="SIM卡号">
            </el-table-column>
            <el-table-column
              prop="settleTime"
              align="center"
              label="结清时间">
            </el-table-column>
            <el-table-column
              prop="button"
              align="center"
              label="操作">
              <template #default="scope">
                <div class="setting">
                  <span @click="back(scope.row)">结清撤回</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page">
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
    </div>
    <!-- 结清撤回弹窗 -->
    <carSettleListModal :vehicleId="vehicleId" @settlementConfirm="onSearch" v-model:visible="carSettleListModalVisible"></carSettleListModal>
 
  </div>
</template>
<script>
import { defineComponent,toRefs,ref,nextTick,defineAsyncComponent } from "vue";
import { carRechargeHeader,carSettleListModal } from "../../module/index";
import { VehGroupSelect } from "@/components/VehGroup/index";
import { data,currentChange,back,getData,onSearch,onExport } from "./index";
export default defineComponent({
  components: {
    carRechargeHeader,
    carSettleListModal,
    VehGroupSelect,
  },
  setup() {
    const tableBox = ref(null);
    const offsetHeight = ref();
    nextTick(() => {
      getData();
      offsetHeight.value = tableBox.value.offsetHeight;
    });
    return {
      tableBox,
      back,
      offsetHeight,
      onSearch,
      onExport,
      currentChange,
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
@import "../../../dataReport/module/css/index";
@import "./index.less";
</style>
