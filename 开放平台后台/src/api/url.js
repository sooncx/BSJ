export default {
  login: "/open/admin/sysUser/login.json", // 登录
  changePws: "/open/admin/sysUser/modifyPwd.json", // 修改密码
  logout: "/open/admin/sysUser/exit.json", // 登出
  getAppList: "/open/admin/userApp/page.json", // 获取应用列表
  getInterFaceByuserId: "/open/admin/limit/pageQueryLimitInfoByAppIdAndUserAppId.json", // 通过用户id获取接口信息
  getUserList: "/open/back/stage/queryAllUser.json", // 获取用户列表
  getInterfaceByApp: "/open/admin/appInterface/page.json", // 查询应用下全部接口
  addInterface: "/open/admin/appInterface/add.json", // 新增接口
  deleteInterface: "/open/admin/appInterface/del.json", // 删除接口
  updateInterface: "/open/admin/appInterface/update.json", // 修改接口
  getInterfaceById: "/open/admin/appInterface/get.json", // 查询单个接口
  userInfoList: "/open/admin/user/userInfoList.json", // 查询用户信息列表
  modifyPassword: "/open/admin/user/modifyPassword.json", // 修改密码
  delUser: "/open/admin/user/delUser.json", // 删除用户
  listApplication: "/open/admin/limit/listApplication.json", // 查询应用列表
  pageQueryLimitInfoByAppId: "/open/admin/limit/pageQueryLimitInfoByAppId.json", // 通过appId查询额度信息
  limitGet: "/open/admin/limit/get.json", // 单个查询用户接口配置
  modifyUserLimit: "/open/admin/limit/modifyUserLimit.json", // 修改用户额度
  modifyLimit: "/open/admin/limit/update.json", // 修改qps和日限制
  userIncreaseInfo: "/open/admin/statistic/userIncreaseInfo.json", // 用户数量增长统计信息
  interfaceDayInvokeInfo: "/open/admin/statistic/interfaceDayInvokeInfo.json", // 当日调用量统计
  interfaceMonthInvokeInfo: "/open/admin/statistic/interfaceMonthInvokeInfo.json", // 当月调用量统计
  updateUserAppInvokeNum: "/open/admin/limit/updateUserAppInvokeNum.json", // 应用总额度修改
  getAllRenews: "/open/admin/limit/queryComboDetailList.json", // 查询套餐信息
  buyCombos: "/open/admin/limit/buyCombos.json", // 购买套餐
};
