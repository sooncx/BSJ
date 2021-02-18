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
        :showGroup="false"
      />
      <el-button
        style="margin-left: 32px"
        size="small"
        type="primary"
        @click="getOBDReport(currentPage,pageSize)"
      >查询</el-button>
      <el-button
        style="margin-left: auto"
        size="small"
        @click="exportOBDReport()"
      >导出</el-button>
    </template>

    <div
      class="vehTypeManage__content"
      slot="content"
    >
      <!-- 表格开始 -->
      <!-- :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" -->
      <el-table
        height="100%"
        max-height="100%"
        :data="tableData"
        border
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
          prop="speed"
          label="速度"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="atmos"
          label="大气压力"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="coolantTemp"
          label="发动机冷却液温度"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="devTime"
          label="设备时间"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="dpf"
          label="DPF压差"
          align="center"
          min-width="120"
        />
        <el-table-column
          prop="dpfEgt"
          label="DPF排气温度"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="friction"
          label="摩擦扭矩"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="fuelFlow"
          label="发动机燃料流量"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="gasPedal"
          label="油门踏板"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="onflow"
          label="进气量"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="output"
          label="发动机净输出扭矩"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="reactor"
          label="反应剂余量"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="rpm"
          label="发动机转速"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="scrDown"
          label="SCR下游NOx传感器输出值"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="scrExitTemp"
          label="SCR出口温度"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="scrInletTemp"
          label="SCR入口温度"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="scrUp"
          label="SCR上游NOx传感器输出值"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="tFC"
          label="累计油耗"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="tankLevel"
          label="油箱液位"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="torqueMode"
          label="发动机扭矩模式"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="ureaInjection"
          label="实际尿素喷射量"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="ureaTemp"
          label="尿素箱温度"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="ureaTotal"
          label="累计尿素消耗量"
          align="center"
          min-width="100"
        />
        <!-- <el-table-column
          label="明细"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="check(scope.row)"
            >查看</el-button>
          </template>
        </el-table-column> -->
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
  </ManageBox>

</template>

<script>
import day from "dayjs";
import ManageBox from "@/components/ManageBox/index.vue";
import SelectInput from "@/components/SelectInput/index.vue";

export default {
  components: {
    ManageBox,
    SelectInput
  },
  data() {
    return {
      dialogData: null,
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
      getParams: {},
      total: 0,
      indexTag: false,
      oldCurrentPage: null
    };
  },
  watch: {
    currentPage(val, oldval) {
      this.oldCurrentPage = oldval;
    }
  },
  mounted() {},

  methods: {
    indexMethod(index) {
      if (this.indexTag) {
        console.log(this.currentPage)
        return (this.currentPage - 1) * this.pageSize + index + 1;
      } else return (this.oldCurrentPage - 1) * this.pageSize + index + 1;
    },
    //分页
    currentChange(val) {
      this.getOBDReport(val, this.pageSize);
    },
    handleSizeChange(val) {
      this.getOBDReport(this.currentPage, val);
    },
    //导出OBD历史报表
    async exportOBDReport() {
      if (!this.tableData.length) {
        this.$msg({
          showClose: true,
          message: "无可导出的数据",
          type: "warning"
        });
        return;
      }
      try {
        this.$API.exportOBDReport(this.getParams);
      } catch (error) {
        console.error(error);
        this.$msg({
          showClose: true,
          message: error.msg,
          type: "error"
        });
      }
    },
    //获取OBD历史报表数据
    async getOBDReport(currentPage, pageSize) {
      this.indexTag = false;
      if (this.searchValue === null) {
        // this.$msg({
        //   message: "输入框不可为空！",
        //   type: "error"
        // });
      } else {
        let params = {
          startTime: day(this.form.beginTime || this.form.dayBeginTime).format(
            "YYYY-MM-DD 00:00:00:0"
          ),
          endTime: day(this.form.endTime || new Date()).format(
            "YYYY-MM-DD 23:59:59:999"
          ),
          pageNumber: currentPage,
          pageSize: pageSize,
          vehicleId: this.searchValue ? this.searchValue.vehicleId : 0
        };
        this.getParams = params;
        try {
          const { data, total } = await this.$API.getOBDReport(params);
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
  &__footer {
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
