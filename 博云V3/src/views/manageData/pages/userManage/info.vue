<template>
  <div class="userInfo">
    <!-- 用户详情 -->
    <div class="userInfo__list" v-for="(item, index) in infoList" :key="index">
      <i :class="['iconfont', 'icon', item.icon]"></i>
      <label>{{item.label}}：</label>
      <span>{{item.value}}</span>
    </div>
  </div>
</template>
<script lang="ts">  
import { defineComponent, nextTick, reactive,toRefs } from "vue";
import store from "@/store/index";
import { getAccountType } from "@/views/manageData/module/src/function";
export default defineComponent({
  setup() {
    const data = reactive({
      infoList:[
        { icon: 'icon-yonghu', label: '登录账户',value: '' },
        { icon: 'icon-chenghu', label: '客户名称', value: '' },
        { icon: 'icon-type', label: '账号类型', value: '' },
        { icon: 'icon-daima', label: '客户代码', value: '' },
        { icon: 'icon-shouji', label: '客户电话', value: '' },
      ]
    });

    // 获取数据
    const getData = async () => {
      data.infoList[0].value = store.state.USER.name;
      data.infoList[1].value = store.state.USER.corpName;
      data.infoList[2].value = getAccountType(store.state.USER.accountType);
      data.infoList[4].value = store.state.USER.phone;
      // 判断是否有客户代码
      if(store.state.USER.customCode) data.infoList[3].value = store.state.USER.customCode;
    }
    nextTick(()=>{
      getData();
    });
    return {
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
.userInfo {
  width: 285px;
  height:203px;
  border: 1px solid #D9E0E9;
  padding:19px 0px 22px 16px;
  .userInfo__list{
    font-size:14px;
    color: #333333;
    font-weight: Regular;
    margin-bottom: 20px;
    i{
      margin-right: 6px;
    }
    span{
      color:#0E60DB;
    }
  }
}
</style>
