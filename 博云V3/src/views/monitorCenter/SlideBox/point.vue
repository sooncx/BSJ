<template>
  <div class="point">
    <div class="point__header">
      <div class="left">
        <p>二押点</p>
        <i
          class="iconfont icon-yiwen"
          @mouseenter="tipShow = true"
          @mouseleave="tipShow = false"
        ></i>
        <!-- <a-tooltip placement="bottom">
          <template #title>
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
            @click="TwoChargeFn('add')"
          ></i>
        </a-tooltip>
        <a-tooltip placement="bottom">
          <template #title>
            <span>绑定</span>
          </template>
          <i
            class="iconfont icon-bangding"
            @click="TwoChargeFn('bind')"
          ></i>
        </a-tooltip>
        <a-tooltip placement="bottom">
          <template #title>
            <span>云端二押点</span>
          </template>
          <i
            class="iconfont icon-xiazai"
            @click="TwoChargeFn('cloud')"
          ></i>
        </a-tooltip>
        <a-tooltip placement="bottom">
          <template #title>
            <span>关闭</span>
          </template>
          <i
            class="iconfont icon-shanchu1"
            @click="TwoChargeFn('close')"
          ></i>
        </a-tooltip>
      </div>
    </div>
    <div
      class="point__content"
      v-if="list.length > 0"
    >
      <div
        class="items"
        v-for="(item, index) in list"
        :key="index"
        :style="{background:selectItem && selectItem == item.chargeId?'rgb(160, 240, 240) !important':index%2==0?'#F8F9FB':''}"
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
            @click="deleteTwoCharge(item)"
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
    <div
      class="tipBox"
      v-if="tipShow"
    >
      <div
        class="item"
        v-for="item in tipTxt"
        :key="item"
      >
        <div class="tipTitle">{{item.title}}</div>
        <div class="tipDetail">{{item.detail}}</div>
      </div>
    </div>
  </div>
  <Eldialog
    width="340px"
    v-model:visible="deleteShow"
  >
    <template v-slot:all>
      <Model
        @confirm="TwoChargeFn('delete')"
        @cancle="deleteShow = false"
      >
        <span>是否删除该二押点？</span>
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
  defineAsyncComponent,
  inject,
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
    pointData: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    let slideBoxFn = inject("slideBoxFn") as Function;
    const { deleteTwoCharge } = useFunction();
    const data = reactive({
      list: [],
      selectItem: null,
      deleteShow: false,
      deletePointData: null as any,
      selectPointData: null as any,
      tipShow: false,
      tipTxt: [
        {
          title: "功能简介",
          detail: "防止车辆在二手车低压点停留，增加风险预防。",
        },
        {
          title: "自定义二押点",
          detail: "用户可以在地图上自定义二押点。",
        },
        {
          title: "绑车",
          detail: "用户绑定车辆将作用于（自定义二押点+云端二押点）",
        },
        {
          title: "云端二押点",
          detail:
            "由云平台提供的二押点，用户默认拥有，云平台会定时更新云端二押点。",
        },
        {
          title: "报警",
          detail:
            "当绑定的车辆在您设置的二押点（您设置的半径）范围，或者经过云端二押点（半径50米）范围，并且满足停留时间60分钟，系统会自动报警。",
        },
      ],
      clear() {
        data.deleteShow = false;
        data.selectItem = null;
      },
      deleteTwoCharge(item: any) {
        data.deletePointData = item;
        data.deleteShow = true;
      },
      async TwoChargeFn(type: string) {
        switch (type) {
          case "add":
            slideBoxFn("添加二押点");
            break;
          case "bind":
            slideBoxFn("二押点绑车");
            break;
          case "cloud":
            slideBoxFn("云端二押点");
            break;
          case "close":
            slideBoxFn("关闭二押点面板");
            break;
          case "delete":
            const res = await deleteTwoCharge(data.deletePointData.chargeId);
            if (res == 1) {
              slideBoxFn("删除二押点成功", data.selectPointData);
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
          name: "二押点" + i,
          value: i,
        });
      }
    }
    function selectLine(val: any) {
      data.selectItem = val.chargeId;
      data.selectPointData = val;
      slideBoxFn("聚焦到选中二押点", val);
    }
    watch(
      () => props.pointData,
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
.point {
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
      i {
        cursor: help;
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
.tipBox {
  position: fixed;
  right: 260px;
  top: 110px;
  width: 300px;
  background: #fff;
  padding: 5px 15px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.226);
  .item {
    text-align: left;
    padding: 10px 0;
    .tipTitle {
      padding-bottom: 10px;
      font-weight: bold;
      color: #333;
    }
    .tipDetail {
      text-indent: 25px;
      line-height: 20px;
      color: #666;
    }
  }
}
</style>