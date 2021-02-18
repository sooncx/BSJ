<template>
  <div class="text-wrap" ref="textWrap" :style="{ width: wordWidth }">
    <div class="text" ref="text"><slot /></div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  nextTick,
  watchEffect,
} from "vue";

export default defineComponent({
  props: {
    wordWidth: {
      // 宽度
      type: String,
      default: "100%",
    },
  },
  setup(props) {
    const data = reactive({
      textWrap: ref(),
      text: ref(),
      wordsLoop(pDom: any, cDom: any) {
        if (cDom.clientWidth < pDom.clientWidth) {
          cDom.classList.remove("wordsLoop");
        }
        if (cDom.clientWidth > pDom.clientWidth) {
          cDom.classList.add("wordsLoop");
          let duration = (cDom.clientWidth / pDom.clientWidth) * 15 + "s";
          cDom.style.animationDuration = duration;
        }
      },
    });

    watchEffect(() => {
      nextTick(() => {
        data.wordsLoop(data.textWrap, data.text);
      });
    });

    return {
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.text-wrap {
  overflow: hidden;
}
.text {
  display: inline-block;
  white-space: nowrap;
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
