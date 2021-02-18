<template>
  <div class="RecordingLibrary">
    <div>
      <ul
        class="list"
        v-infinite-scroll="load"
        :infinite-scroll-disabled="disabled"
      >
        <li
          v-for="(item, index) in list"
          :key="index"
        >
          <Items
            :data="item"
            :vehicleType="vehicleType"
            :vehicleId="item.vehicleId"
            @playBefore="audioItemPlay"
          />
        </li>
      </ul>
      <!-- <div v-else class="nothing">暂无录音</div> -->
      <p
        class="desc"
        v-if="loading"
      >加载中...</p>
      <p
        class="desc"
        v-if="nomore"
      >
        {{ list.length !== 0 ? "我是有底线的" : "暂无数据" }}
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  ref,
  toRefs,
  watch,
  computed,
  watchEffect,
  nextTick,
} from "vue";
import API from "@/api/monitorCenter";
import Items from "./module/audioItem.vue";

export default defineComponent({
  components: { Items },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    vehInfo: Object,
  },
  setup(props) {
    const data = reactive({
      loading: false,
      list: <any[]>[],
      vehicleType: computed(() => props.vehInfo?.T),
      current: 1,
      total: 0,
      pageSize: 20,
      audioList: <
        {
          name: string;
          pause: () => void;
        }[]
      >[],
      audioItemPlay(obj: { name: string; pause: () => void }) {
        if (
          data.audioList.findIndex((item: any) => item.name === name) === -1
        ) {
          data.audioList.push(obj);
        }
        if (data.audioList.length !== 0) {
          data.audioList.forEach((item) => {
            item.pause();
          });
        }
      },
    });

    const getData = async () => {
      const { obj } = await API.AudioInfoList({
        vehicleId: props.vehInfo?.V,
        pageNumber: data.current,
        pageSize: data.pageSize,
      });

      data.list = data.list.concat(obj.data || []);
      data.total = obj.total;
      data.loading = false;
    };
    nextTick(() => {
      watch(
        () => props.visible,
        (val) => {
          if (!val) return;
          data.list = [];
          getData();
        },
        {
          immediate: true,
        }
      );
    });

    const load = () => {
      data.loading = true;
      data.current++;
      getData();
    };

    const nomore = computed(() => {
      return data.total <= data.current * data.pageSize;
    });

    const disabled = computed(() => {
      return data.loading || nomore.value;
    });

    return {
      ...toRefs(props),
      ...toRefs(data),
      load,
      nomore,
      disabled,
    };
  },
});
</script>
<style lang="less" scoped>
.RecordingLibrary {
  width: 100%;
  height: 400px;
  overflow-y: auto;
  padding-top: 20px;
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
.list {
  &__item {
    height: 60px;
    line-height: 60px;
  }

  p {
    text-align: center;
  }
}

.desc {
  text-align: center;
}

.nothing {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}
</style>