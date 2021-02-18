<template>
  <div class="userManage">
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
      <!-- <el-table-column
        type="selection"
        width="36"
      >
      </el-table-column>-->
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width"
        align="center"
        :fixed="item.fixed"
      >
        <template slot-scope="scope">{{format(scope.row[item.prop],item.type)}}</template>
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
            @click="changePws(scope.row)"
          >修改密码</el-button>
          <el-button
            type="text"
            size="small"
            @click="deleteUser(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <changePws
      :visible.sync="dialogVisible"
      :data.sync="userData"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import changePws from "../../../components/changePws/index.vue";

export default {
  name: "userManage",
  components: {
    changePws
  },
  computed: {
    ...mapState(["USERLIST"]),
    tableData() {
      return this.USERLIST;
    }
  },
  data() {
    return {
      dialogVisible: false,
      userData: null,
      loading: false,
      columns: [
        // { prop: "index", label: "序号", width: 50, type: 0, fixed: false },
        {
          prop: "username",
          label: "用户名",
          width: 120,
          type: 0,
          fixed: false
        },
        {
          prop: "registerTime",
          label: "注册时间",
          width: 150,
          type: 0,
          fixed: false
        },
        {
          prop: "company",
          label: "企业名称",
          width: 80,
          type: 0,
          fixed: false
        },
        {
          prop: "nickname",
          label: "昵称",
          width: 80,
          type: 0,
          fixed: false
        },
        {
          prop: "birthday",
          label: "出生日期",
          width: 150,
          type: 0,
          fixed: false
        },
        {
          prop: "gender",
          label: "性别",
          width: 80,
          type: 0,
          fixed: false
        },
        {
          prop: "phone",
          label: "手机",
          width: 120,
          type: 0,
          fixed: false
        },
        {
          prop: "email",
          label: "邮箱",
          width: 150,
          type: 0,
          fixed: false
        }
      ]
    };
  },
  watch: {
    dialogVisible: {
      handler(val) {
        if (!val) {
          this.getData();
        }
      }
    },
    $route: {
      handler(val) {
        if (val.name === "userManage") {
          this.getData();
        }
      },
      deep: true
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapMutations(["COMMIT_USERLIST"]),
    getData() {
      this.$API.userInfoList().then(res => {
        res.obj.forEach(element => {
          if (element.sex) {
            element.gender = element.sex === 1 ? "男" : "女";
          }
        });
        this.COMMIT_USERLIST(res.obj);
      });
    },
    format(data) {
      return data || "--";
    },
    changePws(data) {
      console.log(data);
      this.userData = data;
      this.dialogVisible = true;
    },
    deleteUser(data) {
      this.$msgBox
        .confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(async () => {
          await this.$API.delUser({
            userId: data.userId
          });
          this.getData();
          this.$msg({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$msg({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.userManage {
  flex: 1;
  overflow: auto;
  padding: 20px;
  background: #fff;
}
</style>
