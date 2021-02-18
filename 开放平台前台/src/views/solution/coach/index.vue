<template>
  <div class="financialRisk">
    <div class="headerBox">
      <div class="headerBox_left">
        <div class="headerBox_left_text">
          <p>智能客车解决方案</p>
          <p>{{headerContent}}</p>
          <div>
            <p>网址: <a href="https://v.car900.com" target="_blank">v.car900.com</a></p>
            <p>账号: open03</p>
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
    <div class="alarm">
      <div class="alarm_left">
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
        <span class="wifi">
          <img
            v-lazy="imgUrl[3]"
            alt
          />
        </span>
        <span class="car2">
          <img
            v-lazy="imgUrl[4]"
            alt
          />
        </span>
      </div>
      <div class="alarm_right">
        <div>
          <h3>ADAS报警</h3>
          <p>{{ADASContent}}</p>
        </div>
      </div>
    </div>
    <div class="DSM">
      <div class="DSM_content">
        <div class="DSM_content_left">
          <h3>DSM报警</h3>
          <p>
            DSM对驾驶员的行为进行监控如（疲劳、吸烟、驾驶员变更、长时间不目视前方、打电话、驾驶员身份识别、驾驶员异常、双手同时脱离方向盘报警等）可更好的保证车辆的安全，当驾驶员产生以上行为时。将会引起系统的报警进行弹出窗口提醒和语音播报功能，可及时的通知到监管人员
          </p>
        </div>
        <div class="DSM_content_right">
          <img
            v-lazy="imgUrl[5]"
            alt
          />
        </div>
      </div>
    </div>
    <div class="drive">
      <div class="drive_content">
        <div class="drive_content_left">
          <img
            v-lazy="imgUrl[6]"
            alt
          />
        </div>
        <div class="drive_content_right">
          <h3>3D模拟驾驶</h3>
          <p>{{TDContent}}</p>
        </div>
      </div>
    </div>
    <div class="camera">
      <div class="camera_content">
        <div class="camera_content_left">
          <h3>云台控制</h3>
          <p>{{yuntaiContent}}</p>
        </div>
        <div class="camera_content_right">
          <img
            v-lazy="imgUrl[7]"
            alt
          />
        </div>
      </div>
    </div>
    <!-- <div class="project">
      <div class="project_top">
        <p>方案优势</p>
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
      <div class="solution_content">
        <div class="solution_content_left">
          <h3>方案概述</h3>
          <p>
            博云视频监控管理平台主要实现集中监控、 实现视频、录像存储、
            录像管理历史轨迹查询、音频输入输出、语音对讲广播 功能、
            报警功能、检索回放、 数据转发、定位、云台控制、抓拍、
            轮巡等先关功能。该管理平台可应用于几千路的大型无线视频监控系统、
            也可以用于到百路的中 型无线视频监控系统和几十路小型无线视频监控系统。
            管理平台友好，操作简单，可提供灵活多样的部署方案，满足大、中、
            小型项目的各种不同环境需求。
          </p>
        </div>
        <div class="solution_content_right">
          <img
            src="../../../assets/img/solutions/coach/content.png"
            alt=""
          >
        </div>
      </div>
    </div>-->
    <!-- <div class="scene">
      <div class="scene_left">
        <img
          src="../../../assets/img/solutions/coach/footer.png"
          alt=""
        >
      </div>
      <div class="scene_right">
        <p>
          博云平台应用于长途客运车辆，可方便交通管理部门、运输集团等进行远程监控、视频调取、回放及远程实时直播等，包括上下客情况、驾驶员视频、车内视频及车外视频，同时
          可监控夜间休息情况，极大的方便了客运货运安全管理。
        </p>
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
        "博云推出了一整套针对“两客一危”车辆智能化管理系统，从前端的硬件设备到后端的系统管理平台，无论是对于危险品运输车辆或是长途客运车辆，都能形成全方位的监控管理，车辆的各种探测报警、驾驶员疲劳检测预警、驾驶员人脸识别、驾驶行为分析、车载视频监控、卫星定位等等，以确保车辆行车安全。",
      ADASContent:
        "ADAS对驾驶车辆进行监控如（道路偏离、FCW前车碰撞预警、前车近距等）可更好的保证车辆的安全。当车辆发生以上不良的行为时，系统会自动监控截图保存，并且对当时摄像头照到的景象进行视频文件的保存，并在监控系统中进行弹出窗口提示监控人员",
      TDContent:
        "模拟驾驶员正在驾驶车辆的行驶时实时音视频，以及速度，行驶路线，结合3D地图 ，轨迹纠偏，轨迹平滑移动技术以及道路限速信息，更直观立体得展现车辆实时情况",
      yuntaiContent:
        "可进行系统平台与车载云台的对接，通过云台可控制摄像头的旋转、视距等。方便监控人员从各个摄像头中，可从不同的角度，了解到车辆的行驶状态、环境等",
      project: [
        {
          src: require("../../../assets/img/solutions/coach/jieru.png"),
          label: "大容量接入"
        },
        {
          src: require("../../../assets/img/solutions/coach/diaodu.png"),
          label: "车辆调度管理"
        },
        {
          src: require("../../../assets/img/solutions/coach/baobiao.png"),
          label: "报表统计"
        },
        {
          src: require("../../../assets/img/solutions/coach/yichang.png"),
          label: "异常行为关注"
        },
        {
          src: require("../../../assets/img/solutions/coach/baojing.png"),
          label: "报警信息接收"
        },
        {
          src: require("../../../assets/img/solutions/coach/yuyin.png"),
          label: "语音传输功能"
        }
      ]
    };
  },
  methods: {}
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
  .alarm {
    width: 100%;
    min-width: 1080px;
    height: 450px;
    background: #fff;
    display: flex;
    background: #f3f5f8;
    &_left {
      display: flex;
      width: 850px;
      height: 100%;
      position: relative;
      align-items: flex-start;
      img {
        height: 100%;
        width: 850px;
      }
      .wifi {
        position: absolute;
        bottom: 174px;
        left: 425px;
        img {
          width: 20px;
          height: 24px;
          animation: show 1s linear infinite;
        }
      }
      @keyframes show {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
      .car1 {
        position: absolute;
        bottom: 181px;
        left: 384px;
        img {
          width: 50px;
          height: 45px;
        }
      }
      .car2 {
        position: absolute;
        bottom: 138px;
        left: 437px;
        img {
          width: 50px;
          height: 45px;
        }
      }
    }
    &_right {
      max-width: calc(100% - 850px);
      height: 100%;
      display: flex;
      flex: 1;
      align-items: center;
      margin-left: -5%;
      justify-content: center;
      flex-direction: column;
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
  .DSM {
    width: 100%;
    min-width: 1080px;
    height: 538px;
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
        padding: 0 80px 0 40px;
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
    }
  }

  .drive {
    width: 100%;
    min-width: 1080px;
    height: 589px;
    background: rgba(255, 255, 255, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    &_content {
      display: flex;
      &_left {
        img {
          width: 800px;
          margin-left: -100px;
        }
      }
      &_right {
        max-width: 555px;
        min-width: 150px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        padding: 0 40px;
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
  .camera {
    width: 100%;
    min-width: 1080px;
    height: 508px;
    background: rgba(243, 245, 248, 1);
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
        color: #333;
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
    justify-content: center;
    align-items: center;
    &_content {
      display: flex;
      justify-content: center;
      align-items: center;
      &_left {
        width: 55%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
        h3 {
          width: 565px;
          text-align: left;
          font-size: 32px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          padding-bottom: 37px;
        }
        p {
          width: 565px;
          text-align: left;
          line-height: 28px;
          color: #333;
        }
      }
      &_right {
        padding-left: 80px;
        flex: 1;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        img {
          width: 424px;
          height: 330px;
        }
      }
    }
  }
  .scene {
    width: 100%;
    min-width: 1080px;
    height: 589px;
    background: rgba(10, 46, 118, 1);
    display: flex;
    &_left {
      flex: 1;
      height: 100%;
      img {
        max-width: 100%;
        min-width: 900px;
        height: 100%;
      }
    }
    &_right {
      width: 45%;
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 0 20px;
      p {
        max-width: 406px;
        min-width: 120px;
        text-align: left;
        color: #fff;
        line-height: 28px;
      }
    }
  }
}
</style>
