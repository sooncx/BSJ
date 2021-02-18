<template>
  <div class="financialRisk">
    <div class="headerBox">
      <div class="headerBox_left">
        <div class="headerBox_left_text">
          <p>智能校车解决方案</p>
          <p>{{headerContent}}</p>
          <div>
            <p>网址: <a href="https://s.car900.com" target="_blank">https://s.car900.com</a></p>
            <p>账号: open04</p>
            <p>密码: 123456</p>
          </div>
        </div>
        <div
          class="headerBox_left_btn"
          @click="visabled = true"
        >马上咨询</div>
      </div>
      <div class="headerBox_right">
        <img
          v-lazy="imgUrl[0]"
          alt
        />
      </div>
    </div>
    <div class="location">
      <div class="location_left">
        <div>
          <h3>校车实时定位</h3>
          <p>监控中心通过北斗定位视频平台实时监控校车运行过程的车辆状态 如速度，方向，发动机状态，并可随时调取车辆的实时视频数据</p>
        </div>
      </div>
      <div class="location_right">
        <img
          v-lazy="imgUrl[1]"
          alt
        />
        <span class="car1">
          <img
            v-lazy="imgUrl[2]"
            alt
          />
        </span>
      </div>
    </div>
    <div class="riding">
      <div class="riding_left">
        <img
          v-lazy="imgUrl[3]"
          alt
        />
        <span class="car1">
          <img
            v-lazy="imgUrl[4]"
            alt
          />
        </span>
        <span class="mapval">
          <img
            v-lazy="imgUrl[5]"
            alt
          />
        </span>
      </div>
      <div class="riding_right">
        <div>
          <h3>学生上车保证</h3>
          <p>采用IC刷卡和人脸识别双结合的方式，确保人员能准确的上车，避免造成遗漏，发生错上车、漏上车等事件的发生。且在学生成功刷卡上车时，还会发短信通知到对应的家长手机中进行提醒</p>
        </div>
      </div>
    </div>
    <div class="trace">
      <div class="trace_content">
        <div class="trace_content_left">
          <h3>微信小程序车辆追踪</h3>
          <p>
            采用学校家长扫码登录微信的小程序，通过微信小程序家长可以随时了解学生所乘坐车辆的位置，进行实时的追踪。通过小程序也可以提前知道车辆的位置和到达上车点的时间
          </p>
        </div>
        <div class="trace_content_right">
          <img
            v-lazy="imgUrl[6]"
            alt
          />
        </div>
      </div>
    </div>
    <div class="monitor">
      <div class="monitor_content">
        <div class="monitor_content_left">
          <img
            v-lazy="imgUrl[7]"
            alt
          />
        </div>
        <div class="monitor_content_right">
          <h3>校车智能视频监控</h3>
          <p>
            监控管理中心可以随时调取在行驶途中的车辆的视频画面和车速信息，掌握车辆行驶情况，监督司机驾驶行为，防止超载、私载行为提高管理水平，并降低经济损失
          </p>
        </div>
      </div>
    </div>
    <div class="alarm">
      <div class="alarm_content">
        <div class="alarm_content_left">
          <h3>主动安全报警防控</h3>
          <p>
            采用先进的DSM报警和ADAS报警双结合的模式，DSM是对驾驶员的行为进行监控如（疲劳、吸烟、驾驶员变更、长时间不目视前方、打电话、驾驶员身份识别、驾驶员异常、双手同时脱离方向盘报警）；ADAS是对驾驶车辆进行监控如（道路偏离、FCW前车碰撞预警、前车近距）更好的保证车辆的安全
          </p>
        </div>
        <div class="alarm_content_right">
          <img
            v-lazy="imgUrl[8]"
            alt
          />
        </div>
      </div>
    </div>

    <!-- <div class="project">
      <div class="project_top">
        <p>方案优势</p>
        <p>车辆GPS数据回传后，由大数据平台处理海量车辆信息，对数据“过滤筛选”，</p>
        <p>同时数据分析平台对数据进行报表式处理，供风控人员查看</p>
      </div>
      <div class="project_bottom">
        <div
          class="project_bottom_card"
          v-for="(item, index) in project"
          :key="index"
        >
          <img
            :src="item.src"
            alt=""
          >
          <p>{{item.label}}</p>
        </div>
      </div>
    </div>-->
    <!-- <div class="solution">
      <p>方案内容(或服务流程)</p>
      <div class="solution_bottom">
        <div
          class="solution_bottom_card"
          v-for="(item, index) in solution"
          :key="index"
        >
          <p>{{item.title}}</p>
          <p>{{item.value}}</p>
        </div>
      </div>
    </div>-->
    <!-- <div class="scene">
      <p>应用场景</p>
      <div class="scene_bottom">
        <div
          class="scene_bottom_card"
          v-for="(item, index) in scene"
          :key="index"
          :style="{background:'url(' + item.src + ')'}"
          @mouseenter="enter(index)"
          @mouseleave="selectTag = null"
        >
          <p :class="{active:selectTag === index}">{{item.label}}</p>
        </div>
      </div>
    </div>-->
    <Footer />
    <phoneDialog :visabled.sync="visabled" />
  </div>
</template>

<script>
import Footer from "@/components/Footer/index.vue";
import phoneDialog from "@/components/phoneDialog/index.vue";
import imgLazy from "./lazyimg";
// @ is an alias to /src

export default {
  name: "financialRisk",
  components: {
    Footer,
    phoneDialog
  },
  data() {
    return {
      imgUrl: imgLazy,
      visabled: false,
      headerContent:
        "校车智能监控平台集视频监控、北斗定位、人脸识别、人体体温检测、智能IC卡识别于一体的大数据定位分析系统。实现可视化呈现与监控，提高车辆运行的安全性和管理水平。",
      project: [
        {
          src: require("../../../assets/img/home/introduce1.png"),
          label: "智能视频监控"
        },
        {
          src: require("../../../assets/img/home/introduce1.png"),
          label: "轨迹回放"
        },
        {
          src: require("../../../assets/img/home/introduce1.png"),
          label: "视频回放"
        },
        {
          src: require("../../../assets/img/home/introduce1.png"),
          label: "实时定位"
        },
        {
          src: require("../../../assets/img/home/introduce1.png"),
          label: "异常报警"
        },
        {
          src: require("../../../assets/img/home/introduce1.png"),
          label: "报表中心"
        }
      ],
      solution: [
        {
          title: "标题1",
          value:
            "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容"
        },
        {
          title: "标题2",
          value:
            "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容"
        },
        {
          title: "标题3",
          value:
            "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容"
        },
        {
          title: "标题4",
          value:
            "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容"
        }
      ],
      scene: [
        {
          src: require("../../../assets/img/home/solution.png"),
          label: "汽车抵押"
        },
        {
          src: require("../../../assets/img/home/solution.png"),
          label: "汽车抵押"
        },
        {
          src: require("../../../assets/img/home/solution.png"),
          label: "汽车抵押"
        },
        {
          src: require("../../../assets/img/home/solution.png"),
          label: "汽车抵押"
        }
      ],
      selectTag: null
    };
  },
  methods: {
    enter(index) {
      this.selectTag = index;
    }
  }
};
</script>
<style lang="scss" scoped>
.financialRisk {
  .headerBox {
    width: 100%;
    min-width: 1080px;
    background: #001337;
    height: 450px;
    display: flex;
    &_left {
      width: 50%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      flex-direction: column;
      margin-left: -100px;
      padding: 0 40px;
      &_text {
        text-align: left;
        color: #fff;
        font-size: 12px;
        & > p:nth-child(1) {
          font-size: 20px;
          padding-bottom: 20px;
        }
        & > p:nth-child(2) {
          width: 410px;
          line-height: 24px;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
        }
        & div {
          margin-top: 10px;
          font-size: 14px;
          line-height: 24px;
          a {
            color: rgb(37, 111, 231);
            &:hover {
              color: skyblue;
            }
          }
        }
      }
      &_btn {
        margin-top: 40px;
        display: block;
        cursor: pointer;
        width: 130px;
        height: 40px;
        background: rgba(8, 86, 234, 1);
        line-height: 40px;
        text-align: center;
        color: #fff;
        margin-right: 280px;
        &:hover {
          opacity: 0.8;
        }
      }
    }
    &_right {
      flex: 1;
      height: 100%;
      overflow: hidden;
      display: flex;
      img {
        height: 100%;
      }
    }
  }
  .location,
  .riding {
    width: 100%;
    min-width: 1080px;
    height: 450px;
    background: #fff;
    display: flex;
    &_left {
      width: calc(100% - 900px);
      height: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      flex-direction: column;
      & > p {
        padding: 0 10%;
        max-width: 447px;
        min-width: 100px;
        text-align: left;
        line-height: 28px;
      }
    }
    &_right {
      height: 100%;
      position: relative;
      justify-content: flex-end;
      display: flex;
      width: 900px;
      img {
        height: 100%;
        width: 100%;
      }
      .car1 {
        position: absolute;
        animation: show linear infinite 15s;
        top: 215px;
        left: 100px;
        img {
          width: 57px;
          height: 35px;
        }
      }
    }
    @keyframes show {
      0% {
        top: 215px;
        left: 100px;
        opacity: 1;
      }
      50% {
        top: 155px;
        left: 430px;
        opacity: 1;
        transform: rotate(-7deg);
      }
      99% {
        top: 32px;
        left: 816px;
        opacity: 1;
        transform: rotate(-7deg);
      }
      100% {
        top: 32px;
        left: 816px;
        opacity: 0;
        transform: rotate(-7deg);
      }
    }
  }
  .location {
    &_left {
      div {
        max-width: 447px;
        min-width: 100px;
        display: flex;
        flex-direction: column;
        padding: 0 40px;
        h3 {
          font-size: 32px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          text-align: left;
          padding: 0 0 28px 0;
        }
        & > p {
          padding: 0;
          text-align: left;
          line-height: 28px;
        }
      }
    }
  }
  .riding {
    background: #f3f5f8;
    &_left {
      width: 850px;
      flex: 1;
      height: 100%;
      position: relative;
      align-items: flex-start;
      img {
        height: 100%;
        width: 850px;
      }
      .car1 {
        position: absolute;
        bottom: 170px;
        left: 402px;
        animation: riding linear infinite 15s;
        img {
          width: 50px;
          height: 40px;
        }
      }
      .mapval {
        position: absolute;
        bottom: 204px;
        left: 410px;
        animation: mapvalShow linear infinite 15s;
        img {
          width: 92px;
          height: 63px;
        }
      }
      @keyframes riding {
        0% {
          bottom: 60px;
          left: 228px;
          opacity: 1;
        }
        30% {
          bottom: 170px;
          left: 402px;
          opacity: 1;
        }
        50% {
          bottom: 170px;
          left: 402px;
          opacity: 1;
        }
        99% {
          bottom: 375px;
          left: 700px;
          opacity: 1;
        }
        100% {
          bottom: 375px;
          left: 700px;
          opacity: 0;
        }
      }
      @keyframes mapvalShow {
        0% {
          opacity: 0;
        }
        29% {
          opacity: 0;
        }
        30% {
          opacity: 1;
        }
        50% {
          opacity: 1;
        }
        51% {
          opacity: 0;
        }
        99% {
          opacity: 0;
        }
        100% {
          opacity: 0;
        }
      }
    }
    &_right {
      max-width: calc(100% - 850px);
      height: 100%;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      flex-direction: column;
      div {
        max-width: 447px;
        min-width: 150px;
        display: flex;
        flex-direction: column;
        padding: 0 40px;
        h3 {
          font-size: 32px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          text-align: left;
          padding: 0 0 28px 0;
        }
        & > p {
          padding: 0;
          text-align: left;
          line-height: 28px;
        }
      }
    }
  }
  .trace,
  .alarm {
    width: 100%;
    min-width: 1080px;
    height: 508px;
    background: rgba(10, 46, 118, 1);
    display: flex;
    justify-content: center;
    align-items: center;
    &_content {
      display: flex;
      &_left {
        max-width: 555px;
        min-width: 150px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        padding: 0 160px 0 40px;
        color: #fff;
        h3 {
          font-size: 32px;
          font-family: PingFang SC;
          font-weight: 400;
          text-align: left;
          padding: 0 0 28px 0;
        }
        & > p {
          padding: 0;
          text-align: left;
          line-height: 28px;
        }
      }
      &_right {
        padding: 0 40px;
      }
    }
  }
  .monitor {
    width: 100%;
    min-width: 1080px;
    height: 508px;
    background: rgba(255, 255, 255, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    &_content {
      display: flex;
      justify-content: space-between;
      min-width: 1080px;
      &_right {
        width: 450px;
        min-width: 150px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        padding-left: 60px;
        h3 {
          font-size: 32px;
          font-family: PingFang SC;
          font-weight: 400;
          text-align: left;
          padding: 0 0 28px 0;
        }
        & > p {
          padding: 0;
          text-align: left;
          line-height: 28px;
        }
      }
    }
  }
  .alarm {
    background: rgba(243, 245, 248, 1);
    &_content {
      display: flex;
      &_left {
        padding: 0 40px;
        color: #333;
      }
    }
  }
  .project {
    width: 100%;
    min-width: 1080px;
    height: 450px;
    background: #fff;
    &_top {
      display: flex;
      flex-direction: column;
      & p {
        color: #333333;
        padding: 5px;
      }
      & p:nth-child(1) {
        font-size: 20px;
        padding: 40px 0;
        margin-top: 20px;
      }
    }
    &_bottom {
      display: flex;
      justify-content: center;
      margin-top: 80px;
      &_card {
        cursor: pointer;
        width: 140px;
        height: 150px;
        background: #f4f6f8;
        margin: 0 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        &:hover {
          opacity: 0.8;
        }
        img {
          padding: 20px 0;
          margin-top: -20px;
        }
      }
    }
  }
  .solution {
    color: solution;
    width: 100%;
    min-width: 1080px;
    height: 450px;
    background: #f3f5f8;
    display: flex;
    flex-direction: column;
    & > p {
      margin-top: 50px;
      font-size: 24px;
      margin-bottom: 80px;
    }
    &_bottom {
      display: flex;
      justify-content: center;
      &_card {
        cursor: pointer;
        text-align: left;
        margin: 20px;
        padding: 20px;
        width: 130px;
        height: 200px;
        background: #fff;
        &:hover {
          transform: translate(-5px, -5px);
          transition: all 0.6s;
        }
        & p {
          font-size: 12px;
          margin-bottom: 20px;
          line-height: 20px;
        }
        & p:nth-child(1) {
          font-size: 16px;
        }
      }
    }
  }
  .scene {
    width: 100%;
    min-width: 1080px;
    height: 350px;
    & > p {
      margin-top: 50px;
      font-size: 24px;
      margin-bottom: 60px;
    }
    &_bottom {
      display: flex;
      justify-content: center;
      &_card {
        width: 150px;
        height: 170px;
        margin: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        & > p {
          position: relative;
          &::after {
            position: absolute;
            content: "";
            width: 30px;
            height: 2px;
            bottom: -10px;
            background: #fff;
            left: 13px;
            transition: all 0.3s;
          }
        }
        .active {
          &::after {
            width: 55px !important;
            transition: all 0.3s;
            left: 0px;
          }
        }
      }
    }
  }
}
</style>
