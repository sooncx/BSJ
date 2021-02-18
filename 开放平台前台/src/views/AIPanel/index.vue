<template>
  <div class="AIPanel">
    <div class="AIPanel_box">
      <div class="item">
        <div class="header">
          <div class="title">
            Detect API
          </div>
          <div class="content">
            检测图片中的人脸（支持一至多张人脸），并标记出边框。您也可以对尺寸最大的5张人脸进行分析，获得面部关键点、头部姿态信息。
          </div>
        </div>
        <div class="footer">
          API演示
        </div>
      </div>
      <div class="item">
        <div class="header">
          <div class="title">
            Compare API
          </div>
          <div class="content">
            计算两张脸的相似程度，并给出置信度评分。 即1:1身份验证。
          </div>
        </div>
        <div class="footer">
          API演示
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.AIPanel {
  width: 100%;
  height: 100%;
  background: #fff;
  min-width: 1080px;
  overflow: auto;
  &_box {
    padding: 50px;
    flex: 1;
    min-width: 1080px;
    display: flex;
    .item {
      width: 305px;
      height: 160px;
      margin-right: 60px;
      .header {
        background: url("../../assets/img/AIPanel/bg.png");
        background-size: 100% 100%;
        height: 120px;
        padding: 16px 20px;
        background-repeat: no-repeat;
        display: flex;
        align-items: flex-start;
        // justify-content: space-between;
        flex-direction: column;
        border: 1px solid #ff6a00;
        position: relative;
        &::after {
          position: absolute;
          content: "";
          background-image: url("../../assets/img/AIPanel/tag.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
          width: 70px;
          height: 70px;
          right: -7px;
          top: -7px;
          z-index: 9999;
        }
        .title {
          text-align: left;
          margin-bottom: 15px;
          padding-bottom: 5px;
          font-weight: bold;
          border-bottom: 1px solid #ff6a00;
          transition: all 0.5s;
          width: 100%;
        }
        .content {
          text-align: left;
          flex: 1;
          display: flex;
          align-items: flex-start;
          line-height: 20px;
          font-size: 12px;
          color: #666;
        }
      }
      .footer {
        width: 100%;
        height: 40px;
        background: #ff6a00;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        cursor: pointer;
        &:hover {
          opacity: 0.9;
        }
      }
    }
  }
}
</style>
