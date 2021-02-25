<template>
  <a-modal
    :title="titleSlot"
    v-model:visible="show"
    :maskClosable="false"
    width="600px"
    class="customNoRecharge"
  >
  <template #footer>
      <a-button key="back" @click="handleBack">
        返回
      </a-button>
      <a-button key="submit" type="primary" @click="customNoRechargeHandleOk">
        确认
      </a-button>
  </template>
    <a-textarea
      v-model:value="devNo"
      :rows="6"
    />
  </a-modal>
</template>

<script lang="ts">
import { defineComponent,reactive, toRefs,watch, h,computed} from "vue";
import API from "@/api/manageData";
import { ElMessage } from 'element-plus';
export default defineComponent({
  name: "carCustomNoRechargeModal",
  props: {
    // 窗口类型 自定义不续费 | 自定义不续费转出 | 自定义续费
    customNoRechargeType: {
      type: Number,
      default: 0
    },
    // 显示状态
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      customNoRechargeConfirmLoading: false,
      title: '',
      tip: '请输入设备号，并用英文逗号或者换行隔开！',
      titleSlot: () => {
        return h('div',{},[
          h('label',data.title),
          h('span',data.tip)
        ])
      },
      devNo: '',
    });

    // 自定义续费功能
    async function customBatchRecharge(){
      if(!data.devNo) ElMessage.error('请填写设备号');
      emit('customBatchRechargeOk',data.devNo);
      emit("update:visible", false);
    }

    const show = computed({
      get: () => props.visible,
      set: (val) => {
        emit("update:visible", val);
      },
    });

    async function customNoRechargeHandleOk(){
      // 判断是否自定义续费
      if(props.customNoRechargeType === 3){
        customBatchRecharge();
        return;
      }
      data.customNoRechargeConfirmLoading = true;
      const info = {
        terminalNos: data.devNo,
        isState: props.customNoRechargeType === 1 ? 2 : 0
      }
      try{
        if(!info.terminalNos) throw '请填写设备号';
        info.terminalNos = info.terminalNos.replace(/\r\n/g,",").replace(/\n/g,",")
        const { obj,flag,msg } = await API.batchTransferState(info);
        if(flag !== 1) throw msg;
        emit('customNoRechargeOk',obj.data);
        emit("update:visible", false);
      }catch(error){
        ElMessage.error(error);
      }
      data.customNoRechargeConfirmLoading = false;
    }

    const handleBack = () => {
      emit("update:visible", false);
    }

    watch(()=>props.visible,()=>{
      switch(props.customNoRechargeType){
        case 1:
          data.title = '自定义不续费';
          break;
        case 2:
          data.title = '自定义不续费转出';
          break;
        case 3:
          data.title = '自定义续费';
      }
      data.devNo = '';
    });
    return {
      customNoRechargeHandleOk,
      handleBack,
      show,
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less">
.customNoRecharge{
  .ant-modal-title div span{
    color:#999999 !important;
    font-size: 12px;
    margin-left:10px;
  }
}
</style>