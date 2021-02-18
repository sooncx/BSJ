<template>
  <el-popover
    v-model:visible="visible"
    ref="inputRef"
    :width="inputRef && inputRef.$el.nextSibling.offsetWidth"
    placement="bottom-start"
    trigger="click"
  >
    <div
      class="groupSelect"
      ref="scrollRef"
    >
      <el-tree
        v-if="treeIsRender"
        ref="treeRef"
        :data="treeData"
        :default-expand-all="false"
        :default-expanded-keys="expendkey"
        node-key="gi"
        :props="{
          children: 'children',
          label: 'gn',
        }"
        @node-click="
          (data) => {
            $emit('update:value', data);
            visible = false;
          }
        "
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :highlight-current="true"
      >
        <template #defalut="{ data }">
          <span class="filter-tree__node">
            <span>{{ data[props.label] }}</span>
          </span>
        </template>
      </el-tree>
    </div>
    <template #reference>
      <el-input
        size="small"
        v-model="filterText"
        :disabled="disabled"
        @focus="handleInputFocus()"
        @blur="handleInputBlur()"
        @click.stop="() => {}"
        :style="{ width }"
      />
    </template>
  </el-popover>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  computed,
  watchEffect,
  watch,
  nextTick,
} from "vue";
import { useStore } from "vuex";
import { toTreeData } from "@/utils";

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "100%",
    },
    allChecked: {
      type: Boolean,
      default: true,
    },
    show: {
      type: Boolean,
      default: false,
    },
    value: Object,
  },
  setup(props) {
    const inputRef = ref();
    const scrollRef = ref();
    const treeRef = ref();
    const store = useStore();
    const data = reactive({
      focusFlag: false,
      visible: false,
      expendList: [] as any,
      expendkey: [0],
      filterText: "",
      treeIsRender: false,
      treeData: [] as any,
      async handleInputFocus() {
        data.focusFlag = true;
        await data.getParents(props.value);
        data.expendkey = [...new Set([...data.expendList, 0])];
        setTimeout(() => {
          const activeDom = treeRef.value.$el.getElementsByClassName(
            "is-current"
          )[0];
          activeDom && activeDom.scrollIntoView({ block: "center" });
        }, 200);
      },
      // 获取当前查询或点击节点的所有父级节点
      getParents(val: any) {
        data.expendList = [];
        let parentList = [] as any;
        // 建立车组id gi -> 父级车组id pi的映射
        store.state.groupList.map((item: any) => {
          if (item.pi != undefined) {
            parentList[item.gi] = item.pi;
          }
        });
        findParent(val.gi);
        // 传入所有organizationId，获取所有非0的parentList
        function findParent(id: string) {
          if (parentList[id] != undefined) {
            parentList[id] != 0 && data.expendList.push(parentList[id]);
            findParent(parentList[id]);
          }
        }
      },
      handleInputBlur() {
        data.focusFlag = false;
        // 延时，避免提前触发模糊搜索
        setTimeout(() => {
          data.filterText = props.value ? props.value.gn : "";
        }, 200);
      },
      filterNode(value: any, data: any) {
        if (!value) return true;
        return (
          data.gn.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
        );
      },
    });

    watch(
      () => props.disabled,
      (val) => {
        if (val) return;
        !data.treeIsRender && (data.treeIsRender = true); //只执行一次, 避免disabeld时无必要的渲染
      },
      {
        immediate: true,
      }
    );

    watch(
      () => props.value,
      (val) => {
        if (!val) {
          data.filterText = "";
          treeRef.value && (treeRef.value as any).setCurrentKey(null); //取消当前节点高亮
          scrollRef.value && (scrollRef.value as any).scrollTo(0, 0); //容器滚动到头部
          return;
        }
        // 设置当前设置节点高亮
        treeRef.value && (treeRef.value as any).setCurrentKey(val.gi);
        data.filterText = val.gn;
      },
      {
        immediate: true,
      }
    );
    watch(
      () => data.filterText,
      (val) => {
        if (!data.focusFlag) return; // 初次渲染不做模糊搜索
        setTimeout(() => {
          treeRef.value.filter(val);
        }, 100);
      }
    );
    watch(
      () => props.show,
      (val) => {
        if (!val) {
          treeRef.value.filter(""); // 关闭窗口重置上次模糊搜索状态
        } else {
          setTimeout(() => {
            if (props.allChecked) {
              data.treeData = [
                {
                  gn: "车辆管理",
                  gi: 0,
                  children:
                    toTreeData(store.state.groupList, {
                      id: "gi",
                      parentId: "pi",
                    }) || [],
                },
              ];
            } else {
              data.treeData =
                toTreeData(store.state.groupList, {
                  id: "gi",
                  parentId: "pi",
                }) || [];
            }
          }, 500);
        }
      },
      {
        immediate: true,
      }
    );
    return {
      inputRef,
      treeRef,
      scrollRef,
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.groupSelect {
  max-height: 300px;
  overflow: auto;
  margin: 0 -10px;
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    width: 6px;
    background-color: rgba(144, 147, 153, 0.3);
    transition: background-color 0.3s;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(144, 147, 153, 0.5);
  }
  &::-webkit-scrollbar-thumb:active {
    background-color: rgba(144, 147, 153, 0.5);
  }
  ::v-deep(.el-tree > .el-tree-node) {
    padding-right: 10px;
    min-width: 100%;
    display: inline-block;
  }
}
</style>
