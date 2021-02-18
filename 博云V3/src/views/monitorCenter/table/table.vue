<template>
  <div class="tableBox">
    <div class="MYEltable">
      <el-table
        :data="tableData"
        style="width: 100%"
        max-height="100%"
        height="100%"
        :stripe="true"
        :border="true"
        size="mini"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="36"
        >
        </el-table-column>
        <el-table-column
          v-for="(item,index) in Columns"
          :key="index"
          :label="item.label"
          :min-width="item.width"
          :fixed="item.fixed"
          :prop="item.prop"
          :align="item.align"
        >
          <template #default="scope">
            <span :title="scope.row[item.prop]">
              {{ format(scope.row[item.prop], item.prop) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          min-width="120"
        >
          <template #default="scope">
            <el-button
              size="mini"
              type="danger"
              @click="deleteFence(scope.row)"
            >操作</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="MYElpagination">
      <el-pagination
        @size-change="search"
        @current-change="search"
        v-model:current-page="currentPage"
        :page-sizes="[50, 100, 200]"
        v-model:page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        v-model:total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  toRefs,
  nextTick,
} from "vue";
export default defineComponent({
  props: {
    vehInfo: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      total: 0,
      pageSize: 50,
      currentPage: 1,
      tableData: [
        { FenceName: "123", FenceType: 1, userSetting: 0 },
        { FenceName: "234", FenceType: 0, userSetting: 0 },
        { FenceName: "421", FenceType: 0, userSetting: 1 },
        { FenceName: "123", FenceType: 1, userSetting: 0 },
        { FenceName: "234", FenceType: 0, userSetting: 0 },
        { FenceName: "421", FenceType: 0, userSetting: 1 },
        { FenceName: "123", FenceType: 1, userSetting: 0 },
        { FenceName: "234", FenceType: 0, userSetting: 0 },
        { FenceName: "421", FenceType: 0, userSetting: 1 },
        { FenceName: "123", FenceType: 1, userSetting: 0 },
        { FenceName: "234", FenceType: 0, userSetting: 0 },
        { FenceName: "421", FenceType: 0, userSetting: 1 },
        { FenceName: "123", FenceType: 1, userSetting: 0 },
        { FenceName: "234", FenceType: 0, userSetting: 0 },
        { FenceName: "421", FenceType: 0, userSetting: 1 },
        { FenceName: "123", FenceType: 1, userSetting: 0 },
        { FenceName: "234", FenceType: 0, userSetting: 0 },
        { FenceName: "421", FenceType: 0, userSetting: 1 },
      ],
      Columns: [
        {
          prop: "index",
          label: "序号",
          width: 80,
          fixed: true,
          align: "center",
        },
        {
          prop: "FenceName",
          label: "车牌号码",
          width: 100,
          fixed: false,
          align: "center",
        },
        {
          prop: "FenceType",
          label: "报警类型",
          width: 100,
          fixed: false,
          align: "center",
        },
        {
          prop: "userSetting",
          label: "报警时间",
          width: 80,
          fixed: false,
          align: "center",
        },
        {
          prop: "userSetting",
          label: "速度",
          width: 80,
          fixed: false,
          align: "center",
        },
        {
          prop: "userSetting",
          label: "所属车组",
          width: 80,
          fixed: false,
          align: "center",
        },
      ],
      format(val: any, prop: string) {
        return val;
      },
      deleteFence(val: any) {
        console.log(val);
      },
      search() {
        console.log(data.pageSize, data.currentPage);
      },
      handleSelectionChange(val: any) {
        console.log(val);
      },
      getTableData() {
        data.tableData = data.tableData.map((item, index) => ({
          ...item,
          index: index + 1,
        }));
      },
    });
    nextTick(() => {
      data.getTableData();
      data.total = data.tableData.length;
    });
    return {
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.tableBox {
  width: 100%;
  height: 100%;
  position: relative;
  .MYEltable {
    width: 100%;
    height: calc(100% - 40px);
    min-width: 300px;
  }
  .MYElpagination {
    height: 40px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 16px;
    background: #fff;
  }
}
::v-deep(.el-table--mini td, .el-table--mini th) {
  padding: 3px 0;
}
::v-deep(.el-button--mini, .el-button--mini.is-round) {
  padding: 5px 13px;
}
</style>