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
      <div class="filter__vehgroup">
        <span class="filter__title">车辆车组</span>
        <VehGroupSelect v-model:value="VehGroup" />
        <FnIntroduction>
          <i class="iconfont icon-tixing" style="margin-left: 15px"></i>
        </FnIntroduction>

        <div class="filter__btnBox">
          <a-button
            :loading="loading"
            type="primary"
            @click="debounceOnSearch(true)"
            class="filter__searchbtn"
            v-permission="150801"
            >搜索</a-button
          >
          <a-button
            type="primary"
            @click="debounceOnExpoert"
            v-permission="150802"
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
import { BasicTemplate } from "../../module";
import FnIntroduction from "@/components/FnIntroduction/index.vue";
import API from "@/api/dataReport/";
import APIType from "@/api/dataReport/type";
import VehGroupType from "@/components/VehGroup/src/type";
import { useDebounce } from "@/hooks/core/useDebounce";
import { useMessage } from "@/hooks/web/useMessage";

export default defineComponent({
  name: "totalMileage",
  components: {
    BasicTemplate,
    VehGroupSelect: defineAsyncComponent(
      () => import("@/components/VehGroup/src/VehGroupSelect.vue")
    ),
    FnIntroduction,
  },
  setup() {
    const loading = ref(false);
    const message = useMessage();
    const VehGroup = ref(<VehGroupType | null>null);

    const onSearch = async (tips?: boolean) => {
      if (!VehGroup.value) {
        message.error("请选择车辆车组");
        return;
      }

      const info = {
        chooseId: VehGroup.value.vehicleId || VehGroup.value.groupId,
        groupId: VehGroup.value.groupId,
        flag: VehGroup.value.flag,
        longStay: 0,
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
      };
      loading.value = true;
      try {
        const { flag, obj, msg } = await API.pageTotalMileageReport(info);

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

    const tableData = ref(<APIType.pageTotalMileageReportRes["obj"]["data"]>[]);
    const tableColumns = ref([
      {
        title: "车牌号",
        align: "center",
        key: "PL",
      },
      {
        title: "所属车组",
        align: "center",
        key: "GN",
      },
      {
        title: "最后时间",
        align: "center",
        key: "TI",
      },
      {
        title: "设备类型",
        align: "center",
        key: "TY",
      },
      {
        title: "设备号",
        align: "center",
        key: "TE",
      },
      {
        title: "总里程(km)",
        align: "center",
        key: "MI",
      },
    ]);

    const onExport = () => {
      if (!VehGroup.value) {
        message.error("请选择车辆车组");
        return;
      }

      const info = {
        chooseId: VehGroup.value.vehicleId || VehGroup.value.groupId,
        groupId: VehGroup.value.groupId,
        flag: VehGroup.value.flag,
        longStay: 0,
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
      };

      API.exportTotalMileageReport(info);
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
