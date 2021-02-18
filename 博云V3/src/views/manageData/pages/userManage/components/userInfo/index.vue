<template>
  <div class="userInfo">
    <!-- 用户详情 -->
    <div class="userInfo__top">
      <div class="userInfo__list" v-for="(item, index) in infoList" :key="index">
        <i :class="['iconfont', 'icon', item.icon]"></i>
        <label>{{item.label}}：</label>
        <span>{{item.value}}</span>
      </div>
    </div>
    <!-- 用户详情 -->
    <!-- 用户树 -->
    <div class="userInfo__tree">
      <UserTree
      @selectTree="selectTree"
      ></UserTree>
    </div>
    <!-- 用户树 -->
  </div>
</template>
<script lang="ts">  
import { defineComponent, nextTick, reactive,toRefs } from "vue";
import UserTree from "../userTree/index.vue";
import store from "@/store/index";
import { getAccountType } from "@/views/manageData/module/src/function";
export default defineComponent({
  components:{
    UserTree
  },
  setup(props, { emit } ) {
    const data = reactive({
      infoList:[
        {
          icon: 'icon-yonghu',
          label: '登录账户',
          value: ''
        },
        {
          icon: 'icon-chenghu',
          label: '客户名称',
          value: ''
        },
        {
          icon: 'icon-type',
          label: '账号类型',
          value: ''
        },
        {
          icon: 'icon-daima',
          label: '客户代码',
          value: ''
        },
        {
          icon: 'icon-shouji',
          label: '客户电话',
          value: ''
        },
      ]
    });

    const getData = async () => {
      data.infoList[0].value = store.state.USER.name;
      data.infoList[1].value = store.state.USER.corpName;
      data.infoList[2].value = getAccountType(store.state.USER.accountType);
      data.infoList[4].value = store.state.USER.phone;
      if(store.state.USER.customCode){
        data.infoList[3].value = store.state.USER.customCode;
      }
    }
    nextTick(()=>{
      getData();
    });
    const selectTree = (item:any) => {
      emit('selectTree',item);
    }
    return {
      selectTree,
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
