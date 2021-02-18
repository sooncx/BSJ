<template>
  <Tip
    v-bind="$attrs"
    v-if="isTrafficFirst == '是'"
    v-model:isTrafficFirst="isTrafficFirst"
  />
  <SearchTraffic
    v-bind="$attrs"
    :vehInfo="vehInfo"
    v-else
  />
</template>
<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  toRefs,
  watch,
  nextTick,
} from "vue";
import SearchTraffic from "./searchTraffic.vue";
import Tip from "./tip.vue";
export default defineComponent({
  components: {
    SearchTraffic,
    Tip,
  },
  props: {
    vehInfo: {
      type: Object,
      default: null,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      isTrafficFirst: "是",
    });
    nextTick(() => {
      watch(
        () => props.visible,
        (val) => {
          data.isTrafficFirst = localStorage.getItem("isTrafficFirst")
            ? (localStorage.getItem("isTrafficFirst") as any)
            : "是";
        },
        {
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