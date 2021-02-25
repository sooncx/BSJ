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
        <span class="filter__title">车辆车组</span>
        <VehGroupSelect v-model:value="VehGroup" />

        <span class="filter__title" style="margin-left: 16px">停留时间 >=</span>
        <div>
          <a-input-group compact>
            <a-input
              v-model:value="day"
              @keyup="day = day.replace(/\D/g, '')"
              :maxlength="5"
              style="width: 60px; text-align: center"
            />
            <a-input
              style="
                width: 40px;
                border-left: 0;
                border-right: 0;
                margin: 0;
                pointer-events: none;
                background-color: #fff;
              "
              placeholder="天"
              disabled
            />
            <a-input
              v-model:value="time"
              @keyup="time = time.replace(/[^1-9]/g, 1)"
              :maxlength="5"
              style="width: 60px; text-align: center; border-left: 0"
            />
            <a-input
              style="
                width: 40px;
                border-left: 0;
                margin: 0;
                pointer-events: none;
                background-color: #fff;
              "
              placeholder="时"
              disabled
            />
          </a-input-group>
        </div>
        <div class="filter__btnBox">
          <a-button
            :loading="loading"
            type="primary"
            @click="debounceOnSearch(true)"
            class="filter__searchbtn"
            v-permission="150401"
            >搜索</a-button
          >
          <div>
            <ColumnSelect v-model:value="tableColumns" />
            <a-button
              type="primary"
              @click="debounceOnExpoert"
              v-permission="150402"
            >
              <i class="iconfont icon-daochu"></i>
              导出</a-button
            >
          </div>
        </div>
      </div>
    </template>
  </BasicTemplate>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs, defineAsyncComponent } from "vue";
import { BasicTemplate } from "../../module";
import API from "@/api/dataReport/";
import { GetGeo } from "@/api/apiFn";
import APIType from "@/api/dataReport/type";
import VehGroupType from "@/components/VehGroup/src/type";
import { useDebounce } from "@/hooks/core/useDebounce";
import { useMessage } from "@/hooks/web/useMessage";

export default defineComponent({
  name: "parkingReport",
  components: {
    BasicTemplate,
    ColumnSelect: defineAsyncComponent(() => import('../../module/src/ColumnSelect.vue')),
    VehGroupSelect: defineAsyncComponent(
      () => import("@/components/VehGroup/src/VehGroupSelect.vue")
    ),
  },
  setup() {
    const loading = ref(false);
    const message = useMessage();
    const VehGroup = ref(<VehGroupType | null>null);
    const offlineDate = reactive({
      day: 0,
      time: 1,
    });

    const onSearch = async (tips?: boolean) => {
      if (!VehGroup.value) {
        message.error("请选择车辆车组");
        return;
      }

      if (!offlineDate.time) {
        message.error("停留时间必须大于一小时！");
        return;
      }

      const info = {
        chooseId: VehGroup.value.vehicleId || VehGroup.value.groupId,
        groupId: VehGroup.value.groupId,
        flag: VehGroup.value.flag,
        longStay: 0,
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
        min: offlineDate.day * 24 + offlineDate.time,
        all: 0, // -1 不分页
      };
      loading.value = true;
      try {
        const { flag, obj, msg } = await API.pageNowStopRePort(info);

        if (flag === 1) {
          tips && message.success(msg);

          let posList: { lat: number; lon: number; tag: number }[] = [];
          obj.data.forEach((item, index) => {
            posList.push({
              lat: item.lat,
              lon: item.lon,
              tag: index,
            });
          });
          // 获取地理位置
          const addressList = await GetGeo(posList);

          tableData.value = obj.data.map((item: any, index: number) => ({
            ...item,
            isPosStr: item.isPos === 1 ? "定位" : "不定位",
            address: addressList[index].address,
          }));
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

    const tableData = ref(<APIType.pageNowStopRePortRes["obj"]["data"]>[]);
    const tableColumns = ref([
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
        title: "车辆类型",
        align: "center",
        key: "terminalType",
        visible: true
      },
      {
        title: "停车开始时间",
        align: "center",
        key: "beginTime",
        minwidth: 120,
        visible: true
      },
      {
        title: "停车时长",
        align: "center",
        key: "displayTimeStr",
        visible: true
      },
      {
        title: "是否定位",
        align: "center",
        key: "isPosStr",
        visible: true
      },
      {
        title: "位置",
        align: "center",
        key: "address",
        minwidth: 240,
        visible: true
      },
    ]);

    const onExport = () => {
      if (!VehGroup.value) {
        message.error("请选择车辆车组");
        return;
      }

      if (!offlineDate.time) {
        message.error("停留时间必须大于一小时！");
        return;
      }

      const info = {
        chooseId: VehGroup.value.vehicleId || VehGroup.value.groupId,
        groupId: VehGroup.value.groupId,
        flag: VehGroup.value.flag,
        longStay: 0,
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
        min: offlineDate.day * 24 + offlineDate.time,
        all: 0
      };

      API.exportNowStopRePort(info);
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
      ...toRefs(offlineDate),
      debounceOnSearch,
      debounceOnExpoert,
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
