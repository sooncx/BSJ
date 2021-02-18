<template>
  <div class="contentBox" ref="conBox">
    <div class="contentBox__header" ref="conBoxHeader">
      <ul class="contentBox__tab">
        <li
          v-for="(item, index) in tablist"
          :key="index"
          :class="{ active: tabActive === index }"
          @click="tabChange(index)"
        >
          {{ item }}
        </li>
      </ul>

      <div class="contentBox__showlist">
        <span>显示:</span>
        <ul>
          <li v-for="(item, index) in showlist" :key="index">
            <template v-if="item.text === '报警点'"
              ><AlarmDropdown
                v-model:data="showlist[0]"
                v-model:alarmLabel="alarmLabel"
            /></template>
            <template v-else>
              <a-checkbox v-model:checked="item.checked">{{
                item.text
              }}</a-checkbox>
            </template>
          </li>
        </ul>
      </div>

      <div class="contentBox__exportBox">
        <div class="contentBox__mileageBox">
          <span>开始里程：</span> {{ mileageData.start + "km" }}
          <span>结束里程：</span> {{ mileageData.end + "km" }}
          <span>行驶里程：</span>
          {{
            (mileageData.end * 1000 - mileageData.start * 1000) / 1000 + "km"
          }}
        </div>
        <ExportBtn />
        <div
          class="contentBox__exportBox__expand"
          :class="{ active: expand }"
          @click="handleExpand"
        >
          <i class="iconfont icon-right"></i>
        </div>
      </div>
    </div>

    <div class="contentBox__table">
      <PlayBackTable
        :height="tableHeight"
        :trackCheck="showlist[1].checked"
        :expand="expand"
        v-model:mileageData="mileageData"
        v-bind="$attrs"
        v-show="tabActive === 0"
      />
      <AlarmTable
        :height="tableHeight"
        :alarmlist="alarmlist"
        :alarmLabel="alarmLabel"
        :alarmCheck="showlist[0].checked"
        v-bind="$attrs"
        v-show="tabActive === 1"
      />
      <ReMainTable
        :height="tableHeight"
        :remainCheck="showlist[2].checked"
        v-bind="$attrs"
        v-show="tabActive === 2"
      />
      <FenceTable
        :height="tableHeight"
        :fenceCheck="showlist[3].checked"
        v-bind="$attrs"
        v-show="tabActive === 3"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject, nextTick, PropType, ref, watch } from "vue";
import dragResize from "@/assets/js/dragResize";
import AlarmDropdown from "./AlarmDropdown.vue";
import ExportBtn from "./ExportBtn.vue";
import PlayBackTable from "./PlayBackTable.vue";
import AlarmTable from "./AlarmTable.vue";
import ReMainTable from "./remainTable.vue";
import FenceTable from "./FenceTable.vue";
import { useEventListener } from "@/hooks/event/useEventListener";
import { isBoolean } from "@/utils/is";
import { useStore } from "vuex";

export default defineComponent({
  name: "trackContent",
  components: {
    AlarmDropdown,
    ExportBtn,
    PlayBackTable,
    AlarmTable,
    ReMainTable,
    FenceTable,
  },
  setup(props) {
    const { state } = useStore();
    // Tab
    const tablist = ref(["轨迹详情", "报警详情", "经常停留点", "围栏"]);
    const tabActive = ref(0);

    const tabChange = (i: number) => {
      tabActive.value = i;
    };

    // 显示
    const showlist = ref([
      {
        text: "报警点",
        checked: true,
      },
      {
        text: "轨迹",
        checked: true,
      },
      {
        text: "经常停留点",
        checked: true,
      },
      {
        text: "围栏",
        checked: true,
      },
    ]);
    const alarmlist = ref([
      "isIllegalRemove",
      "abnormalStayAlarm",
      "powerDown",
      "lowVoltage",
      "shockAlarm",
      "emergencyAlarm",
      "bcarIsAlarm",
      "collideAlarm",
      "twoChargeAlarm",
      "separateAlarm",
      "lightAlarm",
      "outAdminAreaAlarm",
      "outCircleAlarm",
      "inRegionAlarm",
      "outRegionAlarm",
      "pryingAlarm",
      "scissorsAlarm",
      "lowerPowerAlarm",
      "illegalAreaAlarm",
      "accelerateAlarm",
      "slowDownAlarm",
      "swerveAlarm",
      "areaOverSpeedAlarm",
    ]);
    const alarmLabel = ref([
      "防拆除报警",
      "异常停留报警",
      "终端主电源掉电",
      "终端主电源欠压",
      "震动报警",
      "紧急报警",
      "Bcar拆除报警",
      "碰撞报警",
      "二押点报警",
      "分离报警",
      "光感报警",
      "超出区域报警",
      "圆形区域报警",
      "进区域报警",
      "出区域报警",
      "撬锁报警",
      "剪锁报警",
      "低压报警",
      "非法区域报警",
      "急加速报警",
      "急减速报警",
      "急转弯报警",
      "区域超速报警",
    ]);

    // 右上缩放/展开
    const expand = ref(false);
    const handleExpand = (val: boolean) => {
      expand.value = isBoolean(val) ? val : !expand.value;
      if (!conBox) return;
      if (expand.value) {
        (conBox.value as any).dataset.defaultheight = (conBox.value as any).offsetHeight;
        (conBox.value as any).style.height = "65px";
        tableHeight.value = 65;
      } else {
        (conBox.value as any).style.height =
          ((conBox.value as any).dataset.defaultheight || 340) + "px";
        tableHeight.value =
          Number((conBox.value as any).dataset.defaultheight) || 340;
      }
    };

    // 里程数据
    const mileageData = ref({
      start: 0,
      end: 0,
    });

    // 上下拖拽
    const conBox = ref<HTMLDivElement | null>(null);
    const conBoxHeader = ref<HTMLDivElement | null>(null);

    nextTick(() => {
      new dragResize({
        wrapEl: conBox.value,
        dragEl: conBoxHeader.value,
        topStart: true,
        minHeight: 65,
        maxHeight: window.innerHeight - 10,
      });
    });

    const tableHeight = ref(340);
    useEventListener({
      el: conBoxHeader,
      name: "mousedown",
      listener: () => {
        useEventListener({
          el: conBoxHeader,
          name: "mousemove",
          listener: () => {
            tableHeight.value = Number((conBox.value as any).offsetHeight);
          },
        });
      },
    });

    watch(
      () => state.playIndex,
      (val: number) => {
        !showlist.value[1].checked && (showlist.value[1].checked = true);
      }
    );

    const updatetableexpand = <(val: any) => void>inject("UPDATE_TABLEEXPAND");
    updatetableexpand(handleExpand);

    return {
      tablist,
      tabActive,
      showlist,
      expand,
      handleExpand,
      tabChange,
      conBox,
      conBoxHeader,
      alarmlist,
      alarmLabel,
      tableHeight,
      mileageData,
    };
  },
});
</script>
<style lang="less" scoped>
.contentBox {
  position: absolute;
  width: 100%;
  z-index: 500;
  bottom: 0;
  left: 0;
  padding: 10px;
  height: 340px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__header {
    background: #fff;
    width: 100%;
    height: 44px;
    line-height: 44px;
    display: flex;
    position: relative;
  }

  &__tab {
    display: flex;
    width: 400px;
    justify-content: space-between;
    li {
      width: 25%;
      text-align: center;
      cursor: pointer;
      position: relative;
      font-weight: 800;
      color: #acb0b7;
      &.active {
        color: #0e60db;
      }
      &.active::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 10%;
        width: 80%;
        height: 2px;
        background: #0e60db;
      }
      &:hover {
        color: #0e60db;
      }
    }
  }

  &__showlist {
    display: flex;
    span {
      margin-right: 16px;
    }
    ul {
      display: flex;
      justify-content: space-between;
      li {
        margin-right: 16px;
      }
    }
  }

  &__mileageBox {
    color: #0e60db;
    span {
      color: #666;
      margin-left: 10px;
    }
  }

  &__exportBox {
    position: absolute;
    right: 10px;
    top: 0;
    height: 100%;
    display: flex;
    &__expand {
      transform: rotate(90deg);
      transform-origin: center center;
      cursor: pointer;

      &.active {
        transform: rotate(-90deg);
      }
    }
  }

  &__table {
    flex: 1;
    width: 100%;
    height: 100%;
    background: #fff;
    overflow: hidden;
  }
}

::v-deep(.ant-table-thead > tr > th) {
  color: #333333;
}

::v-deep(.el-table__body tr.current-row > td) {
  background-color: #0e60db;
  color: #fff;
}

::v-deep(.el-table__body-wrapper) {
  height: calc(100% - 44px);
  overflow-y: auto;
}
</style>
