<script>
export default {
  functional: true,
  render(h, { data, props }) {
    const { type, text = false, value } = props;

    let options;
    switch (type) {
      //车辆类型
      case "vehicleType":
        options = [
          { value: 0, label: "其他" },
          { value: 1, label: "货车" },
          { value: 2, label: "客车" },
          { value: 3, label: "公交车" },
          { value: 4, label: "旅游大巴" },
          { value: 5, label: "环卫车" },
          { value: 6, label: "邮政车" },
          { value: 7, label: "渣土车" },
          { value: 8, label: "校车" }
        ];
        break;
      //故障类型
      case "faultType":
        options = [
          { value: 0, label: "无故障" },
          { value: 1, label: "NO排放不合格" },
          { value: 2, label: "尿素箱空" },
          { value: 3, label: "违规行驶" }
        ];
        break;
      //排放标准
      case "emissionStandard":
        options = [
          { value: 0, label: "国三" },
          { value: 1, label: "国四" },
          { value: 2, label: "国五" },
          { value: 3, label: "国六" }
        ];
        break;
      //燃油类型
      case "fuelType":
        options = [
          { value: 0, label: "柴油" },
          { value: 1, label: "汽油" },
          { value: 2, label: "天然气" },
          { value: 3, label: "电动" }
        ];
        break;
      //排气类型
      case "exhaust":
        options = [
          { value: 0, label: "SRC" },
          { value: 1, label: "DPF+EGR" },
          { value: 2, label: "SCR+DPF+EGR" },
          { value: 3, label: "两者都无" }
        ];
        break;
      default:
        console.error(type, "请填写正确的type");
        return;
    }
    if (text) {
      return <span>{options[value] ? options[value].label : ""}</span>;
    }

    const items = options.map(item => (
      <el-option key={item.value} label={item.label} value={item.value} />
    ));
    return <el-select {...data}>{items}</el-select>;
  }
};
</script>
