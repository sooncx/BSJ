<template>
  <el-dialog
    :visible="visible"
    title="删除组织"
    @close="$emit('update:visible', false)"
    width="500px"
  >
    <Result
      title="是否确认删除车组"
      subtitle="重要提示：删除后，相关设备的数据将被清空，例如轨迹、数据报表等"
    />
    <template slot="footer">
      <el-button
        type="info"
        plain
        size="small"
        @click="$emit('update:visible', false)"
      >取消</el-button>
      <el-button
        type="primary"
        plain
        size="small"
        @click="doDeleteOrganization()"
      >确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapMutations } from "vuex";
import Result from "@/components/Result/index.vue";

export default {
  components: {
    Result
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: undefined
    }
  },

  methods: {
    ...mapMutations(["COMMIT_GROUPLIST"]),
    async doDeleteOrganization() {
      try {
        const { ids } = this.params;
        const params = {
          ids
        };
        const { msg } = await this.$API.doDeleteOrganization(params);

        this.$msg({
          showClose: true,
          message: msg,
          type: "success"
        });
        this.$emit("update:visible", false);

        //更新树状图数据
        const { data } = await this.$API.doShowOrganization();
        this.COMMIT_GROUPLIST(data);
      } catch (error) {
        this.$msg({
          showClose: true,
          message: error ? error.msg : "请输入正确字段",
          type: "error"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
