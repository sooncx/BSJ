<script>
export default {
  functional: true,
  props: {
    label: {
      type: String,
      require: true
    },
    percentage: {
      type: Number,
      require: true
    },
    text: {
      type: String,
      require: true
    },
    color: {
      type: String,
      default: ""
    },
    textColor: {
      type: String,
      default: ""
    }
  },

  render(h, { props }) {
    const { label, percentage, text, color, textColor } = props;

    return (
      <div class="Progress">
        <div class="Progress__header">
          <div class="Progress__label">{label}</div>
          <div class="Progress__text" style={{ color: textColor }} title={text}>
            {text}
          </div>
        </div>
        <div class="Progress__content">
          <div class="Progress__outer">
            <div
              class="Progress__bar"
              style={{ width: percentage + "%", background: color }}
            ></div>
          </div>
        </div>
      </div>
    );
  }
};
</script>
<style lang="scss" scoped>
.Progress {
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__header {
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
  }

  &__label {
    font-size: 13px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    @include ellipsis();
    flex: 1;
  }

  &__text {
    font-size: 12px;
    font-weight: 400;
    margin-left: 16px;
    @include ellipsis();
    text-align: right;
    min-width: 50px;
  }

  &__content {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__outer {
    background: rgba(243, 243, 243, 1);
    height: 8px;
    flex: 1;
    overflow: hidden;
  }

  &__bar {
    height: 100%;
    box-shadow: 0px 2px 4px 0px rgba(27, 125, 161, 0.15);
  }
}
</style>
