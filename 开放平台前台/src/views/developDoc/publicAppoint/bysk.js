const data = {
  desc: '博云视控API是针对于车辆智能化管理，结合视频监控、GPS和实时报警，通过开放服务器存储能力和计算能力，提供相关的API接口让经销商可以在原有的基础上继续扩充相关的功能。',
  table1: [
    {
      params: "key",
      type: "String",
      type1: "是",
      desc: "密钥"
    }
  ],
  table2: [
    {
      params: "flag",
      type: "int",
      type1: "是",
      desc: "结果码"
    },
    {
      params: "msg",
      type: "String",
      type1: "是",
      desc: "code描述"
    }
  ],
  table3: [
    {
      code: "1",
      val: "1",
      desc: "成功"
    },
    {
      code: "0",
      val: "0",
      desc: "失败"
    },
    {
      code: "-1",
      val: "-1",
      desc: "失败"
    },
    {
      code: "4xxx",
      val: "4010",
      desc: "请求未授权"
    },
    {
      code: "",
      val: "4040",
      desc: "请求接口不存在"
    },
    {
      code: "",
      val: "4050",
      desc: "HTTP请求方法有误"
    },
    {
      code: "",
      val: "4501",
      desc: "参数校验失败"
    },
    {
      code: "",
      val: "4502",
      desc: "请求每日总额限制"
    },
    {
      code: "",
      val: "4503",
      desc: "请求QPS限制"
    },
    {
      code: "5xxx",
      val: "5001",
      desc: "系统繁忙"
    }
  ]
};

export default data;
