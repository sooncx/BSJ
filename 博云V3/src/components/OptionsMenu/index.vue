<template>
  <div>
    <div
      v-if="popoverVisible"
      v-show="optionList.length > 0"
      ref="popoverRef"
      class="optionsMene"
      :id="id"
    >
      <slot
        name="content"
        v-if="menuType == 'area'"
      />
      <div
        class="options"
        v-else
      >
        <ul id="popOption_ul">
          <li
            :id="'popOption_' + items"
            v-for="items in optionList"
            :key="items"
            @click="popFn(items)"
          >
            <div v-if="items.name != '关注度设置'">{{ items.name }}</div>
            <div v-else>
              <el-popover
                placement="right"
                :width="100"
                trigger="hover"
              >
                <template #reference>
                  <span>{{ items.name }} ></span>
                </template>
                <div class="secondMenu">
                  <ul>
                    <li
                      v-for="(item2, index2) in attentionList"
                      :key="index2"
                      @click="setAttention(item2)"
                    >
                      {{ item2 }}
                    </li>
                  </ul>
                </div>
              </el-popover>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <VehDialog
    v-model:visible="VehDialogVisible"
    v-bind="$attrs"
    :DialogType="DialogType"
    :title="DialogTitle"
    :type="type"
  />
  <OthersDialog
    v-model:visible="OtherDialogVisible"
    v-bind="$attrs"
    :DialogType="DialogType"
    :title="DialogTitle"
    :command="command"
  />
  <AttentionDialog
    v-model:visible="AttentionDialogVisible"
    v-bind="$attrs"
    :Attentionlevel="Attentionlevel"
  />
</template>
<script lang="ts">
import { useStore } from "vuex";
import LoginVue from "@/views/login/Login.vue";
import { useFunction } from "../../views/monitorCenter/function";
import {
  defineComponent,
  defineAsyncComponent,
  nextTick,
  onMounted,
  reactive,
  toRefs,
  ref,
  watch,
  onUnmounted,
  computed,
  onActivated,
  inject,
} from "vue";
import { ElMessage } from "element-plus";
export default defineComponent({
  components: {
    VehDialog: defineAsyncComponent(
      () => import("../../views/monitorCenter/LeftContent/dialog/VehDialog.vue")
    ),
    OthersDialog: defineAsyncComponent(
      () =>
        import("../../views/monitorCenter/LeftContent/dialog/OthersDialog.vue")
    ),
    AttentionDialog: defineAsyncComponent(
      () =>
        import(
          "../../views/monitorCenter/LeftContent/dialog/AttentionDialog.vue"
        )
    ),
  },
  props: {
    menuType: {
      type: String,
      default: "",
    },
    popoverVisible: {
      type: Boolean,
      default: false,
    },
    popMouseEvent: {
      type: Object,
      default: () => {},
    },
    marginLeft: {
      type: Number,
      default: 0,
    },
    listData: {
      type: Array,
      default: () => [],
    },
    id: {
      type: String,
      default: "vehListMenu",
    },
    popType: {
      type: String,
      default: "设置",
    },
    type: {
      type: String,
      default: "add",
    },
  },
  setup(props, { emit, attrs }) {
    const store = useStore();
    const { deleteVehicleConcern, sendCommandDown } = useFunction();
    const OptionMenuDialogFn = inject("OptionMenuDialogFn") as Function;
    emit("update:popoverVisible", false);
    const defaultList = [
      "车辆资料", //--
      "绑定省市区", //--
      // "流量查询", //--
      // "OBD数据", //--
      // "结清", //--
      // "我要查车", //
      // "调度下发", //
      // "无线回传", //
      // "断开油电", //
      // "恢复油电", //
      // "超速设置", //
      // "里程重置", //
      // "定时回传", //
      // "Acar设置", //
      // "软件版本查询", //
      // "设置回传时间", //
      // "复位", //
      // "APN参数设置", //
      // "时区设置", //
      // "服务器参数设置", //
      // "查询终端参数", //
      // "A5M设置", //
      // "录音", //
      // "电话回拨", //
      // "工作模式", //
      // "拍照", //
      // "开锁",
      // "关锁",
      // "查询GPRS参数",
      // "自动录音开关",
      // "自动接听来电",
      // "远程开机",
      // "远程关机",
      // "解除紧急报警",
      // "震动报警开关",
      // "碰撞报警开关",
      // "录音库", //--
      // "照片库", //--
      // "结清撤回", //--
      "关注度设置", //--
    ];
    const { popoverVisible, listData, popMouseEvent, marginLeft, id } = toRefs(
      props
    );
    const data = reactive({
      command: null,
      marginTop: 0,
      popoverRef: null,
      VehDialogVisible: false,
      OtherDialogVisible: false,
      AttentionDialogVisible: false,
      Attentionlevel: "",
      DialogType: "",
      DialogTitle: "",
      attentionList: ["高", "中", "低", "修改备注", "清除关注"],
      optionList: [] as any,
      // 清除关注度
      async deleteVehicleConcernFn() {
        let vehId = null;
        if (attrs.vehInfo && (attrs.vehInfo as any).V) {
          vehId = (attrs.vehInfo as any).V;
        }
        const res = await deleteVehicleConcern(vehId);
        if (res == 1) {
          OptionMenuDialogFn("刷新车辆车组列表");
          showMsg("清除关注成功!");
        }
      },
      // 关注度设置
      async setAttention(val: string) {
        emit("update:popoverVisible", false);
        if (val == "清除关注") {
          data.deleteVehicleConcernFn();
        } else {
          data.Attentionlevel = val;
          data.AttentionDialogVisible = true;
        }
      },
      // 下发指令
      async sendCommand(codeData: any) {
        const params = {
          commandType: codeData.param || null,
          commandMsg: "",
          vehicleId: (attrs.vehInfo as any).V,
        };
        const res = await sendCommandDown(params);
        if (res == 1) {
          showMsg(codeData.name + "命令已下发，结果请查看命令下发报表");
        }
      },
      // 点击指令列表事件
      popFn(item: any) {
        const val = item.name;
        data.command = item;
        if (["关注度设置"].includes(val)) return;
        emit("update:popoverVisible", false);
        console.log(item, props.popType, "popFn");
        if (["车辆资料"].includes(val)) {
          data.VehDialogVisible = true;
        } else if (props.popType == "关注") {
          if (val == "清除关注") {
            data.deleteVehicleConcernFn();
          } else {
            data.AttentionDialogVisible = true;
            data.Attentionlevel = val;
          }
        } else if (
          [
            "查询终端参数",
            "软件版本查询",
            "开锁",
            "关锁",
            "查询GPRS参数",
            "自动接听来电",
            "远程开机",
            "远程关机",
            "解除紧急报警",
            "解除蓝牙锁报警",
            "复位",
            "拍照",
            "我要查车",
            "点名",
          ].includes(val)
        ) {
          // 以上指令直接下发指令，无需自定义传参操作
          data.sendCommand(item);
        } else {
          data.OtherDialogVisible = true;
        }
        data.DialogType = val;
        data.DialogTitle = val;
      },
    });
    const showMsg = (msg = "命令已下发，结果请查看命令下发报表") => {
      ElMessage({
        dangerouslyUseHTMLString: true,
        duration: 2000,
        customClass: "msgBox_cx",
        iconClass: "msgIcon_cx",
        message: msg,
        offset: document.body.clientHeight / 2,
      });
    };
    // 获取指令列表数据
    function getList() {
      if (!attrs.vehInfo) return;
      if (store.state.terminalResource && store.state.terminalList) {
        let res = store.state.terminalResource.filter((item: any) => {
          return item.terminalType == (attrs.vehInfo as any).T;
        });
        let nameList = [] as any;
        let othersList = [] as any;
        if (res && res[0] && res[0].resourceIdList) {
          let arr = [...new Set(res[0].resourceIdList)];
          nameList = store.state.terminalList.filter((item: any) => {
            return arr.includes(item.resourceId);
          });
          if (store.state.specTerminalList) {
            othersList = store.state.specTerminalList.filter((item: any) => {
              return arr.includes(item.resourceId);
            });
            nameList = [...nameList, ...othersList];
          }
        }
        if ([...listData.value].length == 0) {
          data.optionList = nameList;
          data.optionList.push({ name: "录像回放" });
          if (
            store.state.btnPermission &&
            store.state.btnPermission.length > 0
          ) {
            if (store.state.btnPermission.includes(130109)) {
              data.optionList.unshift({ name: "绑定省市区" });
            }
            if (store.state.btnPermission.includes(130108)) {
              if ((attrs.vehInfo as any).settle == "0") {
                data.optionList.unshift({ name: "结清" });
              }
            }
            if (store.state.btnPermission.includes(130107)) {
              data.optionList.unshift({ name: "车辆资料" });
            }

            if (store.state.btnPermission.includes(130108)) {
              if ((attrs.vehInfo as any).settle == "1") {
                data.optionList.push({ name: "结清撤回" });
              }
            }
            if (store.state.btnPermission.includes(130105)) {
              data.optionList.push({ name: "关注度设置" });
            }
          }
          data.marginTop = data.optionList.length * 33 + 10;
          if (data.marginTop > 300) {
            data.marginTop = 330;
          }
          if (data.optionList.length <= 0) {
            showMsg("暂无指令！");
          }
        } else {
          data.marginTop = 190;
          data.optionList = [...listData.value].map((item: any) => ({
            name: item,
          }));
        }
      } else {
        // data.optionList = [...defaultList].map((item: any) => ({
        //   name: item,
        // }));
        data.optionList = [];
        showMsg("暂无指令！");
      }
      if (props.menuType == "area") {
        data.marginTop = 190;
      }
    }
    // 设置指令列表显示位置
    watch(
      popMouseEvent,
      (val) => {
        nextTick(() => {
          getList();
          if (val) {
            const { clientX, clientY } = val;
            const bodyH = document.body.clientHeight;
            const screenH = document.documentElement.clientHeight;
            let H = 20;
            top;
            // if (screenH - clientY <= 300) {
            //   H = clientY - 410 + screenH - clientY;
            // } else {
            //   H = clientY - 120;
            // }
            // bottom
            // if (screenH - clientY <= 170) {
            //   H = (screenH - clientY) / 10 + 10;
            // } else {
            //   H = screenH - clientY;
            // }
            H = screenH - clientY;
            if (popoverVisible.value) {
              const dom: any = document.getElementById(id.value);
              dom.style.left = clientX + 30 + marginLeft.value + "px";
              if (H - data.marginTop < 20) {
                dom.style.bottom = 20 + "px";
              } else if (props.popType == "设置") {
                dom.style.bottom = H - data.marginTop - 30 + "px";
              } else if (props.popType == "侧边设置") {
                dom.style.bottom = H - data.marginTop + 30 + "px";
              } else {
                dom.style.bottom = H - data.marginTop - 10 + "px";
              }
            }
          }
        });
      },
      {
        immediate: true,
        deep: true,
      }
    );
    onMounted(() => {
      nextTick(() => {
        document.addEventListener("click", (e) => {
          if (data.popoverRef && !(data.popoverRef as any).contains(e.target)) {
            emit("update:popoverVisible", false);
          }
        });
      });
    });
    onUnmounted(() => {
      emit("update:popoverVisible", false);
    });
    return {
      ...toRefs(props),
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.optionsMene {
  background: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 9999;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 300px;
  min-height: 50px;
  min-width: 100px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.349);
  border-radius: 1px;
  .options {
    height: 100%;
    width: 100%;
    ul {
      padding: 5px;
      li {
        padding: 10px 15px 10px 10px;
        color: #666;
        font-size: 12px;
        cursor: pointer;
        white-space: nowrap;
        border-bottom: 1px solid rgb(240, 240, 240);
        &:hover {
          color: rgb(75, 102, 255);
          background: rgb(243, 243, 243);
        }
        &:active {
          color: blue;
        }
      }
      & > li:nth-last-of-type(1) {
        border: none;
      }
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
.secondMenu {
  height: 100%;
  width: 100%;
  ul {
    li {
      padding: 5px;
      color: #666;
      font-size: 12px;
      cursor: pointer;
      border-bottom: 1px solid rgb(240, 240, 240);
      &:hover {
        color: rgb(75, 102, 255);
        background: rgb(243, 243, 243);
      }
    }
    & > li:nth-last-of-type(1) {
      border: none;
    }
  }
}
</style>
<style lang="less">
.msgBox_cx {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 20px !important;
  min-width: 100px !important;
  background: rgba(0, 0, 0, 0.527) !important;
  border: none !important;
  color: #fff !important;
}
.msgIcon_cx {
  display: none !important;
}
</style>