<template>
  <div class="TrendViewAll">
    <el-table
      :data="tableData"
      border
      size="small"
      height="450"
      max-height="450"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column
        type="selection"
        v-if="trendType === 'expire'"
        width="40"
      >
      </el-table-column> -->
      <el-table-column
        align="center"
        header-align="center"
        label="序号"
        width="60"
        v-if="trendType !== 'electric'"
      >
        <template #default="{ $index }">
          {{ (current - 1) * pageSize + $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in tableColumns"
        :key="index"
        :prop="item.key"
        :label="item.title"
        align="center"
        header-align="center"
      >
        <template
          v-if="trendType === 'insurance' && item.key === 'type'"
          #default="{ row }"
        >
          {{ row.type === 1 ? "首保" : "非首保" }}
        </template>
      </el-table-column>
    </el-table>
    <div class="TrendViewAll__pager">
      <a-pagination
        show-size-changer
        :page-size-options="['100', '200', '300', '400']"
        :total="total"
        :show-total="(total) => `共: ${total} 条`"
        size="small"
        v-model:pageSize="pageSize"
        v-model:current="current"
        @change="pageChange"
        @showSizeChange="pageChange"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, reactive, ref, toRefs, watch } from "vue";
import { colunmData } from "./columns";
import API from "@/api/riskControlCenter/";

export default defineComponent({
  props: {
    trendType: String,
  },
  setup(props) {
    const tableData = ref([]);
    const tableColumns = ref(
      props.trendType === "insurance"
        ? colunmData.insurance
        : props.trendType === "maintain"
        ? colunmData.maintain
        : props.trendType === "electric"
        ? colunmData.electric
        : props.trendType === "expire"
        ? colunmData.expire
        : []
    );

    nextTick(() => {
      watch(
        () => props.trendType,
        () => {
          getData();
        },
        {
          immediate: true,
        }
      );
    });

    const pagination = reactive({
      current: 1,
      pageSize: 100,
      total: 0,
      pageChange() {
        getData();
      },
    });

    const getData = async () => {
      const info = {
        pageSize: pagination.pageSize,
        pageNumber: pagination.current,
      };

      const { obj } =
        props.trendType === "expire"
          ? await API.getRenewRiskData(info)
          : props.trendType === "insurance"
          ? await API.getInsuranceRiskData(info)
          : props.trendType === "maintain"
          ? await API.getMaintainRiskData(info)
          : {
              obj: {
                data: [],
                total: 0,
              },
            };
      tableData.value = obj.data;
      pagination.total = obj.total;
    };

    // 多选表格
    const handleSelectionChange = (val: any) => {
      console.log(val);
    }

    return {
      tableData,
      tableColumns,
      ...toRefs(pagination),
      handleSelectionChange
    };
  },
});
</script>
<style lang="less" scoped>
.TrendViewAll {
  &__pager {
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
