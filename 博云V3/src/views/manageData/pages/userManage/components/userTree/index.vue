<template>
  <div class="userTree">
    <manageDataTree 
    :treeDataArray="treeData" 
    searchTitle="请输入用户名搜索" 
    :parentKey="{id:'userId',parentId: 'parentId'}" 
    title="corpName"
    :replaceFields="{children:'children', title:'corpName', key:'userId' }"
    @type="getType"
    @selectTree="selectTree"
    ></manageDataTree>
  </div>
</template>
<script lang="ts">
import { defineComponent,watch,toRefs,reactive, nextTick } from "vue";
import { manageDataTree } from "../../../../module/index";
import { useStore } from "vuex";
import { bindCar,addUser,deleteUser } from "../userTable/index";
export default defineComponent({
  components:{
    manageDataTree
  },
  setup(props, { emit }) {
    const store = <any>useStore();
    const data = reactive({
      treeData: <any>[],
    });
    watch(()=>store.state.userList,(value:any)=>{
      data.treeData = value;
    });
    nextTick(()=>{
      data.treeData = store.state.userList;
    });
    const getType = (type:string,item:any) => {
      if(type === 'editInfo'){
        bindCar(item)
      }
      if(type === 'add'){
        addUser('addParent',item);
      }
      if(type === 'edit'){
        addUser('edit',item);
      }
      if(type === 'delete'){
        deleteUser(item);
      }
    }
    const selectTree = (item:any) => {
      emit('selectTree',item);
    }
    return {
      getType,
      selectTree,
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
@import "./index.less";
</style>