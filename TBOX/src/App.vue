<template>
  <div id="app">
    <keep-alive :include="KEEPALIVE">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "App",

  computed: {
    ...mapState(["KEEPALIVE"])
  }
};
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
