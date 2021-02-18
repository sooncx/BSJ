<template>
  <div class="businessCooperation">
    <div class="businessCooperation__topImg">
      <h3>商务合作</h3>
      <p>{{content}}</p>
    </div>
    <div class="overview">
      <div class="overview__content">
        <div class="items" v-for="(items, index) in overviewList" :key="index">
          <div class="items__left">
            <i class="iconfont" :class="items.icon"></i>
            <div class="msgBox">
              <h2 class="title">{{items.title}}</h2>
              <p>{{items.english}}</p>
            </div>
          </div>
          <div class="items__right">
            <p>{{items.desc}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="solutionBox">
      <h2>一站式解决方案</h2>
      <div class="solutionBox__container">
        <div class="solutionBox__items" v-for="(item,index) in solutions" :key="index">
          <div>
            <img v-lazy="item.src" class="solutionBox__img" />
          </div>
          <h3>{{item.label}}</h3>
          <p>{{item.content}}</p>
        </div>
      </div>
      <div class="solutionBox__btn" @click="visabled=true">咨询合作</div>
    </div> -->
    <Footer />
    <phoneDialog :visabled.sync="visabled" />
  </div>
</template>

<script>
import Footer from "../../components/Footer/index.vue";
import phoneDialog from "../../components/phoneDialog/index.vue";
// @ is an alias to /src

export default {
  name: "businessCooperation",
  components: {
    Footer,
    phoneDialog
  },
  data() {
    return {
      visabled: false,
      selectSolution: false,
      selectSolutions: 0,
      content:
        "我们提供领先的技术资源，帮助合作伙伴，共同助力产业智能化升级。以博云领先的技术研发储备和务实的产业智能技术实践，赋能产业智能合作伙伴，合作伙伴可以轻松获得丰富资源。与博云合作共赢，共同迎接产业智能化灿烂的未来！",
      solutions: [
        {
          label: "部署方案",
          value: 0,
          content: "根据企业实际需求提供硬件到软件,从0到1一站式解决方案",
          src: require("@/assets/img/business/bushu.png")
        },
        {
          label: "定制化平台",
          value: 1,
          content: "根据客户业务需求，基于博云平台类产品定制化开发",
          src: require("@/assets/img/business/dingzhi.png")
        },
        {
          label: "APP/H5/Web开发",
          value: 2,
          content: "根据客户业务需求,开发客户所需要的产品",
          src: require("@/assets/img/business/APP.png")
        }
      ],
      overviewList: [
        {
          title: "部署方案",
          english: "Deployment Scheme",
          icon: "icon-wulianwangxitong",
          desc:
            "根据企业实际需求提供硬件到软件,从0到1一站式解决方案"
        },
        {
          title: "定制化平台",
          english: "Customized Platform",
          icon: "icon-lingyuguanli",
          desc:
            "根据客户业务需求，基于博云平台类产品定制化开发"
        },
        {
          title: "APP/H5/Web开发",
          english: "APP/H5/Web Development",
          icon: "icon-pingtai",
          desc:
            "根据客户业务需求,开发客户所需要的产品"
        },
        {
          title: "深度定制",
          english: "In-depth Customization",
          icon: "icon-dingzhi",
          desc:
            "平台支持深度定制，服务器部署,接口定制，平台个性化定制，根据需求提供各种解决方案"
        }
      ]
    };
  },
  methods: {
    enterSolutions(index, item) {
      this.selectSolutions = index;
      this.selectSolution = true;
      this.solutionsDetail.title = item.label;
      this.solutionsDetail.secondTitle = item.content;
    }
  }
};
</script>
<style lang="scss" scoped>
.businessCooperation {
  width: 100%;
  min-width: 1080px;
  &__topImg {
    height: 450px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: url("../../assets/img/business/swhz.png");
    background-size: cover;
    color: #fff;
    h3 {
      padding-bottom: 30px;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 500;
    }
    p {
      line-height: 20px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 300;
      width: 510px;
      line-height: 25px;
    }
  }

  .overview {
    font-family: PingFang SC;
    min-width: 1080px;
    width: 100%;
    background: #e8edf5;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &__content {
      display: flex;
      width: 1080px;
      padding: 50px 0;
      flex-flow: column;
      .items {
        height: 240px;
        width: 1080px;
        margin-bottom: 34px;
        display: flex;
        transition: all 0.2s linear;
        &__left {
          background: #0856ea;
          width: 440px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding-left: 30px;
          i {
            font-size: 89px;
            color: #fff;
            margin-right: 47px;
          }
          .msgBox {
            text-align: left;
            color: #fff;
            .title {
              font-size: 32px;
              font-family: PingFang SC;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
              height: 80px;
              position: relative;
              &::after {
                content: "";
                position: absolute;
                transition: all 0.2s;
                height: 2px;
                width: 60px;
                background: #fff;
                left: 0;
                bottom: 25px;
              }
            }
          }
        }
        &__right {
          background: #fff;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          p {
            width: 80%;
            line-height: 30px;
            font-size: 16px;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
            text-align: left;
          }
        }
        &:hover {
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          transform: translate3d(0, -2px, 0);
          .title::after {
            width: 100%;
          }
        }
      }
    }
  }

  &__nav {
    height: 54px;
    line-height: 54px;
    width: 100%;
    background: rgba(3, 34, 94, 1);
    display: flex;
    justify-content: center;
    font-family: PingFang SC;
    .items {
      font-size: 18px;
      font-weight: 400;
      margin: 0 60px;
      color: rgba(101, 126, 174, 1);
      cursor: pointer;
      position: relative;
    }
    .active {
      color: #fff;
      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        width: 100%;
        left: 0;
        height: 4px;
        background: rgba(8, 86, 234, 1);
      }
    }
    .items:hover {
      color: #fff;
    }
  }

  &__navContent {
    height: 683px;
    background: rgba(243, 245, 248, 1);
    font-family: PingFang SC;
    padding: 64px 0 56px;
    box-sizing: border-box;
    h3 {
      font-size: 32px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
    .content {
      width: 1199px;
      height: 488px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 8px 10px 0px rgba(0, 0, 0, 0.05);
      margin: 44px auto 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 63px 0 82px;
      box-sizing: border-box;
      img {
        width: 428px;
        height: 310px;
        vertical-align: bottom;
      }
      .left {
        width: 531px;
        height: 310px;
        font-family: PingFang SC;
        text-align: left;
        h5 {
          font-size: 20px;
          color: rgba(51, 51, 51, 1);
        }
        p {
          margin-top: 51px;
          font-size: 14px;
          color: rgba(102, 102, 102, 1);
          line-height: 25px;
        }
      }
    }
  }
}
.solutionBox {
  background: #f3f5f8;
  padding: 51px 0 100px;
  h2 {
    font-size: 32px;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  &__container {
    min-width: 1080px;
    width: 1080px;
    display: flex;
    margin: 87px auto 0;
    justify-content: space-between;
  }
  &__items {
    background: #fff;
    padding: 46px 35px;
    box-sizing: border-box;
    transition: all 0.2s linear;
    position: relative;
    div {
      width: 180px;
      height: 180px;
    }
    h3 {
      color: #0856ea;
      font-size: 18px;
      margin: 40px 0 20px;
      font-family: PingFang SC;
      font-weight: 400;
    }
    p {
      width: 260px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 25px;
    }
    &:hover {
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
      transform: translate3d(0, -2px, 0);
      .solutionBox__img {
        animation: upDown 1.5s linear infinite;
      }
    }
  }
  &__img {
    width: 180px;
    height: 180px;
    position: absolute;
    left: 25%;
  }
  &__btn {
    width: 170px;
    height: 42px;
    line-height: 42px;
    background: rgba(8, 86, 234, 1);
    box-shadow: 0px 6px 10px 0px rgba(9, 76, 203, 0.15);
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    margin: 81px auto 0;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
