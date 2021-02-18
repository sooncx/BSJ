<template>
  <div class="vehStateDetail__header">
    <!-- 离线时间tabs -->
    <ul class="vehStateDetail__tabs">
      <li
        v-for="(item, index) in tabs"
        :key="index"
        :class="{ active: active === index }"
        @click="changeTab(index)"
      >
        <span>{{ item.name }}</span>
      </li>
    </ul>

    <!-- 有线 无线radio -->
    <div class="vehStateDetail__state">
      <a-radio-group
        name="state"
        v-model:value="stateVal"
        @change="stateChange"
      >
        <a-radio :value="0">全部</a-radio>
        <a-radio :value="2">有线</a-radio>
        <a-radio :value="1">无线</a-radio>
      </a-radio-group>
    </div>
  </div>

  <!-- 数据表格 -->
  <div
    class="vehStateDetail__table"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-table
      :data="tableData"
      max-height="400"
      height="400"
      size="mini"
      ref="tableRef"
    >
      <el-table-column
        label="序号"
        width="40"
        align="center"
        header-align="center"
      >
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        label="车牌号"
        prop="P"
        min-width="80"
        align="center"
        header-align="center"
      />
      <el-table-column
        label="SIM卡"
        min-width="80"
        prop="M"
        align="center"
        header-align="center"
      />
      <el-table-column
        label="终端编号"
        min-width="80"
        prop="N"
        align="center"
        header-align="center"
      />
      <el-table-column
        label="所属车组"
        min-width="80"
        prop="G"
        align="center"
        header-align="center"
      />
      <el-table-column
        label="车辆类型"
        min-width="80"
        prop="Y"
        align="center"
        header-align="center"
      />
      <el-table-column
        label="最后在线时间"
        prop="T"
        align="center"
        header-align="center"
        min-width="120"
      />
      <el-table-column
        label="离线时长"
        min-width="80"
        prop="S"
        align="center"
        header-align="center"
      />
      <el-table-column
        label="位置"
        prop="address"
        align="center"
        min-width="120"
        header-align="center"
      />
      <el-table-column
        label="关注度等级"
        prop="concernLevel"
        align="center"
        header-align="center"
        min-width="90"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.remark || '--'"
            placement="top"
            v-if="row.concernLevel !== 0"
          >
            <div :class="`vehStateDetail__dataType lvBg-${row.concernLevel}`">
              {{
                Number(row.concernLevel) === 1
                  ? "高"
                  : Number(row.concernLevel) === 2
                  ? "中"
                  : "低"
              }}
            </div>
          </el-tooltip>
          <div v-else>未关注</div>
        </template>
      </el-table-column>
      <el-table-column
        label="关注备注"
        prop="remark"
        min-width="60"
        align="center"
        header-align="center"
      />
      <el-table-column
        label="操作"
        prop="plate"
        align="center"
        min-width="60"
        header-align="center"
      >
        <template #default="{ row }">
          <el-popover
            placement="left"
            width="50"
            trigger="hover"
            popper-class="vehStateDetail__operation__popper"
          >
            <template #reference>
              <i class="iconfont icon-bsj-gzd"></i>
            </template>
            <ul class="vehStateDetail__operation__follow">
              <li @click="showModal(row, 1)">高</li>
              <li @click="showModal(row, 2)">中</li>
              <li @click="showModal(row, 3)">低</li>
              <li @click="showModal(row)">修改备注</li>
              <li @click="removeConcern(row)">清除关注</li>
            </ul>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 导出BTN 分页 -->
  <div class="vehStateDetail__footer">
    <a-button type="primary" @click="exportData"> 导出 </a-button>

    <a-pagination
      :total="total"
      :show-total="(total) => `共: ${total} 条`"
      :page-size="pageSize"
      size="small"
      v-model:current="current"
    />
  </div>

  <!-- 第二层MODAL 内容 -->
  <Modal
    title="填写关注备注"
    v-model:visible="show"
    :width="380"
    :zIndex="1001"
    :footer="null"
    :bodyStyle="{ padding: '0' }"
    :centered="true"
    :destroyOnClose="true"
    :maskClosable="false"
    :draggable="false"
  >
    <!-- 填写关注备注 -->
    <FollowRemark
      :rowData="tableRow"
      @confirm="remarkChange"
      @cancel="show = false"
    />
  </Modal>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  watchEffect,
  defineAsyncComponent,
} from "vue";
import { Modal } from "@/components/Modal/index";
import API from "@/api/home";
import APIType from "@/api/home/type";
import { GetGeo } from "@/api/apiFn";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "vehStateDetail",
  components: {
    Modal,
    FollowRemark: defineAsyncComponent(
      () => import("@/views/riskControlCenter/module/src/FollowRemark.vue")
    ),
  },

  setup(props, { emit }) {
    const loading = ref(false);
    // 离线时间切换
    const tabs = ref([
      { name: "离线一天内", beginOffTimeMin: 0, endOffTimeMin: 1440 },
      { name: "离线1-3天", beginOffTimeMin: 1440, endOffTimeMin: 4320 },
      { name: "离线3-7天", beginOffTimeMin: 4320, endOffTimeMin: 10080 },
      { name: "离线7-1个月", beginOffTimeMin: 10080, endOffTimeMin: 43200 },
      { name: "离线1个月以上", beginOffTimeMin: 43200, endOffTimeMin: 0 },
    ]);

    const active = ref(0);

    const changeTab = (index: number) => {
      active.value = index;
    };

    // 有线  无线切换
    const stateVal = ref(0);

    const stateChange = (e: Event) => {
      console.log(e);
    };

    // 表格
    const tableData = ref([]);

    // 分页
    const pagination = reactive({
      current: 1,
      total: 0,
      pageSize: 50,
    });

    const tableRef = ref();

    const getData = async () => {
      const info = {
        beginOffTimeMin: tabs.value[active.value].beginOffTimeMin,
        endOffTimeMin: tabs.value[active.value].endOffTimeMin,
        longStay: stateVal.value,
        pageSize: pagination.pageSize,
        pageNumber: pagination.current,
      };
      loading.value = true;
      const { flag, obj } = await API.pageOffOnline(info);

      if (flag === 1) {
        let posList: { lat: number; lon: number; tag: number }[] = [];
        obj.data.forEach((item: any, index: number) => {
          posList.push({
            lat: item.A,
            lon: item.O,
            tag: index,
          });
        });
        const addressList = await GetGeo(posList);

        tableData.value = obj.data.map((item: any, index: number) => ({
          ...item,
          index: index + (pagination.current - 1) * pagination.pageSize + 1,
          address: addressList[index].address,
        }));

        pagination.total = obj.total;
        tableRef.value.doLayout();
      }
      loading.value = false;
    };

    watchEffect(() => {
      getData();
    });

    //  跳转
    const link = () => {
      emit("update:visible", false);
    };

    const show = ref(false);
    const tableRow = ref();
    let concernLevel: number | undefined = undefined; // 关注度等级

    // 关注度设置
    const showModal = (row: any, level?: number) => {
      concernLevel = level || row.concernLevel;
      tableRow.value = row;
      show.value = true;
    };

    // 清除关注度
    const removeConcern = async (row: any) => {
      const { flag } = await API.DelUserConcern({ vehicleId: row.vehicleId });

      if (flag === 1) {
        tableData.value.forEach((item: any) => {
          if (item.index === row.index) {
            item.remark = "";
            item.concernLevel = 0;
          }
        });
      }
    };

    // 关注度改变
    const remarkChange = (val: string) => {
      show.value = false;
      tableData.value.forEach((item: any) => {
        if (item.index === tableRow.value.index) {
          item.remark = val;
          if (concernLevel || "concernLevel" in item) {
            AddUserConcern(item, val);
          } else {
            ElMessage.error("请添加关注度后再修改关注备注信息");
          }
        }
      });
    };

    // 添加/修改 关注度
    const AddUserConcern = async (row: any, remark?: string) => {
      const info = {
        concernLevel: concernLevel || row.concernLevel,
        vehicleId: tableRow.value.vehicleId,
        remark: remark,
      };

      const { flag } = await API.AddUserConcern(info);

      if (flag === 1) {
        row.concernLevel = concernLevel;
        concernLevel = undefined;
      }
    };

    // 导出数据
    const exportData = async () => {
      const info = {
        beginOffTimeMin: tabs.value[active.value].beginOffTimeMin,
        endOffTimeMin: tabs.value[active.value].endOffTimeMin,
        longStay: stateVal.value,
      };
      await API.exportOffOnline(info);
    };

    return {
      loading,
      tabs,
      active,
      changeTab,
      stateVal,
      stateChange,
      tableRef,
      tableData,
      ...toRefs(pagination),
      link,
      show,
      tableRow,
      showModal,
      removeConcern,
      remarkChange,
      exportData,
    };
  },
});
</script>
<style lang="less" scoped>
.vehStateDetail {
  &__header {
    height: 56px;
    display: flex;
  }

  &__tabs {
    display: flex;
    align-items: center;
    height: 56px;
    line-height: 56px;

    li {
      width: 120px;
      height: 100%;
      font-size: 14px;
      text-align: center;
      cursor: pointer;

      span {
        position: relative;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #5877a1;
      }

      span::after {
        content: "";
        position: absolute;
        bottom: -18px;
        left: 50%;
        width: 0;
        height: 2px;
        background: #0080ff;
        transition: 0.2s all linear;
      }
      &.active span {
        color: #fff;
      }
      &.active span::after,
      &:hover span::after {
        left: 0;
        width: 100%;
      }
    }
  }

  &__dataType {
    width: 21px;
    height: 21px;
    color: #fff;
    margin: auto;

    &.lvBg-1 {
      background-color: #f16767;
    }

    &.lvBg-2 {
      background-color: #f1b254;
    }

    &.lvBg-3 {
      background-color: #33e09a;
    }
  }

  &__operation {
    display: flex;
    padding: 0 5px;
    justify-content: space-around;

    &__follow {
      width: 100%;
      display: flex;
      flex-direction: column;

      li {
        margin: 0;
        padding: 5px 0;
        width: 80px;
        border-bottom: 1px solid #ddd;
        color: #3381e8;
        cursor: pointer;
        list-style: none;
        font-size: 12px;
        text-align: center;

        &:hover {
          background: #eee;
        }
      }
    }
  }

  &__state {
    display: flex;
    align-items: center;
    margin-left: 50px;
    .ant-radio-wrapper {
      color: #fff;
    }
  }

  &__table {
    ::v-deep(.el-table__body-wrapper) {
      overflow-y: auto;
    }

    ::v-deep(.el-table__empty-block),
    ::v-deep(.el-table__body-wrapper),
    ::v-deep(.el-table tr) {
      background: #18253a;
    }

    ::v-deep(.el-table th) {
      background: #2d394d;
    }

    // table边框颜色
    ::v-deep(.el-table--border:after, .el-table--group:after, .el-table:before) {
      background-color: #334d75;
    }

    ::v-deep(.el-table--border, .el-table--group) {
      border-color: #334d75;
    }

    ::v-deep(.el-table td),
    ::v-deep(.el-table th.is-leaf) {
      border-bottom: 1px solid #334d75;
    }

    ::v-deep(.el-table--border th, .el-table--border th.gutter:last-of-type) {
      border-bottom: 1px solid #334d75;
    }

    ::v-deep(.el-table--border td, .el-table--border th) {
      border-right: 1px solid #334d75;
    }

    ::v-deep(.el-table--border::after),
    ::v-deep(.el-table--group::after),
    ::v-deep(.el-table::before) {
      background-color: #334d75;
    }

    ::v-deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
      background-color: rgba(51, 77, 117, 0.8);
    }

    ::v-deep(.el-table thead),
    ::v-deep(.el-table) {
      color: #fff;
    }

    ::v-deep(.el-table .cell) {
      padding: 0 3px;
    }
  }

  &__footer {
    border-top: 1px solid #334d75;
    height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 23px;

    ::v-deep(.ant-pagination-total-text) {
      color: #8d9bb1;
    }

    ::v-deep(.ant-pagination-item a) {
      color: #8d9bb1;
    }

    ::v-deep(.ant-pagination-item-active a) {
      color: #0e60db;
    }

    ::v-deep(.ant-pagination-item-active) {
      background: #18253a;
      border: 0;
    }

    ::v-deep(.ant-pagination-prev a),
    ::v-deep(.ant-pagination-next a) {
      color: #8d9bb1;
    }
  }
}
</style>
<style>
/* 弹出框边框 */
.vehStateDetail__operation__popper.el-popover.el-popper {
  padding: 0;
}
</style>
