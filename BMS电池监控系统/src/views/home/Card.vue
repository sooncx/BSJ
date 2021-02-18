<script>
export default {
  functional: true,
  props: {
    title: {
      type: String,
      require: true
    }
  },
  render(h, { data, props, scopedSlots }) {
    const { title } = props;
    return (
      <div class="Card" {...data}>
        <div class="Card__title">
          {scopedSlots.title ? scopedSlots.title() : title}
        </div>
        <div class="Card__content">{scopedSlots.default()}</div>
      </div>
    );
  }
};
</script>

<style lang="scss" scoped>
.Card {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__title {
    padding: 10px 16px;
    color: #fff;
  }

  &__content {
    flex: 1;
    overflow: hidden;
    padding: 0 16px;
  }
}
</style>
