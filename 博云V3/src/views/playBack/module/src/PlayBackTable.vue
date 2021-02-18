<template>
  <div class="playBackTable">
    <el-table
      :data="basicData.slice((current - 1) * pageSize, current * pageSize)"
      :height="getHeight"
      :max-height="getHeight"
      highlight-current-row
      v-loading="loading"
      ref="tableRef"
      @row-click="handleClickRow"
      size="small"
      v-if="!errFlag"
    >
      <el-table-column label="序号" prop="index" width="70"></el-table-column>
      <el-table-column label="车牌" prop="plate" width="130"></el-table-column>
      <el-table-column label="时间" prop="date" width="180"></el-table-column>
      <el-table-column label="速度 km/h" prop="speed" width="150">
        <template #default="{ row }">
          {{ row.speed }}
          <span
            v-if="row.hasNoLocation"
            style="color: #e57511; cursor: pointer"
            @click="showDetail(row)"
            >（包含不定位数据）</span
          >
        </template>
      </el-table-column>
      <el-table-column label="方向" prop="angle" width="100"></el-table-column>
      <el-table-column
        label="里程"
        prop="mileage"
        width="100"
      ></el-table-column>
      <el-table-column
        label="部件状态"
        prop="componentStateTxt"
        width="200"
      ></el-table-column>
      <el-table-column label="位置" prop="speed" min-width="800">
        <template #default="{ row }">
          {{ addressList[row.index - 1] && addressList[row.index - 1].address }}
        </template>
      </el-table-column>
    </el-table>

    <div
      v-else
      :style="{ height: getHeight + 'px' }"
      class="playBackTable__errBox"
    >
      <i class="iconfont icon-tixing"></i>
      <p>{{ errMsg }}</p>
    </div>

    <div class="playBackTable__pager">
      <a-pagination
        show-size-changer
        :page-size-options="['100', '200', '300', '400']"
        :total="total"
        :show-total="(total) => `共: ${total} 条`"
        size="small"
        :pageSize="pageSize"
        :current="current"
        @change="currentChange"
        @showSizeChange="pageSizeChange"
      />
    </div>

    <Modal
      title="包含不定位数据详情"
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
        <el-table-column label="序号" prop="index" width="60px" />
        <el-table-column prop="devTime" label="时间" width="380px" />
        <el-table-column prop="speed" label="速度(km/h)" />
        <el-table-column prop="isPos" label="是否定位">
          <template #default="{ row }">
            <a-tag :color="row.isPos ? 'orange' : 'red'">{{
              row.isPos ? "定位" : "不定位"
            }}</a-tag>
          </template>
        </el-table-column>
      </el-table>
    </Modal>
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  reactive,
  ref,
  toRefs,
  inject,
  watch,
  nextTick,
  watchEffect,
  defineAsyncComponent,
  Ref,
} from "vue";
import { carUtil, carType } from "@/assets/js/carUtil";
import { ElementOf } from "@/utils";
import { GetGeo } from "@/api/apiFn";
import { useStore } from "vuex";
import API from "@/api/playBack";
import APIType from "@/api/playBack/type";
import { filterType } from "../type";

export default defineComponent({
  name: "playbackTable",
  props: {
    height: {
      type: Number as PropType<number>,
      default: 257,
    },
    loading: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    trackCheck: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    mapType: {
      type: String as PropType<string>,
      default: "Bmap",
    },
    expand: {
      type: Boolean,
      default: false,
    },
    mileageData: {
      type: Object as PropType<{
        start: number;
        end: number;
      }>,
    },
  },
  components: {
    Modal: defineAsyncComponent(
      () => import("@/components/Modal/src/Modal.vue")
    ),
  },
  setup(props, { emit }) {
    const { state } = useStore();
    const getHeight = computed(() => {
      return props.height;
    });
    const filter = <Ref<filterType>>inject("filter");
    const playbackTotal = <Ref<number>>inject("playbackTotal");
    const mapControl = <any>inject("mapControl");

    watch(
      () => filter,
      (val) => {
        getData();
      },
      {
        deep: true,
      }
    );

    const pagination = reactive({
      current: 1,
      pageSize: 100,
      total: 0,
    });

    const currentChange = (page: number, pageSize: number) => {
      console.log(page, pageSize);
      pagination.current = page;
    };

    const pageSizeChange = (current: number, size: number) => {
      console.log(current, size);
      pagination.pageSize = size;
    };

    const addressList = ref([]);
    const getAddress = async (
      posList: { lat: number; lon: number; tag: number }[]
    ) => {
      const res = await GetGeo(posList);
      addressList.value = Object.assign(res, addressList.value);
    };

    // 处理后--全部数据
    const basicData = ref(
      <
        ({ index: number } & carType &
          ElementOf<APIType.listVehTrackPointRes["obj"]["data"]["trackList"]>)[]
      >[]
    );
    const errData = reactive({
      errFlag: false,
      errMsg: "",
    });
    const loading = ref(false);
    let polyline: any = null;
    let markerList: any[] = [];
    const getData = async () => {
      if (!filter.value.vehgroup) return;
      const info = {
        plate: filter.value.vehgroup.plate,
        vehicleId: filter.value.vehgroup.vehicleId,
        beginTime: filter.value.startTime,
        endTime: filter.value.endTime,
        filterTime: filter.value.restTime,
        // spaceTime: 30,
      };
      loading.value = true;
      try {
        const { obj, flag, msg } = await API.listVehTrackPoint(info);

        if (flag !== 1) {
          errData.errFlag = true;
          errData.errMsg = msg;
          throw Error(msg);
        }

        let posList: { lat: number; lon: number; tag: number }[] = [];
        const arrData: ({ index: number } & carType &
          ElementOf<
            APIType.listVehTrackPointRes["obj"]["data"]["trackList"]
          >)[] = [];
        obj.data.trackList.forEach((item: any, index: number) => {
          if (item.a !== 0 || item.o !== 0) {
            // 过滤a或o为0的定位异常数据
            item.index = index + 1;
            item.vehType = obj.data.terminalType;
            item.plate = obj.data.plate;
            item.groupName = obj.data.groupName;
            item.longStayTer = obj.data.longStayTer;
            item = new carUtil().handlerMongo(item);
            posList.push({
              lat: item.a,
              lon: item.o,
              tag: item.index,
            });
            arrData.push(item);
          }
        });

        basicData.value = arrData; // 表格数据
        polyline = mapControl.value.drawOriginLine(arrData); // 绘制轨迹
        pagination.total = arrData.length;
        playbackTotal.value = pagination.total;
        emit("update:mileageData", {
          start: arrData[0].g,
          end: arrData[arrData.length - 1].g,
        });

        await getAddress(posList); // 获取地址

        // 覆盖物集合
        markerList = [];
        // 绘制起点 终点
        if (obj.data.trackList.length) {
          const startMarker = mapControl.value.createMarker(
            {
              image: require("@/assets/img/playback/track_start.png"),
              width: 32,
              height: 32,
              offsetW: props.mapType === "Bmap" ? 0 : -16,
              offsetH: props.mapType === "Bmap" ? 0 : -16,
              lat: obj.data.trackList[0].a,
              lon: obj.data.trackList[0].o,
            },
            {
              type: "trackPoint",
              ...obj.data.trackList[0],
              address:
                addressList.value && (addressList.value[0] as any).address,
            }
          );
          const endMarker = mapControl.value.createMarker(
            {
              image: require("@/assets/img/playback/track_end.png"),
              width: 32,
              height: 32,
              offsetW: props.mapType === "Bmap" ? 0 : -16,
              offsetH: props.mapType === "Bmap" ? 0 : -16,
              lat: obj.data.trackList[obj.data.trackList.length - 1].a,
              lon: obj.data.trackList[obj.data.trackList.length - 1].o,
            },
            {
              type: "trackPoint",
              ...obj.data.trackList[obj.data.trackList.length - 1],
              address:
                addressList.value &&
                (addressList.value[obj.data.trackList.length - 1] as any)
                  .address,
            }
          );
          markerList.push(startMarker, endMarker);
        }

        // 绘制停车点
        obj.data.trackList.forEach((item: any, index: number) => {
          if (
            item.date.indexOf("~~") !== -1 &&
            index !== 0 &&
            index !== obj.data.trackList.length - 1
          ) {
            const marker = mapControl.value.createMarker(
              {
                image: item.hasNoLocation
                  ? require("@/assets/img/playback/track_park_noLocation.png")
                  : require("@/assets/img/playback/track_park.png"),
                width: 16,
                height: 16,
                offsetW: props.mapType === "Bmap" ? 0 : -8,
                offsetH: props.mapType === "Bmap" ? 0 : -8,
                lat: item.a,
                lon: item.o,
              },
              {
                type: "trackPoint",
                ...item,
                address:
                  addressList.value &&
                  (addressList.value[index] as any).address,
              }
            );
            markerList.push(marker);
          }
        });
        setTimeout(() => {
          mapControl.value.setFitView(
            undefined,
            props.expand ? [0, 400, 0, 360] : [0, 400, 400, 360]
          );
        }, 500);

        if (!props.trackCheck) {
          mapControl.hide(polyline);
        }

        loading.value = false;
      } catch (error) {
        console.log(error);
        loading.value = false;
      }
    };

    // 表格行点击
    const handleClickRow = (row: any) => {
      // console.log(row);
      row.address = (addressList.value[row.index - 1] as {
        tag: number;
        address: string;
      }).address;
      mapControl.value.createSelectMarker(row);

      // 高亮
      (tableRef.value as any).setCurrentRow(row);
    };

    // 不定位数据详情
    const visible = ref(false);
    const detailTable = ref();
    const showDetail = (row: any) => {
      detailTable.value = row.extend.snp.map((item: any, index: any) => ({
        ...item,
        index: index + 1,
      }));
      visible.value = true;
    };

    // 表格滚动
    const tableRef = ref<HTMLCollectionOf<Element> | null>(null);
    const scrollToHeightLight = () => {
      // 很占用资源
      // const currentRow = basicData.value.find(
      //   ({ index }) => index === state.playIndex
      // );
      // (tableRef.value as any).setCurrentRow(currentRow);
      (tableRef.value as any).$el
        .getElementsByClassName("el-table__row")
        .forEach((item: any, index: number) => {
          item.classList.remove("current-row");
          if (
            pagination.pageSize * (pagination.current - 1) + index ===
            state.playIndex
          ) {
            item.classList.add("current-row");
          }
        });

      nextTick(() => {
        const actDom = (tableRef.value as any).$el.getElementsByClassName(
          "current-row"
        )[0];

        actDom && props.height > 80 && actDom.scrollIntoView();
      });
    };

    watchEffect(() => {
      pagination.current =
        Math.ceil(state.playIndex / pagination.pageSize) || 1;
      nextTick(() => {
        if (props.height > 80) {
          scrollToHeightLight();
        }
      });

      if (props.trackCheck) {
        polyline && mapControl.value.show(polyline);
        markerList.forEach((item: any) => {
          mapControl.value.show(item);
        });
      } else {
        polyline && mapControl.value.hide(polyline);
        markerList.forEach((item: any) => {
          mapControl.value.hide(item);
        });
      }

      watch(
        () => props.mapType,
        () => {
          basicData.value = [];
          pagination.total = 0;
        }
      );
    });

    const updatetablecontrol = <(val: any) => void>(
      inject("UPDATE_TABLECONTROL")
    );
    updatetablecontrol({
      showDetail: showDetail,
    });

    return {
      getHeight,
      basicData,
      addressList,
      ...toRefs(pagination),
      currentChange,
      pageSizeChange,
      detailTable,
      visible,
      showDetail,
      tableRef,
      handleClickRow,
      loading,
      ...toRefs(errData),
    };
  },
});
</script>
<style lang="less" scoped>
.playBackTable {
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

  &__errBox {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .iconfont {
      font-size: 60px;
      color: red;
      margin-bottom: 20px;
    }
  }
}
</style>
