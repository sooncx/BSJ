<template>
  <div class="commandInfo">
    <el-table
      :data="tableData"
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
          {{ pageSize * (current - 1) + $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        label="车牌"
        prop="plate"
        min-width="120"
        align="center"
        header-align="center"
      />
      <el-table-column
        label="上下行时间"
        prop="time"
        min-width="120"
        align="center"
        header-align="center"
      />
      <el-table-column
        label="指令"
        min-width="120"
        prop="commandType"
        align="center"
        header-align="center"
      />
      <el-table-column
        label="文本信息"
        min-width="360"
        prop="commandMsg"
        align="center"
        header-align="center"
      />
    </el-table>
    <div class="commandInfo__pagin">
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
import { defineComponent, nextTick, reactive, ref, toRefs } from "vue";
import { ElMessage } from "element-plus";
import dayJs from "dayjs";
import API from "@/api/httpApi";

export default defineComponent({
  setup() {
    const loading = ref(false);
    const tableData = ref();

    const getData = async (msgFlag?: boolean) => {
      try {
        loading.value = true;
        const { flag, obj, msg } = await API.QueryTextUpAndCmdDownInfo({
          pageNumber: pagination.current,
          pageSize: pagination.pageSize,
          time: localStorage.getItem('commandTime') || dayJs(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss"),
        });

        if (flag === 1) {
          msgFlag && ElMessage.success(msg);
          localStorage.setItem('commandTime', obj.data.time);
          tableData.value = obj.data.data;
          pagination.total = obj.total;
        }
        loading.value = false;
      } catch (error) {
        ElMessage.error(error.msg ? error.msg : error);
      }
    };

    const pagination = reactive({
      current: 1,
      pageSize: 100,
      total: 0,
      onSearch(current: number, pageSize: number) {
        getData();
      }
    });

    nextTick(() => {
      getData(true);
    });

    return {
      loading,
      tableData,
      ...toRefs(pagination),
    };
  },
});
</script>
<style lang="less" scoped>
.commandInfo {
  width: 100%;
  padding: 16px 24px 0;
  &__pagin {
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
