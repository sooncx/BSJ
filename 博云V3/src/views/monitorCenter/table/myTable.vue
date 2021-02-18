<template>
  <div class="tableBox">
    <div class="optionBar">
      <div>
        <i
          class="iconfont icon-ziliao"
          @click="alarmShow = !alarmShow"
        ><span>报警筛选</span></i>
        <i
          class="iconfont icon-wanjie"
          @click="dealWithAlarm"
        ><span>处理选中报警</span></i>
        <i
          class="iconfont icon-baojing"
          @click="voiceOpen = !voiceOpen"
        ><span>{{voiceOpen?'关闭铃声':'打开铃声'}}</span></i>
      </div>
      <div>
        <el-input
          placeholder="车牌号/车组名称"
          suffix-icon="el-icon-search"
          v-model="searchValue"
          size="mini"
        >
        </el-input>
      </div>
    </div>
    <div
      class="MYEltable"
      v-show="!alarmShow"
    >
      <div class="table-head">
        <table>
          <colgroup>
            <col
              span="1"
              style="width: 40px;"
            />
            <col
              span="1"
              style="width: 150px;"
            />
            <col
              span="1"
              style="width: 120px;"
            />
            <col
              span="1"
              style="width: 200px;"
            />
            <col
              span="1"
              style="width: 100px;"
            />
            <col
              span="1"
              style="width: 150px;"
            />
            <col
              span="1"
              style="width: 80px;"
            />
          </colgroup>
          <thead>
            <tr>
              <th>
                <el-checkbox
                  v-model="checkedAll"
                  @change="handleCheckAllChange"
                ></el-checkbox>
              </th>
              <th
                v-for="item in Columns"
                :key="item"
              >{{item.label}}</th>
              <th>操作</th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="table-body">
        <div
          class="tableEmpty"
          v-if="total == 0"
        >暂无数据</div>
        <table
          class="tableContent"
          v-else
        >
          <colgroup>
            <col
              span="1"
              style="width: 40px;"
            />
            <col
              span="1"
              style="width: 150px;"
            />
            <col
              span="1"
              style="width: 120px;"
            />
            <col
              span="1"
              style="width: 200px;"
            />
            <col
              span="1"
              style="width: 100px;"
            />
            <col
              span="1"
              style="width: 150px;"
            />
            <col
              span="1"
              style="width: 80px;"
            />
          </colgroup>
          <tbody>
            <tr
              v-for="(items, index) in tableData.slice((currentPage - 1) * pageSize,currentPage * pageSize)"
              :key="index"
            >
              <td>
                <el-checkbox
                  v-model="items.check"
                  @change="handleCheckChange"
                ></el-checkbox>
              </td>
              <td
                v-for="(item) in Columns"
                :key="item"
                @click="chose(items)"
              >
                {{items[item.prop]}}
              </td>
              <td
                @click="dealAlarm(items)"
                class="btn"
              >处理</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div
      class="MYEltable"
      v-show="alarmShow"
    >
      <div class="checkPanel">
        <div class="checkBox">
          <div
            class="checkItem"
            v-for="item in alarmChecks"
            :key="item"
          >
            <el-checkbox
              v-model="item.check"
              @change="alarmCheckChange"
            >{{item.label}}</el-checkbox>
          </div>
        </div>
        <div class="checkBtn">
          <el-checkbox
            v-model="alarmCheckAll"
            @click="checkAllAlarm"
          >全选</el-checkbox>
          <el-button
            type="primary"
            size="small"
            @click="checkOk"
          >确定</el-button>
        </div>
      </div>
    </div>
    <div class="MYElpagination">
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        v-model:current-page="currentPage"
        :page-sizes="[100, 200, 500]"
        v-model:page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        v-model:total="total"
      >
      </el-pagination>
    </div>
  </div>
  <AlarmDialog
    v-model:visible="alarmDialogVisible"
    v-model:alarmInfo="alarmInfo"
    v-model:type="dealType"
    @handleOk="getTableData"
  />
</template>
<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  toRefs,
  nextTick,
  watch,
  inject,
} from "vue";
import { debounce } from "@/assets/js/base";
import lodash from "lodash";
import { useFunction } from "../function";
import dayJs from "dayjs";
export default defineComponent({
  components: {
    AlarmDialog: defineAsyncComponent(() => import("./dialog/index.vue")),
  },
  props: {
    vehInfo: {
      type: Object,
      default: null,
    },
    tableResize: {
      type: Boolean,
      default: false,
    },
    showOptions: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { showMsg, normalShowMsg, showAMsg, queryAlarm } = useFunction();
    const updateChosedVeh = inject("updateChosedVeh") as any;
    const data = reactive({
      dealType: "single",
      total: 0,
      pageSize: 100,
      currentPage: 1,
      checkedAll: false,
      searchValue: null,
      tableData: [] as any,
      alarmShow: false,
      voiceOpen: false,
      alarmCheckAll: true,
      alarmDialogVisible: false,
      alarmInfo: null as any,
      checkedAlarm: [] as any,
      alarmChecks: [
        {
          label: "超速报警",
          check: true,
          value: "超速报警",
        },
        {
          label: "防拆除报警",
          check: true,
          value: "防拆除报警",
        },
        {
          label: "GPS天线开路报警",
          check: true,
          value: "GPS天线开路报警",
        },
        {
          label: "终端主电源掉电",
          check: true,
          value: "终端主电源掉电",
        },
        {
          label: "终端主电源欠压",
          check: true,
          value: "终端主电源欠压",
        },
        {
          label: "终端出区域报警",
          check: true,
          value: "终端出区域报警",
        },
        {
          label: "终端进区域报警",
          check: true,
          value: "终端进区域报警",
        },
        {
          label: "进出区域",
          check: true,
          value: "进出区域",
        },
        {
          label: "超出区域报警",
          check: true,
          value: "超出区域报警",
        },
        {
          label: "圆形区域报警",
          check: true,
          value: "圆形区域报警",
        },
        {
          label: "异常停留报警",
          check: true,
          value: "异常停留报警",
        },
        {
          label: "震动报警",
          check: true,
          value: "震动报警",
        },
        {
          label: "紧急报警",
          check: true,
          value: "紧急报警",
        },
        {
          label: "Bcar拆除报警",
          check: true,
          value: "Bcar拆除报警",
        },
        {
          label: "BCAR蓝牙报警",
          check: true,
          value: "BCAR蓝牙报警",
        },
        {
          label: "伪基站报警",
          check: true,
          value: "伪基站报警",
        },
        {
          label: "碰撞报警",
          check: true,
          value: "碰撞报警",
        },
        {
          label: "二押点报警",
          check: true,
          value: "二押点报警",
        },
        {
          label: "分离报警",
          check: true,
          value: "分离报警",
        },
        {
          label: "光感报警",
          check: true,
          value: "光感报警",
        },
        {
          label: "撬锁报警",
          check: true,
          value: "撬锁报警",
        },
        {
          label: "剪锁报警",
          check: true,
          value: "剪锁报警",
        },
        {
          label: "低压报警",
          check: true,
          value: "低压报警",
        },
        {
          label: "非法区域报警",
          check: true,
          value: "非法区域报警",
        },
        {
          label: "急加速报警",
          check: true,
          value: "急加速报警",
        },
        {
          label: "急减速报警",
          check: true,
          value: "急减速报警",
        },
        {
          label: "急转弯报警",
          check: true,
          value: "急转弯报警",
        },
        {
          label: "区域超速报警",
          check: true,
          value: "区域超速报警",
        },
      ],
      Columns: [
        {
          prop: "P",
          label: "车牌号码",
          width: 100,
          fixed: false,
          align: "center",
        },
        {
          prop: "T",
          label: "报警类型",
          width: 100,
          fixed: false,
          align: "center",
        },
        {
          prop: "D",
          label: "报警时间",
          width: 80,
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
          prop: "N",
          label: "所属车组",
          width: 80,
          fixed: false,
          align: "center",
        },
      ],
      tableDataMap: new Map(),
      format(val: any, prop: string) {
        return val;
      },
      // 获取表格数据
      async getTableData() {
        const params = {
          //dayJs(new Date()).format("YYYY-MM-DD HH:mm:ss")
          updateTime: "",
          alarmPermission: 0,
        };
        const res = await queryAlarm(params);
        const { alarm, total } = res;
        // data.total = total;
        if (!alarm) return;
        let cloneData = lodash.cloneDeep(alarm);
        data.tableDataMap = new Map();
        cloneData.map((item: any, index: number) => {
          data.tableDataMap.set(item.A, {
            ...item,
            index: index + 1,
            check: false,
          });
        });
        data.tableData = lodash
          .cloneDeep([...data.tableDataMap.values()])
          .filter((item: any) => {
            return data.checkedAlarm.includes(item.T);
          });
        data.tableData = [...data.tableData];
        data.total = data.tableData.length;
        // data.tableData = [...data.tableDataMap.values()];
      },
      // 选中/取消选中所有报警
      handleCheckAllChange(val: any) {
        let arr = [] as any;
        [...data.tableDataMap.values()].map((item: any, index) => {
          item.check = val;
          arr.push(item);
          data.tableDataMap.set(item.A, item);
        });
        data.tableData = arr;
        data.total = data.tableData.length;
      },
      // 选中/取消选中单条报警
      handleCheckChange() {
        let arr = [] as any;
        data.tableData.map((item: any, index: number) => {
          if (item.check == true) {
            arr.push(item);
            data.tableDataMap.set(item.A, item);
          } else {
            data.checkedAll = false;
          }
        });
        if (arr.length == data.tableData.length) {
          data.checkedAll = true;
        }
      },
      // 处理选中报警
      dealWithAlarm() {
        data.alarmShow = false;
        let arr = [] as any;
        [...data.tableDataMap.values()].map((item: any, index: number) => {
          if (item.check == true) {
            arr.push(item);
          }
        });
        if (arr.length == 0) {
          showMsg("您未勾选要处理的报警信息");
          return;
        } else {
          let arr = [] as any;
          [...data.tableDataMap.values()].map((item) => {
            if (item.check) {
              arr.push(item);
            }
          });
          data.dealType = "all";
          data.alarmDialogVisible = true;
          data.alarmInfo = [...arr];
        }
      },
      dealAlarm(veh: any) {
        data.dealType = "single";
        data.alarmInfo = { ...veh };
        data.alarmDialogVisible = true;
      },
      currentChange(val: number) {
        data.currentPage = val;
      },
      sizeChange(val: number) {
        data.pageSize = val;
      },
      // 选中/取消选中所有报警项
      checkAllAlarm() {
        let arr = [] as any;
        data.alarmChecks.map((item) => {
          arr.push({
            ...item,
            check: !data.alarmCheckAll,
          });
        });
        data.alarmChecks = arr;
      },
      // 选中/取消选中点击报警项
      alarmCheckChange() {
        let checks = [] as any;
        data.alarmChecks.map((item) => {
          if (item.check) {
            checks.push(item.value);
          } else {
            data.alarmCheckAll = false;
          }
        });
        if (checks.length == data.alarmChecks.length) {
          data.alarmCheckAll = true;
        }
      },
      // 提交报警项
      checkOk() {
        data.alarmShow = false;
      },
      chose(row: any) {
        updateChosedVeh({ ...row });
      },
    });
    nextTick(() => {
      data.alarmChecks.map((item: any) => {
        if (item.check) {
          data.checkedAlarm.push(item.value);
        }
      });
      data.getTableData();
      const scrollDom = document.getElementsByClassName("MYEltable")[0] as any;
      const dom2 = document.getElementsByClassName("table-head")[0] as any;
      scrollDom.addEventListener("scroll", (e: any) => {
        const scrollTop = scrollDom.scrollTop;
        if (scrollTop > 0) {
          dom2.style.top = scrollTop + "px";
        } else {
          dom2.style.top = 0;
        }
      });
      watch(
        () => data.alarmChecks,
        (val) => {
          let checks = [] as any;
          val.map((item) => {
            if (item.check) {
              checks.push(item.value);
            }
          });
          data.checkedAlarm = checks;
        },
        {
          deep: true,
        }
      );
      // 根据显示报警类型过滤表格显示数据
      watch(
        () => data.alarmShow,
        (val) => {
          if (!val) {
            let copyData = lodash.cloneDeep([...data.tableDataMap.values()]);
            data.tableData = copyData.filter((item: any) => {
              return data.checkedAlarm.includes(item.T);
            });
            data.total = data.tableData.length;
          }
        },
        {
          immediate: true,
        }
      );
      watch(
        () => props.showOptions,
        (val) => {
          const optionBarDom = document.getElementsByClassName(
            "optionBar"
          )[0] as any;
          const MYEltableDom = document.getElementsByClassName(
            "MYEltable"
          )[0] as any;
          if (val) {
            optionBarDom.style.height = "40px";
            MYEltableDom.style.height = "calc(100% - 80px)";
          } else {
            optionBarDom.style.height = "0px";
            MYEltableDom.style.height = "calc(100% - 40px)";
          }
        }
      );
      //用于给表头动态设置滚动条占位
      // watch(
      //   () => props.tableResize,
      //   (val) => {
      //     setTimeout(() => {
      //       const dom = document.getElementsByClassName(
      //         "tableContent"
      //       )[0] as any;
      //       const mainDom = document.getElementsByClassName(
      //         "MYEltable"
      //       )[0] as any;
      //       const dom2 = document.getElementsByClassName(
      //         "table-head"
      //       )[0] as any;
      //       console.log(dom.clientHeight > mainDom.clientHeight - 30);
      //       if (dom.clientHeight > mainDom.clientHeight - 30) {
      //         dom2 && (dom2.style.paddingRight = "6px");
      //       } else {
      //         dom2 && (dom2.style.paddingRight = "0px");
      //       }
      //     }, 400);
      //   }
      // );
    });
    // 模糊搜索过滤表格显示数据
    watch(
      () => data.searchValue,
      (val: any) => {
        data.currentPage = 1;
        if (!val || val == "") {
          data.tableData = [...data.tableDataMap.values()];
          data.total = data.tableData.length;
          return;
        }
        let arr = [...data.tableDataMap.values()].filter((item) => {
          return item.P.indexOf(val) != -1 || item.N.indexOf(val) != -1;
        });
        data.tableData = arr;
        data.total = data.tableData.length;
      }
    );
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
  .optionBar {
    width: 100%;
    height: 0px;
    background: rgb(253, 105, 105);
    position: relative;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 10px;
    transition: all 0.4s;
    overflow: hidden;
    div {
      white-space: nowrap;
      padding-right: 5px;
      i {
        white-space: nowrap;
        font-size: 13px;
        color: #fff;
        padding-right: 15px;
        cursor: pointer;
        &:hover {
          color: rgb(209, 0, 0);
        }
        span {
          padding-left: 5px;
        }
      }
    }
    ::v-deep(.el-input--mini .el-input__inner) {
      width: calc(100%);
      border: none;
      border-radius: 50px !important;
      background: rgb(255, 148, 148) !important;
      color: #fff;
    }
    ::v-deep(.el-icon-search) {
      color: #fff !important;
    }
    ::v-deep(.el-input__inner::placeholder) {
      color: #fff !important;
    }
    /* 谷歌 */
    ::v-deep(.el-input__inner::-webkit-input-placeholder) {
      color: #fff !important;
    }
    /* 火狐 */
    ::v-deep(.el-input__inner:-moz-placeholder) {
      color: #fff !important;
    }
    /*ie*/
    ::v-deep(.el-input__inner:-ms-input-placeholder) {
      color: #fff !important;
    }
  }
  .MYEltable {
    width: 100%;
    height: calc(100% - 40px);
    min-width: 300px;
    overflow-y: auto;
    transition: all 0.4s;
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      width: 6px;
      background-color: rgba(144, 147, 153, 0.3);
      transition: background-color 0.3s;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: rgba(144, 147, 153, 0.5);
    }
    &::-webkit-scrollbar-thumb:active {
      background-color: rgba(144, 147, 153, 0.5);
    }
    .checkPanel {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .checkBox {
        width: 100%;
        height: 100%;
        max-height: 250px;
        min-width: 600px;
        padding: 10px;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: space-around;
        .checkItem {
          width: 25%;
          height: 30px;
        }
      }
      .checkBtn {
        padding: 10px;
        width: 100%;
        min-width: 600px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: auto;
        margin-bottom: 20px;
        .el-button {
          margin-left: 40px;
        }
      }
    }
    .tableEmpty {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
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
.table-head table,
.table-body table {
  width: 100%;
  border-collapse: collapse;
  min-width: 850px;
  box-sizing: border-box;
}
.table-head {
  position: relative;
  top: 0;
  z-index: 99;
  height: 30px;
  color: #333;
  box-sizing: border-box;
  tr {
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
  th {
    border: 1px solid #dff6ff;
    background: #f5fcff !important;
  }
}
.table-body {
  width: 100%;
  height: calc(100% - 30px);
  box-sizing: border-box;
  table {
    tr {
      cursor: pointer;
      &:hover {
        background: #e4f6ff !important;
      }
    }
  }
}
.table-body table tr:nth-child(2n) {
  background-color: #f5fcff;
}
.table-body table tr td {
  border: 1px solid #dff6ff;
  text-align: center;
  height: 30px;
  line-height: 30px;
}
.btn {
  cursor: pointer;
  color: rgb(66, 150, 246);
  &:hover {
    color: blue;
  }
}
</style>