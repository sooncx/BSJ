<template>
  <div class="TreeList">
    <div class="header">
      <div class="title">
        车组列表
      </div>
      <div
        class="btn"
        v-if="selectedKeys.size != 0"
        @click="allTreeNodeFn"
      >
        <!-- {{isChoseAllTreeNode()?"取消选择":"全选"}} -->
        取消选择
      </div>
    </div>
    <div class="content">
      <div
        class="loadingBox"
        v-show="loading"
        v-loading="loading"
      ></div>
      <el-tree
        v-show="!loading"
        ref="tree"
        node-key="gi"
        :data="TreeData"
        :props="defaultProps"
        :default-expanded-keys="expendkey"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        @node-contextmenu="rightClick"
        :highlight-current="true"
      >
        <template #default="{ node, data }">
          <span
            class="custom-tree-node treeNode"
            :class="selectedKeys.has(data.gi)?'treeNode__on':''"
          >
            <i
              class="iconfont treeIcon"
              :class="data.gi == -1?'icon-zhongdianguanzhu redIcon':data.gi == -2?'icon-wifi-copy redIcon':'icon-_bsj_zuzhi normalIcon'"
            ></i>
            <span>{{ node.label + " ("+data.an+")"}}</span>
          </span>
        </template>
      </el-tree>
    </div>
  </div>
  <div
    v-show="menuVisible"
    class="rightClickMenu"
  >
    <ul
      id="menu"
      class="menu"
    >
      <li
        class="menu__item"
        @click="rightClickFn('绑定省市区')"
      >绑定省市区</li>
      <li
        class="menu__item"
        @click="rightClickFn('无线回传')"
      >无线回传</li>
      <li
        class="menu__item"
        @click="rightClickFn('超速设置')"
      >超速设置</li>
    </ul>
  </div>
  <OthersDialog
    v-model:visible="OtherDialogVisible"
    :groupInfo="groupInfo"
    :DialogType="DialogType"
    :title="DialogTitle"
    :command="command"
    :isGroup="true"
  />
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  watch,
  nextTick,
  defineAsyncComponent,
  inject,
  computed,
} from "vue";
import { useStore } from "vuex";
import { toTreeData } from "@/utils";
export default defineComponent({
  components: {
    OthersDialog: defineAsyncComponent(
      () => import("../LeftContent/dialog/OthersDialog.vue")
    ),
  },
  props: {
    selectedVeh: {
      type: Object,
      default: null,
    },
    selectedAllVehs: {
      type: Object,
      default: () => new Map(),
    },
    selectGroupId: {
      type: Object,
      default: () => new Set(),
    },
    SearchValue: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const data = reactive({
      command: null, // 指令
      loading: false,
      OtherDialogVisible: false,
      groupInfo: null, // 车组信息
      DialogType: "", // 鼠标右键弹窗类型
      DialogTitle: "", // 鼠标右键弹窗标题
      menuVisible: false, // 鼠标右键选项卡visible
      tree: null as any, // 树ref
      expendkey: [], // 展开车组id集合
      expendList: [] as any, // 展开车组id集合
      rightClickVal: [] as any, // 鼠标右键点击节点数据
      selectedKeys: new Set(), // 已选的车组id集合
      defaultProps: {
        children: "children",
        label: "gn",
      },
      // 判断是否选中所有车组
      isChoseAllTreeNode: function () {
        if (!store.state.allGroupList) return false;
        return store.state.allGroupList.length == data.selectedKeys.size;
      },
      // 全选/取消全选车组
      allTreeNodeFn: function () {
        // if (data.isChoseAllTreeNode()) {
        //   data.selectedKeys = new Set();
        // } else {
        //   for (let item of store.state.allGroupList) {
        //     data.selectedKeys.add((item as any).gi);
        //   }
        // }
        data.selectedKeys = new Set();
        setTimeout(() => {
          emit("update:selectGroupId", data.selectedKeys);
        }, 100);
      },
      // 树右键事件
      rightClick: (MouseEvent: any, object: any) => {
        if ([-1, -2].includes(object.gi)) return;
        // 阻止浏览器默认右键事件
        document.oncontextmenu = function () {
          return false;
        };
        data.menuVisible = false; // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
        data.menuVisible = true; // 显示模态窗口，跳出自定义菜单栏
        let menu: any = document.querySelector("#menu");
        menu.style.left =
          MouseEvent.clientX > 180 ? 140 : MouseEvent.clientX + 20 + "px";
        document.addEventListener("click", data.closeRightClick); // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
        menu.style.top = MouseEvent.clientY - 60 + "px";
        data.rightClickVal.push(object); // 当前点击节点数据
        data.groupInfo = { ...object } as any;
      },
      closeRightClick: () => {
        // 取消鼠标监听事件 菜单栏
        data.menuVisible = false;
        document.removeEventListener("click", data.closeRightClick); // 弹窗开启后要及时关掉监听。
        document.oncontextmenu = function () {
          return true;
        };
      },
      // 树右键点击选项卡事件
      rightClickFn: (type: string) => {
        data.OtherDialogVisible = true;
        data.DialogType = type;
        data.DialogTitle = type;
        switch (type) {
          case "绑定省市区":
            break;
          case "无线回传":
            let arr1 = store.state.terminalList.filter((item: any) => {
              return item.name == type;
            });
            data.command = arr1[0];
            break;
          case "超速设置":
            let arr2 = store.state.terminalList.filter((item: any) => {
              return item.name == type;
            });
            data.command = arr2[0];
            break;
          default:
            break;
        }
      },
    });
    // 树点击事件
    function handleNodeClick(e: any) {
      if (data.selectedKeys.has(e.gi)) {
        data.selectedKeys.delete(e.gi);
      } else {
        data.selectedKeys.add(e.gi);
      }
      setTimeout(() => {
        emit("update:selectGroupId", new Set([...data.selectedKeys]));
      }, 100);
    }
    //滚动到组织树状图当前高亮节点
    async function scrollToTreeHighLight() {
      setTimeout(() => {
        const activeDom = data.tree.$el.getElementsByClassName("is-current")[0];
        activeDom && activeDom.scrollIntoView({ block: "center" });
      }, 0);
    }
    // const cx = await treeFindPath(
    //   TreeData.value,
    //   (data: any) => data.gi == val.groupId
    // );
    // console.log(cx, "cxxxxxxxxxxxxxx");
    function treeFindPath(tree: any, func: any, path = [] as any): any {
      if (!tree) return [];
      for (const data of tree) {
        // 这里按照你的需求来存放最后返回的内容吧
        path.push(data.gi);
        if (func(data)) return path;
        if (data.children) {
          const findChildren = treeFindPath(data.children, func, path);
          if (findChildren.length) return findChildren;
        }
        path.pop();
      }
      return [];
    }
    // 展开当前查询或点击的车组或车辆并滚动到可视范围并选中
    async function setexpend(val: any) {
      await getParents(val);
      data.loading = true;
      setTimeout(async () => {
        data.expendkey = data.expendList;
        await data.tree.setCurrentKey(val.groupId);
      }, 10);
      setTimeout(() => {
        data.loading = false;
      }, 300);
      setTimeout(() => {
        scrollToTreeHighLight();
      }, 400);
    }
    // 获取当前查询或点击节点的所有父级节点
    function getParents(val: any) {
      data.expendList = [];
      let parentList = [] as any;
      // 建立车组id gi -> 父级车组id pi的映射
      store.state.groupList.map((item: any) => {
        if (item.pi != undefined) {
          parentList[item.gi] = item.pi;
        }
      });
      findParent(val.groupId);
      // 传入所有organizationId，获取所有非0的parentList
      function findParent(id: string) {
        if (parentList[id] != undefined) {
          parentList[id] != 0 && data.expendList.push(parentList[id]);
          findParent(parentList[id]);
        }
      }
    }
    const TreeData = computed(() => {
      return toTreeData(store.state.allGroupList, {
        id: "gi",
        parentId: "pi",
      }) as any;
    });
    watch(
      () => props.SearchValue,
      (val) => {
        if (!val) return;
        const veh = {
          ...val,
          gi: val.groupId,
        };
        setexpend(veh);
        data.selectedKeys.add(val.groupId);
        setTimeout(() => {
          emit("update:selectGroupId", new Set([...data.selectedKeys]));
        }, 50);
      }
    );
    return {
      TreeData,
      ...toRefs(data),
      handleNodeClick,
    };
  },
});
</script>
<style lang="less" scoped>
* {
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
}
.TreeList {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    height: 40px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    border-bottom: 2px solid #ededed;
    .title {
      font-size: 16px;
      font-family: PingFang SC Medium, PingFang SC Medium-Medium;
      font-weight: 500;
      color: #333333;
    }
    .btn {
      color: #075ed2;
      font-size: 14px;
      cursor: pointer;
      &:hover {
        color: blue;
      }
    }
  }
  .content {
    flex: 1;
    overflow-y: auto;
    position: relative;
    .loadingBox {
      position: absolute;
      height: 100%;
      width: 100%;
      background: rgba(255, 255, 255, 0.397);
      top: 0;
      left: 0;
      z-index: 9;
    }
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
  }
}
.Atree {
  color: #8e97aa;
  i {
    color: #8e97aa;
  }
}
.redIcon {
  color: #d12626;
}
.normalIcon {
  color: #8e97aa;
}
.treeIcon {
  padding-right: 5px;
}
.treeNode {
  &__on {
    color: rgb(0, 132, 255);
    flex: 1;
    padding: 4px 0;
    background: #e0f4ff;
  }
}
.rightClickMenu {
  cursor: pointer;
  .menu {
    z-index: 999999 !important;
    width: 100px;
    position: absolute;
    border-radius: 5px;
    border: 1px solid #dddada;
    background-color: #fff;
    .menu__item {
      display: block;
      line-height: 20px;
      text-align: center;
      margin: 3px 0;
      text-align: left;
      padding: 2px 5px;
      &:hover {
        background-color: #1790ff;
        color: white;
      }
    }
  }
}
</style>