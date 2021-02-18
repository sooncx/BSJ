<template>
  <div>
    <el-dialog
      title="里程明细"
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
        <!-- <el-table-column
          property="timeStr"
          label="日期"
          width="100"
          align="center"
        ></el-table-column> -->
        <el-table-column
          property="plate"
          label="车牌号"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          property="start"
          label="开始地址"
          width="300"
          align="center"
        ></el-table-column>
        <el-table-column
          property="end"
          label="结束地址"
          width="300"
          align="center"
        ></el-table-column>

        <el-table-column
          property="beginMileage"
          label="开始里程(km)"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          property="endMileage"
          label="结束里程(km)"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          property="drivingMileage"
          label="行驶里程(km)"
          width="120"
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
      default: false
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
