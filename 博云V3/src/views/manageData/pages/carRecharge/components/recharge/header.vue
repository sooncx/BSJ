<template>
  <div class="header">
    <div class="header__top">
      <div class="header__top__left">
        <div class="item">
          <label>车辆车组</label>
          <div class="group">
            <VehGroupSelect v-model:value="VehGroup" />
          </div>
        </div>
        <div class="item">
          <label>续费</label>
          <a-select
            v-model:value="renew"
            @change="onRenew"
            style="width: 120px"
            ref="select"
          >
            <a-select-option
            v-for="item in renewOptions"
            :key="item.value"
            :value="item.value">
              {{item.label}}
            </a-select-option>
          </a-select>
        </div>
        <div class="item" v-if="renew === 0">
          <label>状态</label>
          <a-select
            v-model:value="search.isState"
            style="width: 120px"
            ref="select"
          >
            <a-select-option
            v-for="item in statusOptions"
            :key="item.value"
            :value="item.value">
              {{item.label}}
            </a-select-option>
          </a-select>
        </div>
        <div class="item" v-if="renew === 0">
          <label>车辆状态</label>
          <a-select
            v-model:value="search.vehicleState"
            style="width: 120px"
            ref="select"
          >
            <a-select-option
            v-for="item in carStatusOptions"
            :key="item.value"
            :value="item.value">
              {{item.label}}
            </a-select-option>
          </a-select>
        </div>
        <div class="item date" v-if="renew === 0">
          <label>即将到期</label>
          <SelectDate @selectDay="onExpireTime" dateType="dayCustom"></SelectDate>
          <span @click="changeHighSearch"><MinusOutlined v-if="highSearch"/><PlusOutlined v-else/>高级筛选</span>
        </div>
      </div>
      <div class="header__top__right">
        <a-button type="primary" @click="onSearch">
          <template #icon><i class="iconfont icon icon-sousuo"></i></template>
          搜索</a-button>
        <a-button  @click="onSearch('export')">
          <template #icon><i :class="['iconfont', 'icon', 'icon-daochu']"></i></template>
          导出
        </a-button>
      </div>
    </div>
    <div class="header__bottom" ref="headerBottom" v-show="highSearch">
      <div class="item">
        <label>安装时间</label>
        <div class="group">
          <SelectDate v-model:value="installDate" dateType="date"></SelectDate>
        </div>
      </div>
      <div class="item">
        <label>激活时间</label>
        <div class="group">
          <SelectDate v-model:value="activationTime" dateType="date"></SelectDate>
        </div>
      </div>
      <div class="item">
        <label>离线时间范围（天）</label>
        <div class="group dateInput">
          <a-input v-model:value="search.offlineTimeBegin" />
          至
          <a-input v-model:value="search.offlineTimeEnd"/>
        </div>
      </div>
      <div class="item">
        <label>续费年限（年）</label>
        <div class="group">
          <a-select
            v-model:value="search.displayYear"
            style="width: 120px"
            ref="select"
          >
            <a-select-option v-for="(item, index) in renewYearOptions" :key="index" :value="item.value">
              {{item.title}}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, toRefs,reactive,nextTick  } from "vue";
import { VehGroupSelect } from "@/components/VehGroup/index";
import SelectDate from "@/views/manageData/module/src/SelectDate.vue";
import { PlusOutlined,MinusOutlined } from '@ant-design/icons-vue';
import dayJs from "dayjs";
import { ElMessage } from 'element-plus';
import API from "@/api/manageData";
export default defineComponent({
  components: {
    VehGroupSelect,
    SelectDate,
    PlusOutlined,
    MinusOutlined
  },
  setup(props,{emit}){
    const data = reactive({
      renewOptions: [                             // 续费选择值
        { value: 0,label: '续费' },
        { value: 1,label: '不续费' }
      ],
      statusOptions: [                            // 车辆状态选择值
        { value: '',label: '全部' },
        { value: 1,label: '已过期' },
        { value: 0,label: '正常' }
      ],
      carStatusOptions: [                         // 车辆运动状态选择值
        { value: '',label: '全部' },
        { value: '静止',label: '静止' },
        { value: '行驶',label: '行驶' },
        { value: '离线',label: '离线' },
        { value: '从未上线',label: '从未上线' }
      ],
      renewYearOptions:[                          // 续费年限选择值
        { value: 0,title: '未选择' },
        { value: 1,title: '1年' },
        { value: 2,title: '2年' },
        { value: 3,title: '3年' },
        { value: 4,title: '4年' },
        { value: 5,title: '5年' },
      ],
      expireTimeOptions:[                         // 过期时间选择值
        { value: 3,title: '近三天' },
        { value: 7,title: '近七天' },
        { value: 31,title: '近一个月' }
      ],
      installDate: <any>[],                       // 安装时间
      activationTime: [],                         // 激活时间
      VehGroup: <any>{},                          // 车辆车组搜索值
      highSearch: false,                           // 高级搜索显示切换值
      renew: 0,                                   // 续费值
      search: <any>null,
      headerBottom: <any>null,
      searchHeight: 0,
    });

    const initSearch = () => {
      const search = {
        offlineTimeBegin: <number | string>0,     // 离线时间开始
        offlineTimeEnd: <number | string>0,       // 离线时间结束
        isState: <number | string>'',             // 车辆状态
        vehicleState: '',                         // 车辆行驶状态
        installDateStart: '',                     // 安装时间开始
        installDateEnd: '',                       // 安装时间结束
        groupId: <number | string>'',             // 车组ID
        vehicleId: <number | string>'',           // 车辆ID
        activationTmeStart: '',                   // 激活时间开始
        activationTmeEnd: '',                     // 激活时间结束
        displayYear: 0,                           // 续费年限值
        expireTime: 2678400,                      // 过期时间
        pageNumber: 0,
        pageSize: 0,
      }
      data.search = search;
    }
    // 初始化搜索条件
    initSearch();

    // 高级搜索显示
    const changeHighSearch = () => {
      data.highSearch = !data.highSearch;
      setTimeout(()=>{
        if(data.searchHeight === 0) data.searchHeight = data.headerBottom.offsetHeight;
        emit('changeHighSearch',data.highSearch,data.searchHeight);
      },100)
    }

    // 时间格式化
    const getDayJs = (date:any) => {
      return dayJs(date).format("YYYY-MM-DD HH:mm:ss");
    }

    // 选择即将到期时间
    const onExpireTime = (day:number) => {
      data.search.expireTime = day * 86400;
      onSearch();
    }

    // 续费类型选择事件
    const onRenew = (item:number) => {
      data.search.isState  =  '';
      if(item === 1) data.search.isState  = '2';
      if(data.highSearch === true) changeHighSearch();
    }

    // 搜索 或 导出
    const onSearch = (type:string='search') => {
      // 判断如果续费 等于不续费 则清空所有搜索条件
      if(data.search.isState === '2'){
        initSearch();
        data.search.isState = '2';
        emit('onSearch',data.search,data.renew);
        return;
      }
      // 安装时间开始
      if(data.installDate[0]) data.search.installDateStart = getDayJs(data.installDate[0]);
      // 安装结束结束
      if(data.installDate[1]) data.search.installDateEnd = getDayJs(data.installDate[1]);
      // 激活时间开始
      if(data.activationTime[0]) data.search.activationTmeStart = getDayJs(data.activationTime[0]);
      // 激活时间结束
      if(data.activationTime[1]) data.search.activationTmeEnd = getDayJs(data.activationTime[1]);
      // 判断是否选择 车辆或车组
      if(data.VehGroup && data.VehGroup.flag !== undefined){
        data.search.groupId = data.VehGroup.groupId;
        data.search.vehicleId = '';
        // 判断选择车辆 需要加上车辆ID
        if(data.VehGroup.flag == 1){
          data.search.vehicleId = data.VehGroup.vehicleId;
          data.search.groupId = data.VehGroup.groupId;
        }
      }
      try {
        // 判断 离线时间
        if(data.search.offlineTimeBegin || data.search.offlineTimeEnd){
          if(!data.search.offlineTimeBegin) throw '离线开始时间不能为空';
          if(!data.search.offlineTimeEnd) throw '离线结束时间不能为空';
          if(data.search.offlineTimeBegin > data.search.offlineTimeEnd) throw '开始时间不能大于结束时间！！';
          if(data.search.offlineTimeEnd > 999) throw '离线结束时间不能大于999';
        }
      } catch (error) {
        ElMessage.error(error);return false;
      }

      // 导出
      if(type === 'export'){
        API.exportVehicleExpire({...data.search});
        return false;
      }
      emit('onSearch',data.search,data.renew);
    }

    nextTick(()=>{
      onSearch('search');
    });

    return {
      onRenew,
      onSearch,
      onExpireTime,
      changeHighSearch,
      ...toRefs(data)
    }
  }
})
</script>
<style lang="less" scoped>
.header{
  padding: 10px 17px;
  &__top{
    width: 100%;
    display: flex;
    line-height: 40px;
    justify-content: space-between;
    &__left{
      display:flex;
      flex-wrap: wrap;
    }
    &__right{
      display:flex;
      button{
        margin-left: 8px;
      }
    }
  }
  &__bottom{
    display: flex;
    flex-wrap: wrap;
    .item{
      margin-top: 8px;
    }
  }
  .item{
    label{
      display: inline-block;
      margin-right:8px;
    }
    .group{
      display: inline-block;
    }
    .dateInput{
      input{
        width: 50px;
      }
    }
    margin-right:24px;
  }
  .date{
    display: flex;
    flex-wrap: wrap;
    > span{
      color:#0E60DB;
      margin-right: 8px;
      cursor: pointer;
    }
    .active{
      border-bottom: 1px solid #0E60DB;
    }
  }
}
</style>