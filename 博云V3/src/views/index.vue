<template>
  <div class="main">
    <Nav />
    <div class="main__content">
      <router-view v-slot="{ Component }">
        <keep-alive :exclude="excludeConfig">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, inject, nextTick, provide, ref } from "vue";
import Nav from "@/components/Nav/index.vue";
import { useStore } from "vuex";
import { useInit } from '@/hooks/web/useInit';

export default defineComponent({
  components: {
    Nav,
  },
  setup() {
    const store = useStore();
    const Init = useInit();

    // 显示/隐藏右上角Modal
    const navModal = ref(null);
    provide("navModal", navModal);
    provide("COMMIT_NAVMODAL", (val: any) => {
      navModal.value = val;
    });
    // 更新车组数据
    provide("updateVehGroupData", updateVehGroupData);
    async function updateVehGroupData() {
      Init.getVehGroupData();
    }
    // 更新用户列表数据
    provide("updateUserAllData", updateUserAllData);
    async function updateUserAllData() {
      Init.getUserAllData();
    }
    nextTick(() => {
      Init.init();
    });

    const excludeConfig = computed(() => store.state.excludeConfig);

    return {
      excludeConfig,
    };
  },
});
</script>
<style lang="less" scoped>
.main {
  height: 100%;
  width: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  &__content {
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
  }
}
</style>
