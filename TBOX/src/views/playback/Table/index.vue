<template>
  <div
    class="Table"
    ref="Table"
  >
    <DragResize @onChange="h => $refs.table.$el.style.overflow = h > 80 ? 'auto' : 'inherit'">
      <div class="Table__content">
        <el-table
          ref="table"
          :data="tableData"
          style="width: 100%;"
          height="100%"
          row-key="passedIndex"
          highlight-current-row
          @row-click="row => $emit('onPassedIndexChange', {passedIndex: row.passedIndex, type: 'pause'})"
        >
          <el-table-column
            fixed
            prop="passedIndex"
            label="序号"
            width="100"
            align="center"
          >
            <span slot-scope="{row}">{{row.passedIndex + 1}}</span>
          </el-table-column>
          <el-table-column
            prop="plate"
            label="车牌号"
            width="150"
            align="left"
          />
          <el-table-column
            prop="devTime"
            label="时间"
            width="150"
            align="left"
          />
          <el-table-column
            prop="speed"
            label="速度km/h"
            width="100"
            align="left"
          />
          <el-table-column
            prop="mileage"
            label="里程km"
            width="150"
            align="left"
          />
          <el-table-column
            prop="address"
            label="位置"
            align="left"
          >
            <span slot-scope="{row}">{{row.address ? row.address : '正在获取地址...'}}</span>
          </el-table-column>
        </el-table>

        <!-- 分页开始 -->
        <el-pagination
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="playData.length"
        />
        <!-- 分页结束 -->
      </div>
    </DragResize>
  </div>
</template>

<script>
import { isElementInViewport } from "@/assets/js/base";
import DragResize from "./DragResize.vue";

export default {
  components: {
    DragResize
  },

  props: {
    playData: Array,
    passedIndex: Number
  },

  data() {
    return {
      pageSize: 100
    };
  },

  computed: {
    currentPage: {
      get() {
        return Math.ceil((this.passedIndex + 1) / this.pageSize);
      },

      set(val) {
        const passedIndex = (val - 1) * this.pageSize;
        if(passedIndex === this.passedIndex) return;
        this.$emit("onPassedIndexChange", { passedIndex, type: "jumpTo" });
      }
    },
    tableData() {
      const { playData, currentPage, pageSize } = this;
      const tableData = playData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );
      this.$emit("onTableDataChange", tableData);
      return tableData;
    }
  },

  watch: {
    passedIndex() {
      this.scrollToHighLight();
    }
  },

  methods: {
    //滚动到当前高亮节点
    async scrollToHighLight() {
      // if(this.passedIndex ===)
      const row = this.tableData.find(
        ({ passedIndex }) => this.passedIndex === passedIndex
      );
      this.$refs.table.setCurrentRow(row);
      await this.$nextTick();
      const activeDom = this.$refs.table.$el.getElementsByClassName(
        "current-row"
      )[0];
      //如果不在滚动区域内则滚动到滚动区域
      !isElementInViewport(activeDom) &&
        this.$refs.Table.offsetHeight > 80 &&
        activeDom.scrollIntoView();
    }
  }
};
</script>

<style lang="scss" scoped>
.Table {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  z-index: 1024;
  background: #fff;

  &__content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
