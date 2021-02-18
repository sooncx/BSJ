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

    const items = options.map(({ label, startVal, endVal }, index) => (
      <div class="CoutList__item" key={index}>
        <div class="CoutList__label">{label}</div>
        <div class="CoutList__value">
          <CountTo startVal={startVal} endVal={endVal} />
        </div>
      </div>
    ));

    return <div class="CoutList">{items}</div>;
  }
};
</script>

<style lang="scss" scoped>
.CoutList {
  display: inline-flex;
  flex-direction: column;
  position: absolute;
  right: 0;
  top: 16px;
  transform: translateX(100%);

  &__item {
    flex: 1;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding-left: 5%;
  }

  &__label {
    color: #fff;
    white-space: nowrap;
  }

  &__value {
    margin-top: 5px;
    font-size: 36px;
    font-weight: 400;
    color: rgba(23, 239, 211, 1);
  }
}
</style>
