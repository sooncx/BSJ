const data = {
  desc: '博云定位服务API接口为行业的提供专业的GPS、北斗定位服务产品；基站定位、wifi定位和wifi基站混合定位等多种定位方式，提升定位相关的效率和精准的位置，为企业提供一体化智能化的定位解决方案。',
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
