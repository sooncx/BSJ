<template>
  <div class="Home">
    <div class="Home_content">
      <Nav />
      <keep-alive exclude="developDoc">
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Nav from "../components/Nav/index.vue";
import { treeConvertList } from "../assets/js/utils";

export default {
  name: "Home",
  components: {
    Nav,
  },
  data() {
    return {
      arr: [],
      tokenList: null,
    };
  },
  computed: {
    ...mapState(["LOGINUSER"]),
  },
  mounted() {
    this.$nextTick(async () => {
      await this.getUserMsg();
      await this.getMenu();
    });
  },
  methods: {
    ...mapMutations([
      "COMMIT_DocMenu",
      "COMMIT_USER",
      "COMMIT_LOGINUSER",
      "COMMIT_DocMenuTree",
    ]),
    async getList() {
      const { obj, flag } = await this.$API.applicationInfoQueryAll();
      if (flag === 1) {
        this.tokenList = obj.filter((item) => {
          if (item) {
            return item.appToken;
          }
        });
        // this.tokenList.push({
        //   appName: "智能AI",
        //   appType: 5,
        //   appToken:
        //     "152e7a01e56a4ff04bd4e7ab1a856746d4f30609a78e5ea4c93d3015994a22c6",
        //   projectId: 99,
        // });
      }
    },
    async getMenu() {
      await this.getList();
      const arr = [];
      const treeArr = [];
      this.tokenList.forEach(async (element, index) => {
        const { obj } = await this.$API.listInterfaceWord({
          appId: element.appId,
        });

        arr.push({
          name: element.appName,
          token: element.appToken,
          id: element.projectId,
          children: treeConvertList(obj).filter((item) => item.type === 3),
          tag: index,
          ...element,
        });
        treeArr.push({
          name: element.appName,
          token: element.appToken,
          id: element.projectId,
          children: obj,
          tag: index,
          ...element,
        });
        if (arr.length === this.tokenList.length) {
          await arr.sort((a, b) => {
            if (a) {
              return a.tag - b.tag;
            }
          });
        }
        this.arr = await arr.filter((item) => {
          if (item) {
            return item.children.length > 0;
          }
        });
        // const cx = {
        //   appName: "智能AI",
        //   appType: 5,
        //   children: [
        //     {
        //       name: '默认功能',
        //       children: [
        //         {
        //           name: "AI页面1",
        //         },
        //         {
        //           name: "AI页面2",
        //         },
        //       ],
        //     },
        //   ],
        //   id: 99,
        //   name: "智能AI",
        //   projectId: 99,
        //   tag: 4,
        // };
        // treeArr.findIndex(item => item.tag === 4) === -1 && this.arr.push(cx);
        // treeArr.findIndex((item) => item.tag === 4) === -1 && treeArr.push(cx);
        this.COMMIT_DocMenu(this.arr);
        this.COMMIT_DocMenuTree(treeArr.sort((a, b) => a.tag - b.tag));
      });
    },
    async getMenu1() {
      await this.getList();
      return new Promise((resolve) => {
        const arr = [];
        this.tokenList.forEach(async (element, index) => {
          if (!element.appToken) return;
          this.$http
            .get("http://47.115.157.89:8085/open/platform/doDispatch.json", {
              params: {
                toUrl: `http://47.115.157.89:8002/api/interface/list_menu?token=${element.appToken}&project_id=${element.projectId}&limit=999`,
              },
            })
            .then(async (res) => {
              const myData = JSON.parse(JSON.stringify(res.data.data));
              const list = [];
              await myData.map((item) => {
                if (item.list && item.list.length > 0) {
                  list.push(...item.list);
                }
              });
              const filterList = await list.filter((item) => {
                if (item) {
                  return item.catid != 912;
                }
              });
              // console.log(filterList, "filterList");
              arr.push({
                name: element.appName,
                token: element.appToken,
                id: element.projectId,
                children: filterList,
                tag: index,
                ...element,
              });
              if (arr.length === this.tokenList.length) {
                await arr.sort((a, b) => {
                  if (a) {
                    return a.tag - b.tag;
                  }
                });
              }
              this.arr = await arr.filter((item) => {
                if (item) {
                  return item.children.length > 0;
                }
              });
              const cx = {
                appName: "智能AI",
                appType: 5,
                children: [
                  {
                    title: "AI页面1",
                  },
                  {
                    title: "AI页面2",
                  },
                ],
                id: 99,
                name: "智能AI",
                projectId: 99,
                tag: 4,
              };
              this.arr.push(cx);
              this.COMMIT_DocMenu(this.arr);
            });
        });
        resolve(this.arr);
      });
    },
    async getUserMsg() {
      try {
        const { obj } = await this.$API.getUserMsg();
        await this.COMMIT_USER(obj);
      } catch (error) {
        console.log(error);
      }
    },
  },
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
