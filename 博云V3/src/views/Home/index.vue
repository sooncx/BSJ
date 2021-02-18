<template>
  <div class="Home">
    <div class="Home__header">
      <div class="Home__header__logo">
        <img src="../../assets/img/home/logo.png" alt="" />
        <i>
          BoYunCheLian Big data statistics
          <img src="../../assets/img/home/arrowR.png" alt="" />
        </i>
        <div class="Home__header__dateTime">
          <img src="../../assets/img/home/arrowR.png" alt="" />
          <span>{{ dateTime }}</span>
        </div>
      </div>
      <div class="Home__header__line">
        <img src="../../assets/img/home/line.png" alt="" />
      </div>
    </div>
    <div class="Home__content">
      <div class="Home__content__left">
        <div class="left-top">
          <div class="carCount">
            <div class="carCount__header">
              <p>平台车辆总数</p>
              <div :title="dataFilter(vehNum)">{{ dataFilter(vehNum) }}</div>
            </div>

            <div class="carCount__wait">
              <img src="../../assets/img/home/wait.png" alt="">
            </div>

            <div
              class="carCount__box"
              v-for="(item, index) in carList"
              :key="index"
            >
              <div class="box-left">
                <img :src="item.url" alt="" />
              </div>
              <div class="box-right">
                <div class="title" :title="item.title">
                  {{ item.title }}
                </div>
                <div class="others">
                  <!-- <p :title="dataFilter(898678)">{{ dataFilter(898678) }}</p> -->
                  <p>......</p>
                  <!-- <div>
                    <span title="较昨日">较昨日</span>
                    <div>
                      <Arrow
                        style="margin-left: -12px"
                        :width="4"
                        :height="18"
                        :type="item.newData > 0 ? 'up' : 'dowm'"
                        :color="item.newData > 0 ? 'green' : 'red'"
                      />
                    </div>
                    <span
                      :style="{ color: item.newData > 0 ? 'green' : 'red' }"
                      :title="Math.abs(item.newData)"
                      >{{ Math.abs(item.newData) }}</span
                    >
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="left-content">
          <Card
            title="车辆状态"
            button="查看详情"
            @buttonFn="showModal('vehState')"
          >
            <Chart v-model:options="list.devState" />
          </Card>
        </div>
        <div class="left-bottom">
          <Card title="待续费车辆">
            <Chart v-model:options="list.expiredData" />
          </Card>
        </div>
      </div>
      <div class="Home__content__content">
        <div class="content-top">
          <MapChart />
        </div>
        <div class="content-bottom">
          <Card title="新增车辆趋势数据">
            <template v-slot:button>
              <div
                style="position: absolute; right: 47px; top: 37px; z-index: 999"
              >
                <a-radio-group
                  size="small"
                  v-model:value="radioValue"
                  button-style="solid"
                >
                  <a-radio-button value="12" :style="{ fontSize: '12px' }">
                    12月
                  </a-radio-button>
                  <a-radio-button value="1" :style="{ fontSize: '12px' }">
                    30天
                  </a-radio-button>
                </a-radio-group>
              </div>
            </template>
            <HomeLineChart v-model:options="carTrendOptions" />
          </Card>
        </div>
      </div>
      <div class="Home__content__right">
        <div class="right-top">
          <Card title="实时警报">
            <ContentTable v-model:dataList="tableData.options" />
          </Card>
        </div>
        <div class="right-content">
          <Card title="设备种类">
            <div class="content">
              <div>
                <Chart v-model:options="list.devTypeOne" />
              </div>
              <div>
                <Chart v-model:options="list.devTypeTwo" />
              </div>
            </div>
          </Card>
        </div>
        <div class="right-bottom">
          <Card title="结清车辆">
            <Chart v-model:options="list.settleData" />
          </Card>
        </div>
      </div>
    </div>
  </div>

  <!-- 车辆状态详情 -->
  <DetailModal v-model:visible="visible" :type="modalType" />
</template>

<script lang="ts">
import {
  reactive,
  defineComponent,
  defineAsyncComponent,
  ref,
  toRefs,
  nextTick,
  watchEffect,
} from "vue";
import day from "dayjs";
import API from "@/api/home";
import MAPI from "@/api/monitorCenter";
import APIType from "@/api/home/type";

interface pieChartType {
  value: number;
  name: string;
  color?: string;
}

export default defineComponent({
  components: {
    ContentTable: defineAsyncComponent(
      () => import("./module/ContentTable.vue")
    ),
    Arrow: defineAsyncComponent(
      () => import("../../components/Arrow/index.vue")
    ),
    Card: defineAsyncComponent(() => import("../../components/Card/Card.vue")),
    Chart: defineAsyncComponent(
      () => import("../../components/Chart/src/Chart.vue")
    ),
    DetailModal: defineAsyncComponent(() => import("./module/DetailModal.vue")),
    MapChart: defineAsyncComponent(
      () => import("../../components/Chart/src/MapChart.vue")
    ),
    HomeLineChart: defineAsyncComponent(
      () => import("../../components/Chart/src/HomeLineChart.vue")
    ),
  },
  methods: {
    day,
    test() {
      console.log("cardConfirm");
    },
  },
  setup() {
    document.title = '博云车联-首页';
    const radioValue = ref("12");
    const carTrend = reactive({
      carTrendOptions: {
        left: "25px",
        right: "30px",
        top: "50px",
        bottom: "10px",
        Xdata: [1, 2, 3, 4, 5, 6, 7],
        Ydatas: [
          {
            name: "加车量",
            unit: "台",
            areaColor: "#005AFD",
            lineColor: "#005AFD",
            pointColor: "#005AFD",
            data: [122, 23, 3314, 425, 156, 67, 78],
          },
          {
            name: "结清量",
            unit: "台",
            areaColor: "#04AAE1",
            lineColor: "#04AAE1",
            pointColor: "#04AAE1",
            data: [21, 32, 4213, 54, 635, 76, 87],
          },
          {
            name: "激活量",
            unit: "台",
            areaColor: "#0BA91D",
            lineColor: "#0BA91D",
            pointColor: "#0BA91D",
            data: [1, 1232, 31, 4, 5231, 6, 7],
          },
        ],
      },
      xthirtyDay: <any[]>[],
      xtwelveMonth: <any[]>[],
      thirtyDayMap: <any[]>[],
      twelveMonthMap: <any[]>[],
    });
    watchEffect(() => {
      console.log(radioValue.value);
      if (radioValue.value === "12") {
        carTrend.carTrendOptions.Xdata = carTrend.xtwelveMonth;
        carTrend.carTrendOptions.Ydatas[0].data = carTrend.twelveMonthMap[0];
        carTrend.carTrendOptions.Ydatas[1].data = carTrend.twelveMonthMap[1];
        carTrend.carTrendOptions.Ydatas[2].data = carTrend.twelveMonthMap[2];
      } else {
        carTrend.carTrendOptions.Xdata = carTrend.xthirtyDay;
        carTrend.carTrendOptions.Ydatas[0].data = carTrend.thirtyDayMap[0];
        carTrend.carTrendOptions.Ydatas[1].data = carTrend.thirtyDayMap[1];
        carTrend.carTrendOptions.Ydatas[2].data = carTrend.thirtyDayMap[2];
      }
    });

    const tableData = reactive({
      options: {
        label: [
          {
            name: "车牌号",
            prop: "P",
          },
          {
            name: "车组",
            prop: "N",
          },
          {
            name: "报警类型",
            prop: "T",
          },
          {
            name: "时间",
            prop: "D",
          },
        ],
        data: [],
      },
    });
    const carData = reactive({
      carList: [
        {
          url: require("../../assets/img/home/car.png"),
          title: "报警车辆数",
          count: 2984,
          newData: 1245,
        },
        {
          url: require("../../assets/img/home/time.png"),
          title: "预备/已过期车辆",
          count: 2984,
          newData: -1245,
        },
      ],
    });
    const carCounts = ref(777);
    const list = reactive({
      devState: <pieChartType[]>[], // 设备状态
      devTypeOne: <pieChartType[]>[], // 设备种类1
      devTypeTwo: <pieChartType[]>[], // 设备种类2
      expiredData: <pieChartType[]>[], // 待续费车辆
      settleData: <pieChartType[]>[], // 结清数量
    });

    const data = reactive({
      vehNum: 0, // 车辆总数量
    });
    const getData = async () => {
      const { obj, msg, flag } = await API.pageHomePageOne();
      const pageTwo = await API.pageHomePageTwo();

      if (flag === 1) {
        console.log(obj);
        data.vehNum = obj.vehNum;

        // 车辆状态
        list.devState = [
          {
            value: obj.onLineNum,
            name: `在线`,
            color: "#0BA91D",
          },
          {
            value: obj.neverOnLine,
            name: `从未上线`,
            color: "#E19604",
          },
          {
            value: obj.offLineNum,
            name: `离线`,
            color: "#6D6D6D",
          },
        ];

        // 待续费车辆
        list.expiredData = [
          {
            value: obj.expiredThreeNum,
            name: `三天到期`,
            color: "#04AAE1",
          },
          {
            value: obj.expiredTwoNum,
            name: `七天到期`,
            color: "#9604E1",
          },
          {
            value: obj.expiredOneNum,
            name: `一个月到期`,
            color: "#E19604",
          },
          {
            value: obj.expiredFourNum,
            name: `已过期`,
            color: "#6d6d6d",
          },
        ];

        // 设备种类
        list.devTypeOne = [
          {
            value: obj.wiredNum,
            name: `有线设备`,
          },
          {
            value: obj.wirelessNum,
            name: `无线设备`,
          },
        ];

        list.devTypeTwo = obj.typeList.map((item, index) => ({
          value: item.num,
          name: item.nameType,
        }));

        // 结清数量
        list.settleData = [
          {
            value: pageTwo.obj.settleNum,
            name: `结清数`,
          },
          {
            value: obj.vehNum - pageTwo.obj.settleNum,
            name: `未结清`,
          },
        ];

        // 新增车辆趋势数据--12个月
        let twelveMontaddNum: number[] = [];
        let twelveMontsettleNum: number[] = [];
        let twelveMontactiveNum: number[] = [];
        let twelveMontxData: any[] = [];

        Object.keys(obj.twelveMonthMap[0])
          .sort()
          .forEach((key) => {
            twelveMontxData.push(key);
            twelveMontaddNum.push(obj.twelveMonthMap[0][key]);
          });
        Object.keys(obj.twelveMonthMap[1])
          .sort()
          .forEach((key) => {
            twelveMontsettleNum.push(obj.twelveMonthMap[1][key]);
          });
        Object.keys(obj.twelveMonthMap[2])
          .sort()
          .forEach((key) => {
            twelveMontactiveNum.push(obj.twelveMonthMap[2][key]);
          });

        carTrend.xtwelveMonth = twelveMontxData;
        carTrend.twelveMonthMap = [
          twelveMontaddNum,
          twelveMontsettleNum,
          twelveMontactiveNum,
        ];

        // 新增车辆趋势数据--30天
        let thirtyDayaddNum: number[] = [];
        let thirtyDaysettleNum: number[] = [];
        let thirtyDayactiveNum: number[] = [];
        let thirtyDayxData: any[] = [];

        Object.keys(obj.thirtyDayMap[0])
          .sort()
          .forEach((key) => {
            thirtyDayxData.push(key);
            thirtyDayaddNum.push(obj.thirtyDayMap[0][key]);
          });
        Object.keys(obj.thirtyDayMap[1])
          .sort()
          .forEach((key) => {
            thirtyDaysettleNum.push(obj.thirtyDayMap[1][key]);
          });
        Object.keys(obj.thirtyDayMap[2])
          .sort()
          .forEach((key) => {
            thirtyDayactiveNum.push(obj.thirtyDayMap[2][key]);
          });

        carTrend.xthirtyDay = thirtyDayxData;
        carTrend.thirtyDayMap = [
          thirtyDayaddNum,
          thirtyDaysettleNum,
          thirtyDayactiveNum,
        ];
      }
    };
    getData();

    const getAlarm = async () => {
      const params = {
        //dayJs(new Date()).format("YYYY-MM-DD HH:mm:ss")
        updateTime: "",
        alarmPermission: 0,
      };
      const { obj } = await MAPI.queryAlarm(params);
      tableData.options.data = obj.alarm;
    };

    getAlarm();

    function dataFilter(data: string | number) {
      if (typeof data === "number") return data.toLocaleString();
      return parseFloat(data).toLocaleString();
    }
    // 弹窗详情
    const visible = ref(false);
    const modalType = ref("");

    const showModal = (type: string) => {
      console.log("打开弹窗");
      visible.value = true;
      modalType.value = type;
    };

    const dateTime = ref(day(new Date()).format("YYYY-MM-DD hh:mm:ss A"));
    let timer: any = null;
    let dataTimer: any = null;
    nextTick(() => {
      clearInterval(timer);
      timer = setInterval(() => {
        dateTime.value = day(new Date()).format("YYYY-MM-DD hh:mm:ss A");
      }, 1000);
      clearInterval(dataTimer);
      dataTimer = setInterval(() => {
        getData();
        getAlarm();
      }, 1000 * 60 * 10);
    });

    return {
      list,
      showModal,
      carCounts,
      dataFilter,
      tableData,
      ...toRefs(carTrend),
      ...toRefs(carData),
      ...toRefs(data),
      radioValue,
      visible,
      modalType,
      dateTime,
    };
  },
});
</script>
<style lang="less" scoped>
@import "./home.less";
</style>