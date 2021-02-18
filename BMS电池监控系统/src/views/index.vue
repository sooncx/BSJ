<template>
  <div class="main">
    <Nav />

    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import Nav from "@/components/Nav/index.vue";

export default {
  components: {
    Nav
  }
}
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
