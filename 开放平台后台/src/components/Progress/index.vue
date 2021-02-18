<template>
  <div class="Progress">
    <div
      class="Progress_bar"
      v-for="(item, index) in test"
      :key="index"
    >
      <div
        class="tip"
        :class="{first:index === 0,
            second:index === 1,third:index === 2}"
      >
        {{index + 1}}
      </div>
      <div class="line">
        <div class="label">{{item.label}}</div>
        <el-progress
          status="success"
          :show-text="false"
          :percentage="item.progress"
          :stroke-width='10'
        ></el-progress>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Progress",
  components: {},
  data() {
    return {
      test: [
        {
          label: "test1",
          progress: 40
        },
        {
          label: "test2",
          progress: 60
        },
        {
          label: "test3",
          progress: 80
        },
        {
          label: "test4",
          progress: 90
        },
        {
          label: "test5",
          progress: 38
        },
        {
          label: "test6",
          progress: 40
        },
        {
          label: "test7",
          progress: 100
        },
        {
          label: "test8",
          progress: 40
        },
        {
          label: "test5",
          progress: 38
        },
        {
          label: "test6",
          progress: 40
        },
        {
          label: "test7",
          progress: 100
        },
        {
          label: "test8",
          progress: 40
        },
        {
          label: "test5",
          progress: 38
        },
        {
          label: "test6",
          progress: 40
        },
        {
          label: "test7",
          progress: 100
        },
        {
          label: "test8",
          progress: 40
        }
      ]
    };
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.Progress {
  height: calc(100% - 40px);
  flex: 1;
  overflow: auto;
  @include scrollbar;
  padding: 20px;
  &_bar {
    width: 100%;
    height: 10%;
    margin: 5px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tip {
      width: 25px;
      height: 25px;
      background: #e7e7e7;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
    }
    .line {
      text-align: left;
      width: calc(100% - 40px);
      .label {
        padding-bottom: 5px;
        color: #666666;
      }
    }
  }
  ::v-deep .el-progress-bar__inner,
  ::v-deep .el-progress-bar__outer {
    border-radius: 0 !important;
  }
  ::v-deep .el-progress.is-success .el-progress-bar__inner {
    // background: #17ccd0;
    background: linear-gradient(to right, #17ccd0, rgb(97, 232, 245));
  }
}
.first {
  background-color: #e8f0ff !important;
  color: #0856ea;
}
.second {
  background-color: #e8f0ff !important;
  color: #0856ea;
}
.third {
  background-color: #e8f0ff !important;
  color: #0856ea;
}
</style>
