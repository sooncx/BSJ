<template>
  <div class="control">
    <!-- <div v-for="(item, index) in 1000" :key="index">{{index}}</div> -->
    <div
      class="control_header"
      :style="{display:(zoom?'none':'')}"
    >
      <h3>数据统计</h3>
      <div class="control_header_content">
        <div class="box">
          <div class="box_header">
            <el-button-group>
              <el-button
                v-for="(item, index) in dayBtns"
                :key="index"
                :type="item.type"
                size="mini"
                @click="selectDay(index)"
              >{{item.label}}</el-button>
            </el-button-group>
          </div>
          <div class="box_content">
            <div class="left">
              <h3>{{thisUsers?thisUsers.currentUserNum:0}}</h3>
              <div :style="{color:((thisUsers?setArrw(thisUsers.userNumChange):true)
              ?'#0CBE2D':'red')}">
                <span>用户增长数</span>
                <span>{{dataCountTxt}}</span>
                <span
                  class="arrow1"
                  v-if="thisUsers?setArrw(thisUsers.userNumChange):true"
                ></span>
                <span
                  class="arrow2"
                  v-else
                ></span>
                <span>{{thisUsers?thisUsers.userNumChange:0}}</span>
              </div>
            </div>
            <div class="right">
              <img
                src="../../../assets/img/home/uesr.png"
                alt=""
              >
            </div>
          </div>
        </div>
        <div class="box1">
          <div class="box_header"></div>
          <div class="box_content">
            <div class="left">
              <h3 style="color:#EA7D08">{{thisDay?thisDay.dayInvokeNum:0}}</h3>
              <div :style="{color:((thisDay?setArrw(thisDay.deltaInvokeNum):true)
              ?'#0CBE2D':'red')}">
                <span>当日调用总量</span>
                <span>较昨日</span>
                <span
                  class="arrow1"
                  v-if="thisDay?setArrw(thisDay.deltaInvokeNum):true"
                ></span>
                <span
                  class="arrow2"
                  v-else
                ></span>
                <span>{{thisDay?thisDay.deltaInvokeNum:0}}</span>
              </div>
            </div>
            <div class="right">
              <img
                src="../../../assets/img/home/接口管理.png"
                alt=""
              >
            </div>
          </div>
        </div>
        <div class="box2">
          <div class="box_header"></div>
          <div class="box_content">
            <div class="left">
              <h3 style="color:#17CCD0">{{thisMonth?thisMonth.monthInvokeNum:0}}</h3>
              <div :style="{color:((thisMonth?setArrw(thisMonth.deltaInvokeNum):true)
              ?'#0CBE2D':'red')}">
                <span>当月调用总量</span>
                <span>较上月</span>
                <span
                  class="arrow1"
                  v-if="thisMonth?setArrw(thisMonth.deltaInvokeNum):true"
                ></span>
                <span
                  class="arrow2"
                  v-else
                ></span>
                <span>{{thisMonth?thisMonth.deltaInvokeNum:0}}</span>
              </div>
            </div>
            <div class="right">
              <img
                src="../../../assets/img/home/接口管理 拷贝.png"
                alt=""
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="control_content">
      <div
        class="box2"
        :class="{test:zoom}"
      >
        <h3 v-show="!zoom">接口调用量</h3>
        <div class="box2_content">
          <lineChar :zoom.sync="zoom" />
        </div>
      </div>
      <div
        class="box2"
        v-show="!zoom"
      >
        <h3>用户调用量</h3>
        <div class="box2_content">
          <Progress />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Progress from "../../../components/Progress/index.vue";
import lineChar from "../../../components/lineChar/index.vue";

export default {
  name: "control",
  components: {
    Progress,
    lineChar
  },
  data() {
    return {
      zoom: false,
      dataCountTxt: "较昨日",
      flag: true,
      dayBtns: [
        {
          label: "日",
          type: "primary",
          value: 1
        },
        {
          label: "周",
          type: "",
          value: 2
        },
        {
          label: "月",
          type: "",
          value: 3
        }
      ],
      thisDay: null,
      thisMonth: null,
      timeType: 1,
      thisUsers: null
    };
  },
  mounted() {
    this.getToday();
    this.getThisMonth();
    this.gteUserData();
  },
  watch: {
    $route: {
      handler(val) {
        if (val.name === "control") {
          this.getToday();
          this.getThisMonth();
          this.gteUserData();
        }
      }
    }
  },
  methods: {
    setArrw(data) {
      if (data) {
        if (data >= 0) {
          return true;
        }
        return false;
      }
      return true;
    },
    selectDay(index) {
      this.timeType = index + 1;
      switch (index) {
        case 0:
          this.dataCountTxt = "较昨日";
          break;
        case 1:
          this.dataCountTxt = "较上周";
          break;
        case 2:
          this.dataCountTxt = "较上月";
          break;
        default:
          break;
      }
      this.dayBtns.forEach((item, i) => {
        if (item) {
          this.dayBtns[i].type = "";
        }
      });
      this.dayBtns[index].type = "primary";
      this.gteUserData();
    },
    async getToday() {
      try {
        const { flag, obj } = await this.$API.interfaceDayInvokeInfo();
        console.log(obj, "===========");
        if (flag === 1) {
          this.thisDay = obj;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getThisMonth() {
      try {
        const { flag, obj } = await this.$API.interfaceMonthInvokeInfo();
        console.log(obj);
        if (flag === 1) {
          this.thisMonth = obj;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async gteUserData() {
      try {
        const { flag, obj } = await this.$API.userIncreaseInfo({
          type: this.timeType
        });
        if (flag === 1) {
          this.thisUsers = obj;
        }
        console.log(obj);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.control {
  flex: 1;
  min-width: 1080px;
  overflow: hidden;
  // border: 1px solid;
  background: #f5f5fa;
  display: flex;
  flex-direction: column;
  // @include scrollbar;
  &_header {
    width: 100%;
    height: 30%;
    margin-bottom: 40px;
    h3 {
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      width: 100%;
      text-align: left;
      margin-bottom: 10px;
    }
    &_content {
      width: 100%;
      height: calc(100% - 10px);
      display: flex;
      justify-content: space-between;
      .box,
      .box1,
      .box2 {
        width: calc(33.3% - 12px);
        height: 100%;
        background: #fff;
        &_header {
          flex: 1;
          height: 50px;
          display: flex;
          // background: gray;
          align-items: center;
          justify-content: flex-end;
          padding-right: 20px;
        }
        &_content {
          display: flex;
          justify-content: space-around;
          width: 100%;
          height: calc(100% - 50px);
          align-items: center;
          .left {
            color: rgba(12, 190, 45, 1);
            h3 {
              font-size: 56px;
              font-family: PingFang SC;
              font-weight: 400;
              color: rgba(8, 86, 234, 1);
              padding-bottom: 10px;
            }
            span {
              font-size: 14px;
              font-family: PingFang SC;
              font-weight: 400;
            }
            span:nth-child(1) {
              font-size: 18px;
              font-family: PingFang SC;
              font-weight: 400;
              color: rgba(102, 102, 102, 1);
              padding-right: 10px;
            }
            .arrow1 {
              display: inline-block;
              margin: 0 8px;
              position: relative;
              &::before {
                content: "";
                width: 0;
                height: 0;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
                border-bottom: 5px solid #0cbe2d;
                position: absolute;
                top: -10px;
                left: -4px;
              }
              &::after {
                content: "";
                width: 4px;
                height: 5px;
                background: #0cbe2d;
                position: absolute;
                left: -2px;
                bottom: 0px;
              }
            }
            .arrow2 {
              display: inline-block;
              margin: 0 8px;
              position: relative;
              &::before {
                content: "";
                width: 0;
                height: 0;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
                border-top: 5px solid red;
                position: absolute;
                bottom: -1px;
                left: -4px;
              }
              &::after {
                content: "";
                width: 4px;
                height: 5px;
                background: red;
                position: absolute;
                left: -2px;
                top: -9px;
              }
            }
          }
          .right {
          }
        }
      }
    }
  }
  &_content {
    width: 100%;
    flex: 1;
    display: flex;
    justify-content: space-between;
    .box2 {
      transition: all 0s;
      width: calc(50% - 10px);
      height: 100%;
      h3 {
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        width: 100%;
        text-align: left;
        margin-bottom: 10px;
      }
      &_content {
        flex: 1;
        height: calc(100% - 29px);
        background: #fff;
        // padding: 20px;
      }
    }
  }
}
.test {
  position: absolute;
  left: 240px;
  top: 70px;
  width: calc(100% - 260px) !important;
  height: calc(100% - 140px) !important;
  background: #fff;
  z-index: 999;
}
</style>
