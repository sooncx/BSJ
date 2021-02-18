<template>
  <div class="TrafficSearch">
    <div class="header">功能介绍</div>
    <div class="content">
      <div class="leftMessageBox">
        <div class="user">
          <img
            src="../../../../../../assets/img/dialog/yd-boss.png"
            alt=""
          >
        </div>
        <span class="leftinfo">
          您好！我是公司的风控，请问这个流量查询有什么用？
        </span>
      </div>
      <div class="rightMessageBox">
        <span class="rightinfo">
          您好，每张SIM卡只能绑定一台设备,每张SIM卡都有自己的流量额度，超出额度，该设备将自动离线。
        </span>
        <div class="user">
          <img
            src="../../../../../../assets/img/dialog/yd-ren.png"
            alt=""
          >
        </div>
      </div>
      <div class="leftMessageBox">
        <div class="user">
          <img
            src="../../../../../../assets/img/dialog/yd-boss.png"
            alt=""
          >
        </div>
        <span class="leftinfo">
          那为什么我有时候查询流量失败？
        </span>
      </div>
      <div class="rightMessageBox">
        <span class="rightinfo">
          1.只支持查询本平台的SIM卡<br>
          2.如本平台SIM卡查询失败，请确认SIM卡或者ICCID是否填写正确<br>
          3.或者稍后再试
        </span>
        <div class="user">
          <img
            src="../../../../../../assets/img/dialog/yd-ren.png"
            alt=""
          >
        </div>
      </div>
    </div>

  </div>
  <div class="footer">
    <span class="dialog-footer">
      <!-- 用于布局的无用dom -->
      <span></span>
      <span>
        <el-button
          @click="confirm"
          type="primary"
        >知道了</el-button>
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
} from "vue";
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isTrafficFirst: {
      type: String,
      default: "是",
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      confirm() {
        localStorage.setItem("isTrafficFirst", "否");
        emit("update:isTrafficFirst", "否");
      },
    });
    return {
      ...toRefs(props),
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.TrafficSearch {
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