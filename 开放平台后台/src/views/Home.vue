<template>
  <div class="Home">
    <div class="Home_content">
      <Nav />
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Nav from "../components/Nav/index.vue";

export default {
  name: "Home",
  components: {
    Nav
  },
  computed: {
    ...mapState(["APPLIST", "USERLIST", "RENEWLIST"])
  },
  mounted() {
    this.getAppList();
    this.getUserList();
    this.getAllRenews();
  },
  watch: {
    $route: {
      handler(val) {
        // if (val.name === "userManage") {
        //   this.getUserList();
        // }
        if (["interfaceManage", "limitManage"].includes(val.name)) {
          this.getAppList();
        }
      }
    }
  },
  methods: {
    ...mapMutations(["COMMIT_APPLIST", "COMMIT_USERLIST", "COMMIT_RENEWLIST"]),
    async getAppList() {
      try {
        const { obj } = await this.$API.listApplication();
        await this.COMMIT_APPLIST(obj);
      } catch (error) {
        console.log(error);
      }
    },
    async getUserList() {
      try {
        const { obj } = await this.$API.userInfoList();
        await this.COMMIT_USERLIST(obj);
      } catch (error) {
        this.$msg.error(error.msg);
        console.log(error);
      }
    },
    async getAllRenews() {
      try {
        const { obj } = await this.$API.getAllRenews();
        await this.COMMIT_RENEWLIST(obj);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.Home {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  &_content {
    overflow: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
  }
}
</style>
