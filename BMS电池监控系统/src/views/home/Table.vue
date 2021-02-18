<template>
  <div class="Table">
    <div class="Table__header">
      <div class="Table__tr">
        <div class="Table__th">Serial</div>
        <div class="Table__th">Battery number</div>
        <div class="Table__th">Device No</div>
        <div class="Table__th">Alarm type</div>
      </div>
    </div>
    <div class="Table__body">
      <div class="Table__scroll">
        <div
          v-for="(item, index) in tableData"
          :key="index"
          class="Table__tr"
          :class="`Table__tr_${arr[Math.floor(Math.random() * 3)]}`"
          :ref="`tr_${index}`"
        >
          <div class="Table__td">{{index + 1}}</div>
          <div class="Table__td">{{item.num + Math.floor(Math.random() * 12)}}</div>
          <div class="Table__td">{{item.group}}</div>
          <div class="Table__td">{{alarmTypeArr[Math.floor(Math.random() * 5)]}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      arr: ["red", "yellow", "blue"],
      alarmTypeArr: [
        "high pressure",
        "Low pressure",
        "high temperature",
        "Over discharge",
        "abnormal"
      ],
      tableData: new Array(60).fill({
        num: "Battery number",
        group: "56211"
      }),
      activeIndex: 0
    };
  },

  mounted() {
    this.initCarousel();
  },

  methods: {
    //初始化轮播
    initCarousel() {
      setInterval(() => {
        const dom = this.$refs[`tr_${this.activeIndex}`][0];
        dom.scrollIntoView();
        this.activeIndex++;
        this.activeIndex === this.tableData.length && (this.activeIndex = 0);
      }, 3000);
    }
  }
};
</script>

<style lang="scss" scoped>
.Table {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__body {
    @include scrollBar();
    flex: 1;
    overflow-y: auto;
  }

  &__tr {
    display: flex;
    height: 33px;
    line-height: 33px;

    &:nth-child(2n) {
      background: rgba(37, 38, 42, 1);
    }

    &_red {
      color: rgba(232, 24, 24, 1);
    }

    &_yellow {
      color: rgba(240, 152, 26, 1);
    }

    &_blue {
      color: rgba(31, 138, 248, 1);
    }
  }

  &__th {
    flex: 1;
    text-align: center;
    color: #fff;
    background: rgba(37, 38, 42, 1);
  }

  &__td {
    flex: 1;
    text-align: center;
  }
}
</style>
