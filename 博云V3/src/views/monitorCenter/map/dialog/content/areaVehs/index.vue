<template>
  <Eldialog
    v-bind="$attrs"
    v-model:visible="show"
    width="800px"
    title="区域查车"
  >
    <template v-slot:form>
      <div class="header">
        <div class="left">
          <div>
            <p>总数:</p>
            {{all}}
          </div>
          <div>
            <p>在线数:</p>
            {{online}}
          </div>
          <div>
            <p>离线数:</p>
            {{offline}}
          </div>
        </div>
        <div class="right">
          <el-button
            type="primary"
            plain
            size="mini"
            v-if="tableData.length > 0"
            @click="exportData"
          >导出</el-button>
        </div>
      </div>
      <div class="MYEltable">
        <el-table
          v-loading="loading"
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
        </el-table>
        <div class="MYElpagination">
          <el-pagination
            @size-change="(val) => pageSize = val"
            @current-change="(val) => currentPage= val"
            :current-page="currentPage"
            :page-sizes="[100, 200, 500]"
            v-model:page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            v-model:total="total"
          >
          </el-pagination>
        </div>
      </div>
    </template>
  </Eldialog>
</template>
<script lang="ts">
import Eldialog from "@/components/Eldialog/index.vue";
import { useFunction } from "../../../../function";
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  toRefs,
  nextTick,
  computed,
  watch,
} from "vue";
import { GetGeo } from "@/api/apiFn";
export default defineComponent({
  components: {
    Eldialog,
  },
  props: {
    areaVehDialogData: {
      type: Object,
      default: null,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { exportVehicleInArea, SearchVehicleInArea } = useFunction();
    const show = computed({
      get: () => props.visible,
      set: (val) => {
        emit("update:visible", val);
      },
    });
    const data = reactive({
      total: 0,
      pageSize: 100,
      currentPage: 1,
      online: 0,
      offline: 0,
      all: 0,
      loading: false,
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
          prop: "P",
          label: "车牌号",
          width: 100,
          fixed: false,
          align: "center",
        },
        {
          prop: "D",
          label: "时间",
          width: 150,
          fixed: false,
          align: "center",
        },
        {
          prop: "S",
          label: "速度",
          width: 80,
          fixed: false,
          align: "center",
        },
        {
          prop: "address",
          label: "地址",
          width: 250,
          fixed: false,
          align: "center",
        },
      ],
      format(val: any, prop: string) {
        switch (prop) {
          case "S":
            return val + "m/h";
            break;
          default:
            return val;
            break;
        }
      },
      clear() {
        data.all = 0;
        data.online = 0;
        data.offline = 0;
        data.pageSize = 100;
        data.currentPage = 1;
        data.tableData = [];
        data.total = 0;
      },
      async exportData() {
        exportVehicleInArea(props.areaVehDialogData);
      },
      async getTableData() {
        const val = await SearchVehicleInArea(props.areaVehDialogData);
        if (!val || val.C == 0 || !val.vehData || val.vehData.length == 0) {
          data.clear();
        } else {
          data.loading = true;
          let arr: any = [];
          data.all = val.C;
          data.online = val.Z;
          data.offline = val.L;
          arr = val.vehData.map((item: any, index: number) => ({
            lat: item.W,
            lon: item.J,
            tag: index,
          }));
          const addressList = await GetGeo(arr);
          data.tableData = val.vehData.map((item: any, index: number) => ({
            ...item,
            index: index + 1,
            address: addressList[index].address,
          }));
          data.total = data.tableData.length;
          setTimeout(() => {
            data.loading = false;
          }, 200);
        }
      },
    });
    nextTick(() => {
      watch(
        () => props.visible,
        (val) => {
          if (val) {
            data.clear();
            data.getTableData();
          }
        },
        {
          immediate: true,
        }
      );
    });

    return {
      show,
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.header {
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  .left {
    max-width: 300px;
    display: flex;
    align-content: center;
    justify-content: space-between;
    div {
      padding-right: 16px;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
  }
}
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
::v-deep(.el-table .cell) {
  padding-right: 20px !important;
  padding-left: 20px !important;
}
</style>