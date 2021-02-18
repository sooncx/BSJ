<template>
  <div class="filter-tree">
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText"
      size="small"
      suffix-icon="el-icon-search"
    />

    <div
      class="filter-tree__content"
      ref="scroll"
    >
      <el-tree
        ref="tree"
        :data="treeData"
        :props="defaultProps"
        :expand-on-click-node="false"
        node-key="organizationId"
        :filter-node-method="filterNode"
        :highlight-current="true"
        @check="handleCheck"
        check-strictly
        show-checkbox
      >
        <span
          class="filter-tree__node"
          slot-scope="{ node, data }"
        >
          <i class="filter-tree__tree-icon iconfont icon-TruckGroup" />
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
    value: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      filterText: "",
      defaultProps: {
        children: "children",
        label: "organizationName"
      }
    };
  },

  computed: {
    ...mapState(["GROUPLIST"]),
    treeData() {
      return toTreeData(this.GROUPLIST, {
        id: "organizationId",
        parentId: "parentId"
      });
    }
  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    value: {
      async handler(val) {
        if(!this.$refs.tree) await this.$nextTick();
        this.$refs.tree.setCheckedKeys(val);

        //init state
        if (val.length === 0) {
          this.filterText = "";
          this.$refs.tree && this.$refs.tree.setCurrentKey(null); //取消当前节点高亮
          this.$refs.scroll.scrollTo(0, 0); //容器滚动到头部
        }
      },
      immediate: true
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return (
        data.organizationName
          .toLocaleLowerCase()
          .indexOf(value.toLocaleLowerCase()) !== -1
      );
    },
    handleCheck(data) {
      const waitChecks = getWaitChecks(data);
      const checkedKeys = this.$refs.tree.getCheckedKeys(); //已选节点

      //获取当前选择的节点key
      let nowCheckedKeys = [];
      if (checkedKeys.find(key => key === data.organizationId)) {
        nowCheckedKeys = [...new Set([...waitChecks, ...checkedKeys])];
      } else {
        const waitChecksSet = new Set(waitChecks);
        nowCheckedKeys = checkedKeys.filter(gid => !waitChecksSet.has(gid));
      }

      this.$emit("input", nowCheckedKeys);

      //获取待选择节点
      function getWaitChecks(data) {
        let waitChecks = [data.organizationId]; //待选择节点
        runChildren(data);
        return waitChecks;

        function runChildren(data) {
          if (data.children) {
            data.children.map(item => {
              waitChecks.push(item.organizationId);
              runChildren(item);
            });
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.filter-tree {
  flex: 1;
  display: flex;
  flex-direction: column;

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
    margin: 0 5px 0 10px;
    font-size: 14px;
    color: $primary;
  }
}
</style>
