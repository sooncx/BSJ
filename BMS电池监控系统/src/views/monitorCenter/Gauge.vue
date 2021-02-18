<script>
export default {
  functional: true,
  props: {
    percentage: {
      type: Number,
      default: 90
    }
  },
  render(h, { props }) {
    const { percentage } = props;

    const _percentage = (percentage / 100) * 266;
    const rotate =
      _percentage >= 133 ? _percentage - 133 : -(133 - _percentage);

    return (
      <div class="Gauge">
        <img
          class="Gauge__img"
          src={require("@/assets/img/home/Gauge.png")}
          draggable="false"
        />
        <img
          class="Gauge__pointer"
          src={require("@/assets/img/home/pointer.png")}
          style={{ transform: `translate(-50%, -100%) rotate(${rotate}deg)` }}
          draggable="false"
        />
      </div>
    );
  }
};
</script>

<style lang="scss" scoped>
.Gauge {
  width: 100%;
  position: relative;
   user-select: none;

  &__img {
    width: 100%;
  }

  &__pointer {
    width: 5%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -100%);
    transform-origin: bottom;
  }
}
</style>
