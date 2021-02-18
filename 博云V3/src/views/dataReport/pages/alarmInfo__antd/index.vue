<template>
  <div class="alarmInfo">
    <div class="alarmInfo__filter">
      <div class="alarmInfo__filter__date">
        <span class="alarmInfo__filter__title">选择时间</span>
        <SelectDate v-model:value="rangeDate" dateType="date" />
      </div>
      <div class="alarmInfo__filter__vehgroup">
        <span class="alarmInfo__filter__title">车辆车组</span>
        <VehGroupSelect v-model:value="VehGroup" />

        <AlarmModalBtn v-model:value="alarmList" type="ALARM" />

        <div class="alarmInfo__filter__btnBox">
          <a-button
            type="primary"
            @click="onSearch"
            class="alarmInfo__filter__searchbtn"
            >搜索</a-button
          >
          <a-button type="primary">
            <i class="iconfont icon-daochu"></i>
            导出</a-button
          >
        </div>
      </div>
    </div>
    <!-- 表格数据 -->
    <div class="alarmInfo__table" ref="tableBox">
      <a-table
        v-if="offsetHeight"
        :columns="tableColumns"
        :data-source="tableData"
        :scroll="{ y: offsetHeight }"
        :rowKey="(row) => row.index"
        :bordered="true"
        :pagination="false"
        size="small"
      >
        <template #operation>
          <a-button type="link">
            <i class="iconfont icon-caozuo"></i>
          </a-button>
        </template>
      </a-table>
    </div>
    <!-- 分页 -->
    <div class="alarmInfo__pager">
      <a-pagination
        show-size-changer
        :page-size-options="['50', '100', '200', '500']"
        :total="total"
        :show-total="(total) => `共: ${total} 条`"
        size="small"
        v-model:pageSize="pageSize"
        v-model:current="current"
        @change="currentChange"
        @showSizeChange="pageSizeChange"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRefs, watch, nextTick } from "vue";
import { SelectDate, AlarmModalBtn } from "../../module/index";
import { VehGroupSelect } from "@/components/VehGroup/index";
import dayJs from "dayjs";

export default defineComponent({
  name: "alarmInfo",
  components: {
    SelectDate,
    VehGroupSelect,
    AlarmModalBtn,
  },
  setup() {
    const rangeDate = ref([
      dayJs(new Date().getTime() - 3600 * 1000 * 24 * 2).format(
        "YYYY-MM-DD 00:00:00"
      ),
      dayJs(new Date()).format("YYYY-MM-DD 23:59:59"),
    ]);

    const VehGroup = ref();
    const alarmList = ref();

    const onSearch = () => {
      console.log(rangeDate);
      console.log(VehGroup);
      console.log(alarmList);

      console.log(tableBox);
    };

    const tableBox = ref();
    const offsetHeight = ref();
    const tableData = ref([
      {
        index: 1,
        plate: "111",
        terminalNo: "1111",
        groupName: "111111",
        type: "1111111",
        startTime: "11111111",
        endTime: "111111111",
        num: "1111111111",
      },
      {
        index: 2,
        plate: "222",
        terminalNo: "2222",
        groupName: "22222",
        type: "222222",
        startTime: "2222222",
        endTime: "22222222",
        num: "222222222",
      },
    ]);
    const tableColumns = ref([
      {
        title: "序号",
        dataIndex: "index",
        align: "center",
        key: "index",
      },
      {
        title: "车牌号",
        dataIndex: "plate",
        align: "center",
      },
      {
        title: "设备号",
        dataIndex: "terminalNo",
        align: "center",
      },
      {
        title: "所属车组",
        dataIndex: "groupName",
        align: "center",
      },
      {
        title: "报警类型",
        dataIndex: "type",
        align: "center",
      },
      {
        title: "开始时间",
        dataIndex: "startTime",
        align: "center",
      },
      {
        title: "结束时间",
        dataIndex: "endTime",
        align: "center",
      },
      {
        title: "报警次数",
        dataIndex: "num",
        align: "center",
      },
      {
        title: "报警明细",
        dataIndex: "operation",
        align: "center",
        slots: { customRender: "operation" },
      },
    ]);

    nextTick(() => {
      offsetHeight.value = tableBox.value.offsetHeight;
    });

    const pagination = reactive({
      current: 0,
      pageSize: 50,
      total: 1500,
    });

    const currentChange = (page: number, pageSize: number) => {
      console.log(page, pageSize);
    };

    const pageSizeChange = (current: number, size: number) => {
      console.log(current, size);
    };

    return {
      rangeDate,
      VehGroup,
      alarmList,
      onSearch,
      tableBox,
      offsetHeight,
      tableData,
      tableColumns,
      ...toRefs(pagination),
      currentChange,
      pageSizeChange,
    };
  },
});
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
