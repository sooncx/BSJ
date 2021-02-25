<template>
  <div class="header">
    <div class="header__left" >
      <div class="item" v-for="(item, index) in header" :key="index">
        <i :class="['iconfont', 'icon', item.icon]"></i>
        {{item.title}}
        <span v-if="item.child === undefined">{{item.value}}</span>
        <span v-for="(i,k) in item.child" :key="k" ><label>{{i.title}}</label>（{{i.value}}）</span>
      </div>
      <div class="tips" v-if="tips !== ''">
        TIPS:{{tips}}
      </div>
    </div>
    <div class="header__right" v-if="showButton">
      <div class="button">
        <a-button type="primary" @click="onDownLoad">
          <template #icon><i class="iconfont icon icon-xiazai"></i></template>操作说明
        </a-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, watch, nextTick} from "vue";
import { getAccountType } from "./function";
import { useStore } from "vuex";
import API from "@/api/manageData";
import { ElMessage } from 'element-plus';
export default defineComponent({
  name: "carRechargeHeader",
  props: {
    // 提示文案
    tips: {
      type: String,
      default: ''
    },
    // 是否显示按钮
    showButton: {
      type: Boolean,
      default: false
    },
    // 显示类型
    type: {
      type: String,
      default: 'all'
    },
    // 添加头部新数据
    headerAppend: {
      type: Object,
      default: {
        title:'',value: '',icon: '',
      }
    }
  },
  setup(props,) {
    const store = useStore();
    const data = reactive({
      header: <any>[
        {
          title:'登录账户：',
          value: store.state.USER.name,
          icon: 'icon-yonghu',
        },
        {
          title:'类型：',
          value: getAccountType(store.state.USER.accountType),
          icon: 'icon-type',
        },
        {
          title:'设备数量：',
          value: '',
          child: [
            { title:'全部', value: '0' },
            { title:'在线', value: '0' },
            { title:'离线', value: '0' }
          ],
          icon: 'icon-shebei',
        }
      ],
      headerLoding: false
    });

    // 获取默认数据
    const getHeaderData = async () => {
      data.headerLoding = true;
      try {
        // 判断是否有缓存
        if(!store.state.VehCount){
          const { obj,flag,msg } = await API.getUserVehicleCount({});
          if(flag !== 1) throw msg;
          store.commit("COMMIT_VEHCOUNT", obj.data);
        }
        data.header[3].child![0].value = store.state.VehCount.totalNum;
        data.header[3].child![1].value = store.state.VehCount.onlineNum;
        data.header[3].child![2].value = store.state.VehCount.offlineNum;
      } catch (error) {
        ElMessage.error(error);
      }
      data.headerLoding = false;
    }
    nextTick(() => {
      getHeaderData();
      if(props.type === 'dev') data.header = data.header.filter((item:any)=> item.title === '设备数量：');
    })
    watch(()=>props.headerAppend,(value)=>{
      data.header.splice(2,0,value);
    },{
      immediate: true
    })
    //下载操作说明
    const onDownLoad = () => {
      API.carRechargeDownLoadDoc({});
    }
    return {
      onDownLoad,
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
.header{
  display: flex;
  justify-content: space-between;
  width: 100%;
  &__left{
    display: flex;
    flex-wrap: wrap;
  }
  .item{
    margin-right: 30px;
    span{
      color:#0E60DB;
      label{
        color:#000;
      }
    }
  }
  .tips{
    color:#999999;
  }
  .button{
    justify-self: end;
  }
}
</style>