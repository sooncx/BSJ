<template>
  <div class="financialRisk">
    <div class="headerBox">
      <div class="headerBox_left">
        <div class="headerBox_left_text">
          <p>公众号一站式服务</p>
          <p>
            公众号申请认证、公众号菜单功能、平台对接、报警推送、定制化功能 、 测试/上线发布
          </p>
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
    <div class="autoMenu">
      <div class="autoMenu_content">
        <div class="left">
          <img
            v-lazy="imgUrl[1]"
            alt=""
          >
        </div>
        <div class="right">
          <h3>自定义菜单功能</h3>
          <p>例如加入分销系统，支付功能，商城功能等具体根据客户需求而定</p>
        </div>
      </div>
    </div>

    <div class="alarm">
      <div class="alarm_content">
        <div class="left">
          <h3>报警推送</h3>
          <p>接入平台报警推送,实时获取车辆最新信息</p>
        </div>
        <div class="right">
          <img
            v-lazy="imgUrl[2]"
            alt=""
          >
        </div>
      </div>
    </div>

    <div class="platform">
      <div class="platform_header">平台对接</div>
      <div class="platform_content">
        <div
          class="card"
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
      selectTag: null,
      cards: [
        {
          src: require("../../../assets/img/solutions/Tencent/666.png"),
          title: "车联类",
          text: "一键查车，查询报警，报警推送,下发指令，轨迹回放等；"
        },
        {
          src: require("../../../assets/img/solutions/Tencent/图层 21.png"),
          title: "视控类",
          text: "视频指定链路监控，对讲功能，报警查询,轨迹回放等；"
        },
        {
          src: require("../../../assets/img/solutions/Tencent/图层 22.png"),
          title: "物联网",
          text: "查询流量，卡状态查询，下发短信，流量叠加包等"
        }
      ]
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
    background: radial-gradient(
      circle,
      rgba(0, 106, 228, 1),
      rgba(0, 73, 195, 1)
    );
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
      &_btn {
        margin-top: 40px;
        display: block;
        cursor: pointer;
        width: 130px;
        height: 40px;
        background: #FFFFFF;
        line-height: 40px;
        text-align: center;
        color: #0856EA;
        margin-right: 280px;
        &:hover {
          opacity: 0.9;
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
  .autoMenu {
    width: 100%;
    min-width: 1080px;
    display: flex;
    height: 598px;
    justify-content: center;
    align-items: center;
    background: #fff;
    &_content {
      width: 1000px;
      height: 100%;
      padding: 0 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: left;
        h3 {
          font-size: 32px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          margin-bottom: 27px;
        }
        p {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }
      }
    }
  }
  .alarm {
    width: 100%;
    min-width: 1080px;
    display: flex;
    height: 598px;
    justify-content: center;
    align-items: center;
    background: #f3f5f8;
    &_content {
      width: 1000px;
      height: 100%;
      padding: 0 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: left;
        h3 {
          font-size: 32px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          margin-bottom: 27px;
        }
        p {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }
      }
    }
  }
  .platform {
    width: 100%;
    min-width: 1080px;
    height: 650px;
    background: url("../../../assets/img/solutions/Tencent/55.png");
    display: flex;
    flex-direction: column;
    align-items: center;
    &_header {
      font-size: 32px;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      padding: 51px 0 87px 0;
    }
    &_content {
      height: calc(100% - 170px);
      width: 1080px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      .card {
        width: 326px;
        height: 358px;
        background: rgba(255, 255, 255, 1);
        position: relative;
        transition: all 0.2s linear;
        &:hover {
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.479);
          transform: translate3d(0, -2px, 0);
        }
        img {
          width: 326px;
          height: 200px;
        }
        .cardDetail {
          height: 158px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: left;
          h3 {
            font-size: 18px;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            padding-bottom: 20px;
          }
          p {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
            line-height: 20px;
            width: 255px;
          }
        }
      }
    }
  }
}
</style>
