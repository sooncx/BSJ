<template>
  <template v-for="(item, index) in arr" :key="index">
    <div class="trendChart">
      <h3 class="trendChart__title">
        {{
          item.type === "insurance"
            ? "保险到期近七天趋势图"
            : item.type === "maintain"
            ? "保养到期近七天趋势图"
            : item.type === "electric"
            ? "剩余电量提醒近七天趋势图"
            : item.type === "expire"
            ? "到期续费近七天趋势图"
            : ""
        }}
      </h3>

      <!-- 图表 -->
      <div class="trendChart__chart">
        <LineChart
          :itemColor="
            item.type === 'insurance'
              ? '#0E9CFF'
              : item.type === 'maintain'
              ? '#DFB014'
              : item.type === 'electric'
              ? '#1DD4DB'
              : item.type === 'expire'
              ? '#450EFF'
              : ''
          "
          :areaColor="
            item.type === 'insurance'
              ? '#CEEAFF'
              : item.type === 'maintain'
              ? '#F8EECF'
              : item.type === 'electric'
              ? '#D1F6F7'
              : item.type === 'expire'
              ? '#D9CEFF'
              : ''
          "
          :data="item.chartData"
        />
      </div>

      <!-- 数据列表 -->
      <div class="trendChart__numData">
        <div class="trendChart__numData__title">
          {{
            item.type === "insurance"
              ? `保险到期数（${item.total}）`
              : item.type === "maintain"
              ? `保养到期数（${item.total}）`
              : item.type === "electric"
              ? `剩余电量提示数（${item.total}）`
              : item.type === "expire"
              ? `到期续费提示数（${item.total}）`
              : ""
          }}
          <a-button type="link" @click="showMdal('viewall', item.type)"
            >查看全部</a-button
          >
        </div>

        <ul class="trendChart__numData__data">
          <template v-if="item.data.length !== 0">
            <li
              v-for="(items, index) in item.data"
              :key="index"
              ref="numDataRef"
            >
              <div>
                <i
                  class="iconfont"
                  :class="
                    item.type === 'insurance'
                      ? 'icon-baodan'
                      : item.type === 'maintain'
                      ? 'icon-daoqi'
                      : item.type === 'electric'
                      ? 'icon-didianliang'
                      : item.type === 'expire'
                      ? 'icon-xufei'
                      : ''
                  "
                  :style="{
                    color:
                      item.type === 'insurance'
                        ? '#0E60DB'
                        : item.type === 'maintain'
                        ? '#DFB014'
                        : item.type === 'electric'
                        ? '#1DD4DB'
                        : item.type === 'expire'
                        ? '#450EFF'
                        : '',
                  }"
                ></i>
                <div class="dataMsg">
                  <h5>
                    <p :title="items.plate">车牌：{{ items.plate }}</p>
                    <span
                      class="status status--insurance"
                      v-if="item.type === 'insurance'"
                      >{{ items.type === 1 ? "首保" : "非首保" }}</span
                    >
                    <span
                      class="status status--electric"
                      v-if="item.type === 'electric'"
                      >电量:{{ items.type }}</span
                    >
                    <span
                      class="status status--expire"
                      v-if="item.type === 'expire'"
                      >{{ items.state === 1 ? "已过期" : "即将过期" }}</span
                    >
                  </h5>
                  <p>车组：{{ items.groupName }}</p>
                  <p v-if="item.type === 'expire'">
                    到期时间：{{ items.expireDate }}
                  </p>
                  <p v-if="item.type === 'insurance'">
                    下次续保日：{{ items.nestTimeInsuranceTime }}
                  </p>
                  <p
                    v-if="item.type === 'maintain' || item.type === 'electric'"
                  >
                    设备号：{{ items.terminalNo }}
                  </p>
                </div>
              </div>
              <a-button
                type="primary"
                size="small"
                @click="showMdal('detail', item.type, items)"
                ><template #icon><SearchOutlined /></template><span class="detailText">详情</span></a-button>
            </li>
          </template>
          <template v-else>
            <Empty />
          </template>
        </ul>
      </div>
    </div>
  </template>
  <TrendModal
    v-model:visible="visible"
    :type="modalType"
    :trendType="trendType"
    :row="row"
  />
</template>
<script lang="ts">
import {
  ref,
  defineAsyncComponent,
  defineComponent,
  reactive,
  toRefs,
  nextTick,
  provide,
} from "vue";
import { LineChart } from "@/components/Chart/index";
import { SearchOutlined } from "@ant-design/icons-vue";
import API from "@/api/riskControlCenter/";

export default defineComponent({
  name: "trendChart",
  components: {
    SearchOutlined,
    LineChart,
    TrendModal: defineAsyncComponent(() => import("./TrendModal.vue")),
    Empty: defineAsyncComponent(() => import("@/components/Empty/index.vue")),
  },
  setup() {
    const arr = ref([
      {
        type: "insurance",
        chartData: [0, 0, 0, 0, 0, 0, 0],
        data: [],
        total: 0,
      },
      {
        type: "maintain",
        chartData: [0, 0, 0, 0, 0, 0, 0],
        data: [],
        total: 0,
      },
      {
        type: "electric",
        chartData: [0, 0, 0, 0, 0, 0, 0],
        data: [],
        total: 0,
      },
      {
        type: "expire",
        chartData: [0, 0, 0, 0, 0, 0, 0],
        data: [],
        total: 0,
      },
    ]);

    const getChart = () => {
      arr.value.forEach(async (item) => {
        const { obj } =
          item.type === "expire"
            ? await API.getRenewRiskNum()
            : item.type === "insurance"
            ? await API.getInsuranceRiskNum()
            : item.type === "maintain"
            ? await API.getMaintainRiskNum()
            : {
                obj: {
                  data: {
                    firstData: 0,
                    secondData: 0,
                    thirdData: 0,
                    fourthData: 0,
                    fifthData: 0,
                    sixthData: 0,
                    seventhData: 0,
                  },
                },
              };

        item.chartData = [
          obj.data.seventhData,
          obj.data.sixthData,
          obj.data.fifthData,
          obj.data.fourthData,
          obj.data.thirdData,
          obj.data.secondData,
          obj.data.firstData,
        ];
      });
    };
    nextTick(() => {
      getChart();
      getData();
    });

    const getData = async () => {
      arr.value.forEach(async (item) => {
        const info = {
          pageSize: 3,
          pageNumber: 1,
        };
        const { obj } =
          item.type === "expire"
            ? await API.getRenewRiskData(info)
            : item.type === "insurance"
            ? await API.getInsuranceRiskData(info)
            : item.type === "maintain"
            ? await API.getMaintainRiskData(info)
            : {
                obj: {
                  data: [],
                  total: 0,
                },
              };
        item.data = obj.data;
        item.total = obj.total;
      });
    };

    const trendData = reactive({
      visible: false,
      modalType: "",
      trendType: "",
      row: null,
    });

    const showMdal = (modalType: string, trendType: string, row: any) => {
      trendData.visible = true;
      trendData.modalType = modalType;
      trendData.trendType = trendType;
      row && (trendData.row = row);
    };

    // 更新续费数据
    const updateEXpire = async () => {
      const info = {
        pageSize: 3,
        pageNumber: 1,
      };
      const { obj } = await API.getRenewRiskData(info);

      arr.value[3].data = obj.data;
      arr.value[3].total = obj.total;
    };

    // 注入更新方法
    provide("updateTrendData", updateEXpire);

    return {
      arr,
      ...toRefs(trendData),
      showMdal,
      numDataRef: ref(""),
    };
  },
});
</script>
<style lang="less" scoped>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  border-radius: 6px;
  width: 6px;
  background-color: rgba(144, 147, 153, 0.3);
  transition: background-color 0.3s;
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(144, 147, 153, 0.5);
}
::-webkit-scrollbar-thumb:active {
  background-color: rgba(144, 147, 153, 0.5);
}

.trendChart {
  width: 24.6%;
  height: 100%;
  background: #fff;
  padding: 15px;
  overflow: auto;

  &__title {
    font-size: 15px;
    font-family: Segoe UI, Segoe UI-Bold;
    font-weight: 700;
    text-align: left;
    color: #333333;
  }

  &__chart {
    border: 1px solid #d3dae3;
    height: 195px;
    width: 100%;
    margin: 10px 0;
  }

  &__numData {
    &__title {
      font-size: 15px;
      font-family: Segoe UI, Segoe UI-Bold;
      font-weight: 700;
      color: #333333;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &__data {
      display: flex;
      flex-flow: column;
      li {
        padding: 10px 3%;
        margin-top: 10px;
        background: #ffffff;
        border: 1px solid #d3dae3;
        display: flex;
        justify-content: space-between;
        align-items: center;
        > div {
          display: flex;
          align-items: center;
        }

        > button {
          margin-left: 5px;
        }
      }

      .iconfont {
        font-size: 22px;
      }

      .dataMsg {
        margin-left: 10px;

        h5 {
          font-size: 14px;
          font-family: PingFang SC, PingFang SC-Bold;
          font-weight: 700;
          text-align: left;
          color: #333333;
          display: flex;
          align-items: center;
          > p {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        > p {
          flex: 1;
          font-size: 12px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          text-align: left;
          color: #999999;
          margin-top: 7px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .status {
        padding: 4px 6px;
        font-size: 12px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        border-radius: 2px;
        margin-left: 6px;
        transform: scale(0.9);
        &--insurance {
          background: #e2eeff;
          color: #0e60db;
        }
        &--electric {
          background: #ffe8e8;
          color: #c51414;
        }
        &--expire {
          background: #e5e5e5;
          color: #666666;
        }
      }
    }
  }
}
::v-deep(.el-empty) {
  padding: 10px 0 0;
}

@media screen and (max-width: 1600px) {
  .detailText {
    display: none;
  }
}
</style>
