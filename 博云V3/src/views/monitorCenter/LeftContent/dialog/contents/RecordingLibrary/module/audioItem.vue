<template>
  <div class="audioItem" ref="box">
    <div class="cont">
      <div class="date-toast">{{ getLocalTime(data.fileId) }}</div>

      <div class="audio-display-row">
        <div class="headHhoto">
          <img :src="photoImg" alt="" />
        </div>
        <div class="col-cont" @click="toggle">
          <div class="audio-displayHeader">
            <div class="loading-wrap">
              <PlayLoading class="loading" :isAnimation="isPlay" />
            </div>
          </div>

          <div class="placeholder-len" :style="{ width: curWid }"></div>

          <div class="audio-size" v-if="!isInitIng && !isShowError">
            {{ data.interval }}"
          </div>

          <div class="audio-loding" v-else-if="!isShowError">
            <Spinner />
          </div>

          <div class="audio-error" v-show="isShowError">
            <el-tooltip
              class="item"
              effect="dark"
              content="获取录音失败，点击重新获取播放"
              placement="right"
            >
              <i class="iconfont icon-tixing"></i>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, reactive, toRefs } from "vue";
import { useDebounce } from "@/hooks/core/useDebounce";
import PlayLoading from "./PlayLoading.vue";
import Spinner from "./Spinner.vue";
import dayjs from "dayjs";
import AudioPlay from "@/utils/audioPlay";
import baseUrl from "@/api/baseUrl";
import { useStore } from "vuex";

export default defineComponent({
  props: {
    data: Object as PropType<any>,
    vehicleType: String as PropType<string>,
    vehicleId: Number as PropType<number>,
  },
  components: { PlayLoading, Spinner },
  setup(props, { emit }) {
    const store = useStore();
    const audioUrl =
      (process.env.NODE_ENV === "development"
        ? baseUrl
        : CONFIG.baseUrl) +
      "/car/v1/api/audioImage/getAudioFile.json?vehicleId=" +
      props.vehicleId +
      "&fileId=" +
      (props.data as any).fileId +
      "&sessionId=" +
      store.state.sessionId;

    const data: any = reactive({
      photoImg: require("@/assets/img/dialog/car.png"),
      isPlay: false,
      boxWidth: 120,
      maxInterval: 300,
      isInit: false,
      player: null,
      isInitIng: false,
      isShowError: false,
      isMidwayPause: false, // 是否在初始化過程中執行暫停事件，true就取消初始成功后默認播放事件
      curWid: computed(
        () =>
          props.data &&
          data.boxWidth * ((props.data as any).interval / data.maxInterval) +
            "px"
      ),
      getLocalTime(nS: string) {
        return dayjs(Number(nS)).format("YYYY-MM-DD/HH:mm:ss");
      },
      toggle() {
        handlerDebounce();
      },
      play() {
        console.log("播放");
        emit("playBefore", {
          name: (props.data as any).fileId,
          pause: data.pause,
        });
        data.isMidwayPause = false;
        if (data.isInit && !data.isPlay) {
          data.player.play();
          data.isPlay = true;
          emit("play");
        } else if (!data.isInitIng && !data.isInit) {
          //避免重複初始化
          loadSound(() => {
            if (!data.isMidwayPause) {
              data.play();
            }
          });
        }
      },
      pause() {
        console.log("暂停");
        data.isMidwayPause = true;
        data.isPlay = false;
        if (data.isInit) {
          data.player.pause();
          emit("pause");
        }
      },
    });

    const [handlerDebounce] = useDebounce(handlerToggle, 200);

    function handlerToggle() {
      if (data.isPlay) {
        data.pause();
      } else {
        data.play();
      }
    }

    // 加载音频
    async function loadSound(callBack: () => void) {
      data.player = new AudioPlay({
        src: audioUrl,
        playEnd: () => {
          // 播放结束
          data.isPlay = false;
        },
      });
      console.log(data.player);
      setTimeout(() => {
        data.isInit = true;
        data.isInitIng = false;
        if (typeof callBack === "function") {
          callBack();
        }
      }, 100);
    }

    return {
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.audioItem {
  width: 100%;
  text-align: center;
}
.cont {
  display: inline-block;
  color: #fff;
  position: relative;
  overflow: hidden;
  width: 100%;
  text-align: center;
  > .date-toast {
    border-radius: 6px;
    display: inline-block;
    padding: 1px 10px;
    background: #dadada;
    color: #fff;
    text-align: center;
  }
  img {
    width: 100%;
  }
}

.audio-display-row {
  padding: 10px;
  display: flex;
  align-items: center;
  .headHhoto {
    height: 32px;
    width: 32px;
    border-radius: 6px;
    overflow: hidden;
    background: #dadada;
    float: left;
    margin-right: 15px;
    img {
      height: 100%;
      width: 100%;
    }
  }
  .col-cont {
    float: left;
    display: flex;
    align-items: center;
  }
  .placeholder-len {
    float: left;
    background: #98e165;
    height: 32px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    width: 60px;
    cursor: pointer;
  }
  .audio-displayHeader {
    float: left;
    background: #98e165;
    height: 32px;
    width: 42px;
    cursor: pointer;

    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    position: relative;
    .loading-wrap {
      transform: translate(0, -50%);
      position: absolute;
      left: 0px;
      top: 50%;
    }
    .loading {
      transform: scale(0.45);
    }
    &::before {
      position: absolute;
      content: "";
      top: 50%;
      left: 0%;
      background: #98e165;
      display: block;
      height: 10px;
      width: 10px;
      transform: rotate(45deg) translate(-56%, -4%) scale(0.6);
    }
  }
  .audio-size {
    float: left;
    color: #9c9c9c;
    margin-left: 6px;
  }
  .audio-loding {
    float: left;
    margin-left: 6px;
  }
  .audio-error {
    cursor: help;
    color: red;
    float: left;
    margin-left: 8px;
    font-size: 18px;
  }
}
</style>
