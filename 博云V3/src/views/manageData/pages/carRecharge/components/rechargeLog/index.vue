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
          <el-table-column
            prop="groupName"
            label="车组"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            prop="plate"
            align="center"
            label="车牌号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="terminalNo"
            align="center"
            label="设备号">
          </el-table-column>
          <el-table-column
            prop="newExpire"
            align="center"
            label="到期时间">
          </el-table-column>
          <el-table-column
            prop="money"
            align="center"
            label="消耗币数">
          </el-table-column>
          <el-table-column
            prop="operTime"
            align="center"
            label="操作人[时间]">
          </el-table-column>
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
<script>
import { defineComponent, toRefs,ref,nextTick  } from "vue";
import { VehFuzzySearch } from "@/components/VehGroup/index";
import { PlusOutlined,MinusOutlined } from '@ant-design/icons-vue';
import SelectDate from "@/views/manageData/module/src/SelectDate.vue";
import {
  data,
  currentChange,
  onExpireTime,
  getData,
  onSearch,
} from "./index";
export default defineComponent({
  components: {
    VehFuzzySearch,
    PlusOutlined,
    MinusOutlined,
    SelectDate
  },
  setup() {
    const tableBox = ref(null);
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
@import "./index.less";
</style>