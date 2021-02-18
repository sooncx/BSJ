<template>
  <ManageBox class="vehTypeManage">
    <template slot="upside">
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
      >
        <el-form-item>
          <el-col :span="11">
            <el-date-picker
              size="small"
              type="date"
              placeholder="开始日期"
              v-model="form.beginTime"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
          <el-col
            class="line"
            :span="1"
          >-</el-col>
          <el-col :span="11">
            <el-date-picker
              size="small"
              type="date"
              placeholder="结束日期"
              v-model="form.endTime"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
        </el-form-item>
      </el-form>
      <SelectInput
        v-model="searchValue"
        style="margin: 20px"
      />
      <el-button
        style="margin-left: 32px"
        size="small"
        type="primary"
        @click="getMileageReport(currentPage,pageSize)"
      >查询</el-button>

      <el-button
        style="margin-left: auto"
        size="small"
        @click="exportMileageReport()"
      >导出</el-button>
    </template>

    <div
      class="vehTypeManage__content"
      slot="content"
    >
      <!-- 表格开始 -->
      <!-- :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" -->
      <el-table
        :data="tableData"
        border
        height="100%"
        max-height="100%"
        style="min-width: 100%"
        row-key="vehicleId"
      >
        <el-table-column
          fixed
          type="index"
          :index="indexMethod"
          label="序号"
          width="50"
          align="center"
        />
        <el-table-column
          prop="plate"
          label="车牌号"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="organizationName"
          label="所属组织"
          align="center"
          min-width="100"
        />
        <!-- <el-table-column
          prop="equipmentNumber"
          label="设备号"
          align="center"
          min-width="120"
        /> -->
        <el-table-column
          prop="beginTimeStr"
          label="开始时间"
          align="center"
          min-width="150"
        />
        <el-table-column
          prop="endTimeStr"
          label="结束时间"
          align="center"
          min-width="150"
        />
        <el-table-column
          prop="drivingMileage"
          label="行驶里程(km)"
          align="center"
          min-width="150"
        />
        <el-table-column
          prop="countDays"
          label="营运天数"
          align="center"
          min-width="100"
        />
        <el-table-column
          fixed="right"
          label="明细"
          min-width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="getMileageDetail(scope.row)"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格结束 -->

      <!-- 分页开始 -->
      <el-pagination
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :page-sizes="[20, 50, 100]"
        @size-change="handleSizeChange"
        @current-change="currentChange"
        layout="total, prev, pager, next"
        :total="total"
      />
      <!-- 分页结束 -->
    </div>
    <!-- <div
      class="vehTypeManage__footer"
      slot="footer"
    >
      <div>
        <BarChar></BarChar>
      </div>
    </div> -->
    <div slot="plugins">
      <Dialog
        :visible.sync="detailDialog"
        :data="dialogData"
        :loading="loading"
        @exportDetail="exportDetail"
      />
    </div>
  </ManageBox>

</template>

<script>
import day from "dayjs";
import ManageBox from "@/components/ManageBox/index.vue";
import Dialog from "@/components/MileageDetailDialog/index.vue";
import SelectInput from "@/components/SelectInput/index.vue";

export default {
  components: {
    ManageBox,
    Dialog,
    SelectInput
  },
  data() {
    return {
      loading: true,
      dialogData: null,
      detailDialog: false,
      form: {
        beginTime: day(new Date()).subtract(7, "day"),
        endTime: new Date(),
        dayBeginTime: day(new Date()).subtract(7, "day")
      },

      place: null,
      searchValue: null,
      value: "",
      model: "", //当前查询型号
      currentPage: 1,
      pageSize: 100,
      tableData: [],
      exportParams: {},
      getParams: {},
      total: 0,
      indexTag: false,
      oldCurrentPage: null
    };
  },
  watch: {
    currentPage(val,oldval) {
      this.oldCurrentPage = oldval;
    }
  },
  mounted() {
    this.getMileageReport(this.currentPage, this.pageSize);
  },

  methods: {
    indexMethod(index) {
      if (this.indexTag) {
        return (this.currentPage - 1) * this.pageSize + index + 1;
      } else return (this.oldCurrentPage - 1) * this.pageSize + index + 1;
    },
    currentChange(val) {
      this.getMileageReport(val, this.pageSize);
    },
    handleSizeChange(val) {
      this.getMileageReport(this.currentPage, val);
    },
    //导出里程报表明细
    async exportDetail() {
      if (!this.dialogData.length) {
        this.$msg({
          showClose: true,
          message: "无可导出的数据",
          type: "warning"
        });
        return;
      }
      try {
        this.$API.exportMileageDetail(this.exportParams);
      } catch (error) {
        console.error(error);
        this.$msg({
          showClose: true,
          message: error.msg,
          type: "error"
        });
      }
    },
    //获取里程报表明细数据
    async getMileageDetail(row) {
      this.dialogData = null;
      this.detailDialog = true;
      this.loading = true;
      let params = {
        beginTime:
          row.beginTimeStr === "--"
            ? day(
                day(this.form.beginTime || this.form.dayBeginTime).format(
                  "YYYY-MM-DD 00:00:00:0"
                )
              ).valueOf()
            : new Date(row.beginTimeStr).valueOf(),
        endTime:
          row.endTimeStr === "--"
            ? day(
                day(this.form.endTime || new Date()).format(
                  "YYYY-MM-DD 23:59:59:999"
                )
              ).valueOf()
            : day(
                day(new Date(row.endTimeStr)).format("YYYY-MM-DD HH:mm:ss:999")
              ).valueOf(),
        vehicleId: row.vehicleId
      };
      this.exportParams = params;
      try {
        const { data } = await this.$API.getMileageDetail(params);
        var localData = data.map(({ beginLat, beginLon, endLat, endLon }) => [
          { lat: beginLat, lon: beginLon },
          { lat: endLat, lon: endLon }
        ]);
        // for (let i = 0; i < localData.length; i++) {
        //   const addressList = await this.$API.GetGeo(localData[i]);
        //   (data[i].start = addressList[0].address),
        //     (data[i].end = addressList[1].address);
        // }
        var arr = [];
        for (let i in localData) {
          arr.push(localData[i][0]);
          arr.push(localData[i][1]);
        }
        const addressList = await this.$API.GetGeo(arr);
        for (let i = 0; i < localData.length; i++) {
          (data[i].start = addressList[2 * i].address),
            (data[i].end = addressList[2 * i + 1].address);
        }
        this.dialogData = data;
        this.loading = false;
      } catch (error) {
        console.error(error);
        this.$msg({
          showClose: true,
          message: error.msg,
          type: "error"
        });
      }
    },
    //导出里程报表
    async exportMileageReport() {
      if (!this.tableData.length) {
        this.$msg({
          showClose: true,
          message: "无可导出的数据",
          type: "warning"
        });
        return;
      }
      try {
        this.$API.exportMileageReport(this.getParams);
      } catch (error) {
        console.error(error);
        this.$msg({
          showClose: true,
          message: error.msg,
          type: "error"
        });
      }
    },
    //获取里程报表数据
    async getMileageReport(currentPage, pageSize) {
      this.indexTag = false;
      let params = {
        beginTime: day(
          day(this.form.beginTime || this.form.dayBeginTime).format(
            "YYYY-MM-DD 00:00:00:0"
          )
        ).valueOf(),
        endTime: day(
          day(this.form.endTime || new Date()).format("YYYY-MM-DD 23:59:59:999")
        ).valueOf(),
        pageNumber: currentPage,
        pageSize: pageSize
      };
      console.log(params.endTime);
      if (
        this.searchValue != null &&
        !this.searchValue.hasOwnProperty("organizationId")
      ) {
        params.vehicleId = this.searchValue.vehicleId;
      }
      if (
        this.searchValue != null &&
        this.searchValue.hasOwnProperty("organizationId")
      ) {
        params.organizationId = this.searchValue.organizationId;
      }
      this.getParams = params;
      try {
        const { data, total } = await this.$API.getMileageReport(params);
        this.total = total;
        this.tableData = data;
        this.indexTag = true;
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
/deep/ .el-pagination {
  padding-top: 20px;
}
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
// /deep/.el-input {
//   width: 100px !important;
//   margin-left: 20px !important;
// }
span {
  color: rgb(179, 179, 179);
  margin: 10px;
}
/deep/ .el-form-item {
  margin-bottom: 2px;
}
/deep/ .el-form-item__content {
  margin-left: 0 !important;
  width: 300px;
}
/deep/ .el-col-1 {
  margin-left: 2%;
}
</style>
