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
        <SelectDate v-model:value="rangeDate" dateType="date" @complete="debounceOnSearch(true)" />
      </div>
      <div class="filter__vehgroup">
        <span class="filter__title">选择车辆</span>
        <VehGroupSelect v-model:value="VehGroup" :isDbclick="false" />

        <span class="filter__title" style="margin-left: 16px"
          >停车时间大于≥</span
        >
        <div>
          <a-input
            v-model:value="stopTime"
            style="width: 80px; margin: 0"
          ></a-input>
        </div>

        <div class="filter__btnBox">
          <a-button
            :loading="loading"
            type="primary"
            @click="debounceOnSearch(true)"
            class="filter__searchbtn"
            v-permission="150501"
            >搜索</a-button
          >
          <div>
            <ColumnSelect v-model:value="tableColumns" />
            <a-button type="primary" v-permission="150504" @click="debounceOnExpoert">
              <i class="iconfont icon-daochu"></i>
              导出</a-button
            >
          </div>
        </div>
      </div>
    </template>

    <template #operation="{ row }">
      <div class="operation">
        <span @click="showModal('detail', row)" v-permission="150502">停车详情</span>
        <span @click="showModal('map', row)" v-permission="150503">地图</span>
      </div>
    </template>
  </basic-template>
  <Modal
    v-model:visible="visible"
    :footer="null"
    :title="operaType === 'detail' ? '停车详情' : '地图'"
    width="900px"
    :bodyStyle="{ padding: '0' }"
  >
    <template #description v-if="operaType === 'map'">
      <el-switch
        style="margin-left: 20px"
        v-model="mapType"
        active-text="百度地图"
        inactive-text="高德地图"
        active-color="#0e60db"
        inactive-color="#13ce66"
      ></el-switch>
    </template>
    <Detail :curData="row" v-show="operaType === 'detail'" :timeArr="rangeDate" />
    <div style="min-height: 500px" v-show="operaType === 'map'">
      <AMap :curData="row" :mapType="mapType" v-show="!mapType" />
      <BMap :curData="row" :mapType="mapType" v-show="mapType" />
    </div>
  </Modal>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  defineAsyncComponent,
} from "vue";
import { BasicTemplate, SelectDate } from "../../module";
import API from "@/api/dataReport/";
import dayJs from "dayjs";
import { GetGeo } from "@/api/apiFn";
import APIType from "@/api/dataReport/type";
import VehGroupType from "@/components/VehGroup/src/type";
import { useDebounce } from '@/hooks/core/useDebounce';
import { useMessage } from '@/hooks/web/useMessage';

export default defineComponent({
  name: "frequentStops",
  components: {
    BasicTemplate,
    SelectDate,
    VehGroupSelect: defineAsyncComponent(
      () => import("@/components/VehGroup/src/VehGroupSelect.vue")
    ),
    Modal: defineAsyncComponent(
      () => import("@/components/Modal/src/Modal.vue")
    ),
    Detail: defineAsyncComponent(() => import("./Detail.vue")),
    AMap: defineAsyncComponent(() => import("./AMap.vue")),
    BMap: defineAsyncComponent(() => import("./BMap.vue")),
    ColumnSelect: defineAsyncComponent(() => import('../../module/src/ColumnSelect.vue')),
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
    const stopTime = ref(30);

    const onSearch = async (tips?: boolean) => {
      console.log(VehGroup);
      if (!VehGroup.value) {
        message.error("请选择车辆");
        return;
      }
      if (!stopTime.value) {
        message.error("请输入停车时长");
        return;
      }

      const info = {
        vehicleId: VehGroup.value.vehicleId || VehGroup.value.groupId,
        runStopBeginTime: rangeDate.value[0],
        runStopEndTime: rangeDate.value[1],
        spaceTime: stopTime.value,
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
      };

      loading.value = true;
      try {
        const { flag, obj, msg } = await API.pageStopRePort(info);

        if (flag === 1) {
          tips && message.success(msg);
          let posList: { lat: number; lon: number; tag: number }[] = [];
          obj.data.newRunStopReportDTOS.forEach((item, index) => {
            posList.push({
              lat: item.aB,
              lon: item.oB,
              tag: index,
            });
          });
          // 获取地理位置
          const addressList = await GetGeo(posList);

          tableData.value = obj.data.newRunStopReportDTOS.map(
            (item, index: number) => ({
              ...item,
              groupName: obj.data.dvehicleInfo.groupName,
              plate: obj.data.dvehicleInfo.plate,
              address: addressList[index].address,
            })
          );
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

    const tableData = ref(
      <APIType.pageStopRePortRes["obj"]["data"]["newRunStopReportDTOS"]>[]
    );
    const tableColumns = ref([
      {
        title: "车组名称",
        align: "center",
        key: "groupName",
        minwidth: 150,
        visible: true
      },
      {
        title: "车牌号",
        align: "center",
        key: "plate",
        minwidth: 150,
        visible: true
      },
      {
        title: "位置",
        align: "center",
        key: "address",
        minwidth: 360,
        visible: true
      },
      {
        title: "停车次数",
        align: "center",
        key: "n",
        width: 90,
        visible: true
      },
      {
        title: "停车详情",
        align: "center",
        key: "operation",
        width: 120,
        slots: { customRender: "operation" },
        visible: true
      },
    ]);

    const onExport = () => {
      if (!VehGroup.value) {
        message.error("请选择车辆车组");
        return;
      }

      const info = {
        vehicleId: VehGroup.value.vehicleId || VehGroup.value.groupId,
        runStopBeginTime: rangeDate.value[0],
        runStopEndTime: rangeDate.value[1],
        spaceTime: stopTime.value,
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
      };

      API.exportStopRePort(info);
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

    const modalData = reactive({
      visible: false,
      operaType: "map",
      mapType: true,
      row: null,
      showModal: (type: string, row: any) => {
        console.log(row);
        modalData.row = row;
        modalData.operaType = type;
        modalData.visible = true;
      },
    });

    return {
      loading,
      rangeDate,
      VehGroup,
      stopTime,
      debounceOnSearch,
      tableData,
      tableColumns,
      debounceOnExpoert,
      ...toRefs(pagination),
      currentChange,
      pageSizeChange,
      ...toRefs(modalData),
    };
  },
});
</script>
<style lang="less" scoped>
@import "../../module/css/index.less";
.operation {
  margin: 0 auto;
  width: 80px;
  display: flex;
  justify-content: space-between;
  span {
    color: #0e60db;
    cursor: pointer;
  }
}
</style>
