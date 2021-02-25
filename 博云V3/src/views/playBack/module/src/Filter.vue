<template>
  <div class="filter">
    <div class="filter__form">
      <a-form
        :modal="form"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 17 }"
      >
        <a-form-item label="选择车辆" style="margin: 0">
          <VehGroupSelect
            @click="expand && toggleBox()"
            v-model:value="form.vehgroup"
            :isDbclick="false"
          />
        </a-form-item>

        <div
          :style="{
            height: expand ? '0px' : '276px',
            paddingTop: expand ? '0px' : '10px',
            opacity: expand ? 0 : 1,
          }"
          class="filter__expandBox"
        >
          <a-form-item label="选择时间">
            <div class="filter__btngroup">
              <a-button @click="changeDay(0)">今天</a-button>
              <a-button @click="changeDay(1)">昨天</a-button>
              <a-button @click="changeDay(2)">前天</a-button>
            </div>
          </a-form-item>

          <a-form-item label="开始时间">
            <a-date-picker
              showTime
              :allowClear="false"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              v-model:value="form.startTime"
              style="width: 200px"
            ></a-date-picker>
          </a-form-item>

          <a-form-item label="结束时间">
            <a-date-picker
              showTime
              :allowClear="false"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              v-model:value="form.endTime"
              style="width: 200px"
            ></a-date-picker>
          </a-form-item>

          <a-form-item label="静止时间">
            <a-input
              addon-before=">="
              addon-after="分钟"
              v-model:value="form.restTime"
              style="width: 200px"
            />
          </a-form-item>

          <a-button
            type="primary"
            style="width: 100%"
            @click="submit"
            :loading="loading"
            >查询</a-button
          >

          <div class="filter__desc">
            <fn-introduction>
              <div>功能介绍</div>
            </fn-introduction>
            <p class="filter__switchMap" @click="switchMap">
              {{ mapType === "Bmap" ? "切换高德地图" : "切换百度地图" }}
              <i class="iconfont icon-right"></i>
            </p>
          </div>
        </div>
      </a-form>
    </div>

    <div
      class="filter__sliderBox"
      :style="{
        opacity: sliderShow ? 1 : 0,
        marginTop: sliderShow ? '0px' : '-56px',
      }"
    >
      <div class="filter__sliderBox__begin">
        <i
          class="iconfont"
          :class="playFlag ? 'icon-zanting' : 'icon-bofang1'"
          @click="play"
        ></i>
      </div>
      <div class="filter__sliderBox__slider">
        <Slider v-model:value="sliderVal" @change="sliderChange" />
      </div>
      <div class="filter__sliderBox__dropdown">
        <a-dropdown>
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item :key="2.5">慢</a-menu-item>
              <a-menu-item :key="5">中</a-menu-item>
              <a-menu-item :key="7.5">快</a-menu-item>
              <a-menu-item :key="15">飚</a-menu-item>
            </a-menu>
          </template>
          <a-button style="margin-left: 8px" size="small">
            速度:
            <span style="color: #0e60db">
              {{
                speed === 2.5
                  ? "慢"
                  : speed === 5
                  ? "中"
                  : speed === 7.5
                  ? "快"
                  : speed === 15
                  ? "飚"
                  : ""
              }}
            </span>
            <i class="iconfont icon-lower"></i>
          </a-button>
        </a-dropdown>
      </div>
    </div>

    <div class="filter__togglebtn" @click="toggleBox" v-show="!expand">
      <i class="iconfont icon-right"></i>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  PropType,
  inject,
  watch,
  nextTick,
  Ref,
} from "vue";
import { VehGroupSelect } from "@/components/VehGroup";
import { ElMessage } from "element-plus";
import { Slider } from "ant-design-vue";
import { useGo } from "@/hooks/web/usePage";
import { useStore } from "vuex";
import { filterType } from "../type";
import router from "@/router";
import FnIntroduction from "@/components/FnIntroduction/index.vue";
import dayJs from "dayjs";

export default defineComponent({
  name: "playbackfilter",
  components: {
    VehGroupSelect,
    Slider,
    FnIntroduction,
  },
  props: {
    mapType: {
      type: String as PropType<string>,
      default: "Bmap",
    },
    speed: {
      type: Number as PropType<number>,
      default: 5,
    },
    loading: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { state, commit } = useStore();
    const mapControl = <any>inject("mapControl");
    const playbackTotal = <Ref<number>>inject("playbackTotal");
    const updatefliter = <(val: any) => void>inject("UPDATE_FILTER");

    const form = ref(<filterType>{
      vehgroup: null,
      startTime: dayJs(new Date().getTime()).format("YYYY-MM-DD 00:00:00"),
      endTime: dayJs(new Date().getTime()).format("YYYY-MM-DD 23:59:59"),
      restTime: 0,
    });

    const go = useGo();
    const routerQuery = router.currentRoute.value.query;
    const switchMap = () => {
      emit("update:mapType", props.mapType === "Bmap" ? "Amap" : "Bmap");
      go({
        path: "playBack",
        query: {
          ...routerQuery,
          mapType: props.mapType === "Bmap" ? "amap" : "bmap",
        },
      });
      sliderShow.value = false;
    };

    const expand = ref(false);
    const toggleBox = () => {
      expand.value = !expand.value;
    };

    const sliderVal = ref(0);
    watch(
      () => state.playIndex,
      (val: number) => {
        sliderVal.value = Math.ceil(val / (playbackTotal.value / 100));
        if (val === playbackTotal.value) {
          playFlag.value = false;
          tableExpand.value(false);
        }
      }
    );

    nextTick(() => {
      if (routerQuery.vehicleId && routerQuery.plate) {
        form.value.vehgroup = {
          groupId: (routerQuery.vehicleId as unknown) as number,
          vehicleId: (routerQuery.vehicleId as unknown) as number,
          plate: routerQuery.plate as string,
          flag: 1,
          type: 1,
        };
      }
      if (routerQuery.time) {
        form.value.startTime = dayJs(routerQuery.time as string).format(
          "YYYY-MM-DD 00:00:00"
        );
        form.value.endTime = dayJs(routerQuery.time as string).format(
          "YYYY-MM-DD 23:59:59"
        );
      }
    });

    // 改变时间
    const changeDay = (type: number) => {
      const duriation = 3600 * 1000 * 24 * type;
      form.value.startTime = dayJs(new Date().getTime() - duriation).format(
        "YYYY-MM-DD 00:00:00"
      );
      form.value.endTime = dayJs(new Date().getTime()).format(
        "YYYY-MM-DD 23:59:59"
      );
    };

    // 地图改变删除进度条进度
    watch(
      () => props.mapType,
      () => {
        playFlag.value = false;
        playbackTotal.value = 0;
        sliderVal.value = 0;
        commit("COMMIT_PLAYINDEX", 0);
        tableExpand.value(false);
      }
    );

    // 进度条改变
    const sliderChange = (val: number) => {
      if (playbackTotal.value === 0 && !playFlag.value) return;
      commit(
        "COMMIT_PLAYINDEX",
        Math.floor(val * ((playbackTotal.value - 1) / 100))
      );
      mapControl.value.drawCar();
      mapControl.value.drawPassLine();
    };

    // 速度切换
    const handleMenuClick = (e: any) => {
      emit("update:speed", e.key);
    };

    const tableExpand = <any>inject("tableExpand");
    const playFlag = ref(false);
    const play = () => {
      if (state.playIndex === playbackTotal.value) {
        state.playIndex = 0;
      };
      playFlag.value = !playFlag.value;
      if (playFlag.value) {
        mapControl.value.play();
        tableExpand.value(true);
      } else {
        mapControl.value.pause();
        tableExpand.value(false);
      }
    };

    const sliderShow = ref(false);
    const submit = () => {
      if (!form.value.vehgroup) {
        ElMessage.error("请选择车辆");
        return;
      }
      sliderVal.value = 0;
      playFlag.value = false;
      playbackTotal.value = 0;
      commit("COMMIT_PLAYINDEX", 0);
      mapControl.value.clearAll();
      mapControl.value.pause();
      const value = JSON.parse(JSON.stringify(form.value));
      updatefliter(value);
      emit("update:loading", false);
      sliderShow.value = true;
    };

    return {
      form,
      switchMap,
      expand,
      toggleBox,
      handleMenuClick,
      submit,
      sliderShow,
      playFlag,
      play,
      sliderVal,
      sliderChange,
      changeDay,
    };
  },
});
</script>
<style lang="less" scoped>
.filter {
  z-index: 999;
  position: absolute;
  left: 10px;
  top: 10px;
  width: 350px;
  background-color: #fff;
  box-shadow: -3px 4px 9px #dedede;

  &__form {
    padding: 10px;
    position: relative;
    z-index: 2;
  }

  &__expandBox {
    overflow: hidden;
    transition: all 0.5s ease;
    height: 276px;
    padding-top: 10px;
  }

  &__btngroup {
    width: 200px;
    display: flex;
    justify-content: space-between;
  }

  &__desc {
    width: 100%;
    color: #0e60db;
    background: #fff;
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    font-size: 14px;
    font-family: PingFang-SC-Medium;
  }

  &__switchMap {
    cursor: pointer;
  }

  &__togglebtn {
    position: absolute;
    bottom: -28px;
    left: 50%;
    color: #999;
    background: #fff;
    height: 50px;
    width: 40px;
    margin-left: -25px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
    transform: rotate(-90deg);
    overflow: hidden;
    .iconfont {
      font-size: 20px;
    }
  }

  &__sliderBox {
    box-shadow: none;
    border-top: 1px solid #dedede;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 5px 0 10px;
    margin-top: -56px;
    transition: all 0.3s;
    &__begin {
      width: 24px;
      margin: 3px 10px 0;
      color: #0e60db;
      cursor: pointer;
    }
    &__slider {
      flex: 1;
    }
    &__dropdown {
      width: 90px;
      margin-right: 6px;
    }
  }
}
.ant-form-item {
  margin-bottom: 10px;
}
</style>
