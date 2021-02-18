<template>
  <div class="popoverBox">
    <div>
      <Identify
        :identifyCode.sync="identifyCode"
        @click.native="identifyCode = makeCode()"
      />
    </div>
    <div>
      <el-input
        v-model="identifyValue"
        placeholder="请输入验证码"
      ></el-input>
    </div>
    <div>
      <el-button
        type="primary"
        size="small"
        @click="verify"
      >验证</el-button>
    </div>
  </div>
</template>
<script>
import Identify from "../Identify/index.vue";

export default {
  components: {
    Identify,
  },
  data() {
    return {
      identifyCode: this.makeCode(),
      identifyValue: null,
    };
  },
  methods: {
    verify() {
      if (this.identifyValue.toLowerCase() == this.identifyCode.toLowerCase()) {
        this.$emit("verifyRes", true);
      } else {
        this.$emit("verifyRes", false);
        this.$msg.error("验证码错误!");
        this.identifyCode = this.makeCode();
        this.identifyValue = null;
      }
    },
    makeCode() {
      const codes = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(
        ""
      );
      return new Array(4)
        .fill("")
        .map(() => {
          const i = randomNum(0, codes.length);
          return codes[i];
        })
        .join("");

      function randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.popoverBox {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  div {
    padding: 5px 0;
  }
}
</style>
