<template>
  <a-dropdown placement="topLeft" v-model:visible="dorpdownVisible">
    <div
      class="exportbtn"
      @click="exportTrack"
      :style="{ width: flag ? '80px' : '120px' }"
    >
      <i class="iconfont icon-xiazai" v-if="flag"></i>
      <p v-else style="margin-right: 5px; margin-top: 2px">
        <i class="el-icon-loading" style="color: #0e60db; font-size: 18px"></i>
      </p>
      {{ flag ? "导出" : "正在导出中..." }}
    </div>
    <template #overlay>
      <div class="exportlist">
        <p class="exportlist__title">
          最近导出<span>(记录大于2000条数据的导出记录)</span>
        </p>
        <ul class="exportlist__content" v-if="listDownload.length !== 0">
          <template v-for="item in listDownload" :key="item.sortNum">
            <li v-if="item.type === 'progress'" class="progress">
              <p>{{ name }}</p>
              <i>{{ percentage + "%" }}</i>
              <div
                class="progress__percentage"
                :style="{ width: percentage + '%' }"
              ></div>
            </li>
            <li v-else @click="exportFile(item.name)">
              <p>{{ item.name }}</p>
              <i class="iconfont icon-xiazai"></i>
            </li>
          </template>
        </ul>
        <el-empty style="width: 330px" v-else />
      </div>
    </template>
  </a-dropdown>
</template>
<script lang="ts">
import { defineComponent, inject, reactive, Ref, ref, toRefs } from "vue";
import API from "@/api/playBack";
import APIType from "@/api/playBack/type";
import { filterType } from "../type";
import { useMessage } from "@/hooks/web/useMessage";

export default defineComponent({
  name: "exportbtn",
  setup() {
    const message = useMessage();
    const dorpdownVisible = ref(false);
    const filter = <Ref<filterType>>inject("filter");
    const playbackTotal = <Ref<number>>inject("playbackTotal");

    const listDownload = ref(<APIType.listDownloadInfoRes["obj"]>[]);
    const getData = async () => {
      const { obj } = await API.listDownloadInfo();

      listDownload.value = obj;
      exportData.percentage = 0;
    };

    const exportData = reactive({
      /**
       * 1导出
       * 2正在导出中...
       */
      flag: 1,
      percentage: 0,
      name: "",
      format(percentage: string) {
        console.log(percentage);
        return exportData.name + percentage + "%";
      },
      exportTrack() {
        if (playbackTotal.value === 0) {
          message.warning("暂无轨迹数据，无法导出");
          return;
        }
        if (playbackTotal.value < 2000) {
          API.exportSimple({
            vehicleId: filter.value.vehgroup?.vehicleId,
            beginTime: filter.value.startTime,
            endTime: filter.value.endTime,
            filterTime: filter.value.restTime,
          });
        } else if (playbackTotal.value >= 2000) {
          API.exportTrack({
            vehicleId: filter.value.vehgroup?.vehicleId,
            beginTime: filter.value.startTime,
            endTime: filter.value.endTime,
            filterTime: filter.value.restTime,
          });

          if (exportData.flag === 0) return;
          exportData.flag = 0;
          listDownload.value.unshift({
            type: "progress",
            sortNum: 1,
            name: "progress",
          });
          setTimeout(() => {
            exportData.getProgress();
          }, 200);
        }
      },
      async getProgress() {
        const { obj } = await API.getProcessInfo();
        if (obj) {
          exportData.name = obj.name;
          exportData.percentage = obj.progress;
          if (obj.progress === 100) {
            exportData.flag = 1;
            // listDownload.value.shift();
            getData();
          } else {
            setTimeout(() => {
              exportData.getProgress();
            }, 200);
          }
        } else {
          exportData.flag = 1;
          // listDownload.value.shift();
          getData();
        }
      },
      exportFile(filename: string) {
        API.downloadFile({ filename });
      },
    });

    exportData.getProgress();

    return {
      dorpdownVisible,
      listDownload,
      ...toRefs(exportData),
    };
  },
});
</script>
<style lang="less" scoped>
.exportbtn {
  width: 80px;
  margin: 0 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  overflow: hidden;
  .iconfont {
    margin-right: 5px;
  }
  &:hover {
    background: #f7f7f7;
    color: #0e60db;
  }
}
.exportlist {
  padding: 12px;
  background: #fff;
  &__content {
    height: 270px;
    width: 330px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      width: 6px;
      background-color: rgba(144, 147, 153, 0.3);
      transition: background-color 0.3s;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: rgba(144, 147, 153, 0.5);
    }
    &::-webkit-scrollbar-thumb:active {
      background-color: rgba(144, 147, 153, 0.5);
    }
  }
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 14px;
    padding: 10px;
    cursor: pointer;
    background-color: #f5f6f6;
    margin-bottom: 10px;
    position: relative;
    p {
      width: 80%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      position: relative;
      z-index: 100;
    }
    i {
      position: relative;
      z-index: 100;
    }
    &:last-child {
      margin: 0;
    }
    &:hover {
      color: #0e60db;
    }
  }

  .progress {
    &:hover {
      color: #fff;
    }
    &__percentage {
      position: absolute;
      background-image: linear-gradient(
        to left,
        #ead6ee,
        #a0f1ea,
        rgb(124, 241, 241),
        #e3a5f0,
        #ead6ee
      );
      background-size: 400%;
      left: 0;
      top: 0;
      bottom: 0;
      animation: run 4s linear 0s infinite;
    }
  }

  &__title {
    color: #606266;
    font-size: 14px;
    margin-bottom: 10px;
    span {
      color: #999;
      font-size: 12px;
    }
  }
}

@keyframes run {
  100% {
    background-position: 400% 0px;
  }
}
</style>
