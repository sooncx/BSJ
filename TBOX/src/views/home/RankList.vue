<script>
import Progress from "@/components/Progress/index.vue";

export default {
  functional: true,
  props: {
    options: {
      type: Array,
      require: true
    },
    textColor: {
      type: String,
      require: true
    },
    color: {
      type: String,
      require: true
    }
  },
  render(h, { props, data }) {
    const { options, textColor, color } = props;

    const items = options.map((item, index) => (
      <div key={index} class="RankList__item">
        <div style="flex: 2;overflow: hidden;">
          <div class="RankList__tag">{index + 1}</div>
        </div>
        <div style="flex: 22;overflow: hidden;">
          <Progress
            label={item.label}
            text={item.text}
            percentage={item.percentage}
            color={color}
            textColor={textColor}
          />
        </div>
      </div>
    ));

    return <div {...data} class="RankList">{items}</div>;
  }
};
</script>

<style lang="scss" scoped>
.RankList {
  flex: 1;
  overflow: hidden;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;

  &__item {
    padding: 0 10px 0 0;
    border: 1px solid #f9f9f9;
    height: 50px;
    display: flex;
    align-items: center;
  }

  &__tag {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16px;
    height: 16px;
    background:rgba(191,191,191,1);
    border-radius: 50%;
    font-size: 10px;
    font-family: Arial;
    color: #ffffff;
    text-align: center;
    margin: 0 auto
  }
}
</style>
