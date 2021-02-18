<template>
  <div class="carRecharge">
    <!-- 头部搜索 -->
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
            <span @click="changeHighSearch"><PlusOutlined v-if="highSearch"/><MinusOutlined v-else/>高级筛选</span>
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
      <div class="header__bottom" ref="headerBottom" v-show="!highSearch">
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
    <div class="content" >
      <!-- 表格 -->
      <div class="table detailTable" ref="tableBox">
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          style="width: 100%;position:absolute;"
          :height="offsetHeight"
          @selection-change="handleSelectionChange"
          border
          size="small"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="groupName" label="所属车组" align="center" width="120"></el-table-column>
          <el-table-column prop="plate" label="车牌号" align="center" width="180"></el-table-column>
          <el-table-column prop="terminalNo" align="center" label="设备号"></el-table-column>
          <el-table-column prop="sim" align="center" label="SIM卡"></el-table-column>
          <el-table-column prop="activationTme" align="center" label="激活时间" width="150"></el-table-column>
          <el-table-column prop="state" align="center" label="状态">
            <template #default="{ row }">
              {{ getStatusStr(row.state) }}
            </template>
          </el-table-column>
          <el-table-column prop="vehState" align="center" label="车辆状态"></el-table-column>
          <el-table-column prop="displayYear" align="center" label="续费年限"></el-table-column>
          <el-table-column prop="installDate" align="center" width="150" label="安装时间"></el-table-column>
          <el-table-column prop="expireDate" align="center" width="150" label="到期时间"></el-table-column>
          <el-table-column v-if="activeVisible" align="center" prop="button" label="操作">
            <template #default="scope">
              <div class="setting" v-if="scope.row.expireDate !== undefined">
                <span @click="carRecharge(scope.row)">续费</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="page">
        <div class="page__left">
          <a-button type="primary" v-permission="160404" @click="batchRecharge" v-if="renew === 0">批量续费</a-button>
          <a-button type="primary" v-permission="160404" @click="batchIntoNoRecharge">批量转入不续费</a-button>
          <a-button type="primary" v-permission="160408" @click="customNoRecharge(3)">自定义续费</a-button>
          <a-button type="primary" v-permission="160406" @click="customNoRecharge(1)">自定义不续费</a-button>
          <a-button type="primary" v-permission="160407" @click="customNoRecharge(2)">自定义不续费转出</a-button>
        </div>
        <div class="page__right">
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
    <!-- 续费窗口 -->
    <carRechargeModal 
    v-bind="$attrs" 
    @submitData="carRechargeModalSubmitData" 
    v-model:visible="carRechargeModelVisible" 
    :carRechargeNumber="carRechargeNumber" 
    :dataItem="selectTableItem"></carRechargeModal>
    <!-- 自定义不续费 | 自定不续费转出 -->
    <carCustomNoRechargeModal 
    v-bind="$attrs" 
    v-model:visible="customNoRechargeVisible" 
    :customNoRechargeType="customNoRechargeType"
    @customNoRechargeOk="customNoRechargeOk"
    @customBatchRechargeOk="customBatchRechargeOk"
    ></carCustomNoRechargeModal>
    <!-- 自定义补习费 | 自定不续费转出  提交数据成功后 显示结果的表格 -->
    <carCustomNoRechargeOkModal
    v-bind="$attrs"
    v-model:visible="carCustomNoRechargeOkVisible"
    :item="customNoRechargeOkRes"
    ></carCustomNoRechargeOkModal>

  </div>
</template>
<script lang="ts">
import { defineComponent, toRefs,ref,nextTick  } from "vue";
import { VehGroupSelect } from "@/components/VehGroup/index";
import { carRechargeModal,carCustomNoRechargeModal,carCustomNoRechargeOkModal } from "@/views/manageData/module/index";
import { PlusOutlined,MinusOutlined } from '@ant-design/icons-vue';
import SelectDate from "@/views/manageData/module/src/SelectDate.vue";
import {
  handleSelectionChange,
  onRenew,
  onExpireTime,
  data,
  onSearch,
  customNoRechargeOk,
  getData,
  currentChange,
  batchRecharge,
  carRecharge,
  batchIntoNoRecharge,
  customNoRecharge,
  customBatchRechargeOk,
  getStatusStr,
} from "./index";
export default defineComponent({
  components: {
    VehGroupSelect,
    PlusOutlined,
    MinusOutlined,
    SelectDate,
    carRechargeModal,
    carCustomNoRechargeModal,
    carCustomNoRechargeOkModal
  },
  setup(props, { emit }) {
    const tableBox = ref();
    const headerBottom = ref();
    const offsetHeight = ref();
    nextTick(() => {
      offsetHeight.value = tableBox.value.offsetHeight;
      onSearch();
    });
    
    // 高级搜索显示
    const changeHighSearch = () => {
      data.highSearch = !data.highSearch;
      if(data.highSearch){
        offsetHeight.value = offsetHeight.value + headerBottom.value.offsetHeight + 8;
        return;
      }
      setTimeout(()=>{
        offsetHeight.value = offsetHeight.value - headerBottom.value.offsetHeight - 8;
      },100);
    }

    // 续费成功回调
    const carRechargeModalSubmitData = () => {
      getData();
      emit("uploadUserRecharge");
    }
    return {
      headerBottom,
      customBatchRechargeOk,
      carRechargeModalSubmitData,
      getStatusStr,
      tableBox,
      offsetHeight,
      getData,
      changeHighSearch,
      onSearch,
      customNoRechargeOk,
      onRenew,
      handleSelectionChange,
      carRecharge,
      currentChange,
      batchRecharge,
      onExpireTime,
      batchIntoNoRecharge,
      customNoRecharge,
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
@import "../../../../../dataReport/module/css/index";
@import "./index.less";
</style>