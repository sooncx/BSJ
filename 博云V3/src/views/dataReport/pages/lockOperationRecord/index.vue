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
        <span class="filter__title">选择车辆</span>
        <VehGroupSelect v-model:value="VehGroup" :isDbclick="false" />

        <span class="filter__title" style="margin-left: 16px">查询类型</span>
        <a-select v-model:value="lockType" style="width: 130px">
          <a-select-option :value="0">全部</a-select-option>
          <a-select-option :value="1">查询蓝牙解锁</a-select-option>
          <a-select-option :value="2">查询平台解锁</a-select-option>
          <a-select-option :value="3">查询密码解锁</a-select-option>
        </a-select>

        <span class="filter__title" style="margin-left: 16px">查询状态</span>
        <a-select v-model:value="lockState" style="width: 160px">
          <a-select-option :value="0">全部</a-select-option>
          <a-select-option :value="1">开锁</a-select-option>
          <a-select-option :value="2">关锁</a-select-option>
          <a-select-option :value="3">蓝牙非法区域请求</a-select-option>
        </a-select>

        <div class="filter__btnBox">
          <a-button
            :loading="loading"
            type="primary"
            @click="debounceOnSearch(true)"
            class="filter__searchbtn"
            v-permission="151501"
            >搜索</a-button
          >
          <a-button
            type="primary"
            @click="debounceOnExpoert"
            v-permission="151502"
          >
            <i class="iconfont icon-daochu"></i>
            导出</a-button
          >
        </div>
      </div>
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
import VehGroupType from "@/components/VehGroup/src/type";
import { useDebounce } from "@/hooks/core/useDebounce";
import { useMessage } from "@/hooks/web/useMessage";

export default defineComponent({
  name: "lockOperationRecord",
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

    const VehGroup = ref(<VehGroupType | null>null);

    const lockType = ref(0);
    const lockState = ref(0);

    const onSearch = async (tips?: boolean) => {
      if (!VehGroup.value) {
        message.error("请选择车辆");
        return;
      }

      const info = {
        vehicleId: VehGroup.value.vehicleId || VehGroup.value.groupId,
        beginTime: rangeDate.value[0],
        endTime: rangeDate.value[1],
        queryType: lockType.value,
        type: lockState.value,
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
      };

      loading.value = true;
      try {
        const { flag, obj, msg } = await API.pageUnlockHistory(info);

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

    const tableData = ref(<APIType.pageUnlockHistoryRes["obj"]["data"]>[]);
    const tableColumns = ref([
      {
        title: "操作人",
        align: "center",
        key: "operater",
      },
      {
        title: "平台类型",
        align: "center",
        key: "platformType",
      },
      {
        title: "操作类型",
        align: "center",
        key: "operateType",
      },
      {
        title: "执行结果",
        align: "center",
        key: "type",
      },
      {
        title: "位置",
        align: "center",
        key: "address",
      },
      {
        title: "时间",
        align: "center",
        key: "operateTime",
      },
    ]);

    const onExport = () => {
      if (!VehGroup.value) {
        message.error("请选择车辆");
        return;
      }

      const info = {
        vehicleId: VehGroup.value.vehicleId || VehGroup.value.groupId,
        beginTime: rangeDate.value[0],
        endTime: rangeDate.value[1],
        queryType: lockType.value,
        type: lockState.value,
      };

      API.exporUnlockHistory(info);
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
      lockType,
      lockState,
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
