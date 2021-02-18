<template>
  <div class="main">
    <Nav />
    <div class="main__content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import Nav from "@/components/Nav/index.vue";

export default {
  name: "index",

  components: {
    Nav
  },

  mounted() {
    //获取GROUPLIST
    this.doShowOrganization();
    //获取用户列表
    this.doShowUserMessage();
  },
  methods: {
    ...mapMutations(["COMMIT_GROUPLIST", "COMMIT_USERLIST"]),
    //获取GROUPLIST
    async doShowOrganization() {
      try {
        const { data } = await this.$API.doShowOrganization();
        this.COMMIT_GROUPLIST(data);
      } catch (error) {
        console.log(error);
      }
    },
    //获取用户列表
    async doShowUserMessage() {
      try {
        const { data } = await this.$API.doShowUserMessage();
        this.COMMIT_USERLIST(data);
      } catch (error) {
        console.error(error);
        this.$msg({
          showClose: true,
          message: error.msg,
          type: "error"
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.main {
  height: 100%;
  width: 100%;
  background: #eaedf1;
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
