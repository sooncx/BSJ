<script>
export default {
  functional: true,
  props: {
    status: {
      type: String,
      default: "warning"
    },
    icon: {
      type: String
    },
    title: {
      type: String
    },
    subtitle: {
      type: String
    }
  },
  render(h, { data, scopedSlots, props }) {
    const { status, icon, title, subtitle } = props;

    let iconClass;
    if (icon) {
      iconClass = icon;
    } else {
      const iconClassObj = {
        warning: "Result__icon_warning el-icon-warning",
        error: "Result__icon_error el-icon-error",
        success: "Result__icon_success el-icon-success"
      };

      iconClass = iconClassObj[status];
    }

    return (
      <div class="Result" {...data}>
        <div class="Result__icon-box">
          <i class={`Result__icon ${iconClass}`} />
        </div>

        <div class="Result__title">{title}</div>

        {subtitle && <div class="Result__subtitle" domPropsInnerHTML={subtitle}></div>}

        {scopedSlots.default && (
          <div class="Result__extra">{scopedSlots.default()}</div>
        )}
      </div>
    );
  }
};
</script>

<style lang="scss" scoped>
.Result {
  padding: 16px 32px;

  &__icon-box {
    margin-bottom: 24px;
    text-align: center;
  }

  &__icon {
    color: rgb(24, 144, 255);
    font-size: 80px;

    &_warning {
      color: #faad14;
    }

    &_error {
      color: #f5222d;
    }

    &_success {
      color: #52c41a;
    }
  }

  &__title {
    color: rgba(0, 0, 0, 0.85);
    font-size: 24px;
    line-height: 1.8;
    text-align: center;
  }

  /deep/ &__subtitle {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 1.6;
    text-align: center;

    em {
      color: $primary;
      font-style: normal;
    }
  }

  &__extra {
    margin-top: 32px;
    text-align: center;
  }
}
</style>
