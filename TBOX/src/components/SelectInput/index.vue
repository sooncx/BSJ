<template>
  <div class="main">
    <span class="selectBox">
      <QueryVehOrGroup
        v-model="searchValue"
        @click.native="visible = false"
        :showGroup="showGroup"
        :value="value"
        :size="size"
      />
      <el-button
        slot="append"
        size="small"
        @click="visible = true"
      >
        <template>
          <i class="iconfont icon-Organizationmanagement tree__icon" />
        </template>
      </el-button>
    </span>
    <SelectTree
      :data="treeData"
      :props="defaultProps"
      node-key="organizationId"
      icon="icon-truckgroup"
      :visible="visible"
      @selectNode="selectNode"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { toTreeData } from "@/assets/js/base";
import SelectTree from "@/components/SelectTree/index.vue";
import QueryVehOrGroup from "@/components/QueryVehOrGroup/index.vue";

export default {
  props: {
    value: [Object, Number],
    size: {
      type: String,
      default: "small"
    },
    showGroup: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      searchValue: null,
      visible: false,
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
    value: {
      handler(val) {
        this.searchValue = val;
      },
      immediate: true
    },
    searchValue(val) {
      this.$emit("input", val);
    }
  },

  methods: {
    selectNode(val, visible) {
      this.searchValue = val;
      this.visible = visible;
      this.$emit("input", val);
    }
  },
  components: {
    SelectTree,
    QueryVehOrGroup
  },
  mounted() {
    document.addEventListener("click", e => {
      if (!this.$el.contains(e.target)) this.visible = false;
      //this.$el 可以获取当前组件的容器节点
    });
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-popover {
  z-index: 9999 !important;
  position: fixed;
}
.selectBox {
  display: flex;
  /deep/ .el-button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: none;
    border-color: #c0c4cc;
    height: 32px;
  }
  /deep/ .el-input__inner {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-color: #c0c4cc;
  }

  /deep/ .el-select .el-input.is-focus .el-input__inner {
    border-color: #c0c4cc;
  }
}
.tree {
  &__icon {
    color: rgb(65, 164, 173);
  }
}
</style>
