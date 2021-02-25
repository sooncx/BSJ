<template>
  <div class="userTree">
    <manageDataTree 
    :treeDataArray="treeData" 
    searchTitle="请输入用户名搜索" 
    :parentKey="{id:'userId',parentId: 'parentId'}" 
    title="corpName"
    :replaceFields="{children:'children', title:'corpName', key:'userId' }"
    @type="getType"
    ></manageDataTree>
  </div>
</template>
<script lang="ts">
import { defineComponent,watch,toRefs,reactive, nextTick } from "vue";
import { manageDataTree } from "@/views/manageData/module/index";
import { useStore } from "vuex";
export default defineComponent({
  components:{
    manageDataTree
  },
  setup(props, { emit }) {
    const store = <any>useStore();
    const data = reactive({
      treeData: <any>[],
    });

    // 监听用户列表源
    watch(()=>store.state.userList,(value:any)=>{
      data.treeData = value;
    });
    nextTick(()=>{
      data.treeData = store.state.userList;
    });

    // 功能聚合
    const getType = (type:string,item:any) => {
      emit('type',type,item)
    }
    return {
      getType,
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
.userTree{
  height: 100%;
  width: 100%;
  padding: 15px;
  overflow: auto;
  background-color: #ffffff;
  border: 1px solid #D9E0E9;
  border-top: 0px;
}
</style>