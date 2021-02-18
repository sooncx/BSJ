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
          <i class="filter-tree__tree-icon iconfont icon-Organizationmanagement" />
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
      testData: [
        {
          organizationId: 122,
          organizationName: "TEST",
          parentId: 0,
          total: 1,
          userId: 0
        },
        {
          organizationId: 173,
          organizationName: "lcl",
          parentId: 122,
          total: 0,
          userId: 0
        },
        {
          organizationId: 175,
          organizationName: "解决",
          parentId: 0,
          total: 0,
          userId: 0
        },
        {
          organizationId: 176,
          organizationName: "的顶顶顶顶顶",
          parentId: 122,
          total: 0,
          userId: 0
        },
        {
          organizationId: 177,
          organizationName: "对对对点点滴滴",
          parentId: 175,
          total: 0,
          userId: 0
        },
        {
          organizationId: 178,
          organizationName: "对对对的",
          parentId: 177,
          total: 0,
          userId: 0
        },
        {
          organizationId: 180,
          organizationName: "le",
          parentId: 0,
          total: 1,
          userId: 0
        },
        {
          organizationId: 184,
          organizationName: "1",
          parentId: 0,
          total: 1,
          userId: 0
        },
        {
          organizationId: 185,
          organizationName: "2",
          parentId: 0,
          total: 0,
          userId: 0
        },
        {
          organizationId: 187,
          organizationName: "4",
          parentId: 0,
          total: 1,
          userId: 0
        },
        {
          organizationId: 188,
          organizationName: "5",
          parentId: 0,
          total: 2,
          userId: 0
        },
        {
          organizationId: 189,
          organizationName: "6蜈蚣",
          parentId: 0,
          total: 0,
          userId: 0
        },
        {
          organizationId: 191,
          organizationName: "125800",
          parentId: 0,
          total: 0,
          userId: 0
        },
        {
          organizationId: 193,
          organizationName: "IOT",
          parentId: 0,
          total: 6,
          userId: 0
        },
        {
          organizationId: 196,
          organizationName: "bbb",
          parentId: 0,
          total: 0,
          userId: 0
        },
        {
          organizationId: 197,
          organizationName: "ll",
          parentId: 175,
          total: 3,
          userId: 0
        },
        {
          organizationId: 198,
          organizationName: "pp",
          parentId: 0,
          total: 2,
          userId: 0
        },
        {
          organizationId: 199,
          organizationName: "123",
          parentId: 173,
          total: 0,
          userId: 0
        },
        {
          organizationId: 201,
          organizationName: "test",
          parentId: 0,
          total: 0,
          userId: 0
        },
        {
          organizationId: 202,
          organizationName: "test",
          parentId: 0,
          total: 0,
          userId: 0
        },
        {
          organizationId: 203,
          organizationName: "test",
          parentId: 0,
          total: 0,
          userId: 0
        },
        {
          organizationId: 204,
          organizationName: "test",
          parentId: 0,
          total: 0,
          userId: 0
        },
        {
          organizationId: 205,
          organizationName: "test",
          parentId: 0,
          total: 994,
          userId: 0
        },
        {
          organizationId: 206,
          organizationName: "test1",
          parentId: 0,
          total: 2,
          userId: 0
        },
        {
          organizationId: 207,
          organizationName: "IOT12",
          parentId: 0,
          total: 0,
          userId: 0
        }
      ],
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
      return toTreeData(this.testData, {
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
    handleGroupClick(type) {
      switch (type) {
        case "onAddGroup":
          this.$emit("onAddGroup");
          break;
        case "onDeleteGroup":
          this.$emit("onDeleteGroup");
          break;
        case "onEditGroup":
          this.$emit("onEditGroup");
          break;
        case "addToGroup":
          this.$emit("onHandleVeh", "addToGroup");
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
    // @include scrollBar;
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
    color: #18c18b;
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
      color: #18c18b;
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
