<template>
  <a-modal v-model:visible="show" :maskClosable="false" class="carDeleteCustomModal" width="550px" title="自定义删除" @ok="handleOk">
    <template #footer>
      <a-button key="back" @click="handleBack">
        返回
      </a-button>
      <a-button key="submit" type="primary" :loading="modalLoading" @click="handleOk">
        确认
      </a-button>
    </template>
    <tipModal title="请输入需要删除的设备号，并用英文逗号或者换行隔开(最多5000条)"></tipModal>
    <a-textarea
      v-model:value="remark"
      :rows="8"
      placeholder=""
    />
  </a-modal>
</template>

<script lang="ts">
import { defineComponent,reactive, computed,toRefs,watch,} from "vue";
import { tipModal } from "@/views/manageData/module/index";
import API from "@/api/manageData";
import { ElMessage } from 'element-plus';
export default defineComponent({
  name: "carDeleteCustomModal",
  components:{
    tipModal
  },
  props: {
    // 显示状态
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      modalLoading: false,
      remark: '',
    });
    const show = computed({
      get: () => props.visible,
      set: (val) => {
        emit("update:visible", val);
      },
    });
    watch(
      () => props.visible,
      async (val) => {
        if (!val) return;
        data.remark = '';
      }
    );
    // 提交数据
    const handleOk = async () => {
      data.modalLoading = true;
      try{
        if(data.remark === '') throw '请输入设备号！！';
        // 将回车替换成逗号
        data.remark = data.remark.replace(/\r\n/g,",").replace(/\n/g,",")
        const { obj,flag,msg } = await API.batchDelVehicle({terminalNos:data.remark});
        if(flag !== 1) throw msg;
        emit('carDeleteCustomModalHandleOK',obj.data);
        emit("update:visible", false);
      }catch(error){
        ElMessage.error(error);
      }
      data.modalLoading = false;
    }
    // 返回数据
    const handleBack = () => {
      emit("update:visible", false);
    }
    return {
      show,
      handleOk,
      handleBack,
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.carDeleteCustomModal{
  .tip{
    width: 100%;
    height: 25px;
    line-height: 25px;
    margin-bottom: 10px;
    background-color: #e8f3ff;
    text-align: center;
    color:#147adf;
  }
}
</style>