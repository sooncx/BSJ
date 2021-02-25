<template>
  <basic-template
    :tableColumns="tableColumns"
    :tableData="tableData"
    :total="total"
    :loading="loading"
    @size-change="pageSizeChange"
    @current-change="currentChange"
  >
    <template #filter>
      <div class="filter__date">
        <span class="filter__title">选择时间</span>
        <SelectDate
          v-model:value="rangeDate"
          dateType="date"
          @complete="debounceOnSearch(true)"
        />
      </div>
      <div class="filter__vehgroup">
        <span class="filter__title">车辆车组</span>
        <VehGroupSelect v-model:value="VehGroup" />

        <AlarmModalBtn v-model:value="alarmList" type="OBD" />

        <div class="filter__btnBox">
          <a-button
            :loading="loading"
            type="primary"
            @click="debounceOnSearch(true)"
            class="filter__searchbtn"
            v-permission="151301"
            >搜索</a-button
          >

          <ColumnSelect v-model:value="tableColumns" />
        </div>
      </div>
    </template>

    <template #index="{ $index }">
      {{ (current - 1) * pageSize + ($index + 1) }}
    </template>
    <template #operation="data">
      <p :title="data"><i class="iconfont icon-caozuo"></i></p>
    </template>
  </basic-template>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs, defineAsyncComponent } from "vue";
import { BasicTemplate, SelectDate, AlarmModalBtn } from "../../module";
import API from "@/api/dataReport/";
import dayJs from "dayjs";
import APIType from "@/api/dataReport/type";
import VehGroupType from "@/components/VehGroup/src/type";
import { useDebounce } from "@/hooks/core/useDebounce";
import { useMessage } from "@/hooks/web/useMessage";

export default defineComponent({
  name: "obdReport",
  components: {
    BasicTemplate,
    SelectDate,
    ColumnSelect: defineAsyncComponent(() => import('../../module/src/ColumnSelect.vue')),
    VehGroupSelect: defineAsyncComponent(
      () => import("@/components/VehGroup/src/VehGroupSelect.vue")
    ),
    AlarmModalBtn,
  },
  setup() {
    const loading = ref(false);
    const message = useMessage();
    const rangeDate = ref([
      dayJs(new Date().getTime() - 3600 * 1000 * 24 * 2).format(
        "YYYY-MM-DD 00:00:00"
      ),
      dayJs(new Date()).format("YYYY-MM-DD 23:59:59"),
    ]);

    const VehGroup = ref(<VehGroupType | null>null);
    const alarmList = ref();

    const onSearch = async (tips?: boolean) => {
      if (!VehGroup.value) {
        message.error("请选择车辆");
        return;
      }
      if (!alarmList.value) {
        message.error("请选择报警类型");
        return;
      }

      const info = {
        vehicleId: VehGroup.value.vehicleId || VehGroup.value.groupId,
        groupId: VehGroup.value.groupId,
        alarmTypes: alarmList.value.join(","),
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
        startTime: rangeDate.value[0],
        endTime: rangeDate.value[1],
      };
      loading.value = true;
      try {
        const { flag, obj, msg } = await API.pageOBDAlarmList(info);

        if (flag === 1) {
          tips && message.success(msg);
          tableData.value = obj.data;
          pagination.total = obj.total;
        } else {
          message.error(msg);
        }
        loading.value = false;
      } catch (error) {
        loading.value = false;
        message.error(error.msg ? error.msg : error);
      }
    };
    const [debounceOnSearch] = useDebounce(onSearch, 200);

    const offsetHeight = ref();
    const tableData = ref(<APIType.pageOBDAlarmListRes["obj"]["data"]>[]);
    const tableColumns = ref([
      {
        title: "序号",
        align: "center",
        key: "index",
        width: 60,
        slots: { customRender: "index" },
        visible: true
      },
      {
        title: "车牌号",
        align: "center",
        key: "plate",
        visible: true
      },
      {
        title: "设备号",
        align: "center",
        key: "terminalNo",
        visible: true
      },
      {
        title: "所属车组",
        align: "center",
        key: "groupName",
        visible: true
      },
      {
        title: "报警类型",
        align: "center",
        key: "type",
        visible: true
      },
      {
        title: "开始时间",
        align: "center",
        key: "startTime",
        visible: true
      },
      {
        title: "结束时间",
        align: "center",
        key: "endTime",
        visible: true
      },
      {
        title: "报警次数",
        align: "center",
        key: "num",
        visible: true
      },
      {
        title: "报警明细",
        align: "center",
        key: "operation",
        slots: { customRender: "operation" },
        visible: true
      },
    ]);

    const pagination = reactive({
      total: 0,
      current: 1,
      pageSize: 100,
    });

    const currentChange = (val: number) => {
      pagination.current = val;
      debounceOnSearch();
      console.log("current", val);
    };

    const pageSizeChange = (val: number) => {
      pagination.pageSize = val;
      debounceOnSearch();
      console.log("pageSize", val);
    };

    return {
      loading,
      rangeDate,
      VehGroup,
      alarmList,
      debounceOnSearch,
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
@import "../../module/css/index.less";
</style>
