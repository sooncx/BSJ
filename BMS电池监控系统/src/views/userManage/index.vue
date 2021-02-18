<template>
  <ManageBox class="vehManage">
    <!-- 树状图开始 -->
    <FilterTree
      slot="left"
      v-model="group"
      @onAddGroup="handleOnAddGroup"
      @onDeleteGroup="handleOnDeleteGroup"
      @onEditGroup="handleOnEditGroup"
      @onHandleVeh="handleVeh"
    />
    <!-- 树状图结束 -->

    <template slot="right">
      <!-- 功能选项开始 -->
      <div class="vehManage__filterType">
        <el-button
          size="small"
          type="primary"
          @click="handleOnAddGroup()"
        >添加设备</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleOnEditGroup()"
        >转移</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleOnTransferVehs()"
        >删除</el-button>
        <el-button
          style="margin-left: auto"
          size="small"
          icon="el-icon-download"
          @click="handleOnExportFile()"
        >导出</el-button>
      </div>
      <!-- 功能选项结束 -->

      <!-- 表格开始 -->
      <el-table
        ref="table"
        border
        style="width: 100%"
        row-key="vehicleId"
        @selection-change="val => multipleSelection = val"
        :max-height="$refs.table && $refs.table.$el.offsetHeight"
      >
        <el-table-column
          align="center"
          type="selection"
          width="55"
          :reserve-selection="true"
        />
        <el-table-column
          fixed
          type="index"
          label="序号"
          width="100"
          align="center"
        >
          <span slot-scope="{$index}">{{(currentPage - 1) * pageSize + $index + 1}}</span>
        </el-table-column>
        <el-table-column
          prop="plate"
          label="电池编号"
          width="100"
          align="center"
        />
        <el-table-column
          prop="plateColor"
          label="设备号"
          width="100"
          align="center"
        />
        <el-table-column
          prop="organizationName"
          label="SIM卡号"
          width="100"
          align="center"
        />
        <el-table-column
          prop="productionTime"
          label="设备类型"
          align="center"
          min-width="150"
        />
        <el-table-column
          prop="vin"
          label="服务密码"
          align="center"
          min-width="150"
        />
        <el-table-column
          prop="model"
          label="安装时间"
          width="100"
          align="center"
        />
        <el-table-column
          prop="ownerName"
          label="激活时间"
          width="100"
          align="center"
        />
        <el-table-column
          prop="addVehicleTime"
          label="激活时间"
          align="center"
          min-width="150"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="200"
          align="center"
        >
          <template slot-scope="{row}">
            <el-button
              type="text"
              size="small"
              @click="handleVeh('modify', row)"
            >修改</el-button>
            <el-button
              type="text"
              size="small"
              @click="handleOnDeleteVehs({data:[row]})"
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
      <AddDeviceDialog
        :visible.sync="AddGroup.visible"
        :params="AddGroup.params"
        type="submit"
      />
      <EquipmentTransfer
        :visible.sync="EditGroup.visible"
        :params="EditGroup.params"
        type="submit"
      />
    </LazyRender>
  </ManageBox>
</template>

<script>
import { mapState } from "vuex";
import ManageBox from "@/components/ManageBox/index.vue";
import LazyRender from "@/components/LazyRender/index.vue";
import FilterTree from "./FilterTree.vue";
import AddDeviceDialog from "@/components/AddDeviceDialog/index.vue";
import EquipmentTransfer from "../../components/EquipmentTransfer/index.vue";

export default {
  name: "vehManage",
  components: {
    ManageBox,
    LazyRender,
    FilterTree,
    AddDeviceDialog,
    EquipmentTransfer
  },

  data() {
    return {
      multipleSelection: [], //当前选中项
      currentPage: 1,
      pageSize: 100,
      group: null, //当前组织
      tableData: [],
      //添加车组dialog props
      AddGroup: {
        visible: false,
        params: null
      },
      //修改车组dialog props
      EditGroup: {
        visible: false,
        params: null
      },
      //删除车组dialog props
      DeleteGroup: {
        visible: false,
        params: null
      },
      //转移车组dialog props
      TransferVehs: {
        visible: false,
        params: null
      },
      //删除车辆dialog props
      DeleteVehs: {
        visible: false,
        params: null
      },
      //处理车辆dialog props
      HandleVeh: {
        visible: false,
        params: null,
        type: "" //add modify disabled
      }
    };
  },

  watch: {
    group(val) {
      if (!val) return;
      this.doGetVehicleByOrganizationId(val);
    }
  },

  computed: {
    ...mapState(["USER"])
  },

  methods: {
    //导出车辆
    handleOnExportFile() {
      if (!this.tableData.length) {
        this.$msg({
          showClose: true,
          message: "无可导出的车辆",
          type: "warning"
        });
        return;
      }

      const params = {
        sessionId: this.USER.sessionId,
        organizationIds: String(this.group.organizationId)
      };
      this.$API.doWriteExcelVehicle(params);
    },
    //根据组织id显示车辆信息
    async doGetVehicleByOrganizationId({ organizationId }) {
      try {
        const { data } = await this.$API.doGetVehicleByOrganizationId({
          organizationId
        });
        this.tableData = data;
      } catch (error) {
        console.error(error);
        this.$msg({
          showClose: true,
          message: error.msg,
          type: "error"
        });
      }
    },
    //处理添加车组
    handleOnAddGroup() {
      this.AddGroup.visible = true;
    },
    //处理删除车组
    handleOnDeleteGroup({ ids }) {
      this.DeleteGroup.params = { ids };
      this.DeleteGroup.visible = true;
    },
    //处理修改车组
    handleOnEditGroup() {
      // this.EditGroup.params = { organizationId, userId, organizationName };
      this.EditGroup.visible = true;
    },
    //处理转移车辆
    handleOnTransferVehs({ type, data } = {}) {
      let param;
      if (type !== undefined && type === "select") {
        if (!this.multipleSelection.length) {
          this.$msg({
            showClose: true,
            message: "请选择车辆",
            type: "warning"
          });
          return;
        }
        param = [...this.multipleSelection];
      } else {
        param = data;
      }
      this.TransferVehs.params = param;
      this.TransferVehs.visible = true;
    },
    //处理删除车辆
    handleOnDeleteVehs({ type, data } = {}) {
      let param;
      if (type !== undefined && type === "select") {
        if (!this.multipleSelection.length) {
          this.$msg({
            showClose: true,
            message: "请选择车辆",
            type: "warning"
          });
          return;
        }
        param = [...this.multipleSelection];
      } else {
        param = data;
      }
      this.DeleteVehs.params = param;
      this.DeleteVehs.visible = true;
    },
    //处理车辆成功时重新请求接口
    handleVehOk(type) {
      if (!this.group) return;
      this.doGetVehicleByOrganizationId(this.group);
      type === "transfer" && this.$refs.table.clearSelection();
    },
    /**
     * @param {add | addToGroup | modify | disabled} 参数名 type
     */
    async handleVeh(type, data) {
      this.HandleVeh.visible = true;
      this.HandleVeh.params = data ? { ...data } : null;
      await this.$sleep(10); //延迟渲染dialog
      this.HandleVeh.type = type;
    }
  }
};
</script>

<style lang="scss" scoped>
.vehManage {
  &__filterType {
    display: flex;
    margin-bottom: 16px;
  }
}
</style>
