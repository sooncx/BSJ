<template>
  <div class="detailTable">
    <el-table
      :data="tableData"
      size="small"
      height="400px"
      max-height="400px"
      v-loading="loading"
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
        width="150"
        header-align="center"
        align="center"
        :formatter="formatter"
      />
      <el-table-column
        label="报警类型"
        prop="type"
        width="120"
        header-align="center"
        align="center"
        :formatter="formatter"
      />
      <el-table-column
        label="速度"
        prop="speedBegin"
        width="100"
        header-align="center"
        align="center"
        :formatter="formatter"
      />
      <el-table-column
        label="处理方式"
        prop="result"
        width="100"
        header-align="center"
        align="center"
        :formatter="formatter"
      />
      <el-table-column
        label="处理账号"
        prop="userName"
        width="100"
        header-align="center"
        align="center"
        :formatter="formatter"
      />
      <el-table-column
        label="开始时间"
        prop="timeBegin"
        width="145"
        header-align="center"
        align="center"
        :formatter="formatter"
      />
      <el-table-column
        label="结束时间"
        prop="timeEnd"
        width="145"
        header-align="center"
        align="center"
        :formatter="formatter"
      />
      <el-table-column
        label="开始位置"
        width="800"
        header-align="center"
        align="center"
      >
        <template #default="{ $index }">
          {{ startAddress[$index] && startAddress[$index].address || '--' }}
        </template>
      </el-table-column>
      <el-table-column
        label="结束位置"
        width="800"
        header-align="center"
        align="center"
      >
        <template #default="{ $index }">
          {{ endAddress[$index] && endAddress[$index].address || '--' }}
        </template>
      </el-table-column>
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
import { GetGeo } from "@/api/apiFn";
import API from "@/api/dataReport";
import APIType from "@/api/dataReport/type";

export default defineComponent({
  props: {
    row: {
      type: Object as PropType<ElementOf<APIType.pageAlarmRes["obj"]["data"]>>,
      default: null,
    },
  },
  setup(props) {
    const loading = ref(false);
    const tableData = ref(<APIType.listAlarmDetailRes["obj"]["data"]>[]);

    // 获取数据
    const getData = async () => {
      loading.value = true;
      const info = {
        vehicleId: props.row.vehicleId,
        type: props.row.type,
        startTime: props.row.startTime,
        endTime: props.row.endTime,
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
      };
      const { flag, obj, msg } = await API.listAlarmDetail(info);

      tableData.value = obj.data;
      pagination.total = obj.total;

      let startPosList: { lat: number; lon: number; tag: number }[] = [];
      let endPosList: { lat: number; lon: number; tag: number }[] = [];
      obj.data.forEach((item: any, index: number) => {
        startPosList.push({
          lat: item.latBegin,
          lon: item.lonBegin,
          tag: index,
        });
        endPosList.push({
          lat: item.latEnd,
          lon: item.lonEnd,
          tag: index,
        });
      });

      await getAddress(startPosList, "start");
      await getAddress(endPosList, "end");

      loading.value = false;
    };

    nextTick(() => {
      getData();
    });

    // 获取地址
    const address = reactive({
      startAddress: [],
      endAddress: [],
    });
    const getAddress = async (
      posList: { lat: number; lon: number; tag: number }[],
      type: string
    ) => {
      const res = await GetGeo(posList);
      if (type === "start") {
        address.startAddress = Object.assign(res, address.startAddress);
      } else {
        address.endAddress = Object.assign(res, address.endAddress);
      }
    };

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
        type: props.row.type,
        startTime: props.row.startTime,
        endTime: props.row.endTime
      }
      API.exportAlarmDetail(info);
    };

    return {
      loading,
      tableData,
      ...toRefs(pagination),
      ...toRefs(address),
      paginationChange,
      onExport,
      formatter
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

