const data = {
  desc: '博云SIM卡API接口，是针对于经销商在平台中往往存在需要查询扩充物联卡的状况，通过开放相关的API接口，让您可以通过该套API接口，通过调用的方式，扩充相关的物联卡查询功能。',
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
      params: "code",
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
      code: "0",
      val: "0",
      desc: "成功"
    },
    {
      code: "-1",
      val: "-1",
      desc: "失败"
    },
    {
      code: "1xxxx",
      val: "11001",
      desc: "无权限"
    },
    {
      code: "",
      val: "11007",
      desc: "参数不正确"
    },
    {
      code: "",
      val: "110015",
      desc: "存在本月重复续费卡号"
    },
    {
      code: "2xxxx",
      val: "20002",
      desc: "请求失败，请输入正确的物联网卡号"
    },
    {
      code: "",
      val: "20003",
      desc: "请求失败，文本内容长度过长"
    }
  ]
};

export default data;
