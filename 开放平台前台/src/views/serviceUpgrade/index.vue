<template>
  <div class="serviceUpgrade">
    <div class="serviceUpgrade_header">
      <h3>博云开放平台服务升级计划</h3>
      <p>博云致力于为各类汽车金融机构提供全流程风控管理解决方案。</p>
      <p>在行业数字化转型过程中，为客户量身定制数字化转型咨询方案。</p>
    </div>
    <div class="serviceUpgrade_content">
      <div class="title">
        <h3>提升调用量</h3>
        <p>博云开放平台目前针对 基础服务API 有每日免费调用量的限制，开发者可通过如下方式提升调用量</p>
      </div>
      <div class="cardBox">
        <div class="top">API接口调用量升级包</div>
        <div class="content">
          <!-- <div class="content_top">
            <span class="left">￥<p>4000</p></span>
            <span class="right">
              <p>元/月(每100QPS)</p>
              <p>按需购买，消除限制</p>
            </span>
          </div>-->
          <div>
            <p style="font-size:20px;color:rgba(30,97,232,1);">如需升级请联系工作人员</p>
            <p style="font-size:16px;color:rgba(134,141,153,1);margin-top:14px;">按需购买，消除限制</p>
          </div>
          <div class="content_bottom" @click="visabled=true">立即购买</div>
        </div>
        <div class="footer">API接口调用量需要针对每个应用单独提升，通过选定key对调用量进行升级，到期后恢复至购买前的调用量</div>
      </div>
    </div>
    <Footer />
    <phoneDialog :visabled.sync="visabled" />
  </div>
</template>

<script>
import phoneDialog from "@/components/phoneDialog/index.vue";
import Footer from "../../components/Footer/index.vue";
// @ is an alias to /src

export default {
  name: "serviceUpgrade",
  components: {
    Footer,
    phoneDialog
  },
  data() {
    return {
      visabled: false
    };
  }
};
</script>
<style lang="scss" scoped>
.serviceUpgrade {
  background: #f3f5f8;
  width: 100%;
  min-width: 1080px;
  &_header {
    width: 100%;
    background-size: cover;
    height: 450px;
    flex: 1;
    overflow: hidden;
    background: url("../../assets/img/serviceUpgrade/cycle.png");
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
    }
  }
  &_content {
    height: 600px;
    width: 100%;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .title {
      h3 {
        color: #333333;
        font-size: 32px;
        font-family: PingFang SC;
        font-weight: 400;
        padding-bottom: 35px;
      }
      p {
        color: #777777;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        padding-bottom: 57px;
      }
    }
    .cardBox {
      width: 600px;
      height: 332px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(223, 228, 239, 1);
      display: flex;
      justify-content: center;
      flex-direction: column;
      .top {
        height: 40px;
        width: 100%;
        line-height: 40px;
        text-align: left;
        padding-left: 20px;
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(75, 80, 92, 1);
      }
      .content {
        flex: 1;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-top: 40px;
        &_top {
          display: flex;
          .left {
            padding-right: 20px;
            font-size: 56px;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(75, 80, 92, 1);
            display: flex;
            p {
              color: #1e61e8;
            }
          }
          .right {
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: left;
            p {
              padding: 2px 0;
            }
            & p:nth-child(1) {
              color: #9599a0;
            }
            & p:nth-child(2) {
              color: #4b505c;
            }
          }
        }
        &_bottom {
          cursor: pointer;
          margin-top: 68px;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 180px;
          height: 44px;
          background: linear-gradient(
            0deg,
            rgba(35, 103, 238, 1),
            rgba(30, 87, 200, 1)
          );
          border-radius: 22px;
          &:hover {
            background: linear-gradient(
              0deg,
              rgb(27, 92, 223),
              rgb(21, 69, 165)
            );
          }
        }
      }
      .footer {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        white-space: nowrap;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(149, 153, 160, 1);
      }
    }
  }
}
</style>
