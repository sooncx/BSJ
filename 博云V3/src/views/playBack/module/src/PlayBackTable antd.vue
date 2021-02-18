<template>
  <div class="playBackTable">
    <a-table
      :columns="tableColumns"
      :dataSource="basicData.slice((current-1)*pageSize, current*pageSize)"
      :rowKey="(row) => row.index"
      :pagination="false"
      :loading="loading"
      :customRow="handleClickRow"
      :scroll="{ y: getHeight, x: 1710 }"
      size="small"
      ref="tableRef"
    >
      <template #speed="{ text: speed, record }">
        {{ speed }}
        <span
          v-if="record.hasNoLocation"
          style="color: #e57511; cursor: pointer"
          @click="showDetail(record)"
          >（包含不定位数据）</span
        >
      </template>

      <template #address="{ record }">
        {{
          addressList[record.index - 1] && addressList[record.index - 1].address
        }}
      </template>
    </a-table>

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
      <a-table
        :data-source="detailTable"
        :pagination="false"
        :scroll="{ y: 500 }"
        :rowKey="(row) => row.index"
        size="small"
      >
        <a-table-column
          key="index"
          title="序号"
          data-index="index"
          width="60px"
        />
        <a-table-column
          key="devTime"
          title="时间"
          data-index="devTime"
          width="380px"
        />
        <a-table-column key="speed" title="速度(km/h)" data-index="speed" />
        <a-table-column key="isPos" title="是否定位">
          <template #default="{ record }">
            <a-tag :color="record.isPos ? 'orange' : 'red'">{{
              record.isPos ? "定位" : "不定位"
            }}</a-tag>
          </template>
        </a-table-column>
      </a-table>
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
} from "vue";
import CarUtil from "@/assets/js/carUtil";
import res from "./data";
import { Modal } from "@/components/Modal";
import { GetGeo } from "@/api/apiFn";
import { useStore } from "vuex";

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
  },
  components: { Modal },
  setup(props) {
    const { state } = useStore();
    const getHeight = computed(() => {
      return props.height;
    });
    const result = inject("result");
    watch(
      () => result,
      (val: any) => {
        console.log(val.value);
        const res = JSON.parse(JSON.stringify(val.value));
        getData(res);
      },
      {
        deep: true,
      }
    );

    const tableColumns = ref([
      {
        title: "序号",
        dataIndex: "index",
        key: "index",
        width: 50,
      },
      {
        title: "车牌",
        dataIndex: "plate",
        width: 130,
      },
      {
        title: "时间",
        dataIndex: "date",
        width: 180,
      },
      {
        title: "速度 km/h",
        dataIndex: "speed",
        width: 150,
        slots: { customRender: "speed" },
      },
      {
        title: "方向",
        dataIndex: "angle",
        width: 100,
      },
      {
        title: "里程",
        dataIndex: "mileage",
        width: 100,
      },
      {
        title: "部件状态",
        dataIndex: "componentStateTxt",
        width: 200,
      },
      {
        title: "位置",
        dataIndex: "address",
        width: 800,
        slots: { customRender: "address" },
      },
    ]);

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
    const basicData = ref([]);
    const getData = (res: any) => {
      pagination.total = res.obj.length;
      let posList: { lat: number; lon: number; tag: number }[] = [];
      res.obj.forEach((item: any, index: number) => {
        if (item.a !== 0 || item.o !== 0) {
          //过滤a或o为0的定位异常数据
          item.index = index + 1;
          item.vehType = res.extend.terminalType;
          item.plate = res.extend.plate;
          item.groupName = res.extend.groupName;
          item.longStayTer = res.extend.longStayTer;
          item = new CarUtil().handlerMongo(item);

          posList.push({
            lat: item.position.aMap.y,
            lon: item.position.aMap.x,
            tag: item["index"],
          });
        }
      });

      basicData.value = res.obj;
      getAddress(posList);
    };

    const mapControl = <any>inject("mapControl");
    // 表格行点击
    const handleClickRow = (record: any) => {
      return {
        onClick: (e: any) => {
          if (e.path[1].localName !== "tr") return;
          record.address = (addressList.value[record.index - 1] as {
            tag: number;
            address: string;
          }).address;
          mapControl.value.createSelectMarker(record);

          // 高亮
          for (
            let i = 0;
            i <
            (tableRef.value as any).$el.getElementsByClassName(
              "ant-table-row ant-table-row-level-0"
            ).length;
            i++
          ) {
            (tableRef.value as any).$el
              .getElementsByClassName("ant-table-row ant-table-row-level-0")
              [i].removeAttribute("style");
          }
          e.path[1].style.background = "#e6f4ff";
        },
      };
    };

    // 不定位数据详情
    const visible = ref(false);
    const detailTable = ref();
    const showDetail = (row: any) => {
      detailTable.value = row.extend.snp.map((item: any, index: any) => ({
        ...item,
        index: index,
      }));
      visible.value = true;
    };

    const tableRef = ref<HTMLCollectionOf<Element> | null>(null);
    const scrollToHeightLight = (playIndex: number) => {
      pagination.current = Math.ceil(playIndex / pagination.pageSize) || 1;
      if (props.height < 80) return;

      try {
        (tableRef.value as any).$el
          .getElementsByClassName("ant-table-row ant-table-row-level-0")
          .forEach((element: any) => {
            element.classList.remove("current-row");
            if (element.getAttribute('data-row-key') == playIndex) {
              element.classList.add("current-row");
              // 如果不在滚动区域内 则滚动到里面

              nextTick(() => {
                element.scrollIntoView();
              });

              throw Error();
            }
          });
      } catch (error) {
      }
    };

    // watchEffect(() => {
    //   const i = JSON.parse(JSON.stringify(state.playIndex));
    //   scrollToHeightLight(i);
    // })

    // watch(
    //   () => state.playIndex,
    //   (val) => {
    //     pagination.current = Math.ceil(val / pagination.pageSize);
    //     scrollToHeightLight();
    //   }
    // );

    const updatetablecontrol = <(val: any) => void>(
      inject("UPDATE_TABLECONTROL")
    );
    updatetablecontrol({
      showDetail: showDetail,
    });

    return {
      getHeight,
      tableColumns,
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
}

::v-deep(.current-row) {
  background: #e6f4ff;
}
</style>
