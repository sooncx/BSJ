<template>
  <div class="financialRisk">
    <div class="headerBox">
      <div class="headerBox_left">
        <div class="headerBox_left_text">
          <p>汽车金融风控解决方案</p>
          <p>
            博云致力于为各类汽车金融机构提供全流程风控管理解决方案。在行业数字化转型过程中，为客户量身定制数字化转型咨询方案。
          </p>
          <div>
            <p>网址: <a href="http://yun.car900.com" target="_blank">yun.car900.com</a></p>
            <p>账号: open01</p>
            <p>密码: 123456</p>
          </div>
        </div>
        <div
          class="headerBox_left_btn"
          @click="visabled = true"
        >
          马上咨询
        </div>
      </div>
      <div class="headerBox_right">
        <img
          v-lazy="imgUrl[0]"
          alt=""
        >
      </div>
    </div>
    <div class="project">
      <div class="project_top">
        <p>方案优势</p>
        <p>车辆GPS数据回传后，由大数据平台处理海量车辆信息，对数据进行“分析统计”</p>
        <p>并且数据分析平台将对数据进行报表式处理，供风控人员查看</p>
      </div>
      <div class="project_bottom">
        <div
          class="project_bottom_card"
          v-for="(item, index) in project"
          :key="index"
        >
          <img
            v-lazy="item.src"
            alt=""
          >
          <p>{{item.label}}</p>
        </div>
      </div>
    </div>
    <div class="solution">
      <div class="solution_left">
        <p>
          通过后台智能分析，把车辆的报警情况进行分析统计，并在地图中呈现出来让监控人员更好更有效的进行车辆的报警情况查看与分析，提高监控效率和质量。
        </p>
      </div>
      <div class="solution_right">
        <img
          v-lazy="imgUrl[1]"
          alt=""
        >
        <span class="car1">
          <img
            v-lazy="imgUrl[2]"
            alt=""
          >
        </span>
        <!-- <span class="car2">
          <img
            src="../../../assets/img/solutions/financialRisk/car2.png"
            alt=""
          >
        </span> -->
      </div>
    </div>
    <div class="projectDetail">
      <div class="projectDetail_left">
        <img
          v-lazy="imgUrl[3]"
          alt=""
        >
      </div>
      <div class="projectDetail_right">
        <h3>方案概述</h3>
        <p>
          据贷前风控评估数据，判断风险等级，在车辆上安装一个有线GPS和多个无线GPS，可以有效解决汽车金融风控行业大问题。通过全球卫星定位技术，信贷车辆能够精准的被实时在线监控，行驶路线 一目了然，随时掌握车辆的位置，建立了信贷公司与车辆之间迅速、准确、有效的信息传递通道，实现对信贷车辆的有效管理。
        </p>
      </div>
    </div>
    <div class="playback">
      <div class="playback_left">
        <div>
          <h3>轨迹回放</h3>
          <p>
            后台将会记录车辆每日行驶路线记录，可通过后台随时查询车辆的行驶轨迹根据选择时间进行回放，方便风控人员进行评估监控。
          </p>
        </div>
      </div>
      <div class="playback_right">
        <div class="svg">
          <svg viewBox="110 0 340 333">
            <path
              class="pathBg"
              fill="transparent"
              stroke="gray"
              stroke-width="3"
              d="M190 130 C180 0 190 100 -70 30"
            />
            <path
              class="path"
              fill="transparent"
              stroke="blue"
              stroke-width="3"
              d="M190 130 C180 0 190 100 -70 30"
            />
          </svg>
        </div>
        <img
          v-lazy="imgUrl[1]"
          alt=""
        >
        <span class="car1">
          <img
            v-lazy="imgUrl[2]"
            alt=""
          >
        </span>
        <span class="car2">
          <img
            v-lazy="imgUrl[4]"
            alt=""
          >
        </span>
      </div>
    </div>
    <div class="alarm">
      <div class="alarm_left">
        <img
          v-lazy="imgUrl[1]"
          alt=""
        >
        <span class="car1">
          <img
            v-lazy="imgUrl[2]"
            alt=""
          >
        </span>
        <span class="point"></span>
      </div>
      <div class="alarm_right">
        <div>
          <h3>围栏报警</h3>
          <p>
            可根据风控人员需求在地图任意地点画围栏，车辆进围栏或者出围栏都会进行报警提醒，方便风控人员随时掌控车辆风险。
          </p>
        </div>
      </div>
    </div>
    <div class="scene">
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
    </div>
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
      project: [
        {
          src: require("../../../assets/img/solutions/financialRisk/jiankong.png"),
          label: "实时监控"
        },
        {
          src: require("../../../assets/img/solutions/financialRisk/guiji.png"),
          label: "轨迹回放"
        },
        {
          src: require("../../../assets/img/solutions/financialRisk/weilan.png"),
          label: "电子围栏"
        },
        {
          src: require("../../../assets/img/solutions/financialRisk/tingliu.png"),
          label: "停留预警"
        },
        {
          src: require("../../../assets/img/solutions/financialRisk/yichang.png"),
          label: "异常报警"
        },
        {
          src: require("../../../assets/img/solutions/financialRisk/baobiao.png"),
          label: "报表分析"
        }
      ],
      scene: [
        {
          src: require("../../../assets/img/solutions/financialRisk/footer1.png"),
          label: "汽车贷款"
        },
        {
          src: require("../../../assets/img/solutions/financialRisk/footer2.png"),
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
  .project {
    width: 100%;
    min-width: 1080px;
    height: 450px;
    background: #f4f6f8;
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
        background: #fff;
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
  .solution,
  .playback,
  .alarm {
    width: 100%;
    min-width: 1080px;
    height: 450px;
    background: #fff;
    display: flex;
    &_left {
      width: calc(100% - 900px);
      height: 100%;
      display: flex;
      align-items: center;
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
        animation: move1 linear infinite 6s;
        img {
          width: 57px;
          height: 26px;
        }
      }
      @keyframes solutionCar {
        0% {
          left: 479px;
          bottom: 100px;
          transform: rotate(-95deg);
        }
        49% {
          left: 445px;
          bottom: 280px;
          transform: rotate(-95deg);
        }
        50% {
          left: 445px;
          bottom: 280px;
          transform: rotate(-180deg);
        }
        99% {
          left: 200px;
          bottom: 280px;
          transform: rotate(-180deg);
          opacity: 1;
        }
        100% {
          opacity: 0;
          transform: rotate(-180deg);
        }
      }
    }
  }
  .playback {
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
    &_right {
      overflow: hidden;
      .svg {
        width: 900px;
        height: 100%;
        position: absolute;
        left: 290px;
        .path {
          stroke-dasharray: 141;
          stroke-dashoffset: 141;
          animation: dash 15s linear infinite;
          position: absolute;
          top: 100px;
          // left: 100px;
        }
        .pathBg {
          stroke-dasharray: 141;
          position: absolute;
          top: 100px;
          left: 100px;
        }
      }
      @keyframes dash {
        0% {
          stroke-dashoffset: 141;
          opacity: 1;
        }

        99% {
          stroke-dashoffset: 0;
          opacity: 1;
        }

        100% {
          stroke-dashoffset: 0;
          opacity: 0;
        }
      }
      .car1 {
        position: absolute;
        animation: solutionCar linear infinite 15s;
        img {
          width: 57px;
          height: 26px;
        }
      }
      @keyframes solutionCar {
        0% {
          left: 479px;
          bottom: 100px;
          transform: rotate(-95deg);
        }
        49% {
          left: 445px;
          bottom: 280px;
          transform: rotate(-95deg);
        }
        50% {
          left: 445px;
          bottom: 280px;
          transform: rotate(-180deg);
        }
        99% {
          left: 240px;
          bottom: 280px;
          transform: rotate(-180deg);
          opacity: 1;
        }
        100% {
          opacity: 0;
          transform: rotate(-180deg);
        }
      }
    }
  }
  .alarm {
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
        bottom: 145px;
        left: 440px;
        transform: rotate(-12deg);
        animation: alarmCar 10s linear infinite;
        img {
          width: 57px;
          height: 26px;
        }
      }
      @keyframes alarmCar {
        0% {
          bottom: 39px;
          left: 232px;
          transform: rotate(-27deg);
        }
        50% {
          bottom: 145px;
          left: 440px;
          transform: rotate(-27deg);
        }
        51% {
          bottom: 145px;
          left: 440px;
          transform: rotate(-12deg);
        }
        81% {
          bottom: 168px;
          left: 617px;
          transform: rotate(-12deg);
        }
        99% {
          bottom: 190px;
          left: 760px;
          transform: rotate(-12deg);
          opacity: 1;
        }
        100% {
          bottom: 190px;
          left: 760px;
          transform: rotate(-12deg);
          opacity: 0;
        }
      }
      .point {
        width: 15px;
        height: 15px;
        position: absolute;
        border-radius: 50%;
        background: #0856ea;
        top: 200px;
        left: 540px;
        &::after {
          content: "";
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          top: -82px;
          left: -82px;
          animation: alarmPoint 10s linear infinite;
          background: rgba(0, 0, 255, 0.137);
        }
      }
      @keyframes alarmPoint {
        0% {
          opacity: 1;
          transform: scale(1);
        }
        49% {
          opacity: 1;
          background: rgba(0, 0, 255, 0.137);
        }
        50% {
          opacity: 0.1;
          transform: scale(1.05);
          background: rgba(255, 0, 0, 0.137);
        }
        51% {
          opacity: 1;
          transform: scale(1);
          background: rgba(255, 0, 0, 0.137);
        }
        55% {
          opacity: 0.1;
          transform: scale(1.05);
          background: rgba(255, 0, 0, 0.137);
        }
        60% {
          opacity: 1;
          transform: scale(1);
          background: rgba(255, 0, 0, 0.137);
        }
        65% {
          opacity: 0.1;
          transform: scale(1.05);
          background: rgba(255, 0, 0, 0.137);
        }
        70% {
          opacity: 1;
          transform: scale(1);
          background: rgba(255, 0, 0, 0.137);
        }
        75% {
          opacity: 0.1;
          transform: scale(1.05);
          background: rgba(255, 0, 0, 0.137);
        }
        81% {
          opacity: 1;
          transform: scale(1);
          background: rgba(0, 0, 255, 0.137);
        }
        100% {
          opacity: 1;
          transform: scale(1);
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
  .projectDetail {
    width: 100%;
    height: 538px;
    min-width: 1080px;
    background: rgba(10, 46, 118, 1);
    display: flex;
    &_left {
      width: 55%;
      min-width: 800px;
      height: 100%;
      img {
        height: 100%;
        max-width: 100%;
      }
    }
    &_right {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      align-items: flex-start;
      & > h3 {
        font-size: 32px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        padding: 38px 18px;
      }
      & > p {
        padding: 0 18px;
        max-width: 532px;
        min-width: 200px;
        text-align: left;
        color: #fff;
        line-height: 28px;
      }
    }
  }
  .scene {
    width: 100%;
    min-width: 1080px;
    height: 508px;
    background: #fff;
    & > p {
      padding: 50px 0 60px 0;
      font-size: 24px;
    }
    &_bottom {
      display: flex;
      justify-content: center;
      &_card {
        width: 568px;
        height: 242px;
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
