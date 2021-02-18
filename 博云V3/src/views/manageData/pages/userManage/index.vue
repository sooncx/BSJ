<template>
  <div class="conter">
    <!-- 用户信息 -->
    <UserInfo></UserInfo>
    <!-- 用户信息 -->
    <!-- 表格信息 -->
    <UserTable
      v-model:seleceUserId="seleceUserId"
    ></UserTable>
    <!-- 表格信息 -->
  </div>
</template>
<script lang="ts">
import { defineComponent,Ref,reactive,inject } from "vue";
import UserInfo from "./components/userInfo/index.vue";
import UserTable from "./components/userTable/index.vue";
export default defineComponent({
  components: {
    UserInfo,
    UserTable
  },
  setup() {
    const seleceUserId = <Ref<() => void>>inject("seleceUserId");
    
    return {
      seleceUserId
    };
  },
});
</script>

<style lang="less" scoped>
.conter{
  height: 100%;
  width: 100%;
  overflow: auto;
  background-color: #fff;
  display: flex;
  flex-wrap: wrap;
}
</style>