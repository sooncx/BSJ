<template>
  <div
    class="text-wrap"
    ref="textWrap"
    :style="{'width': width}"
  >
    <div
      class="text"
      ref="text"
    > {{ text }} </div>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      // 宽度
      type: String,
      default: "100%"
    },
    text: {
      // 传入的字符
      type: [String, Object]
    }
  },

  watch: {
    text: {
      async handler(val)  {
        if (val) {
          await this.$nextTick();
          this.wordsLoop(this.$refs.textWrap, this.$refs.text);
        }
      },
      immediate: true
    }
  },
  methods: {
    wordsLoop(pDom, cDom) {
      if (cDom.clientWidth <= pDom.clientWidth) {
        cDom.classList.remove("wordsLoop");
      } else {
        cDom.classList.add("wordsLoop");
        const duration = (cDom.clientWidth / pDom.clientWidth) * 15 + "s";
        cDom.style.animationDuration = duration;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.text-wrap {
  overflow: hidden;
  .text {
    display: inline-block;
    white-space: nowrap;
  }
}

.wordsLoop {
  animation: 15s wordsLoop linear infinite normal;
}
@keyframes wordsLoop {
  0% {
    transform: translateX(50px);
    -webkit-transform: translateX(50px);
  }
  100% {
    transform: translateX(-100%);
    -webkit-transform: translateX(-100%);
  }
}
</style>



