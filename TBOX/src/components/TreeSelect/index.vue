<template>
  <el-popover
    v-model="visible"
    :width="$refs.input && ($refs.input.$el.offsetWidth - 25)"
    placement="bottom-start"
    trigger="manual"
  >
    <div class="TreeSelect" ref="scroll">
      <el-tree
        v-if="treeIsRender"
        ref="tree"
        :data="data"
        :props="props"
        :node-key="nodeKey"
        @node-click="data => {$emit('input', data);visible = false}"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :highlight-current="true"
      >
        <span
          class="filter-tree__node"
          slot-scope="{ node, data }"
        >
          <i
            v-if="icon"
            class="TreeSelect__icon iconfont"
            :class="[icon]"
          />
          <span>{{ data[props.label] }}</span>
        </span>
      </el-tree>
    </div>
    <el-input
      slot="reference"
      ref="input"
      size="small"
      v-model="filterText"
      :disabled="disabled"
      @focus="!disabled && (visible = true)"
      @blur="handleInputBlur()"
      @click.native.stop="() => {}"
      :style="{width}"
    />
  </el-popover>
</template>

<script>
export default {
  props: {
    value: [Object],
    data: [Array],
    props: [Object],
    nodeKey: [String],
    disabled: {
      type: Boolean,
      default: false
    },
    //需要iconfont具有的的icon
    icon: {
      type: String,
      default: ""
    },
    width: {
      type: String,
      default: '100%'
    }
  },

  data() {
    return {
      visible: false,
      filterText: "",
      treeIsRender: false,
      curNodeClick: {
        timestamp: null,
        nodeId: null
      }
    };
  },

  watch: {
    filterText(val) {
      if (this.value && this.value[this.props.label] === val) return;
      this.$refs.tree && this.$refs.tree.filter(val);
    },
    value: {
      handler(val) {
        if (!val) {
          this.filterText = "";
          this.$refs.tree && this.$refs.tree.setCurrentKey(null); //取消当前节点高亮
          this.$refs.scroll && this.$refs.scroll.scrollTo(0, 0); //容器滚动到头部
          return;
        }
        this.filterText = val[this.props.label];
      },
      immediate: true
    },
    disabled: {
      handler(val) {
        if (val) return;
        !this.treeIsRender && (this.treeIsRender = true); //只执行一次, 避免disabeld时无必要的渲染
      },
      immediate: true
    }
  },

  mounted() {
    document.addEventListener("click", this.handleOnDocumentClick);
  },

  destroyed() {
    document.removeEventListener("click", this.handleOnDocumentClick);
  },

  methods: {
    handleOnDocumentClick(e) {
      e.stopPropagation();
      this.visible = false;
    },
    filterNode(value, data) {
      if (!value) return true;
      return (
        data[this.props.label]
          .toLocaleLowerCase()
          .indexOf(value.toLocaleLowerCase()) !== -1
      );
    },
    async handleInputBlur() {
      await this.$nextTick();
      await this.$sleep(200);
      this.filterText = this.value ? this.value[this.props.label] : ''
    }
  }
};
</script>

<style lang="scss" scoped>
.TreeSelect {
  @include scrollBar;
  max-height: 300px;
  overflow-y: auto;
  margin: 0 -10px;

  &__icon {
    font-size: 14px;
    margin-right: 5px;
  }
}
</style>
