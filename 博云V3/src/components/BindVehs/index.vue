<template>
  <Eldialog
    v-bind="$attrs"
    v-model:visible="show"
    width="1000px"
    title="绑车"
  >
    <template v-slot:form>
      <div
        class="BindVehs"
        v-if="visible"
      >
        <div class="groupTree">
          <div class="title">选择车组</div>
          <GroupTree v-model:treeList="treeList" />
        </div>
        <div class="vehTree">
          <div class="title">选择车辆</div>
          <VehTree
            :type="'add'"
            v-model:treeList="treeList"
            v-model:bindList="bindList"
            @confirmFnOK="confirmFnOK"
          />
        </div>
        <div class="bindedTree">
          <div class="title">已选择车辆</div>
          <VehTree
            :type="'delete'"
            v-model:bindList="bindList"
            @confirmFnOK="cancleFnOK"
          />
        </div>
      </div>
    </template>
  </Eldialog>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  reactive,
  toRefs,
  watch,
} from "vue";
import Eldialog from "@/components/Eldialog/index.vue";
import GroupTree from "./groupTree.vue";
import VehTree from "./vehTree.vue";
import { useFunction } from "../../views/monitorCenter/function";
export default defineComponent({
  components: {
    Eldialog,
    GroupTree,
    VehTree,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const {
      getVehicleChargeByUserId,
      UpdateOrAddVehicleCharge,
      deleteVehicleCharge,
    } = useFunction();
    const data = reactive({
      treeList: [],
      bindList: [],
      async confirmFnOK(list: any) {
        let arr = [] as any;
        list.map((item: any) => {
          arr.push(item.vehicleId);
        });
        const res = await UpdateOrAddVehicleCharge(arr.join(","));
        if (res == 1) {
          const res = await getVehicleChargeByUserId();
          data.bindList = [...res] as any;
        }
      },
      async cancleFnOK(list: any) {
        let arr = [] as any;
        list.map((item: any) => {
          arr.push(item.vehicleId);
        });
        const res = await deleteVehicleCharge(arr.join(","));
        if (res == 1) {
          const res = await getVehicleChargeByUserId();
          data.bindList = [...res] as any;
        }
      },
    });
    const show = computed({
      get: () => props.visible,
      set: (val) => {
        emit("update:visible", val);
      },
    });
    watch(
      () => props.visible,
      async (val) => {
        if (!val) {
          data.treeList = [];
        }
        const res = await getVehicleChargeByUserId();
        data.bindList = [...res] as any;
      }
    );
    return { show, ...toRefs(props), ...toRefs(data) };
  },
});
</script>
<style lang="less" scoped>
.BindVehs {
  height: 550px;
  padding: 0 16px;
  display: flex;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
  .vehTree,
  .bindedTree {
    width: 35%;
    height: 100%;
    overflow: hidden;
    .title {
      height: 30px;
      padding: 5px;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: center;
    }
  }
  .groupTree {
    width: 28%;
    height: calc(100% - 40px);
    .title {
      height: 30px;
      width: 100%;
      padding: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>