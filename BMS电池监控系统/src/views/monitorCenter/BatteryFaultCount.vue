<template>
  <div class="BatteryFaultCount">
    <div class="BatteryFaultCount__title">
      <span class="BatteryFaultCount__item">
        <span class="BatteryFaultCount__label">正常</span>
        <span class="BatteryFaultCount__text BatteryFaultCount__text_primary">20个</span>
      </span>
      <span class="BatteryFaultCount__item">
        <span class="BatteryFaultCount__label">故障</span>
        <span class="BatteryFaultCount__text BatteryFaultCount__text_error">20个</span>
      </span>
    </div>
    <div class="BatteryFaultCount__content">
      <el-row :gutter="16">
        <el-col
          :span="8"
          v-for="(item, index) in new Array(20)"
          :key="index"
        >
          <div class="card card_primary">
            <div class="card__title">电芯001号 <span class="card__tag">正常</span></div>
            <div class="card__content">
              <div class="card__battery">
                <i class="iconfont icon-dianchi" />
              </div>
              <div class="card__right">
                <span class="card__label">电压</span>
                <span class="card__text">4.0022</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {};
</script>


<style lang="scss" scoped>
.BatteryFaultCount {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &__title {
    padding: 16px;
  }

  &__content {
    @include scrollBar();
    overflow-y: auto;
    padding: 0 16px;
    flex: 1;
  }

  &__item {
    & + & {
      margin-left: 10px;
    }
  }

  &__label {
    font-size: 14px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
  }

  &__text {
    font-size: 14px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);

    &_primary {
      color: rgba(0, 211, 184, 1);
    }

    &_error {
      color: rgba(211, 21, 21, 1);
    }
  }
}

.card {
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  border: 1px solid #ebeef5;
  margin-bottom: 16px;

  &_primary {
    .card__tag {
      background: rgba(220, 255, 251, 1);
      color: rgba(0, 211, 184, 1);
    }

    .card__battery {
      background: rgba(29, 236, 209, 1);
    }
  }

  &_error {
    .card__tag {
      background: rgba(255, 206, 201, 1);
      color: rgba(246, 95, 79, 1);
    }

    .card__battery {
      background: rgba(246, 95, 79, 1);
    }
  }

  &__title {
    border-bottom: 1px solid rgba(242, 242, 242, 1);
    padding: 10px;
  }

  &__tag {
    padding: 3px 6px;
    color: #fff;
    font-size: 10px;
    margin-left: 5px;
    user-select: none;
  }

  &__content {
    padding: 10px;
    display: flex;
  }

  &__battery {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin: 16px;
    position: relative;

    i {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 24px;
      color: #fff;
    }
  }

  &__right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__label {
    font-size: 13px;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 16px;
    margin-right: 5px;

    &::after {
      content: ":";
    }
  }

  &__text {
    font-size: 13px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 16px;
  }
}
</style>
