<template>
  <Eldialog
    dialogClass="dialog_ocar"
    v-bind="$attrs"
    v-model:visible="show"
    width="800px"
    @closed="closed"
  >
    <template v-slot:all>
      <div class="title">
        <div
          class="item"
          v-for="item in tagItem"
          :key="item"
          @click="tagChange(item)"
          :style="{color:selectedTag == item.value?'#0E60DB !important':''}"
        >{{item.label+"("+item.count+")"}}</div>
        <div class="search">
          <el-input
            placeholder="车牌号/车架号/车组名称"
            suffix-icon="el-icon-search"
            v-model="searchValue"
            size="mini"
          >
          </el-input>
        </div>
      </div>
      <div class="Ocar">
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
              <span
                :title="scope.row[item.prop]"
                :class="{inwarehouse: item.prop == 'status' && scope.row[item.prop] =='在库',
                outwarehouse: item.prop == 'status' && scope.row[item.prop] =='出库',
                losePower:item.prop == 'status' && scope.row[item.prop] =='掉电'
                }"
              >
                {{ format(scope.row[item.prop], item.prop) }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <span class="dialog-footer">
          <span>
            <el-pagination
              @size-change="sizeChange"
              @current-change="currentChange"
              :current-page="currentPage"
              :page-size="pageSize"
              layout="total, prev, pager, next"
              v-model:total="total"
              :pager-count="5"
            >
            </el-pagination>
          </span>
          <!-- 用于布局的无用dom -->
          <span></span>
          <span>
            <el-button
              v-if="total > 0"
              type="primary"
              @click="exportData(selectedTag)"
            >{{selectedTag == 4?"掉电导出":selectedTag == 1?"全部导出":selectedTag == 2?"在库导出":"出库导出"}}</el-button>
          </span>
        </span>
      </div>
    </template>
  </Eldialog>
</template>
<script lang="ts">
import {
  defineComponent,
  toRefs,
  defineAsyncComponent,
  ref,
  nextTick,
  computed,
  reactive,
  watch,
} from "vue";
import Eldialog from "@/components/Eldialog/index.vue";
import { useFunction } from "../../function";
import lodash from "lodash";
export default defineComponent({
  components: {
    Eldialog,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const {
      queryInOutVehicleReportList,
      exportInOutVehicleReport,
    } = useFunction();
    const show = computed({
      get: () => props.visible,
      set: (val) => {
        emit("update:visible", val);
      },
    });
    const data = reactive({
      loading: false,
      selectedTag: 1,
      searchValue: null,
      pageSize: 100,
      currentPage: 1,
      total: 0,
      sizeChange(val: number) {
        data.pageSize = val;
      },
      currentChange(val: number) {
        data.currentPage = val;
      },
      tagItem: [
        {
          label: "全部",
          count: 0,
          value: 1,
        },
        {
          label: "在库",
          count: 0,
          value: 2,
        },
        {
          label: "出库",
          count: 0,
          value: 3,
        },
        {
          label: "掉电",
          count: 0,
          value: 4,
        },
      ],
      tableData: [] as any,
      tableDataCopy: [] as any,
      Columns: [
        {
          prop: "plate",
          label: "车牌号",
          width: 80,
          fixed: true,
          align: "center",
        },
        {
          prop: "frameNo",
          label: "车架号",
          width: 120,
          fixed: false,
          align: "center",
        },
        {
          prop: "status",
          label: "状态",
          width: 60,
          fixed: true,
          align: "center",
        },
        {
          prop: "time",
          label: "时间",
          width: 120,
          fixed: false,
          align: "center",
        },
        {
          prop: "groupName",
          label: "车组名",
          width: 80,
          fixed: true,
          align: "center",
        },
        {
          prop: "remark",
          label: "备注",
          width: 120,
          fixed: false,
          align: "center",
        },
      ],
      format(data: any, prop: string) {
        return data;
      },
      closed() {},
      tagChange(item: any) {
        data.selectedTag = item.value;
        // data.total = data.tagItem[item.value - 1].count;
        setTimeout(() => {
          data.filterData();
        }, 100);
      },
      setDate(num: number) {
        for (let i = 0; i < num; i++) {
          data.tableData.push({
            frameNo: "frameNo" + i,
            groupName: "groupName" + i,
            plate: "plate" + i,
            remark: "车架号由 LGBH12E0XGY422575 变为 LFV3B2FY7K3618524",
            status:
              Math.random() * 10 > 3
                ? "出库"
                : Math.random() * 10 > 5
                ? "在库"
                : "掉电",
            time: "2020-12-31 09:23:54",
          });
        }
        data.tableDataCopy = lodash.cloneDeep(data.tableData);
        let count1 = 0;
        let count3 = 0;
        let count4 = 0;
        data.tableDataCopy.map((item: any) => {
          if (item.status == "在库") {
            count1++;
          } else if (item.status == "出库") {
            count3++;
          } else if (item.status == "掉电") {
            count4++;
          }
        });
        data.tagItem[1].count = count1;
        data.total = data.tagItem[0].count = data.tableDataCopy.length;
        data.tagItem[2].count = count3;
        data.tagItem[3].count = count4;
      },
      exportData(type: number) {
        if (type == 1) {
          exportInOutVehicleReport({});
          exportInOutVehicleReport({ status: 3 });
        } else {
          exportInOutVehicleReport({ status: type - 1 });
        }
      },
      async getTableData() {
        data.tableData = [];
        // data.setDate(100);
        data.loading = true;
        const res1 = await queryInOutVehicleReportList({});
        const res2 = await queryInOutVehicleReportList({ status: 3 });
        if (res1) {
          data.tableData.push(...res1);
        }
        if (res2) {
          data.tableData.push(...res2);
        }
        data.loading = false;
        data.tableDataCopy = lodash.cloneDeep(data.tableData);
        let count1 = 0;
        let count3 = 0;
        let count4 = 0;
        data.tableDataCopy.map((item: any) => {
          if (item.status == "在库") {
            count1++;
          } else if (item.status == "出库") {
            count3++;
          } else if (item.status == "掉电") {
            count4++;
          }
        });
        data.tagItem[1].count = count1;
        data.total = data.tagItem[0].count = data.tableDataCopy.length;
        data.tagItem[2].count = count3;
        data.tagItem[3].count = count4;
      },
      filterData() {
        let cloneData = lodash.cloneDeep(data.tableDataCopy);
        switch (data.selectedTag) {
          case 1:
            break;
          case 2:
            cloneData = cloneData.filter((item: any) => {
              return item.status == "在库";
            });
            break;
          case 3:
            cloneData = cloneData.filter((item: any) => {
              return item.status == "出库";
            });
            break;
          case 4:
            cloneData = cloneData.filter((item: any) => {
              return item.status == "掉电";
            });
            break;
          default:
            break;
        }
        data.currentPage = 1;
        if (!data.searchValue || data.searchValue == "") {
          data.tableData = [...cloneData];
          data.total = data.tableData.length;
          return;
        }
        let arr = [...cloneData].filter((item) => {
          return (
            item.plate.indexOf(data.searchValue) != -1 ||
            item.groupName.indexOf(data.searchValue) != -1 ||
            item.frameNo.indexOf(data.searchValue) != -1
          );
        });
        data.tableData = arr;
        data.total = arr.length;
      },
    });
    nextTick(() => {
      watch(
        () => props.visible,
        (val) => {
          if (val) {
            data.getTableData();
          }
        }
      );
      watch(
        () => data.searchValue,
        (val) => {
          data.filterData();
        }
      );
    });
    return {
      show,
      ...toRefs(data),
      ...toRefs(props),
    };
  },
});
</script>
<style lang="less" scoped>
.title {
  height: 50px;
  width: 100%;
  padding: 0px 16px;
  display: flex;
  // border-bottom: 1px solid #e4e7eb;
  align-items: center;
  .item {
    border: 1px solid #e4e7eb;
    margin-right: -1px;
    padding: 8px 10px;
    color: #999;
    cursor: pointer;
    &:hover {
      color: #0e60db;
    }
  }
  .search {
    margin-left: auto;
    margin-right: 30px;
    ::v-deep(.el-input--mini .el-input__inner) {
      width: calc(100%);
      border: 1px solid rgb(223, 223, 223);
      border-radius: 50px !important;
      background: rgb(255, 255, 255) !important;
      color: #999;
    }
    ::v-deep(.el-icon-search) {
      color: #999 !important;
    }
    ::v-deep(.el-input__inner::placeholder) {
      color: #999 !important;
    }
    /* 谷歌 */
    ::v-deep(.el-input__inner::-webkit-input-placeholder) {
      color: #999 !important;
    }
    /* 火狐 */
    ::v-deep(.el-input__inner:-moz-placeholder) {
      color: #999 !important;
    }
    /*ie*/
    ::v-deep(.el-input__inner:-ms-input-placeholder) {
      color: #999 !important;
    }
  }
}
.Ocar {
  height: 400px;
}
.footer {
  width: 100%;
  height: 60px;
  padding: 10px 16px;
  // border-top: 1px solid #d9e0e9;
  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
::v-deep(.el-button) {
  border-radius: 0 !important;
}
::v-deep(.el-button--primary) {
  background: #0e60db !important;
  border-color: #0e60db !important;
  &:hover {
    opacity: 0.8;
  }
}
.inwarehouse {
  border-radius: 30px;
  background: green;
  padding: 4px 10px;
  color: #fff;
}
.outwarehouse {
  border-radius: 30px;
  background: red;
  padding: 4px 10px;
  color: #fff;
}
.losePower {
  border-radius: 30px;
  background: rgb(184, 184, 184);
  padding: 4px 10px;
  color: #fff;
}
</style>
<style lang="less">
.dialog_ocar {
  .el-dialog__headerbtn {
    top: 16px !important;
  }
}
</style>