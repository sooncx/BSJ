<template>
  <!-- <el-scrollbar style="height:100%"> -->
  <section class="limitBuy">
    <div class="limitBuy__header">
      <h2 @click="visabled = true">额度购买</h2>
      <p>您可以在这里查看Key的每日调用量，还可以申请更高的调用次数</p>
    </div>

    <div class="limitBuy__container">
      <el-tabs
        style="background:#fff;padding:10px 20px 0 20px"
        v-model="tabActiveName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="(item, index) in tokenList"
          :key="index"
          :label="item.appName"
          :name="item.appType.toString()"
        ></el-tab-pane>
      </el-tabs>
      <div class="tableBox">
        <el-table
          :data="tableData"
          border
          style="min-width: 100%"
          height="100%"
          max-height="100%"
          class="limitBuy__table"
        >
          <!-- <el-table-column
          prop="appName"
          label="应用名称"
          align="center"
          header-align="center"
        >
        </el-table-column>-->
          <el-table-column
            prop="bindName"
            label="应用绑定名"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">{{scope.row.bindName || "--"}}</template>
          </el-table-column>
          <el-table-column
            prop="bindKey"
            label="key"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">{{scope.row.bindKey || "--"}}</template>
          </el-table-column>
          <el-table-column
            prop="bindUsername"
            label="绑定账号"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">{{scope.row.bindUsername || "--"}}</template>
          </el-table-column>
          <el-table-column
            prop="comboType"
            label="套餐类型"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">{{scope.row.comboType === 1?"包月":scope.row.comboType === 2?
            "按量":"--"}}</template>
          </el-table-column>
          <el-table-column
            label="使用情况"
            align="center"
            header-align="center"
            min-width="170px"
          >
            <template slot-scope="scope">
              配额已用：
              <span class="red">
                {{scope.row.invokeNum ?
              ((scope.row.invokeNum / scope.row.invokeNumLimit) * 100).toFixed(2) : 0}}%
              </span>
              {{scope.row.comboType === 1?'(上限：'+scope.row.invokeNumLimit+'次/天)':
            '(上限：'+(scope.row.invokeNumLimit || 0)+'次)'}}
              <!-- <div class="item">
              <div class="grey">
                配额已用：
                <span class="red">
                  {{scope.row.dayLimitUsage ? scope.row.dayLimitUsage * 100 : 0}}%
                </span>
                (上限：{{scope.row.dayLimit}}次/天)
              </div>
              <div class="grey">
                并发峰值：
                <span class="green">{{scope.row.qpsPeakOfDay}}QPS</span>
                (上限：{{scope.row.qpsLimit}}QPS)
              </div>
            </div>-->
            </template>
          </el-table-column>
          <!-- <el-table-column prop="num" label="在线购买情况" align="center" header-align="center">
          <template>
            <div class="item">
              <div class="grey">
                题额套餐：
                <span class="black">未开通</span>(支持10.00万次)
              </div>
              <div class="grey">
                并发套餐：
                <span class="black">1000元</span>(上限：50QPS)
              </div>
            </div>
          </template>
        </el-table-column>-->
          <el-table-column
            label="操作"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              <i
                v-if="isRenew()"
                class="iconfont icon-shangsheng"
                @click="showRenew(scope.row)"
              ></i>
              <i
                class="iconfont icon-liuliang"
                @click="showChart(scope.row)"
              ></i>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="limitBuy__page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[50, 100, 300, 500]"
          :page-size.sync="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!-- <phoneDialog :visabled.sync="visabled" /> -->
    <renewDialog
      :visible.sync="visabled"
      :RENEWLIST.sync="remewList"
      :rowData.sync="renewData"
    />
    <el-dialog
      :visible.sync="chartVisabled"
      width="900px"
    >
      <template slot="title">
        <h3 style="text-align:left;font-weight:400">使用量统计</h3>
        <div class="line"></div>
      </template>
      <div class="chart_container">
        <div class="chart_header">
          <span
            :class="{'active': activeName == 2}"
            @click="activeChange(2)"
          >配额统计</span>
          <span
            :class="{'active': activeName == 1}"
            @click="activeChange(1)"
          >并发统计</span>
        </div>
        <div class="chart_control">
          <el-select
            v-model="chartFilter.app"
            size="small"
            placeholder="应用"
            style="width:136px;"
            @change="handleAppChange"
          >
            <el-option
              v-for="(item,index) in appList"
              :key="index"
              :label="item.appName"
              :value="item.appId"
            ></el-option>
          </el-select>
          <el-select
            v-model="chartFilter.appBindUser"
            size="small"
            placeholder="应用绑定名"
            style="width:136px;"
          >
            <el-option
              v-for="(item,index) in appBindUserList"
              :key="index"
              :label="item.userAppName"
              :value="item.userAppId"
            ></el-option>
          </el-select>
          <el-select
            v-model="chartFilter.appServer"
            size="small"
            placeholder="应用服务"
            style="width:136px;"
            :disabled="appServerFlag"
          >
            <el-option
              v-for="(item,index) in appServerList"
              :key="index"
              :label="item.urlName"
              :value="item.appInterfaceId"
            ></el-option>
          </el-select>
          <el-date-picker
            v-model="filterTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable="false"
            size="small"
          ></el-date-picker>
          <div
            class="btn"
            @click="getChartData"
          >搜索</div>
        </div>
        <div class="chart_container">
          <div class="control">
            <el-radio-group
              v-model="chartFilter.date"
              size="mini"
              @change="selectTime"
            >
              <el-radio-button label="天"></el-radio-button>
              <el-radio-button label="周"></el-radio-button>
              <el-radio-button label="月"></el-radio-button>
              <el-radio-button label="年"></el-radio-button>
            </el-radio-group>
          </div>
          <div
            id="chartmain"
            style="width: 100%;height: 400px"
          ></div>
        </div>
      </div>
    </el-dialog>
  </section>
  <!-- </el-scrollbar> -->
</template>
<script>
import { mapMutations, mapState } from "vuex";
import echarts from "echarts";
import dayJs from "dayjs";
// import phoneDialog from "@/components/phoneDialog/index.vue";
import renewDialog from "./renewDialog.vue";

export default {
  components: {
    // phoneDialog,
    renewDialog
  },
  data() {
    return {
      chartVisabled: false,
      activeName: 2,
      activeId: null,
      tabActiveName: "1",
      visabled: false,
      filterTime: null,
      appList: [],
      appServerList: [],
      appBindUserList: [],
      value: "",
      tableData: [],
      currentPage: 1,
      pageSize: 50,
      total: 0,
      chartFilter: {
        app: "",
        appServer: "",
        appBindUser: "",
        time: [],
        date: "周"
      },
      charts: null,
      appId: null,
      remewList: [],
      renewData: null,
      userAppId: null,
      tokenList: null,
      appServerFlag: true
    };
  },
  mounted() {
    this.getList();
    this.getAppList();
    this.queryRoughAppInfo();
  },
  computed: {
    ...mapState(["DocMenu"])
  },
  watch: {
    $route: {
      handler(to) {
        if (to.name === "limitBuy") {
          this.getList();
          this.queryRoughAppInfo();
          this.getAllRenews();
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations(["COMMIT_DocTag", "COMMIT_RENEWLIST", "COMMIT_DocMenu"]),
    async getAllRenews() {
      const { obj } = await this.$API.getAllRenews();
      this.remewList = obj;
      console.log(this.remewList, "remewList");
    },
    // 判断当前应用是否有套餐
    isRenew() {
      if (!this.remewList) {
        return;
      }
      const arr = this.remewList.filter(item => {
        if (item) return item.appId == this.tabActiveName;
      });
      if (arr.length > 0) {
        return true;
      }
      return false;
    },
    handleClick() {
      this.pageSize = 50;
      this.currentPage = 1;
      this.queryRoughAppInfo();
    },
    async getList() {
      const { obj, flag } = await this.$API.applicationInfoQueryAll();
      if (flag === 1) {
        this.tokenList = obj;
      }
    },
    // 根据应用获取对应用户额度信息
    async queryRoughAppInfo() {
      try {
        const params = {
          appId: this.tabActiveName,
          pageSize: this.pageSize,
          currentPage: this.currentPage
        };
        const { obj } = await this.$API.queryRoughAppInfo(params);
        if (obj) {
          this.total = obj.total;
          this.tableData = obj.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 获取应用列表（用户已经绑定过的）
    async getAppList() {
      const data = await this.$API.listAppInfoAndInterface({
        queryType: 1
      });
      this.appList = data.obj;
      console.log(data, "应用列表");
    },
    // 根据appId查询用户绑定
    async getAppBindUserList() {
      const { obj } = await this.$API.listAppInfoAndInterface({
        appId: this.chartFilter.app || this.tabActiveName,
        queryType: 2
      });

      this.appBindUserList = obj || [];
      if (obj.length) {
        try {
          obj.forEach(element => {
            if (element.userAppId == this.userAppId) {
              this.chartFilter.appBindUser = this.userAppId;
              throw Error();
            } else {
              this.chartFilter.appBindUser = obj[0].userAppId;
            }
          });
        } catch (e) {
          // console.log(e);
        }
        const data = await this.$API.listAppInfoAndInterface({
          appId: this.chartFilter.app || this.appId,
          userAppId: this.chartFilter.appBindUser || this.userAppId,
          queryType: 3
        });

        this.appServerList = data.obj || [];
        if (this.activeName == 2) {
          this.appServerList.unshift({
            urlName: "全部",
            appInterfaceId: ""
          });
        }
        this.chartFilter.appServer =
          data.obj.length && data.obj[0].appInterfaceId;
      } else {
        this.chartFilter.appBindUser = "";
        this.chartFilter.appServer = "";
        this.$msg.error("暂无绑定名");
      }
    },
    showRenew(data) {
      this.renewData = data;
      this.visabled = true;
      console.log(this.renewData, "this.renewData");
    },
    async showChart(row) {
      const curTime = new Date();
      this.userAppId = row.userAppId;
      this.chartFilter.app = Number(this.tabActiveName);
      this.chartVisabled = true;
      this.chartFilter.date = "周";
      this.filterTime = [
        dayJs(curTime.getTime() - 3600 * 1000 * 24 * 7).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        dayJs(new Date()).format("YYYY-MM-DD HH:mm:ss")
      ];
      await this.getAppBindUserList();
      this.getChartData();
    },
    async getChartData() {
      if (this.chartFilter.appBindUser == "") {
        this.$msg.error("请选择绑定名");
        return;
      }
      const info = {
        appInterfaceId: this.chartFilter.appServer,
        appId: this.chartFilter.app,
        userAppId: this.chartFilter.appBindUser,
        type: this.activeName,
        beginTime: this.filterTime[0],
        endTime: this.filterTime[1]
      };
      const data = await this.$API.statisticsRecordQuery(info);

      if (data.obj) {
        const arr = [];
        if (data.obj.data) {
          data.obj.data.forEach(element => {
            arr.push({
              value: [element.time.replace(" ", "\n"), element.data]
            });
          });
          this.$nextTick(() => {
            this.renderChart("chartmain", arr);
          });
        } else {
          this.$nextTick(() => {
            this.renderChart("chartmain");
          });
        }
      }
    },
    renderChart(id, _data = [{ value: ["暂无数据"] }]) {
      this.charts = echarts.init(document.getElementById(id));
      this.charts.setOption({
        grid: {
          top: "2%",
          left: "0%",
          right: "2.5%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          type: "category",
          axisTick: { show: false }
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
          splitLine: {
            lineStyle: {
              type: "dashed"
            }
          },
          axisTick: { show: false }
        },
        dataZoom: [
          {
            type: "slider",
            xAxisIndex: 0,
            filterMode: "empty"
          },
          {
            type: "inside",
            xAxisIndex: 0,
            filterMode: "empty"
          }
        ],
        color: ["#17CED5"],
        series: [
          {
            data: _data,
            // areaStyle: {
            //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            //     offset: 0,
            //     color: 'rgb(255, 158, 68)'
            //   }, {
            //     offset: 1,
            //     color: 'rgb(255, 70, 131)'
            //   }])
            // },
            symbolSize: 15,
            type: "line"
          }
        ]
      });
      window.onresize = this.charts.resize();
    },
    selectTime() {
      const curTime = new Date();
      if (this.chartFilter.date === "天") {
        this.filterTime = [
          dayJs(curTime).format("YYYY-MM-DD 00:00:00"),
          dayJs(new Date()).format("YYYY-MM-DD HH:mm:ss")
        ];
      } else if (this.chartFilter.date === "周") {
        this.filterTime = [
          dayJs(curTime.getTime() - 3600 * 1000 * 24 * 7).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          dayJs(new Date()).format("YYYY-MM-DD HH:mm:ss")
        ];
      } else if (this.chartFilter.date === "月") {
        this.filterTime = [
          dayJs(curTime.getTime() - 3600 * 1000 * 24 * 30).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          dayJs(new Date()).format("YYYY-MM-DD HH:mm:ss")
        ];
      } else {
        this.filterTime = [
          dayJs(curTime.getTime() - 3600 * 1000 * 24 * 365).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          dayJs(new Date()).format("YYYY-MM-DD HH:mm:ss")
        ];
      }
      this.getChartData();
      // console.log(this.filterTime);
    },
    activeChange(val) {
      this.activeName = val;
      if (val === 2) {
        this.appServerFlag = true;
        this.appServerList.unshift({
          urlName: "全部",
          appInterfaceId: null
        });
      } else {
        this.appServerFlag = false;
        this.appServerList.shift();
      }
      this.chartFilter.appServer = this.appServerList[0].appInterfaceId;
      this.getChartData();
    },
    handleAppChange(val) {
      this.chartFilter.app = val;
      this.getAppBindUserList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.queryRoughAppInfo();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryRoughAppInfo();
    }
  }
};
</script>
<style lang="scss" scoped>
.limitBuy {
  height: 100%;
  // padding-right: 20px;
  &__header {
    height: 40px;
    line-height: 40px;
    width: 100%;
    display: flex;
    align-items: center;
    padding-right: 20px;
    box-sizing: border-box;
    justify-content: flex-start;
    h2 {
      font-size: 18px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
    p {
      margin-left: 8px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
    }
  }

  &__container {
    height: calc(100vh - 250px);
    margin-top: 17px;
    // padding: 0 24px;
    box-sizing: border-box;
  }

  &__table {
    .grey {
      color: #666;
    }
    .green {
      color: #1cc610;
    }
    .black {
      color: #333;
    }
    .red {
      color: #c61010;
    }
    .item {
      margin: 25px 0;
      display: inline-block;
      div {
        text-align: left;
      }
      :first-child {
        margin-bottom: 30px;
      }
    }
    .iconfont {
      color: #848992;
      padding: 0 8px;
      font-size: 20px;
      cursor: pointer;
    }
    .iconfont:hover {
      color: #0856ea;
    }
  }

  &__page {
    padding: 8px 15px;
    background: #fff;
  }
}
.chart {
  &_header {
    text-align: left;
    height: 40px;
    line-height: 40px;
    .active {
      color: #0856ea;
    }
    span {
      padding-right: 10px;
      cursor: pointer;
    }
    span:hover {
      color: #0856ea;
    }
  }
  &_control {
    height: 45px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    .btn {
      width: 64px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
      background: rgba(8, 86, 234, 1);
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      transition: all 0.2;
    }
    .btn:hover {
      opacity: 0.9;
    }
  }
  &_container {
    margin-top: 10px;
    .control {
      text-align: right;
      margin: 10px 0;
    }
  }
}
.improveLimitBox {
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 400;
  img {
    width: 80px;
  }
  h3 {
    color: rgba(51, 51, 51, 1);
    margin: 28px 0;
  }
  p {
    color: rgba(153, 153, 153, 1);
    margin: 23px 0;
  }
  span {
    color: #0856ea;
    margin-left: 20px;
  }
}
.line {
  width: 100%;
  height: 1px;
  background: #ededed;
  position: absolute;
  top: 55px;
  left: 0;
}
.tableBox {
  height: calc(100vh - 260px);
  padding: 0 20px;
  background: #fff;
}
::v-deep .el-table th {
  background: rgba(250, 250, 250, 1);
  color: rgba(51, 51, 51, 1);
}
::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background: #d9e6ff;
  color: #0856ea;
  border-color: #0856ea;
  box-shadow: -1px 0 0 0 #0856ea;
}
::v-deep .el-radio-button__inner:hover {
  color: #0856ea;
}
</style>
