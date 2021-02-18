<template>
  <Modal
    v-bind="$attrs"
    :title="current.title"
    :footer="null"
    :width="current.width"
    :bodyStyle="{ padding: '0' }"
    :destroyOnClose="true"
  >
    <template v-slot:description v-if="current.desc">
      <span style="font-size:12px;color:#333">{{ current.desc }}</span>
    </template>
    <div style="min-height: 314px">
      <ChangePwd v-bind="$attrs" v-if="current.title === '修改密码'" />
      <SystemSet v-bind="$attrs" v-if="current.title === '系统设置'" />
      <DownloadTable v-if="current.title === '下载列表'" />
      <CommandInfo v-if="current.title === '命令下发报表'" />
    </div>
  </Modal>
</template>
<script lang="ts">
import { computed, defineAsyncComponent, defineComponent, PropType } from "vue";
import { Modal } from "@/components/Modal";

export default defineComponent({
  props: {
    type: {
      type: String as PropType<string>,
      default: "",
    },
  },
  components: {
    Modal,
    ChangePwd: defineAsyncComponent(() => import("./ChangePwd.vue")),
    SystemSet: defineAsyncComponent(() => import("./SystemSet.vue")),
    DownloadTable: defineAsyncComponent(() => import("./DownloadTable.vue")),
    CommandInfo: defineAsyncComponent(() => import("./CommandInfo.vue")),
  },
  setup(props) {
    const current = computed(() => {
      let width = 100;
      let title = "";
      let desc = undefined;

      switch (props.type) {
        case "password":
          width = 440;
          title = "修改密码";
          break;
        case "system":
          width = 462;
          title = "系统设置";
          break;
        case "download":
          width = 930;
          title = "下载列表";
          desc = "您导出的文件生成后会暂存在云服务器上,三天后会自动删除。";
          break;
        case "command":
          width = 930;
          title = "命令下发报表";
          break;
      }

      return {
        width,
        title,
        desc
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
