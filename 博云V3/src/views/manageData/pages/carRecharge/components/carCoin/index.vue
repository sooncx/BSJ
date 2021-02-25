<template>
  <div class="carRecharge">
    <!--头部搜索 -->
    <div class="header">
      <div class="header__top">
        <div class="header__top__left">
          <div class="item">
            <label>划拨用户</label>
            <div class="group">
              <UserSearch placeholder="请选择用户" v-model:value="userInfoId" />
            </div>
          </div>
          <div class="item" v-show="type === ''">
            <label>划拨币数</label>
            <div class="group">
              <a-input v-model:value="userRechargeForm.chargeNum"></a-input>
            </div>
          </div>
          <div class="item button" v-show="type === ''">
            <a-button type="primary" @click="userRecharge">划拨</a-button>
          </div>
          <div class="item" v-show="type === 'log'">
            <label>选择日期</label>
            <SelectDate v-model:value="rangeDate" @selectDay="onExpireTime" dateType="all" />
          </div>
        </div>
        <div class="header__top__right" v-show="type === 'log'">
          <div class="item button">
            <a-button type="primary" @click="onSearch">
              <template #icon><i class="iconfont icon icon-sousuo"></i></template>
              搜索</a-button>
          </div>
          <div class="item button">
            <a-button>
              <template #icon><i :class="['iconfont', 'icon', 'icon-daochu']"></i></template>
              导出
            </a-button>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <!-- 表格  -->
      <div class="table detailTable" ref="tableBox">
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          style="width: 100%;position:absolute;"
          :height="offsetHeight"
          border
          size="small"
        >
          <el-table-column prop="userBCorpName" label="公司名" align="center" width="120"></el-table-column>
          <el-table-column prop="userB" label="账号" align="center" width="180"></el-table-column>
          <el-table-column prop="money" align="center" label="划拨币数"></el-table-column>
          <el-table-column prop="operTime" align="center" label="操作人[划拨时间]"></el-table-column>
          <el-table-column prop="moneyAfter" align="center" label="可使用币数"></el-table-column>
        </el-table>
      </div>
      <!-- 分页数据 -->
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
import { UserSearch } from '@/components/UserSearch';
import SelectDate from "@/views/manageData/module/src/SelectDate.vue";
import API from "@/api/manageData";
import dayJs from "dayjs";
import { ElMessage } from 'element-plus';
export default defineComponent({
  components: {
    UserSearch,
    SelectDate
  },
  props: {
    // 空字符 车币划拨 log 车币划拨记录
    type: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const tableBox = ref();
    const offsetHeight = ref();
    nextTick(() => {
      offsetHeight.value = tableBox.value.offsetHeight;
    });
    const data = reactive({
      userInfoId: null,                               // 用户搜索id
      tableLoading: false,
      userRechargeForm: {                             // 划拨功能表单
        userId:null,                                  // 提交用户ID
        chargeNum: null,                              // 提交数量
      },
      search: {                                       // 搜索功能表单
        userId: null,                                 // 用户ID
        startTime: '',                                // 开始时间
        endTime: '',                                  // 结束时间
        pageNumber: 0,
        pageSize:0,
      },
      tableData : <any>[],                            // 表格数据
      pagination :{                                   // 分页配置
        showTotal: (total:string) => `共 ${total} 条数据`,  // 显示总数
        showSizeChanger: true,                        // 是否允许选中 指定数量
        pageSize: 40,                                 // 分页数量
        total: 0,
        current:1,
        pageSizeOptions: ['40','60','80','100'],      // 指定数量
      },
      rangeDate: [                                    // 日期默认时间值
        dayJs(new Date().getTime() - 3600 * 1000 * 24 * 30).format(
          "YYYY-MM-DD 00:00:00"
        ),
        dayJs(new Date()).format("YYYY-MM-DD 23:59:59"),
      ]
    });

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

    // 搜索功能
    const onSearch = () => {
      data.pagination.current = 1;
      getData();
    }

    // 获取数据
    const getData = async () => {
      data.tableLoading = true;
      data.tableData = [];
      data.search.userId = data.userInfoId;
      data.search.pageNumber = data.pagination.current;
      data.search.startTime = data.rangeDate[0];
      data.search.endTime = data.rangeDate[1];
      data.search.pageSize = data.pagination.pageSize;
      try {
        const { obj,flag,msg } = await API.pageRechargeLog(data.search);
        if(flag !== 1) throw msg;
        data.tableData = obj.data.logList;
        data.pagination.total = data.tableData.length;
      } catch (error) {
        ElMessage.error(error);
      }
      data.tableLoading = false;
    }

    nextTick(()=>{
      // 判断如果当前是记录 则去获取数据
      if(props.type === 'log') getData();
    });
    
    // 划拨功能数据提交
    const userRecharge = async () => {
      try {
        data.userRechargeForm.userId = data.userInfoId;
        if(!data.userRechargeForm.chargeNum) throw '请输入划拨币数！！';
        if(!data.userRechargeForm.userId) throw '请选择用户！！';
        const { obj,flag,msg } = await API.userRecharge(data.userRechargeForm);
        if(flag !== 1) throw msg;
        data.tableData.push({
          userBCorpName: obj.data.userBCorpName,
          userB: obj.data.userB,
          money: obj.data.money,
          operTime: obj.data.operTime,
          moneyAfter: obj.data.moneyAfter
        });
        data.pagination.total = data.tableData.length;
        emit("uploadUserRecharge");
      } catch (error) {
        ElMessage.error(error);
      }
    }

    return {
      tableBox,
      onExpireTime,
      offsetHeight,
      userRecharge,
      onSearch,
      currentChange,
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
@import "../../../../../dataReport/module/css/index";
.carRecharge{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction:column;
  .header{
    padding: 0 17px;
    margin-bottom: 10px;
    &__top{
      width: 100%;
      display: flex;
      line-height: 32px;
      flex-wrap: wrap;
      justify-content: space-between;
      &__left,&__right{
        display:flex;
        flex-wrap: wrap;
      }
    }
    .item{
      display: flex;
      margin-top:10px;
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
    .button{
      margin-right: 0px;
      button{
        margin-left: 8px;
      }
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