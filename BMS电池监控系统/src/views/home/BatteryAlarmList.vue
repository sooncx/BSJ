<script>
import CountTo from "vue-count-to";

export default {
  functional: true,
  props: {
    options: {
      type: Array,
      require: true
    }
  },
  render(h, { props }) {
    const { options } = props;

    const items = options.map(({ label, startVal, endVal, icon }, index) => (
      <div class="BatteryAlarmList__item" key={index}>
        <div class="BatteryAlarmList__left">
          <div class="BatteryAlarmList__label">{label}</div>
          <div class="BatteryAlarmList__value">
            <CountTo startVal={startVal} endVal={endVal} />
          </div>
        </div>
        <div class="BatteryAlarmList__right">
          <i class={`BatteryAlarmList__icon iconfont ${icon}`} />
        </div>
      </div>
    ));

    return <div class="BatteryAlarmList">{items}</div>;
  }
};
</script>

<style lang="scss" scoped>
.BatteryAlarmList {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__item {
    flex: 1;
    display: flex;
    padding: 5px 16px;
  }

  &__left {
    flex: 7;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding-left: 5%;
  }

  &__right {
    flex: 3;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__label {
    color: #fff;
  }

  &__value {
    font-size: 16px;
    font-weight: 400;
    color: rgba(23, 239, 211, 1);
  }

  &__icon {
    font-size: 24px;
    color: #0f51ba;
  }
}
</style>
