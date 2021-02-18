<template>
  <div
    ref="popoverRef"
    class="popoverRef"
  >
    <el-popover
      trigger="click"
      :placement="placement"
      :width="160"
    >
      <!-- <slot name="content" /> -->
      <div
        class="options"
      >
        <ul id="popOption_ul">
          <li
            :id="'popOption_'+items"
            v-for="items in optionList"
            :key="items"
            @click="popFn(items)"
          >{{items}}</li>
        </ul>
      </div>
      <template #reference>
        <slot />
      </template>
    </el-popover>

    <!-- <a-popover
      trigger="click"
      :placement="placement"
      :arrowPointAtCenter="true"
      :destroyTooltipOnHide="true"
      :visible="popoverVisible && (item && item.vehId?item.vehId == popoverTag:true)"
    >
      <template #content>
        <slot name="content" />
        <div
          class="options"
          v-if="!$slots.content"
        >
          <ul id="popOption_ul">
            <li
              :id="'popOption_'+items"
              v-for="items in optionList"
              :key="items"
              @click="popFn(items)"
            >{{items}}</li>
          </ul>
        </div>
      </template>
      <slot />
    </a-popover> -->
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  toRefs,
  ref,
} from "vue";
export default defineComponent({
  props: {
    popoverVisible: {
      type: Boolean,
      default: false,
    },
    placement: {
      type: String,
      default: "bottom",
    },
    item: {
      type: String,
      default: "",
    },
    popoverTag: {
      type: String,
      default: "",
    },
    listData: {
      type: Array,
      default: () => [
        "我要查车",
        "超速设置",
        "调度下发",
        "无线回传设置",
        "断开油电",
        "恢复油电",
        "OBD数据",
        "定时回传",
        "Acar设置",
        "A5M设置",
        "查询终端参数",
        "软件版本查询",
        "设置回传时间",
        "重启指令",
        "APN参数设置",
        "录音",
        "录音库",
        "电话回拨",
        "工作模式",
        "开启录音",
        "关闭录音",
        "拍照",
        "照片库",
        "指令下发",
        "开锁",
        "关锁",
        "解除蓝牙锁报警",
        "查看资料",
        "控制电池放电",
        "控制电池关闭放电",
        "获取BMS数据信息",
        "进入shipmode模式",
        "打开充电MOS",
        "关闭充电MOS",
        "解除紧急报警",
        "报警处理",
        "里程重置",
        "里程保养设置",
        "清除震动报警",
        "结清",
        "结清撤回",
        "查流量",
        "远程开机",
        "远程关机",
        "自动接听来电",
        "震动报警设置",
        "碰撞报警设置",
        "自动录音设置",
      ],
    },
  },
  setup(props, { emit }) {
    const { popoverVisible, listData } = toRefs(props);
    const data = reactive({
      popoverRef: null,
      optionList: [...new Set([...listData.value])],
      popFn(val: String) {
        emit("popFn", val);
      },
    });
    onMounted(() => {
      document.addEventListener("click", (e) => {
        if (data.popoverRef && !(data.popoverRef as any).contains(e.target)) {
          emit("update:popoverVisible", false);
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
.popoverRef {
  overflow: hidden;
}
.options {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 300px;
  ul {
    padding: 10px 0;
    li {
      padding: 4px 10px;
      color: #666;
      font-size: 12px;
      cursor: pointer;
      border-bottom: 1px solid rgb(240, 240, 240);
      &:hover {
        color: rgb(75, 102, 255);
        box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.164);
        background: #fff;
      }
      &:active {
        box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.264);
        color: blue;
      }
    }
    & > li:nth-last-of-type(1) {
      border: none;
    }
  }
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
}
::v-deep(.el-popover.el-popper) {
  padding: 0 !important;
  max-width: 400px !important;
  width: auto !important;
}
::v-deep(.el-popper__arrow),
::v-deep(.el-popper__arrow::before) {
  width: 0 !important;
  height: 0 !important;
  content: "" !important;
  border: none !important;
}
</style>
<style>
/* .ant-popover-arrow {
  border: none !important;
  box-shadow: none !important;
} */
</style>