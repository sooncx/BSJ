<template>
  <div class="steps">
    <p class="tip success"><CheckCircleFilled />合规数据{{successNum}}条</p>
    <div class="content">
      <div class="table">
        <a-table :columns="columns" :data-source="tableData" bordered :rowKey="record => record.id">
          <template #name="{text}">
            <a>{{ text }}</a>
          </template>
        </a-table>
      </div>
    </div>
    <div class="group">
      <label>目标车组</label>
      <div style="width:200px;">
        <GroupSelect
          v-model:value="VehGroup"
          v-model:show="visible"
          :allChecked="false"
        />
      </div>
    </div>
    <div class="action">
      <a-button @click="back">上一步</a-button>
      <a-button type="primary" @click="carRechargeShow">下一步</a-button>
    </div>
    <carRechargeModal 
    v-bind="$attrs" 
    v-model:visible="carRechargeModelVisible"
    rechargeType="import"
    @importGetmonth="importGetmonth"
    :carRechargeNumber="successNum" 
    :dataItem="selectTableItem"></carRechargeModal>
  </div>
</template>
<script lang="ts">  
import columns from './columns';
import { defineComponent,toRefs,PropType,reactive,watch } from "vue";
import { carRechargeModal } from "@/views/manageData/module/index";
import { CheckCircleFilled } from '@ant-design/icons-vue';
import { ElMessage } from 'element-plus';
import GroupSelect from "@/components/GroupSelect/index.vue";
import API from "@/api/manageData";
export default defineComponent({
  components: {
    CheckCircleFilled,
    GroupSelect,
    carRechargeModal
  },
  props:{
    // 上传返回数据集
    uploadData: {
      type: Object as PropType<any>,
      default: {
        data: <any>null
      }
    }
  },
  setup(props, {emit}) {
    const data = reactive({
      tableData : <any>[],                              // 表格数据
      successNum: 0,                                    // 成功数量
      columns,                                          // 表格头部
      VehGroup: <any>{
        gi:''
      },    
      pagination :{                                     // 分页配置
        showTotal: (total:string) => `共 ${total} 条数据`,  // 显示总数
        pageSize: 10,                                   // 分页数量
        total: 0,
        current:1,
      },
      carRechargeModelVisible: false,                   // 续费窗口显示状态
      selectTableItem: <any>[],
      visible: true
    }); 

    // 显示续费窗口
    const carRechargeShow = () => {
      //判断是否选择车组了
      if(data.VehGroup === null){
        ElMessage.error('请选择车组');
        return false;
      }
      data.carRechargeModelVisible = true;
    }
    // 返回
    const back = () => {
      emit('back');
    }
    // 监听上传成功返回数据集变化
    watch(()=>props.uploadData,(value:any)=>{
      data.tableData = value.data.rightData;
      data.successNum = value.data.rightNum;
    });
    // 续费窗口 返回选择月份
    const importGetmonth = async (item:any) => {
      const info = {
        groupId:data.VehGroup.gi,
        addMonth: item
      }
      try {
        const { msg,flag } = await API.insertBatchVeh(info);
        if(flag !== 1) throw msg;
        emit('next');
        emit("submitSuccess",{
          groupName:data.VehGroup.gn,
          groupId: data.VehGroup.gi,
          successNum:data.successNum
        });
      } catch (error) {
        ElMessage.error(error);
      }
    }
    return {
      importGetmonth,
      carRechargeShow,
      back,
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
@import "../stepsTwo/index.less";
@import "../../../../../../assets/css/table.less";
</style>