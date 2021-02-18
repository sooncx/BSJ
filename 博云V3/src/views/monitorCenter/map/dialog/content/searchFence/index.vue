<template>
  <div class="MYEltable">
    <el-table
      :data="tableData.slice((currentPage - 1) * pageSize,currentPage * pageSize)"
      style="width: 100%"
      max-height="400"
      height="400"
      :stripe="true"
      :border="true"
      size="mini"
    >
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
        min-width="100"
      >
        <template #default="scope">
          <el-button
            size="mini"
            type="danger"
            @click="releaseBind(scope.row)"
          >解除围栏</el-button>
          <!-- <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="MYElpagination">
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        v-model:current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        v-model:page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        v-model:total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import LoginVue from "@/views/login/Login.vue";
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  toRefs,
  nextTick,
} from "vue";
import { useFunction } from "../../../../function";
export default defineComponent({
  props: {
    vehInfo: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit }) {
    const { getPathIdByVehicleId, removeBound } = useFunction();
    const data = reactive({
      total: 0,
      pageSize: 100,
      currentPage: 1,
      tableData: [],
      Columns: [
        {
          prop: "index",
          label: "序号",
          width: 80,
          fixed: true,
          align: "center",
        },
        {
          prop: "pathName",
          label: "围栏名称",
          width: 120,
          fixed: false,
          align: "center",
        },
        {
          prop: "param",
          label: "围栏类型",
          width: 100,
          fixed: false,
          align: "center",
        },
        {
          prop: "belongUser",
          label: "是否是当前用户设置",
          width: 100,
          fixed: false,
          align: "center",
        },
      ],
      format(val: any, prop: string) {
        if (prop == "param") {
          switch (val.toString()) {
            case "0":
              return "禁止驶出区域";
              break;
            case "1":
              return "禁止驶入区域";
              break;
            case "2":
              return "蓝牙物流锁区域";
              break;
            case "3":
              return "限速区域";
              break;
            default:
              break;
          }
        } else if (prop == "belongUser") {
          return val ? "是" : "否";
        }
        return val;
      },
      async releaseBind(val: any) {
        const params = {
          vehicleId: props.vehInfo.V,
          pathId: val.pathId,
          groupId: props.vehInfo.M,
        };
        const res = await removeBound(params);
        if (res == 1) {
          data.getTableData();
        }
      },
      sizeChange(val: number) {
        data.pageSize = val;
      },
      currentChange(val: number) {
        data.currentPage = val;
      },
      async getTableData() {
        const res = await getPathIdByVehicleId(props.vehInfo.V);
        data.tableData = res.map((item: any, index: number) => ({
          ...item,
          index: index + 1,
        }));
        data.total = data.tableData.length;
      },
    });
    nextTick(() => {
      data.getTableData();
    });
    return {
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.MYEltable {
  width: 100%;
  height: 450px;
  margin-top: -1px;
}
.MYElpagination {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 16px;
}
</style>