<template>
  <div class="Documentation">
    <div
      class="Documentation_card"
      v-for="(item, index) in DocData"
      :key="index"
    >
      <h3>{{item.txt}}</h3>
      <div>
        <img v-lazy="item.src">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      DocData: [
        {
          src: require("../../../assets/img/controlPanel/Documentation/step1.png"),
          txt: "第一步：点击注册"
        },
        {
          src: require("../../../assets/img/controlPanel/Documentation/step2.png"),
          txt: "第二步：点击注册入口"
        },
        {
          src: require("../../../assets/img/controlPanel/Documentation/step3.png"),
          txt: "第三步：填写注册信息"
        },
        {
          src: require("../../../assets/img/controlPanel/Documentation/step4.png"),
          txt: "第四步：登录系统"
        },
        {
          src: require("../../../assets/img/controlPanel/Documentation/step5.png"),
          txt: "第五步：找到绑定账号相关菜单"
        },
        {
          src: require("../../../assets/img/controlPanel/Documentation/step6.png"),
          txt: "第六步：打开绑定账号对应菜单"
        },
        {
          src: require("../../../assets/img/controlPanel/Documentation/step7.png"),
          txt: "第七步：填写对应的信息"
        },
        {
          src: require("../../../assets/img/controlPanel/Documentation/step8.png"),
          txt: "第八步：绑定对应平台账号"
        },
        {
          src: require("../../../assets/img/controlPanel/Documentation/step9.png"),
          txt: "第九步：查看绑定结果"
        },
        {
          src: require("../../../assets/img/controlPanel/Documentation/step10.png"),
          txt: "第十步：可查看配额信息"
        },
        {
          src: require("../../../assets/img/controlPanel/Documentation/step11.png"),
          txt: "第十一步：可在配额中点击购买套餐进行套餐升级"
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.Documentation {
  background: #fff;
  height: 100%;
  width: 100%;
  overflow: auto;
  &_card {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    // min-width: 1080px;
    padding: 20px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.137);
    margin-bottom: 10px;
    h3 {
      padding-bottom: 20px;
    }
    img {
        // border: dotted 1px #333;
    }
  }
}
</style>
