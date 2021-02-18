<template>
  <a-modal
    title="转移详情"
    :maskClosable="false"
    @ok="handleOk"
    width="600px"
    class="customNoRechargeOk"
  >
  <template #footer class="foot">
    <div class="footer__left">
      <div class="row">
        <label>成功：<span class="success">{{successNum}}</span>台</label>
        <label>无权限：<span class="error">{{noPermission}}</span>台</label> 
        <label>无设备：<span class="error">{{nonexistent}}</span>台</label>
      </div>
    </div>
    <div class="footer__right">
      <a-button key="back" @click="handleBack">
        返回
      </a-button>
      <a-button key="submit" type="primary" @click="handleOk">
        确认
      </a-button>
    </div>
  </template>
  <el-table
    :data="tableData"
    border
    style="width: 100%"
    height="400"
    >
    <el-table-column
      prop="terminalNo"
      label="设备号">
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态">
      <template #default="{ row }">
        <span :class="row.class">{{row.status}}</span>
      </template>
    </el-table-column>
  </el-table>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent,reactive, toRefs,watch, h} from "vue";
import API from "@/api/manageData";
export default defineComponent({
  name: "carCustomNoRechargeOkModal",
  props: {
    item:{
      type: Object,
      default: {
        noPermission: [],
        nonexistent: [],
        success: []
      }
    }
  },
  setup(props, { emit }) {
    const data = reactive({
      tableData: <any>[],
      successNum: 0,
      noPermission: 0,
      nonexistent: 0,
    });
    const handleOk = () => {
      emit("update:visible", false);
    }
    const handleBack = () => {
      emit("update:visible", false);
    }
    watch(()=>props.item,(value)=>{
      data.tableData = [];
      if(value.success !== undefined){
        value.success.forEach((dataItem:any)=>{
          data.tableData.push({terminalNo:dataItem,status:'成功',class:'success'});
        });
        data.successNum = value.success.length;
      }
      if(value.noPermission !== undefined){
        value.noPermission.forEach((dataItem:any)=>{
          data.tableData.push({terminalNo:dataItem,status:'没权限',class:'error'});
        });
        data.noPermission = value.noPermission.length;
      }
      if(value.nonexistent !== undefined){
        value.nonexistent.forEach((dataItem:any)=>{
          data.tableData.push({terminalNo:dataItem,status:'无设备',class:'error'});
        });
        data.nonexistent = value.nonexistent.length
      }
    });
    return {
      handleOk,
      handleBack,
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less">
.customNoRechargeOk{
  .ant-modal-footer{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    line-height: 32px;
    .row{
      font-weight: 500;
      label{
        margin-right:10px;
      }
    }
  }
  .error{
    color:#DF2B2B;
  }
  .success{
    color:#1AB42E;
  }
}
</style>