<template>
  <div>
    <el-dialog
      title="不合格明细"
      width="1000px"
      :visible="visible"
      @close="$emit('update:visible', false)"
    >
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 1)"
        :data="data"
        height=500
        border
      >
        <el-table-column
          type="index"
          label="序号"
          width="50"
          align="center"
        />
        <el-table-column
          property="plate"
          label="车牌号"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          label="报警类型"
          align="center"
          min-width="120"
        >
          <template>
            疑似NOx不合格
          </template>
        </el-table-column>
        <el-table-column
          property="beginTimeStr"
          label="开始报警时间"
          width="200"
          align="center"
        ></el-table-column>

        <el-table-column
          property="endTimeStr"
          label="结束报警时间"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          property="beginUreaTankLevel"
          label="开始报警尿素箱液位(L)"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          property="endUreaTankLevel"
          label="结束报警尿素箱液位(L)"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          property="alarmDuration"
          label="报警持续时间"
          width="200"
          align="center"
        ></el-table-column>
      </el-table>
      <el-button
        style="margin-left: 94%;margin-top: 20px;"
        size="small"
        @click="exportDetail"
      >导出</el-button>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  watch:{
    loading(val) {
      this.loading = val;
    }
  },
  methods: {
    exportDetail() {
      this.$emit("exportDetail");
    }
  },
  components: {}
};
</script>
<style lang="scss" scoped>
</style>
