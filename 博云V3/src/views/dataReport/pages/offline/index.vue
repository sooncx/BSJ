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

        <span class="filter__title" style="margin-left: 16px"
          >离线时间范围</span
        >
        <div>
          <a-input-group compact>
            <a-select v-model:value="dateType">
              <a-select-option value="1">天</a-select-option>
              <a-select-option value="2">时</a-select-option>
            </a-select>
            <a-input
              v-model:value="min"
              @keyup="min = min.replace(/\D/g, '')"
              :maxlength="5"
              style="width: 70px; text-align: center"
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
              placeholder="至"
              disabled
            />
            <a-input
              v-model:value="max"
              @keyup="max = max.replace(/[^1-9]/g, '')"
              :maxlength="5"
              style="width: 70px; text-align: center; border-left: 0"
            />
          </a-input-group>
        </div>
        <div class="filter__btnBox">
          <a-button
            :loading="loading"
            type="primary"
            @click="debounceOnSearch(true)"
            class="filter__searchbtn"
            v-permission="150201"
            >搜索</a-button
          >
          <a-button
            type="primary"
            @click="debounceOnExpoert"
            v-permission="150202"
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
  name: "offine",
  components: {
    BasicTemplate,
    VehGroupSelect: defineAsyncComponent(
      () => import("@/components/VehGroup/src/VehGroupSelect.vue")
    ),
  },
  setup() {
    const loading = ref(false);
    const message = useMessage();
    const VehGroup = ref(<VehGroupType | null>null);
    const offlineDate = reactive({
      dateType: "1",
      min: 1,
      max: 7,
    });

    const onSearch = async (tips?: boolean) => {
      console.log(VehGroup);
      // if (!VehGroup.value) {
      //   message.error("请选择车辆车组");
      //   return;
      // }

      // 转换为分钟
      const time = offlineDate.dateType === "1" ? 24 * 60 : 60;

      const info = {
        chooseId:
          VehGroup.value?.vehicleId || VehGroup.value?.groupId || undefined,
        groupId: VehGroup.value?.groupId || undefined,
        flag: VehGroup.value?.flag || undefined,
        longStay: 0,
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
        beginOffTimeMin: time * offlineDate.min,
        endOffTimeMin: time * offlineDate.max,
      };
      loading.value = true;
      try {
        const { flag, msg, obj } = await API.pageOffOnline(info);

        if (flag === 1) {
          tips && message.success(msg);

          let posList: { lat: number; lon: number; tag: number }[] = [];
          obj.data.forEach((item, index) => {
            posList.push({
              lat: item.A,
              lon: item.O,
              tag: index,
            });
          });
          // 获取地理位置
          const addressList = await GetGeo(posList);

          tableData.value = obj.data.map((item: any, index: number) => ({
            ...item,
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

    const tableData = ref(<APIType.pageOffOnlineRes["obj"]["data"]>[]);
    const tableColumns = ref([
      {
        title: "序号",
        align: "center",
        width: 60,
        slots: { customRender: "index" },
        key: "index",
      },
      {
        title: "车牌号",
        align: "center",
        key: "P",
      },
      {
        title: "SIM卡号",
        align: "center",
        key: "M",
      },
      {
        title: "终端编号",
        align: "center",
        key: "N",
      },
      {
        title: "所属车组",
        align: "center",
        key: "G",
      },
      {
        title: "车辆类型",
        align: "center",
        key: "Y",
      },
      {
        title: "最后在线时间",
        align: "center",
        key: "T",
      },
      {
        title: "离线时间",
        align: "center",
        key: "S",
      },
      {
        title: "位置",
        align: "center",
        key: "address",
        minwidth: 240,
      },
    ]);

    const onExport = () => {
      // 转换为分钟
      const time = offlineDate.dateType === "1" ? 24 * 60 : 60;

      const info = {
        chooseId:
          VehGroup.value?.vehicleId || VehGroup.value?.groupId || undefined,
        groupId: VehGroup.value?.groupId || undefined,
        flag: VehGroup.value?.flag || undefined,
        longStay: 0,
        beginOffTimeMin: time * offlineDate.min,
        endOffTimeMin: time * offlineDate.max,
      };
      if (!info.chooseId) {
        delete info.chooseId;
      }
      if (!info.groupId) {
        delete info.groupId;
      }
      if (!info.flag) {
        delete info.flag;
      }
      API.exportOffOnline(info);
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
