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

    const items = options.map(({ label, icon, startVal, endVal }, index) => (
      <div class="BatteryStatusList__item" key={index}>
        <div class="BatteryStatusList__left">
          <div class="BatteryStatusList__label">{label}</div>
          <div class="BatteryStatusList__value">
            <CountTo startVal={startVal} endVal={endVal} />
          </div>
        </div>
        <div class="BatteryStatusList__right">
          <img class="BatteryStatusList__img" src={icon} />
        </div>
      </div>
    ));

    return <div class="BatteryStatusList">{items}</div>;
  }
};
</script>

<style lang="scss" scoped>
.BatteryStatusList {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__item {
    flex: 1;
    display: flex;
    padding: 5px 16px;

    & + & {
      border-top: 1px solid rgba(60, 60, 68, 1);
    }
  }

  &__left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  &__right {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__label {
    color: #fff;
    white-space: nowrap;
  }

  &__value {
    font-size: 36px;
    font-weight: 400;
    color: rgba(23, 239, 211, 1);
  }

  &__img {
    width: 36px;
  }
}
</style>
