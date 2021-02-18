<template>
  <div class="slide">
    <ul class="slide__content">
      <li
        v-for="(item, index) in slideList"
        :key="index"
        :class="{ active: router.currentRoute.value.name == item.value }"
        @click="setRoute(item)"
      >
        <i
          class="iconfont"
          :class="item.icon"
        ></i>{{ item.label }}
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  ref,
  watch,
  onActivated,
  onMounted,
  onBeforeMount,
  onUnmounted,
  onBeforeUnmount,
} from "vue";
import router from "@/router";
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
interface propType {
  list: any[];
  openOptions: any[];
  defaultPage: string;
  histroyModel: boolean;
}
interface itemType {
  value: string;
  label: string;
  icon: string;
  children?: any[];
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
    const nowRouterName = ref(null) as any; // 当前选中路由name
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
    function setHistroyRoute(routeName = null as any) {
      // console.log("设置历史路由");
      if (routeName) {
        // 设置当前页历史缓存为默认选中页
        localStorage.setItem(
          [rootRoute.value, "_histroyRoute"].join(""),
          routeName
        );
        // 设置侧边栏选中项
        nowRouterName.value = routeName;
        return;
      }
      // 若设置了默认选中页，则将默认页路由替换当前页根路由重定向
      if (props.defaultPage != "") {
        // 若开启了历史路由记录模式， 则将当前最新路由记录替换当前页根路由重定向
        if (props.histroyModel) {
          if (["", null, "null"].includes(histroyRoute.value)) {
            nowRouterName.value = props.defaultPage;
            // 设置当前页历史缓存为默认选中页
            localStorage.setItem(
              [rootRoute.value, "_histroyRoute"].join(""),
              props.defaultPage
            );
          } else {
            nowRouterName.value = histroyRoute.value;
          }
        } else {
          // 设置当前页历史缓存为默认选中页
          localStorage.setItem(
            [rootRoute.value, "_histroyRoute"].join(""),
            props.defaultPage
          );
          // 设置侧边栏选中项
          nowRouterName.value = props.defaultPage;
        }
      }
      // 若未设置默认选中页，则以当前路由重定向为默认项
      else {
        // 若开启了历史路由记录模式， 则将当前最新路由记录替换当前根路由重定向
        if (props.histroyModel) {
          nowRouterName.value = ["", null, "null"].includes(histroyRoute.value)
            ? routerRedirect.value.get(rootRoute.value)
            : histroyRoute.value;
        } else {
          // 设置当前页历史缓存为重定向路由
          localStorage.setItem(
            [rootRoute.value, "_histroyRoute"].join(""),
            routerRedirect.value.get(rootRoute.value)
          );
          // 设置侧边栏选中项
          nowRouterName.value = routerRedirect.value.get(rootRoute.value);
        }
      }
    }
    // 清空所有历史路由
    function clearHistroyRoute() {
      [...routerRedirect.value.keys()].map((key: any) => {
        if (![null, "null"].includes(routerRedirect.value.get(key))) {
          localStorage.removeItem([key, "_histroyRoute"].join(""));
        }
      });
    }
    onMounted(() => {
      setHistroyRoute();
    });
    onBeforeMount(() => {
      if (
        props.defaultPage &&
        router.currentRoute.value.name != props.defaultPage
      ) {
        // router.push({ name: props.defaultPage });
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
          // 延时，确保在历史路由记录操作之后再次更改selectedKeys的值
          setTimeout(() => {
            // setHistroyRoute(val);
          }, 0);
        },
        {
          deep: true,
          immediate: true,
        }
      );
    function setRoute(item: any) {
      nowRouterName.value = item.value;
      let nowRoute = item.value;
      props.histroyModel &&
        localStorage.setItem(
          [rootRoute.value, "_histroyRoute"].join(""),
          nowRoute
        );
      // 路由跳转
      emit("change", nowRoute);
    }
    return { slideList, collapsed, setRoute, nowRouterName, router };
  },
});
</script>
<style lang="less" scoped>
@import "./index.less";
</style>