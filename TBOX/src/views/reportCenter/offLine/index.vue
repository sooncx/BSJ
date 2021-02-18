<template>
  <ManageBox class="vehTypeManage">
    <template slot="upside">
      <SelectInput
        v-model="searchValue"
        style="margin: 20px"
      />

      <el-input-number
        placeholder="开始时间"
        v-model="beginTimeMin"
        controls-position="right"
        :min="0"
        :max="999999"
        size="small"
        style="margin-right: 20px;width: 120px"
      ></el-input-number>

      <el-input-number
        placeholder="结束时间"
        v-model="endTimeMin"
        controls-position="right"
        :min="0"
        :max="999999"
        size="small"
        style="margin-right: 20px;width: 120px"
      ></el-input-number>
      <el-select
        v-model="value"
        placeholder="请选择"
        size="small"
        style="width: 100px"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 32px"
        size="small"
        type="primary"
        @click="getOfflineReport(currentPage,pageSize)"
      >查询</el-button>

      <el-button
        style="margin-left: auto"
        size="small"
        @click="exportOfflineReport()"
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
        max-height="100%"
        height="100%"
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
          min-width="100"
          align="center"
        />
        <!-- <el-table-column
          prop="vehicleType"
          label="车辆型号"
          align="center"
          min-width="100"
        >
          <template slot-scope="scope">
            <TypeSelect
              :value="scope.row.vehicleType"
              type="vehicleType"
              :text="true"
            />
          </template>
        </el-table-column> -->
        <el-table-column
          prop="lastLocationTimeStr"
          label="最后在线时间"
          align="center"
          min-width="120"
        />
        <el-table-column
          label="最后位置点"
          min-width="250"
          align="center"
          prop="address"
        />
        <el-table-column
          prop="offlineTime"
          label="离线时长"
          align="center"
          min-width="100"
        />
        <el-table-column
          fixed="right"
          label="地图"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              :disabled="scope.row.disabled"
              @click="showMap(scope.row)"
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
    <div slot="plugins">
      <el-dialog
        width="700px"
        :visible="dialogTableVisible"
        @close="dialogTableVisible = false"
      >
        <MapDialog
          :coordinate="coordinate"
          :address="address"
          :vehicleType="vehicleType"
        />
        <!-- <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="dialogTableVisible = false"
          >确 定</el-button>
        </div> -->
      </el-dialog>

    </div>
  </ManageBox>
</template>

<script>
import ManageBox from "@/components/ManageBox/index.vue";
import MapDialog from "@/components/MapDialog/index.vue";
import SelectInput from "@/components/SelectInput/index.vue";

export default {
  components: {
    ManageBox,
    MapDialog,
    SelectInput
  },
  data() {
    return {
      coordinate: {},
      vehicleType: null,
      address: null,
      value: 1,
      options: [
        {
          value: 1,
          label: "天"
        },
        {
          value: 2,
          label: "小时"
        },
        {
          value: 3,
          label: "分钟"
        }
      ],
      place: null,
      beginTimeMin: 1,
      endTimeMin: 7,
      //   ruleForm: {
      //     beginTimeMin: null,
      //     endTimeMin: null
      //   },
      //   rules: {
      //     beginTimeMin: [
      //       { required: true, message: "请输入开始分钟", trigger: "blur" },
      //       { pattern: /^[0-9]{1,}$/, message: "请输入正确分钟", trigger: "blur" }
      //     ],
      //     endTimeMin: [
      //       { required: true, message: "请输入结束分钟", trigger: "blur" },
      //       { pattern: /^[0-9]{1,}$/, message: "请输入正确分钟", trigger: "blur" }
      //     ]
      //   },
      searchValue: null,
      model: "", //当前查询型号
      currentPage: 1,
      pageSize: 100,
      tableData: [],
      getParams: {},
      total: 0,
      dialogTableVisible: false,
      indexTag: false,
      oldCurrentPage: null
    };
  },
  watch: {
    currentPage(val, oldval) {
      this.oldCurrentPage = oldval;
    }
  },
  mounted() {
    this.getOfflineReport(this.currentPage, this.pageSize);
  },

  methods: {
    indexMethod(index) {
      if (this.indexTag) {
        console.log(this.currentPage);
        return (this.currentPage - 1) * this.pageSize + index + 1;
      } else return (this.oldCurrentPage - 1) * this.pageSize + index + 1;
    },
    showMap(row) {
      this.dialogTableVisible = true;
      this.coordinate = {
        lat: row.lat,
        lon: row.lon
      };
      this.address = row.address;
      this.vehicleType = row.vehicleType;
      //this.coordinate = [row.lat, row.lon, row.address, row.vehicleType];
    },
    //分页
    currentChange(val) {
      this.getOfflineReport(val, this.pageSize);
    },
    handleSizeChange(val) {
      this.getOfflineReport(this.currentPage, val);
    },
    timeTomin() {
      if (this.endTimeMin <= this.beginTimeMin) {
        this.$msg({
          message: "结束时间必须大于开始时间！",
          type: "error"
        });
      }
      this.beginTimeMin =
        this.beginTimeMin === undefined ? 0 : this.beginTimeMin;
      this.endTimeMin = this.endTimeMin === undefined ? 1 : this.endTimeMin;
    },
    //导出离线报表
    async exportOfflineReport() {
      this.timeTomin();
      if (!this.tableData.length) {
        this.$msg({
          showClose: true,
          message: "无可导出的数据",
          type: "warning"
        });
        return;
      }
      try {
        this.$API.exportOfflineReport(this.getParams);
      } catch (error) {
        console.error(error);
        this.$msg({
          showClose: true,
          message: error.msg,
          type: "error"
        });
      }
    },
    //获取离线报表数据
    async getOfflineReport(currentPage, pageSize) {
      this.indexTag = false;
      this.timeTomin();
      let params = {
        beginTimeMin:
          this.value === 1
            ? this.beginTimeMin * 24 * 60
            : this.value === 2
            ? this.beginTimeMin * 60
            : this.beginTimeMin || 0,
        endTimeMin:
          this.value === 1
            ? this.endTimeMin * 24 * 60
            : this.value === 2
            ? this.endTimeMin * 60
            : this.endTimeMin || 999999,
        pageNumber: currentPage,
        pageSize: pageSize
      };
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
      // const { organizationId, vehicleId } = this.searchValue;
      try {
        const { data, total } = await this.$API.getOfflineReport(params);
        this.total = total;
        const addressList = await this.$API.GetGeo(data);
        addressList.map(({ address, tag }) => {
          data[tag].address = address;
          data[tag].disabled = address === "获取位置失败" ? true : false;
        });
        this.tableData = Object.freeze(data);
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
/deep/ .el-dialog__body,
/deep/ .el-dialog__header {
  padding: 0;
}
/deep/ .el-icon-close {
  position: relative;
  z-index: 999;
}
</style>
