<template>
  <div class="carRecharge">
    <div class="header">
      <div class="header__top">
        <div class="header__top__left">
          <div class="item">
            <label>车辆</label>
            <VehFuzzySearch
              v-model:value="fuzzyValue"
              placeholder="输入车牌号/设备号/SIM号"
              :groupVisible="false"
              :tagList="[1, 2, 3]"
              :inputStyle="{width: '300px'}"
            />
          </div>
          <div class="item">
            <label>选择日期</label>
            <SelectDate v-model:value="rangeDate" dateType="date"></SelectDate>
          </div>
          <div class="item date">
            <label>即将到期</label>
            <SelectDate @selectDay="onExpireTime" dateType="day"></SelectDate>
          </div>
        </div>
        <div class="header__top__right">
          <div class="item button">
            <a-button type="primary" @click="onSearch">
              <template #icon><i class="iconfont icon icon-sousuo"></i></template>
              搜索</a-button>
            <a-button>
              <template #icon><i :class="['iconfont', 'icon', 'icon-daochu']"></i></template>
              导出
            </a-button>
          </div>
        </div>
      </div>
      <p style="padding-top:5px;">续费车辆总数：{{plateCount}}个 , 消耗车币总数：{{moneyAll}}个</p>
    </div>
    <div class="content">
      <div class="table detailTable" ref="tableBox">
        <el-table
          :data="tableData"
          v-loading="tableLoading"
          style="width: 100%;position:absolute;"
          :height="offsetHeight"
          border
          size="small"
        >
          <el-table-column prop="groupName" align="center" label="车组"  width="120"></el-table-column>
          <el-table-column prop="plate" align="center" label="车牌号" width="180"></el-table-column>
          <el-table-column prop="terminalNo" align="center" label="设备号"></el-table-column>
          <el-table-column prop="newExpire" align="center" label="到期时间"></el-table-column>
          <el-table-column prop="money" align="center" label="消耗币数"></el-table-column>
          <el-table-column prop="operTime" align="center" label="操作人[时间]"></el-table-column>
        </el-table>
      </div>
      <div class="page">
        <a-pagination
          show-size-changer
          :page-size-options="pagination.pageSizeOptions"
          :total="pagination.total"
          :show-total="(total) => `共: ${pagination.total} 条`"
          size="small"
          v-model:pageSize="pagination.pageSize"
          v-model:current="pagination.current"
          @change="currentChange"
          @showSizeChange="currentChange"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, toRefs,ref,nextTick,reactive  } from "vue";
import { VehFuzzySearch } from "@/components/VehGroup/index";
import { PlusOutlined,MinusOutlined } from '@ant-design/icons-vue';
import SelectDate from "@/views/manageData/module/src/SelectDate.vue";
import dayJs from "dayjs";
import API from "@/api/manageData";
import { ElMessage } from 'element-plus';
export default defineComponent({
  components: {
    VehFuzzySearch,
    PlusOutlined,
    MinusOutlined,
    SelectDate
  },
  setup() {
    const data = reactive({
      search: {
        pageNumber: 0,
        pageSize: 0,
        startTime: '',                                  // 开始时间
        endTime: '',                                    // 结束时间
        vid: <string | number>'',                       // 车辆ID
      },
      fuzzyValue: <any>{},                              // 车辆搜索
      tableData : <any>[],                              // 表格数据
      pagination :{                                     // 分页配置
        showTotal: (total:string) => `共 ${total} 条数据`,  // 显示总数
        showSizeChanger: true,                          // 是否允许选中 指定数量
        pageSize: 40,                                   // 分页数量
        total: 0,
        current:1,
        pageSizeOptions: ['40','60','80','100'],        // 指定数量
      },
      rangeDate: [                                      // 选择日期默认日期
        dayJs(new Date().getTime() - 3600 * 1000 * 24 * 31).format(
          "YYYY-MM-DD 00:00:00"
        ),
        dayJs(new Date()).format("YYYY-MM-DD 23:59:59"),
      ],
      expireTimeOptions:[                               // 即将到期
        { value: 3,title: '近三天' },
        { value: 7,title: '近七天' },
        { value: 31,title: '近一个月',}
      ],
      tableLoading: false,
      moneyAll: 0,                                      // 消耗车币总数
      plateCount: 0,                                    // 续费车辆总数
    });

    // 搜索功能
    const onSearch = () => {
      data.pagination.current = 1;
      getData();
    }

    // 获取数据
    const getData = async () => {
      data.tableLoading = true;
      data.tableData = [];
      data.search.pageNumber = data.pagination.current;
      data.search.startTime = data.rangeDate[0];
      data.search.endTime = data.rangeDate[1];
      data.search.pageSize = data.pagination.pageSize;
      data.search.vid ='';
      if(data.fuzzyValue) data.search.vid = data.fuzzyValue.vehicleId;
      try {
        const { obj,flag,msg } = await API.pageVehicleFreeLog(data.search);
        if(flag !== 1) throw msg;
        data.tableData = obj.data.list ? obj.data.list : [];
        data.pagination.total = obj.total ? obj.total : 0;
        data.moneyAll = obj.data.moneyAll ? obj.data.moneyAll : 0;
        data.plateCount = obj.data.plateCount ? obj.data.plateCount : 0;
      } catch (error) {
        ElMessage.error(error);
      }
      data.tableLoading = false;
    }

    // 分页功能
    const currentChange = (page: number, pageSize: number) => {
      data.pagination.current = page;
      data.pagination.pageSize = pageSize;
      getData();
    };

    // 选择即将到期时间
    const onExpireTime = (day:number) => {
      data.rangeDate[0] = dayJs(new Date().getTime() - 3600 * 1000 * 24 * day).format(
        "YYYY-MM-DD 00:00:00"
      );
      data.search.startTime = data.rangeDate[0];
      getData();
    }
    const tableBox = ref();
    const offsetHeight = ref();
    nextTick(() => {
      getData();
      offsetHeight.value = tableBox.value.offsetHeight;
    });
    return {
      tableBox,
      offsetHeight,
      currentChange,
      onExpireTime,
      onSearch,
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
@import "../../../../../dataReport/module/css/index";
.carRecharge{
  display: flex;
  flex-direction: column;
  height: 100%;
  .header{
    padding: 10px 17px;
    &__top{
      width: 100%;
      display: flex;
      line-height: 40px;
      flex-wrap: wrap;
      justify-content: space-between;
      &__left,&__right{
        display:flex;
        flex-wrap: wrap;
      }
    }
    .item{
      display: flex;
      flex-wrap: wrap;
      label{
        display: inline-block;
        margin-right:8px;
      }
      .dateInput{
        input{
          width: 50px;
        }
      }
      margin-right:24px;
    }
    .button{
      margin-right: 0px;
      button{
        margin-left: 8px;
      }
    } 
    .date > span{
      color: #0E60DB;
      margin-right:8px;
      display: inline-block;
      cursor: pointer;
    }
  }
  .content{
    display: flex;
    flex: 1;
    padding: 0 10px;
    flex-direction: column;
    .table{
      flex:1;
      position: relative;
      border: 1px solid #e8e8e8;
    }
    .page{
      padding: 10px;
      display: flex;
      justify-content: flex-end;
    }
  }
}

</style>