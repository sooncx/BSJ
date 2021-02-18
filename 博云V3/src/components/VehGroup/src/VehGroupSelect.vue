<template>
  <div class="vehGroupSelect" ref="vehGroupSelectRef">
    <VehFuzzySearch
      v-bind="$attrs"
      :groupVisible="true"
      :groupClickFn="onGroupClick"
      :inputStyle="inputStyle"
      :disabled="disabled"
      :tagList="isDbclick ? [0, 1, 2, 3, 4, 6] : [1, 2, 3, 4, 6]"
    />
    <div class="vehGroupSelect__container" v-show="visible">
      <div class="vehGroupSelect__description">
        <div>
          <p v-if="isDbclick">
            <span>“双击”</span>左边节点选择<span>“车组”</span>，
          </p>
          <p><span>“单击”</span>右边节点选择<span>“车辆”</span></p>
        </div>
      </div>
      <div class="vehGroupSelect__dataBox">
        <!-- 车组数据 -->
        <div
          class="vehGroupSelect__treeBox"
          style="border-right: 1px solid #e0e6ec"
          v-loading="loadingGourp"
          element-loading-text="玩命加载中"
        >
          <el-tree
            :data="data"
            :props="defaultProps"
            @node-click="onSelect"
            :expand-on-click-node="false"
          >
            <template #default="{ node, data }">
              <i class="iconfont icon-chezu-1"></i>
              <span
                @dblclick.stop="selectGroup(data)"
                style="flex: 1"
                v-if="isDbclick"
                >{{ node.label }} ({{ data.an }})</span
              >
              <span v-else>{{ node.label }} ({{ data.an }})</span>
            </template>
          </el-tree>
        </div>
        <!-- 车辆数据 -->
        <a-spin tip="玩命加载中..." :spinning="loading">
          <div class="vehGroupSelect__treeBox">
            <ul
              class="vehGroupSelect__vehicleList"
              v-if="vehicleList.length !== 0"
            >
              <li
                v-for="item in vehicleList"
                :key="item.vehicleId"
                @click="selectVehicle(item)"
              >
                <i class="iconfont icon-che-"></i>
                {{ item.plate }}
              </li>
            </ul>
            <a-empty v-else />
          </div>
        </a-spin>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  unref,
  reactive,
  toRefs,
  PropType,
  watchEffect,
} from "vue";
import { Tree } from "ant-design-vue";
import API from "@/api/vehGroup";
import APIType from "@/api/vehGroup/type";
import { ElementOf } from "@/utils";
import { useTimeoutFn } from "@vueuse/core";
import { useStore } from "vuex";
import VehFuzzySearch from "./VehFuzzySearch.vue";
import { useMessage } from '@/hooks/web/useMessage';
import resType from "./type";

interface groupTreeType {
  loadingGourp: boolean;
  data: any;
  defaultProps: {
    children: string;
    label: string;
  };
}

export default defineComponent({
  name: "vehGroupSelect",
  props: {
    /**
     * 是否能双击选车组
     */
    isDbclick: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    inputStyle: {
      type: Object as PropType<any>,
      default: () => {
        return { width: "200px" };
      },
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  components: {
    VehFuzzySearch,
    Tree,
  },
  setup(props, { emit }) {
    const message = useMessage();
    const FuzzyValue = ref<resType | null>(null);
    const loading = ref(false);
    const store = useStore();

    // 车组车辆数据框
    const visible = ref<boolean>(false);
    const onGroupClick = async () => {
      visible.value = await !visible.value;
      groupData.data.length === 0 && (groupData.loadingGourp = true);
      setTimeout(() => {
        groupData.data = store.state.groupListTree;
        groupData.loadingGourp = false;
      }, 100);
    };

    // 车组数据
    const groupData = reactive<groupTreeType>({
      loadingGourp: true,
      data: [],
      defaultProps: {
        children: "children",
        label: "gn",
      },
    });
    const timer = ref<any>(); // 解决双击事件会触发两次单击事件问题
    let groupId: number | null = null;
    // 单击车组获取车辆数据
    const onSelect = (data: any) => {
      timer.value && timer.value.stop();
      timer.value = useTimeoutFn(() => {
        loading.value = true;
        groupId = data.gi;
        getVehicle(data.gi);
      }, 200);
    };

    // 车辆数据
    const vehicleList = ref<APIType.getVehiclesByGroupRdsRes["obj"]["data"]>(
      []
    );
    // 获取车辆数据
    const getVehicle = async (groupId: number) => {
      const { obj } = await API.getVehiclesByGroupRds({ groupId });
      vehicleList.value = obj.data;
      loading.value = false;
    };
    // 选中车辆
    const selectVehicle = (item: any) => {
      emit("update:value", {
        groupId: groupId,
        vehicleId: item.vehicleId,
        groupName: item.plate,
        plate: item.plate,
        terminalNo: item.terminalNo,
        sim: item.sim,
        owner: item.owner,
        type: 1,
        flag: 1,
      });
      visible.value = false;
    };

    // 双击车组
    const selectGroup = (
      row: ElementOf<APIType.loadGroupsRes["obj"]["data"]>
    ) => {
      if (row.an > 50000) {
        message.error("所选车组下的车辆数不能大于50000辆");
        return;
      }

      emit("update:value", {
        groupId: row.gi,
        vehicleId: row.gi,
        groupName: row.gn,
        plate: row.gn,
        type: 0,
        flag: 0,
      });
      visible.value = false;
      timer.value && timer.value.stop();
    };

    const vehGroupSelectRef = ref<HTMLDivElement | null>(null);
    watchEffect(() => {
      document.addEventListener("click", (e) => {
        const el = unref(vehGroupSelectRef);
        if (!el || !unref(el)) {
          return;
        }
        if (!(vehGroupSelectRef.value as any).contains(e.target)) {
          visible.value = false;
        }
      });
    });
    return {
      visible,
      ...toRefs(groupData),
      onGroupClick,
      FuzzyValue,
      loading,
      selectGroup,
      onSelect,
      vehicleList,
      selectVehicle,
      vehGroupSelectRef,
    };
  },
});
</script>
<style lang="less" scoped>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  border-radius: 6px;
  width: 6px;
  background-color: rgba(144, 147, 153, 0.3);
  transition: background-color 0.3s;
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(144, 147, 153, 0.5);
}
::-webkit-scrollbar-thumb:active {
  background-color: rgba(144, 147, 153, 0.5);
}

.vehGroupSelect {
  position: relative;
  &__container {
    position: absolute;
    top: 35px;
    background: #fff;
    border: 1px solid #d9e0e9;
    box-shadow: 0 4px 8px #999;
    z-index: 1000;
  }

  &__description {
    padding: 10px 10px 4px;
    > div {
      display: flex;
      background: #e8f3ff;
      font-size: 12px;
      color: #147adf;
      height: 24px;
      line-height: 24px;
      align-items: center;
      justify-content: center;
    }
  }

  &__dataBox {
    display: flex;
    height: 280px;
    padding: 6px 0 0;
    box-sizing: border-box;
  }

  &__treeBox {
    width: 200px;
    height: 274px;
    padding: 0 11px;
    box-sizing: border-box;
    overflow: auto;
    .iconfont {
      margin-right: 4px;
      color: #8f96a7;
    }
  }

  &__vehicleList {
    box-sizing: border-box;
    color: #333333;
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    font-feature-settings: "tnum";
    margin: 0;
    padding: 0;
    li {
      margin: 0;
      padding: 4px 0;
      white-space: nowrap;
      list-style: none;
      cursor: pointer;
      outline: 0;
      &:first-child {
        padding-top: 7px;
      }
    }
  }
}

.ant-empty {
  margin: 30px 0;
}
</style>