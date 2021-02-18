<template>
  <div class="carContent">
    <div class="carTable detailTable" ref="tableBox">
      <el-table
        :data="tableData"
        v-loading="tableLoading"
        @selection-change="handleSelectionChange"
        :height="offsetHeight"
        border
        size="small"
        ref="refTable"
        :row-class-name="(e) => tableRowClassName(e)"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="plate" label="车牌号" align="center"></el-table-column>
        <el-table-column prop="sim" align="center" label="SIM卡号"></el-table-column>
        <el-table-column prop="terminalNo" align="center" label="设备号"></el-table-column>
        <el-table-column prop="terminalType" align="center" label="设备类型"></el-table-column>
        <el-table-column prop="frameNo" align="center" label="车架号"></el-table-column>
        <el-table-column prop="mac" align="center" label="MAC"></el-table-column>
        <el-table-column prop="nowRemark" align="center" label="备注"></el-table-column>
        <el-table-column prop="installDate" align="center" label="添加时间"></el-table-column>
        <el-table-column prop="formatTime" align="center" label="车辆状态">
          <template #default="scope">
            {{getVehicleStatus(scope.row.vehicleStatus,scope.row.formatTime)}}{{scope.row.formatTime}}
          </template>
        </el-table-column>
        <el-table-column prop="gpsTime" align="center" label="最后在线时间"></el-table-column>
        <el-table-column prop="button" label="操作" align="center" width="150">
          <template #default="scope">
            <div class="setting">
              <span @click="moveCar(scope.row)">转移</span>
              <span @click="edit(scope.row)">修改</span>
              <span v-if="checkDeleteCar()" @click="deleteCar(scope.row)">删除</span>
              <span v-if="scope.row.EP !== undefined " @click="carRecharge(scope.row)">续费</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="cartPager">
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
    <!-- 车辆续费 -->
    <carRechargeModal
      v-model:visible="carRechargeModelVisible"
      v-model:vehInfo="vehInfo"
      @submitData="getData"
      :dataItem="carRechargeData"
    ></carRechargeModal>
    <!-- 新增车辆 -->
    <VehDialog
      v-model:visible="VehDialogVisible"
      v-model:vehInfo="vehInfo"
      @editOk="getData"
      type="update"
    />
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  toRefs,
  nextTick,
  reactive,
  watch,
  defineAsyncComponent,
  createVNode,
} from "vue";
import { carRechargeModal } from "../../../../module/index";
import { Modal  } from 'ant-design-vue'; 
import API from "@/api/manageData";
import store from "@/store/index";
import { ElMessage } from 'element-plus';
export default defineComponent({
  components: {
    carRechargeModal,
    VehDialog: defineAsyncComponent(
      () =>
        import("../../../../../monitorCenter/LeftContent/dialog/VehDialog.vue")
    ),
  },
  props: {
    selectTreeDataProvide: {
      type: Object as any,
      default: null
    }
  },
  setup(props, { emit }) {
    const data = reactive({
      tableData: <any>[],                                   // 表格数据
      addUserVisible: false,                                // 显示添加用户弹层
      pagination: {                                         // 分页配置
        showTotal: (total: string) => `共 ${total} 条数据`,  // 显示总数
        showSizeChanger: true,                              // 是否允许选中 指定数量
        pageSize: 40,                                       // 分页数量
        total: 0,
        current: 1,
        pageSizeOptions: ['40', '60', '80', '100'],         // 指定数量
      },
      carRechargeModelVisible: false,                       // 车辆续费弹窗显示
      VehDialogVisible: false,                              // 车辆修改显示
      vehInfo: null,                                        // 车辆详情
      tableLoading: false,
      carRechargeData: <any>[],                             // 车辆续费数据
      jumpKey: 0,                                           // 滚动指定行数
      tableBox: <any>null,
      offsetHeight: <any>null,
      refTable: <any>null,
    });
    // 修改
    const edit = (item: object) => {
      data.vehInfo = { ...item, V:(item as any).vehicleId } as any;
      data.VehDialogVisible = true;
    }
    // 转移
    const moveCar = (item: any) => {
      emit("moveCar", "table", item);
    };
    nextTick(() => {
      data.offsetHeight = data.tableBox.offsetHeight;
    });
    // 选择车辆
    const handleSelectionChange = (item: any) => {
      emit("selectionChange", item);
    };

    // 高亮搜索的行
    const tableRowClassName = (e:any) => {
      if(e.rowIndex === data.jumpKey - 1){
        return 'warning-row';
      }
    }
    // 获取表格数据
    const getData = async () => {
      data.tableLoading = true;
      data.jumpKey = 0;
      data.tableData = [];
      try {
        // 判断是否有车辆ID 搜索定位车辆分页的
        if(data.pagination.current === 1 && props.selectTreeDataProvide.vehicleId !== undefined){
          const { obj, flag, msg } = await API.getLocationData({
            vehicleId:props.selectTreeDataProvide.vehicleId,
            pageSize:data.pagination.pageSize
          });
          if(flag !== 1){
            throw msg
          }
          data.pagination.current = obj.data.pageNumber;
          data.jumpKey = obj.data.jump;
        }
        const { obj,flag,msg } = await API.listVehicleByGroupRds({
          groupId:props.selectTreeDataProvide.gi,
          pageSize: data.pagination.pageSize,
          pageNumber: data.pagination.current
        });
        if(flag !== 1){
          throw msg
        }
        data.tableData = obj.data;
        data.pagination.total = obj.total;
        setTimeout(()=>{
          const jumpRow = document.getElementsByClassName('warning-row')[0];
          jumpRow && jumpRow.scrollIntoView();
        },500);
      } catch (error) {
        ElMessage.error(error);
      }
      data.tableLoading = false;
    }

    // 续费
    const carRecharge = (item: any) => {
      data.carRechargeModelVisible = true;
      data.carRechargeData = [];
      data.carRechargeData.push({
        expireTime: item.EP,
        NOW: item.NOW,
        plate: item.plate,
        groupId: props.selectTreeDataProvide.gi,
        vehicleId: item.vehicleId
      });
    }
    
    // 删除
    const deleteCar = (item:any) => {
      Modal.confirm({
        title: '是否删除该设备？',
        content: createVNode('div', { style: 'color:red;' }, '重要提示：删除后，相关设备的数据将会被清空，例如轨迹、数据报表等！！！'),
        okText: '确定',
        cancelText: '取消',
        async onOk() {
          try {
            const { flag,msg } = await API.deleteVehicle({vehicleId:item.vehicleId,groupId:props.selectTreeDataProvide.gi});
            if(flag !== 1){
              throw msg
            }
            ElMessage.success('删除成功');
            setTimeout(()=>{
              getData();
            },500);
          } catch (error) {
            ElMessage.error(error);
          }
        }
      });
    }
    watch(()=>props.selectTreeDataProvide, ()=>{
      data.pagination.current = 1;
      getData()
    });
    // 分页功能
    const currentChange = (page: number, pageSize: number) => {
      data.pagination.current = page;
      data.pagination.pageSize = pageSize;
      getData();
    };

    //返回车辆状态
    const getVehicleStatus = (status:number,formatTime:string) => {
      if(formatTime === '从未上线'){
        return '';
      }
      switch(status){
        case 0:
          return '从未上线';
        case 1:
          return '行驶';
        case 2:
          return '停车';
        case 3:
          return '离线';
        default:
          return '已过期';
      }
    }
    // 判断当前用户是否有删除车辆的权限
    const checkDeleteCar = () => {
      return store.state.USER.checkVehicle === 0;
    }
    return {
      checkDeleteCar,
      tableRowClassName,
      getVehicleStatus,
      getData,
      moveCar,
      edit,
      deleteCar,
      handleSelectionChange,
      carRecharge,
      currentChange,
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
@import "./index.less";
@import "../../../../../dataReport/module/css/index";
</style>