<template>
  <section>
    <div class="Nav">
      <div class="Nav__logo">
        <img
          src="@/assets/img/home/logo.png"
          draggable="false"
          @click="$router.push({name: 'home'})"
        />
      </div>
      <div class="Nav__content">
        <div
          class="Nav__item"
          :class="{Nav__item_on: !!$route.path.match(item.value)}"
          v-for="(item,index) in menuList"
          :key="item.value"
          @click.self="jump(item)"
          @mouseenter="enter(index)"
          @mouseleave="leave()"
        >
          {{item.label}}
          <!--:style="{height:`${item.children.length * 40}px`}" -->
          <!--:class="{myshow2:item.children && selectTag === index,
             myhide2:item.children && selectTag !== index}" -->
          <collapseTransition>
            <div
              v-if="item.children && selectTag === index"
              class="Nav__item_menu"
            >
              <div
                :class="{Nav__item_on: !!$route.path.match(items.value)}"
                v-for="(items, i) in item.children"
                :key="i"
                @click.stop="jump(items)"
              >{{items.label}}</div>
            </div>
          </collapseTransition>
          <!--:class="{myshow:item.menus && selectTag === index,
             myhide:item.menus && selectTag !== index}"
             :style="{height:(item.menus && selectTag === index?
            `${maxLength * 32 + 51 }px`:'0px')}"
             -->
          <collapseTransition>
            <NavMenu
              ref="NavMenu"
              :menuList="item.menus"
              :isShow="item.menus && selectTag === index?true:false"
              v-show="item.menus && selectTag === index"
            />
          </collapseTransition>
        </div>
      </div>
      <div class="Nav_input">
        <el-autocomplete
          v-model="search"
          value-key="title"
          size="small"
          :fetch-suggestions="querySearchAsync"
          suffix-icon="el-icon-search"
          placeholder="请输入内容"
          clearable
          @select="handleSelect"
        ></el-autocomplete>
      </div>
      <div class="Nav_options">
        <span
          style="padding:20px 10px"
          @click="jump('controlPanel')"
        >控制台</span>
        |
        <span
          v-if="!LOGINUSER"
          style="padding:20px 10px"
          @click="loginDiolag = true"
        >登录</span>
        <!-- <span
          class="user"
          v-else
          @click="jump('userCenter')"
        >
          <img src="../../assets/img/controlPanel/user.png" />
        </span>-->
        <el-dropdown
          placement="bottom-end"
          trigger="hover"
          v-else
        >
          <span
            class="user"
            @click="jump('userCenter')"
          >
            <img src="../../assets/img/controlPanel/user.png" />
            <span :title="LOGINUSER.username">{{LOGINUSER.username}}</span>
          </span>
          <el-dropdown-menu
            slot="dropdown"
            v-if="LOGINUSER"
          >
            <!-- <el-dropdown-item @click.native="dialogVisible = true">修改密码</el-dropdown-item> -->
            <el-dropdown-item @click.native="loginOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <Login
      :show.sync="loginDiolag"
      :showType.sync="loginType"
    />
  </section>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Login from "../Login/index.vue";
import NavMenu from "../NavMenu/index.vue";
import collapseTransition from "../../assets/js/collapseTransition"; // 重写el-collapse-transition动画 加入自定义时间

export default {
  name: "Nav",
  components: {
    Login,
    NavMenu,
    collapseTransition,
  },
  data() {
    return {
      List: [],
      selectTag: null,
      loginDiolag: false,
      loginType: "passwordLogin",
      search: "",
      checked: false,
      menuList: [
        { value: "home", label: "首页" },
        {
          value: "solution",
          label: "解决方案",
          children: [
            { value: "financialRisk", label: "金融风控" },
            { value: "schoolBus", label: "校车" },
            { value: "coach", label: "两客一危" },
            { value: "monitor", label: "智能监护" },
            { value: "IOT", label: "物联网" },
            { value: "Tencent", label: "公众号开发" },
            { value: "AITechnology", label: "AI视觉技术" },
          ],
        },
        {
          value: "AIDetect",
          label: "人脸识别AI",
        },
        // {
        //   value: "AIDetect",
        //   label: "人脸识别AI",
        //   children: [
        //     { value: "Detece", label: "人脸检测" },
        //     { value: "Compare", label: "人脸比对" },
        //   ],
        // },
        { value: "businessCooperation", label: "商务合作" },
        {
          value: "developDoc",
          label: "开发文档",
          menus: [
            {
              label: "暂无数据",
              value: [],
            },
          ],
        },
        { value: "serviceUpgrade", label: "服务升级" },
      ],
      restaurants: [],
      timeout: null,
    };
  },
  computed: {
    ...mapState(["USER", "LOGINUSER", "DocTag", "DocMenuTree"]),
    maxLength() {
      const arr = [];
      this.menuList.map((item) => {
        if (item.menus) {
          item.menus.map((item2) => {
            arr.push(item2.value.length);
          });
        }
      });
      return Math.max(...arr) > 10 ? 10 : Math.max(...arr);
    },
  },
  watch: {
    // LOGINUSER: {
    //   handler(val) {
    //     if (!val) {
    //       this.loginDiolag = true;
    //     }
    //   },
    //   immediate: true,
    //   deep: true
    // },
    DocMenuTree: {
      handler(val) {
        if (!val) return;
        this.List = [];
        this.restaurants = [];
        val.map((item, index) => {
          this.List.push({
            label: item.name,
            value: [],
          });
          if (item.children && item.children.length > 0) {
            item.children.map((item2, index2) => {
              if (item2.children && item2.children.length > 0) {
                item2.children.map((item3, index3) => {
                  this.List[index].value.push({
                    title: item3.name,
                    value: [index, index2, index3].join("-"),
                    index2: index2,
                  });
                });
              }
            });
          }
          this.menuList.map((items, i) => {
            if (items.menus) {
              this.menuList[i].menus = this.List;
            }
          });

          this.List.forEach((element) => {
            this.restaurants = this.restaurants.concat(element.value);
          });
        });
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations(["COMMIT_USER", "COMMIT_LOGINUSER", "COMMIT_DocTag"]),
    enter(index) {
      this.selectTag = index;
      // this.$nextTick(() => {
      //   console.log(this.$refs.NavMenu[0].$el.offsetHeight);
      //   setTimeout(() => {
      //     console.log(
      //       (document.getElementsByClassName(
      //         "myshow"
      //       )[0].style.height = `${this.$refs.NavMenu[0].$el.offsetHeight}px`)
      //     );
      //   }, 100);
      // });
    },
    leave() {
      this.selectTag = null;
    },
    async jump(item) {
      if (!this.LOGINUSER && ["userCenter", "controlPanel"].includes(item)) {
        this.loginDiolag = true;
        return;
      }
      if (["userCenter", "controlPanel"].includes(item)) {
        if (localStorage.getItem("firstRun") == null) {
          // 也就是说第一次进来的时候
          const routeData = this.$router.resolve({ name: "controlPanel" });
          window.open(routeData.href, "_blank");
        } else {
          const routeData = this.$router.resolve({ name: item });
          window.open(routeData.href, "_blank");
        }
      }
      if (this.$route.name === item.value) {
        return;
      }

      if (["developDoc"].includes(item.value)) {
        if (!this.DocTag) {
          this.COMMIT_DocTag("0-0-0");
        }
        this.$router.push({
          name: "developDoc",
        });
        return;
      }
      this.$router.push({ name: item.value });
    },
    querySearchAsync(queryString, cb) {
      const results = queryString
        ? this.restaurants.filter(this.createStateFilter(queryString))
        : this.restaurants;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 100);
    },
    createStateFilter(queryString) {
      return function (state) {
        return (
          state.title.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
        );
      };
    },
    handleSelect(item) {
      if (!item) return;
      this.COMMIT_DocTag(item.value);
      this.$router.push({
        name: "developDoc",
      });
    },
    loginOut() {
      this.$confirm
        .confirm("此操作将退出登录, 是否继续?", "提示", {
          showCancel: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          this.$msg({
            type: "success",
            message: "退出成功!",
          });
          localStorage.removeItem("LOGINUSER");
          this.COMMIT_LOGINUSER(null);
        })
        .catch(() => {
          this.$msg({
            type: "info",
            message: "已取消退出",
          });
        });
    },
  },
};
</script>

<style scoped lang="scss">
.Nav {
  height: 60px;
  display: flex;
  line-height: 60px;
  background: #000514;
  flex: 1;
  min-width: 1080px;
  // overflow: hidden;
  &__logo {
    display: flex;
    align-items: center;
    width: 320px;
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #ffffff;
    user-select: none;
    display: flex;
    justify-content: flex-end;
    img {
      height: 32px;
      cursor: pointer;
    }
  }

  &__content {
    flex: 1;
    display: flex;
    user-select: none;
    display: flex;
    justify-content: center;
  }

  &__item {
    z-index: 999;
    color: #fff;
    border-bottom: 2px solid transparent;
    padding: 0 30px;
    transition: border-color 0.3s, background-color 0.3s, color 0.3s;
    cursor: pointer;
    white-space: nowrap;
    transition: all 1s;
    position: relative;
    &:hover {
      color: #0856ea;
    }
    &_on {
      color: #0856ea;
      border-color: #ffffff;
    }
    &_menu {
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.24);
      color: #333;
      background: #ffffff;
      width: calc(100% + 60px);
      margin-left: -30px;
      // animation: test 0.5s;
      transition: all 1s;
      overflow: hidden;
      &:hover {
        color: #333;
      }
      & > div {
        height: 40px;
        text-align: center;
        line-height: 40px;
        &:hover {
          color: #0856ea;
          background: rgb(231, 231, 231);
        }
      }
    }
  }
  &_input {
    min-width: 150px;
    margin-right: 20px;
    ::v-deep .el-input--small .el-input__inner {
      border-radius: 13px;
      background: #07143c;
      border: none;
      color: #fff;
    }
  }
  &_options {
    white-space: nowrap;
    cursor: pointer;
    z-index: 999;
    color: #fff;
    font-size: 16px;
    margin-right: auto;
    min-width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__user {
    padding: 0 10px;
    color: #fff;
    cursor: pointer;
    outline: none;
    display: flex;
    align-items: center;
    font-size: 16px;
    user-select: none;
  }

  &__user-icon {
    margin-right: 10px;
    font-size: 22px;
  }

  &__dropdown-icon {
    margin-left: 10px;
    font-size: 14px;
  }
}
@keyframes test {
  0% {
    height: 0;
    opacity: 0;
    transition: all 0.2s;
  }
  100% {
    height: 200px;
    opacity: 1;
    transition: all 0.3s;
  }
}
.myshow {
  opacity: 1;
  transition: 0.2s;
  overflow: hidden;
}
.myhide {
  display: none;
  height: 0;
  opacity: 0;
  transition: 0.2s;
  overflow: hidden;
  pointer-events: none;
}
.myshow2 {
  overflow: hidden;
  opacity: 1;
  height: 280px;
  transition: 0.2s;
}
.myhide2 {
  height: 0;
  opacity: 0;
  transition: 0.2s;
  overflow: hidden;
  pointer-events: none;
}
.user {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  border: none;
  outline: none;
  img {
    width: 30px;
    height: 30px;
    border: none;
    outline: none;
  }
  span {
    color: #fff;
    margin-left: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
@media screen and (max-width: 1400px) {
  .Nav__item {
    padding: 0 20px !important;
  }
  .Nav__logo {
    width: 240px !important;
  }
}
@media screen and (max-width: 1200px) {
  .user {
    span {
      width: 55px;
    }
  }
}
</style>
