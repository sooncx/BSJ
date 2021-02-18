<template>
  <el-dialog
    :visible="visible"
    title="删除用户"
    @close="$emit('update:visible', false)"
    width="500px"
  >
    <Result
      title="是否确认删除用户"
      subtitle="重要提示：帐号被删时，该帐号下子级账号也会被删除"
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
        @click="doDeleteUser()"
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
    ...mapMutations(["COMMIT_USERLIST"]),
    async doDeleteUser() {
      try {
        const { ids } = this.params;
        const params = {
          ids
        };
        const { msg } = await this.$API.doDeleteUser(params);

        this.$msg({
          showClose: true,
          message: msg,
          type: "success"
        });
        this.$emit("update:visible", false);

        //更新树状图数据
        const { data } = await this.$API.doShowUserMessage();
        this.COMMIT_USERLIST(data);
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
