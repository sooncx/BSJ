<template>
  <ManageBox>
    <Upside
      slot="upside"
      @onExportFile="handleOnExportFile"
      @onHandleUser="handleUser"
    />

    <FliterTree
      slot="left"
      v-model="userIds"
      @onDeleteUser="handleOnDeleteUser"
      @onHandleUser="handleUser"
    />

    <template slot="right">
      <!-- 表格开始 -->
      <el-table
        ref="table"
        :max-height="$refs.table && $refs.table.$el.offsetHeight"
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        style="width: 100%"
        row-key="userId"
      >
        <el-table-column
          fixed
          prop="userName"
          label="登录账号"
          align="center"
          width="150"
        />
        <el-table-column
          prop="password"
          label="密码"
          align="center"
        />
        <el-table-column
          prop="emailAddress"
          label="邮箱地址"
          align="center"
          width="200"
        />
        <el-table-column
          prop="phone"
          label="手机号码"
          align="center"
        />
        <el-table-column
          prop="stateType"
          label="使用状态"
          align="center"
        >
          <el-button
            slot-scope="{row}"
            class="stateTypeBtn"
            :class="{stateTypeBtn_warning: row.stateType === 1}"
            type="text"
            size="small"
            @click="handleStateType(row)"
          >
            {{["使用", "禁止"][row.stateType]}}
          </el-button>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200"
          fixed="right"
          align="center"
        >
          <template slot-scope="{row}">
            <el-button
              type="text"
              size="small"
              @click="handleUser('add', {parentId: row.userId, userRights: 123, stateType: 0})"
            >新增下级</el-button>
            <el-button
              type="text"
              size="small"
              @click="handleUser('modify', {...row, userRights: 123, stateType: 0})"
            >修改</el-button>
            <el-button
              type="text"
              size="small"
              @click="handleBindGroup('submit', row)"
            >绑定</el-button>
            <el-button
              type="text"
              size="small"
              @click="handleOnDeleteUser({ids: String(row.userId)})"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格结束 -->

      <!-- 分页开始 -->
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="tableData.length"
      />
      <!-- 分页结束 -->
    </template>

    <LazyRender slot="plugins">
      <!-- 处理用户信息dialog开始 -->
      <HandleUserDialog
        :visible.sync="HandleUser.visible"
        :type="HandleUser.type"
        :params="HandleUser.params"
      />
      <!-- 处理用户信息dialog结束 -->

      <!-- 删除用户dialog开始 -->
      <DeleteUsersDialog
        :visible.sync="DeleteUser.visible"
        :params="DeleteUser.params"
      />
      <!-- 删除用户dialog结束 -->

      <!-- 绑定车组dialog开始 -->
      <BindGroupDialog
        :visible.sync="BindGroup.visible"
        type="submit"
        :params="BindGroup.params"
      />
      <!-- 绑定车组dialog结束 -->
    </LazyRender>
  </ManageBox>
</template>

<script>
import { mapState } from "vuex";
import ManageBox from "@/components/ManageBox/index.vue";
import LazyRender from "@/components/LazyRender/index.vue";
import HandleUserDialog from "@/components/HandleUserDialog/index.vue";
import DeleteUsersDialog from "@/components/DeleteUsersDialog/index.vue";
import BindGroupDialog from "@/components/BindGroupDialog/index.vue";
import FliterTree from "./FliterTree.vue";
import Upside from "./Upside.vue";

export default {
  name: "userManage",
  components: {
    ManageBox,
    LazyRender,
    HandleUserDialog,
    DeleteUsersDialog,
    BindGroupDialog,
    FliterTree,
    Upside
  },
  props: {},
  data() {
    return {
      currentPage: 1,
      pageSize: 100,
      userList: [],
      userIds: [], //当前用户以及其子级用户ids
      //处理用户dialog props
      HandleUser: {
        visible: false,
        params: null,
        type: "" //add modify disabled
      },
      //删除用户dialog props
      DeleteUser: {
        visible: false,
        params: null
      },
      //绑定车组dialog props
      BindGroup: {
        visible: false,
        params: null
      }
    };
  },

  computed: {
    ...mapState(["USER", "USERLIST"]),
    tableData() {
      const { userIds, USERLIST, USER } = this;
      if (!USER) return [];
      if (!USERLIST.length) return [];
      let tableData;
      if (userIds.length) {
        const userListMap = new Map(USERLIST.map(item => [item.userId, item])); //当前用户id 与 用户 的映射
        tableData = userIds.map(userId => userListMap.get(userId)); //从映射中拿到值
      } else {
        tableData = [...USERLIST];
      }

      tableData[0].userId === USER.userId && tableData.shift();
      return tableData; //过滤掉当前用户
    }
  },

  methods: {
    //导出用户
    handleOnExportFile() {
      const params = {
        userId: this.userIds.length ? this.userIds[0] : this.USER.userId
      };
      this.$API.exportUser(params);
    },
    async handleStateType(row) {
      try {
        const state = row.stateType === 0 ? 1 : 0;

        await this.$API.doChangeState({
          state,
          userIds: String(row.userId)
        });

        row.stateType = state;
      } catch (error) {
        console.error(error);
        this.$msg({
          showClose: true,
          message: error.msg,
          type: "error"
        });
      }
    },
    //处理删除车辆
    handleOnDeleteUser(data) {
      this.DeleteUser.params = data;
      this.DeleteUser.visible = true;
    },
    /**
     * @param {add | modify} 参数名 type
     */
    handleUser(type, data) {
      console.log(type);
      this.HandleUser.type = type;
      this.HandleUser.params = data ? { ...data } : null;
      this.HandleUser.visible = true;
    },
    handleBindGroup(type, { userId }) {
      this.BindGroup.params = { userId };
      this.BindGroup.visible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.stateTypeBtn {
  &_warning {
    color: rgba(#f44, 0.8);

    &:focus,
    &:hover {
      color: #f44;
    }
  }
}
</style>
