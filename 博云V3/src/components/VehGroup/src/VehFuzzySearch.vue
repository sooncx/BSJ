<template>
  <div class="vehFuzzySearch">
    <el-autocomplete
      v-model="vehVal"
      :fetch-suggestions="querySearchAsync"
      :placeholder="placeholder"
      :style="inputStyle"
      @select="handleSelect"
      @change="handleSelect"
      clearable
      :disabled="disabled"
      size="small"
    >
      <template #default="{ item }">
        <div class="vehFuzzySearch__item">
          <p class="vehFuzzySearch__item__text">
            {{
              item.type === 0
                ? item.gn
                : item.type === 1
                ? item.plate
                : item.type === 2
                ? item.terminalNo
                : item.type === 3
                ? item.sim
                : item.type === 4
                ? item.owner
                : item.type === 6
                ? item.frameNo
                : ""
            }}
          </p>
          <el-tag type="info" size="small">{{
            item.type === 0
              ? "车　组"
              : item.type === 1
              ? "车　牌"
              : item.type === 2
              ? "设备号"
              : item.type === 3
              ? "SIM卡"
              : item.type === 4
              ? "车　主"
              : item.type === 6
              ? "车架号"
              : ""
          }}</el-tag>
        </div>
      </template>
    </el-autocomplete>
    <a-button
      v-if="groupVisible"
      type="primary"
      style="background: #e0e6ec; border-color: #e0e6ec"
      @click="groupClickFn"
      :disabled="disabled"
      ><i
        class="iconfont icon-_bsj_zuzhi"
        style="color: #147adf; font-size: 20px"
      ></i
    ></a-button>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType, watch, computed } from "vue";
import API from "@/api/vehGroup";
import APIType from "@/api/vehGroup/type";
import { ElementOf } from "@/utils";
import { useStore } from "vuex";
import resType from "./type";
import { useMessage } from "@/hooks/web/useMessage";

export default defineComponent({
  name: "vehFuzzySearch",
  props: {
    value: {
      type: Object,
    },
    inputStyle: {
      type: Object as PropType<any>,
      default: () => {
        return { width: "200px" };
      },
    },
    placeholder: {
      type: String,
      default: "选择车辆车组",
    },
    /**
     * 车组BTN 显示/隐藏
     */
    groupVisible: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    /**
     * 车组BTN回调方法
     */
    groupClickFn: Function as PropType<() => Promise<any>>,
    /**
     * tag显示配置
     * 0 车组 1 车牌 2 设备号 3 SIM卡 4 车主 6 车架号
     */
    tagList: {
      type: Array as PropType<number[]>,
      default: [0, 1, 2, 3, 4, 6],
    },
  },
  setup(props, { emit }) {
    const message = useMessage();
    const store = useStore();
    const grouplist = computed(() => {
      if (store.state.groupList) {
        return store.state.groupList;
      }
      return [];
    });

    const vehVal = ref("");
    const vehData = ref<any>([]);

    watch(
      () => props.value,
      (val: any) => {
        if (!val) return;
        vehVal.value =
          val.type === 0
            ? val.groupName
            : val.type === 1
            ? val.plate
            : val.type === 2
            ? val.terminalNo
            : val.type === 3
            ? val.sim
            : val.type === 4
            ? val.owner
            : val.type === 6
            ? val.frameNo
            : "";
      }
    );

    const querySearchAsync = async (queryString: string, cb: any) => {
      try {
        if (queryString.length > 1) {
          // 车组模糊匹配
          const groups = grouplist.value.filter(
            (item: ElementOf<APIType.loadGroupsRes["obj"]["data"]>) =>
              item.gn.toLowerCase().indexOf(queryString.toLowerCase()) > -1
          );

          // 车辆模糊匹配
          const { obj } = await API.searchVehicle({
            plate: queryString,
            searchType: 0,
          });
          // tag显示/隐藏
          let arr: any[] = [];
          if (props.tagList.indexOf(0) === -1) {
            arr = [...obj.data].map((item) => ({
              ...item,
              type:
                props.tagList.indexOf(item.type) === -1
                  ? props.tagList[props.tagList.length - 1]
                  : props.tagList[props.tagList.indexOf(item.type)],
            }));
          } else if (props.tagList.indexOf(1) === -1) {
            arr = [...groups]
              .map((item) => ({
                ...item,
                type: 0,
              }))
              .splice(0, 20);
          } else {
            arr = [...groups.splice(0, 20), ...obj.data].map((item) => ({
              ...item,
              type: item.gi
                ? 0
                : props.tagList.indexOf(item.type) === -1
                ? props.tagList[props.tagList.length - 1]
                : props.tagList[props.tagList.indexOf(item.type)],
            }));
          }
          cb(arr);
        } else {
          cb([]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handleSelect = (data: any) => {
      const { an, gi } = data;
      if (gi && an > 50000) {
        message.error("所选车组下的车辆数不能大于50000辆");
        return;
      }
      const resVal: resType = {
        groupId: data.gi ? data.gi : data.groupId ? data.groupId : 0,
        flag: data.gi ? 0 : data.vehicleId ? 1 : -1,
        vehicleId: data.vehicleId,
        type: data.type,
        plate: data.plate,
        terminalNo: data.terminalNo,
        sim: data.sim,
        owner: data.owner,
        EP: data.EP,
        groupName: data.gn,
        frameNo: data.frameNo
      };

      resVal.flag === -1 && (vehVal.value = "");
      emit("update:value", data ? (resVal.flag === -1 ? null : resVal) : null);
    };

    return {
      vehVal,
      handleSelect,
      vehData,
      querySearchAsync,
    };
  },
});
</script>
<style lang="less" scoped>
.vehFuzzySearch {
  display: flex;
  align-items: center;
  line-height: normal;
  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &__text {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
::v-deep(.ant-btn) {
  padding: 0 13px;
}
</style>
<style lang="less">
.vehFuzzySearch__dropdown {
  z-index: 999999 !important;
  .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    background: #fff;
    font-weight: 400;
  }
}
</style>
