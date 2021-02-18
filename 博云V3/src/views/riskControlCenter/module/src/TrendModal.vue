<template>
  <Modal
    v-bind="$attrs"
    :title="current.title"
    :width="current.width"
    :bodyStyle="{ padding: 0 }"
    :destroyOnClose="true"
    :footer="null"
  >
    <template
      #description
      v-if="
        type === 'detail' &&
        (trendType === 'expire' || trendType === 'insurance')
      "
    >
      <el-tag type="primary" size="mini" v-if="trendType === 'insurance'">{{
        row.type === 1 ? "首保" : "非首保"
      }}</el-tag>
      <el-tag type="info" size="mini" v-if="trendType === 'expire'">{{
        row.state === 1 ? "已过期" : "即将过期"
      }}</el-tag>
    </template>
    <div style="min-height: 216px">
      <TrendDetail
        :trendType="trendType"
        v-bind="$attrs"
        :row="row"
        v-if="type === 'detail'"
      />
      <TrendViewAll :trendType="trendType" v-if="type === 'viewall'" />
    </div>
  </Modal>
</template>
<script lang="ts">
import {
  computed,
  defineAsyncComponent,
  defineComponent,
} from "vue";
import { Modal } from "@/components/Modal";

export default defineComponent({
  props: {
    type: String,
    trendType: String,
    row: Object,
  },
  components: {
    Modal,
    TrendDetail: defineAsyncComponent(() => import("./TrendDetail.vue")),
    TrendViewAll: defineAsyncComponent(() => import("./TrendViewAll.vue")),
  },
  setup(props) {
    const current = computed(() => {
      let title = undefined;
      let width = undefined;

      switch (props.type) {
        case "detail":
          width = 670;
          title =
            props.trendType === "insurance"
              ? "保险到期提醒"
              : props.trendType === "maintain"
              ? "保养到期提醒"
              : props.trendType === "electric"
              ? "剩余电量提示提醒"
              : props.trendType === "expire"
              ? "到期续费提示提醒"
              : "";
          break;
        case "viewall":
          width = 860;
          title =
            props.trendType === "insurance"
              ? "保险到期提醒"
              : props.trendType === "maintain"
              ? "保养到期提醒"
              : props.trendType === "electric"
              ? "剩余电量提示提醒"
              : props.trendType === "expire"
              ? "到期续费提示提醒"
              : "";
          break;
      }

      return {
        title,
        width,
      };
    });

    return {
      current,
    };
  },
});
</script>
<style lang="less" scoped>
::v-deep(.el-table th) {
  background: #eff2f5;
  color: #666;
}

::v-deep(.el-table__body-wrapper) {
  overflow: auto;
}

// table边框颜色
::v-deep(.el-table--border:after, .el-table--group:after, .el-table:before) {
  background-color: #e4e7eb;
}

::v-deep(.el-table--border, .el-table--group) {
  border-color: #e4e7eb;
}

::v-deep(.el-table td, .el-table th.is-leaf) {
  border-bottom: 1px solid #e4e7eb;
}

::v-deep(.el-table--border th, .el-table--border th.gutter:last-of-type) {
  border-bottom: 1px solid #e4e7eb;
}

::v-deep(.el-table--border td, .el-table--border th) {
  border-right: 1px solid #e4e7eb;
}
</style>

