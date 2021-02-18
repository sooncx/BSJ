<template>
  <div class="steps">
    <a-upload-dragger
      :multiple="true"
      :beforeUpload="beforeUpload"
      :fileList="fileList"
    >
      <p class="ant-upload-icon">
        <i class="iconfont icon icon-shangchuanbeifen"></i>
      </p>
      <p class="ant-upload-text">
        将文件拖到此处，或<span>点击上传</span>
      </p>
    </a-upload-dragger>
    <div class="tip">
      <h1>小技巧</h1>
      <ul>
        <li><span>1</span>首次使用,请点击下载最新<span>导入模板</span></li>
        <li><span>2</span>一次批量提交的车辆数不能超过 1000台，如果超过限制将提交失败！</li>
        <li><span>3</span>请避免您的账号,同一时间,使用不同电脑进行批量导入！！</li>
        <li><span>4</span>如果系统提示您有未完成的任务，可能是上次批量导入未完成或此时其他电脑正在 用您的账户进行批量导入。</li>
      </ul>
    </div>
    <div class="action">
      <a-button 
      type="primary" 
      :loading="uploading"
      @click="handleUpload">
        上传
      </a-button>
      <a-button type="primary" @click="downTemplate">
        下载模板
      </a-button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent,reactive, toRefs } from "vue";
import API from "@/api/manageData";
import { ElMessage } from 'element-plus';
export default defineComponent({
  setup(props,{emit}) {
    const data = reactive({
      file: <any>null,
      fileList: <any>[],
      uploading: false,
    });

    const beforeUpload = (file:any) => {
      data.file = file;
      data.fileList = [file];
      return false;
    }

    const handleUpload = async () => {
      const formData = new FormData();
      if(data.file === null){
        ElMessage.error('请选择文件');
        return false;
      }
      formData.append('file', data.file);
      data.uploading = true;
      try {
        const { obj,flag,msg } = await API.importVehicle(formData);
        if(flag !== 1){
          throw msg
        }
        emit("uploadSuccess",obj);
        emit("next");
      } catch (error) {
        ElMessage.error(error);
      }
      data.file = null;
      data.fileList = [];
      data.uploading = false;
    }
    const downTemplate = () => {
      API.getExportFile({});
    }
    return {
      handleUpload,
      beforeUpload,
      downTemplate,
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
@import "./index.less";
</style>