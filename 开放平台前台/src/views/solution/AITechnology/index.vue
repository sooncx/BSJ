<template>
  <div class="financialRisk">
    <div class="headerBox">
      <div class="headerBox_left">
        <div class="headerBox_left_text">
          <p>AI 视觉技术</p>
          <p>运用图像识别深度学习算法，精准过滤，从客观事物的图像中提取信息，进行处理并加以理解，最终用于实际检测、测量和控制。特点是速度快、信息量大、功能多。</p>
        </div>
        <div class="headerBox_left_btns">
          <div
            class="headerBox_left_btn"
            @click="visabled=true"
          >马上咨询</div>
          <div
            class="headerBox_left_btn btn2"
            @click="jump"
          >立即体验</div>
        </div>
      </div>
      <div class="headerBox_right">
        <img
          v-lazy="imgUrl[4]"
          alt
        />
      </div>
    </div>
    <div class="imgTypes">
      <div class="imgTypes_top">
        <h3>图像分类</h3>
        <p>定制识别一张图中是否是某类物体/状态/场景，适合图片中主体或者状态单一的场景</p>
      </div>
      <div class="imgTypes_bottom">
        <div
          class="carBox"
          v-for="(item, index) in cards"
          :key="index"
        >
          <img
            v-lazy="item.src"
            alt=""
          >
          <div class="cardDetail">
            <h3>{{item.title}}</h3>
            <p>{{item.text}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="detection">
      <div class="detection_top">
        <h3>物体检测</h3>
        <p>定制识别图中每个物体的位置、名称。适合有多个主体、或要识别位置及数量的场景</p>
      </div>
      <div class="detection_bottom">
        <div
          class="carBox"
          v-for="(item, index) in cards2"
          :key="index"
        >
          <img
            v-lazy="item.src"
            alt=""
          >
          <div class="cardDetail">
            <h3>{{item.title}}</h3>
            <p>{{item.text}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="dataSupport">
      <div class="dataSupport_content">
        <div class="dataSupport_content_left">
          <img
            v-lazy="imgUrl[3]"
            alt
          />
        </div>
        <div class="dataSupport_content_right">
          <h3>数据支持</h3>
          <p>全方位支持训练数据的高质量采集与高效标注，支持在模型迭代过程中不断扩充数据，助力提升模型效果</p>
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
    phoneDialog,
  },
  data() {
    return {
      imgUrl: imgLazy,
      visabled: false,
      selectTag: null,
      cards: [
        {
          src: require("../../../assets/img/solutions/AI/AI (6).png"),
          title: "图片内容检索",
          text: "定制训练需要识别的各种物体，并结合业务信息展现更丰富识别结果",
        },
        {
          src: require("../../../assets/img/solutions/AI/AI (7).png"),
          title: "制造业分拣或质检",
          text: "定制生产线上各种产品识别，进而实现自动分拣或者质检",
        },
        {
          src: require("../../../assets/img/solutions/AI/AI (8).png"),
          title: "医疗诊断",
          text: "定制识别医疗图像，辅助医生肉眼诊断",
        },
      ],
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
    jump() {
      this.$router.push({
        name: "AIDetect",
      });
      // const routeData = this.$router.resolve({ name: "AIPanel" });
      // window.open(routeData.href, "_blank");
    },
  },
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
        background: rgba(8, 86, 234, 1);
        line-height: 40px;
        text-align: center;
        color: #fff;
        // margin-right: 280px;
        margin-left: 20px;
        &:hover {
          opacity: 0.8;
        }
      }
      .btn2 {
        background: rgb(234, 53, 8);
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
  .imgTypes,
  .detection {
    width: 100%;
    min-width: 1080px;
    display: flex;
    height: 730px;
    justify-content: space-around;
    align-items: center;
    background: #f5f5f5;
    flex-direction: column;
    &_top {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      h3 {
        font-size: 32px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        padding-bottom: 36px;
      }
      p {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
      }
    }
    &_bottom {
      margin-top: -50px;
      display: flex;
      .carBox {
        width: 380px;
        height: 440px;
        background: rgba(255, 255, 255, 1);
        margin-right: 20px;
        transition: all 0.2s linear;
        &:hover {
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.479);
          transform: translate3d(0, -2px, 0);
        }
        img {
          width: 100%;
          height: 240px;
        }
        .cardDetail {
          width: 100%;
          height: calc(100% - 240px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          h3 {
            text-align: left;
            width: 260px;
            font-size: 18px;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            margin-bottom: 18px;
          }
          p {
            text-align: left;
            width: 260px;
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            line-height: 26px;
          }
        }
      }
    }
  }
  @media screen and (max-width: 1200px) {
    .carBox {
      width: 320px !important;
    }
  }
  .detection {
    background: #0a2e76;
    &_top {
      h3 {
        color: #fff;
      }
      p {
        color: #fff;
      }
    }
  }
  .dataSupport {
    width: 100%;
    min-width: 1080px;
    height: 670px;
    background: rgba(255, 255, 255, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    &_content {
      display: flex;
      &_left {
        img {
          height: 421;
        }
      }
      &_right {
        max-width: 500px;
        min-width: 150px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        padding: 0 0 0 100px;
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
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
        }
      }
    }
  }
}
</style>
