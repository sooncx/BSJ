<script>
export default {
  functional: true,
  props: {
    percentage: {
      type: Number,
      default: 50
    }
  },
  render(h, { props }) {
    const { percentage } = props;

    return (
      <div class="Battery">
        <img
          class="Battery__img"
          src={require("@/assets/img/home/battery_1.png")}
          draggable="false"
        />
        <div class="Battery__content">
          <div
            class="Battery__range"
            style={{ top: 100 - percentage + "%" }}
          ></div>
        </div>
      </div>
    );
  }
};
</script>

<style lang="scss" scoped>
.Battery {
  width: 50px;
  position: relative;
  user-select: none;

  &__img {
    width: 100%;
  }

  &__content {
    position: absolute;
    bottom: 3.5%;
    top: 7.5%;
    left: 1%;
    right: 1.2%;
  }

  &__range {
    position: absolute;
    top: 90%;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 1px;
    background: linear-gradient(
      90deg,
      rgba(0, 183, 57, 1),
      rgba(3, 255, 64, 1),
      rgba(1, 235, 80, 1),
      rgba(0, 208, 106, 1),
      rgba(28, 251, 125, 1),
      rgba(63, 255, 120, 1),
      rgba(109, 255, 140, 1),
      rgba(12, 253, 52, 1)
    );
  }
}
</style>
