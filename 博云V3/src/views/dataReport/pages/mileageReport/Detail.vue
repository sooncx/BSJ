<template>
  <div class="detailTable">
    <el-table
      :data="tableData"
      size="small"
      height="400px"
      max-height="400px"
      border
    >
      <el-table-column
        label="序号"
        width="50"
        header-align="center"
        align="center"
      >
        <template #default="{ $index }">{{
          (current - 1) * pageSize + ($index + 1)
        }}</template>
      </el-table-column>
      <el-table-column
        label="车牌号码"
        prop="plate"
        header-align="center"
        align="center"
        :formatter="formatter"
      />
      <el-table-column
        label="日期"
        prop="date"
        header-align="center"
        align="center"
        :formatter="formatter"
      />
      <el-table-column
        label="开始里程(km)"
        prop="mileageBegin"
        header-align="center"
        align="center"
        :formatter="formatter"
      />
      <el-table-column
        label="结束里程(km)"
        prop="mileageEnd"
        header-align="center"
        align="center"
        :formatter="formatter"
      />
      <el-table-column
        label="行驶里程(km)"
        prop="thisMileage"
        header-align="center"
        align="center"
        :formatter="formatter"
      />
    </el-table>

    <div class="detailTable__footer">
      <a-pagination
        :total="total"
        :show-total="(total) => `共: ${total} 条`"
        size="small"
        v-model:pageSize="pageSize"
        v-model:current="current"
        @change="paginationChange"
      />

      <a-button type="primary" @click="onExport" v-permission="150104">
        <i class="iconfont icon-daochu"></i>
        导出</a-button
      >
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  PropType,
  reactive,
  toRefs,
  nextTick,
} from "vue";
import { ElementOf } from "@/utils";
import API from "@/api/dataReport";
import APIType from "@/api/dataReport/type";

export default defineComponent({
  props: {
    row: {
      type: Object as PropType<
        ElementOf<APIType.pageMileageRes["obj"]["data"]>
      >,
      default: null,
    },
  },
  setup(props) {
    const loading = ref(false);
    const tableData = ref(<APIType.listMileageDetailRes["obj"]["data"]>[]);

    // 获取数据
    const getData = async () => {
      loading.value = true;
      const info = {
        vehicleId: props.row.vehicleId,
        startTime: props.row.beginTimeS,
        endTime: props.row.endTimeS,
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
      };
      const { flag, obj, msg } = await API.listMileageDetail(info);

      tableData.value = obj.data;
      pagination.total = obj.total;

      loading.value = false;
    };

    nextTick(() => {
      getData();
    });

    // 分页
    const pagination = reactive({
      total: 0,
      current: 1,
      pageSize: 100,
    });

    const paginationChange = (curreng: number, pageSize: number) => {
      getData();
    };

    const formatter = (row: any, column: any, cellValue: any) => {
      let str = "--";
      return cellValue || str;
    };

    // 明细导出
    const onExport = () => {
      const info = {
        vehicleId: props.row.vehicleId,
        startTime: props.row.beginTimeS,
        endTime: props.row.endTimeS
      }
      API.exportMileageDetail(info);
    };

    return {
      tableData,
      ...toRefs(pagination),
      paginationChange,
      onExport,
      formatter,
    };
  },
});
</script>
<style lang="less" scoped>
@import "../../module/css/index.less";
.detailTable__footer {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}
</style>

