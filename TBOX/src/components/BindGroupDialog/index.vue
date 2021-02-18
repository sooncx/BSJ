<template>
  <el-dialog
    :visible="visible"
    title="绑定组织"
    @close="$emit('update:visible', false);"
    @closed="type === 'submit' && initState()"
    width="600px"
  >
    <div class="BindGroup">
      <FilterTree v-model="checkedKeys" />
      <ShowTree :checkedKeys="checkedKeys" />
    </div>
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
        @click="handleApiFn()"
      >确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import FilterTree from "./FilterTree.vue";
import ShowTree from "./ShowTree.vue";

export default {
  components: {
    FilterTree,
    ShowTree
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    params: [Object],
    /**
     * @param {submit | save} 参数名 type
     */
    type: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      checkedKeys: []
    };
  },

  computed: {
    ...mapState(["GROUPLIST"])
  },

  watch: {
    async params(val) {
      if (!val) return;

      let checkedKeys = [];
      if (val.userId) {
        const { data } = await this.$API.doShowOrganization({
          userId: val.userId
        });
        checkedKeys = data.map(({ organizationId }) => organizationId);
      }

      if (val.checkedKeys) {
        checkedKeys = [...new Set([...checkedKeys, ...val.checkedKeys])];
      }

      this.checkedKeys = checkedKeys;
    }
  },

  methods: {
    initState() {
      this.checkedKeys = [];
    },
    handleApiFn() {
      switch (this.type) {
        case "submit":
          this.doMoveOrganization();
          break;
        case "save":
          this.$emit("onSave", this.checkedKeys);
          this.$emit("update:visible", false);
          break;
      }
    },
    async doMoveOrganization() {
      try {
        const { params, checkedKeys } = this;
        if (!checkedKeys.length) throw { msg: "请选择车组" };

        const { msg } = await this.$API.doMoveOrganization({
          userId: params.userId,
          organizationId: checkedKeys.join(",")
        });

        this.$msg({
          showClose: true,
          message: msg,
          type: "success"
        });
        this.$emit("update:visible", false);
      } catch (error) {
        this.$msg({
          showClose: true,
          message: error.msg,
          type: "error"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.BindGroup {
  height: 500px;
  display: flex;
}
</style>
