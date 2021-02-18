<template>
  <div class="alarmTable">
    <el-table
      :data="tableData"
      :height="height - 108"
      :max-height="height - 108"
      @row-click="handleClickRow"
      v-loading="loading"
    >
      <el-table-column prop="index" label="序号" width="50px">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="地址" min-width="800">
        <template #default="{ row }">
          {{ addressList[row.index] && addressList[row.index].address }}
        </template>
      </el-table-column>
      <el-table-column prop="spaceTimeTotal" label="停车时长" width="150px" />
      <el-table-column label="停车次数" width="150px">
        <template #default="{ row }">
          <span
            style="color: #0e60db; cursor: pointer"
            @click.stop="showDetail(row)"
            >{{ row.n }}</span
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="alarmTable__pager">
      <a-pagination
        show-size-changer
        :page-size-options="['100', '200', '300', '400']"
        :total="total"
        :show-total="(total) => `共: ${total} 条`"
        size="small"
        v-model:pageSize="pageSize"
        v-model:current="current"
        @change="pageChange"
        @showSizeChange="pageChange"
      />
    </div>

    <Modal
      title="停车详情"
      :description="`停车位置: ${detailAddress}`"
      v-model:visible="visible"
      width="800px"
      :bodyStyle="{ padding: 0 }"
      :footer="null"
    >
      <el-table
        :data="detailTable"
        max-height="500px"
        height="500px"
        size="small"
      >
        <el-table-column label="序号" prop="_index" width="60px" />
        <el-table-column prop="start" label="开始时间" />
        <el-table-column prop="end" label="结束时间" />
        <el-table-column prop="diffTime" sortable label="停车时长" width="120">
          <template #default="{ row }">
            {{ row.duration }}
          </template>
        </el-table-column>
      </el-table>
    </Modal>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  watchEffect,
  PropType,
  ref,
  reactive,
  toRefs,
  inject,
  watch,
  Ref,
} from "vue";
import { GetGeo } from "@/api/apiFn";
import dayJs from "dayjs";
import { filterType } from "../type";
import API from "@/api/playBack";
import APIType from "@/api/playBack/type";

export default defineComponent({
  props: {
    height: {
      type: Number as PropType<number>,
      default: 257,
    },
    remainCheck: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    mapType: {
      type: String as PropType<string>,
      default: "Bmap",
    },
  },
  components: {
    Modal: defineAsyncComponent(
      () => import("@/components/Modal/src/Modal.vue")
    ),
  },
  setup(props) {
    const tableData = ref();
    const filter = <Ref<filterType>>inject("filter");
    const mapControl = <any>inject("mapControl");
    const updateinfowindowdata = <(val: { type: string; data: any }) => void>(
      inject("UPDATE_INFOWINDOWDATA")
    );

    const pagination = reactive({
      current: 1,
      pageSize: 100,
      total: 0,
    });

    watch(
      () => filter,
      (val) => {
        getData();
      },
      {
        deep: true,
      }
    );

    let markerList: any[] = [];
    const loading = ref(false);
    const getData = async () => {
      if (!filter.value.vehgroup) return;
      const info = {
        vehicleId: filter.value.vehgroup.vehicleId,
        runStopBeginTime: dayJs()
          .subtract(1, "month")
          .format("YYYY-MM-DD HH:mm:ss"), // filter.value.startTime
        runStopEndTime: dayJs().format("YYYY-MM-DD HH:mm:ss"), // filter.value.endTime
        longStay: filter.value.restTime,
        spaceTime: 30,
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
      };
      loading.value = true;
      try {
        const { obj } = await API.pageQueryStopReport(info);

        markerList = [];

        let posList: { lat: number; lon: number; tag: number }[] = [];
        obj.data.newRunStopReportDTOS.forEach((item: any, index: number) => {
          posList.push({
            lat: item.aB,
            lon: item.oB,
            tag: index,
          });

          item.spaceTimeTotal = 0;
          item.details.map((spaceItem: any) => {
            item.spaceTimeTotal += spaceItem.spaceTime;
          });
          item.spaceTimeTotal = diffTime(item.spaceTimeTotal * 1000);
        });

        tableData.value =
          obj.data.newRunStopReportDTOS.map((item: any, index: number) => ({
            ...item,
            index: index,
          })) || [];
        pagination.total = obj.total;

        await getAddress(posList);

        obj.data.newRunStopReportDTOS.forEach((item: any, index: number) => {
          const marker = mapControl.value.createMarker(
            {
              image: require("@/assets/img/playback/track_stopReport.png"),
              width: 24,
              height: 24,
              offsetW: props.mapType === "Bmap" ? 0 : -12,
              offsetH: props.mapType === "Bmap" ? 0 : -12,
              lat: item.aB,
              lon: item.oB,
            },
            {
              type: "stopPoint",
              spaceTimeTotal: item.spaceTimeTotal,
              n: item.n,
              address:
                addressList.value && (addressList.value[index] as any).address,
            }
          );
          markerList.push(marker);

          if (!props.remainCheck) {
            mapControl.value.hide(marker);
          }
        });

        loading.value = false;
      } catch (error) {
        loading.value = false;
      }
    };

    watchEffect(() => {
      if (props.remainCheck) {
        markerList.forEach((item: any) => {
          mapControl.value.show(item);
        });
      } else {
        markerList.forEach((item: any) => {
          mapControl.value.hide(item);
        });
      }
      watch(
        () => props.mapType,
        () => {
          tableData.value = [];
          pagination.total = 0;
        }
      );
    });

    const addressList = ref([]);
    const getAddress = async (
      posList: { lat: number; lon: number; tag: number }[]
    ) => {
      const res = await GetGeo(posList);
      addressList.value = Object.assign(res, addressList.value);
    };

    const pageChange = (current: number, pageSize: number) => {
      console.log(current, pageSize);
      getData();
    };

    // 行点击
    const handleClickRow = (row: any) => {
      console.log(row);
      row.address =
        addressList.value && (addressList.value[row.index] as any).address;
      updateinfowindowdata({
        data: row,
        type: "stopPoint",
      });
      mapControl.value.panTo(
        mapControl.value.getPoints(markerList[row.index], "marker")
      );
      mapControl.value.showInfowindow(markerList[row.index]);
    };

    // 停车详情
    const visible = ref(false);
    const detailAddress = ref("");
    const detailTable = ref();
    const showDetail = (row: any) => {
      detailAddress.value =
        addressList.value && (addressList.value[row.index] as any).address;
      let list: any[] = [];
      row.timeDetails.map((item: any, index: number) => {
        const splitArr = item.split(",");
        const diffTimeStr = dayJs(splitArr[1]).diff(dayJs(splitArr[0]));
        list.push({
          start: splitArr[0],
          end: splitArr[1],
          _index: index + 1,
          duration: diffTime(diffTimeStr),
          diffTime: diffTimeStr,
        });
      });
      detailTable.value = list;
      visible.value = true;
    };

    const diffTime = (diffTime: number) => {
      // var diff = endDate.getTime() - startDate.getTime(); //时间差的毫秒数
      //计算出相差天数
      let days = Math.floor(diffTime / (24 * 3600 * 1000));
      //计算出小时数
      let leave1 = diffTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
      let hours = Math.floor(leave1 / (3600 * 1000));
      //计算相差分钟数
      let leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
      let minutes = Math.floor(leave2 / (60 * 1000));
      //计算相差秒数
      let leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
      let seconds = Math.round(leave3 / 1000);
      let ret = 0;
      if (minutes > 0) {
        ret += minutes;
      }
      if (hours > 0) {
        ret += hours * 60;
      }
      if (days > 0) {
        ret += days * 24 * 60;
      }
      let returnStr = ""; //seconds + "秒";
      if (minutes > 0) {
        returnStr = minutes + "分" + returnStr;
      }
      if (hours > 0) {
        returnStr = hours + "小时" + returnStr;
      }
      if (days > 0) {
        returnStr = days + "天" + returnStr;
      }
      return returnStr;
    };

    return {
      tableData,
      ...toRefs(pagination),
      pageChange,
      addressList,
      handleClickRow,
      visible,
      detailTable,
      showDetail,
      detailAddress,
      loading,
    };
  },
});
</script>
<style lang="less" scoped>
.alarmTable {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &__pager {
    background: #fff;
    width: 100%;
    height: 44px;
    line-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
}
</style>
