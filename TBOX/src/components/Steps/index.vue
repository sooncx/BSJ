<script>
export default {
  functional: true,
  props: {
    //设置当前激活步骤
    active: {
      type: Number,
      default: 0
    },
    options: {
      type: Array,
      require: true
    }
  },
  render(h, { props }) {
    const { active, options } = props;

    const items = options.map((item, index) => (
      <div
        key={index}
        class={`step ${index <= active ? "step_finish" : ""}`}
      >
        {index !== 0 && (
          <div class="step__line">
            <div class="step__arrow">
              <i class="iconfont icon-right-arrow" />
            </div>
          </div>
        )}

        <div class="step__content">
          <div class="step__icon">
            <i class={item.icon} />
          </div>
          <div class="step__label">{item.label}</div>
        </div>
      </div>
    ));

    return <div class="Steps">{items}</div>;
  }
};
</script>

<style lang="scss" scoped>
.Steps {
  display: flex;
  padding: 24px;
}

.step {
  display: flex;
  align-items: center;

  & + & {
    flex: 1
  }

  &_finish {
    * {
      color: $primary !important;
      border-color: $primary !important;
    }
  }

  &__line {
    margin: 0 32px 10px;
    height: 1px;
    border-bottom: 1px dashed rgba(102, 102, 102, 1);
    position: relative;
    flex: 1;
  }

  &__arrow {
    position: absolute;
    left: 50%;
    bottom: 5px;
    transform: translate(-50%, 0);

    i {
      font-size: 20px;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: rgba(201, 201, 201, 1);
  }

  &__icon {
    i {
      font-size: 26px;
    }
  }

  &__label {
    font-size: 14px;
    font-weight: 400;
    margin-top: 5px;
  }
}
</style>
