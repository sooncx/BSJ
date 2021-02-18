<template>
  <div class="financialRisk">
    <div class="headerBox">
      <div class="headerBox_left">
        <div class="headerBox_left_text">
          <p>智能监护解决方案</p>
          <p>
            为各个行业的提供智能定位，集个人使用的GPS跟踪定位仪，车辆、 贵重货物、宠物的定位监控。使用基于阿里云平台进行数据分析，实现数据可视化呈现与设备轨迹回放，提高用户的监控效率和管理水平。
          </p>
          <div>
            <p>网址: <a href="http://ol.car900.com/" target="_blank">ol.car900.com</a></p>
            <p>账号: open02</p>
            <p>密码: 123456</p>
          </div>
        </div>
        <div
          class="headerBox_left_btn"
          @click="visabled=true"
        >马上咨询</div>
      </div>
      <div class="headerBox_right">
        <img
          v-lazy="imgUrl[0]"
          alt
        />
      </div>
    </div>
    <div class="project">
      <div class="project_top">
        <p>方案优势</p>
        <p>随时掌握人员状况，远程守护他们的安全</p>
      </div>
      <div class="project_bottom inWidth">
        <div
          class="project_bottom_card"
          v-for="(item, index) in project"
          :key="index"
        >
          <img
            v-lazy="item.src"
            alt
          />
          <p>{{item.label}}</p>
        </div>
      </div>
    </div>
    <div class="overview">
      <h2 class="title">方案概述</h2>
      <div class="imgContainer inWidth">
        <div
          v-for="(item, index) in overview"
          :key="index"
        >
          <img
            v-lazy="item.src"
            :class="item.label==='传输'?'chuanshu':''"
          />
          <p v-if="item.label!=='传输'">{{item.label}}</p>
        </div>
      </div>
      <p class="content">{{overviewContent}}</p>
    </div>
    <div class="product inWidth">
      <div>
        <h2>数据产品</h2>
        <p>提供多种数据验证产品，支持API接口调用。数据产品具有较高的准确度和覆盖率，并且时效性强。</p>
      </div>
      <img
        v-lazy="imgUrl[1]"
        alt
      />
    </div>
    <div style="background:#F3F5F8;min-width:1080px;">
      <div class="product inWidth">
        <img
          v-lazy="imgUrl[2]"
          alt
        />
        <div>
          <h2>平台产品</h2>
          <p>平台产品包括实时数据监、违规报警、历史轨迹回放、停留位置统计、经常停留点统计等各类统计报表与功能，为用户提供各种类型的数据可供分析参考。</p>
        </div>
      </div>
    </div>
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
          <span v-show="index < 3">- - -</span>
        </div>
      </div>
    </div>-->
    <div style="min-width:1080px;background:#0A2E76">
      <div class="subtool">
        <h2>功能介绍</h2>
        <div class="subtool__content">
          <div
            v-for="(item,index) in subTool"
            :key="index"
          >
            <img v-lazy="item.src">
            <div class="content">
              <h3>{{item.label}}</h3>
              <p>{{item.content}}</p>
            </div>
          </div>
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
          src: require("../../../assets/img/solutions/monitor/dingwei.png"),
          label: "实时位置"
        },
        {
          src: require("../../../assets/img/solutions/monitor/guiji.png"),
          label: "轨迹追踪"
        },
        {
          src: require("../../../assets/img/solutions/monitor/jisuan.png"),
          label: "强大运算能力"
        },
        {
          src: require("../../../assets/img/solutions/monitor/guanli.png"),
          label: "灵活易用"
        },
        {
          src: require("../../../assets/img/solutions/monitor/jianting.png"),
          label: "即时监听"
        }
      ],
      overview: [
        {
          src: require("../../../assets/img/solutions/monitor/zhinengdingwei.png"),
          label: "智能定位设备"
        },
        {
          src: require("../../../assets/img/solutions/monitor/chuanshu.png"),
          label: "传输"
        },
        {
          src: require("../../../assets/img/solutions/monitor/jizan.png"),
          label: "基站"
        },
        {
          src: require("../../../assets/img/solutions/monitor/chuanshu.png"),
          label: "传输"
        },
        {
          src: require("../../../assets/img/solutions/monitor/fuwuqi.png"),
          label: "服务器"
        },
        {
          src: require("../../../assets/img/solutions/monitor/chuanshu.png"),
          label: "传输"
        },
        {
          src: require("../../../assets/img/solutions/monitor/pingtai.png"),
          label: "平台/APP"
        }
      ],
      overviewContent:
        "通过汲取先进的信息技术（物联网、移动互联技术、多重定位技术等），创建“人员+终端+系统”的智能远程监护服务模式，智能人员便捷式定位终端作为通讯入口，采集人员位置信息，结合智慧管理平台帮助家人和管理人员通过安全围栏、轨迹回放、实时定位、一键求救、远程聆听等功能，随时掌握人员状况，远程守护他们的安全",
      subTool: [
        {
          src: require("../../../assets/img/solutions/monitor/fun1.png"),
          label: "实时数据监控",
          content:
            "通过设备中心可以随时查看到设别所在的位置，掌握设备的情况，起到监控位置的作用，防止其不知所踪"
        },
        {
          src: require("../../../assets/img/solutions/monitor/fun2.png"),
          label: "违规报警",
          content:
            "可设定违规规则，当设备触犯规则时可像平台发送报警提醒监控人员，监控人员可根据提醒进行设备的重点监控，以便意外发生"
        },
        {
          src: require("../../../assets/img/solutions/monitor/fun3.png"),
          label: "轨迹回放",
          content:
            "通过平台数据库记录的GPS数据，管理中心可以查询所有设备的历史行驶轨迹，便于事后分析、查证"
        },
        {
          src: require("../../../assets/img/solutions/monitor/fun4.png"),
          label: "统计报表",
          content:
            "平台通过设备回传的数据可进行数据分析，对设备的停留位置、经常停留点、行驶统计、里程等进行不同维度的全面分析，为管理人员提供真实"
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
          src: require("../../../assets/img/solutions/monitor/app1.png"),
          label: "人员定位"
        },
        {
          src: require("../../../assets/img/solutions/monitor/app2.png"),
          label: "贵重货物定位"
        },
        {
          src: require("../../../assets/img/solutions/monitor/app3.png"),
          label: "车辆定位"
        },
        {
          src: require("../../../assets/img/solutions/monitor/app4.png"),
          label: "宠物定位"
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
  .inWidth {
    display: flex;
    width: 60%;
    min-width: 1000px;
    justify-content: space-between;
  }
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
    background: #fff;
    &_top {
      display: flex;
      flex-direction: column;
      align-items: center;
      & p {
        color: #333333;
        padding: 5px;
        max-width: 500px;
        line-height: 24px;
      }
      & p:nth-child(1) {
        font-size: 20px;
        padding: 40px 0;
        margin-top: 20px;
      }
    }
    &_bottom {
      margin: 80px auto 0;
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
  .overview {
    width: 100%;
    min-width: 1080px;
    background: #f3f5f8;
    h2 {
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      padding: 50px 0;
    }

    .imgContainer {
      margin: 100px auto 0;
      > div {
        display: flex;
        flex-flow: column;
        justify-content: flex-end;
        p {
          margin-top: 25px;
        }
        .chuanshu {
          margin-bottom: 80px;
        }
      }
    }
    .content {
      width: 40%;
      min-width: 800px;
      margin: 0 auto;
      padding: 100px 0 50px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      text-align: left;
      line-height: 25px;
    }
  }
  .product {
    margin: 0 auto;
    padding: 135px 0;
    align-items: center;
    div {
      h2 {
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        margin-bottom: 20px;
      }
      p {
        line-height: 25px;
        color: #666666;
      }
      text-align: left;
      width: 440px;
    }
  }
  .subtool {
    width: 100%;
    padding: 50px 0 0;
    h2 {
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
    }
    &__content {
      width: 70%;
      min-width: 1050px;
      display: flex;
      justify-content: space-around;
      margin: 80px auto 0;
      flex-wrap: wrap;
      > div {
        width: 40%;
        min-width: 490px;
        margin-bottom: 50px;
        transition: all 0.2s linear;
        &:hover {
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
          transform: translate3d(0, -2px, 0);
        }
        img {
          width: 100%;
        }
      }
      .content {
        padding: 35px 100px 0 45px;
        height: 130px;
        background: #fff;
        text-align: left;
        h3 {
          font-size: 18px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          margin-bottom: 20px;
        }
        p {
          color: #666;
          line-height: 25px;
        }
      }
    }
  }
  .solution {
    color: solution;
    width: 100%;
    min-width: 1080px;
    height: 500px;
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
        margin: 20px 30px;
        padding: 20px 30px;
        width: 130px;
        height: 200px;
        background: #fff;
        &:hover {
          box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.233);
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
        span {
          color: #b7bcc7;
          position: relative;
          pointer-events: none;
          left: 175px;
          top: -80px;
          &::after {
            content: "";
            position: absolute;
            border-left: 12px solid #b7bcc7;
            border-top: 7px solid transparent;
            border-bottom: 7px solid transparent;
            width: 0px;
            height: 0px;
            top: 2px;
            right: -15px;
          }
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
      flex-wrap: wrap;
      width: 1000px;
      margin: 0 auto;
      &_card {
        cursor: pointer;
        width: 170px;
        height: 180px;
        margin: 20px 30px;
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
            left: 50%;
            transform: translate(-50%);
            transition: all 0.3s;
          }
        }
        .active {
          &::after {
            width: 100% !important;
            transition: all 0.3s;
          }
        }
      }
    }
  }
}
</style>
