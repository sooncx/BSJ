import url from "./url";
import {
  GET,
  POST
} from "./apiFn";

export default {
  /**
   @method doLoginAdmin
   @param {String,String} 参数名:{userName,password}
   @description 账号,密码
 */
  login: params => GET(url.login, params), // 登录

  changePws: params => POST(url.changePws, params), // 修改密码

  logout: params => GET(url.logout, params), // 登出

  getAppList: params => GET(url.getAppList, params), // 获取应用列表

  getUserList: params => GET(url.getUserList, params), // 获取用户列表

  getInterfaceByApp: params => GET(url.getInterfaceByApp, params), // 获取应用下所有接口

  addInterface: params => POST(url.addInterface, params), // 新增接口

  deleteInterface: params => GET(url.deleteInterface, params), // 删除接口

  updateInterface: params => POST(url.updateInterface, params), // 修改接口

  getInterfaceById: params => GET(url.getInterfaceById, params), // 根据id查询接口

  userInfoList: params => GET(url.userInfoList, params), // 查询用户信息列表

  modifyPassword: params => GET(url.modifyPassword, params), // 修改密码

  delUser: params => GET(url.delUser, params), // 删除用户

  listApplication: params => GET(url.listApplication, params), // 查询应用列表

  pageQueryLimitInfoByAppId: params => GET(url.pageQueryLimitInfoByAppId, params), // 通过appId查询额度信息

  limitGet: params => GET(url.limitGet, params), // 单个查询用户接口配置

  getInterFaceByuserId: params => GET(url.getInterFaceByuserId, params), // 根据uiseAppid查询接口信息

  modifyUserLimit: params => GET(url.modifyUserLimit, params), // 修改用户额度

  modifyLimit: params => POST(url.modifyLimit, params), // 修改qps和日限制

  userIncreaseInfo: params => GET(url.userIncreaseInfo, params), // 用户数量增长统计信息

  interfaceDayInvokeInfo: params => GET(url.interfaceDayInvokeInfo, params), // 当日调用量统计

  interfaceMonthInvokeInfo: params => GET(url.interfaceMonthInvokeInfo, params), // 当月调用量统计

  updateUserAppInvokeNum: params => GET(url.updateUserAppInvokeNum, params), // 应用总额度修改

  getAllRenews: params => GET(url.getAllRenews, params), // 查询全部套餐信息

  buyCombos: params => GET(url.buyCombos, params), // 购买套餐
};
