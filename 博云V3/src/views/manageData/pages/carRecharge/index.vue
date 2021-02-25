<template>
  <div class="content">
    <div class="content__header">
      <carHeader :headerAppend="headerAppend" tips="设备上线后才开始计算到期时间" :showButton="true"></carHeader>
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
        <carCoin v-if="activeName == 'carCoin'" type="" @uploadUserRecharge="uploadUserRecharge"></carCoin>
        <carCoin v-if="activeName == 'carCoinLog'" type="log"></carCoin>
      </div>
    </div>
    <!-- 提示窗口 -->
    <carRechargeMessageModal 
    v-model:visible="rechargeMessageVisible"></carRechargeMessageModal>
  </div>
</template>
<script lang="ts">
import { defineComponent,nextTick,reactive,toRefs } from "vue";
import carRecharge from "./components/recharge/index.vue";
import rechargeLog from "./components/rechargeLog/index.vue";
import { carRechargeMessageModal } from "@/views/manageData/module/index";
import carCoin from "./components/carCoin/index.vue";
import API from "@/api/manageData/index";
import { carHeader } from "../../module/index";
import { ElMessage } from 'element-plus';
export default defineComponent({
  components: {
    carRecharge,
    rechargeLog,
    carRechargeMessageModal,
    carCoin,
    carHeader
  },
  setup() {
    const data = reactive({
      activeName: 'carRecharge',                                    // 标签页值
      rechargeMessageVisible: false,                                // 续费消息提醒信息
      headerAppend:{ title:'加钱币：', value: 0, icon: 'icon-bi',},  // 头部添加数据
      tabsItem: [                                                   // 标签页数据
        { id: 160401, title: '车辆续费', value: 'carRecharge' },
        { id: 0, title: '续费记录', value: 'rechargeLog' },
        { id: 160402, title: '车币划拨', value: 'carCoin'},
        { id: 160403, title: '车币划拨记录', value: 'carCoinLog'}
      ],
    });

    nextTick(()=>{
      getData();
    });

    setTimeout(()=>{
      data.rechargeMessageVisible = true;
    },500);
    
    // 切换Tab功能
    const activeTab = (name:string) =>{
      data.activeName = name;
    }
    
    // 更新价钱币
    const uploadUserRecharge = () => {
      getData();
    }

    // 获取价钱币数据
    const getData = async () => {
      try {
        const { obj,flag,msg } = await API.queryMyState();
        if(flag !== 1) throw msg;
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
.content{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  &__header{
    background-color: white;
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    margin-bottom: 10px;
  }
  &__body{
    display: flex;
    flex:1;
    flex-direction: column;
    background-color: white;
    &__tabs{
      width:100%;
      display: flex;
      flex-wrap: wrap;
      border-bottom: 1px solid #e8e8e8;
      &__item{
        padding: 0 36px;
        font-size: 14px;
        line-height: 50px;
        font-family: PingFang-SC-Bold;
        font-weight: 700;
        color: #acb0b7;
        cursor: pointer;
      }
      .active{
        color: #1184e5;
        border-bottom: 3px solid #1184e5;
      }
    }
    &__table{
      flex:1;
      height: 100%;
    }
  }
}
</style>
