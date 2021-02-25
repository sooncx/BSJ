<template>
  <a-modal v-model:visible="show" :maskClosable="false" width="600px" title="车组绑定" @ok="handleOk" class="carGroupBindBody">
    <template #footer>
      <a-button key="back" @click="handleBack">
        返回
      </a-button>
      <a-button key="submit" type="primary" @click="handleOk">
        确定
      </a-button>
    </template>
    <div class="body">
      <div class="body__left">
        <manageDataTree 
        v-model:treeDataArray="groupData" 
        searchTitle="请输入车组名" 
        :parentKey="{id:'gi',parentId: 'pi'}"
        :setting="false"
        :checkable="true"
        :tagList="[0]"
        :selectedCheckedKeys="selectedCheckedKeys"
        title="gn"
        :replaceFields="{children:'children', title:'gn', key:'gi' }"
        @oncheck="oncheck"
        ></manageDataTree>
      </div>
      <div class="body__right">
        <div class="header">
          <label>已选择：</label>
        </div>
        <div class="content">
          <manageDataTree 
          v-model:treeDataArray="selectData" 
          :parentKey="{id:'gi',parentId: 'pi'}"
          :setting="false"
          title="gn"
          :replaceFields="{children:'children', title:'gn', key:'gi' }"
          ></manageDataTree>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts">
import { defineComponent,reactive, toRefs, watch,computed, nextTick} from "vue";
import VehFuzzySearch from "@/components/VehGroup/src/VehFuzzySearch.vue";
import { manageDataTree } from "@/views/manageData/module/index";
import APIManage from "@/api/manageData";
import { ElMessage } from 'element-plus';
import { useStore } from "vuex";
export default defineComponent({
  name: "carGroupBindModal",
  components: {
    VehFuzzySearch,
    manageDataTree
  },
  props: {
    // 选择用户的ID
    selectUserId:{
      type: Number,
      default: 0
    },
    // 窗口显示状态
    visible: {
      type: Boolean,
      default: false
    },
    // 树默认勾选值
    selectedCheckedValue: {
      type: Array as any,
      default: []
    }
  },
  setup(props, { emit }) {
    const data = reactive({
      selectedCheckedKeys: <any>[],                   // 左侧树 复选框默认值
      groupData: <any>[],                             // 左侧树 树形数据
      selectData: <any>[],                            // 右侧数 树形数据
    });
    const store = useStore();
    // 获取 车组所有数据
    const getGroup = async () => {
      try {
        data.groupData = [];
        data.groupData = [...store.state.groupList];
      } catch (error) {
        ElMessage.error(error);
      }
    };

    // 获取 当前用户已选择的车组数据
    const getlistUserGroup = async () => {
      try {
        if(props.selectUserId === 0) return false;
        const { obj,flag,msg } = await APIManage.listUserGroup({userId:props.selectUserId});
        if(flag !== 1) throw msg;
        let gvids = [] as any;
        let defaultVids = [] as any;
        obj.forEach((value:any)=>{
          gvids.push({
            gi:value.groupId,
            pi:value.parentId,
            gn:value.groupName,
          });
          defaultVids.push(value.groupId);
        });
        // 左侧树 复选框默认选中
        data.selectedCheckedKeys = defaultVids;
        // 右侧树 树行数据
        data.selectData = gvids;
      } catch (error) {
        ElMessage.error(error);
      }
    }
    
    const show = computed({
      get: () => props.visible,
      set: (val) => {
        emit("update:visible", val);
      },
    });

    nextTick(()=>{
      getGroup();
    });

    watch(()=>props.visible,(value:any)=>{
      if(!value) return;
      data.selectedCheckedKeys = [];
      data.selectData = [];
      // 判断是否有从添加用户表单里面的 新增车组
      if(props.selectedCheckedValue.length !== 0){
        getGroup();
        nextTick(()=>{
          props.selectedCheckedValue.forEach((item:any)=>{
            data.selectedCheckedKeys.push(item.gi);
          });
          data.selectData = props.selectedCheckedValue;
        });
      }
      
      // 判断有选择用户ID
      if(props.selectUserId) getlistUserGroup();
    });

    // 左侧勾选车组数据
    const oncheck = (item:any) => {
      data.selectData = item;
    }

    // 提交功能
    const handleOk = () => {
      emit("handleOk", data.selectData);
      emit("update:visible", false);
    }

    // 返回功能
    const handleBack = () => {
      emit("update:visible", false);
    }
    return {
      show,
      handleOk,
      handleBack,
      oncheck,
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less">
.carGroupBindBody{
  .body{
    height: 400px;
    display: flex;
    justify-content: space-between;
    &__left,&__right{
      flex:1;
      .tree .body{
        background-color: #f2f5f8;
      }
    }
    &__right{
      display: flex;
      flex-direction: column;
      margin-left: 15px;
      .content{
        flex:1;
        overflow-y: auto;
      }
      .header{
        height: 32px;
        line-height: 32px;
        margin-bottom: 10px;
        color:#0E60DB;
      }
    }
  }
}
</style>