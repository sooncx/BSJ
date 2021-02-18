<template>
  <div class="connent">
    <div class="steps_header">
      <a-steps :current="current" v-show="current < 3">
        <a-step v-for="item in steps" :key="item.title" :title="item.title" />
      </a-steps>
    </div>
    <div class="steps_content">
      <!-- 步骤一 -->
      <stepsOne @next="next" @uploadSuccess="uploadSuccess" v-show="current == 0"></stepsOne>
      <!-- 步骤二 -->
      <stepsTwo @next="next" @updateUploadData="uploadSuccess" :uploadData="uploadData" @back="back" v-show="current == 1"></stepsTwo>
      <!-- 步骤三  -->
      <stepsThree 
      @next="next" 
      :groupName="groupName" 
      :uploadData="uploadData" 
      @back="back"
      @submitSuccess="submitSuccess"
      v-show="current == 2"></stepsThree>
    </div>
    <!-- 上传成功 -->
    <div class="steps_success" v-show="current === 3">
      <div class="success__header">
        <CheckCircleFilled />
        <p>批量上传成功</p>
      </div>
      <div class="success__body">
        <div class="row">
          <label>上传数据：</label>
          <span>{{successNum}}条</span>
        </div>
        <div class="row">
          <label>目标车组：</label>
          <span>{{groupName}}</span>
        </div>
      </div>
      <div class="success__foot">
        <a-button type="primary" @click="goShow()">
          去查看
        </a-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, toRefs,reactive,watch,nextTick } from "vue";
import { CheckCircleFilled } from '@ant-design/icons-vue';
import stepsOne from "./components/stepsOne/index.vue";
import stepsTwo from "./components/stepsTwo/index.vue";
import API from "@/api/manageData";
import { Modal  } from 'ant-design-vue';  
import { ElMessage } from 'element-plus';
import router from "@/router";
import stepsThree from "./components/stepsThree/index.vue";
export default defineComponent({
  components: {
    stepsOne,
    stepsTwo,
    stepsThree,
    CheckCircleFilled
  },
  setup() {
    const data = reactive({
      current:0 ,
      steps: [
        {
          title: '上传',
          content: 'First-content',
        },
        {
          title: '验证',
          content: 'Second-content',
        },
        {
          title: '提交',
          content: 'Last-content',
        },
      ],
      uploadData: <any>null,
      groupName: '',
      groupId: 0,
      successNum: 0
    });

    //获取当前账户中间表是否有错误
    const getImportVehicleData = async () => {
      const { obj } = await API.getImportVehicleData();
      if(obj.data.errorNum !== 0 || obj.data.rightNum !== 0){
        Modal.confirm({
          title: '批量导入提醒',
          content: '你有未完成的进度是否继续？',
          okText: '确定',
          cancelText: '取消',
          async onOk() {       
            uploadSuccess(obj);
            if(obj.data.errorNum === 0){
              data.current = 2;
            }else{
              data.current = 1;
            }
          },
          async onCancel() {
            // 删除中间表的数据
            const { flag,msg } = await API.delImportVehicleData({});
            if(flag === 1){
              ElMessage.success('删除没有处理完的Excel状态成功');
            }
          },
        });
      }
    }

    nextTick(()=>{
      getImportVehicleData();
    });

    const next = () => {
      data.current++;
    }
    const back = () =>{
      data.current--;
    }
    const uploadSuccess = (item:any) => {
      data.uploadData = item;
    }
    const submitSuccess = (item:any) => {
      data.groupName = item.groupName;
      data.groupId = item.groupId;
      data.successNum = item.successNum
    }
    const goShow = () => {
      router.push({ name: 'carManage', params: {groupId:data.groupId} });
    }
    return {
      goShow,
      submitSuccess,
      uploadSuccess,
      next,
      back,
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
@import "./index.less";
</style>