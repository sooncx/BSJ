<template>
  <div class="Compare">
    <div class="headerBox">
      <div class="headerBox_left">
        <div class="headerBox_left_text">
          <p>人脸识别——Compare API</p>
          <p>检测图片中的人脸，并比对身份</p>
        </div>
        <div class="headerBox_left_btns">
          <div
            class="headerBox_left_btn btn2"
            @click="scrollInto('imgTypes_top')"
          >立即体验</div>
          <div
            class="headerBox_left_btn"
            @click="visabled=true"
          >马上咨询</div>
        </div>
      </div>
    </div>
    <div class="optionBar">
      <div
        @click="selectOptionTag=1, scrollInto('imgTypes_top')"
        :class="selectOptionTag == 1 ? 'selectOption' : ''"
      >产品体验</div>
      <div
        @click="selectOptionTag=2, scrollInto('application_top')"
        :class="selectOptionTag == 2 ? 'selectOption' : ''"
      >应用场景</div>
      <div
        @click="selectOptionTag=3, scrollInto('detection_top')"
        :class="selectOptionTag == 3 ? 'selectOption' : ''"
      >技术优势</div>
    </div>
    <div class="imgTypes">
      <div class="imgTypes_top">
        <h3>产品体验</h3>
        <p>即刻体验的人脸检测能力，请上传一张本地图片或者提供图片URL。</p>
        <br />
        <p>该功能演示是基于只能检测Compare API搭建的，如果您对技术能力有特别要求，请查看下方的产品目录或联系我们</p>
      </div>
      <div class="imgTypes_bottom">
        <DetectCard :cycleNum="5"/>
      </div>
    </div>
    <div class="detection">
      <div class="detection_top">
        <h3>技术优势</h3>
      </div>
      <div class="detection_bottom">
        <div
          class="carBox"
          v-for="index in 2"
          :key="index"
        >
          <img
            v-lazy="imgUrl[index]"
            alt=""
          >
          <div class="cardDetail">
            <h3>{{index == 1?'准确可靠':'稳定服务保障'}}</h3>
          </div>
        </div>
      </div>
    </div>
    <div class="application">
      <div class="application_top">
        <h3>应用场景</h3>
      </div>
      <div class="application_bottom">
        <div
          class="application_carBox"
          v-for="index in [3,4]"
          :key="index"
        >
          <img
            v-lazy="imgUrl[index]"
            alt=""
          >
          <div class="application_cardDetail">
            <h3>{{index == 3?'门禁识别':'签到打卡机'}}</h3>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    <phoneDialog :visabled.sync="visabled" />
  </div>
</template>

<script>
import DetectCard from "@/components/AIDetect/index.vue";
import Footer from "@/components/Footer/index.vue";
import phoneDialog from "@/components/phoneDialog/index.vue";
import imgLazy from "./lazyimg";

export default {
  name: "Compare",
  components: {
    Footer,
    DetectCard,
    phoneDialog,
  },
  data() {
    return {
      imgUrl: imgLazy,
      visabled: false,
      selectTag: null,
      selectOptionTag: 1,
      cards2: [
        {
          src: require("../../../assets/img/solutions/AI/AI (1).png"),
          title: "视频监控",
          text: "如检测是否有违规物体、行为出现",
        },
        {
          src: require("../../../assets/img/solutions/AI/AI (3).png"),
          title: "工业质检",
          text: "如检测图片里微小瑕疵的数量和位置",
        },
        {
          src: require("../../../assets/img/solutions/AI/AI (2).png"),
          title: "医疗诊断",
          text: "如医疗细胞计数、中草药识别等",
        },
      ],
    };
  },
  methods: {
    enter(index) {
      this.selectTag = index;
    },
    scrollInto(classname) {
      const dom = document.getElementsByClassName(classname)[0];
      dom && dom.scrollIntoView({ behavior: "smooth" });
    },
    jump() {
      const routeData = this.$router.resolve({ name: "AIPanel" });
      window.open(routeData.href, "_blank");
    },
  },
};
</script>
<style lang="scss" scoped>
.Compare {
  .headerBox {
    width: 100%;
    min-width: 1080px;
    background: url("../../../assets/img/AIDetect/compare/AI (1).png");
    height: 450px;
    display: flex;
    flex-direction: column;
    background-size: cover;
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
        & p:nth-child(1) {
          font-size: 20px;
          padding-bottom: 20px;
        }
        & p:nth-child(2) {
          width: 410px;
          line-height: 24px;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
        }
      }
      &_btns {
        display: flex;
        margin-right: 130px;
      }
      &_btn {
        margin-top: 40px;
        display: block;
        cursor: pointer;
        width: 130px;
        height: 40px;
        background: transparent;
        border: 1px solid #fff;
        color: #fff;
        line-height: 40px;
        text-align: center;
        margin-left: 20px;
        &:hover {
          opacity: 0.8;
        }
      }
      .btn2 {
        background: #0856ea;
        border-color: #0856ea;
        color: #fff;
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
  .optionBar {
    width: 100%;
    height: 54px;
    background: #0a2e76;
    display: flex;
    align-items: center;
    justify-content: center;
    & > div {
      cursor: pointer;
      padding: 0 10px;
      margin: 0 50px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      border-bottom: 2px solid transparent;
    }
  }
  .selectOption {
    border-bottom: 2px solid #fff !important;
  }

  .imgTypes,
  .detection {
    width: 100%;
    min-width: 1080px;
    display: flex;
    height: 900px;
    justify-content: flex-start;
    align-items: center;
    background: #f5f5f5;
    flex-direction: column;
    &_top {
      height: 150px;
      margin-top: 20px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin-bottom: 30px;
      h3 {
        font-size: 32px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        margin-bottom: 20px;
      }
      p {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
      }
    }
    &_bottom {
      display: flex;
      justify-content: center;
      width: 878px;
      position: relative;
    }
  }
  .detection {
    background: #0a2e76;
    height: 660px;
    &_top {
      h3 {
        color: #fff;
      }
      margin-bottom: 0px;
    }
    &_bottom {
      flex: 1;
      width: 100%;
      .carBox {
        height: 400px;
        width: 500px;
        background: rgb(255, 255, 255);
        margin: 0 40px;
        transition: all 0.2s linear;
        &:hover {
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.479);
          transform: translate3d(0, -2px, 0);
        }
        img {
          max-width: 100%;
          max-height: 100%;
        }
        .cardDetail {
          width: 100%;
          height: calc(100% - 240px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          h3 {
            text-align: center;
            width: 260px;
            font-size: 18px;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
          }
        }
      }
    }
  }
  @media screen and (max-width: 1200px) {
    .carBox {
      height: 350px !important;
      width: 450px !important;
    }
  }
  .application {
    width: 100%;
    min-width: 1080px;
    height: 660px;
    background: rgba(255, 255, 255, 1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    &_top {
      height: 150px;
      width: 100%;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      h3 {
        font-size: 32px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
    }
    &_bottom {
      flex: 1;
      width: 100%;
      display: flex;
      justify-content: center;
    }
    &_carBox {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 400px;
      width: 500px;
      margin: 0 40px;
      transition: all 0.2s linear;
      img {
        width: 100%;
        height: 100%;
      }
    }
    @media screen and (max-width: 1200px) {
      &_carBox {
        height: 350px !important;
        width: 450px !important;
      }
    }
    &_cardDetail {
      position: absolute;
      color: #fff;
      //   position: relative;
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
      &:hover {
        &::after {
          width: 100% !important;
          transition: all 0.3s;
        }
      }
    }
  }
}
</style>
