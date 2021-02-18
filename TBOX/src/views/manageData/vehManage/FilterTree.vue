<template>
  <div class="filter-tree">
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText"
      size="small"
      suffix-icon="el-icon-search"
    />

    <div class="filter-tree__content">
      <el-tree
        ref="tree"
        :data="treeData"
        :props="defaultProps"
        @node-click="data => $emit('input', data)"
        :expand-on-click-node="false"
        node-key="organizationId"
        :filter-node-method="filterNode"
        :highlight-current="true"
      >
        <span
          class="filter-tree__node"
          slot-scope="{ node, data }"
        >
          <i class="filter-tree__tree-icon iconfont icon-TruckGroup" />
          <span>{{ data.organizationName }}</span>
          <span class="filter-tree__total">({{ data.total }})</span>
          <span class="filter-tree__icon-box">
            <i
              class="filter-tree__icon iconfont"
              v-for="item in iconList"
              :key="item.value"
              :class="item.icon"
              :title="item.title"
              @click.stop="handleGroupClick(item.value, data)"
            />
          </span>
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
      type: Object,
      default: undefined
    }
  },

  data() {
    return {
      filterText: "",
      defaultProps: {
        children: "children",
        label: "organizationName"
      },
      iconList: [
        { icon: "icon-Caraddinggroup", title: "添加组织", value: "onAddGroup" },
        {
          icon: "icon-Deletetrainset",
          title: "删除组织",
          value: "onDeleteGroup"
        },
        { icon: "icon-modify-", title: "修改组织", value: "onEditGroup" },
        { icon: "icon-Additionalcar", title: "添加车辆", value: "addToGroup" }
      ]
    };
  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },

  computed: {
    ...mapState(["GROUPLIST", "USER"]),
    treeData() {
      return toTreeData(this.GROUPLIST, {
        id: "organizationId",
        parentId: "parentId"
      });
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
    handleGroupClick(type, data) {
      switch (type) {
        case "onAddGroup":
          this.$emit("onAddGroup", { ...data, userId: this.USER.userId });
          break;
        case "onDeleteGroup":
          this.$emit("onDeleteGroup", { ids: String(data.organizationId) });
          break;
        case "onEditGroup":
          this.$emit("onEditGroup", data);
          break;
        case "addToGroup":
          this.$emit("onHandleVeh", "addToGroup", data);
          break;
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

  &__total {
    color: currentColor;
    margin-left: 5px;
  }

  &__tree-icon {
    margin-right: 5px;
    font-size: 14px;
    color: $primary;
  }

  &__icon-box {
    display: none;
  }

  &__icon {
    margin-left: 10px;
    color: #cfcfcf;
    font-size: 14px;

    & + & {
      margin-left: 5px;
    }

    &:hover {
      color: $primary;
    }
  }
}

.el-tree-node__content {
  &:hover {
    .filter-tree__icon-box {
      display: block;
    }
  }
}
</style>
