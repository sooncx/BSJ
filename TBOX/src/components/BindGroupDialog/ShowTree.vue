<template>
  <div class="ShowTree">
    <div class="ShowTree__label">已选择组织</div>

    <div class="ShowTree__content">
      <el-tree
        ref="tree"
        :data="treeData"
        :props="defaultProps"
        :expand-on-click-node="false"
        node-key="organizationId"
        :highlight-current="true"
      >
        <span
          class="ShowTree__node"
          slot-scope="{ data }"
        >
          <i class="ShowTree__tree-icon iconfont icon-TruckGroup" />
          <span>{{ data.organizationName }}</span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { toTreeData } from "@/assets/js/base";

export default {
  props: {
    checkedKeys: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      defaultProps: {
        children: "children",
        label: "organizationName"
      }
    };
  },

  computed: {
    ...mapState(["GROUPLIST"]),
    treeData() {
      const { GROUPLIST, checkedKeys } = this;
      //当前组织id 与 组织 的映射
      const groupListMap = new Map(
        GROUPLIST.map(item => [item.organizationId, item])
      );
      //获取选择的节点 data
      const checkedList = checkedKeys
        .map(key => groupListMap.get(key))
        .filter(item => item);
      return toTreeData(checkedList, {
        id: "organizationId",
        parentId: "parentId"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.ShowTree {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 16px;

  &__label {
    height: 32px;
    line-height: 32px;
    color: $primary;
  }

  &__content {
    margin-top: 16px;
    flex: 1;
    overflow-y: auto;
    @include scrollBar;
  }

  &__node {
    display: flex;
    align-items: center;
  }

  &__tree-icon {
    margin-right: 5px;
    font-size: 14px;
    color: $primary;
  }
}
</style>
