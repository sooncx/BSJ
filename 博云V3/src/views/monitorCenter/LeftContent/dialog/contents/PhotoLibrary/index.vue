<template>
  <div class="PhotoLibrary">
    <span v-if="total == 0">暂无照片</span>
    <div v-else class="photoBox">
      <div v-for="item in list" :key="item" class="items">
        <img :src="item" alt="" />
      </div>
    </div>
  </div>
  <div class="footer">
    <span class="dialog-footer">
      <span>
        <el-pagination
          @current-change="currentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          v-model:total="total"
          :pager-count="5"
        >
        </el-pagination>
      </span>
      <!-- 用于布局的无用dom -->
      <span></span>
      <span>
        <el-button @click="$emit('update:visible', false)">关 闭</el-button>
      </span>
    </span>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  toRefs,
  watch,
} from "vue";
import { useFunction } from "../../../../function";
import baseUrl from "@/api/baseUrl";
import { useStore } from "vuex";
export default defineComponent({
  components: {},
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
  setup(props) {
    const { pageImage, showMsg } = useFunction();
    const store = useStore();
    const data = reactive({
      pageSize: 100,
      currentPage: 1,
      total: 0,
      list: [],
      currentChange(val: number) {
        data.currentPage = val;
        data.getpageImage();
      },
      async getpageImage() {
        const params = {
          vehicleId: props.vehInfo.V,
          pageNumber: data.currentPage,
          pageSize: data.pageSize,
        };
        const res = await pageImage(params);
        let arr = [] as any;
        let url = "/car/v1/api/audioImage/getImageFile.json";
        if (res && res.data) {
          data.total = res.total;
          res.data.map(async (item: any) => {
            arr.push(
              `${
                process.env.NODE_ENV === "development"
                  ? baseUrl
                  : CONFIG.baseUrl
              }${url}?vehicleId=${item.vehicleId}&fileId=${
                item.fileId
              }&sessionId=${store.state.sessionId}`
            );
          });
          data.list = arr;
        }
      },
    });
    watch(
      () => props.visible,
      (val) => {
        if (val) {
          data.getpageImage();
        } else {
          data.list = [];
          data.total = 0;
          data.currentPage = 1;
        }
      },
      {
        immediate: true,
      }
    );
    return {
      ...toRefs(props),
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.PhotoLibrary {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  .codeBox {
    width: 300px;
    margin-left: -75px;
  }
  .photoBox {
    display: flex;
    width: 100%;
    height: 100%;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px 15px;
    .items {
      margin: 10px 0;
      width: 280px;
      height: 200px;
      img {
        width: 280px;
        height: 200px;
        background-size: 100% 100%;
      }
    }
  }
}
.footer {
  width: 100%;
  height: 60px;
  padding: 10px 16px;
  border-top: 1px solid #d9e0e9;
  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
::v-deep(.el-button) {
  border-radius: 0 !important;
}
::v-deep(.el-button--primary) {
  background: #0e60db !important;
  border-color: #0e60db !important;
  &:hover {
    opacity: 0.8;
  }
}
::v-deep(.el-select) {
  width: 300px;
}
</style>