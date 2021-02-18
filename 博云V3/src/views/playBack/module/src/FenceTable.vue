<template>
  <div class="alarmTable">
    <el-table
      :data="tableData"
      :height="height - 64"
      :max-height="height - 64"
      v-loading="loading"
      @row-click="handleClickRow"
    >
      <el-table-column prop="index" label="围栏名称">
        <template #default="{ row }">
          <span v-if="row['_type'] === 'polygon'">{{ row["pathName"] }}</span>
          <el-tag
            class="fenceTag"
            :type="row['_type'] === 'polygon' ? 'primary' : 'warning'"
            size="mini"
            disable-transitions
            >{{ row["_typeTxt"] + "围栏" }}</el-tag
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  reactive,
  toRefs,
  inject,
  watch,
  watchEffect,
  Ref,
} from "vue";
import GPS from "@/assets/js/GPS";
import { filterType } from "../type";
import API from "@/api/playBack";
import APIType from "@/api/playBack/type";

export default defineComponent({
  props: {
    height: {
      type: Number as PropType<number>,
      default: 257,
    },
    fenceCheck: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    mapType: {
      type: String as PropType<string>,
      default: "Bmap",
    },
  },
  setup(props) {
    const tableData = ref();
    const filter = <Ref<filterType>>inject("filter");
    const mapControl = <any>inject("mapControl");
    const updateinfowindowdata = <(val: { type: string; data: any }) => void>(
      inject("UPDATE_INFOWINDOWDATA")
    );

    watch(
      () => filter,
      (val) => {
        getData();
      },
      {
        deep: true,
      }
    );

    let PolygonList: any[] = [];
    let CircleMaker: any = null;
    const loading = ref(false);
    const getData = async () => {
      if (!filter.value.vehgroup) return;
      loading.value = true;
      // 获取多边形围栏
      const { obj } = await API.queryPolygonalFence({
        vehicleId: filter.value.vehgroup.vehicleId,
      });

      let list: any[] = [];
      PolygonList = [];
      obj&&obj.map((item, index) => {
        const cObj = {
          _type: "polygon",
          _typeTxt: "多边形",
          index: index,
          ...item,
        };
        PolygonList.push(mapControl.value.createPolygon(item.pointList));
        list = list.concat(cObj);
      });

      // 获取圆形围栏
      try {
      } catch (error) {}
      const data = await API.queryRoundFence({
        vehicleId: filter.value.vehgroup.vehicleId,
      });
      if ("obj" in data) {
        const res = data.obj;
        let circleFence = {
          ...res,
          _type: "circle",
          _typeTxt: "圆形",
          pathId: "_circle",
        };

        CircleMaker = mapControl.value.createCircle(circleFence);
        list.push(circleFence);
      }

      tableData.value = list;

      if (!props.fenceCheck) {
        CircleMaker&&CircleMaker.hide();
        PolygonList.forEach((item: any) => {
          mapControl.value.hide(item);
        });
      }
      loading.value = false;
    };

    watchEffect(() => {
      if (props.fenceCheck) {
        CircleMaker && mapControl.value.show(CircleMaker);
        PolygonList.forEach((item: any) => {
          mapControl.value.show(item);
        });
      } else {
        CircleMaker && mapControl.value.hide(CircleMaker);
        PolygonList.forEach((item: any) => {
          mapControl.value.hide(item);
        });
      }
      watch(
        () => props.mapType,
        () => {
          tableData.value = [];
        }
      );
    });

    const handleClickRow = (row: any) => {
      if (row._type === "polygon") {
        const point =
          props.mapType === "Bmap"
            ? mapControl.value.getPoints(PolygonList[row.index], "polygon")
            : PolygonList[row.index];
        mapControl.value.setFitView(point, [0, 0, props.height, 0]);
      } else if (row._type === "circle") {
        const point =
          props.mapType === "Bmap"
            ? mapControl.value.getPoints(CircleMaker, "circle")
            : CircleMaker;
        mapControl.value.setFitView(point, [0, 0, props.height, 0]);
      }
    };

    return {
      tableData,
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
