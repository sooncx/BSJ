<template>
  <div class="Settlement">
    <div class="header">
      {{ msgType === "jieqing" || msgType === "sim" ? "功能介绍" : "功能简介" }}
    </div>
    <div class="content">
      <template v-for="(item, index) in infomsg" :key="index">
        <div class="leftMessageBox">
          <div class="user">
            <img src="../../../../../../assets/img/dialog/yd-boss.png" alt="" />
          </div>
          <span class="leftinfo" v-html="item.question"> </span>
        </div>
        <div class="rightMessageBox">
          <span class="rightinfo" v-html="item.answer"> </span>
          <div class="user">
            <img src="../../../../../../assets/img/dialog/yd-ren.png" alt="" />
          </div>
        </div>
      </template>
    </div>
  </div>
  <div class="footer">
    <span class="dialog-footer">
      <!-- 用于布局的无用dom -->
      <span></span>
      <span>
        <el-button @click="confirm" type="primary">知道了</el-button>
      </span>
    </span>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  ref,
  toRefs,
  watch,
  watchEffect,
} from "vue";
import router from "@/router";
export default defineComponent({
  props: {
    dialogData: {
      type: Object || Array,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    isSettleFirst: {
      type: String,
      default: "是",
    },
    msgType: {
      type: String,
      default: "jieqing",
    },
  },
  emits: ["nextStep", "update:isSettleFirst"],
  setup(props, { emit }) {
    const data = reactive({
      confirm() {
        localStorage.setItem("isSettleFirst", "否");
        emit("update:isSettleFirst", "否");
        if (router.currentRoute.value.fullPath === "/riskControlCenter") {
          props.msgType === "riskTotalNum" &&
            localStorage.setItem("isRiskTotalNumFirst", "否");

          props.msgType === "carVehOfflineNum" &&
            localStorage.setItem("isCarVehOfflineNumFirst", "否");
          
          props.msgType === "separateNum" &&
            localStorage.setItem("isSeparateNumFirst", "否");

          emit("nextStep");
          return;
        }
      },
    });

    const dataList = {
      jieqing: [
        {
          question: `您好！我是公司的风控，请问这个结清是什么意思？结清以后会怎么样？`,
          answer: `您好，结清就是该车辆已结束和贷款公司的贷款关系。结清以后会有以下变化<br />
          1.该车辆（以及关联设备）所有警报不再显示<br />
          2.SIM流量续费将不再显示该车辆<br />
          3.车辆续费报表也将不再显示该车`,
        },
        {
          question: ` 那可以撤回吗？ `,
          answer: `可以的，在监控中心的车辆列表可以撤回结清，以及在资料管理-结清列表里也可以进行撤回结清操作。`,
        },
      ],
      sim: [
        {
          question: `我负责风控，这个流量查询有什么用？`,
          answer: `我是产品，每张SIM卡只能绑定一台设备,每张SIM卡都有自己的流量额度，超出额度，该设备将自动离线。`,
        },
        {
          question: `那为什么我有时候查询流量失败？`,
          answer: `只支持查询本平台的SIM卡！如本平台SIM卡查询失败，请确认SIM卡或者ICCID是否填写正确，或者稍后再试`,
        },
      ],
      riskTotalNum: [
        {
          question: `我负责风控，我想知道这个风险车辆是怎么被筛选出来的？`,
          answer: `我是产品，我们在系统里建立了许多个不同的风险场景模型，当设备满足这些风险场景模型<br />
          条件时，系统会觉得贷款车辆存在这些风险，并被筛选出来。`,
        },
        {
          question: `还是不太明白，请举例说明一下！`,
          answer: `例如“设备拆除风险”这个场景是结合了二押点报警与感光报警/二押点报警与长时间停留/二<br />
          押点报警与分离报警，满足以上任何一种情况就会被触发。具体可以通过“?”图标查看详<br />
          情。`,
        },
      ],
      carVehOfflineNum: [
        {
          question: `我负责风控，我想知道这个多设备离线有什么用？`,
          answer: `我是产品，这里能帮您筛选出两台以上设备离线的贷款车辆。需要说明的是 所有设备超过1<br />
          天未回传就会被筛选出来。`,
        },
        {
          question: `那平台是怎么知道哪几台设备在同一辆车上的？`,
          answer: `我们根据车牌号推算出来的，如果您的车牌号填写的内容包含标准的车牌。我们则推算为同<br />
          一辆车。例如：“李磊 粤A12345 有线”与 “粤A12345 无线1 后备箱”在同一辆车上。`,
        },
      ],
      separateNum: [
        {
          question: `我负责风控，我想知道这个分离报警是怎么产生的？`,
          answer: `我是产品，当无线设备上传位置数据时，平台会跟同一辆贷款车辆的有线设备计算距离。如<br />
          果距离大于15公里就会产生分离报警了。`,
        },
        {
          question: `那平台是怎么知道哪几台设备在同一辆车上的？`,
          answer: `我们根据车牌号推算出来的，如果您的车牌号填写的内容包含标准的车牌。我们则推算为同<br />
          一辆车。例如：“李磊 粤A12345 有线”与 “粤A12345 无线1 后备箱”在同一辆车上。`,
        },
      ],
    };

    const infomsg = ref(dataList.jieqing);

    watchEffect(() => {
      if (props.msgType === "riskTotalNum") {
        infomsg.value = dataList.riskTotalNum;
      }
      if (props.msgType === "carVehOfflineNum") {
        infomsg.value = dataList.carVehOfflineNum;
      }
      if (props.msgType === "separateNum") {
        infomsg.value = dataList.separateNum;
      }

      if (props.msgType === "jieqing") {
        infomsg.value = dataList.jieqing;
      }
      if (props.msgType === "sim") {
        infomsg.value = dataList.sim;
      }
    });
    return {
      ...toRefs(props),
      ...toRefs(data),
      infomsg,
    };
  },
});
</script>
<style lang="less" scoped>
.Settlement {
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 10px 16px;
  .header {
    height: 20px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 14px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    color: #333333;
  }
  .content {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    .leftMessageBox {
      width: 100%;
      padding: 0 10px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      .user {
        height: 36px;
        width: 36px;
        background: #dfdfdf;
        border-radius: 50px;
        margin-right: 10px;
      }
      .leftinfo {
        max-width: 80%;
        padding: 8px 10px;
        border-radius: 3px;
        background: #eeeeee;
        position: relative;
        font-size: 12px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
        &::after {
          width: 0;
          height: 0;
          content: "";
          border-top: 5px solid transparent;
          border-right: 7px solid #eeeeee;
          border-bottom: 5px solid transparent;
          position: absolute;
          left: -6px;
          top: 12px;
        }
      }
    }
    .rightMessageBox {
      width: 100%;
      padding: 0 10px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;
      .user {
        height: 36px;
        width: 36px;
        background: #dfdfdf;
        border-radius: 50px;
        margin-left: 10px;
        margin-top: -5px;
      }
      .rightinfo {
        max-width: 80%;
        padding: 8px 10px;
        border-radius: 3px;
        background: #eeeeee;
        position: relative;
        font-size: 12px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
        &::after {
          width: 0;
          height: 0;
          content: "";
          border-top: 5px solid transparent;
          border-left: 7px solid #eeeeee;
          border-bottom: 5px solid transparent;
          position: absolute;
          right: -6px;
          top: 9px;
        }
      }
    }
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