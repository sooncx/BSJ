<template>
  <ul
    class="tachograph"
    :class="`gongge${vehInfoList.length}`"
    v-if="visible"
  >
    <li
      v-for="(item, index) in vehInfoList"
      :key="index"
      class="player"
      :class="`item-${index + 1}`"
    >
      <video
        class="video__source"
        poster="../../assets/img/video/bg.png"
      ></video>
      <div class="startBtn">
        <i
          class="el-icon-video-play"
          @click="startPlay($event, index)"
        ></i>
      </div>

      <div class="tachograph__hover">
        <h4 :title="item.P">
          {{ item.P }}
        </h4>
        <div class="tachograph__hover__control">
          <i
            class="iconfont icon-tingzhi"
            @click="pause(index)"
          ></i>
          <i
            class="iconfont icon-icon-"
            @click="capture(index)"
          ></i>
          <i
            class="iconfont icon-yinliang"
            @click="muted(index)"
          ></i>
          <i
            v-if="!fullFlag"
            class="iconfont icon-quanping"
            @click="fullScreen(index)"
          ></i>
          <i
            v-else
            class="iconfont icon-suoxiao"
            @click="exitFullScreen(index)"
          ></i>
        </div>
      </div>
    </li>
  </ul>
  <!-- <div class="fullscreen-controls"></div> -->
</template>
<script lang="ts">
import {
  defineComponent,
  Ref,
  inject,
  reactive,
  toRefs,
  watch,
  nextTick,
} from "vue";
import flvjs from "flv.js";
import API from '@/api/monitorCenter';
import WsUtil from '@/assets/js/wsUtil';

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
    const videoFlag = <Ref<boolean>>inject("videoFlag");
    const videoNum = <Ref<number>>inject("videoNum");

    const data = reactive({
      vehInfoList: <any[]>[],
      listMap: new Map(),
      videoList: <any[]>[],
      fullFlag: false,
      socket: <any>null,
      /** 播放 */
      startPlay(e: any, index: number) {
        data.canvasFun(index);
        e.target.parentElement.style.display = "none";
      },
      /** 暂停 */
      pause(index: number) {
        const video = document.querySelectorAll(".video__source") as any;

        video[index || 0].pause();
        (document.querySelectorAll(".startBtn") as any)[
          index || 0
        ].style.display = "flex";
      },
      /** 静音 */
      muted(index: number) {
        const video = document.querySelectorAll(".video__source") as any;

        video[index || 0].muted = !video[index || 0].muted;
        if (video[index || 0].muted) {
          (document.querySelector(".icon-yinliang") as any).classList.replace(
            "icon-yinliang",
            "icon-yinliang-guan"
          );
        } else {
          (document.querySelector(
            ".icon-yinliang-guan"
          ) as any).classList.replace("icon-yinliang-guan", "icon-yinliang");
        }
      },
      /** 截屏 */
      capture(index: number) {
        const videoBox = document.querySelector(".tachograph") as any;
        const video = document.querySelectorAll(".video__source") as any;

        const canvas = document.createElement("canvas") as any;
        canvas.width = video[index || 0].videoWidth;
        canvas.height = video[index || 0].videoHeight;
        canvas
          .getContext("2d")
          .drawImage(video[index || 0], 0, 0, canvas.width, canvas.height);
        const strDataURL = canvas.toDataURL("image/png");
        var arr = strDataURL.split(","),
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
      },
      /** 全屏 */
      fullScreen(index: number) {
        const video = document.querySelectorAll(".player") as any;
        data.Screen(video[index || 0]);
      },
      Screen(element: any) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullScreen();
        }

        document.addEventListener(
          "fullscreenchange",
          () => {
            data.fullFlag = (document as any).fullscreen;
          },
          false
        );
        document.addEventListener(
          "mozfullscreenchange",
          () => {
            data.fullFlag = (document as any).mozFullScreen;
          },
          false
        );
        document.addEventListener(
          "msfullscreenchange",
          () => {
            data.fullFlag = (document as any).msFullscreenElement;
          },
          false
        );
        document.addEventListener(
          "webkitfullscreenchange",
          () => {
            data.fullFlag = (document as any).webkitIsFullScreen;
          },
          false
        );
      },
      /** 退出全屏 */
      exitFullScreen(index: number) {
        if ((document as any).exitFullscreen) {
          (document as any).exitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        } else if ((document as any).webkitCancelFullScreen) {
          (document as any).webkitCancelFullScreen();
        }
      },
      canvasFun(index: number) {
        // console.log(data.videoList);
        // data.videoList[index].play();
        const video = document.querySelectorAll(".video__source") as any;

        video[index || 0].play();
        video[index || 0].onended = () => {
          (document.querySelectorAll(".startBtn") as any)[
            index || 0
          ].style.display = "flex";
        };
      },
      // 获取视频
      getVideo() {
        data.vehInfoList.forEach(async (item) => {
          if (item.V) {
            const info = {
              channelNo: 1,
              dataType: 1,
              streamType: 0,
              vehicleId: item.V,
              clientType: 0,
              commandType: "VIDEO_PLAY",
            };

            const data = await API.realVideoReq(info);

            console.log(data);
          }
        });
        data.initWs();
      },
      initWs() {
        // 192.168.130.142  47.107.241.109
        let devNum = data.vehInfoList[0].N;
        if (devNum.length !== 12) {
          devNum = (new Array(12 - devNum.length).fill(0)).join('') + data.vehInfoList[0].N;
        }
        // data.socket = new WsUtil({
        //   url: ``,
        //   onmessage: data.wxMessage,
        // });
      },
      wxMessage(evt: any) {
        console.log(evt);
      }
    });

    watch(
      () => props.vehInfo,
      (val) => {
        if (!val) return;

        data.listMap.set(val.V, val); // 去重
        const length = [...data.listMap.values()].length;
        const list = [...data.listMap.values()];

        data.vehInfoList =
          length <= 1
            ? list
            : length == 3 || length === 4
            ? list.concat(new Array(4 - length).fill({}))
            : length === 6
            ? list.concat(new Array(6 - length).fill({}))
            : length === 8
            ? list.concat(new Array(8 - length).fill({}))
            : list.concat(new Array(8 - length).fill({}));

        videoNum.value =
          length <= 1
            ? 1
            : length <= 4
            ? 4
            : length <= 6
            ? 6
            : length <= 8
            ? 8
            : 8;
        videoFlag.value = true;

        nextTick(() => {
          data.getVideo();

          const videos = document.querySelectorAll(".video__source");
          data.videoList = [];
          videos.forEach((item, index) => {
            data.videoList.push(
              flvjs.createPlayer({
                type: "flv",
                isLive: true,
                url: "ws://192.168.130.142:17788/webSocket/live?simChannel=013301658344-1",
              })
            );
            data.videoList[index].attachMediaElement(item);
            data.videoList[index].load();
          });
        });
      },
      {
        immediate: true,
      }
    );

    watch(
      () => videoNum.value,
      (val) => {
        const length = [...data.listMap.values()].length;
        const list = [...data.listMap.values()];
        if (list.length >= val) {
          data.vehInfoList = list.slice(0, val);
          return;
        }
        data.vehInfoList =
          val <= 1 ? list : list.concat(new Array(val - length).fill({}));
      }
    );

    return {
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.tachograph {
  // position: relative;
  // bottom: 0;
  // left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  background: #000;
  display: grid;

  &.gongge1 {
    grid-template-columns: 100%;
    grid-template-rows: 100%;
  }

  &.gongge4 {
    grid-template-columns: repeat(2, 50%);
    grid-template-rows: repeat(2, 50%);
  }

  &.gongge6 {
    grid-template-columns: repeat(3, 33%);
    grid-template-rows: repeat(3, 33%);

    .item-1 {
      grid-column-start: 1;
      grid-column-end: 3;
      grid-row-start: 1;
      grid-row-end: 3;

      .el-icon-video-play {
        font-size: 51px;
      }
    }

    li .el-icon-video-play {
      font-size: 31px;
    }
  }

  &.gongge8 {
    grid-template-columns: repeat(4, 25%);
    grid-template-rows: repeat(4, 25%);

    .item-1 {
      grid-column-start: 1;
      grid-column-end: 4;
      grid-row-start: 1;
      grid-row-end: 4;
      .el-icon-video-play {
        font-size: 51px;
      }
    }

    li .el-icon-video-play {
      font-size: 31px;
    }
  }

  li {
    position: relative;
    &:hover .tachograph__hover {
      display: flex;
    }

    video {
      width: 100%;
      height: 100%;
    }
  }

  &__hover {
    display: none;
    height: 40px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    background: #fff;
    opacity: 0.9;
    position: absolute;
    bottom: 0;
    z-index: 3;

    h4 {
      font-weight: 600;
      flex: 1;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__control {
      .iconfont {
        cursor: pointer;
        margin-right: 10px;
        font-size: 18px;

        &:hover {
          color: #3381e8;
        }
      }
      .icon-tingzhi:hover {
        color: red;
      }
    }
  }

  .startBtn {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    .el-icon-video-play {
      font-size: 51px;
      color: #fff;
      cursor: pointer;
    }
  }
}
video::-webkit-media-controls {
  display: none !important;
}
.fullscreen-controls {
  z-index: 2147483647;
  height: 40px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  background: #fff;
  opacity: 0.9;
  position: absolute;
  bottom: 0;
}
</style>
