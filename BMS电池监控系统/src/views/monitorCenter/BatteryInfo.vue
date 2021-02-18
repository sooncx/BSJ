<script>
export default {
  functional: true,
  render() {
    const options = [
      { label: "电池设备号", value: "15246854", type: "info" },
      { label: "总电压", value: "66.99V", type: "info" },
      { label: "电池温超", value: "正常", type: "info" },
      { label: "过压保护", value: "正常", type: "info" },
      { label: "电池掉线", value: "否", type: "info" },
      { label: "充电总时间", value: "1H", type: "info" },
      { label: "版本号", value: "BSJ-ASD", type: "info" },
      { label: "最低电压", value: "3.898V", type: "info" },
      { label: "充电保护", value: "正常", type: "info" },
      { label: "欠压保护", value: "异常", type: "error" },
      { label: "均衡开闭", value: "开启", type: "info" },
      { label: "放电总时间", value: "否", type: "info" },
      { label: "电池数量", value: "20串", type: "info" },
      { label: "最高电压", value: "3.975V", type: "info" },
      { label: "放电保护", value: "正常", type: "info" },
      { label: "充电保护", value: "正常", type: "info" },
      { label: "温度数量", value: "3个", type: "info" },
      { label: "充电次数", value: "3次", type: "info" },
      { label: "剩余电容量", value: "0A", type: "info" },
      { label: "相差电压", value: "0.077V", type: "warning" },
      { label: "短路次数", value: "3次", type: "info" },
      { label: "放电保护", value: "正常", type: "info" },
      { label: "设计容量", value: "0AH", type: "info" },
      { label: "循环次数", value: "33次", type: "info" },
      { label: "出厂日期", value: "2019-03-09", type: "info" },
      { label: "均衡电压", value: "7.23V", type: "info" },
      { label: "设备编号", value: "3800939", type: "info" }
    ];

    const items = options.map((item, index) => (
      <el-col class="BatteryInfo__item" key={index} span={4}>
        <span class="BatteryInfo__label">{item.label}</span>
        <span class={`BatteryInfo__text BatteryInfo__text_${item.type}`}>
          {item.value}
        </span>
      </el-col>
    ));

    return <el-row class="BatteryInfo">{items}</el-row>;
  }
};
</script>

<style lang="scss" scoped>
.BatteryInfo {
  &__item {
    &:nth-child(6) ~ & {
      margin-top: 10px;
    }
  }

  &__label {
    font-size: 13px;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 16px;
    margin-right: 5px;

    &::after {
      content: ":";
    }
  }

  &__text {
    font-size: 13px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 16px;

    &_warning {
      color: rgba(244, 118, 26, 1);
    }

    &_error {
      color: rgba(211, 21, 21, 1);
    }
  }
}
</style>
