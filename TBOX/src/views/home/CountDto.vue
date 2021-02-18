<script>
export default {
  functional: true,
  props: {
    homeCountDto: [Object],
    homeVehicleDto: [Object]
  },
  render(h, { props }) {
    const { homeCountDto, homeVehicleDto } = props;

    const { onlineRate = 0 } = homeVehicleDto;

    const {
      dailyNox = 0,
      dailyMileage = 0,
      dailyUrea = 0,
      dailyOil = 0,
      totalNox = 0,
      totalMileage = 0,
      totalUrea = 0,
      totalOil = 0
    } = homeCountDto;

    const countData = [
      {
        title: "车辆在线率",
        num: onlineRate + "%",
        icon: require("@/assets/img/home/4.png"),
        bg: "linear-gradient(87deg,rgba(120,92,236,1),rgba(137,109,246,1))"
      },
      {
        title: "今日NOx排放量(kg)",
        num: dailyNox,
        icon: require("@/assets/img/home/1.png"),
        bg: "linear-gradient(87deg,rgba(32,211,154,1),rgba(57,235,178,1))"
      },
      {
        title: "今日运行里程(km)",
        num: dailyMileage,
        icon: require("@/assets/img/home/2.png"),
        bg: "linear-gradient(87deg,rgba(32,211,154,1),rgba(57,235,178,1))"
      },
      {
        title: "今日尿素消耗(L)/油耗(L)",
        num: dailyUrea + "/" + dailyOil,
        icon: require("@/assets/img/home/3.png"),
        bg: "linear-gradient(87deg,rgba(32,211,154,1),rgba(57,235,178,1))"
      },
      {
        title: "总NOx排放量(kg)",
        num: totalNox,
        icon: require("@/assets/img/home/1.png"),
        bg: "linear-gradient(87deg,rgba(32,120,211,1),rgba(59,148,239,1))"
      },
      {
        title: "总运行里程(km)",
        num: totalMileage,
        icon: require("@/assets/img/home/2.png"),
        bg: "linear-gradient(87deg,rgba(32,120,211,1),rgba(59,148,239,1))"
      },
      {
        title: "总尿素消耗(L)/油耗(L)",
        num: totalUrea + "/" + totalOil,
        icon: require("@/assets/img/home/3.png"),
        bg: "linear-gradient(87deg,rgba(32,120,211,1),rgba(59,148,239,1))"
      }
    ];

    const items = countData.map((item, index) => (
      <div key={index} class="CountDto__item" style={{ background: item.bg }}>
        <div class="CountDto__left">
          <div class="CountDto__title" title={item.title}>
            {item.title}
          </div>
          <div class="CountDto__num" title={item.num}>{item.num}</div>
        </div>
        <div class="CountDto__right">
          <img class="CountDto__img" src={item.icon} draggable="false" />
        </div>
      </div>
    ));

    return <div class="CountDto">{items}</div>;
  }
};
</script>

<style lang="scss" scoped>
.CountDto {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__item {
    flex: 1;
    display: flex;
    flex-direction: row;
    color: #ffffff;
    overflow: hidden;
    box-shadow: 0px 4px 6px 0px rgba(15, 163, 116, 0.05);
    border-radius: 10px;


    & + & {
      margin-top: 10px;
    }
  }

  &__left {
    flex: 1;
    padding: 2px 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  &__right {
    width: 68px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    user-select: none;
  }

  &__title {
    @include ellipsis();
    padding-bottom: 2px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
  }

  &__num {
    font-size: 24px;
    font-family: Arial;
    font-weight: 400;
    @include ellipsis();
  }

  &__img {
    width: 30px;
    height: 26px;
  }
}
</style>
