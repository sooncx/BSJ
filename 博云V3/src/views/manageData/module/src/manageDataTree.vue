<template>
  <div class="tree">
    <div class="header" v-if="searchTitle !== ''">
      <!-- 用户名搜索 -->
      <UserSearch 
        v-if="title === 'corpName'" 
        :inputStyle="inputStyle" 
        :placeholder="searchTitle" 
        v-model:value="userInfo" />
      <!-- 车辆搜索-->
      <VehFuzzySearch
        v-else
        v-model:value="fuzzyValue"
        :placeholder="searchTitle"
        :groupVisible="false"
        :inputStyle="inputStyle"
        :tagList="tagList"
      />
    </div>
    <div class="body">
      <Tree
        v-loading="treeLoading"
        :expanded-keys="expandedKeys"
        :replace-fields="replaceFields"
        :auto-expand-parent="autoExpandParent"
        :tree-data="treeData"
        :checkable="checkable"
        v-model:checkedKeys="select"
        defaultExpandAll
        :checkStrictly="checkStrictly"
        :selectedKeys="selectedKeys"
        @expand="onExpand"
        @check="onCheck"
      >
        <template #title="item">
            <div class="treeItem" @click="seleceTree(item)">
              <i v-if="title === 'corpName'" class="iconfont icon icon-me"></i>
              <i v-if="title === 'gn' && item.children" class="iconfont icon icon-chezu-1"></i>
              <i v-if="title === 'gn' && item.children === undefined" class="iconfont icon icon-che-"></i>
              <span v-if="item[title].indexOf(searchValue) > -1">
                {{ item[title].substr(0, item[title].indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{ item[title].substr(item[title].indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ item[title] }}</span>
              <span :class="['settingIcon',`${clickSelectKey === item['eventKey'] ? 'active': ''}`]" v-if="setting">
                <div v-for="(iconItem,iconKey) in iconList" :key="iconKey" >
                <i
                  v-if="getIconShow(item,iconItem.type)" 
                  :title="getModalTitle(iconItem.type)" 
                  :class="['iconfont','icon',iconItem.icon]" 
                  @click.stop="emitType(iconItem.type,item)"></i>
                </div>
              </span>
            </div>
        </template>
      </Tree>
    </div>
  </div>
</template>
<script lang="ts">
import { useStore } from "vuex";
import { defineComponent, inject, reactive, toRefs, PropType, watch, nextTick } from "vue";
import { Tree } from "ant-design-vue";
import router from "@/router";
import VehFuzzySearch from "@/components/VehGroup/src/VehFuzzySearch.vue";
import { toTreeData} from './function';
import { UserSearch } from '@/components/UserSearch';

export default defineComponent({
  components:{
    Tree,
    VehFuzzySearch,
    UserSearch
  },
  props: {
    replaceFields: {
      type: Object,
      default : {}
    },
    checkable: {
      type: Boolean,
      default: false
    },
    treeDataArray: {
      type: Array as PropType<any>,
      default: []
    },
    parentKey: {
      type: Object,
      default: {
        id: '',
        parentId: '',
      }
    },
    tagList: {
      type: Array,
      default: [
        0,1,2,3,4
      ]
    },
    title: {
      type: String,
      default: ''
    },
    setting: {
      type: Boolean,
      default: true
    },
    searchTitle: {
      type: String,
      default: ''
    },
    selectedCheckedKeys:{
      type: Array as PropType<any>,
      default: []
    },
    checkStrictly: {
      type: Boolean,
      default: false
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      iconList: [
        {
          type: 'add',
          icon: 'icon-zengjia',
          id: 0,
        },
        {
          type: 'edit',
          icon: 'icon-xiugai',
          id: 0,
        },
        {
          type: 'delete',
          icon: 'icon-shanchu1',
          id: 0,
        },
        {
          type: 'editInfo',
          icon: 'icon-jiache',
          id: 0,
        },
      ],
      expandedKeys: <any>[],
      selectedKeys: <any>[],
      autoExpandParent: true,
      userInfo: null,
      searchValue: '',
      clickSelectKey:<any>-1,
      fuzzyValue: <any>{},
      treeData: <any>[],
      select: <any>[],
      treeLoading: false,
      inputStyle:{
        width: '100%',height:'32px',
      }
    });
    let parentTreeData = <any>[];
    let dataList = <any>[];
    const store = useStore();

    //权限检查 用户树
    if(props.title === 'corpName'){
      data.iconList[0].id = 160102;
      data.iconList[1].id = 160103;
      data.iconList[2].id = 160104;
      data.iconList[3].id = 160105;
      data.iconList[3].icon = 'icon-bangding';
      //判断当前用户是否有删除的权限
      if(store.state.USER.checkUser === 1){
        data.iconList = data.iconList.filter((item:any)=> item.id !== 160104);
      }
    }
    //权限检查 车组树
    if(props.title === 'gn' && store.state.USER.checkGroup === 1){
      data.iconList = data.iconList.filter((item:any)=> item.type !== 'delete');
    }

    watch(()=>props.selectedCheckedKeys,(value)=>{
      data.select = value;
    });
    
    // 选择用户注入器
    let updateSelectUserId = inject("updateSelectUserId") as Function;
    const selectUserId = (userId:any) => {
      updateSelectUserId(userId);
    }
    // 选择用户/车组ID
    const selectInfoId = (id:any) => {
      data.expandedKeys = [id];
      data.selectedKeys = [id];
      setTimeout(()=>{
        const jumpRow = document.getElementsByClassName('ant-tree-node-selected')[0];
        jumpRow && jumpRow.scrollIntoView();
      },500);
    }

    
    // 监听用户搜索
    watch(()=>data.userInfo,(userId:any)=>{
      if(!userId){
        data.selectedKeys = [];
        data.expandedKeys.push(store.state.USER.userId);
        return false;
      }
      selectUserId(userId);
      selectInfoId(userId);
    });
    // 监听路由路径
    watch(() => router.currentRoute.value.name,(val, old: any) => {
      nextTick(()=>{
        if (!val || val != "carManage") return;
        if (!router.currentRoute.value || !router.currentRoute.value.params) return;
        if (router.currentRoute.value.params.groupId) {
          const params:any = router.currentRoute.value.params;
          emit('selectTree',{gi:params.groupId});
          data.clickSelectKey = parseInt(params.groupId);
          setTimeout(()=>{
            selectInfoId(parseInt(params.groupId));
          },500);
        }
      });
    },{ immediate: true });
    // 监听车辆搜索
    watch(()=>data.fuzzyValue,(value)=>{
      if(value && value.groupId){
        emit('selectTree',{gi:value.groupId,vehicleId:value.vehicleId});
        selectInfoId(value.groupId);
      }else{
        data.expandedKeys = [-3];
        data.selectedKeys = [];
      }
    });
    
    watch(()=>props.treeDataArray,(value)=>{
      nextTick(()=>{
        if(!value) return;
        if(value.length === 0){
          data.treeData = [];
          return;
        };
        data.treeLoading = true;
        parentTreeData = toTreeData(value,props.parentKey);
        data.treeData = parentTreeData;
        dataList = value;
        //默认打开第一列
        data.expandedKeys = [data.treeData[0][props.parentKey.id]]
        data.treeLoading = false;
      });
    },{ immediate: true });
    // 树节点展开/收缩
    const onExpand = (expandedKeys: any[]) =>{
      data.expandedKeys = expandedKeys;
      data.autoExpandParent = false;
    }
    const emitType = (type:string,item:any) => {
      if(item.gi) data.selectedKeys = [item.gi];
      if(item.userId) data.selectedKeys = [item.userId];
      data.clickSelectKey = item.eventKey;
      emit('type',type,item);
    }
    const getIconShow = (item: any,type:any='') => {
      // 用户树
      if(props.title === 'corpName'){
        // 顶级父类不显示任何 操作
        if(item.userId === store.state.USER.userId){
          return false;
        }
        // 用户类型 为 监控用户 不显示 添加和绑车操作
        if(item.accountType && item.accountType === 4 && (type === 'add' || type === 'editInfo')){
          return false;
        }
        return true;
      }
      // 车组树
      if(props.title === 'gn'){
        // 顶级车组只显示 添加车组操作
        if(item.pi === 0){
              // 判断当前用户是否顶级用户 不是顶级用户不显示顶级车组
          if(store.state.USER.topUserId !== store.state.USER.userId){
            return false;
          }
          if(type === 'add'){
            return true;
          }
          return false;
        }
        return true;
      }
    }
    const onCheck = (item:any,e:any) => {
      let selectData = <any>[];
      e.checkedNodes.forEach((i:any)=>{
        selectData.push({
          gi: i.props.gi,
          gn: i.props.gn,
          pi: i.props.pi
        });
      });
      emit("oncheck", selectData);
    }

    const seleceTree = (item:any) => {
      data.clickSelectKey = item.eventKey;
      if(props.title === 'gn' && item.pi === 0) return;
      if(item.gi){
        data.selectedKeys = [item.gi];
      }
      if(item.userId){
        data.selectedKeys = [item.userId];
        selectUserId(item.userId);
      }
      emit('selectTree',item);
    }

    const getModalTitle = (type:string) => {
      switch(type){
        case 'add':
          return props.title === 'corpName'? '新增下级用户' : '添加车组' ;
        case 'edit':
          return props.title === 'corpName'? '修改' : '修改车组';
        case 'delete':
          return props.title === 'corpName'? '删除' : '删除车组';
        case 'editInfo':
          return props.title === 'corpName'? '绑定' : '绑定车辆';
      }
    }
    return {
      getModalTitle,
      seleceTree,
      onCheck,
      getIconShow,
      emitType,
      onExpand,
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
.tree{
  height: 100%;
  display: flex;
  flex-direction: column;
  .body{
    flex:1;
    overflow-y: auto;
  }
  .header{
    // border: 1px solid #d9e0e9;
    margin-bottom: 10px;
  }
  .treeSearchInput{
    margin-bottom: 8px;
  }
  ::v-deep(.ant-input-affix-wrapper){
    background-color: #EFF1F3;
    height: 40px;
    padding: 0 10px;
    border: 1px solid #D9E0E9;
    input{
      color:#000;
      background-color: #EFF1F3;
    }
  }
  .treeItem{
    color:#8F96A7;
    display: flex;
    width: 100%;
    > i {
      margin-right:5px;
    }
  }
  .settingIcon{
    display: none;
    margin-left:7px;
    div{
      display: inline-block;
      i{
        margin-left:5px;
      }
    }
  }
  .active{
    display: block;
  }
  .treeItem:hover .settingIcon{
    display: block;
  }
}
</style>