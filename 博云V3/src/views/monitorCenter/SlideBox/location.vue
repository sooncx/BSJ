<template>
  <div class="location">
    <div class="location__header">
      <div class="left">
        <p>位置点</p>
        <!-- <a-tooltip placement="bottom">
          <template #title>
            <span>所谓位置点，就是...</span>
          </template>
          <i class="iconfont icon-yiwen"></i>
        </a-tooltip> -->
      </div>
      <div class="right">
        <a-tooltip placement="bottom">
          <template #title>
            <span>增加</span>
          </template>
          <i
            class="iconfont icon-zengjia"
            @click="locationFn('add')"
          ></i>
        </a-tooltip>
        <a-tooltip placement="bottom">
          <template #title>
            <span>{{showPoint?"隐藏":"显示"}}</span>
          </template>
          <i
            class="iconfont"
            :class="showPoint?'icon-xianshi':'icon-buxianshi'"
            @click="locationFn('toggle')"
          ></i>
        </a-tooltip>
        <a-tooltip placement="bottom">
          <template #title>
            <span>关闭</span>
          </template>
          <i
            class="iconfont icon-shanchu1"
            @click="locationFn('close')"
          ></i>
        </a-tooltip>

      </div>
    </div>
    <div
      class="location__content"
      v-if="list.length > 0"
    >
      <div
        class="items"
        v-for="(item, index) in list"
        :key="index"
        :style="{background:selectItem && selectItem == item.id?'rgb(160, 240, 240) !important':index%2==0?'#F8F9FB':''}"
        @click="selectLine(item)"
      >
        <div class="left">
          {{item.name}}
        </div>
        <div
          class="right"
          @click.stop
        >
          <i
            class="iconfont icon-shanchu1"
            @click="deletePoint(item)"
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
        @confirm="locationFn('delete')"
        @cancle="deleteShow = false"
      >
        <span>是否删除该位置点？</span>
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
    locationData: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    let slideBoxFn = inject("slideBoxFn") as Function;
    const { showMsg, normalShowMsg, DeletePoint } = useFunction();
    const data = reactive({
      list: [],
      deleteShow: false,
      selectItem: null,
      showPoint: true,
      deletePointData: null as any,
      clear() {
        data.deleteShow = false;
        data.selectItem = null;
        data.showPoint = true;
      },
      deletePoint(item: any) {
        data.deletePointData = item;
        data.deleteShow = true;
      },
      async locationFn(type: string) {
        switch (type) {
          case "add":
            slideBoxFn("添加位置点", data.showPoint);
            break;
          case "toggle":
            data.showPoint = !data.showPoint;
            slideBoxFn("位置点显示切换", data.showPoint);
            break;
          case "close":
            data.showPoint = true;
            slideBoxFn("关闭位置点面板");
            break;
          case "delete":
            const res = await DeletePoint({
              id: data.deletePointData.id,
              type: data.deletePointData.type,
            });
            if (res == 1) {
              slideBoxFn("删除位置点成功");
              data.deleteShow = false;
            }
            break;
          default:
            break;
        }
      },
    });
    function mockData(num: any) {
      for (let i = 0; i < num; i++) {
        (data.list as any).push({
          name: "位置点" + i,
          value: i,
        });
      }
    }
    function selectLine(val: any) {
      data.selectItem = val.id;
      slideBoxFn("聚焦到选中位置点", val);
    }
    watch(
      () => props.locationData,
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
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.location {
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
      cursor: locationer;
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
      }
    }
  }
}
.overlayStyle {
  background: red;
}
.emptyBox {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>