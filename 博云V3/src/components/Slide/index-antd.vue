<template>
  <div class="slide">
    <a-menu
      v-model:openKeys="openKeys.data"
      v-model:selectedKeys="selectedKeys.data"
      mode="inline"
      theme="dark"
      :inline-collapsed="collapsed"
    >
      <template
        v-for="(item, index) in list"
        :key="index"
      >
        <a-menu-item
          :key="item.value"
          v-if="item.children && item.children.length == 0"
        >
          <i :class="['iconfont icon', item.icon]"></i>
          <span>{{item.label}}</span>
        </a-menu-item>
        <a-sub-menu
          :key="item.value"
          v-if="item.children && item.children.length > 0"
        >
          <template #title>
            <span>
              <i :class="['iconfont icon', item.icon]"></i><span>{{item.label}}</span>
            </span>
          </template>
          <template
            v-for="(childItem) in item.children"
            :key="childItem.value"
          >
            <a-menu-item>
              <i :class="['iconfont icon', childItem.icon]"></i>
              <span>{{childItem.label}}</span>
            </a-menu-item>
          </template>
        </a-sub-menu>
      </template>
    </a-menu>
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
} from "vue";
import router from "@/router";
import { onBeforeRouteUpdate } from "vue-router";
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
    const list = computed(() => {
      return props.list;
    });
    // 设置当前选中项
    const selectedKeys = reactive({
      data: [props.defaultPage],
    });
    // 获取当前路由根路径
    const route = computed(() => {
      return router.currentRoute.value.fullPath.split("/")[1];
    });
    // 获取历史路由记录
    const histroyRoute: any = computed(() => {
      return localStorage.getItem([route.value, "_histroyRoute"].join(""));
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
    const openKeys = reactive({
      data: props.openOptions,
    });
    // 通过设置缓存来改变路由重定向的值，注意路由的redirect值
    function setHistroyRoute() {
      // 若设置了默认选中页，则将默认页路由替换当前页根路由重定向
      if (props.defaultPage != "") {
        // 若开启了历史路由记录模式， 则将当前最新路由记录替换当前页根路由重定向
        if (props.histroyModel) {
          selectedKeys.data = ["", null, "null"].includes(histroyRoute.value)
            ? [props.defaultPage]
            : [histroyRoute.value];
        } else {
          // 设置当前页历史缓存为默认选中页
          localStorage.setItem(
            [route.value, "_histroyRoute"].join(""),
            props.defaultPage
          );
          // 设置侧边栏选中项
          selectedKeys.data = [props.defaultPage];
        }
      }
      // 若未设置默认选中页，则以当前路由重定向为默认项
      else {
        // 若开启了历史路由记录模式， 则将当前最新路由记录替换当前根路由重定向
        if (props.histroyModel) {
          selectedKeys.data = ["", null, "null"].includes(histroyRoute.value)
            ? [routerRedirect.value.get(route.value)]
            : [histroyRoute.value];
        } else {
          // 设置当前页历史缓存为重定向路由
          localStorage.setItem(
            [route.value, "_histroyRoute"].join(""),
            routerRedirect.value.get(route.value)
          );
          // 设置侧边栏选中项
          selectedKeys.data = [routerRedirect.value.get(route.value)];
        }
      }
    }
    onMounted(() => {
      // 清空当前页历史路由记录
      localStorage.removeItem([route.value, "_histroyRoute"].join(""));
      setHistroyRoute();
    });
    // 用于历史路由操作
    onActivated(() => {
      setHistroyRoute();
    });
    watch(selectedKeys, (newVal, oldVal) => {
      if (!router.hasRoute(newVal.data[0])) {
        localStorage.removeItem([route.value, "_histroyRoute"].join(""));
        alert(["没有路由: ", newVal.data[0]].join(""));
        return;
      }
      props.histroyModel &&
        localStorage.setItem(
          [route.value, "_histroyRoute"].join(""),
          newVal.data[0]
        );
      // 路由跳转
      emit("change", newVal.data[0]);
    });
    return { list, collapsed, selectedKeys, openKeys };
  },
});
</script>
<style lang="less" scoped>
@import "./index.less";
</style>