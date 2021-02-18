<template>
  <div
    class="arrow"
    :class="type == 'up'? 'up':'down'"
  >
    <div
      :style="[arrowTop]"
      class="arrowTop"
    ></div>
    <div
      :style="[arrowBottom]"
      class="arrowBottom"
    ></div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, toRefs } from "vue";
export default defineComponent({
  props: {
    type: {
      type: String,
      default: "up",
    },
    width: {
      type: Number,
      default: 4,
    },
    height: {
      type: Number,
      default: 18,
    },
    color: {
      type: String,
      default: "green",
    },
  },
  setup(props) {
    const width = props.width % 2 == 0 ? props.width : props.width + 1;
    const height = props.height % 2 == 0 ? props.height : props.height + 1;
    const color = props.color;
    const type = props.type;
    const arrowTop = computed(() => {
      if (type == "up") {
        return {
          "border-left": `${width + "px"} solid transparent`,
          "border-right": `${width + "px"} solid transparent`,
          "border-bottom": `${Math.ceil(height / 3) + "px"} solid ${color}`,
        };
      } else {
        return {
          width: `${width + "px"}`,
          height: `${Math.ceil(height / 3) + "px"}`,
          background: `${color}`,
        };
      }
    });
    const arrowBottom = computed(() => {
      if (type == "up") {
        return {
          width: `${width + "px"}`,
          height: `${Math.ceil(height / 3) + "px"}`,
          background: `${color}`,
        };
      } else {
        return {
          "border-left": `${width + "px"} solid transparent`,
          "border-right": `${width + "px"} solid transparent`,
          "border-top": `${Math.ceil(height / 3) + "px"} solid ${color}`,
        };
      }
    });
    return {
      arrowTop,
      arrowBottom,
      ...toRefs(props),
    };
  },
});
</script>
<style lang="less" scoped >
.arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
}
.up {
  animation: toUp 1s infinite;
}
.down {
  animation: toDown 1s infinite;
}
@keyframes toUp {
  0% {
    opacity: 0;
    margin-top: 0.2%;
  }
  25% {
    opacity: 0.5;
    margin-top: 0.1%;
  }
  50% {
    opacity: 1;
    margin-top: 0%;
  }
  75% {
    opacity: 0.5;
    margin-top: -0.1%;
  }
  100% {
    opacity: 0;
    margin-top: -0.2%;
  }
}
@keyframes toDown {
  0% {
    opacity: 0;
    margin-top: 0%;
  }
  25% {
    opacity: 0.5;
    margin-top: 0.1%;
  }
  50% {
    opacity: 1;
    margin-top: 0.2%;
  }
  75% {
    opacity: 0.5;
    margin-top: 0.3%;
  }
  100% {
    opacity: 0;
    margin-top: 0.4%;
  }
}
</style>