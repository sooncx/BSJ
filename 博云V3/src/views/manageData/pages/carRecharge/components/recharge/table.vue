<template>
  <div class="table detailTable" ref="tableBox">
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      style="width: 100%;position:absolute;"
      :height="offsetHeightTable"
      @selection-change="handleSelectionChange"
      border
      size="small"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="groupName" label="所属车组" align="center" width="120"></el-table-column>
      <el-table-column prop="plate" label="车牌号" align="center" width="180"></el-table-column>
      <el-table-column prop="terminalNo" align="center" label="设备号"></el-table-column>
      <el-table-column prop="sim" align="center" label="SIM卡"></el-table-column>
      <el-table-column prop="activationTme" align="center" label="激活时间" width="150"></el-table-column>
      <el-table-column prop="state" align="center" label="状态">
        <template #default="{ row }">
          {{ getStatusStr(row.state) }}
        </template>
      </el-table-column>
      <el-table-column prop="vehState" align="center" label="车辆状态"></el-table-column>
      <el-table-column prop="displayYear" align="center" label="续费年限"></el-table-column>
      <el-table-column prop="installDate" align="center" width="150" label="安装时间"></el-table-column>
      <el-table-column prop="expireDate" align="center" width="150" label="到期时间"></el-table-column>
      <el-table-column v-if="activeVisible" align="center" prop="button" label="操作">
        <template #default="scope">
          <div class="setting" v-if="scope.row.expireDate !== undefined">
            <span @click="carRecharge(scope.row)">续费</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts">
import { defineComponent, toRefs,reactive,nextTick  } from "vue";
export default defineComponent({
  components: {
  },
  props:{
    tableData:{
      type: Array as any
    },
    tableLoading:{
      type: Boolean,
      default: false,
    },
    activeVisible: {
      type: Boolean,
      default: true,
    }
  },
  setup(props,{emit}){
    const data = reactive({
      tableBox: <any>null,
      offsetHeightTable: <any>null
    });
    nextTick(() => {
      data.offsetHeightTable = data.tableBox.offsetHeight;
    });
    // 返回状态字符串
    const getStatusStr = (status:number) => {
      return status === 1 ? '已过期' : status === 0 ? '正常'  : '不续费';
    }

    // 续费
    const carRecharge = (item:any) => {
      emit('carRecharge', item);
    }

    // 多选功能
    const handleSelectionChange = (item: any) => {
      emit('handleSelectionChange', item);
    }
    return {
      handleSelectionChange,
      getStatusStr,
      carRecharge,
      ...toRefs(data)
    }
  }
})
</script>
<style lang="less" scoped>
@import "../../../../../dataReport/module/css/index";
.table{
  flex:1;
  position: relative;
}
</style>