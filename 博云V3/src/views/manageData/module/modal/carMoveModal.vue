<template>
  <a-modal v-model:visible="show" width="550px" title="车辆转移" :maskClosable="false" @ok="handleOk">
    <template #footer>
      <a-button key="back" @click="handleBack">
        返回
      </a-button>
      <a-button key="submit" type="primary" :loading="modalLoading" @click="handleOk">
        转移车辆
      </a-button>
    </template>
    <a-form :model=form class="modelsff" >
      <div class="row">
        <a-form-item label="转移到" >
          <GroupSelect
            v-model:value="form.fuzzyValue"
            v-model:show="visible"
            :allChecked="false"
            width="400px"
          />
        </a-form-item>
      </div>
      <div class="row" v-if="modalType==='all'">
        <a-form-item label="转移方式">
          <a-select
            style="width: 400px"
            ref="select"
            v-model:value="form.moveType"
          >
            <a-select-option value="plate">
              根据车牌号
            </a-select-option>
            <a-select-option value="terminalNo">
              根据设备号
            </a-select-option>
          </a-select>
        </a-form-item>
      </div>
      <div class="row" v-if="modalType=='table'">
        <a-form-item label="设备号" >
          <a-input v-model:value="form.terminalNo" disabled />
        </a-form-item>
      </div>
      <div class="row" v-if="modalType=='all'">
        <a-form-item :label="form.moveType == 'plate' ? '车牌号' : '设备号'">
          <a-textarea
            v-model:value="form.remark"
            :rows="8"
            placeholder="多台设备请换行，一行一条！"
          />
          <p v-if="textAreaCount !== 0">将要转移{{textAreaCount}}台车辆</p>
        </a-form-item>
      </div>
    </a-form>
  </a-modal>
</template>


<script lang="ts">
import { defineComponent,reactive, toRefs, PropType,watch,computed} from "vue";
import VehFuzzySearch from "@/components/VehGroup/src/VehFuzzySearch.vue";
import GroupSelect from "@/components/GroupSelect/index.vue";
import API from "@/api/manageData";
import { ElMessage } from 'element-plus';
export default defineComponent({
  name: "carMoveModal",
  components: {
    VehFuzzySearch,
    GroupSelect
  },
  props: {
    // 车辆信息
    dataItem: {
      type: Object as PropType<any>,
      default: () => ({
        terminalNo: '',         // 终端号
        vehicleId: '',          // 车辆ID
        groupId: '',            // 车组ID
        list: '',               // 设备号
      }),
    },
    // 窗口类型
    modalType: {
      type: String,
      default: '',
    },
    // 显示状态
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      modalLoading: false,
      form: {
        remark: '',
        terminalNo: '',                     // 设备号
        moveType: 'plate',                  // 转移类型 设备号/终端号
        fuzzyValue: { gi:'' },              // 车组搜索
        vehicleId: 0,                       // 车辆ID
      },
      visible:true,
      textAreaCount: <string | number>'',   // 转移数量
    });

    const show = computed({
      get: () => props.visible,
      set: (val) => {
        emit("update:visible", val);
      },
    });

    // 监听转移数量
    watch(()=>data.form.remark,(value)=>{
      let count = 0;
      value.split('\n').forEach((item)=>{
        if(item !== ""){
          count++;
        }
      });
      data.textAreaCount = count;
    });
    const handleOk = async () => {
      // 表格里面的转移
      if(props.modalType === 'table'){
        const info = {
          vehicleId: props.dataItem.vehicleId,
          groupId: data.form.fuzzyValue.gi,
          befGroupId: props.dataItem.groupId,
        };
        try {
          if(!info.groupId){
            ElMessage.error('请选择车组');return;
          }
          const { flag,msg } = await API.singleVehTran(info);
          if(flag !== 1) throw msg;
          ElMessage.success('成功');
          emit('carMoveModalHandleOk');
          emit("update:visible", false);
        } catch (error) {
          ElMessage.error(error);
        }
      }
      // 车辆转移
      if(props.modalType === 'all'){
        const info = {
          transType: data.form.moveType,
          groupId: data.form.fuzzyValue.gi,
          list: data.form.remark
        }
        transVehicle(info);
      }
      // 转移选中项
      if(props.modalType === 'select'){
        const info = {
          transType: 'terminalNo',
          groupId: data.form.fuzzyValue.gi,
          list: props.dataItem.list
        }
        transVehicle(info);
        emit('carMoveModalHandleOk');
      }
      return false;
    }

    // 转移提交方法
    const transVehicle = async (info:any) => {
      try {
        if(!info.groupId){
          ElMessage.error('请选择车组');return;
        }
        if(!info.list){
          ElMessage.error('请填写车牌号/设备好');return;
        }
        const { flag, msg } = await API.transVehicle(info);
        if(flag !== 1) throw msg;
        ElMessage.success('成功');
        emit("update:visible", false);
      } catch (error) {
        ElMessage.error(error);
      }
    }
    watch(()=>props.visible,(value)=>{
      if(!value) return;
      if(props.modalType === 'table'){
        data.form.terminalNo = props.dataItem.terminalNo;
      }
      data.form.fuzzyValue = {gi:''};
    });
    // 返回方法
    const handleBack = () => {
      emit("update:visible", false);
    }
    return {
      handleOk,
      handleBack,
      show,
      ...toRefs(data),
    };
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