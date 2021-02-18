<template>
  <div class="tabPanel">
    <div class="tabPanel_content">
      <el-table
        :data="tableData.slice((current-1)*pageSize,current*pageSize)"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 1)"
        row-key="id"
        height="100%"
        max-height="100%"
        style="min-width: 100%"
        size="mini"
        ref="table"
        lazy
        :load="load"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        @expand-change="expand"
      >
        <!-- <el-table-column
          prop="userName"
          label="用户名"
          width="180"
          align="left"
        ></el-table-column> -->
        <el-table-column
          prop="bindName"
          label="绑定名称"
          min-width="100"
          align="left"
        >
          <template slot-scope="scope">{{scope.row.bindName || "--"}}</template>
        </el-table-column>
        <el-table-column
          prop="invokeLimit"
          label="总调用限额/日调用限额"
          min-width="150"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.invokeLimit?scope.row.invokeLimit:'--'}}
            <span
              style="color:green"
              v-if="scope.row.invokeLimit"
            >({{scope.row.comboType == 1?
              '日调用限额':'总调用限额'}})</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="comboType"
          label="套餐类型"
          min-width="80"
          align="center"
        >
          <template slot-scope="scope">{{scope.row.comboType == 1?"包年包月":scope.row.comboType == 2?
            "按次收费":'--'}}</template>
        </el-table-column>
        <el-table-column
          prop="urlName"
          label="接口名称"
          min-width="100"
          align="center"
        >
          <template slot-scope="scope">{{scope.row.urlName || "--"}}</template>
        </el-table-column>
        <el-table-column
          prop="qps"
          label="限制QPS"
          min-width="80"
          align="center"
        >
          <template slot-scope="scope">{{scope.row.qps || "--"}}</template>
        </el-table-column>
        <el-table-column
          prop="dayLimit"
          label="限制调用次数/天"
          min-width="120"
          align="center"
        >
          <template slot-scope="scope">{{scope.row.dayLimit || "--"}}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="80"
          align="center"
          fixed="right"
        >
          <!-- :disabled="!isRenew()" -->
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              :disabled="!isRenew()"
              @click="edit(scope.row)"
            >{{scope.row.showBtn == 2?'':'购买套餐'}}</el-button>
            <!-- <el-button
              type="text"
              size="small"
              @click="getInfinity('aba')"
            >
              {{"测试"}}
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="tabPanel_footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="current"
        :page-size.sync="pageSize"
        :page-sizes="[100, 200, 500]"
        layout="total,sizes, prev, pager, next, jumper"
        :total="tableData.length"
      />
    </div>
    <editDialog
      :visible.sync="visible"
      :formData.sync="formData"
      @save="save"
    />
    <renewalDialog
      :visible.sync="renewalShow"
      :rowData.sync="renewData"
      @saveOk="$emit('saveOk', selectItem)"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import editDialog from "./editDialog/index.vue";
import renewalDialog from "./renewalDialog/index.vue";

export default {
  name: "tabPanel",
  components: {
    editDialog,
    renewalDialog
  },
  props: {
    appId: {
      type: String
    },
    mysearchValue: {
      type: Object
    },
    searchFlag: {
      type: Boolean
    },
    tableData: {
      type: Array
    }
  },
  mounted() {
    // window.onresize = () => {
    //   console.log("resize");
    //   this.$nextTick(() => {
    //     this.$refs.table.doLayout();
    //   });
    // };
  },
  computed: {
    ...mapState(["RENEWLIST"])
  },
  data() {
    return {
      visible: false,
      renewalShow: false,
      formData: {},
      renewData: {},
      loading: false,
      multipleSelection: [],
      columns: [
        {
          prop: "interfaceName",
          label: "接口名称",
          width: 80,
          type: 0,
          fixed: false
        },
        {
          prop: "URL",
          label: "URL",
          width: 80,
          type: 0,
          fixed: false
        },
        {
          prop: "interfacePath",
          label: "接口路径",
          width: 80,
          type: 0,
          fixed: false
        },
        {
          prop: "QPS",
          label: "QPS",
          width: 80,
          type: 0,
          fixed: false
        },
        {
          prop: "operUserName",
          label: "限制调用次数/天",
          width: 130,
          type: 0,
          fixed: false
        },
        {
          prop: "operUserName",
          label: "调用量",
          width: 80,
          type: 0,
          fixed: false
        }
      ],
      pageSize: 100,
      current: 1,
      total: 0,
      saveMap: new Map(),
      selectArr: [],
      selectItem: null
    };
  },
  methods: {
    getInfinity(str) {
      if (!str) return;
      const arr = str.split("");
      // 'abcab'
      let num = 0;
      const res = arr.reduce((max, val, i) => {
        num = arr[val] >= num ? arr[val] + 1 : num;
        arr[val] = i;
        return Math.max(max, i - num + 1);
      }, 0);
      return res;
    },
    handleSizeChange(val) {
      this.$emit("handleSizeChange", val);
    },
    handleCurrentChange(val) {
      this.$emit("handleCurrentChange", val);
    },
    edit(data) {
      console.log(data, "修改");
      this.selectItem = data;
      if (data.showBtn == 2) {
        this.formData = { ...data, appId: this.appId };
        this.visible = true;
      } else {
        this.renewalShow = true;
        this.renewData = { ...data, appId: this.appId };
      }
    },
    isRenew() {
      if (!this.RENEWLIST) {
        return;
      }
      const arr = this.RENEWLIST.filter(item => {
        if (item) return item.appId == this.appId;
      });
      if (arr.length > 0) {
        return true;
      }
      return false;
    },
    async save(data) {
      console.log(data.showBtn, "showBtn");
      if (data && data.showBtn === 1) {
        const params = {
          userAppId: data.userAppId,
          invokeLimitNum: data.invokeLimit
        };
        const { flag } = await this.$API.updateUserAppInvokeNum(params);
        if (flag === 1) {
          // this.reload(data);
          this.$emit("saveOk");
          setTimeout(() => {
            this.visible = false;
          }, 100);
          // setTimeout(() => {
          //   this.reload(data);
          // }, 1000);
        }
      } else {
        const params = {
          qps: data.qps,
          dayLimit: data.dayLimit,
          userAppId: data.userAppId,
          appInterfaceId: data.appInterfaceId
        };
        if (data.limitId) {
          params.limitId = data.limitId;
        }
        const { flag } = await this.$API.modifyLimit(params);
        if (flag === 1) {
          this.reload(data);
          setTimeout(() => {
            this.visible = false;
          }, 100);
        }
      }
    },
    // 重新加载懒加载
    reload(data) {
      console.log(data, "reload");
      const { userAppId } = data;
      const { tree, treeNode, resolve } = this.saveMap.get(userAppId);
      this.$set(this.$refs.table.store.states.lazyTreeNodeMap, userAppId, []);
      this.load(tree, treeNode, resolve);
    },
    async getInterfaceById(id) {
      try {
        const { obj } = await this.$API.getInterFaceByuserId({
          appId: this.appId,
          userAppId: id,
          pageNumber: this.current,
          pageSize: 200
        });
        return obj;
      } catch (error) {
        console.log(error);
      }
    },
    async load(tree, treeNode, resolve) {
      // this.selectUserAppId = tree.userAppId;
      this.saveMap.set(tree.userAppId, { tree, treeNode, resolve });
      const list = await this.getInterfaceById(tree.userAppId);
      const arr = list.data.map(item => ({
        dayLimit: item.dayLimit,
        qps: item.qps,
        appInterfaceId: item.appInterfaceId,
        limitId: item.limitId || null,
        id: Math.random(),
        urlName: item.urlName,
        userAppId: tree.userAppId,
        showBtn: 2
      }));
      this.selectArr = arr;
      if (arr.length > 0) {
        setTimeout(() => {
          resolve(arr);
        }, 100);
      } else {
        const arr2 = [
          {
            id: Math.random(),
            dayLimit: "暂无数据"
          }
        ];
        resolve(arr2);
      }
    },
    expand(row, expandedRows) {
      // 关闭后重新加载数据
      if (!expandedRows) {
        this.reload(row);
      }
    },
    changeInterface(data) {
      console.log(data);
    },
    deleteInterface(data) {
      console.log(data);
    },
    format(data) {
      return data || "--";
    }
  }
};
</script>
<style lang="scss" scoped>
.tabPanel {
  flex: 1;
  overflow: auto;
  height: calc(100vh - 210px);
  background: #fff;
  &_content {
    height: calc(100vh - 260px);
  }
}
// ::v-deep .el-table__header-wrapper {
//   padding-top: 10px;
// }
</style>
