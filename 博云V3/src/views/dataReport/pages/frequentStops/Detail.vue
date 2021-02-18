<template>
  <div class="frequentStop">
    <el-tabs type="card" v-model="activeName">
      <el-tab-pane label="数据" name="data" class="detailTable">
        <el-table
          :data="tableData"
          size="small"
          height="400px"
          max-height="400px"
          border
        >
          <el-table-column
            label="序号"
            width="50"
            header-align="center"
            align="center"
          >
            <template #default="{ $index }">{{
              (current - 1) * pageSize + ($index + 1)
            }}</template>
          </el-table-column>
          <el-table-column
            label="开始时间"
            prop="startTime"
            header-align="center"
            align="center"
            :formatter="formatter"
          />
          <el-table-column
            label="结束时间"
            prop="endTime"
            header-align="center"
            align="center"
            :formatter="formatter"
          />
          <el-table-column
            label="停留时间"
            prop="stopTime"
            header-align="center"
            align="center"
            :formatter="formatter"
          />
        </el-table>
        <div class="detailTable__footer">
          <a-pagination
            :total="total"
            :show-total="(total) => `共: ${total} 条`"
            size="small"
            v-model:pageSize="pageSize"
            v-model:current="current"
            @change="paginationChange"
          />

          <a-button type="primary" @click="onExport">
            <i class="iconfont icon-daochu"></i>
            导出</a-button
          >
        </div>
      </el-tab-pane>
      <el-tab-pane label="图表" name="chart">
        <div style="height: 400px">
          <BarChart :data="chartData" />
        </div>
        <p class="chartdesc">
          图表示车辆在【{{ timeArr[0] }}】到【{{
            timeArr[1]
          }}】内，仅对于选择的位置点的各个时间段停留的总时长汇总，有助于分析车辆在一天当中在该位置经常停留的时间段
        </p>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineAsyncComponent,
  defineComponent,
  reactive,
  toRefs,
} from "vue";
import dayJs from "dayjs";

export default defineComponent({
  components: {
    BarChart: defineAsyncComponent(
      () => import("@/components/Chart/src/BarChart.vue")
    ),
  },
  props: {
    timeArr: {
      type: Array,
      default: [],
    },
    curData: {
      type: Object,
    },
  },
  setup(props) {
    const data = reactive({
      activeName: "chart",
      tableData: computed(() => {
        return props.curData?.timeDetails.map((item: any) => {
          const splitArr = item.split(",");
          const diffTimeStr = dayJs(splitArr[1]).diff(dayJs(splitArr[0]));

          return {
            startTime: splitArr[0],
            endTime: splitArr[1],
            stopTime: diffTime(diffTimeStr),
          }
        })
      }),
      total: computed(() => {
        return props.curData?.timeDetails.length
      }),
      current: 1,
      pageSize: 9999,
      chartData: computed(() => {
        return props.curData?.details.map((item: any) => Math.floor(item.spaceTime / 60))
      }),
      onExport: () => {},
      formatter: (row: any, column: any, cellValue: any) => {
        let str = "--";
        return cellValue || str;
      },
      paginationChange: () => {},
    });

    const diffTime = (diffTime: number) => {
      // var diff = endDate.getTime() - startDate.getTime(); //时间差的毫秒数
      //计算出相差天数
      let days = Math.floor(diffTime / (24 * 3600 * 1000));
      //计算出小时数
      let leave1 = diffTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
      let hours = Math.floor(leave1 / (3600 * 1000));
      //计算相差分钟数
      let leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
      let minutes = Math.floor(leave2 / (60 * 1000));
      //计算相差秒数
      let leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
      let seconds = Math.round(leave3 / 1000);
      let ret = 0;
      if (minutes > 0) {
        ret += minutes;
      }
      if (hours > 0) {
        ret += hours * 60;
      }
      if (days > 0) {
        ret += days * 24 * 60;
      }
      let returnStr = ""; //seconds + "秒";
      if (minutes > 0) {
        returnStr = minutes + "分" + returnStr;
      }
      if (hours > 0) {
        returnStr = hours + "小时" + returnStr;
      }
      if (days > 0) {
        returnStr = days + "天" + returnStr;
      }
      return returnStr;
    };

    return {
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
@import "../../module/css/index.less";
.frequentStop {
}
.detailTable__footer {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}
.chartdesc {
  font-size: 12px;
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;
  text-align: left;
  color: #1e7eec;
  padding: 15px 30px;
}
::v-deep(.el-tabs__header) {
  margin: 0;
}
</style>
