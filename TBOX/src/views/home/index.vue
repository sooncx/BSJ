<template>
  <div class="home">
    <!-- 背景开始 -->
    <DynamicArea />
    <!-- 背景结束 -->

    <el-row class="home__upside">
      <el-col
        class="home__item"
        :span="5"
        :xl="3"
      >
        <CountDto
          :homeCountDto="homeCountDto"
          :homeVehicleDto="homeVehicleDto"
        />
      </el-col>
      <el-col
        class="home__item"
        :span="11"
        :xl="13"
      >
        <HeatMap />
      </el-col>
      <el-col
        class="home__item"
        :span="8"
        :xl="8"
      >
        <Card title="NOx排放量(kg)排行榜">
          <transition-group
            name="el-fade-in"
            mode="out-in"
          >
            <RankList
              :key="0"
              v-show="homeNoxRankDtoList.length"
              :options="homeNoxRankDtoList"
              color="linear-gradient(90deg,rgba(111,255,209,1),rgba(32,211,154,1))"
              textColor="rgba(33,212,155,1)"
            />
            <Empty
              :key="1"
              v-show="!homeNoxRankDtoList.length"
            />
          </transition-group>
        </Card>
      </el-col>
    </el-row>

    <el-row class="home__underside">
      <el-col
        class="home__item"
        :span="8"
      >
        <div class="tab">
          <div class="tab__nav">
            <div
              class="tab__item"
              :class="{tab__item_on: activeName === item.value}"
              v-for="item in tabList"
              :key="item.value"
              @click="handleTabItemClick(item.value)"
            >{{item.label}}</div>
          </div>
          <div class="tab__content">
            <transition-group
              name="el-fade-in"
              mode="in-out"
            >
              <pie-chart
                v-if="tabChartOptions.some(({value}) => value)"
                key="0"
                :options="tabChartOptions"
                class="home__chart"
              />
              <Empty
                v-else
                key="1"
              />
            </transition-group>
          </div>
        </div>
      </el-col>
      <el-col
        class="home__item"
        :span="8"
      >
        <Card :title="`车辆信息(总:${homeVehicleDto.totalNum || 0})`">
          <transition-group
            name="el-fade-in"
            mode="out-in"
          >
            <pie-chart
              key="0"
              v-if="vehInfoChartOptions.some(({value}) => value)"
              :options="vehInfoChartOptions"
              class="home__chart"
            />
            <Empty
              v-else
              key="1"
            />
          </transition-group>
        </Card>
      </el-col>
      <el-col
        class="home__item"
        :span="8"
      >

        <Card>
          <div
            slot="title"
            style="display: flex"
          >
            长期不在线
            <el-button
              @click="$API.exportOfflineReport(getOfflineReportParams)"
              type="text"
              size="medium"
              icon="iconfont icon-export"
              class="export-btn"
            />
          </div>

          <transition-group
            name="el-fade-in"
            mode="out-in"
          >
            <RankList
              key="0"
              v-show="homeOfflineDtoList.length"
              :options="homeOfflineDtoList"
              color="linear-gradient(87deg,rgba(42,131,222,1),rgba(80,159,240,1))"
              textColor="rgba(42,131,222,1)"
            />
            <Empty
              key="1"
              v-show="!homeOfflineDtoList.length"
            />
          </transition-group>
        </Card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PieChart from "@/components/PieChart/index.vue";
import Empty from "@/components/Empty/index.vue";
import Card from "./Card.vue";
import CountDto from "./CountDto.vue";
import DynamicArea from "./DynamicArea.vue";
import RankList from "./RankList.vue";
import HeatMap from "./HeatMap.vue";

export default {
  name: "home",
  components: {
    PieChart,
    Empty,
    Card,
    CountDto,
    DynamicArea,
    RankList,
    HeatMap
  },

  data() {
    return {
      homeNoxRankDtoList: [],
      homeOfflineDtoList: [],
      homeCountDto: {},
      homeAlarmDto: {},
      homeVehicleDto: {},
      homeTypeDto: {},
      tabChartOptions: [],
      vehInfoChartOptions: [],
      tabList: [
        { label: "故障类型", value: "fault" },
        { label: "排放类型", value: "emission" },
        { label: "车辆类型", value: "vehType" }
      ],
      activeName: "fault",
      //获取离线报表参数
      getOfflineReportParams: {
        sortType: 2,
        beginTimeMin: 7 * 24 * 60,
        endTimeMin: 7 * 99999 * 60,
        pageSize: 200,
        pageNumber: 1
      }
    };
  },

  mounted() {
    //获取首页数据
    this.getHomeData();
    //获取离线报表数据
    this.getOfflineReport();
  },

  methods: {
    async handleTabItemClick(value) {
      this.activeName = value;
      const {
        busNum = 0, //	公交车数量
        emissionStandardFiveNum = 0, //	国五标准数
        emissionStandardFourNum = 0, //	国四标准数
        emissionStandardSixANum = 0, //	国六a标准数
        emissionStandardThreeNum = 0, //	国三标准数
        otherCarNum = 0, //	其他车辆数
        passengerCarNum = 0, //	客车数
        touristBusNum = 0, //	旅游大巴数
        truckNum = 0, //	货车数
        sanitationTruckNum = 0, //	环卫车数量
        mailVanNum = 0, //	邮政车类型
        partCarNum = 0, //	渣土车
        schoolBusNum = 0 //	校车
      } = this.homeTypeDto;

      const {
        abnormalUreaAndOilConsumeNum = 0, //	Nox排放不合格数
        noxEmissionsNotStandNum = 0, //	Nox排放不合格
        ureaTankEmptyNum = 0 //	尿素箱空数量
      } = this.homeAlarmDto;

      let options;
      switch (value) {
        //故障类型
        case "fault":
          options = [
            {
              value: abnormalUreaAndOilConsumeNum,
              name: "尿素/燃油消耗比异常",
              color: "#DE5900"
            },
            {
              value: noxEmissionsNotStandNum,
              name: "Nox排放不合格",
              color: "#FF781D"
            },
            { value: ureaTankEmptyNum, name: "尿素箱空", color: "#FF9853" }
          ];
          break;
        //排放类型
        case "emission":
          options = [
            { value: emissionStandardThreeNum, name: "国三", color: "#8DC3FF" },
            { value: emissionStandardFourNum, name: "国四", color: "#68B0FF" },
            { value: emissionStandardFiveNum, name: "国五", color: "#3F9BFF" },
            { value: emissionStandardSixANum, name: "国六", color: "#3F9BFF" }
          ];
          break;
        //车辆类型
        case "vehType":
          options = [
            { value: truckNum, name: "货车", color: "rgba(211,178,22,1)" },
            {
              value: passengerCarNum,
              name: "客车",
              color: "rgba(157,60,189,1)"
            },
            { value: schoolBusNum, name: "校车", color: "rgba(101,18,195,1)" },
            { value: busNum, name: "公交车", color: "rgba(18,80,195,1)" },
            {
              value: sanitationTruckNum,
              name: "环卫车",
              color: "rgba(76,203,193,1)"
            },
            { value: mailVanNum, name: "邮政车", color: "rgba(2,131,201,1)" },
            { value: partCarNum, name: "渣土车", color: "rgba(229,133,108,1)" },
            {
              value: touristBusNum,
              name: "旅游大巴",
              color: "rgba(195,43,18,1)"
            },
            {
              value: otherCarNum,
              name: "其他车辆",
              color: "rgba(18,195,118,1)"
            }
          ];
          break;
      }
      this.tabChartOptions = options;
    },
    //处理车辆信息
    handleVehDto(homeVehicleDto) {
      this.homeVehicleDto = homeVehicleDto;
      const {
        dormantNum = 0, //	休眠数
        neverNum = 0, //从未上线数
        offlineNum = 0, //	离线数
        onlineNum = 0 //	在线数
      } = homeVehicleDto;

      this.vehInfoChartOptions = [
        { value: onlineNum, name: "在线", color: "#47E665" },
        { value: dormantNum, name: "休眠", color: "#0862C4" },
        { value: offlineNum, name: "离线", color: "#ACB9C6" },
        { value: neverNum, name: "从未上线", color: "#6B757E" }
      ];
    },
    //获取离线报表
    async getOfflineReport() {
      const { data = [] } = await this.$API.getOfflineReport(
        this.getOfflineReportParams
      );
      //处理周离线排行 list数据
      this.homeOfflineDtoList = Object.freeze(
        data.map(({ plate, offlineTime, offlineMinutes }) => ({
          label: plate,
          text: offlineTime,
          percentage:
            Math.abs(offlineMinutes / data[0].offlineMinutes) * 100
        }))
      );
    },
    //获取首页数据
    async getHomeData() {
      const { data } = await this.$API.all();
      const {
        homeCountDto = {},
        homeNoxRankDtoList = [],
        homeTypeDto = {},
        homeVehicleDto = {},
        homeAlarmDto = {}
      } = data;

      //处理左上统计数据
      this.homeCountDto = Object.freeze(homeCountDto);
      //处理Nox list数据
      this.homeNoxRankDtoList = Object.freeze(
        homeNoxRankDtoList.map(({ plate, noxEmissionCount }) => ({
          label: plate,
          text: noxEmissionCount.toString(),
          percentage:
            Math.abs(
              noxEmissionCount / homeNoxRankDtoList[0].noxEmissionCount
            ) * 100
        }))
      );
      //处理车辆类型
      this.homeTypeDto = Object.freeze(homeTypeDto);
      this.homeAlarmDto = Object.freeze(homeAlarmDto);
      this.handleTabItemClick(this.activeName);
      //处理车辆信息
      this.handleVehDto(homeVehicleDto);
    }
  }
};
</script>
<style lang="scss" scoped>
.home {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: 25px 45px;

  &__upside {
    margin-bottom: 15px;
    flex: 1;
    overflow: hidden;
    display: flex;
  }

  &__underside {
    display: flex;
    height: 30vh;
  }

  &__item {
    margin-left: 7.5px;
    margin-right: 7.5px;
    z-index: 1;
    border-radius: 10px;
    overflow: hidden;
  }

  &__chart {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

.tab {
  height: 100%;
  background-color: #ffffff;
  box-shadow: 0px 4px 8px 0px #00000021;
  display: flex;
  flex-direction: column;

  &__nav {
    display: flex;
  }

  &__item {
    height: 40px;
    padding: 0 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(240, 240, 240, 1);
    color: rgba(179, 179, 179, 1);
    cursor: pointer;

    &:hover {
      color: $primary;
    }

    &_on {
      color: $primary;
      background: #fff;
    }
  }

  &__content {
    flex: 1;
    overflow: hidden;
    position: relative;
  }
}

/deep/ .export-btn {
  padding: 0;
  margin-left: auto;

  i {
    font-size: 18px;
  }
}
</style>
