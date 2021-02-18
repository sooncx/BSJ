<template>
  <div class="financialRisk">
    <div class="headerBox">
      <div class="headerBox_left">
        <div class="headerBox_left_text">
          <p>物联网解决方案</p>
          <p>高速的物联网服务平台 致力打造符合用户需求的物联网产品，实现万物互联</p>
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
    <div class="flowBg">
      <div class="product inWidth">
        <div>
          <h2>查询流量</h2>
          <p>通过后台程序，实现对每个用户账号名下的物联网卡的流量监控查询功能， 卡状态记录查询、统计，库存卡量查询等。直观的把数据展示出来</p>
        </div>
        <img
          v-lazy="imgUrl[1]"
          alt
        />
      </div>
    </div>
    <div class="product inWidth">
      <img
          v-lazy="imgUrl[2]"
        alt
      />
      <div>
        <h2>流量预警</h2>
        <p>
          通过应用，于前端页面在每个车辆所绑定的SIM卡都会设置一个流量预警，在车辆使用SIM卡的流量达到一定的预定值时将会发出报警，也可以通过调用API服务接口获取到流量信息，获取流量信息进行自己的定制化开发
        </p>
      </div>
    </div>
    <div
      class="flowBg"
      style="background:#F3F5F8"
    >
      <div class="product inWidth">
        <div>
          <h2>SIM卡管理</h2>
          <p>物联网卡生命周期管理，提供卡信息查询，可创建下级用户并分配物联卡设置</p>
        </div>
        <img
          v-lazy="imgUrl[3]"
          alt
        />
      </div>
    </div>
    <div style="min-width:1080px;background:#0A2E76">
      <div class="subtool">
        <div class="title">
          <h2>行业案例</h2>
          <p>通过多形态、多样化方案与服务赋能，实现多行业、多场景覆盖</p>
        </div>
        <div class="subtool__content">
          <div
            v-for="(item,index) in subTool"
            :key="index"
          >
            <img v-lazy="item.src" />
            <div class="content">
              <h3>{{item.label}}</h3>
              <p>{{item.content}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="processBox">
      <h2>产品开通流程</h2>
      <div class="inWidth process">
        <div
          v-for="(item,index) in scene"
          :key="index"
        >
          <img v-lazy="item.src">
          <p>{{item.label}}</p>
          <div
            class="dashedline"
            v-if="index !== scene.length-1"
          ></div>
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
      subTool: [
        {
          src: require("../../../assets/img/solutions/IOT/exam1.png"),
          label: "安防监控",
          content:
            "实现无线摄像头、对讲机、消费报警器等设备的联网功能。帮助企业解决设备只能连接、流量实时预警等场景的痛点"
        },
        {
          src: require("../../../assets/img/solutions/IOT/exam2.png"),
          label: "新能源",
          content:
            "实现太阳能、风能等室外发电装备实现稳定物联网功能。帮助企业解决企业专网、流量池管理等场景痛点"
        },
        {
          src: require("../../../assets/img/solutions/IOT/exam3.png"),
          label: "设备租聘",
          content:
            "实共享经济中，共享单车，共享充电宝的设备需要流量支持，帮助这类型的企业解决只能设备联网、定位、流量池管理等场景的痛点"
        },
        {
          src: require("../../../assets/img/solutions/IOT/exam4.png"),
          label: "车联网",
          content:
            "实现行车记录仪、车载中控等设备的连接功能，帮助企业解决智能充值、流量数据运营等场景的痛点"
        }
      ],
      scene: [
        {
          src: require("../../../assets/img/solutions/IOT/step1.png"),
          label: "提交申请"
        },
        {
          src: require("../../../assets/img/solutions/IOT/step2.png"),
          label: "提供测试"
        },
        {
          src: require("../../../assets/img/solutions/IOT/step3.png"),
          label: "签订合同"
        },
        {
          src: require("../../../assets/img/solutions/IOT/step4.png"),
          label: "客户下单"
        },
        {
          src: require("../../../assets/img/solutions/IOT/step5.png"),
          label: "平台分配"
        },
        {
          src: require("../../../assets/img/solutions/IOT/step6.png"),
          label: "激活使用"
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
  .flowBg {
    background: url("../../../assets/img/solutions/IOT/liuliangBg.png")
      no-repeat;
    background-size: 100% 100%;
    min-width: 1080px;
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
    .title {
      font-family: PingFang SC;
      font-weight: 400;
      h2 {
        font-size: 24px;
        color: rgba(255, 255, 255, 1);
        margin-bottom: 23px;
        font-weight: 400;
      }
      p {
        font-size: 14px;
        color: #7198e6;
      }
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
  .processBox {
    width: 100%;
    padding: 50px 0;
    color: #333;
    h2 {
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 400;
    }
    .process {
      margin: 50px auto 0;
      padding: 60px 0;
      p {
        margin-top: 20px;
      }
      > div {
        position: relative;
      }
      .dashedline {
        position: absolute;
        content: "";
        width: 50px;
        border-top: 1px dashed #4c83eb;
        top: 40%;
        right: -150%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
@media screen and (max-width: 1800px) {
  .dashedline {
    right: -130% !important;
  }
}
</style>
