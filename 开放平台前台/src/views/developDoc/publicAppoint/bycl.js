const data = {
  desc: '经销商自己有一套系统，想在这个基础上扩充相关GPS功能。经销商的客户的账号由经销商自己的系统管理，用于登录经销商的系统。 博云车联 API 接口是一套针对各类汽车金融机构的应用程序接口，您可以使用该套API接口，通过调用的方式，扩充相关的GPS功能。',
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
      desc: "成功(兼容)"
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
