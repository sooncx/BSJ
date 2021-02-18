<template>
  <div class="content">
    <div class="content__header">
      <carRechargeHeader :headerAppend="headerAppend" tips="设备上线后才开始计算到期时间" :showButton="true"></carRechargeHeader>
    </div>
    <div class="content__body">
      <div class="content__body__tabs">
        <div 
        class="content__body__tabs__item" 
        :class="{active: activeName===item.value}" 
        @click="activeTab(item.value)" 
        v-for="(item,index) in tabsItem" :key="index" :v-permission="item.id">{{item.title}}</div>
      </div>
      <div class="content__body__table">
        <carRecharge v-if="activeName == 'carRecharge'" @uploadUserRecharge="uploadUserRecharge"></carRecharge>
        <rechargeLog v-if="activeName == 'rechargeLog'"></rechargeLog>
        <carCoin v-if="activeName == 'carCoin'" status="" @uploadUserRecharge="uploadUserRecharge"></carCoin>
        <carCoin v-if="activeName == 'carCoinLog'" status="log"></carCoin>
      </div>
    </div>
    <!-- 提示窗口 -->
    <carRechargeMessageModal 
    v-model:visible="rechargeMessageVisible"></carRechargeMessageModal>
  </div>
</template>
<script lang="ts">
import { defineComponent,nextTick,reactive,toRefs } from "vue";
import carRecharge from "./components/index/index.vue";
import rechargeLog from "./components/rechargeLog/index.vue";
import { carRechargeMessageModal } from "@/views/manageData/module/index";
import carCoin from "./components/carCoin/index.vue";
import { parament } from "./index";
import API from "@/api/manageData/index";
import { carRechargeHeader } from "../../module/index";
import { ElMessage } from 'element-plus';
export default defineComponent({
  components: {
    carRecharge,
    rechargeLog,
    carRechargeMessageModal,
    carCoin,
    carRechargeHeader
  },
  setup() {
    const data = reactive({
      activeName: 'carRecharge',
      rechargeMessageVisible: false,
      ...parament
    });
    nextTick(()=>{
      getData();
    });
    
    // 切换Tab功能
    const activeTab = (name:string) =>{
      data.activeName = name;
    }
    
    // 续费成功回调 
    const uploadUserRecharge = () => {
      getData();
    }

    // 获取价钱币数据
    const getData = async () => {
      try {
        const { obj,flag,msg } = await API.queryMyState();
        if(flag !== 1){
          throw msg
        }
        data.headerAppend.value = obj.data.money;
      } catch (error) {
        ElMessage.error(error);
      }
    }

    return {
      activeTab,
      uploadUserRecharge,
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
