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
        <span class="filter__title">操作类型</span>
        <div style="margin-right: 16px">
          <a-select v-model:value="operaType">
            <a-select-option :value="0">用户操作记录</a-select-option>
            <a-select-option :value="1">车辆操作记录</a-select-option>
          </a-select>
        </div>

        <template v-if="operaType === 0">
          <span class="filter__title">选择用户</span>
          <UserSearchAntd v-model:value="userInfo" :type="1" />
        </template>
        <template v-else>
          <span class="filter__title">车辆车组</span>
          <VehGroupSelect v-model:value="VehGroup" />
        </template>

        <div class="filter__btnBox">
          <a-button
            :loading="loading"
            type="primary"
            @click="debounceOnSearch(true)"
            class="filter__searchbtn"
            v-permission="151001"
            >搜索</a-button
          >
          <a-button
            type="primary"
            @click="debounceOnExpoert"
            v-permission="151002"
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
    <template #operation="{ row }">
      {{ row.plate || row.name || "--" }}
    </template>
  </basic-template>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs, defineAsyncComponent } from "vue";
import { BasicTemplate, SelectDate } from "../../module";
import { UserSearchAntd } from "@/components/UserSearch";
import API from "@/api/dataReport/";
import dayJs from "dayjs";
import APIType from "@/api/dataReport/type";
import VehGroupType from "@/components/VehGroup/src/type";
import { useDebounce } from "@/hooks/core/useDebounce";
import { useMessage } from "@/hooks/web/useMessage";

export default defineComponent({
  name: "operationRecord",
  components: {
    BasicTemplate,
    SelectDate,
    VehGroupSelect: defineAsyncComponent(
      () => import("@/components/VehGroup/src/VehGroupSelect.vue")
    ),
    UserSearchAntd,
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

    const operaType = ref(0);

    const VehGroup = ref(<VehGroupType | null>null);
    const userInfo = ref(<number | null>null);

    const onSearch = async (tips?: boolean) => {
      // if (operaType.value === 1 && !VehGroup.value) {
      //   message.error("请选择车辆车组");
      //   return;
      // }
      // if (operaType.value === 0 && !userInfo.value) {
      //   message.error("请选择用户");
      //   return;
      // }
      const info = {
        startTime: rangeDate.value[0],
        endTime: rangeDate.value[1],
        flag: operaType.value,
        vehicleFlag: VehGroup.value ? VehGroup.value.flag : -1,
        groupId: VehGroup.value ? VehGroup.value.groupId : undefined,
        vehicleId: VehGroup.value
          ? VehGroup.value.vehicleId || VehGroup.value.groupId
          : undefined,
        inputUserId: userInfo.value ? (userInfo.value as number) : undefined,
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
      };
      loading.value = true;
      try {
        const { flag, obj, msg } = await API.pageOperRecord(info);

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

    const tableData = ref(<APIType.pageOperRecordRes["obj"]["data"]>[]);
    const tableColumns = ref([
      {
        title: "序号",
        align: "center",
        key: "index",
        width: 60,
        slots: { customRender: "index" },
      },
      {
        title: "操作用户",
        align: "center",
        key: "operUserName",
        width: 160,
      },
      {
        title: "操作类型",
        align: "center",
        key: "operType",
        width: 160,
      },
      {
        title: "操作时间",
        align: "center",
        key: "operTime",
        width: 160,
      },
      {
        title: "用户名(车牌号、车组名)",
        align: "center",
        key: "operation",
        width: 200,
        slots: { customRender: "operation" },
      },
      {
        title: "备注",
        align: "center",
        key: "remark",
      },
    ]);

    const onExport = () => {
      const info = {
        startTime: rangeDate.value[0],
        endTime: rangeDate.value[1],
        flag: operaType.value,
        vehicleFlag: VehGroup.value ? VehGroup.value.flag : -1,
        groupId: VehGroup.value ? VehGroup.value.groupId : undefined,
        vehicleId: VehGroup.value
          ? VehGroup.value.vehicleId || VehGroup.value.groupId
          : undefined,
        inputUserId: userInfo.value ? (userInfo.value as number) : undefined,
      };

      if (!info.groupId) {
        delete info.vehicleId;
      }
      if (!info.groupId) {
        delete info.groupId;
      }
      if (!info.inputUserId) {
        delete info.inputUserId;
      }
      API.exportOperRecord(info);
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
      operaType,
      VehGroup,
      userInfo,
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
