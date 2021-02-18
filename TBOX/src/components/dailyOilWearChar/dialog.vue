<template>
  <div>
    <el-dialog
      title="车辆明细"
      width="800px"
      :visible="visible"
      @close="$emit('update:visible', false)"
      @open="getData"
    >
      <div class="box1">
        <div
          class="box1-1"
          v-for="(item,index) in list"
          :key="index"
        >
          <div class="inputTitle">
            <span>{{item.title}}</span>
          </div>
          <el-input
            class="input"
            size="mini"
            v-model=item.value
            placeholder=""
            :disabled="true"
          >
          </el-input>
        </div>
      </div>

      <div>
        <Barchart2 />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Barchart2 from "./index2.vue";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array
    }
  },
  data() {
    return {
      list: [
        { title: "日期：", value: null },
        { title: "车牌号：", value: null },
        { title: "开始纬度：", value: null },
        { title: "结束纬度：", value: null },
        { title: "开始经度：", value: null },
        { title: "结束经度：", value: null },
        { title: "开始里程：", value: null },
        { title: "结束里程：", value: null },
        { title: "行驶里程：", value: null }
      ]
    };
  },
  methods: {
    getData() {
      this.list[0].value = this.data[0].timeStr;
      this.list[1].value = this.data[0].plate;
      this.list[2].value = this.data[0].beginLat;
      this.list[3].value = this.data[0].endLat;
      this.list[4].value = this.data[0].beginLon;
      this.list[5].value = this.data[0].endLon;
      this.list[6].value = this.data[0].beginMileage;
      this.list[7].value = this.data[0].endMileage;
      this.list[8].value = this.data[0].drivingMileage;

    }
  },
  components: {
    Barchart2
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-input,
/deep/ .el-input--mini,
/deep/ .el-input__inner,
/deep/ .el-textarea {
  width: 180px;
  height: 28px;
  font-size: 12px;
  * {
    border-radius: 0 !important;
  }
}
.box1 {
  width: 100%;
  padding-bottom: 20px;
}
.box1-1 {
  display: inline-block;
  margin: 8px 35px;
}

.inputTitle {
  width: 80px;
  height: 24px;
  display: inline-block;
  span {
    display: flex;
    align-content: flex-end;
    justify-content: flex-end;
  }
}
.box1-1:nth-of-type(2) > .inputTitle,
.box1-1:nth-of-type(4) > .inputTitle,
.box1-1:nth-of-type(6) > .inputTitle,
.box1-1:nth-of-type(8) > .inputTitle {
  width: 140px;
}
</style>
