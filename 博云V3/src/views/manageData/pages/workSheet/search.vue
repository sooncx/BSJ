<template>
  <div class="search">
    <div class="search__left">
      <div class="item">
        <a-button type="primary" @click="mode('add')">新建工单</a-button>
        <a-button type="primary" @click="mode('delete')">删除工单</a-button>
      </div>
    </div>
    <div class="search__right">
      <div class="item">
        <a-select
          v-model:value="search.searchType"
          style="width: 120px"
          ref="select"
          @change="searchTypeChange"
        >
          <a-select-option
          v-for="item in searchTypeOption"
          :key="item.value"
          :value="item.value">
            {{item.label}}
          </a-select-option>
        </a-select>
      </div>
      <div class="item">
        <a-input
          v-if="search.searchType !== 2"
          v-model:value="search.searchValues" 
          placeholder="安装人员、车主、车牌号、设备号"
          style="width: 235px;"
        ></a-input>
      </div>
      <div class="item">
        <a-select
          v-if="search.searchType === 2"
          v-model:value="search.searchValues"
          style="width: 248px"
          placeholder="安装人员"
          @change="installWokerChange"
        >
          <a-select-option 
          v-for="item in installWorkerList"
          :value="item.userId"
          :key="item.userId"
          >
            {{item.name}}<span v-if="item.flag === 2">(已离职)</span>
          </a-select-option>
        </a-select>
      </div>
      <div class="item">
        <a-select
          v-model:value="search.terminalType"
          placeholder="设备类型"
          style="width: 120px;margin-right:8px;"
        >
          <a-select-option v-for="(item,index) in vehTypes" :key="index" :value="item.type" >
            {{item.typemap}}
          </a-select-option>
        </a-select>
      </div>
      <div class="item">
        <SelectDate v-model:value="rangeDate" dateType="date" />
      </div>
      <div class="item">
        <a-button type="primary" @click="onSearch">
          <template #icon><i class="iconfont icon icon-sousuo"></i></template>
          查询</a-button>
        <a-button @click="mode('export')">
          <template #icon><i class="iconfont icon icon-daochu"></i></template>
          导出</a-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent,toRefs,reactive, nextTick,watch  } from "vue";
import SelectDate from "@/views/manageData/module/src/SelectDate.vue";
import API from "@/api/manageData";
import { useStore } from "vuex";
import router from "@/router";
import { ElMessage } from "element-plus";
export default defineComponent({
  name: 'workSheetSearch',
  components:{
    SelectDate
  },
  setup(props,{ emit }) {
    const store = useStore();
    const data = reactive({
      rangeDate: ['',''],                     // 日期
      searchTypeOption: [                     // 搜索类型选项
        { label: '全部',value: 0 },
        { label: '车主名称',value: 1 },
        { label: '安装人员',value: 2 },
        { label: '车牌号',value: 3 },
        { label: '设备号',value: 4 },
      ],
      search:{ 
        searchType: 0,                        // 搜索类型
        searchValues: '',                     // 搜索值
        terminalType: '',                     // 终端类型
        userId: -1,                           // 用户值
        status: 0,                            // 状态
        endTime: '',                          // 结束时间
        pageNumber: 1,                        
        pageSize: 40,
        startTime: ''                         // 结束时间
      },
      installWorkerList: <any>[],             // 安装人员选项
      vehTypes: store.state.vehTypes,         // 设备类型
    });

    // 获取安装人员列表
    const getInstallWorker = async () => {
      const { obj } = await API.pageInstallWorker();
      data.installWorkerList = obj;
    }

    // 选择搜索类型重置 条件
    const searchTypeChange = (item:any,row:any) => {
      data.search.userId = -1;
      data.search.searchValues = '';
    }
    // 选择安装人员
    const installWokerChange = (item:any,row:any) => {
      data.search.searchValues = row.value;
      data.search.userId = row.key;
    }

    // 搜索功能
    const onSearch = () => {
      data.search.startTime = data.rangeDate[0];
      data.search.endTime = data.rangeDate[1];
      if(data.search.searchType === 2 && data.search.searchValues === ''){
        ElMessage.error('请选择安装人员');return;
      }
      emit('onSearch',data.search);
    }

    // 返回状态
    const getStatusByType = (type: any) : any => {
      switch(type){
        case 'workSheet':
          return 0;
        case 'confirmCounts':
          return 1;
        case 'processiveCounts':
          return 2;
      }
    }

    // 监听路由 是否有选择工作人员
    watch(() => router.currentRoute.value.name,(val, old: any) => {
      if (!val || val != "workSheet") return;
      if (!router.currentRoute.value || !router.currentRoute.value.params) return;
      if (router.currentRoute.value.params.type) {
        const { installWorkerId, installWorkerName, type } = router.currentRoute.value.params;
        data.search.searchValues = installWorkerName as any;
        data.search.userId = installWorkerId as any;
        data.search.status = getStatusByType(type);
        data.search.searchType = 2;
      }
      nextTick(()=>{
        emit('onSearch',data.search);
      });
      },{ deep: true, immediate: true,}
    );
    
    nextTick(()=>{
      data.vehTypes.unshift({type:'',typemap:'全部设备'});
      getInstallWorker()
    });

    // 功能聚合
    const mode = (value:any) => {
      emit('type', value);
    }
    return {
      searchTypeChange,
      mode,
      onSearch,
      installWokerChange,
      ...toRefs(data)
    }
  }
});
</script>
<style lang="less" scoped>
.search{
  width: 100%;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  margin-bottom:10px;
  .item{
    margin-top:10px;
    display: flex;
  }
  &__left{
    display: flex;
    button{
      margin-right:10px;
    }
  }
  &__right{
    display: flex;
    flex-wrap: wrap;
    .ant-select,.ant-input,button,.ant-calendar-picker{
      margin-left:10px;
    }
  }
}
</style>