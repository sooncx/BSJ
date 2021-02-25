<template>
  <div class="selectDay">
    <template v-if="dateType === 'date' || dateType === 'all'">
      <a-date-picker
        :showTime="defaultStartTime"
        allowClear
        :allowClear="false"
        valueFormat="YYYY-MM-DD HH:mm:ss"
        placeholder="开始时间"
        v-model:value="value[0]"
      >
      </a-date-picker>
      <a-date-picker
        :showTime="defaultEndTime"
        allowClear
        :allowClear="false"
        valueFormat="YYYY-MM-DD HH:mm:ss"
        placeholder="结束时间"
        v-model:value="value[1]"
      >
      </a-date-picker>
    </template>
    <ul class="selectDay__opera" v-if="dateType === 'day' || dateType === 'all' || dateType==='dayCustom'">
      <li
        v-for="(item, index) in datelist"
        :key="index"
        :class="{'active':day === item.interval}"
        @click="onInterVal(item.interval)"
      >
        {{ item.name }}
      </li>
    </ul>
    <a-modal
      title="输入自定义天数"
      v-model:visible="visible"
      @ok="handleOk"
    >
      <a-input v-model:value="customDay" placeholder="请输入天数"></a-input>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType, reactive,toRefs } from "vue";
import moment from "moment";
import { ElMessage } from 'element-plus';
export default defineComponent({
  name: "selectDay",
  props: {
    // 显示类型
    dateType: {
      type: String as PropType<"date" | "day" | "all" | "dayCustom">,
      default: "range",
    },
    // 默认日期
    interval: {
      type: Number as PropType<number>,
      default: 31
    },
    value: {
      type: Array as PropType<any>,
      default: [],
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      visible: false,
      customDay: <number | string>'',
    });
    const datelist = ref([
      { name: "昨天", interval: 1 },
      { name: "近三天", interval: 3 },
      { name: "近七天", interval: 7 },
      { name: "近一月", interval: 31 }
    ]);

    if(props.dateType === 'dayCustom'){
      datelist.value.push({
        name: '自定义',
        interval: 0
      });
    }
    
    // 默认开始时间
    const defaultStartTime = ref({
      defaultValue: moment("00:00:00", "HH:mm:ss")
    });

    // 默认结束时间
    const defaultEndTime = ref({
      defaultValue: moment("23:59:59", "HH:mm:ss")
    });

    const day = ref(props.interval);

    // 选中天数
    const onInterVal = (interval: number) => {
      day.value = interval;
      if(interval === 0){
        data.visible = true;
        return;
      }
      emit("selectDay",interval);
    }
    
    // 自定义天数提交
    const handleOk = () => {
      if(!data.customDay){
        ElMessage.error('请输入天数'); return;
      }
      if(data.customDay > 1491){
        ElMessage.error('输入自定义天数不能大于1491！');return;
      } 
      data.visible = false;
      emit("selectDay",data.customDay);
    }

    return {
      handleOk,
      defaultEndTime,
      defaultStartTime,
      datelist,
      day,
      onInterVal,
      ...toRefs(data)
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
    li {
      cursor: pointer;
      color:#0E60DB;
      margin-right: 8px;
      height:30px;
      line-height: 30px;
    }
    .active{
      border-bottom: 1px solid #0E60DB;
    }
  }
}
</style>