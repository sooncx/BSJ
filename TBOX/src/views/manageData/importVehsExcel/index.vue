<template>
  <ManageBox
    class="importVehsExcel"
    leftWidth="500px"
    :draggable="false"
  >
    <template slot="left">
      <Steps
        :options="stepsOptions"
        :active="step"
      />

      <div class="importVehsExcel__form">
        <div class="importVehsExcel__title">批量导入</div>
        <el-form
          :model="model"
          ref="form"
          :rules="rules"
          label-width="90px"
          :disabled="step !== 0"
        >
          <el-form-item
            label="所属组织:"
            prop="organization"
          >
            <TreeSelect
              v-model="model.organization"
              :data="treeData"
              :props="defaultProps"
              node-key="organizationId"
              icon="icon-truckgroup"
              width="360px"
            />
          </el-form-item>

          <el-form-item
            label="选择文件:"
            prop="multipartFile"
          >
            <el-upload
              class="importVehsExcel__upload"
              :class="{importVehsExcel__upload_disabled: step >= 1,importVehsExcel__upload_success: !!model.multipartFile || step === 2, importVehsExcel__upload_error: step === 1}"
              drag
              action=""
              :http-request="({file}) => model.multipartFile = file"
              :show-file-list="false"
            >
              <i class="el-icon-upload" />
              <div
                class="el-upload__text"
                 v-html="model.multipartFile ? model.multipartFile.name : ['将excel文件拖到此处，或<em>点击上传</em>','请检验数据', '<em>上传成功</em>'][step]"
              ></div>
            </el-upload>
          </el-form-item>
        </el-form>

        <div class="importVehsExcel__btn">
          <el-button
            type="primary"
            plain
            size="small"
            :disabled="stepsOptions[1].icon === 'el-icon-loading'"
            @click="handleUploadBtnClick()"
          >{{  ["上传", "上一步", "完成"][step]}} </el-button>
        </div>

        <div class="importVehsExcel__title">注意事项</div>
        <div class="importVehsExcel__tip">
          首次使用,<el-button
            type="text"
            style="padding: 0"
            @click="$API.doDownFile({sessionId: USER.sessionId})"
          >请点击下载最新导入模板!</el-button><br />
          请避免您的账号,同一时间,使用不同电脑进行批量导入！！<br />
          一次批量提交的车辆数不能超过 1000台，如果超过限制将提交失败！<br />
          如果系统提示您有未完成的任务，可能是上次批量导入未完成或此时
          其他电脑正在用您的账户进行批量导入。
        </div>
      </div>
    </template>
    <template slot="right">
      <div
        class="importVehsExcel__title"
        style="margin-top: 0"
      >检验数据</div>
      <div class="importVehsExcel__check">
        <transition-group
          name="el-fade-in"
          mode="out-in"
        >
          <!-- 暂无数据开始 -->
          <Empty
            key="0"
            v-show="step <= 1 && !tableData.length"
          />
          <!-- 暂无数据结束 -->

          <!-- 表格开始 -->
          <div
            key="1"
            class="importVehsExcel__table"
            v-if="step === 1 && tableData.length"
          >
            <el-table
              height="100%"
              ref="table"
              :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              border
              style="width: 100%;"
              row-key="line"
              :row-class-name="({row}) => row.isOk ? '' : 'danger'"
              :max-height="$refs.table && $refs.table.$el.offsetHeight"
            >
              <el-table-column
                fixed
                prop="line"
                label="行数"
                align="center"
                min-width="50"
              />
              <el-table-column
                prop="plate"
                label="车牌号"
                align="center"
                min-width="100"
              />
              <el-table-column
                prop="organizationName"
                label="所属组织"
                align="center"
                min-width="100"
              />
              <el-table-column
                prop="errorTip"
                label="错误信息"
                align="center"
                min-width="200"
              >
                <span
                  :title="row.errorTip"
                  class="importVehsExcel__errorTip"
                  slot-scope="{row}"
                >
                  {{row.errorTip}}
                </span>
              </el-table-column>
              <el-table-column
                prop="sim"
                label="设备SIM号"
                align="center"
                min-width="120px"
              />
              <el-table-column
                prop="plateColor"
                label="车辆颜色"
                align="center"
                min-width="100"
              />
              <el-table-column
                prop="vehicleType"
                label="车辆类型"
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
              </el-table-column>
              <el-table-column
                prop="emissionStandard"
                label="排放标准"
                align="center"
                min-width="100"
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
                prop="engineType"
                label="发动机型号"
                min-width="130px"
                align="center"
              />
              <el-table-column
                prop="equipmentNumber"
                label="设备号"
                align="center"
                min-width="100"
              />
              <el-table-column
                prop="frameNo"
                label="车架号"
                align="center"
                min-width="100"
              />
              <el-table-column
                prop="vin"
                label="VIN号"
                align="center"
                min-width="100"
              />
              <el-table-column
                prop="ownerName"
                label="车主名称"
                align="center"
                min-width="100"
              />
              <el-table-column
                prop="ownerPhone"
                label="联系号码"
                align="center"
                min-width="100"
              />
              <el-table-column
                prop="imei"
                label="imei"
                align="center"
                min-width="100"
              />
              <el-table-column
                prop="iccId"
                label="iccId"
                align="center"
                min-width="100"
              />
              <el-table-column
                prop="fuelType"
                label="燃油类型"
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
              </el-table-column>
              <el-table-column
                prop="productionTime"
                label="初次登记日期"
                align="center"
                min-width="150px"
              />
              <el-table-column
                prop="ownerAddress"
                label="车主地址"
                align="center"
                min-width="100"
              />
              <el-table-column
                prop="totalNo"
                label="总客数"
                align="center"
                min-width="100"
              />
              <el-table-column
                fixed="right"
                label="操作"
                width="100"
                align="center"
              >
                <template slot-scope="{row}">
                  <el-button
                    type="text"
                    size="small"
                    @click="handleCorrectVeh(row)"
                  >修改</el-button>
                </template>
              </el-table-column>
            </el-table>

            <div
              class="importVehsExcel__btn"
              style="margin-top: 16px"
            >
              <el-button
                type="primary"
                plain
                size="small"
                @click="doUpdateErrorVehicleMessage()"
              >提交</el-button>
            </div>
          </div>
          <!-- 表格结束 -->

          <!-- 导入成功开始 -->
          <Result
            key="2"
            v-show="step === 2"
            class="importVehsExcel__result"
            status="success"
            title="提交成功"
            :subtitle="`成功提交<em>${importSum}</em>条数据至(${model.organization && model.organization.organizationName})`"
          >
            <el-button
              type="primary"
              plain
              size="small"
              @click="handleUploadBtnClick()"
            >确定</el-button>
          </Result>
          <!-- 导入成功结束 -->
        </transition-group>
      </div>
    </template>

    <LazyRender slot="plugins">
      <!-- 处理车辆信息dialog开始 -->
      <HandleVehDialog
        :visible.sync="CorrectVeh.visible"
        type="correct"
        :params="CorrectVeh.params"
        @onCorrectOk="handleOnCorrectOk"
      />
      <!-- 处理车辆信息dialog结束 -->
    </LazyRender>
  </ManageBox>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import ManageBox from "@/components/ManageBox/index.vue";
import { toTreeData } from "@/assets/js/base";
import TreeSelect from "@/components/TreeSelect/index.vue";
import TypeSelect from "@/components/TypeSelect/index.vue";
import Empty from "@/components/Empty/index.vue";
import Result from "@/components/Result/index.vue";
import Steps from "@/components/Steps/index.vue";
import HandleVehDialog from "@/components/HandleVehDialog/index.vue";
import LazyRender from "@/components/LazyRender/index.vue";

export default {
  name: "importVehsExcel",

  components: {
    ManageBox,
    TreeSelect,
    TypeSelect,
    Empty,
    Result,
    Steps,
    HandleVehDialog,
    LazyRender
  },

  data() {
    return {
      step: 0, //步骤
      stepsOptions: [
        { label: "上传", icon: "iconfont icon-Cloudupload" },
        { label: "验证", icon: "iconfont icon-test" },
        { label: "提交", icon: "iconfont icon-success" }
      ],
      model: {
        organization: null,
        multipartFile: null
      },
      rules: {
        organization: [
          {
            required: true,
            message: "所属组织不能为空", //this.$t("login.username_rules"),
            trigger: "change"
          },
          { type: "object", message: "所属组织不能为空" }
        ],
        multipartFile: [
          {
            required: true,
            message: "导入文件不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ]
      },
      defaultProps: {
        children: "children",
        label: "organizationName"
      },
      currentPage: 1,
      pageSize: 100,
      tableData: [],
      //改正车辆dialog props
      CorrectVeh: {
        visible: false,
        params: null
      },
      importSum: 0 //导入总数
    };
  },

  computed: {
    ...mapState(["GROUPLIST", "USER"]),
    treeData() {
      return toTreeData(this.GROUPLIST, {
        id: "organizationId",
        parentId: "parentId"
      });
    }
  },

  mounted() {
    this.doGetErrorVehicleMessage();
  },

  methods: {
     ...mapMutations(["COMMIT_GROUPLIST"]),
    //处理上传按钮点击
    async handleUploadBtnClick() {
      if (this.step === 0) {
        this.doImportExcelVehicle();
        return;
      }

      if (this.step === 1) {
        try {
          await this.$msgBox.confirm(
            "将返回第一步重新上传，是否继续？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          );

          //清除临时表
          await this.$API.doDelCVehicle();
        } catch (error) {
          console.error(error);
          if (typeof error === "object") {
            this.$msg({
              showClose: true,
              message: error.msg,
              type: "error"
            });
          }
        }
      }

      if (this.step === 2) {
        this.$refs.form.resetFields();
      }

      this.step = 0;
      this.tableData = [];
    },
    //上传
    async doImportExcelVehicle() {
      try {
        await this.$refs.form.validate();
        this.step = 1;
        this.stepsOptions[1].icon = "el-icon-loading";

        let params = new FormData();
        params.append("organizationId", this.model.organization.organizationId);
        params.append("multipartFile", this.model.multipartFile);

        const { msg, total } = await this.$API.doImportExcelVehicle(params);
        this.$msg({
          showClose: true,
          message: msg,
          type: "success"
        });

        this.stepsOptions[1].icon = "iconfont icon-test";
        this.importSum = total;
        this.step = 2;
                //更新车组
        const { data } = await this.$API.doShowOrganization();
        this.COMMIT_GROUPLIST(data);
      } catch (error) {
        console.error(error);
        if (!error) {
          this.$msg({
            showClose: true,
            message: "请输入正确字段",
            type: "error"
          });
          return;
        }

        this.stepsOptions[1].icon = "iconfont icon-test";
        if (error.code === 60006) {
          //如果错误码为 60006 则代表上次导入没有完成
          this.doGetErrorVehicleMessage();
          return;
        }

        if (error.data) {
          this.tableData = error.data;
        } else {
          this.step = 0;
          this.$msg({
            showClose: true,
            message: error.msg,
            type: "error"
          });
        }
      }
    },
    //判断上次是否导入完成
    async doGetErrorVehicleMessage() {
      const { data } = await this.$API.doGetErrorVehicleMessage();
      if (!data.length) return;

      try {
        await this.$msgBox.confirm("你有未完成的进度是否继续？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });

        //跳转检验数据
        this.step = 1;
        this.tableData = data;

        //获取导入车组
        const { organizationId, organizationName } = data[0];
        this.model.organization = { organizationId, organizationName };
      } catch (error) {
        console.error(error);
        //取消则清除临时表
        await this.$API.doDelCVehicle();
      }
    },
    //处理改正车辆
    handleCorrectVeh(row) {
      this.CorrectVeh.params = { ...row };
      this.CorrectVeh.visible = true;
    },
    //处理改正成功
    handleOnCorrectOk(row) {
      let item = this.tableData.find(({ line }) => line === row.line);
      Object.assign(item, row, { isOk: true });
    },
    //修改错误信息
    async doUpdateErrorVehicleMessage() {
      try {
        let tableDataCopy = [...this.tableData];
        tableDataCopy.map(item => delete item.isOk);
        const params = JSON.stringify({
          cursorVehicle: tableDataCopy,
          organizationId: tableDataCopy[0].organizationId
        });
        const { msg, total } = await this.$API.doUpdateErrorVehicleMessage({
          json: params
        });

        this.importSum = total;
        this.step = 2;

        this.$msg({
          showClose: true,
          message: msg,
          type: "success"
        });
      } catch (error) {
        console.error(error);
        if (error.data.length > 0) {
          this.tableData = error.data;
        } else {
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
.importVehsExcel {
   &__upload {
    &_disabled {
      /deep/ .el-upload-dragger {
          border-color: #d9d9d9 !important;
      }
    }

    &_success {
      .el-icon-upload {
        color: $primary;
      }
    }

    &_error {
      .el-icon-upload {
        color: rgba(211, 21, 21, 1);
      }
    }
  }

  &__form {
    padding-right: 19px;
  }

  &__btn {
    display: flex;
    justify-content: flex-end;
  }

  &__title {
    margin: 36px 0;
    font-size: 16px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 10px;
    margin-bottom: 24px;

    &::before {
      content: "";
      display: inline-block;
      width: 3px;
      height: 80%;
      background: $primary;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translate(0, -50%);
    }
  }

  &__tip {
    font-size: 12px;
    color: #606266;
    line-height: 30px;
    padding: 0 0 0 10px;
  }

  &__check {
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  &__table {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;

    /deep/ .el-table__row.danger {
      background: #fef0f0;
    }
  }

  /deep/ &__result {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__errorTip {
    @include ellipsis();
  }
}
</style>
