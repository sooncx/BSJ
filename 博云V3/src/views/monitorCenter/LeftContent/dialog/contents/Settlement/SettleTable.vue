<template>
  <div class="Settlement">
    <template v-if="settleType == 'settle'">
      <div class="header">
        是否确定结清该车辆以及相关车辆？
      </div>
      <div class="tipList">
        <div class="title">结清须知</div>
        <div class="content">
          <span>车辆续费将不包含已结清的车辆</span>
          <span>首页风控报警将不包含已结清的车辆</span>
          <span>结清操作会把车辆所有关联设备一起结清</span>
          <span>已结清车辆可以在<span @click="jump('settle')">结清列表</span>中查询，并可以在表格中撤回成未结清状态。结清操作记录可以在<span @click="jump('setting')">操作记录</span>中查询</span>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="header">
        是否确定撤回结清该车辆以及相关车辆？
      </div>
      <div class="tipList">
        <div class="title">撤回结清须知</div>
        <div class="content">
          <span>撤回结清操作会把车辆所有关联设备一起撤回结清。</span>
          <span>首页风控报警将包含撤回结清的车辆。</span>
          <span>车辆续费将包含已撤回结清的车辆。</span>
          <span>撤回结清后车辆续费报表将显示该车。</span>
        </div>
      </div>
    </template>
    <div class="table">
      <div class="title">关联车辆</div>
      <div class="tableBox">
        <el-table
          max-height="160"
          size="mini"
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            prop="index"
            label="序号"
            width="50"
            align="center"
          >
            <template #default="{ $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="P"
            label="车牌号"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="N"
            label="设备号"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="T"
            label="设备类型"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="groupName"
            label="车组名称"
            align="center"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="remark">
      <div class="title">{{settleType=='settle'?'结清备注':'撤回结清备注'}}</div>
      <div class="remarkBox">
        <el-input
          :rows="3"
          resize="none"
          type="textarea"
          v-model="remarkValue"
        ></el-input>
      </div>
    </div>
  </div>
  <div class="footer">
    <span class="dialog-footer">
      <!-- 用于布局的无用dom -->
      <span></span>
      <span>
        <el-button @click="cancle">取 消</el-button>
        <el-button
          type="primary"
          @click="confirm"
        >{{settleType=='settle'?'结清':'结清撤回'}}</el-button>
      </span>
    </span>
  </div>
  <el-dialog
    v-model="cofirmShow"
    width="340px"
  >
    <div class="cofirmDialog">
      <div class="header">
        {{settleType=='settle'?'确定结清以下车辆':'确定撤回结清以下车辆'}}
      </div>
      <div class="content">
        <div
          v-for="item in tableData"
          :key="item"
        >{{item.P}}</div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <!-- 用于布局的无用dom -->
        <span></span>
        <span>
          <el-button @click="cofirmShow = false">取 消</el-button>
          <el-button
            type="primary"
            @click="confirmOk"
          >确 定</el-button>
        </span>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  toRefs,
  watch,
  watchEffect,
  nextTick,
  inject,
} from "vue";
import { ElMessage } from "element-plus";
import { useFunction } from "@/views/monitorCenter/function";
import router from "@/router";
export default defineComponent({
  components: {},
  props: {
    settleType: {
      type: String,
      default: "settle",
    },
    dialogData: {
      type: Object || Array,
    },
    vehicleId: {
      type: Number || String,
      default: "",
    },
  },
  emits:["SettlementCancle", "update:visible", "SettlementConfirm"],
  setup(props, { emit }) {
    const OptionMenuDialogFn = ["monitorCenter"].includes(
      router.currentRoute.value.name as string
    )
      ? (inject("OptionMenuDialogFn") as Function)
      : null;
    const { updateSettleStatus, showMsg, searchVehicleInfo } = useFunction();
    const data = reactive({
      ruleForm: null as any,
      remarkValue: "",
      cofirmShow: false,
      tableData: [],
      submitForm: function (formName: any) {
        data.ruleForm.validate((valid: any) => {
          if (valid) {
            alert("submit!");
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      resetForm: function (formName: any) {
        data.ruleForm.resetFields();
      },
      confirm() {
        if (data.tableData.length == 0) {
          data.confirmOk();
          return;
        }
        data.cofirmShow = true;
      },
      cancle() {
        emit("update:visible", false);
        emit("SettlementCancle");
      },
      async confirmOk() {
        const params = {
          type: props.settleType == "settle" ? 1 : 0,
          vehicleId: props.vehicleId,
          remarks: data.remarkValue,
        };
        const res = await updateSettleStatus(params);
        if (res == 1) {
          emit("SettlementConfirm");
          data.cofirmShow = false;
          emit("update:visible", false);
          ElMessage({
            duration: 2000,
            message: props.settleType == "settle" ? "结清成功！" : "撤回成功！",
          });
          OptionMenuDialogFn && OptionMenuDialogFn("刷新车辆列表");
        }
      },
      jump(type: string) {
        if (type == "settle") {
          router.push({ name: "settleList" });
        } else if (type == "setting") {
          router.push({ name: "operationRecord" });
        }
        data.cofirmShow = false;
        emit("update:visible", false);
      },
      async getvehData() {
        const res = await searchVehicleInfo(props.vehicleId);
        return res;
      },
      rules: {},
    });
    nextTick(() => {
      watch(
        () => props.dialogData,
        async (val) => {
          if (!val || val.length == 0) {
            data.remarkValue = "";
            const res = await data.getvehData();
            if (!res || !res.data) {
              data.tableData = [];
              return;
            }
            data.tableData = [
              {
                P: res.data.plate,
                N: res.data.terminalNo,
                T: res.data.terminalType,
                groupName: res.data.groupName,
              },
            ] as any;
            return;
          }
          data.remarkValue = "";
          data.tableData = val as any;
        },
        {
          deep: true,
          immediate: true,
        }
      );
    });
    return {
      ...toRefs(props),
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.Settlement {
  z-index: 999;
  width: 100%;
  height: 540px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 15px 0;
  .header {
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    color: #0e60db;
    margin-bottom: 10px;
  }
  .tipList {
    width: 100%;
    height: 145px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 0 16px;
    margin-bottom: 10px;
    .content {
      display: flex;
      flex-direction: column;
      padding: 0 10px;
      font-size: 12px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      color: #333333;
      & > span {
        position: relative;
        padding: 5px 0;
        line-height: 20px;
        & > span {
          color: #0e60db;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
        &::before {
          content: "";
          width: 4px;
          height: 4px;
          position: absolute;
          left: -10px;
          top: 14px;
          border-radius: 5px;
          background: #0e60db;
        }
      }
    }
  }
  .table {
    width: 100%;
    padding: 0 16px;
    max-height: 185px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 10px;
    .tableBox {
      width: 100%;
    }
  }
  .remark {
    width: 100%;
    padding: 0 16px;
    height: 110px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    .remarkBox {
      margin-top: 10px;
      width: 100%;
    }
  }
}
.title {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 12px;
  font-family: PingFang SC, PingFang SC-Bold;
  font-weight: 700;
  color: #333333;
}
.footer {
  width: 100%;
  height: 60px;
  padding: 10px 16px;
  border-top: 1px solid #d9e0e9;
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
::v-deep(.el-table--mini td, .el-table--mini th) {
  padding: 3px 0;
}
.cofirmDialog {
  height: 200px;
  width: 100%;
  padding: 30px 16px 20px 16px;
  .header {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    color: #0e60db;
  }
  .content {
    width: 100%;
    height: 120px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      width: 6px;
      background-color: rgba(116, 116, 116, 0.3);
      transition: background-color 0.3s;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: rgba(85, 85, 85, 0.5);
    }
    &::-webkit-scrollbar-thumb:active {
      background-color: rgba(92, 92, 92, 0.5);
    }
    & > div {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-left: 10px;
      height: 30px;
      width: 100%;
      margin: 1px 0;
      background: rgb(243, 243, 243);
      color: #666666;
    }
  }
}
</style>