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
      <div class="filter__vehgroup">
        <div>
          <a-input-group compact>
            <a-select v-model:value="electricType">
              <a-select-option value="1">剩余电量 ≦</a-select-option>
              <a-select-option value="2">剩余电量 ≧</a-select-option>
            </a-select>
            <a-input
              v-model:value="electric"
              style="width: 60px; text-align: center"
            />
          </a-input-group>
        </div>
        <div class="filter__btnBox">
          <a-button
            :loading="loading"
            type="primary"
            @click="debounceOnSearch(true)"
            class="filter__searchbtn"
            v-permission="150601"
            >搜索</a-button
          >
          <a-button type="primary" @click="onExport" v-permission="150602">
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
  </BasicTemplate>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from "vue";
import { BasicTemplate } from "../../module";
import API from "@/api/dataReport/";
import APIType from "@/api/dataReport/type";
import { useDebounce } from "@/hooks/core/useDebounce";
import { useMessage } from "@/hooks/web/useMessage";

export default defineComponent({
  name: "remainderElectric",
  components: {
    BasicTemplate,
  },
  setup() {
    const loading = ref(false);
    const message = useMessage();
    const offlineDate = reactive({
      electricType: "1",
      electric: 30,
    });

    const onSearch = async (tips?: boolean) => {
      const info = {
        percent: offlineDate.electric,
        gl: offlineDate.electricType === "1" ? "l" : "g",
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
      };
      loading.value = true;
      try {
        const { flag, obj, msg } = await API.pageEnergyReport(info);

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

    const tableData = ref(<APIType.pageEnergyReportRes["obj"]["data"]>[]);
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
        key: "P",
      },
      {
        title: "所属车组",
        align: "center",
        key: "G",
      },
      {
        title: "车主",
        align: "center",
        key: "W",
      },
      {
        title: "设备号",
        align: "center",
        key: "N",
      },
      {
        title: "剩余电量(%)",
        align: "center",
        key: "E",
      },
      {
        title: "SIM卡号",
        align: "center",
        key: "I",
      },
    ]);

    const onExport = () => {
      const info = {
        percent: offlineDate.electric,
        gl: offlineDate.electricType === "1" ? "l" : "g",
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
      };

      API.exportEnergyReport(info);
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
      ...toRefs(offlineDate),
      debounceOnSearch,
      tableData,
      tableColumns,
      onExport,
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
