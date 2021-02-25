<template>
  <div class="basicTemplate">
    <!-- 数据筛选 -->
    <div class="basicTemplate__filter">
      <slot name="filter" />
    </div>

    <!-- 表格数据 -->
    <div class="basicTemplate__table" ref="tableBox" v-loading="loading" element-loading-text="拼命加载中">
      <el-table
        :data="tableData"
        border
        size="small"
        style="width: 100%"
        :max-height="tableBox && tableBox.offsetHeight - 10"
      >
        <template v-for="(item, index) in tableColumns" :key="index">
          <el-table-column
            v-if="item.visible && item.width"
            :label="item.title"
            :prop="item.key"
            :header-align="item.align"
            :align="item.align"
            :width="item.width"
          >
            <template #default="data" v-if="item.slots">
              <slot :name="item.slots.customRender" v-bind="data" />
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.visible && item.minwidth"
            :label="item.title"
            :prop="item.key"
            :header-align="item.align"
            :align="item.align"
            :min-width="item.minwidth"
          >
            <template #default="data" v-if="item.slots">
              <slot :name="item.slots.customRender" v-bind="data" />
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.visible"
            :label="item.title"
            :prop="item.key"
            :header-align="item.align"
            :align="item.align"
          >
            <template #default="data" v-if="item.slots">
              <slot :name="item.slots.customRender" v-bind="data" />
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="basicTemplate__pager">
      <a-pagination
        show-size-changer
        :page-size-options="['100', '200', '300', '400']"
        :total="total"
        :show-total="(total) => `共: ${total} 条`"
        size="small"
        v-model:pageSize="pageSize"
        v-model:current="current"
        @change="currentChange"
        @showSizeChange="pageSizeChange"
      />
      <!-- <el-pagination
        size="small"
        @size-change="pageSizeChange"
        @current-change="currentChange"
        :current-page="current"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
      >
      </el-pagination> -->
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  PropType,
  reactive,
  toRefs,
  computed,
} from "vue";

export default defineComponent({
  name: "basicTemplate",
  props: {
    tableData: {
      type: Array as PropType<any[]>,
      default: [],
    },
    tableColumns: {
      type: Array as PropType<any[]>,
      default: [],
    },
    total: {
      type: Number as PropType<number>,
      default: 0,
    },
    loading: {
      type: Boolean as PropType<boolean>,
      default: false,
    }
  },
  setup(props, { emit }) {
    const tableBox = ref();

    const pagination = reactive({
      total: computed(() => props.total),
      current: 1,
      pageSize: 100,
    });

    const pageSizeChange = (current: number, pageSize: number) => {
      emit("size-change", pageSize);
    };

    const currentChange = (current: number, pageSize: number) => {
      emit("current-change", current);
    };

    return {
      tableBox,
      ...toRefs(pagination),
      pageSizeChange,
      currentChange,
    };
  },
});
</script>
<style lang="less" scoped>
@import "../css/index.less";

.basicTemplate {
  height: 100%;
  width: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;

  &__filter {
    padding-top: 17px;
    padding-left: 18px;
    min-width: 980px;
  }

  &__table {
    flex: 1;
    padding: 0 12px;
    box-sizing: border-box;
    width: 100%;
  }

  &__pager {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 20px;
    border-top: 1px solid #d9e0e9;
  }
}
</style>
