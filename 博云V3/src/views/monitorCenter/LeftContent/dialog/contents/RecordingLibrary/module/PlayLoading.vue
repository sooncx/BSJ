<template>
  <div class="box" :class="{ animationBox: isAnimation }">
    <div class="wifi-symbol">
      <div class="wifi-circle first"></div>
      <div class="wifi-circle second"></div>
      <div class="wifi-circle third"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    isAnimation: {
      type: Boolean,
      default: true,
    },
  },
});
</script>
<style scoped lang="less">
* {
  margin: 0;
  padding: 0;
}
.box {
  /* width: 120px;
  height: 120px; */
  box-sizing: border-box;
  position: relative;
}
.wifi-symbol {
  width: 50px;
  height: 50px;
  box-sizing: border-box;
  overflow: hidden;
  transform: rotate(135deg);
}
.wifi-circle {
  border: 3px solid #66b92e;
  border-radius: 50%;
  position: absolute;
}

.first {
  width: 5px;
  height: 5px;
  background: #66b92e;
  top: 45px;
  left: 45px;
}

.second {
  width: 25px;
  height: 25px;
  top: 35px;
  left: 35px;
}
.animationBox .second {
  animation: fadeInOut 2s infinite;
}
.animationBox .third {
  opacity: 0;
  animation: fadeInOutthird 0.5s infinite 0.5s;
}

.third {
  width: 40px;
  height: 40px;
  top: 25px;
  left: 25px;
  opacity: 1;
}

@keyframes fadeInOut {
  0% {
    opacity: 0; /*初始状态 透明度为0*/
  }
  100% {
    opacity: 1; /*结尾状态 透明度为1*/
  }
}
@keyframes fadeInOutthird {
  0% {
    opacity: 0; /*初始状态 透明度为0*/
  }

  100% {
    opacity: 1; /*结尾状态 透明度为1*/
  }
}
</style>