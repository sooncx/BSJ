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
import { defineComponent, toRefs,reactive,nextTick } from "vue";
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
      current:0 ,                       // 步长
      steps: [                          // 步骤
        { title: '上传', content: 'First-content' },
        { title: '验证', content: 'Second-content' },
        { title: '提交', content: 'Last-content' },
      ],
      uploadData: <any>null,            // 上传数据 返回数据集
      groupName: '',                    // 车组名
      groupId: 0,                       // 车组ID
      successNum: 0                     // 成功数量
    });

    //获取当前账户中间表是否有错误
    const getImportVehicleData = async () => {
      try {
        const { obj,flag,msg } = await API.getImportVehicleData();
        if(flag !== 1) throw msg;
        // 判断是否有 错误数据和成功数据
        if(obj.data.errorNum !== 0 || obj.data.rightNum !== 0){
          Modal.confirm({
            title: '批量导入提醒',
            content: '你有未完成的进度是否继续？',
            okText: '确定',
            cancelText: '取消',
            async onOk() {       
              uploadSuccess(obj);
              data.current = 1;
              if(obj.data.errorNum === 0) data.current = 2;
            },
            async onCancel() {
              // 删除中间表的数据
              const { flag } = await API.delImportVehicleData({});
              if(flag === 1) ElMessage.success('删除没有处理完的Excel状态成功');
            },
          });
        }
      } catch (error) {
        ElMessage.error(error);
      }
    }

    nextTick(()=>{
      getImportVehicleData();
    });
    // 下一步
    const next = () => {
      data.current++;
    }
    // 上一步
    const back = () =>{
      data.current--;
    }
    // 上传成功回调
    const uploadSuccess = (item:any) => {
      data.uploadData = item;
    }
    // 提交数据成功回调
    const submitSuccess = (item:any) => {
      data.groupName = item.groupName;
      data.groupId = item.groupId;
      data.successNum = item.successNum
    }
    // 查看导入车组
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
.connent{
  background-color: #ffffff;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction:column;
  .steps_content {
    text-align: center;
    width: 60%;
    margin: 0 auto;
  }
  .steps_header{
    width: 500px;
    padding:40px 0;
    margin: 0 auto;
  }
  .steps_success{
    text-align: center;
    margin-top:100px;
    .success__header{
      color:#32BF37;
      span{
        font-size:90px;
      }
      p{
        font-weight: 400;
        margin-top:16px;
      }
    }
    .success__body{
      width: 250px;
      display: flex;
      flex-wrap: wrap;
      margin: 0 auto;
      .row{
        width: 100%;
        display: flex;
        margin-top:20px;
        justify-content: space-between;
        label{
          color:#999999;
        }
      }
    }
    .success__foot{
      margin-top:50px;
    }
  }
}
</style>