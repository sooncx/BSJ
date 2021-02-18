<template>
  <ul class="riskTab">
    <li
      v-for="(item, index) in list"
      :key="index"
      :class="{ active: active === index + 1 }"
      @click="changeTab(item.value)"
    >
      {{ item.title }}
      <el-popover
        placement="right-start"
        popper-class="poperSize-mini"
        width="290"
        trigger="hover"
      >
        <template #reference>
          <i class="iconfont icon-yiwen"></i>
        </template>
        <div class="riskTab__popover">
          <p>
            <i>{{ item.title }}：</i>
          </p>
          <p
            class="riskTab__popover__desc"
            v-for="(text, i) in item.desc"
            :key="`desc_${i}`"
          >
            {{ text }}
          </p>
          <p class="riskTab__popover__desc">
            满足以上任一情况，都会存在{{ item.title }}风险。
          </p>
        </div>
      </el-popover>
    </li>
  </ul>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup(props, { emit }) {
    const list = ref([
      {
        title: "设备拆除风险",
        value: 1,
        desc: [
          "拆除 + 二押点报警",
          "掉电 + 二押点报警",
          "离线1天以上 + 二押点报警",
          "进围栏 + 拆除",
        ],
      },
      {
        title: "生活轨迹异常",
        value: 2,
        desc: [
          "异常停留 + 离线1天以上",
          "异常停留 + 静止3天以上",
          "进围栏 + 离线1天以上",
          "进围栏 + 静止3天以上",
        ],
      },
      {
        title: "安全区外异常",
        value: 3,
        desc: [
          "出省市区 + 离线1天以上",
          "出省市区 + 静止3天以上",
          "出省市区 + 二押点报警",
          "出省市区 + 掉电",
          "出省市区 + 拆除",
        ],
      },
    ]);

    const active = ref(1);
    const changeTab = (value: number) => {
      active.value = value;
      emit("update:active", value);
      emit("changeTab");
    };

    return {
      list,
      active,
      changeTab,
    };
  },
});
</script>
<style lang="less" scoped>
.riskTab {
  display: flex;
  li {
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: center;
    color: #bcbcbf;
    width: 140px;
    cursor: pointer;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    .iconfont {
      margin-left: 5px;
    }
    &.active {
      background: #3381e8;
      color: #fff;
    }
    &:nth-child(1) {
      border-top-left-radius: 0;
    }
  }

  &__popover {
    i {
      font-weight: bold;
      font-size: 14px;
    }
    &__desc {
      text-indent: 20px;
      margin-top: 5px;
      font-size: 12px;
      line-height: 20px;
    }
  }
}
</style>
