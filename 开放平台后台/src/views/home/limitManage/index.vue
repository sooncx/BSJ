<template>
  <div class="limitManage">
    <div class="topBar">
      <UserSelect
        v-model="searchValue"
        title="请输入用户名"
        :showRoot="true"
        style="margin:0 20px"
      />
      <el-button
        type="primary"
        plain
        size="small"
        @click="searchUser"
      >搜索</el-button>
    </div>
    <div class="content">
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="(item, index) in tabs"
          :key="index"
          :label="item.label"
          :name="item.name"
        >
          <div class="contentBox">
            <div class="contentBox_left">
              <el-tree
                ref="tree"
                highlight-current
                :data="treeData"
                :props="defaultProps"
                @node-click="handleNodeClick"
                node-key="userId"
              ></el-tree>
            </div>
            <div class="contentBox_right">
              <div style="padding-top:10px;background:#fff">
                <tabPanel
                  :appId.sync="activeName"
                  :mysearchValue.sync="searchValue"
                  :tableData.sync="tableData"
                  @saveOk="saveOk"
                />
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import tabPanel from "./tabPanel/index.vue";
import UserSelect from "../../../components/UserSelect/index.vue";

export default {
  name: "limitManage",
  components: {
    tabPanel,
    UserSelect
  },
  data() {
    return {
      tableData: [],
      searchValue: null,
      activeName: "1",
      pageSize: 200,
      current: 1,
      mysearchValue: null,
      searchFlag: true,
      defaultProps: {
        children: "children",
        label: "userName"
      },
      updateUserId: null,
      treeData: []
    };
  },
  mounted() {
    this.getTableData(this.activeName);
  },
  computed: {
    ...mapState(["APPLIST"]),
    tabs() {
      const arr = [];
      if (this.APPLIST) {
        this.APPLIST.map(item => {
          arr.push({
            label: item.name,
            name: item.appId.toString()
          });
        });
      }
      return arr;
    }
  },
  watch: {
    APPLIST: {
      handler(val) {
        if (val) {
          this.activeName = val[0].appId.toString();
        }
      }
    },
    $route: {
      handler(val) {
        if (val.name === "limitManage") {
          this.getTableData(this.activeName);
        }
      }
    }
  },
  methods: {
    handleNodeClick(data) {
      const arr = [];
      data.userAppInfo.map(item => {
        arr.push({
          ...item,
          id: item.userAppId,
          hasChildren: true
        });
      });
      this.tableData = arr;
    },
    async getTableData(id, userId) {
      this.tableData = [];
      const params = {
        appId: id,
        pageNumber: this.current,
        pageSize: 200
      };
      if (userId) {
        params.userId = userId;
      }
      const { obj } = await this.$API.getAppList(params);
      this.treeData = obj.data;
      console.log(this.treeData, "treeData");
      const selectLine = new Map();
      let myIndex = 0;
      if (obj.data) {
        obj.data.map((item, index) => {
          selectLine.set(item.userId, index);
        });
        // 用于刷新后获取当前修改行
        if (this.updateUserId) {
          myIndex = selectLine.get(this.updateUserId);
        }
      }
      if (obj.data && obj.data[myIndex].userAppInfo.length > 0) {
        obj.data[myIndex].userAppInfo.map(item => {
          this.tableData.push({
            ...item,
            id: item.userAppId,
            appId: id,
            userAppId: item.userAppId,
            hasChildren: true,
            showBtn: 1
          });
        });
        // 默认选中树节点第一条
        this.$nextTick(() => {
          const myUserId = parseInt(obj.data[myIndex].userId);
          this.$refs.tree[parseInt(this.activeName) - 1].setCurrentKey(
            myUserId
          );
        });
      }
      // 刷新数据后选中刷新前选中节点
      this.$nextTick(() => {
        const myUserId = parseInt(this.updateUserId);
        this.$refs.tree[parseInt(this.activeName) - 1].setCurrentKey(myUserId);
      });
      setTimeout(() => {
        this.updateUserId = null;
      }, 100);
      // if (obj.data) {
      //   const arr = [];
      //   obj.data.forEach(element => {
      //     arr.push({
      //       id: element.userAppId,
      //       bindUserName: element.bindUserName,
      //       userAppId: element.userAppId,
      //       userId: element.userId,
      //       userName: element.userName,
      //       hasChildren: false
      //     });
      //   });
      //   this.tableData = arr;
      // }
    },
    // handleCurrentChange(val) {
    //   this.current = val;
    //   // this.searchUser();
    // },
    // handleSizeChange(val) {
    //   this.pageSize = val;
    //   // this.searchUser();
    // },
    handleClick() {
      this.searchUser();
    },
    async saveOk(val) {
      this.updateUserId = val.userId;
      await this.searchUser();
    },
    searchUser() {
      if (!this.searchValue || !this.searchValue.userId) {
        this.getTableData(this.activeName);
      } else {
        this.getTableData(this.activeName, this.searchValue.userId);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.limitManage {
  flex: 1;
  overflow: auto;
  // padding: 20px;
  background: #f5f5fa;
  .topBar {
    height: 50px;
    width: 100%;
    background: #fff;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .content {
    background: #fff;
    padding: 20px 20px 0 20px;
    .contentBox {
      display: flex;
      background: #f5f5fa;
      &_left {
        @include scrollbar;
        overflow: auto;
        min-width: 200px;
        height: calc(100vh - 220px);
        background: #fff;
        margin-right: 10px;
        padding-right: 5px;
        padding-top: 10px;
      }
      &_right {
        width: 100%;
        min-width: 100px;
        height: calc(100vh - 210px);
      }
    }
  }
}
.el-input__inner,
.el-input {
  border-radius: 0;
  width: 200px;
  padding: 0 20px;
}
.el-button {
  border-radius: 0;
  background: #0856ea;
  color: #fff;
  border: none;
}
::v-deep .el-tabs__header {
  margin: 0;
}
// .el-tree--highlight-current
//   ::v-deep
//   .el-tree-node.is-checked
//   > .el-tree-node__content {
//   background-color: #f3f4f7;
//   color: rgb(64, 158, 255);
// }
.el-tree--highlight-current
  ::v-deep
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #f3f4f7;
  color: rgb(0, 158, 255);
}
</style>
