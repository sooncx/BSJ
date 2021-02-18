<template>
  <section class="Nav">
    <div class="Nav__logo">
      <img src="@/assets/img/logo.png" alt="" />
    </div>
    <div class="Nav__content">
      <div
        class="Nav__item"
        :class="{ Nav__item_on: !!$route.path.match(item.value) }"
        v-for="(item, index) in list"
        :key="index"
        @click="jump(item)"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="Nav__iconList">
      <el-popover
        placement="left"
        :width="208"
        trigger="manual"
        content="如需重新导出，请点击此处。"
        v-model:visible="tipsVisible"
      >
        <template #reference>
          <p>
            <el-tooltip content="下载列表">
              <i
                class="iconfont icon-archive_en"
                @click="showModal('download')"
              ></i>
            </el-tooltip>
          </p>
        </template>
      </el-popover>
      <p>
        <el-tooltip content="命令下发报表">
          <i
            class="iconfont icon-kongzhimingling"
            @click="showModal('command')"
          ></i>
        </el-tooltip>
      </p>
    </div>
    <div class="Nav__user" @click="showMenu">
      <!-- <i class="iconfont icon-yonghu"></i> -->
      <div class="Nav__user__avatar">{{ USER && USER.name.substr(0, 1) }}</div>
      <basic-arrow v-model:expand="expand" />
    </div>
  </section>
  <user-dropdown
    v-model:visible="expand"
    v-model:type="type"
    @menuClick="showModal"
  />

  <nav-modal v-model:visible="visible" v-model:type="type" />
</template>

<script lang="ts">
import {
  computed,
  ref,
  defineComponent,
  defineAsyncComponent,
  inject,
  Ref,
  watch,
} from "vue";
import router from "@/router";
import { BasicArrow } from "@/components/Basic/index";
import UserDropdown from "./src/UserDropdown.vue";
import { useStore } from "vuex";
interface itemType {
  type: string;
  value: string;
  label: string;
}
export default defineComponent({
  name: "navMenu",
  components: {
    UserDropdown,
    BasicArrow,
    NavModal: defineAsyncComponent(() => import("./src/NavModal.vue")),
  },
  props: {
    options: {
      type: Array,
      default: [
        { type: "normal", value: "Login", label: "登陆页" },
        { type: "blank", value: "home", label: "首页", id: 11 },
        { type: "normal", value: "monitorCenter", label: "监控中心", id: 13 },
        { type: "blank", value: "playBack", label: "轨迹回放", id: 14 },
        {
          type: "normal",
          value: "riskControlCenter",
          label: "风控中心",
          id: 12,
        },
        { type: "normal", value: "dataReport", label: "数据报表", id: 15 },
        { type: "normal", value: "manageData", label: "资料管理", id: 16 },
      ],
    },
  },
  setup(props: any) {
    const store = useStore();
    const list = computed(() => {
      let arr: any[] = [];

      props.options.forEach((option: any) => {
        let flag = true;
        if (flag) {
          store.state.headerMenu.forEach((item: any) => {
            if (item.id === option.id) {
              arr.push(option);
              flag = false;
            }
          });
        }
      });
      return arr;
    });

    const USER = computed(() => {
      return store.state.USER;
    });

    const expand = ref(true);

    const showMenu = () => {
      expand.value = !expand.value;
    };

    function jump(item: itemType) {
      if (item.type === "blank") {
        let routeData = router.resolve({ name: item.value });
        window.open(routeData.href, "_blank");
      } else {
        router.currentRoute.value.fullPath.split("/")[1] != item.value &&
          router.push({ name: item.value });
      }
    }

    const type = ref("");
    const visible = ref(false);
    const tipsVisible = ref(false);
    let downListFlag = 0;

    const showModal = (val: string) => {
      if (val === "download") {
        downListFlag++;
      }
      type.value = val;
      visible.value = true;
      expand.value = true;
    };

    watch(
      () => visible,
      (val: Ref<boolean>) => {
        // 首次使用下载列表の提示
        if (!val.value && type.value === "download" && downListFlag === 1) {
          tipsVisible.value = true;
          setTimeout(() => {
            tipsVisible.value = false;
          }, 2000);
        }
      },
      {
        deep: true,
      }
    );

    // 注入方法
    const COMMIT_NAVMODAL = <(val: any) => void>inject("COMMIT_NAVMODAL");
    COMMIT_NAVMODAL(showModal);

    return {
      list,
      jump,
      expand,
      showMenu,
      showModal,
      visible,
      tipsVisible,
      type,
      USER,
    };
  },
});
</script>
<style lang="less" scoped>
@import "./nav.less";
</style>