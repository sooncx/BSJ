<template>
  <div class="MYEltable">
    <el-table
      :data="tableData.slice((currentPage - 1) * pageSize,currentPage * pageSize)"
      style="width: 100%"
      height="450"
      :stripe="true"
      :border="true"
      size="mini"
      ref="table"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
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
        min-width="60"
      >
        <template #default="scope">
          <div
            @click="addOrDelete(scope.row)"
            class="button"
          >{{type == "add"?"添加":"删除"}}</div>
        </template>
      </el-table-column>
    </el-table>
    <div class="MYElpagination">
      <div class="page">
        <el-pagination
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          v-model:total="total"
          :pager-count="3"
        >
        </el-pagination>
      </div>
      <div
        v-if="type == 'add'"
        class="btn"
      >
        <el-button
          size="mini"
          type="danger"
          @click="bindAll"
        >批量添加</el-button>
        <span>已绑定车辆在选择车辆框不显示</span>
      </div>
      <div
        v-else
        class="btn"
      >
        <el-button
          size="mini"
          type="danger"
          @click="deleteAll"
        >批量删除</el-button>
      </div>
    </div>
  </div>
  <!-- <Eldialog
    width="340px"
    v-model:visible="confirmShow"
  >
    <template v-slot:all>
      <Model
        @confirm="confirmFn()"
        @cancle="confirmShow = false"
      >
        <span>{{confirmTxt}}</span>
      </Model>
    </template>
  </Eldialog> -->
</template>
<script lang="ts">
import LoginVue from "@/views/login/Login.vue";
import { useFunction } from "../../views/monitorCenter/function";
import { ElMessageBox } from "element-plus";
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  toRefs,
  nextTick,
  watch,
} from "vue";
export default defineComponent({
  components: {
    Eldialog: defineAsyncComponent(
      () => import("@/components/Eldialog/index.vue")
    ),
    Model: defineAsyncComponent(
      () =>
        import(
          "../../views/monitorCenter/LeftContent/dialog/contents/RemoveAlarm/model.vue"
        )
    ),
  },
  props: {
    type: {
      type: String,
      default: "add",
    },
    treeList: {
      type: Array,
      default: () => [],
    },
    bindList: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["confirmFnOK"],
  setup(props, { emit }) {
    const { getVehicleChargeByUserId } = useFunction();
    const data = reactive({
      confirmShow: false,
      confirmType: "",
      confirmTxt: "",
      total: 0,
      pageSize: 100,
      currentPage: 1,
      tableData: [],
      table: null as any,
      Columns: [
        {
          prop: "plate",
          label: "车牌",
          width: 100,
          fixed: false,
          align: "center",
        },
        {
          prop: "terminalNo",
          label: "设备号",
          width: 120,
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
      addList: [],
      deleteList: [],
      addRow: [],
      deleteRow: [],
      sizeChange(val: number) {
        data.pageSize = val;
      },
      currentChange(val: number) {
        data.currentPage = val;
      },
      handleSelectionChange(val: any) {
        if (props.type == "add") {
          data.addList = val;
        } else {
          data.deleteList = val;
        }
      },
      addOrDelete(row: any) {
        if (props.type == "add") {
          data.confirmType = "add";
          data.confirmTxt = "是否绑定该车辆？";
          data.addRow = [row] as any;
        } else {
          data.confirmType = "delete";
          data.confirmTxt = "是否取消绑定该车辆？";
          data.deleteRow = [row] as any;
        }
        open();
      },
      deleteAll() {
        data.confirmType = "deleteAll";
        data.confirmTxt = "是否取消绑定选中车辆？";
        open();
      },
      bindAll() {
        data.confirmType = "addAll";
        data.confirmTxt = "是否绑定选中车辆？";
        open();
      },
      confirmFn() {
        switch (data.confirmType) {
          case "add":
            emit("confirmFnOK", data.addRow);
            break;
          case "addAll":
            emit("confirmFnOK", data.addList);
            break;
          case "delete":
            emit("confirmFnOK", data.deleteRow);
            break;
          case "deleteAll":
            emit("confirmFnOK", data.deleteList);
            break;
          default:
            break;
        }
      },
    });
    function open() {
      ElMessageBox({
        title: "",
        message: data.confirmTxt,
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          data.confirmFn();
        })
        .catch(() => {});
    }
    nextTick(async () => {
      setTimeout(() => {
        data.table.doLayout();
      }, 100);
      if (props.type == "add") {
        watch(
          () => [props.treeList, props.bindList],
          ([val, val2]) => {
            let arr = [] as any;
            val.map((item: any) => {
              arr = arr.concat([...item]);
            });
            let arrSet = new Set();
            val2.map((item: any) => {
              arrSet.add(item.vehicleId);
            });
            data.tableData = arr.filter((item: any) => {
              return !arrSet.has(item.vehicleId);
            });
            data.total = data.tableData.length;
            setTimeout(() => {
              data.table.doLayout();
            }, 100);
          },
          {
            deep: true,
          }
        );
      } else if (props.type == "delete") {
        watch(
          () => props.bindList,
          (val) => {
            data.tableData = val as any;
            data.total = data.tableData.length;
          },
          {
            deep: true,
          }
        );
      }
    });
    return {
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.MYEltable {
  width: 100% !important;
  height: calc(100% - 40px);
  margin-top: -1px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .button {
    color: rgb(0, 98, 255);
    cursor: pointer;
    &:hover {
      color: rgb(55, 147, 251);
    }
  }
}
.MYElpagination {
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  .btn {
    span {
      color: red;
      font-size: 13px;
      margin-left: 10px;
    }
  }
}
</style>