<template>
  <div class="carRecharge">
    <!-- 头部搜索 -->
    <div class="header">
      <headerTmp 
      @changeHighSearch="changeHighSearch"
      @onSearch="onSearch"
      ></headerTmp>
    </div>
    <div class="content" >
      <!-- 表格 -->
      <tableTmp
      ref="tableBoxRef"
      :tableData="tableData" 
      :tableLoading="tableLoading"
      :activeVisible="activeVisible"
      @handleSelectionChange="handleSelectionChange"
      @carRecharge="carRecharge"
      ></tableTmp>
      <!-- 分页 -->
      <pageTmp
      :renew="renew"
      :paginationData="pagination"
      @customNoRecharge="customNoRecharge"
      @currentChange="currentChange"
      @batchRecharge="batchRecharge"
      @batchIntoNoRecharge="batchIntoNoRecharge"
      ></pageTmp>
    </div>
    <!-- 续费窗口 -->
    <carRechargeModal 
    v-bind="$attrs" 
    @submitData="carRechargeModalSubmitData" 
    v-model:visible="carRechargeModelVisible" 
    :carRechargeNumber="carRechargeNumber" 
    :dataItem="selectTableItem"></carRechargeModal>
    <!-- 自定义续费 | 自定义不续费 | 自定不续费转出 -->
    <carCustomNoRechargeModal 
    v-bind="$attrs" 
    v-model:visible="customNoRechargeVisible" 
    :customNoRechargeType="customNoRechargeType"
    @customNoRechargeOk="customNoRechargeOk"
    @customBatchRechargeOk="customBatchRechargeOk"
    ></carCustomNoRechargeModal>
    <!-- 自定义续费 | 自定不续费转出  提交数据成功后 显示结果的表格 -->
    <carCustomNoRechargeOkModal
    v-bind="$attrs"
    v-model:visible="carCustomNoRechargeOkVisible"
    :item="customNoRechargeOkRes"
    ></carCustomNoRechargeOkModal>

  </div>
</template>
<script lang="ts">
import { defineComponent, toRefs,ref,nextTick,reactive  } from "vue";
import headerTmp from "./header.vue";
import API from "@/api/manageData";
import { ElMessage } from 'element-plus';
import { Modal } from 'ant-design-vue';
import tableTmp from './table.vue';
import pageTmp from './page.vue';
import { getgvids } from "@/views/manageData/module/src/function";
import { carRechargeModal,carCustomNoRechargeModal,carCustomNoRechargeOkModal } from "@/views/manageData/module/index";
export default defineComponent({
  components: {
    headerTmp,
    carRechargeModal,
    carCustomNoRechargeModal,
    carCustomNoRechargeOkModal,
    tableTmp,
    pageTmp
  },
  setup(props, { emit }) {
    const data = reactive({
      search: <any>null,
      tableData : <any>[],                        // 表格数据
      tableLoading:false,
      activeVisible: true,                        // 表格操作列是否显示
      renew: 0,                                   // 续费0 不续费1
      pagination: {
        current: 1,
        pageSize: 40,
        total: 0
      },
      customNoRechargeVisible: false,             // 自定义不续费 自定义转出 显示状态
      carRechargeModelVisible: false,             // 续费窗口 显示状态
      selectTableItem:<any>[],                    // 表格选中数据
      selectTableChange: <any>[],                 // 表格选中数据
      carRechargeNumber: 1,                       // 续费数量
      customNoRechargeType: 0,                    // 自定义类型 不续费或转出
      customNoRechargeOkRes: {                    // 自定义不续费 自定义转出 回调内容
        noPermission:[],                          // 无权限
        nonexistent: [],                          // 无设备
        success:[]                                // 成功
      },
      carCustomNoRechargeOkVisible:false,         // 自定义不续费 自定义转出 回调显示窗口
      tableBoxRef: <any>null,                      // 表格REF,
      checkResultData: '',
    });
    
    // 续费成功回调
    const carRechargeModalSubmitData = () => {
      getData(data.search);
      emit("uploadUserRecharge");
    }

    // 高级筛选 控制表格高度 动态
    const changeHighSearch = (value:any,searchHeight:any) => {
      if(value){
        data.tableBoxRef.offsetHeightTable -= searchHeight;
        return;
      }
      data.tableBoxRef.offsetHeightTable += searchHeight;
    }

    // 获取数据
    const getData = async (search:any) => {
      data.tableLoading = true;
      data.tableData = [];
      search.pageNumber = data.pagination.current;
      search.pageSize = data.pagination.pageSize;
      let time = search.expireTime;
      try {
        const { obj,msg,flag } = await API.pageVehicleExpire(search);
        if(flag !== 1) throw msg;
        // 判断多次请求 数据覆盖的
        data.checkResultData === time && (
          data.pagination.total = obj.total,
          data.tableData = obj.data,
          data.tableLoading = false
        )
      } catch (error) {
        ElMessage.error(error);
      }
    }

    const onSearch = (search:any,renew:any) => {
      // 判断是否续费
      if(renew === 1){
        data.activeVisible = false;
        data.renew = renew;
        data.tableData = [];
      }
      data.pagination.current = 1;
      data.search = search;
      data.checkResultData = data.search.expireTime;
      getData(data.search);
    }

    // 分页功能
    const currentChange = (page: number, pageSize: number) => {
      data.pagination.current = page;
      data.pagination.pageSize = pageSize;
      getData(data.search);
    };

    // 多选功能
    const handleSelectionChange = (item: any) => {
      data.selectTableChange = item;
    }

    // 批量续费
    const batchRecharge = () => {
      if(data.selectTableChange.length === 0){
        ElMessage.error('请选择车辆');
        return false;
      }
      data.carRechargeModelVisible = true;
      data.carRechargeNumber = data.selectTableChange.length;
      data.selectTableItem = [];
      data.selectTableChange.forEach((item:any) => {
        data.selectTableItem.push({
          NOW: item.NOW,
          terminalNo: item.terminalNo
        });
      })
    }

    // 批量转入不续费
    const batchIntoNoRecharge = () => {
      if(data.selectTableChange.length === 0){
        ElMessage.error('请选择车辆');
        return false;
      }
      Modal.confirm({
        title: '批量转入不续费',
        content: `确定将选中的${data.selectTableChange.length}辆车加入不续费列表？`,
        async onOk() {
          const info = {
            isState: 2,
            gvids: getgvids(data.selectTableChange)
          };
          try {
            const { flag,msg } = await API.batchVehicleStateRecharge(info);
            if(flag !== 1) throw msg;
            ElMessage.success('操作成功');
            getData(data.search);
          } catch (error) {
            ElMessage.error(error);
          }
        }
      });
    }

    // 自定义不续费
    const customNoRecharge = (type:number) => {
      data.customNoRechargeType = type;
      data.customNoRechargeVisible = true;
    }
    
    // 单个续费
    const carRecharge = (item:any) => {
      data.carRechargeModelVisible = true;
      data.carRechargeNumber = 0;
      data.selectTableItem = [];
      data.selectTableItem.push({
        expireTime: item.expireDate,
        plate: item.plate,
        NOW: item.NOW,
        groupId: item.groupId,
        vehicleId: item.vehicleId
      });
    }

    // 自定义续费提交成功返回值
    const customNoRechargeOk = (obj: any) => {
      data.customNoRechargeOkRes = obj;
      getData(data.search);
      data.carCustomNoRechargeOkVisible = true;
    }

    //自定义续费 回调
    const customBatchRechargeOk = (item:any) => {
      let ids = <any>[];
      item.split(',').forEach((value:any) => {
        value.split('\n').forEach((v:any) => {
          ids.push(v);
        });
      });
      data.selectTableItem = [];
      ids.forEach((value:any) => {
        if(value.length !== 0){
          data.selectTableItem.push({
            terminalNo: value
          });
        }
      });
      data.carRechargeModelVisible = true;
      data.carRechargeNumber = data.selectTableItem.length;
    }

    return {
      handleSelectionChange,
      customBatchRechargeOk,
      carRechargeModalSubmitData,
      getData,
      changeHighSearch,
      onSearch,
      customNoRechargeOk,
      carRecharge,
      currentChange,
      batchRecharge,
      batchIntoNoRecharge,
      customNoRecharge,
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
.carRecharge{
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  .content{
    display: flex;
    flex: 1;
    padding: 0 10px;
    flex-direction: column;
  }
}
</style>