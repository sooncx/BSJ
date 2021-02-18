<template>
  <div class="fence">
    <div class="fence__header">
      <div
        class="left"
        v-if="!showSearch"
      >
        <p>围栏</p>
        <!-- <a-tooltip placement="bottom">
          <template #title>
            <span>所谓围栏，就是...</span>
          </template>
          <i class="iconfont icon-yiwen"></i>
        </a-tooltip> -->
      </div>
      <div
        class="left"
        v-else
      >
        <el-select
          size="mini"
          v-model="searchValue"
          filterable
          remote
          reserve-keyword
          placeholder="请输入围栏名称"
          :remote-method="remoteMethod"
          @change="selectChange"
        >
          <el-option
            v-for="item in options"
            :key="item.pathId"
            :label="item.pathName"
            :value="item.pathId"
          >
          </el-option>
        </el-select>
      </div>
      <div class="right">
        <a-tooltip placement="bottom">
          <template #title>
            <span>搜索</span>
          </template>
          <i
            class="iconfont icon-sousuo"
            @click="fenceSlideFn('search')"
          ></i>
        </a-tooltip>
        <a-tooltip placement="bottom">
          <template #title>
            <span>添加</span>
          </template>
          <i
            class="iconfont icon-zengjia"
            @click="fenceSlideFn('add')"
          ></i>
        </a-tooltip>
        <a-tooltip placement="bottom">
          <template #title>
            <span>{{showFence?"隐藏":"显示"}}</span>
          </template>
          <i
            class="iconfont"
            :class="showFence?'icon-xianshi':'icon-buxianshi'"
            @click="fenceSlideFn('toggle')"
          ></i>
        </a-tooltip>
        <a-tooltip placement="bottom">
          <template #title>
            <span>关闭</span>
          </template>
          <i
            class="iconfont icon-shanchu1"
            @click="fenceSlideFn('close')"
          ></i>
        </a-tooltip>

      </div>
    </div>
    <div
      class="fence__content"
      v-if="list.length > 0"
    >
      <div
        class="items"
        v-for="(item, index) in list"
        :key="index"
        :style="{background:index%2==0?'#F8F9FB':''}"
        :class="selectItem&&selectItem == item.pathId?'fence_selected':''"
        @click="selectLine(item)"
      >
        <div class="left">
          {{item.pathName}}
        </div>
        <div
          class="right"
          @click.stop
        >
          <i
            title="绑车"
            @click="bindFence(item)"
            class="iconfont icon-bangding"
          ></i>
          <i
            title="修改"
            @click="changeFence(item)"
            class="iconfont icon-bianji"
          ></i>
          <i
            title="删除"
            @click="deleteFence(item)"
            class="iconfont icon-shanchu1"
          ></i>
        </div>
      </div>
    </div>
    <div
      v-else
      class="emptyBox"
    >
      暂无数据
    </div>
  </div>
  <Eldialog
    width="340px"
    v-model:visible="deleteShow"
  >
    <template v-slot:all>
      <Model
        @confirm="fenceSlideFn('delete')"
        @cancle="deleteShow = false"
      >
        <span>是否删除该围栏？</span>
      </Model>
    </template>
  </Eldialog>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  reactive,
  ref,
  toRefs,
  watch,
  inject,
  defineAsyncComponent,
} from "vue";
import { useFunction } from "../function";
export default defineComponent({
  components: {
    Eldialog: defineAsyncComponent(
      () => import("@/components/Eldialog/index.vue")
    ),
    Model: defineAsyncComponent(
      () => import("../LeftContent/dialog/contents/RemoveAlarm/model.vue")
    ),
  },
  props: {
    fenceData: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    let slideBoxFn = inject("slideBoxFn") as Function;
    const { showMsg, normalShowMsg, delPath } = useFunction();
    const data = reactive({
      list: [],
      selectItem: null,
      deleteShow: false,
      showFence: true,
      deleteFenceData: null,
      changeFenceData: null,
      bindFenceData: null,
      showSearch: false,
      options: [],
      searchValue: [],
      clear() {
        data.showSearch = false;
        data.selectItem = null;
        data.showFence = true;
      },
      selectChange(val: any) {
        data.showSearch = false;
        const res = data.list.filter((item: any) => {
          return item.pathId == val;
        });
        data.selectItem = val;
        slideBoxFn("聚焦到选中围栏", res[0]);
        data.searchValue = [];
        setTimeout(() => {
          const activeDom = document.getElementsByClassName(
            "fence_selected"
          )[0];
          // var target = document.getElementById("target");
          // target.parentNode.scrollTop = target.offsetTop;
          // activeDom && activeDom.scrollIntoView();
          // 用于解决导致整个页面偏移的问题
           activeDom && activeDom.scrollIntoView({ block: 'end' })
        }, 200);
      },
      deleteFence(item: any) {
        data.deleteFenceData = item;
        data.deleteShow = true;
      },
      bindFence(item: any) {
        data.bindFenceData = item;
        data.fenceSlideFn("bind");
      },
      changeFence(item: any) {
        data.changeFenceData = item;
        data.fenceSlideFn("change");
      },
      async fenceSlideFn(type: string) {
        switch (type) {
          case "add":
            slideBoxFn("添加围栏");
            break;
          case "toggle":
            data.showFence = !data.showFence;
            slideBoxFn("围栏显示切换", data.showFence);
            break;
          case "close":
            data.showFence = true;
            slideBoxFn("关闭围栏面板");
            break;
          case "delete":
            const res = await delPath((data.deleteFenceData as any).pathId);
            if (res == 1) {
              slideBoxFn("删除围栏成功");
              data.deleteShow = false;
            }
            break;
          case "change":
            slideBoxFn("修改围栏", data.changeFenceData);
            break;
          case "search":
            data.showSearch = !data.showSearch;
            break;
          case "bind":
            slideBoxFn("围栏绑车", data.bindFenceData);
            break;
          default:
            break;
        }
      },
    });
    function selectLine(val: any) {
      data.selectItem = val.pathId;
      slideBoxFn("聚焦到选中围栏", val);
    }
    function remoteMethod(query: string) {
      if (query !== "") {
        setTimeout(() => {
          data.options = data.list.filter((item: any) => {
            return (
              item.pathName.toLowerCase().indexOf(query.toLowerCase()) > -1
            );
          });
        }, 200);
      } else {
        data.options = [];
      }
    }
    watch(
      () => props.fenceData,
      (val) => {
        data.clear();
        if (!val) {
          data.list = [];
        } else {
          data.list = val as any;
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );
    return {
      selectLine,
      remoteMethod,
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.fence {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    color: #fff;
    width: 100%;
    height: 34px;
    background: #0e60db;
    .left {
      display: flex;
      align-items: center;
      p {
        padding-right: 10px;
      }
    }
    .right {
      display: flex;
      align-items: center;
      i {
        cursor: pointer;
        padding: 0 5px;
        &:hover {
          color: rgb(136, 255, 255);
        }
      }
    }
  }
  &__content {
    width: 100%;
    flex: 1;
    overflow-y: auto;
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
    .items {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      height: 30px;
      cursor: pointer;
      &:hover {
        background: rgb(219, 219, 219) !important;
      }
      .right {
        i {
          color: #999;
          margin-right: 5px;
          &:hover {
            color: rgb(0, 162, 255);
          }
        }
        & > i:nth-child(2) {
          font-size: 13px;
        }
      }
    }
  }
}
.overlayStyle {
  background: red;
}
.fence_selected {
  background: rgb(160, 240, 240) !important;
}
::v-deep(.el-input__inner) {
  border: none !important;
  background: rgba(255, 255, 255, 0.178);
  color: #fff;
  border-radius: 0 !important;
}
.emptyBox {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>