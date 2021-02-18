<template>
  <div class="content">
    <!-- 头部功能  -->
    <div class="content__header">
      <div class="content__header__left">
        <a-button type="primary" @click="carMove('all')">车辆转移</a-button>
        <a-button type="primary" @click="carMove('select')">转移选中项</a-button>
        <a-button type="primary" @click="customDelete()">自定义删除</a-button>
      </div>
      <div class="content__header__right">
        <a-button @click="onExport">
          <template #icon><i :class="['iconfont', 'icon', 'icon-daochu']"></i></template>
          导出
        </a-button>
      </div>
    </div>
    <!-- 车辆功能 -->
    <div class="content__body">
      <!-- 车辆树 -->
      <div class="content__left">
        <carTree></carTree>
      </div>
      <!-- 车辆表格 -->
      <div class="content__table">
        <carTable ref="carTableRef" :selectTreeDataProvide="selectTreeDataProvide" @moveCar="carMove" @selectionChange="selectionChange"></carTable>
      </div>
    </div>
    <!-- 车辆转移 -->
    <carMoveModal
    v-bind="$attrs" 
    v-model:visible="carMoveModalVisible" 
    @carMoveModalHandleOk="carMoveModalHandleOk" 
    v-model:dataItem="carMoveDataItem" 
    :modalType="modalType"></carMoveModal>
    <!-- 自定义删除 -->
    <carDeleteCustomModal 
    v-bind="$attrs"
    v-model:visible="modalVisible"
    @carDeleteCustomModalHandleOK="carDeleteCustomModalHandleOK"
    ></carDeleteCustomModal>
    <!-- 自定义删除  提交数据成功后 显示结果的表格 -->
    <carCustomNoRechargeOkModal
    v-bind="$attrs"
    v-model:visible="carCustomNoRechargeOkVisible"
    :item="carDeleteCustomOkRes"
    ></carCustomNoRechargeOkModal>
  </div>
</template>
<script lang="ts">
import { defineComponent,ref,toRefs,provide,reactive,watch } from "vue";
import carTree from "./components/carTree/index.vue";
import carTable from "./components/carTable/index.vue";
import { ElMessage } from 'element-plus';
import API from "@/api/manageData";
import { carCustomNoRechargeOkModal } from "@/views/manageData/module/index";
import { carDeleteCustomModal,carMoveModal } from "../../module/index";
export default defineComponent({
  components: {
    carTree,
    carCustomNoRechargeOkModal,
    carTable,
    carDeleteCustomModal,
    carMoveModal
  },
  setup() {
    const data = reactive({
      modalVisible: false,
      modalType: 'all',  // 车辆转移类型
      carMoveDataItem: {
        terminalNo: '',
        vehicleId: '',
        groupId: <any>'',
        list: ''
      },
      carMoveModalVisible: false,
      selectionChangeValue: [],
      carMoveModal:ref<any>(null),
      carTableRef: <any>null,
      carDeleteCustomOkRes: null,
      carCustomNoRechargeOkVisible: false,
      carDeleteCustomModal:ref<any>(null),
      selectTreeDataProvide: <any>{},
    });

    // 表格勾选车辆回调方法
    const selectionChange = (item:any) =>{
      data.selectionChangeValue = item;
    }
    // 自定义显示功能
    const customDelete = () => {
      data.modalVisible = true;
    }
    // 车辆转移
    const carMove = (type:string, item:any=null) => {
      data.modalType = type;
      //判断是否有选择数据
      if(data.modalType === 'select' && data.selectionChangeValue.length === 0){
        ElMessage.error('请勾选车辆');
        return false;
      }
      // data.modalVisible = true;
      if(item !== null){
        data.carMoveDataItem = {
          terminalNo: item.terminalNo,
          vehicleId: item.vehicleId,
          groupId: data.selectTreeDataProvide.gi,
          list: '',
        }
      }
      if(item === null){
        let ids = '';
        data.selectionChangeValue.forEach((item:any)=>{
          ids += item.terminalNo + ','
        });
        data.carMoveDataItem = {
          terminalNo: '',
          vehicleId: '',
          groupId: '',
          list: ids.substring(0,ids.length-1),
        }
      }
      data.carMoveModalVisible = true;
    }
    // 车辆转移提交成功回调
    const carMoveModalHandleOk = () => {
      setTimeout(()=>{
        data.carTableRef.getData();
      },500)
    }
    //自定义删除提交成功返回值
    const carDeleteCustomModalHandleOK = (obj: any) => {
      data.carDeleteCustomOkRes = obj;
      data.carCustomNoRechargeOkVisible = true;
    }

    // 更新车辆表格
    const updateSelectTreeData = (val: any) => {
      data.selectTreeDataProvide = val;
    };
    provide("updateSelectTreeData", updateSelectTreeData);

    // 导出数据
    const onExport = () =>{
      if(data.selectTreeDataProvide && data.selectTreeDataProvide.gi){
        API.exportVehicleByGroupRds({groupId:data.selectTreeDataProvide.gi});
      }else{
        ElMessage.error('请选择车组');
      }
    }

    return {
      onExport,
      carMove,
      carDeleteCustomModalHandleOK,
      carMoveModalHandleOk,
      customDelete,
      selectionChange,
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
@import "./index.less";
</style>