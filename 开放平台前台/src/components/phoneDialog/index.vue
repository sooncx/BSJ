<template>
  <div>
    <el-dialog :visible="visabled" width="600px" @close="$emit('update:visabled', false)">
      <template slot="title" class="dialogHeader">
        <h3 style="text-align:left;font-weight:400">马上咨询</h3>
        <div class="line"></div>
      </template>
      <div class="improveLimitBox">
        <img src="../../assets/img/controlPanel/question.png" />
        <h3>如需沟通咨询请联系工作人员</h3>
        <p>
          技术沟通
          <span>
            <i class="iconfont icon-dianhua"></i> 159-7686-8468
          </span>
        </p>
        <p>
          需求沟通
          <span>
            <i class="iconfont icon-dianhua"></i> 183-1828-9624
          </span>
        </p>
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
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    margin: 28px 0;
  }
  p {
    color: rgba(153, 153, 153, 1);
    margin: 23px 0;
  }
  span {
    color: #0856ea;
    margin-left: 20px;
  }
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #ededed;
}
</style>
