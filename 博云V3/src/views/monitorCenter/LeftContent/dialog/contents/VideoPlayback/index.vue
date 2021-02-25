<template>
  <div class="videoPlayback">
    <div class="videoPlayback_left">
      <div class="header">
        <span> 选择时间</span>
        <el-date-picker
          v-model="startTime"
          format="YYYY-MM-DD"
          type="date"
          placeholder="开始时间"
        >
        </el-date-picker>
        <el-date-picker
          v-model="endTime"
          format="YYYY-MM-DD"
          type="date"
          placeholder="结束时间"
        >
        </el-date-picker>
        <el-button
          type="primary"
          size="mini"
        >搜索</el-button>
      </div>
      <div class="content">
        <el-table
          max-height="550"
          size="mini"
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        >
          <el-table-column
            v-for="(item,index) in columns"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            align="center"
          >
            <template #default="scope">
              <template v-if="item.prop == 'play'">
                <i
                  class="iconfont playBtn"
                  :class="{'icon-bofang1':!scope.row[item.prop],'icon-zanting':scope.row[item.prop]}"
                  :style="{color:playIng && playIng.id == scope.row.id?'blue':''}"
                  @click="playVideo(scope.row)"
                ></i>
              </template>
              <span v-else>
                {{ format( item.prop, scope.row[item.prop]) }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div
      class="videoPlayback_right"
      :class="{'fullScreen':isFullScreen}"
    >
      <div
        v-loading="loading && isPlay"
        class="playIcon"
        @click="playFn"
        v-show="nowVideo"
      >
        <i
          class="iconfont"
          v-show="!isPlay"
          :class="{'icon-bofang1':!isPlay, 'icon-zanting':isPlay}"
        ></i>
      </div>
      <video
        controlsList="nodownload"
        disablePictureInPicture
        class="video"
        preload="auto"
        src=""
      >
        <!-- <source src=""> -->
      </video>
      <div
        class="myControls"
        v-show="nowVideo"
      >
        <div class="videoBtn">
          <i
            class="iconfont"
            :class="{'icon-bofang1':!isPlay, 'icon-zanting':isPlay}"
            @click="playFn"
          ></i>
        </div>
        <div class="timeBar">
          <div class="currentPoint"></div>
          <div class="bufferedBar"></div>
          <div class="currentBar"></div>
        </div>
        <div class="videoOption">
          <i
            class="iconfont icon-tingzhi"
            @click="playFn('stop')"
          ></i>
          <i
            class="iconfont icon-icon-"
            @click="cutImg"
          ></i>
          <i
            class="iconfont"
            :class="{'icon-yinliang':!isMuted,'icon-yinliang-guan':isMuted}"
            @click="MutedFn"
          ></i>
          <i
            class="iconfont"
            :class="{'icon-quanping':!isFullScreen,'icon-suoxiao':isFullScreen}"
            @click="FullScreenFn"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import dayJs from "dayjs";
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  toRefs,
  watch,
  watchEffect,
} from "vue";
import { useFunction } from "../../../../function";
import flvjs from "flv.js";
import {
  Fullscreen,
  ExitFullscreen,
  isFullscreenFn,
} from "../../../../../../assets/js/base";
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    vehInfo: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      startTime: null,
      endTime: null,
      playIng: null,
      isPlay: false,
      isFullScreen: false,
      isMuted: false,
      presentT: 0,
      totalT: 0,
      bufferedT: 0,
      loading: false,
      bufferTimer: null as any,
      nowVideo: null as any,
      tableData: [] as any,
      format(prop: string, data: any) {
        if (["startTime", "endTime"].includes(prop)) {
          return dayJs(data).format("YYYY-MM-DD");
        }
        return data;
      },
      // 播放、暂停事件
      playFn(type = "paly") {
        const videoObj = document.getElementsByClassName("video")[0] as any;
        if (type == "stop") {
          videoObj.load();
          data.isPlay = false;
          data.nowVideo.play = false;
          window.clearInterval(data.bufferTimer);
          data.bufferTimer = null;
          return;
        }
        if (data.isPlay) {
          videoObj.pause();
          data.nowVideo.play = false;
        } else {
          videoObj.play();
          data.nowVideo.play = true;
        }
        data.isPlay = !data.isPlay;
      },
      // 静音事件
      MutedFn() {
        const videoObj = document.getElementsByClassName("video")[0] as any;
        data.isMuted = !data.isMuted;
        if (data.isMuted) {
          videoObj.muted = true;
        } else {
          videoObj.muted = false;
        }
      },
      setIsFullScreen() {
        data.isFullScreen = isFullscreenFn();
      },
      // 全屏事件
      FullScreenFn() {
        if (isFullscreenFn()) {
          ExitFullscreen();
          data.isFullScreen = false;
        } else {
          Fullscreen();
          data.isFullScreen = true;
        }
      },
      playVideo(row: any) {
        data.nowVideo = row;
        const videoObj = document.getElementsByClassName("video")[0] as any;
        // const flvPlayer = flvjs.createPlayer({
        //   type: "flv",
        //   isLive: true,
        //   url: "./333.flv",
        // });
        // flvPlayer.attachMediaElement(videoObj);
        // flvPlayer.load(); //加载
        videoObj.src = "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4";
        data.playIng = row;
        data.tableData.map((item: any, index: number) => {
          if (item.id == row.id) {
            data.tableData[index].play = data.isPlay = !data.tableData[index]
              .play;
            if (data.tableData[index].play) {
              data.presentT = 0;
              data.totalT = 0;
              videoObj.play();
            } else {
              videoObj.pause();
            }
            data.init();
          } else {
            data.tableData[index].play = false;
          }
        });
      },
      formatTime(t: any) {
        let h: any = parseInt((t / 3600) as any);
        h = h < 10 ? "0" + h : h;
        let m: any = parseInt(((t % 3600) / 60) as any);
        m = m < 10 ? "0" + m : m;
        let s: any = parseInt((t % 60) as any);
        s = s < 10 ? "0" + s : s;
        return h + ":" + m + ":" + s;
      },
      // 播放初始化
      init() {
        const videoObj = document.getElementsByClassName("video")[0] as any;
        // 设置进度条
        function setPlayPrecent(myPercent = null as any) {
          const progress = document.querySelector(".currentBar") as any;
          const currentPoint = document.querySelector(".currentPoint") as any;
          const percent = (data.presentT / data.totalT) * 100;
          progress.style.width =
            myPercent != null ? myPercent + "%" : percent + "%";
          currentPoint.style.left =
            myPercent != null ? myPercent + "%" : percent + "%";
          if (percent == 100) {
            videoObj.load();
            data.isPlay = false;
            data.nowVideo.play = false;
          }
        }
        const timeBar = document.querySelector(".timeBar") as any;
        // 监听点击进度条事件
        timeBar.addEventListener("click", function (e: any) {
          const nowT = (e.layerX / timeBar.clientWidth) * videoObj.duration;
          const myPercent = (nowT / data.totalT) * 100;
          setPlayPrecent(myPercent); // 设置播放进度条
          videoObj.currentTime = nowT;
          if (nowT >= data.bufferedT) {
            console.log("还没缓存到", videoObj.currentTime);
            data.loading = true;
            return;
          }
          data.loading = false;
        });
        // 当浏览器能够开始播放指定的音频/视频时
        videoObj.addEventListener("canplay", function () {
          data.totalT = videoObj.duration;
          const videoDuration = data.formatTime(data.totalT);
          // setPlayPrecent();
        });
        // 监听视屏播中放事件
        videoObj.addEventListener("timeupdate", function () {
          data.presentT = videoObj.currentTime;
          const videoCurrent = data.formatTime(data.presentT);
          if (data.presentT < data.bufferedT) {
            setPlayPrecent();
          }
        });
        data.bufferedT = 0;
        // 每隔500毫秒获取视屏缓存进度
        data.bufferTimer = setInterval(() => {
          checkLoading();
          if (videoObj.currentTime >= data.bufferedT) {
            data.loading = true;
          } else {
            data.loading = false;
          }
        }, 500);
        // 设置缓存进度
        function checkLoading() {
          data.totalT = videoObj.duration;
          if (isNaN(data.totalT) || data.totalT <= 0) return;
          if (videoObj.buffered.length != 0) {
            // data.bufferedT = videoObj.buffered.end(0);
            data.bufferedT = videoObj.buffered.end(
              videoObj.buffered.length - 1
            );
          }
          if (data.totalT == 0) return;
          const bufferedProgress = document.querySelector(
            ".bufferedBar"
          ) as any;
          if (data.bufferedT >= data.totalT) {
            //缓存完
            console.log(data.bufferedT, data.totalT, "缓存完了");
            bufferedProgress.style.width = "100%";
            data.loading = false;
            window.clearInterval(data.bufferTimer);
            data.bufferTimer = null;
          } else {
            const bufferedPercent = (data.bufferedT / data.totalT) * 100;
            // console.log("缓存进度" + bufferedPercent + "%");
            bufferedProgress.style.width = bufferedPercent + "%";
          }
        }
        // videoObj.addEventListener(
        //   "progress",
        //   function () {
        //     if (
        //       Math.round(videoObj.buffered.end(0)) /
        //         Math.round(videoObj.seekable.end(0)) ===
        //       1
        //     ) {
        //       console.log("视屏缓存完成");
        //     }
        //   },
        //   false
        // );
        // function eventTester(e: any) {
        //   videoObj.addEventListener(
        //     e,
        //     function (res: any) {
        //       console.log(res);
        //     },
        //     false
        //   );
        // }
        // eventTester("loadedmetadata");
      },
      resert() {
        const videoObj = document.getElementsByClassName("video")[0] as any;
        const progress = document.querySelector(".currentBar") as any;
        const currentPoint = document.querySelector(".currentPoint") as any;
        videoObj.load();
        videoObj.src = null;
        data.isPlay = false;
        data.startTime = null;
        data.endTime = null;
        data.playIng = null;
        data.isFullScreen = false;
        data.isMuted = false;
        progress.style.width = 0;
        currentPoint.style.left = 0;
        data.presentT = 0;
        data.totalT = 0;
        data.bufferedT = 0;
        data.loading = false;
        data.nowVideo.play = false;
        data.nowVideo = null;
        data.tableData = [];
        window.clearInterval(data.bufferTimer);
        data.bufferTimer = null;
      },
      // 截屏
      cutImg() {
        const videoObj = document.getElementsByClassName("video")[0] as any;
        const canvas = document.createElement("canvas") as any;
        const Wscal = videoObj.videoWidth / videoObj.clientWidth;
        const Hscal = videoObj.videoHeight / videoObj.clientHeight;
        let scal = 1;
        if (videoObj.videoWidth >= videoObj.videoHeight) {
          scal = videoObj.videoWidth / videoObj.clientWidth;
        } else {
          scal = videoObj.videoHeight / videoObj.clientHeight;
        }
        if (canvas) {
          canvas.width = videoObj.videoWidth;
          canvas.height = videoObj.videoHeight;
          // videoObj.setAttribute("crossOrigin", "anonymous"); // 处理图片跨域
          // videoObj.setAttribute("useCORS", true); // 解决跨域
          canvas
            .getContext("2d")
            .drawImage(videoObj, 0, 0, canvas.width, canvas.height);
          const strDataURL = canvas.toDataURL("image/png");
          let arr = strDataURL.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const blob = new Blob([u8arr], {
            type: mime,
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = new Date().getTime() + "";
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 1000);
        }
      },
      columns: [
        {
          prop: "index",
          label: "序号",
        },
        {
          prop: "play",
          label: "播放",
        },
        {
          prop: "plate",
          label: "车牌号",
        },
        {
          prop: "startTime",
          label: "开始时间",
        },
        {
          prop: "endTime",
          label: "结束时间",
        },
        {
          prop: "time",
          label: "录像时长",
        },
      ],
    });
    nextTick(() => {
      watch(
        () => props.visible,
        (val) => {
          if (val) {
            window.addEventListener("resize", data.setIsFullScreen);
            for (let i = 0; i < 10; i++) {
              data.tableData.push({
                id: i,
                index: i + 1,
                play: false,
                plate: "plate" + i,
                startTime: new Date(),
                endTime: new Date(),
                time: i + "小时",
              });
            }
          } else {
            data.resert();
            window.removeEventListener("resize", data.setIsFullScreen);
          }
        },
        {
          immediate: true,
        }
      );
    });
    return {
      ...toRefs(props),
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.videoPlayback {
  width: 100%;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  flex: 1;
  &_left {
    width: 50%;
    height: 100%;
    border-right: 1px solid #e4e7eb;
    display: flex;
    flex-direction: column;
    .header {
      height: 50px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      span {
        padding: 0 10px 0 0;
      }
      ::v-deep(.el-input) {
        width: 170px;
      }
      ::v-deep(.el-input__inner) {
        width: 160px;
        height: 30px;
      }
      ::v-deep(.el-button--mini) {
        border-radius: 0;
      }
    }
    .content {
      flex: 1;
    }
  }
  &_right {
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: #fff;
    .playIcon {
      position: absolute;
      z-index: 99999;
      width: 100%;
      height: calc(100% - 60px);
      // margin-top: -30px;
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        // margin-top: 30px;
        font-size: 30px;
        color: rgb(82, 82, 82);
      }
    }
    .video {
      position: relative;
      z-index: 9999 !important;
      width: 100%;
      height: 100%;
      object-fit: fill;
      max-height: 100%;
      object-fit: contain;
      background: #fff;
      &:focus {
        outline: none !important;
      }
    }
  }
}
.playBtn {
  cursor: pointer;
  &:hover {
    color: blue;
  }
}
.myControls {
  height: 30px;
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  background: rgb(246, 246, 246);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  .videoBtn {
    width: 25px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    i {
      cursor: pointer;
      &:hover {
        color: blue;
      }
    }
  }
  .timeBar {
    display: flex;
    flex: 1;
    height: 5px;
    background: rgb(216, 216, 216);
    border-radius: 10px;
    cursor: pointer;
    position: relative;
    .currentPoint {
      position: absolute;
      background: #fff;
      margin-top: -2px;
      // left: 100%;
      margin-left: -5px;
      height: 9px;
      width: 9px;
      border-radius: 50%;
      border: 1px solid rgb(18, 227, 255);
      z-index: 999;
      cursor: pointer;
      &:hover {
        background: rgb(241, 243, 243);
      }
    }
    .bufferedBar,
    .currentBar {
      height: 5px;
      background: rgb(57, 199, 235);
      border-radius: 10px;
      width: 0;
      left: 0;
      position: absolute;
    }
    .bufferedBar {
      background: rgb(181, 223, 248);
    }
  }
  .videoOption {
    width: 110px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 10px;
    i {
      cursor: pointer;
      &:hover {
        color: blue;
      }
    }
  }
}
.fullScreen {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #fff;
  left: 0;
  bottom: 0;
  z-index: 999999;
}
.exitFullScreen {
}
// video::-webkit-media-controls-volume-control-container,
// video::-moz-media-controls-volume-control-container,
// video::-ms-media-controls-volume-control-container,
// video::-khtml-media-controls-volume-control-container {
//   margin-right: 3.5rem;
// }
// // 播放按钮
// video::-webkit-media-controls-play-button {
//   display: none !important;
// }
// // 当前播放时间
// video::-webkit-media-controls-current-time-display {
//   display: none !important;
// }
// // 剩余时间
// video::-webkit-media-controls-time-remaining-display {
//   display: none !important;
// }
// // 音量按钮
// video::-webkit-media-controls-volume-control-container {
//   display: none !important;
// }
// // 全屏
// video::-webkit-media-controls-fullscreen-button {
//   display: none !important;
// }
// // 时间轴
// video::-webkit-media-controls-timeline {
//   display: none !important;
// }
// // 更多选项 --然而并不生效
// video::-internal-media-controls-overflow-button {
//   display: none !important;
// }
</style>