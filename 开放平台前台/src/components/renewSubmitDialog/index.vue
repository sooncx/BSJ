<template>
  <div>
    <el-dialog
      :visible="visabled"
      width="600px"
      class="dialog"
      @close="$emit('update:visabled', false)"
    >
      <template
        slot="title"
        class="dialogHeader"
      >
        <h3 style="text-align:left;font-weight:400">马上咨询</h3>
        <div class="line"></div>
      </template>
      <div class="improveLimitBox">
        <img src="../../assets/img/controlPanel/renew.png" />
        <h3>申请已提交成功</h3>
        <h4>请联系以下工作人员进行付款操作</h4>
        <span>
          <i class="iconfont icon-dianhua"></i> 135-3775-8340
        </span>
      </div>
      <div class="footer">
        <div
          class="btn"
          @click="$emit('update:visabled', false)"
        >确定</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "phoneDialog",
  data() {
    return {};
  },
  props: {
    visabled: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="scss" scoped>
.improveLimitBox {
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 400;
  img {
    width: 80px;
  }
  h3 {
    font-size: 20px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #333333;
    margin: 20px 0;
  }
  h4 {
    color: #666666;
    font-family: PingFang SC;
    font-weight: 400;
    margin: 20px 0;
  }
  span {
    color: #0856ea;
    font-size: 16px;
  }
}
.footer {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 60px;
  .btn {
    width: 90px;
    height: 36px;
    background: rgba(8, 86, 234, 1);
    text-align: center;
    line-height: 36px;
    color: #fff;
    cursor: pointer;
    &:hover {
      opacity: 0.9;
    }
  }
}

::v-deep .el-dialog__header {
  border-bottom: 1px solid #ededed;
}
</style>
