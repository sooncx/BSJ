<template>
  <div class="alarmTable">
    <el-table
      :data="tableData"
      :height="getHeight - 108"
      :max-height="getHeight && getHeight - 108"
      v-loading="loading"
      @row-click="handleClickRow"
    >
      <el-table-column prop="index" label="序号" width="50px">
        <template #default="{ row }">
          {{ row.index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="报警类型" width="150px" />
      <el-table-column prop="timeBegin" label="开始时间" width="150px" />
      <el-table-column prop="timeEnd" label="结束时间" width="150px" />
      <el-table-column prop="isPos" label="报警地点">
        <template #default="{ row }">
          {{ addressList[row.index] && addressList[row.index].address }}
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
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  reactive,
  toRefs,
  computed,
  inject,
  watchEffect,
  watch,
  Ref,
  nextTick,
} from "vue";
import { GetGeo } from "@/api/apiFn";
import { filterType } from "../type";
import API from "@/api/playBack";
import APIType from "@/api/playBack/type";

export default defineComponent({
  props: {
    height: {
      type: Number as PropType<number>,
      default: 257,
    },
    alarmlist: {
      type: Array as PropType<string[]>,
      default: [],
    },
    alarmLabel: {
      type: Array as PropType<string[]>,
      default: [],
    },
    alarmCheck: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    mapType: {
      type: String as PropType<string>,
      default: "Bmap",
    },
  },
  setup(props) {
    const getHeight = computed(() => {
      return props.height;
    });

    const mapControl = <any>inject("mapControl");
    const updateinfowindowdata = <(val: { type: string; data: any }) => void>(
      inject("UPDATE_INFOWINDOWDATA")
    );

    const tableData = ref(<APIType.listAlarmInfoRes["obj"]["data"]>[]);

    const pagination = reactive({
      current: 1,
      pageSize: 100,
      total: 0,
    });

    const filter = <Ref<filterType>>inject("filter");
    watch(
      () => filter,
      (val) => {
        getData();
      },
      {
        deep: true,
      }
    );

    const loading = ref(false);
    let markerList: any[] = [];
    const getData = async () => {
      if (!filter.value.vehgroup) return;
      const info = {
        vehicleId: filter.value.vehgroup.vehicleId,
        startTime: filter.value.startTime,
        endTime: filter.value.endTime,
        alarmTypes: props.alarmlist.join(","),
      };
      loading.value = true;
      const { obj } = await API.listAlarmInfo(info);

      markerList = [];
      tableData.value = obj
        ? obj.data.map((item: any, index: number) => ({
            ...item,
            index: index,
          }))
        : [];
      pagination.total = obj ? obj.total : 0;

      let posList: { lat: number; lon: number; tag: number }[] = [];
      obj &&
        obj.data.forEach((item: any, index: number) => {
          posList.push({
            lat: item.latBegin,
            lon: item.lonBegin,
            tag: index,
          });
        });

      await getAddress(posList);

      obj &&
        obj.data.forEach((item: any, index: number) => {
          const marker = mapControl.value.createMarker(
            {
              image: require("@/assets/img/playback/track_alarm.png"),
              width: 25,
              height: 30,
              offsetW: props.mapType === "Bmap" ? -6 : -12,
              offsetH: props.mapType === "Bmap" ? -15 : -30,
              lat: item.latBegin,
              lon: item.lonBegin,
              label: item.type,
            },
            {
              alarmtype: item.type,
              timeBegin: item.timeBegin,
              timeEnd: item.timeEnd,
              infoWindowType: "alarmPoint",
              address:
                addressList.value && (addressList.value[index] as any).address,
            }
          );
          markerList.push(marker);

          if (!props.alarmCheck) {
            mapControl.value.hide(marker);
          }
        });
      toggleMarker();
      loading.value = false;
    };

    nextTick(() => {
      watchEffect(() => {
        if (props.alarmCheck) {
          markerList.forEach((item: any) => {
            mapControl.value.show(item);
          });
          toggleMarker();
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

        watch(
          () => props.alarmLabel,
          () => {
            toggleMarker();
          }
        );
      });
    });

    // 显示隐藏marker
    const toggleMarker = () => {
      markerList.forEach((item: any) => {
        const labelStr =
          props.mapType === "Bmap"
            ? item.getLabel().content
            : item.getLabel().contentStr;
        if (props.alarmLabel.indexOf(labelStr) === -1) {
          mapControl.value.hide(item);
        } else {
          mapControl.value.show(item);
        }
      });
    };

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

    const handleClickRow = (row: any) => {
      toggleMarker();
      row.address =
        addressList.value && (addressList.value[row.index] as any).address;
      updateinfowindowdata({
        data: row,
        type: "alarmPoint",
      });
      mapControl.value.panTo(
        mapControl.value.getPoints(markerList[row.index], "marker")
      );
      mapControl.value.showInfowindow(markerList[row.index]);
      mapControl.value.show(markerList[row.index]);
    };

    return {
      getHeight,
      tableData,
      addressList,
      ...toRefs(pagination),
      pageChange,
      handleClickRow,
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
