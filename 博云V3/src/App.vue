<template>
  <ConfigProvider :locale="zhCN">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </ConfigProvider>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { ConfigProvider } from "ant-design-vue";

import zhCN from "ant-design-vue/es/locale/zh_CN";
import moment from "moment";
import "moment/dist/locale/zh-cn";

moment.locale("zh-cn");

export default defineComponent({
  name: "App",
  components: { ConfigProvider },

  setup() {
    return { zhCN };
  },
});
</script>
<style lang="less">
#app {
  height: 100%;
}
</style>
