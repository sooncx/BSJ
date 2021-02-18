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

        <div class="filter__btnBox">
          <a-button
            :loading="loading"
            type="primary"
            @click="debounceOnSearch(true)"
            class="filter__searchbtn"
            v-permission="151101"
            >搜索</a-button
          >
          <a-button
            type="primary"
            v-permission="151102"
            @click="debounceOnExpoert"
          >
            <i class="iconfont icon-daochu"></i>
            导出</a-button
          >
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
import { BasicTemplate, SelectDate } from "../../module";
import API from "@/api/dataReport/";
import dayJs from "dayjs";
import APIType from "@/api/dataReport/type";
import { useDebounce } from "@/hooks/core/useDebounce";
import { useMessage } from "@/hooks/web/useMessage";

export default defineComponent({
  name: "maintainReport",
  components: {
    BasicTemplate,
    SelectDate,
    VehGroupSelect: defineAsyncComponent(
      () => import("@/components/VehGroup/src/VehGroupSelect.vue")
    ),
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

    const VehGroup = ref();

    const onSearch = async (tips?: boolean) => {
      if (!VehGroup.value) {
        message.error("请选择车辆车组");
        return;
      }

      const info = {
        id: VehGroup.value.vehicleId || VehGroup.value.groupId,
        type: VehGroup.value.flag,
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
        startTime: rangeDate.value[0],
        endTime: rangeDate.value[1],
      };
      loading.value = true;
      try {
        const { flag, obj, msg } = await API.pageMaintainReport(info);

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
    const tableData = ref(<APIType.pageMaintainReportRes["obj"]["data"]>[]);
    const tableColumns = ref([
      {
        title: "序号",
        align: "center",
        key: "index",
        width: 60,
        slots: { customRender: "index" },
      },
      {
        title: "车牌号",
        align: "center",
        key: "plate",
      },
      {
        title: "客户姓名",
        align: "center",
        key: "owner",
      },
      {
        title: "客户电话",
        align: "center",
        key: "phone",
      },
      {
        title: "当前总里程(km)",
        align: "center",
        key: "currentMileage",
      },
      {
        title: "提前多少公里提醒",
        align: "center",
        key: "advanceKilometers",
      },
      {
        title: "上次保养时间",
        align: "center",
        key: "lastMaintainTime",
      },
      {
        title: "下次保养时间",
        align: "center",
        key: "nextTimeMaintainTime",
      },
      {
        title: "上次保养里程",
        align: "center",
        key: "lastMileage",
      },
      {
        title: "下次保养里程",
        align: "center",
        key: "nextCurrentMileage",
      },
      {
        title: "提前多少天设置",
        align: "center",
        key: "leadTime",
      },
      {
        title: "提示内容",
        align: "center",
        key: "tips",
      },
      {
        title: "备注",
        align: "center",
        key: "remark",
      },
    ]);

    const onExport = () => {
      if (!VehGroup.value) {
        message.error("请选择车辆车组");
        return;
      }

      const info = {
        id: VehGroup.value.vehicleId || VehGroup.value.groupId,
        type: VehGroup.value.flag,
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
        startTime: rangeDate.value[0],
        endTime: rangeDate.value[1],
      };
      API.exportMaintainReport(info);
    };
    const [debounceOnExpoert] = useDebounce(onExport, 200);

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
      debounceOnSearch,
      tableData,
      tableColumns,
      debounceOnExpoert,
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
