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
        <FnIntroduction>
          <i class="iconfont icon-tixing" style="margin-left: 15px"></i>
        </FnIntroduction>

        <div class="filter__btnBox">
          <a-button
            :loading="loading"
            type="primary"
            @click="debounceOnSearch(true)"
            class="filter__searchbtn"
            v-permission="150701"
            >搜索</a-button
          >
          <a-button
            type="primary"
            @click="debounceOnExpoert"
            v-permission="150703"
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
      <p><i class="iconfont icon-caozuo" @click="showDetail(row)"></i></p>
    </template>
  </basic-template>
  <!-- 明细 -->
  <Detail v-model:visible="visible" type="mileage" :row="row" />
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
import { BasicTemplate, SelectDate } from "../../module";
import FnIntroduction from "@/components/FnIntroduction/index.vue";
import { ElementOf } from "@/utils";
import API from "@/api/dataReport/";
import dayJs from "dayjs";
import APIType from "@/api/dataReport/type";
import VehGroupType from "@/components/VehGroup/src/type";
import { useDebounce } from "@/hooks/core/useDebounce";
import { useMessage } from "@/hooks/web/useMessage";
import { useStore } from 'vuex';

export default defineComponent({
  name: "mileageReport",
  components: {
    BasicTemplate,
    SelectDate,
    VehGroupSelect: defineAsyncComponent(
      () => import("@/components/VehGroup/src/VehGroupSelect.vue")
    ),
    FnIntroduction,
    Detail: defineAsyncComponent(
      () => import("../../module/src/DetailModal.vue")
    ),
  },
  setup() {
    const loading = ref(false);
    const message = useMessage();
    const store = useStore();
    const rangeDate = ref([
      dayJs(new Date().getTime() - 3600 * 1000 * 24 * 2).format(
        "YYYY-MM-DD 00:00:00"
      ),
      dayJs(new Date()).format("YYYY-MM-DD 23:59:59"),
    ]);

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
        startTime: rangeDate.value[0],
        endTime: rangeDate.value[1],
      };

      loading.value = true;
      try {
        const { flag, obj, msg } = await API.pageMileage(info);

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

    const tableData = ref(<APIType.pageMileageRes["obj"]["data"]>[]);
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
        title: "设备号",
        align: "center",
        key: "terminalNo",
      },
      {
        title: "所属车组",
        align: "center",
        key: "groupName",
      },
      {
        title: "开始时间",
        align: "center",
        key: "beginTimeS",
      },
      {
        title: "结束时间",
        align: "center",
        key: "endTimeS",
      },
      {
        title: "行驶里程(km)",
        align: "center",
        key: "thisMileage",
      },
      {
        title: "操作",
        align: "center",
        key: "operation",
        width: 60,
        slots: { customRender: "operation" },
      },
    ]);

    const navModal = <Ref<(val: string) => void>>inject("navModal");
    const onExport = async () => {
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
        startTime: rangeDate.value[0],
        endTime: rangeDate.value[1],
        sessionId: store.state.sessionId
      };

      const { msg, flag } = await API.exportMileage(info);

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
        row: ElementOf<APIType.pageMileageRes["obj"]["data"]> | null;
      }
    >{
      visible: false,
      row: null,
    });
    const showDetail = async (
      row: ElementOf<APIType.pageMileageRes["obj"]["data"]>
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
