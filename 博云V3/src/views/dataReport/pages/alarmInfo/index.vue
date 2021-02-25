<template>
  <BasicTemplate
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
        <VehGroupSelect v-model:value="VehGroup" v-model:flag="flag" />

        <AlarmModalBtn v-model:value="alarmList" type="ALARM" />

        <div class="filter__btnBox">
          <a-button
            :loading="loading"
            type="primary"
            @click="debounceOnSearch(true)"
            class="filter__searchbtn"
            v-permission="150101"
            >搜索</a-button
          >
          <div>
            <ColumnSelect v-model:value="tableColumns" />
            <a-button
              type="primary"
              @click="debounceOnExpoert"
              v-permission="150102"
            >
              <i class="iconfont icon-daochu"></i>
              导出</a-button
            >
          </div>
        </div>
      </div>
    </template>

    <template #index="{ $index }">
      {{ (current - 1) * pageSize + ($index + 1) }}
    </template>
    <template #operation="{ row }">
      <p><i class="iconfont icon-caozuo" @click="showDetail(row)"></i></p>
    </template>
  </BasicTemplate>

  <!-- 明细 -->
  <Detail v-model:visible="visible" type="alarm" :row="row" />
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  defineAsyncComponent,
  inject,
  Ref,
} from "vue";
import { BasicTemplate, SelectDate, AlarmModalBtn } from "../../module";
import { ElementOf } from "@/utils";
import dayJs from "dayjs";
import API from "@/api/dataReport";
import APIType from "@/api/dataReport/type";
import VehGroupType from "@/components/VehGroup/src/type";
import { useDebounce } from "@/hooks/core/useDebounce";
import { useMessage } from "@/hooks/web/useMessage";
import { useStore } from "vuex";

export default defineComponent({
  name: "offine",
  components: {
    BasicTemplate,
    VehGroupSelect: defineAsyncComponent(
      () => import("@/components/VehGroup/src/VehGroupSelect.vue")
    ),
    SelectDate,
    AlarmModalBtn,
    ColumnSelect: defineAsyncComponent(() => import('../../module/src/ColumnSelect.vue')),
    Detail: defineAsyncComponent(
      () => import("../../module/src/DetailModal.vue")
    ),
  },
  setup() {
    const loading = ref(false);
    const message = useMessage();
    const store = useStore();
    // 筛选内容
    const rangeDate = ref([
      dayJs(new Date().getTime() - 3600 * 1000 * 24 * 2).format(
        "YYYY-MM-DD 00:00:00"
      ),
      dayJs(new Date()).format("YYYY-MM-DD 23:59:59"),
    ]);
    const VehGroup = ref(<VehGroupType | null>null);
    const flag = ref();
    const alarmList = ref([]);

    const onSearch = async (tips?: boolean) => {
      if (!VehGroup.value) {
        message.error("请选择车辆车组");
        return;
      }
      if (alarmList.value.length === 0) {
        message.error("请选择报警类型");
        return;
      }

      const info = {
        chooseId: VehGroup.value.vehicleId || VehGroup.value.groupId,
        groupId: VehGroup.value.groupId,
        flag: VehGroup.value.flag,
        startTime: rangeDate.value[0],
        endTime: rangeDate.value[1],
        longStay: 0,
        alarmTypes: alarmList.value.join(","),
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
      };
      loading.value = true;
      try {
        const { flag, obj, msg } = await API.pageAlarm(info);

        if (flag === 1) {
          tips && message.success(msg);
          tableData.value = obj.data;
          pagination.total = obj.total;
        } else {
          message.error(msg);
        }
        loading.value = false;
      } catch (error) {
        console.log(error);
        loading.value = false;
        message.error(error.msg ? error.msg : error);
      }
    };
    const [debounceOnSearch] = useDebounce(onSearch, 200);

    const tableData = ref(<APIType.pageAlarmRes["obj"]["data"]>[]);
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
        width: 90,
        slots: { customRender: "operation" },
        visible: true
      },
    ]);

    const navModal = <Ref<(val: string) => void>>inject("navModal");
    const onExport = async () => {
      if (!VehGroup.value) {
        message.error("请选择车辆车组");
        return;
      }
      if (!alarmList.value || alarmList.value.length === 0) {
        message.error("请选择报警类型");
        return;
      }
      if (tableData.value.length === 0) {
        message.error("暂无报警数据");
        return;
      }

      const info = {
        chooseId: VehGroup.value.vehicleId || VehGroup.value.groupId,
        groupId: VehGroup.value.groupId,
        flag: VehGroup.value.flag,
        startTime: rangeDate.value[0],
        endTime: rangeDate.value[1],
        longStay: 0,
        alarmTypes: alarmList.value.join(","),
        sessionId: store.state.sessionId,
      };

      const { flag, msg } = await API.exportAlarm(info);

      if (flag === 1) {
        navModal.value("download");
      } else {
        message.error(msg);
      }
    };
    const [debounceOnExpoert] = useDebounce(onExport, 200);

    const detailData = reactive(<
      {
        visible: boolean;
        row: ElementOf<APIType.pageAlarmRes["obj"]["data"]> | null;
      }
    >{
      visible: false,
      row: null,
    });
    const showDetail = async (
      row: ElementOf<APIType.pageAlarmRes["obj"]["data"]>
    ) => {
      detailData.visible = true;
      detailData.row = row;
    };

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
      flag,
      alarmList,
      debounceOnSearch,
      tableData,
      tableColumns,
      debounceOnExpoert,
      ...toRefs(detailData),
      showDetail,
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
