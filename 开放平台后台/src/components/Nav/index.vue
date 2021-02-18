<template>
  <div class="Nav">
    <div class="Nav_logo">
      <img
        src="../../assets/img/home/logo.png"
        alt=""
      >
    </div>
    <div class="Nav_user">
      <el-dropdown
        placement="bottom-end"
        trigger="hover"
      >
        <span
          class="Nav_user_name"
          @click="loginDiolag = true"
        >
          <span>{{USER && USER.username}}<i class="el-icon-arrow-down el-icon--right"></i></span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="dialogVisible = true">修改密码</el-dropdown-item>
          <el-dropdown-item @click.native="loginOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <changePws :visible.sync="dialogVisible" />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import changePws from "../changePws/index.vue";

export default {
  name: "Nav",
  components: {
    changePws
  },
  data() {
    return {
      dialogVisible: false
    };
  },
  computed: {
    ...mapState(["USER"])
  },
  methods: {
    ...mapMutations(["COMMIT_USER"]),
    async loginOut() {
      try {
        const { obj } = await this.$API.logout();
        console.log(obj);
        this.$router.push({ name: "login" });
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.Nav {
  height: 50px;
  background: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  color: #333;
  border-bottom: 1px solid rgb(228, 228, 228);
  &_logo {
    margin: 0 auto 0 0;
    padding-left: 40px;
  }
  &_user {
    margin-left: auto;
    padding-right: 40px;
    cursor: pointer;
    .name {
    }
  }
}
</style>
