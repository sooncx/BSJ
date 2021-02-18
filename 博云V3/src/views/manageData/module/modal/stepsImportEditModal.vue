<template>
  <a-modal v-model:visible="showVisible" :maskClosable="false" width="550px" :title="title" @ok="handleOk">
    <template #footer>
      <a-button key="back" @click="handleBack">
        返回
      </a-button>
      <a-button key="submit" type="primary" :loading="modalLoading" @click="handleOk">
        保存
      </a-button>
    </template>
    <a-form :model=form ref="ruleForm" class="modelsff" >
      <div class="row">
        <a-form-item label="车牌号" >
          <a-input  v-model:value="form.plate" />
        </a-form-item>
      </div>
      <div class="row">
        <a-form-item label="SIM" >
          <a-input  v-model:value="form.sim" />
        </a-form-item>
      </div>
      <div class="row">
        <a-form-item label="设备号" >
          <a-input  v-model:value="form.terminalNo" />
        </a-form-item>
      </div>
      <div class="row">
        <a-form-item label="设备类型" >
          <a-select
            v-model:value="form.terminalType"
            allowClear
          >
            <a-select-option v-for="(item,index) in vehTypes" :key="index" :value="item" >
              {{item}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </div>
      <div class="row">
        <a-form-item label="错误原因" >
          <a-input  value="设备号在表格中跟第3行中重复" disabled />
        </a-form-item>
      </div>
    </a-form>
  </a-modal>
</template>
<script lang="ts">
import { defineComponent,ref,reactive,toRefs,PropType,watch,nextTick, computed } from "vue";
import API from "@/api/manageData";
import { ElMessage } from 'element-plus';
import { useStore } from "vuex";
export default defineComponent({
  name: 'stepsImportEditModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    dataItem: {
      type: Object as any
    }
  },
  setup(props, {emit}) {
    const store = useStore();
    const data = reactive({
      modalVisible: false,
      modalLoading: false,
      ruleForm: null as any,
      form: {
        plate: '',
        sim: '',
        terminalNo: '',
        terminalType: '',
      },
      title: '修改错误信息',
      vehTypes: store.state.vehTypes
    });

    const showVisible = computed({
      get: () => props.visible,
      set: (val) => {
        emit("update:visible", val);
      },
    });

    watch(()=>props.visible,(value:any)=>{
      nextTick(()=>{
        data.form.plate = props.dataItem.plate;
        data.form.sim = props.dataItem.sim;
        data.form.terminalNo = props.dataItem.terminalNo;
        data.form.terminalType = props.dataItem.terminalType;
      })
    });
    const handleOk = async () => {
      const info = {
        plate: data.form.plate,
        sim: data.form.sim,
        terminalNo: data.form.terminalNo,
        terminalType: data.form.terminalType,
      }
      emit("stepsImportEditOk",info);
      emit("update:visible", false);
    }
    const handleBack = () => {
      emit("update:visible", false);
    }
    return {
      showVisible,
      handleOk,
      handleBack,
      ...toRefs(data),
    }
  },
});
</script>
<style lang="less" scoped>

.modelsff {
  .row{
    display: flex;
    flex-wrap: wrap;
    input,textarea{
      width: 400px;
    }
    .ant-form-item-label > label{
      color:#333333;
    }
    .ant-form-item{
      justify-content: flex-end;
    }
  }
}
::v-deep(.ant-form-item-label){
  width: 70px;
}
::v-deep(.ant-form-item-label > label){
  
  color:#333333;
}
</style>