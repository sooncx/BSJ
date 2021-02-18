<template>
  <div class="groupTree">
    <div class="searchInput">
      <VehFuzzySearch
        v-model:value="SearchValue"
        :inputStyle="{width: '100%'}"
        :groupClickFn="onGroupClick"
        :tagList="[0]"
      />
    </div>
    <div class="treeBox">
      <el-tree
        ref="tree"
        node-key="gi"
        :data="TreeData"
        :props="defaultProps"
        :expand-on-click-node="false"
        show-checkbox
        :default-expanded-keys="expendkey"
        :check-on-click-node="true"
        :check-strictly="true"
        @check="handleNodeClick"
        :highlight-current="true"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node treeNode">
            <span>{{ node.label}}</span>
            <span>{{"  ("+data.tt+"台"+")"}}</span>
          </span>
        </template>
      </el-tree>
    </div>
  </div>
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
import MAPI from "@/api/vehGroup";
import { toTreeData } from "@/utils";
import { useFunction } from "../../views/monitorCenter/function";
import VehFuzzySearch from "@/components/VehGroup/src/VehFuzzySearch.vue";
import { useStore } from "vuex";
export default defineComponent({
  components: {
    VehFuzzySearch,
  },
  props: {
    treeList: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const { getVehicleInfoByGroupList } = useFunction();
    const store = useStore();
    const data = reactive({
      expendList: [] as any,
      parentList: [] as any,
      expendkey: [],
      gids: new Set(),
      tree: null as any,
      SearchValue: null,
      TreeData: [],
      listMap: new Map(),
      defaultProps: {
        children: "children",
        label: "gn",
      },
      async handleNodeClick(val: any) {
        console.log(val, "vallll");
        if (data.listMap.has(val.gi)) {
          data.listMap.delete(val.gi);
          emit("update:treeList", [...data.listMap.values()]);
        } else {
          const res = await getVehicleInfoByGroupList(val.gi);
          data.listMap.set(val.gi, [...res]);
          emit("update:treeList", [...data.listMap.values()]);
        }
      },
      onGroupClick(val: any) {
        console.log(val);
      },
    });
    async function getVehGroupData() {
      const list = store.state.groupList;
      if (!list) {
        data.TreeData = [];
      } else {
        data.TreeData = toTreeData(list, { id: "gi", parentId: "pi" }) as any;
      }
    }
    //滚动到组织树状图当前高亮节点
    async function scrollToTreeHighLight() {
      setTimeout(() => {
        const activeDom = data.tree.$el.getElementsByClassName("is-current")[0];
        activeDom && activeDom.scrollIntoView({ block: "center" });
      }, 200);
    }
    // 展开当前查询或点击的车组或车辆并滚动到可视范围并选中
    async function setexpend(val: any) {
      await getParents(val);
      setTimeout(async () => {
        data.expendkey = data.expendList;
        await data.tree.setCurrentKey(val.groupId);
        // await data.tree.setCheckedKeys([...data.gids]);
        scrollToTreeHighLight();
      }, 100);
    }
    // 获取当前查询或点击节点的所有父级节点
    function getParents(val: any) {
      data.expendList = [];
      // 建立车组id gi -> 父级车组id pi的映射
      store.state.groupList.map((item: any) => {
        if (item.pi != undefined) {
          data.parentList[item.gi] = item.pi;
        }
      });
      findParent(val.groupId);
      // 传入所有organizationId，获取所有非0的parentList
      function findParent(id: string) {
        if (data.parentList[id] != undefined) {
          data.parentList[id] != 0 && data.expendList.push(data.parentList[id]);
          findParent(data.parentList[id]);
        }
      }
    }
    nextTick(() => {
      getVehGroupData();
    });
    watch(
      () => data.SearchValue,
      (val: any) => {
        if (val) {
          data.gids = new Set([...data.tree.getCheckedKeys(), val.groupId]);
          const veh = {
            ...val,
            gi: val.groupId || null,
          };
          // 选中模糊查询的车组
          data.handleNodeClick(veh);
          //
          setexpend(val);
        }
      }
    );
    return { ...toRefs(props), ...toRefs(data) };
  },
});
</script>
<style lang="less" scoped>
.groupTree {
  width: 100% !important;
  height: 100% !important;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  .searchInput {
    width: 100%;
    margin-bottom: 10px;
  }
  .treeBox {
    width: 100%;
    height: 100%;
    overflow: auto;
    ::v-deep(.el-tree > .el-tree-node) {
      padding-right: 10px;
      min-width: 100%;
      display: inline-block;
    }
  }
}
</style>