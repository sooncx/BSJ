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
        <a-form-item label="上级车组">
          <GroupSelect
            ref="inputRef"
            v-model:value="form.fuzzyValue"
            v-model:show="visible"
            :allChecked="checkedTop()"
            width="400px"
          />
        </a-form-item>
      </div>
      <div class="row">
        <a-form-item  label="车组名" >
          <a-input  v-model:value="form.groupName" />
        </a-form-item>
      </div>
      <div class="row">
        <a-form-item label="联系方式" >
          <a-input  v-model:value="form.phone" />
        </a-form-item>
      </div>
      <div class="row">
        <a-form-item label="备注">
          <a-textarea
            v-model:value="form.remark"
            :rows="4"
          />
        </a-form-item>
      </div>
    </a-form>
  </a-modal>
</template>
<script lang="ts">
import { defineComponent,ref,inject,reactive,toRefs,PropType,watch,nextTick, computed } from "vue";
import VehFuzzySearch from "@/components/VehGroup/src/VehFuzzySearch.vue";
import API from "@/api/manageData";
import GroupSelect from "@/components/GroupSelect/index.vue";
import { ElMessage } from 'element-plus';
import { useStore } from "vuex";
export default defineComponent({
  name: 'carGroupModal',
  components: {
    VehFuzzySearch,
    GroupSelect
  },
  props: {
    carGroupModelItem: {
      type: Object as PropType<any>,
      default: () => ({
        gn: '',
        pi: 0,
        gi: 0,
        pn: '',
      }),
    },
    carGroupModelType: {
      type: String as PropType<string>,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {emit}) {
    const store = useStore();
    const data = reactive({
      modalVisible: false,
      modalLoading: false,
      ruleForm: null as any,
      form: {
        remark: '',
        phone: '',
        groupName: '',
        parentId: 0,
        groupId: <any>'',
        fuzzyValue: <any>{
          gi: '',
        }
      },
      groupId: 0,
      visible:true,
      title: '',
    });

    const showVisible = computed({
      get: () => props.visible,
      set: (val) => {
        emit("update:visible", val);
      },
    });

    const groupParentData = () => {
      data.form.fuzzyValue = {gi: -1,gn:'车辆管理'};
    }

    const getData = async () => {
      try {
        data.groupId = props.carGroupModelItem.gi;
        if(props.carGroupModelItem.gi === 0) return false;
        if(props.carGroupModelItem.gi === -3){
          data.groupId = -1;
        }
        if(data.groupId === -1){
          groupParentData();
          return false;
        }
        // 获取当前车组 详细数据
        const { obj,flag,msg } = await API.getGroup({ groupId:data.groupId });
        if(flag !== 1){
          throw msg
        }
        if(props.carGroupModelType === 'edit'){
          data.form.phone = obj.data.phone;
          data.form.remark = obj.data.remark;
          data.form.groupName = obj.data.groupName;
          data.form.groupId = data.groupId;
          if(obj.data.parentId === -1){
            data.form.fuzzyValue = {gi: -1,gn:'车辆管理'};
          }else{
            data.form.fuzzyValue = {gi: obj.data.parentId,gn:obj.data.parentName};
          }
          
        }else{
          data.form.fuzzyValue = {gi: data.groupId,gn:obj.data.groupName};
          data.form.groupId = '';
        }
      } catch (error) {
        ElMessage.error(error);
      }
    }

    watch(()=>props.visible,(value:any)=>{
      if(!value) return;
      data.form.groupName = '';
      data.form.remark = '';
      data.form.phone = '';
      data.form.fuzzyValue = {
        gi: ''
      };
      data.title = props.carGroupModelType === 'edit' ? '编辑车组数据' : '新增车组'; 
      nextTick(()=>{
        getData();
      });
      
    });
    // 更新缓存
    const fnName = inject("updateVehGroupData") as Function;
    const handleOk = async () => {
      const info = {
        groupName: data.form.groupName,
        parentId: data.form.fuzzyValue.gi,
        parentName: data.form.fuzzyValue.gn,
        phone: data.form.phone,
        remark: data.form.remark,
        isFinance: '',
        notice: '',
        groupId: data.form.groupId,
      }
      try {
        let data = {};
        if(info.parentId === ''){
          throw '请选择上级车组';
        }
        if(info.groupName === ''){
          throw '请填写车组';
        }
        if(info.parentId === 0){
          info.parentId = -1;
        }
        if(props.carGroupModelType === 'add'){
          const { flag,msg,obj } = await API.addVehGroup(info)
          if(flag !== 1){
            throw msg
          }
          data = obj.data;
          ElMessage.success('添加成功');
        }else{
          const { flag,msg } = await API.updateVehicleGroup(info)
          if(flag !== 1){
            throw msg
          }
          ElMessage.success('修改成功');
        }
        //更新缓存
        fnName();
        emit("groupModalHandleOk",data);
        emit("update:visible", false);
      } catch (error) {
        ElMessage.error(error);
      }
    }
    const handleBack = () => {
      emit("update:visible", false);
    }

    // 判断当前用户是否顶级用户 不是顶级用户不显示顶级车组
    const checkedTop = () => {
      return store.state.USER.topUserId === store.state.USER.userId
    }
    return {
      checkedTop,
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