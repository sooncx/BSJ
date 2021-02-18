export default {
  login: "/open/platform/user/login.json", // 登录
  regist: "/open/platform/user/register.json", // 注册
  modifyPassword: "/open/platform/user/modifyPwd.json", // 修改密码
  getUserMsg: "/open/platform/user/queryUser.json", // 获取用户信息
  addjuniorUser: "/open/platform/user/addjuniorUser.json", // 添加下级用户
  modifyJuniorUser: "/open/platform/user/modifyJuniorUser.json", // 修改下级用户
  getVerifyCode: "/open/platform/user/generateVerifyCode.json", // 获取验证码
  listDefaultApp: "/open/platform/app/listDefaultApp.json", // 查询默认应用列表
  bindApp: "/open/platform/app/bindApp.json", // 绑定应用
  listBindApplication: "/open/platform/app/listBindApplication.json", // 根据用户查询已绑定应用列表
  generateVerifyCodeAPP: "/open/platform/app/generateVerifyCode.json", // 获取验证码(应用相关)
  listFreeInterface: "/open/platform/limit/listFreeInterface.json", // 额度权益
  queryLimitRecord: "/open/platform/limit/queryLimitRecord.json", // 额度记录
  modifyUser: "/open/platform/user/modifyUser.json", // 修改用户信息
  modifyPhoneFirst: "/open/platform/user/modifyPhoneFirstInvoke.json", // 修改手机号第一次调用 返回已验证原手机的验证字符串
  modifyPhoneSecond: "/open/platform/user/modifyPhoneSecondInvoke.json", // 绑定新手机号
  applicationInfoQueryAll: "/open/platform/app/applicationInfoQueryAll.json", // 获取应用信息
  statisticsRecordQuery: "/open/platform/statistic/statisticsRecordQuery.json", // 统计表格数据
  apiInfoListQuery: "/open/platform/statistic/apiInfoListQuery.json", // 统计接口使用的相关信息
  appInterfaceInfoQuery: "/open/platform/statistic/appInterfaceInfoQuery.json", // 通过appInterfaceId获取应用名与接口服务名
  appListQuery: "/open/platform/statistic/appListQuery.json", // 获取应用列表（用户已经绑定过的）
  appInterfaceListQuery: "/open/platform/statistic/appInterfaceListQuery.json", // 根据appId查询用户绑定的服务
  doDispatch: "/open/platform/doDispatch.json", // 跨域
  modifyUserAppInfo: "/open/platform/app/modifyUserAppInfo.json", // 修改应用绑定的信息
  unbindApp: "/open/platform/app/unbindApp.json", // 解绑应用
  queryRoughAppInfo: "/open/platform/statistic/queryRoughAppInfo.json", // 查询我的额度信息
  getAllRenews: "http://47.115.157.89:8087/open/admin/limit/queryComboDetailList.json", // 查询套餐信息
  listAppInfoAndInterface: "/open/platform/statistic/listAppInfoAndInterface.json", // 统计的选择列表的相关查询
  listInterfaceWord: "/open/platform/listInterfaceWord.json", // 菜单
  getAiJson: "http://120.77.17.210:8088/ai/v1/open/openCv/detectFace.json", // 人脸识别 file
  getAiJsonByUrl: "http://120.77.17.210:8088/ai/v1/open/openCv/detectFaceByUrl.json", // 人脸识别 url
  // getAiJson: "/ai/v1/open/openCv/detectFace.json", // 人脸识别 file
  // getAiJsonByUrl: "/ai/v1/open/openCv/detectFaceByUrl.json", // 人脸识别 url
};
