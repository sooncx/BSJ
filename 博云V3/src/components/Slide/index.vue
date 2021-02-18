<template>
  <div class="slide" ref="slideRef">
    <ul class="slide__content">
      <template v-for="(item, index) in slideList" :key="index">
        <li
          v-if="clientWidth"
          :class="{ active: router.currentRoute.value.name == item.value }"
          @click="setRoute(item)"
        >
          <i class="iconfont" :class="item.icon"></i
          ><span class="slide__label">{{ item.label }}</span>
        </li>

        <el-tooltip
          v-else
          effect="dark"
          placement="right"
          :content="item.label"
        >
          <li
            :class="{ active: router.currentRoute.value.name == item.value }"
            @click="setRoute(item)"
          >
            <i class="iconfont" :class="item.icon"></i>
          </li>
        </el-tooltip>
      </template>
    </ul>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  watch,
  onMounted,
  onBeforeMount,
  onActivated,
} from "vue";
import router from "@/router";
import { useDebounce } from "@/hooks/core/useDebounce";

interface propType {
  list: any[];
  openOptions: any[];
  defaultPage: string;
  histroyModel: boolean;
}
export default defineComponent({
  props: {
    // 侧边栏数据
    list: {
      type: Array,
      default: [],
    },
    // 侧边栏展开项
    openOptions: {
      type: Array,
      default: [],
    },
    // 默认显示项路由name
    defaultPage: {
      type: String,
      default: "",
    },
    // 路由记录历史模式标识, 开启后会记住当前页最后一次选中的二级路由, 刷新页面后重置。
    histroyModel: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: propType, { emit }) {
    const collapsed = ref(false);
    const slideList = computed(() => {
      return props.list;
    });
    // 获取当前路由根路径
    const rootRoute = computed(() => {
      return router.currentRoute.value.fullPath.split("/")[1];
    });
    // 获取历史路由记录
    const histroyRoute: any = computed(() => {
      return localStorage.getItem([rootRoute.value, "_histroyRoute"].join(""));
    });

    // 建立所有路由的名称:重定向路由的映射
    const routerRedirect = computed(() => {
      const mapList = new Map();
      router.getRoutes().map((item) => {
        const res = item.redirect ? (item as any).redirect() : null;
        mapList.set(
          item.name,
          res && res.split("/")[res.split("/").length - 1]
        );
      });
      return mapList;
    });
    // 通过设置缓存来改变路由重定向的值，注意路由的redirect值
    function setHistroyRoute(nowRoute = null as any) {
      console.log("设置历史路由");
      if (nowRoute) {
        localStorage.setItem(
          [rootRoute.value, "_histroyRoute"].join(""),
          nowRoute
        );
        return;
      }
      // 若设置了默认选中页，则将默认页路由替换当前页根路由重定向
      if (props.defaultPage != "") {
        // 若开启了历史路由记录模式，若历史路由为空，则将默认页设为历史路由，再将当前路由替换当前页根路由重定向，
        if (
          props.histroyModel &&
          ["", null, "null"].includes(histroyRoute.value)
        ) {
          localStorage.setItem(
            [rootRoute.value, "_histroyRoute"].join(""),
            props.defaultPage
          );
        } else {
          // 设置当前页历史缓存为默认选中页
          localStorage.setItem(
            [rootRoute.value, "_histroyRoute"].join(""),
            props.defaultPage
          );
        }
      }
      // 若未设置默认选中页，则以当前路由重定向为默认项
      else {
        // 则将当前路由设置为历史路由，再替换当前根路由重定向
        localStorage.setItem(
          [rootRoute.value, "_histroyRoute"].join(""),
          routerRedirect.value.get(rootRoute.value)
        );
      }
    }
    // 清空对应模块的历史路由
    function clearHistroyRoute(deleteALL = false) {
      console.log("清空对应历史路由");
      if (deleteALL) {
        [...routerRedirect.value.keys()].map((key: any) => {
          if (![null, "null"].includes(routerRedirect.value.get(key))) {
            localStorage.removeItem([key, "_histroyRoute"].join(""));
          }
        });
      } else {
        [...routerRedirect.value.keys()].map((key: any) => {
          if (
            ![null, "null"].includes(routerRedirect.value.get(key)) &&
            key == rootRoute.value
          ) {
            localStorage.removeItem([key, "_histroyRoute"].join(""));
          }
        });
      }
    }

    // 获取屏幕宽度
    let clientWidth = ref(document.body.clientWidth > 980);
    const resize = () => {
      clientWidth.value = document.body.clientWidth > 980;
    };
    const [debounceResize] = useDebounce(resize, 100);
    onMounted(() => {
      // clearHistroyRoute();
      // setHistroyRoute();
      window.onresize = debounceResize;
    });
    onActivated(() => {
      clientWidth.value = document.body.clientWidth > 980;
      window.onresize = debounceResize;
    });
    onBeforeMount(() => {
      clearHistroyRoute();
      if (
        props.defaultPage &&
        router.currentRoute.value.name != props.defaultPage &&
        router.currentRoute.value.redirectedFrom
      ) {
        router.push({ name: props.defaultPage });
        setHistroyRoute(props.defaultPage);
      }
      if (!props.defaultPage && router.currentRoute.value.redirectedFrom) {
        router.push({ name: router.currentRoute.value.name as any });
        setHistroyRoute(router.currentRoute.value.name);
      }
    }),
      // 监听路由路径
      watch(
        () => router.currentRoute.value.name,
        (val, old: any) => {
          if (
            !val ||
            !["dataReport", "manageData"].includes(
              router.currentRoute.value.path.split("/")[1]
            )
          )
            return;
          setTimeout(() => {
            if (val != histroyRoute.value) {
              setHistroyRoute(val);
            }
          }, 100);
        },
        {
          deep: true,
          immediate: true,
        }
      );
    function setRoute(item: any) {
      let nowRoute = item.value;
      props.histroyModel &&
        localStorage.setItem(
          [rootRoute.value, "_histroyRoute"].join(""),
          nowRoute
        );
      // 路由跳转
      emit("change", nowRoute);
    }

    return {
      slideList,
      collapsed,
      setRoute,
      router,
      clientWidth,
    };
  },
});
</script>
<style lang="less" scoped>
@import "./index.less";
</style>