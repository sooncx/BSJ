<template>
  <ManageBox class="vehTypeManage">
    <template slot="upside">
      <el-input
        size="small"
        v-model.trim="model"
        autocomplete="off"
        style="width: 200px"
      />

      <el-button
        style="margin-left: 32px"
        size="small"
        type="primary"
        @click="handleOnquery()"
      >查询</el-button>

      <el-button
        style="margin-left: auto"
        size="small"
        type="primary"
        @click="handleVehType('add')"
      >新增</el-button>
      <el-button
        size="small"
        type="primary"
      >批量删除</el-button>
    </template>

    <div
      class="vehTypeManage__content"
      slot="content"
    >
      <!-- 表格开始 -->
      <el-table
        ref="table"
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        border
        style="min-width: 100%"
        row-key="vehicleId"
        :max-height="$refs.table && $refs.table.$el.offsetHeight"
      >
        <el-table-column
          fixed
          type="index"
          label="序号"
          width="50"
          align="center"
        />
        <el-table-column
          prop="model"
          label="车辆类型"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="engineType"
          label="发动机型号"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="emissionStandard"
          label="排放标准"
          min-width="100"
          align="center"
        >
          <template slot-scope="scope">
            <TypeSelect
              :value="scope.row.emissionStandard"
              type="emissionStandard"
              :text="true"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="exhaust"
          label="排气类型"
          min-width="100"
          align="center"
        >
          <template slot-scope="scope">
            <TypeSelect
              :value="scope.row.exhaust"
              type="exhaust"
              :text="true"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="fuelType"
          label="燃油类型"
          min-width="100"
          align="center"
        >
          <template slot-scope="scope">
            <TypeSelect
              :value="scope.row.fuelType"
              type="fuelType"
              :text="true"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="ureaBox"
          label="尿素箱容积"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="vehicleCompany"
          label="车辆生产企业"
          align="center"
          min-width="120"
        />
        <el-table-column
          prop="brand"
          label="车辆品牌"
          min-width="100"
          align="center"
        />

        <el-table-column
          prop="ratedPower"
          label="额定功率"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="maximumSpeed"
          label="最高转速"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="maximumPower"
          label="最大功率"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="maxQuality"
          label="最大总质量"
          align="center"
          min-width="100"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleVehType('modify', scope.row)"
            >修改</el-button>
            <el-button
              type="text"
              size="small"
              @click="handleVehType('disabled', scope.row)"
            >详情</el-button>
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
    </div>

    <LazyRender slot="plugins">
      <!-- 处理车辆信息dialog开始 -->
      <HandleVehTypeDialog
        :visible.sync="HandleVehType.visible"
        :type="HandleVehType.type"
        :params="HandleVehType.params"
        @onHandleVehTypeOk="handleOnquery()"
      />
      <!-- 处理车辆信息dialog结束 -->
    </LazyRender>
  </ManageBox>
</template>

<script>
import ManageBox from "@/components/ManageBox/index.vue";
import LazyRender from "@/components/LazyRender/index.vue";
import HandleVehTypeDialog from "@/components/HandleVehTypeDialog/index.vue";
import TypeSelect from "@/components/TypeSelect/index.vue";

export default {
  components: {
    ManageBox,
    LazyRender,
    HandleVehTypeDialog,
    TypeSelect
  },

  data() {
    return {
      model: "", //当前查询型号
      currentPage: 1,
      pageSize: 100,
      tableData: [],
      //处理车辆dialog props
      HandleVehType: {
        visible: false,
        params: null,
        type: "" //add modify disabled
      }
    };
  },

  mounted() {
    this.handleOnquery();
  },

  methods: {
    //处理删除车辆
    handleOnDeleteVehs(data) {
      this.DeleteVehs.params = [data];
      this.DeleteVehs.visible = true;
    },
    /**
     * @param {add | modify | disabled} 参数名 type
     */
    async handleVehType(type, data) {
      this.HandleVehType.params = data ? { ...data } : null;
      this.HandleVehType.visible = true;
      await this.$sleep(10); //延迟渲染dialog
      this.HandleVehType.type = type;
    },
    //根据车型来显示车辆信息
    async handleOnquery() {
      try {
        const { data } = await this.$API.doGetVehicleModel({
          model: this.model
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
    }
  }
};
</script>

<style lang="scss" scoped>
.vehTypeManage {
  &__content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 16px;
  }
}
</style>
