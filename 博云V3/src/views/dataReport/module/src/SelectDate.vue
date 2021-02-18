<template>
  <div class="selectDay">
    <template v-if="dateType === 'range'">
      <a-range-picker
        :allowClear="false"
        valueFormat="YYYY-MM-DD HH:mm:ss"
        :placeholder="['开始时间', '结束时间']"
        v-model:value="value"
        :defaultPickerValue="value"
      />
    </template>
    <template v-else>
      <a-date-picker
        showTime
        :allowClear="false"
        valueFormat="YYYY-MM-DD HH:mm:ss"
        placeholder="开始时间"
        :disabled-date="disabledDate"
        v-model:value="value[0]"
      >
      </a-date-picker>
      <a-date-picker
        showTime
        :allowClear="false"
        valueFormat="YYYY-MM-DD HH:mm:ss"
        placeholder="结束时间"
        v-model:value="value[1]"
        :disabled-date="disabledDate"
      >
      </a-date-picker>
    </template>
    <ul class="selectDay__opera">
      <li
        v-for="(item, index) in datelist"
        :key="index"
        @click="onClick(item.interval)"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType } from "vue";
import dayJs from "dayjs";

export default defineComponent({
  name: "selectDay",
  props: {
    dateType: {
      type: String as PropType<"range" | "date">,
      default: "range",
    },
    value: {
      type: Array as PropType<any>,
      default: [],
    },
  },
  setup(props, { emit }) {
    const datelist = ref([
      {
        name: "昨天",
        interval: 1,
      },
      {
        name: "近三天",
        interval: 2,
      },
      {
        name: "近七天",
        interval: 6,
      },
      {
        name: "近一月",
        interval: 29,
      },
    ]);

    const onClick = (interval: number) => {
      emit("update:value", [
        dayJs(new Date().getTime() - 3600 * 1000 * 24 * interval).format(
          "YYYY-MM-DD 00:00:00"
        ),
        dayJs(new Date().getTime()).format("YYYY-MM-DD 23:59:59"),
      ]);
      emit("complete")
    };

    const disabledDate = (current: any) => {
      return current.valueOf() > Date.now();
    };

    return {
      datelist,
      onClick,
      disabledDate,
    };
  },
});
</script>
<style lang="less" scoped>
.selectDay {
  display: flex;
  align-items: center;

  .ant-calendar-picker {
    margin-right: 16px;
    width: 200px;
  }

  &__opera {
    display: flex;
    justify-content: space-between;
    width: 200px;

    li {
      cursor: pointer;
      font-size: 12px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      color: #0e60db;
    }
  }
}
</style>