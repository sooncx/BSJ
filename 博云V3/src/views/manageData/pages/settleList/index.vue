<template>
  <div class="content">
    <div class="content__header">
      <carHeader  :headerAppend="headerAppend"></carHeader>
    </div>
    <div class="content__body">
      <div class="content__body__search">
        <!-- 搜索 -->
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
        <!-- 表格 -->
        <div class="table detailTable" ref="tableBox">
          <el-table
            v-loading="tableLoading"
            :data="tableData"
            style="width: 100%;position:absolute;"
            :height="offsetHeight"
            border
            size="small"
          >
            <el-table-column prop="plate" align="center" label="车牌号"></el-table-column>
            <el-table-column prop="groupName" align="center" label="车组名称"></el-table-column>
            <el-table-column prop="frameNo" align="center" label="车架号"></el-table-column>
            <el-table-column prop="sim" align="center" label="SIM卡号"></el-table-column>
            <el-table-column prop="settleTime" align="center" label="结清时间"></el-table-column>
            <el-table-column prop="button" align="center" label="操作">
              <template #default="scope">
                <div class="setting">
                  <span @click="back(scope.row)">结清撤回</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
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
<script lang="ts">
import { defineComponent,toRefs,ref,nextTick,reactive } from "vue";
import { carHeader,carSettleListModal } from "../../module/index";
import API from "@/api/manageData";
import { ElMessage } from "element-plus";
import { VehGroupSelect } from "@/components/VehGroup/index";
import vehGroupType  from "@/components/VehGroup/src/type";
export default defineComponent({
  components: {
    carHeader,
    carSettleListModal,
    VehGroupSelect,
  },
  setup() {
    const data = reactive({
      search: {                                   // 搜索车辆
        VehGroup : <vehGroupType>{}
      },
      tableData : <any>[],                        // 表格数据
      pagination :{                               // 分页配置
        showTotal: (total:string) => `共 ${total} 条数据`,  // 显示总数
        showSizeChanger: true,                    // 是否允许选中 指定数量
        pageSize: 40,                             // 分页数量
        total: 0,
        current:1,
        pageSizeOptions: ['40','60','80','100'],  // 指定数量
      },
      carSettleListModalVisible: false,           // 车辆续费窗口显示状态
      tableLoading: false,                        // 表格Loading
      headerAppend: {                             // 页面顶部 结清数
        title:'结清数：',value: 0,icon: 'icon-wanjie',
      },
      vehicleId:0,                                // 车辆ID
    });

    // 获取数据
    const getData = async () => {
      data.tableLoading = true;
      data.tableData = [];
      try {
        const { obj,flag,msg } = await API.pageSettleList(checkSearch());
        if(flag !== 1) throw msg;
        data.tableData = obj.data;
        data.pagination.total = obj.total;
        data.headerAppend.value = data.pagination.total;
      } catch (error) {
        ElMessage.error(error);
      }
      data.tableLoading = false;
    }

    // 分页功能
    const currentChange = (page: number, pageSize: number) => {
      data.pagination.current = page;
      data.pagination.pageSize = pageSize;
      getData();
    };

    // 搜索前整合数据
    const checkSearch = () => {
      const info = {
        pageNumber: data.pagination.current,
        pageSize: data.pagination.pageSize,
        vehicleId: <number | string>'',
        groupId: <number | string>'',
      };
      // 判断是否有选择车辆
      if(data.search.VehGroup && data.search.VehGroup.flag !== undefined){
        info.groupId = data.search.VehGroup.groupId;
        // 判断 如果是车辆
        if(data.search.VehGroup.flag == 1){
          info.vehicleId = data.search.VehGroup.vehicleId;
        }
      }
      return info;
    }

    // 导出数据
    const onExport = () => {
      API.exportSettleList(checkSearch());
    }

    // 结清撤回
    const back = (item:any) => {
      data.vehicleId = item.vehicleId;
      data.carSettleListModalVisible = true;
    }

    // 搜索功能
    const onSearch = () => {
      data.pagination.current = 1;
      getData();
    }
    const tableBox = ref();
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
.content{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction:column;
  &__body{
    flex:1;
    background-color: white;
    display: flex;
    flex-direction:column;
    &__table{
      display: flex;
      flex: 1;
      padding: 0 10px;
      flex-direction: column;
      .table{
        flex:1;
        position: relative;
        border: 1px solid #e8e8e8;
      }
      .page{
        padding: 10px;
        display: flex;
        justify-content: flex-end;
      }
    }
    &__search{
      width: 100%;
      display: flex;
      line-height: 30px;
      justify-content: space-between;
      padding: 10px 17px;
      &__right button{
        margin-left: 8px;
      }
      .item{
        label{
          display: inline-block;
          margin-right:8px;
        }
        .group{
          display: inline-block;
        }
        display: flex;
        flex-wrap: wrap;
      }
    } 
  }
  &__header{
    background-color: white;
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    margin-bottom: 10px;
  }
}
</style>
