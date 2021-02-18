<script>
export default {
  functional: true,
  props: {
    title: {
      type: String
    }
  },
  render(h, { props, scopedSlots }) {
    const { title } = props;

    return (
      <div class="Card">
        <div class="Card__title">
          {scopedSlots.title ? scopedSlots.title() : title}
        </div>
        <div class="Card__content">
          {scopedSlots.default()}
        </div>
      </div>
    );
  }
};
</script>

<style lang="scss" scoped>
.Card {
  height: 100%;
  background-color: #ffffff;
  box-shadow: 0px 4px 8px 0px #00000021;
  display: flex;
  flex-direction: column;

  &__title {
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: $primary;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    @include scrollBar();
    position: relative;
  }
}
</style>
