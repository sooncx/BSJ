<template>
  <div class="vehFuzzySearch">
    <a-select
      show-search
      :value="vehVal"
      :style="inputStyle"
      placeholder="车辆车组"
      :default-active-first-option="false"
      :show-arrow="false"
      :filter-option="false"
      :disabled="disabled"
      :not-found-content="null"
      optionLabelProp="text"
      dropdownClassName="vehFuzzySearch__dropdown"
      @search="handleSearch"
      @select="handleChange"
    >
      <a-select-option
        v-for="item in vehData"
        :key="item.vehicleId || item.gi"
        :text="
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
            : ''
        "
      >
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
                : ""
            }}
          </p>
          <a-tag class="vehFuzzySearch__item__tag">{{
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
              : ""
          }}</a-tag>
        </div>
      </a-select-option>
    </a-select>
    <a-button
      v-if="groupVisible"
      type="primary"
      @click="groupClickFn"
      :disabled="disabled"
      ><i class="iconfont icon-_bsj_zuzhi"></i
    ></a-button>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  PropType,
  watch,
  watchEffect,
  computed,
  unref,
} from "vue";
import { useDebounce } from "@/hooks/core/useDebounce";
import API from "@/api/vehGroup";
import APIType from "@/api/vehGroup/type";
import { ElementOf } from "@/utils";
import { useStore } from "vuex";
import resType from "./type";

export default defineComponent({
  name: "vehFuzzySearch",
  props: {
    value: {
      type: Object as PropType<any>,
    },
    inputStyle: {
      type: Object as PropType<any>,
      default: () => {
        return { width: "200px" };
      },
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
     * 0 车组 1 车牌 2 设备号 3 SIM卡 4 车主
     */
    tagList: {
      type: Array as PropType<number[]>,
      default: [0, 1, 2, 3, 4],
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const grouplist = computed(() => {
      if (store.state.groupList) {
        return store.state.groupList;
      }
      return [];
    });

    const vehVal = ref("");
    const vehData = ref<any>([]);
    const [debounceChange] = useDebounce(fuzzyData, 200);

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
            : "";
      }
    );
    async function fuzzyData(value: string) {
      try {
        if (value.length > 1) {
          // 车组模糊匹配
          const groups = grouplist.value.filter(
            (item: ElementOf<APIType.loadGroupsRes["obj"]["data"]>) =>
              item.gn.toLowerCase().indexOf(value.toLowerCase()) > -1
          );

          // 车辆模糊匹配
          const { obj } = await API.searchVehicle({
            plate: value,
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
            arr = [...groups].map((item) => ({
              ...item,
              type: 0,
            }));
          } else {
            arr = [...groups, ...obj.data].map((item) => ({
              ...item,
              type: item.gi
                ? 0
                : props.tagList.indexOf(item.type) === -1
                ? props.tagList[props.tagList.length - 1]
                : props.tagList[props.tagList.indexOf(item.type)],
            }));
          }

          vehData.value = arr;
        }
      } catch (error) {
        console.log(error);
      }
    }

    const handleSearch = (value: string) => {
      debounceChange(value);
    };

    const handleChange = (id: number) => {
      const data =
        vehData.value.filter(
          (i: ElementOf<APIType.searchVehicleRes["obj"]["data"]>) => i.vehicleId === id
        )[0] ||
        vehData.value.filter(
          (i: ElementOf<APIType.loadGroupsRes["obj"]["data"]>) => i.gi === id
        )[0];
      const resVal: resType = {
        groupId: data.gi ? data.gi : data.groupId ? data.groupId : 0,
        flag: data.gi ? 0 : data.vehicleId ? 1 : 0,
        vehicleId: data.vehicleId,
        type: data.type,
        plate: data.plate,
        terminalNo: data.terminalNo,
        sim: data.sim,
        owner: data.owner,
        EP: data.EP,
        groupName: data.gn,
      };
      emit("update:value", resVal);
    };

    return {
      vehVal,
      handleSearch,
      handleChange,
      vehData,
    };
  },
});
</script>
<style lang="less" scoped>
.vehFuzzySearch {
  display: flex;
  align-items: center;
  &__item {
    display: flex;
    justify-content: space-between;

    &__text {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__tag {
      width: 52px;
      text-align: center;
    }
  }
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
