<template>
  <div class="downloadTbale">
    <div class="downloadTbale__header">
      <a-select
        v-model:value="filter"
        style="width: 120px"
        ref="select"
        @change="handleChange"
      >
        <a-select-option value="">全部</a-select-option>
        <a-select-option :value="1">报警记录</a-select-option>
        <a-select-option :value="2">里程记录</a-select-option>
        <a-select-option :value="3">全部资料</a-select-option>
      </a-select>

      <a-button type="primary" @click="refrech">刷新</a-button>
    </div>
    <div class="downloadTbale__table">
      <el-table
        :data="tableData"
        ref="tableRef"
        height="400"
        max-height="400"
        border
        size="mini"
        v-loading="loading"
      >
        <el-table-column
          label="序号"
          width="60"
          align="center"
          header-align="center"
        >
          <template #default="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          label="文件名"
          min-width="250"
          prop="fileName"
          align="center"
          header-align="center"
        />
        <el-table-column
          label="类型"
          prop="fileName"
          align="center"
          header-align="center"
          min-width="90"
        >
          <template #default="{ row }">
            {{
              row.type === 1
                ? "报警记录"
                : row.type === 2
                ? "里程记录"
                : "全部资料"
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          header-align="center"
          min-width="90"
        >
          <template #default="{ row }">
            <span
              :style="{
                color:
                  row.status === 3
                    ? 'green'
                    : row.status === 4
                    ? 'red'
                    : '#000',
              }"
            >
              {{
                row.status === 1
                  ? "等待下载"
                  : row.status === 2
                  ? "正在导出"
                  : row.status === 3
                  ? "导出成功"
                  : row.status === 4
                  ? "导出失败"
                  : ""
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          align="center"
          header-align="center"
          min-width="140"
        />
        <el-table-column
          label="操作"
          prop="createTime"
          align="center"
          header-align="center"
          width="70"
        >
          <template #default="{ row }">
            <a-button type="link" @click="download(row)" size="small"
              >下载</a-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="downloadTbale__pagin">
      <a-pagination
        show-size-changer
        :page-size-options="['100', '200', '300', '400']"
        :total="total"
        :show-total="(total) => `共: ${total} 条`"
        size="small"
        v-model:pageSize="pageSize"
        v-model:current="current"
        @change="onSearch"
        @showSizeChange="onSearch"
      />
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  nextTick,
  reactive,
  Ref,
  ref,
  toRefs,
} from "vue";
import API from "@/api/httpApi";

export default defineComponent({
  setup() {
    const loading = ref(false);
    const filter = ref("");
    const handleChange = (e: any) => {
      getData();
    };

    const tableData = ref([]);
    const tableRef = <any>ref(null);

    const pagination = reactive({
      current: 1,
      pageSize: 100,
      total: 0,
      onSearch(current: number, pageSize: number) {
        getData();
      }
    });

    const getData = async () => {
      loading.value = true;
      const info = {
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
        type: filter.value,
      };

      const { obj } = await API.listRecord(info);

      tableData.value = obj.data;
      pagination.total = obj.total;

      tableRef.value.doLayout();

      loading.value = false;
    };

    nextTick(() => {
      getData();
    });

    const refrech = () => {
      getData();
    };

    const download = (row: any) => {
      console.log(row);
      API.download({ fileName: row.fileName });
    };

    return {
      loading,
      filter,
      tableData,
      tableRef,
      handleChange,
      refrech,
      download,
      ...toRefs(pagination)
    };
  },
});
</script>
<style lang="less" scoped>
.downloadTbale {
  width: 100%;
  padding: 0 24px;
  &__header {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__pagin {
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
