<template>
  <div class="WireLessBack">
    <div class="content">
      <div class="box">
        <div class="header">
          <el-switch
            v-model="alarm"
            active-text="闹钟模式"
            inactive-text=""
          >
          </el-switch>
        </div>
        <div class="item">
          <div class="item_box">
            <el-checkbox
              v-model="group1"
              :disabled="!alarm"
            >第一组</el-checkbox>
            <div class="timePicker">
              <a-time-picker
                :disabled="!alarm"
                v-model:value="clock1"
                format="HH:mm"
                placeholder=""
              />
            </div>
          </div>
          <div class="item_box">
            <el-checkbox
              v-model="group2"
              :disabled="!alarm"
            >第二组</el-checkbox>
            <div class="timePicker">
              <a-time-picker
                :disabled="!alarm"
                v-model:value="clock2"
                format="HH:mm"
                placeholder=""
              />
            </div>
          </div>
        </div>
        <div class="item">
          <div class="item_box">
            <el-checkbox
              v-model="group3"
              :disabled="!alarm"
            >第三组</el-checkbox>
            <div class="timePicker">
              <a-time-picker
                :disabled="!alarm"
                v-model:value="clock3"
                format="HH:mm"
                placeholder=""
              />
            </div>
          </div>
          <div class="item_box">
            <el-checkbox
              v-model="group4"
              :disabled="!alarm"
            >第四组</el-checkbox>
            <div class="timePicker">
              <a-time-picker
                :disabled="!alarm"
                v-model:value="clock4"
                format="HH:mm"
                placeholder=""
              />
            </div>
          </div>
        </div>
      </div>
      <div class="box">
        <div class="header">
          <el-switch
            v-model="timing"
            active-text="定时模式"
            inactive-text=""
          >
          </el-switch>
        </div>
        <div class="item">
          <el-input
            :disabled="!timing"
            v-model="time"
            placeholder="请输入内容"
            maxlength="3"
          ></el-input>
        </div>
        <div class="item">
          <div class="tip">范围000-999分，设置000时表示关闭</div>
        </div>
      </div>
      <div class="box">
        <div class="header">
          <el-switch
            v-model="week"
            active-text="星期模式"
            inactive-text=""
          >
          </el-switch>
        </div>
        <div class="item">
          <el-checkbox
            v-model="Monday"
            :disabled="!week"
          >星期一</el-checkbox>
          <el-checkbox
            v-model="Tuesday"
            :disabled="!week"
          >星期二</el-checkbox>
          <el-checkbox
            v-model="Wednesday"
            :disabled="!week"
          >星期三</el-checkbox>
          <el-checkbox
            v-model="Thursday"
            :disabled="!week"
          >星期四</el-checkbox>
        </div>
        <div class="item">
          <el-checkbox
            v-model="Friday"
            :disabled="!week"
          >星期五</el-checkbox>
          <el-checkbox
            v-model="Saturday"
            :disabled="!week"
          >星期六</el-checkbox>
          <el-checkbox
            v-model="Sunday"
            :disabled="!week"
          >星期天</el-checkbox>
          <div class="timePicker2">
            <a-time-picker
              :disabled="!week"
              v-model:value="weekValue"
              format="HH:mm"
              placeholder=""
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="footer">
    <span class="dialog-footer">
      <span v-if="isGroup">
        <el-checkbox v-model="checked">对该车组下的所有车组进行设置</el-checkbox>
      </span>
      <!-- 用于布局的无用dom -->
      <span></span>
      <span>
        <el-button @click="$emit('update:visible', false)">取 消</el-button>
        <el-button
          type="primary"
          @click="confirm"
        >确 定</el-button>
      </span>
    </span>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  toRefs,
  watch,
  nextTick,
  watchEffect,
} from "vue";
import dayJs from "dayjs";
import moment from "moment";
import { useFunction } from "../../../../function";
import { parseInt } from "lodash";
export default defineComponent({
  components: {},
  props: {
    dialogData: {
      type: Object || Array,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    command: {
      type: Object,
      default: () => null,
    },
    vehInfo: {
      type: Object,
      default: null,
    },
    groupInfo: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit }) {
    const {
      sendCommandDown,
      showMsg,
      groupDown,
      getPassBack,
      getGroupPassBack,
    } = useFunction();
    const data = reactive({
      rules: {},
      checked: false,
      alarm: false,
      timing: false,
      week: false,
      weekValue: moment("00:00", "HH:mm"),
      time: null,
      clock1: moment("00:00", "HH:mm"),
      clock2: moment("00:00", "HH:mm"),
      clock3: moment("00:00", "HH:mm"),
      clock4: moment("00:00", "HH:mm"),
      group1: false,
      group2: false,
      group3: false,
      group4: false,
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false,
      PrefixZero(num: any, n: number) {
        return ((Array(n) as any).join(0) + num).slice(-n);
      },
      // 获取无线回传数据
      async getPassBackData() {
        let res = null;
        if (props.vehInfo) {
          res = await getPassBack({
            vehicleId: props.vehInfo.V,
          });
        } else if (props.groupInfo) {
          res = await getGroupPassBack({
            groupId: props.groupInfo.gi,
          });
        }
        if (!res) return;
        const { D, W, R, selectedSubGroup } = res;
        data.checked = selectedSubGroup ? true : false;
        if (D && D != "000") {
          data.timing = true;
          data.time = D;
        }
        if (W && W != "0") {
          let arr = W.split(",");
          if (arr[0] && arr[0] == 1) {
            data.week = true;
          }
          if (arr[1]) {
            arr[1].split("").map((item: any) => {
              switch (parseInt(item)) {
                case 1:
                  data.Monday = true;
                  break;
                case 2:
                  data.Tuesday = true;
                  break;
                case 3:
                  data.Wednesday = true;
                  break;
                case 4:
                  data.Thursday = true;
                  break;
                case 5:
                  data.Friday = true;
                  break;
                case 6:
                  data.Saturday = true;
                  break;
                case 7:
                  data.Sunday = true;
                  break;
                default:
                  break;
              }
            });
          }
          if (arr[2]) {
            let clock = arr[2].split("");
            data.weekValue = moment(
              [clock[0], clock[1], ":", clock[2], clock[3]].join(""),
              "HH:mm"
            );
          }
        }
        if (R && R != "") {
          data.alarm = true;
          let arr = R.split(",");
          arr.map((item: any, index: number) => {
            (data as any)["group" + (index + 1)] = true;
            let clock = item.split("");
            (data as any)["clock" + (index + 1)] = moment(
              [clock[0], clock[1], ":", clock[2], clock[3]].join(""),
              "HH:mm"
            );
          });
        }
      },
      async confirm() {
        if (!props.command) return;
        console.log(props.command);
        let params = {
          commandType: props.command.param || null,
          commandMsg: "",
        } as any;

        let R = [] as any;
        let D = [
          ["", " ", null].includes(data.time)
            ? "000"
            : data.PrefixZero(data.time as any, 3),
        ] as any;
        D = ["*D", D.join(",")];
        let W = [data.week ? "1" : "0"] as any;
        if (data.alarm) {
          let arr = [];
          for (let i = 1; i < 5; i++) {
            arr.push({
              name: "group" + i,
              check: (data as any)["group" + i],
              value: dayJs((data as any)["clock" + i])
                .format("HH:mm")
                .split(":")
                .join(""),
            });
          }
          arr.map((item: any) => {
            if (item.check) {
              R.push(item.value);
            }
          });
          R = ["*R", R.join(",")];
        } else {
          R = [];
        }
        if (data.week) {
          if (
            ![
              data.Monday,
              data.Tuesday,
              data.Wednesday,
              data.Thursday,
              data.Friday,
              data.Saturday,
              data.Sunday,
            ].includes(true)
          ) {
            showMsg("请选择星期模式日期");
            return;
          } else {
            let w = [] as any;
            [
              data.Monday,
              data.Tuesday,
              data.Wednesday,
              data.Thursday,
              data.Friday,
              data.Saturday,
              data.Sunday,
            ].map((item: any, index: number) => {
              if (item) {
                w.push(index + 1);
              }
            });
            W.push(w.join(""));
            W.push(
              dayJs(data.weekValue as any)
                .format("HH:mm")
                .split(":")
                .join("") as any
            );
          }
        }
        W = ["*W", W.join(",")];
        params.commandMsg = [D.join(":"), W.join(":"), R.join(":")].join("");
        let res = null;
        if (data.checked) {
          params.selectedSubGroup = 1;
        }
        if (props.vehInfo && props.vehInfo.V) {
          params.vehicleId = props.vehInfo.V;
          res = await sendCommandDown(params);
        }
        if (props.groupInfo && props.groupInfo.gi) {
          params.groupId = props.groupInfo.gi;
          res = await groupDown(params);
        }
        if (res == 1) {
          showMsg("无线回传命令已下发，结果请查看命令下发报表");
          emit("update:visible", false);
        }
      },
    });
    nextTick(() => {
      watch(
        () => props.visible,
        (val) => {
          if (val) {
            data.getPassBackData();
          }
        },
        {
          immediate: true,
        }
      );
      watchEffect(() => {
        if (!props.visible) {
          data.alarm = false;
          data.timing = false;
          data.week = false;
          data.checked = false;
        }
        if (!data.alarm) {
          data.clock1 = moment("00:00", "HH:mm");
          data.clock2 = moment("00:00", "HH:mm");
          data.clock3 = moment("00:00", "HH:mm");
          data.clock4 = moment("00:00", "HH:mm");
          data.group1 = false;
          data.group2 = false;
          data.group3 = false;
          data.group4 = false;
        }
        if (!data.timing) {
          data.time = null;
        }
        if (!data.week) {
          data.Monday = false;
          data.Tuesday = false;
          data.Wednesday = false;
          data.Thursday = false;
          data.Friday = false;
          data.Saturday = false;
          data.Sunday = false;
          data.weekValue = moment("00:00", "HH:mm");
        }
      });
    });
    return {
      ...toRefs(props),
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.WireLessBack {
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    display: flex;
    flex-direction: column;
    .box {
      .header {
        padding: 10px 0;
      }
      .item {
        padding: 10px 0 10px 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .tip {
          font-size: 12px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          color: #999999;
          position: relative;
          top: -10px;
        }
      }
    }
  }
  .timePicker,
  .timePicker2 {
    padding-left: 10px;
    display: inline-block;
    ::v-deep(.ant-time-picker) {
      width: 80px !important;
    }
  }
  .timePicker2 {
    position: relative;
    right: -15px;
    padding-left: 15px;
    //   padding-left: 20px;
  }
}
.dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100%;
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
</style>