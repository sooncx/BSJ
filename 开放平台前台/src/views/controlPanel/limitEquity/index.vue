<template>
  <section class="limitEquity">
    <div class="limitEquity__header">
      <h2>额度权益</h2>
    </div>

    <div class="limitEquity__container">
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="(item, index) in applist"
          :key="index"
          :label="item.appName"
          :name="item.appType.toString()"
        ></el-tab-pane>
        <!-- <el-tab-pane
          label="车联网"
          name="1"
        ></el-tab-pane> -->
      </el-tabs>
      <div class="tableBox">
        <el-table
          :data="tableData"
          height="100%"
          max-height="100%"
          class="limitEquity__table"
          ref="table"
        >
          <el-table-column
            prop="name"
            label="服务接口名称"
            min-width="130"
            align="center"
            header-align="center"
          ></el-table-column>
          <el-table-column
            label="免费用户（每日调用总额度为：1000次）"
            align="center"
            header-align="center"
          >
            <!-- <el-table-column
              prop="dayLimit"
              label="配额（次/日）"
              align="center"
              header-align="center"
            ></el-table-column> -->
            <el-table-column
              prop="qps"
              label="并发（次/秒）"
              align="center"
              header-align="center"
            ></el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        @size-change="getTableData"
        @current-change="getTableData"
        :current-page.sync="currentPage"
        :page-sizes="[50, 100, 300, 500]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      activeName: "1",
      tableData: [],
      applist: [],
      total: 0,
      pageSize: 50,
      currentPage: 1
    };
  },
  mounted() {
    this.getList();
    this.getTableData();
  },
  watch: {
    $route: {
      handler(to) {
        if (to.name === "limitEquity") {
          this.getList();
          this.getTableData();
          this.$nextTick(() => {
            this.$refs.table.doLayout();
          });
        }
      }
    }
  },
  methods: {
    async getList() {
      const { obj, flag } = await this.$API.applicationInfoQueryAll();
      if (flag === 1) {
        this.applist = obj;
      }
    },
    getTableData() {
      this.$API
        .listFreeInterface({
          appId: this.activeName,
          pageSize: this.pageSize,
          currentPage: this.currentPage
        })
        .then(res => {
          // console.log(res);
          this.total = res.obj.total;
          this.tableData = res.obj.data;
        });
    },
    handleClick() {
      this.pageSize = 50;
      this.currentPage = 1;
      this.getTableData();
    }
  }
};
</script>
<style lang="scss" scoped>
.limitEquity {
  height: 100%;
  &__header {
    height: 40px;
    line-height: 40px;
    width: 100%;
    display: flex;
    align-items: center;
    padding-right: 20px;
    box-sizing: border-box;
    justify-content: flex-start;
    h2 {
      font-size: 18px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
  }

  &__container {
    margin-top: 17px;
    height: calc(100% - 57px);
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 4px 8px 0px rgba(91, 95, 107, 0.08);
    padding: 10px 20px;
    box-sizing: border-box;
  }
  .tableBox {
    height: calc(100vh - 260px);
  }
}
::v-deep .el-table th {
  background: rgba(250, 250, 250, 1);
  color: rgba(51, 51, 51, 1);
}
::v-deep .el-pagination {
  padding: 10px 0;
}
</style>
