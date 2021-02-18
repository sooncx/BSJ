<script>
import Drag from "@/components/Drag/index.vue";

export default {
  props: {
    draggable: {
      type: Boolean,
      default: true
    },
    leftWidth: {
      type: String,
      default: "240px"
    }
  },
  functional: true,
  render(h, { scopedSlots, props }) {
    const { draggable, leftWidth } = props;

    let content;
    if (scopedSlots.content) {
      content = <div class="ManageBox__content">{scopedSlots.content()}</div>;
    } else {
      if (draggable) {
        content = (
          <Drag defaultWidth={leftWidth} class="ManageBox__content">
            <div class="ManageBox__left" slot="left">
              {scopedSlots.left()}
            </div>
            <div class="ManageBox__right" slot="right">
              {scopedSlots.right()}
            </div>
          </Drag>
        );
      } else {
        content = (
          <div class="ManageBox__content">
            <div
              style={{ width: leftWidth }}
              class="ManageBox__left"
            >
              {scopedSlots.left()}
            </div>
            <div class="ManageBox__right">
              {scopedSlots.right()}
            </div>
          </div>
        );
      }
    }

    return (
      <div class="ManageBox">
        {scopedSlots.upside && (
          <div class="ManageBox__upside">{scopedSlots.upside()}</div>
        )}

        {content}

        {scopedSlots.plugins && scopedSlots.plugins()}
      </div>
    );
  }
};
</script>

<style lang="scss" scoped>
.ManageBox {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f7f7f7;
  box-sizing: border-box;
  padding: 0 16px;
  overflow: hidden;

  &__upside {
    height: 80px;
    overflow: hidden;
    background: #fff;
    padding: 0 16px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
  }
  &__footer {
    height: 40%;
    display: flex;
    overflow: hidden;
    margin-bottom: 16px;
  }
  &__content2 {
    display: flex;
    overflow: hidden;
    margin-bottom: 16px;
  }
  &__content {
    flex:1;
    display: flex;
    overflow: hidden;
  }

  &__left {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #fff;
    padding: 16px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  &__right {
    flex: 1;
    box-sizing: border-box;
    height: 100%;
    background: #fff;
    margin-left: 16px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    @include scrollBar;
  }
}
</style>
