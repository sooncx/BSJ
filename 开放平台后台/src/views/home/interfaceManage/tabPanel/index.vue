<template>
  <div class="tabPanel">
    <div class="tabPanel_content">
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 1)"
        :data="tableData"
        stripe
        row-key="index"
        height="100%"
        max-height="100%"
        style="min-width: 100%"
        size="mini"
        ref="table"
      >
        <!-- @selection-change="val => multipleSelection = val" -->
        <!-- <el-table-column
        type="selection"
        width="36"
      >
      </el-table-column> -->
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          align="center"
          :fixed="item.fixed"
        >
          <template
            slot-scope="scope"
            class="tableScope"
          >
            {{format(scope.row[item.prop],item.type)}}
            <!-- <span class="tableScope_cell">{{format(scope.row[item.prop],item.type)}}</span>
          <i
            v-if="item.type === 1"
            class="iconfont icon-yingyong tableScope_icon"
          ></i>
          <i
            v-if="item.type === 2"
            class="iconfont icon-edu tableScope_icon"
          ></i> -->
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="130"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="$emit('changeInterface', scope.row)"
            >修改</el-button>
            <el-button
              type="text"
              size="small"
              @click="deleteInterface(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="tabPanel_footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="current"
        :page-sizes="[100, 200, 300, 400]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "tabPanel",
  components: {},
  props: {
    tableData: {
      type: Array
    },
    total: {
      type: Number,
      default: 0
    },
    activeName: {
      type: String
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
  watch: {
    activeName: {
      handler(val) {
        console.log(val, "activeName");
        this.$nextTick(() => {
          this.current = 1;
          this.pageSize = 100;
          this.$refs.table.doLayout();
        });
      },
      immediate: true
    }
  },
  data() {
    return {
      toggle: true,
      loading: false,
      // multipleSelection: [],
      columns: [
        {
          prop: "name",
          label: "接口名称",
          width: 80,
          type: 0,
          fixed: false
        },
        {
          prop: "url",
          label: "URL",
          width: 200,
          type: 0,
          fixed: false
        },
        // {
        //   prop: "interfacePath",
        //   label: "接口路径",
        //   width: 80,
        //   type: 0,
        //   fixed: false
        // },
        {
          prop: "interfaceQps",
          label: "QPS",
          width: 80,
          type: 1,
          fixed: false
        },
        {
          prop: "interfaceDayLimit",
          label: "限制调用次数/天",
          width: 120,
          type: 2,
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
      current: 1,
      pageSize: 100
    };
  },
  methods: {
    deleteInterface(data) {
      this.$msgBox
        .confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(async () => {
          const { flag, msg } = await this.$API.deleteInterface({
            appInterfaceId: data.appInterfaceId
          });
          if (flag === 1) {
            this.$msg.success(msg);
            this.$emit("delSuccess");
          } else {
            this.$msg.error(msg);
          }
        })
        .catch(() => {
          this.$msg({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSizeChange(val) {
      this.$emit("sizeChange", val);
    },
    handleCurrentChange(val) {
      this.$emit("currentChange", val);
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
  height: calc(100vh - 170px);
  &_content {
    height: calc(100vh - 205px);
  }
}
.tableScope {
  display: flex;
  justify-content: space-between;
  align-items: center;
  &_cell {
    padding-right: 10px;
  }
}
</style>
