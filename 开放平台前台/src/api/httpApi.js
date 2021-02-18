import url from "./url";
import { GET, POSTBody, FORM } from "./apiFn";

export default {
  /**
   @method doLoginAdmin
   @param {String,String} 参数名:{userName,password}
   @description 账号,密码
 */
  login: params => GET(url.login, params), // 登录

  regist: params => POSTBody(url.regist, params), // 注册

  modifyPassword: params => GET(url.modifyPassword, params), // 修改用户密码

  getUserMsg: params => GET(url.getUserMsg, params), // 获取用户信息

  addjuniorUser: params => GET(url.addjuniorUser, params), // 新增下级用户

  modifyJuniorUser: params => GET(url.modifyJuniorUser, params), // 修改下级用户

  getVerifyCode: params => GET(url.getVerifyCode, params), // 获取验证码

  listDefaultApp: params => GET(url.listDefaultApp, params), // 查询默认应用列表

  bindApp: params => GET(url.bindApp, params), // 绑定应用

  listBindApplication: params => GET(url.listBindApplication, params), // 根据用户查询已绑定应用列表

  generateVerifyCodeAPP: params => GET(url.generateVerifyCodeAPP, params), // 获取验证码(应用相关)

  listFreeInterface: params => GET(url.listFreeInterface, params), // 额度权益

  queryLimitRecord: params => GET(url.queryLimitRecord, params), // 额度记录

  modifyUser: params => GET(url.modifyUser, params), // 修改用户信息

  modifyPhoneFirst: params => GET(url.modifyPhoneFirst, params), // 修改手机号第一次调用 返回已验证原手机的验证字符串

  modifyPhoneSecond: params => GET(url.modifyPhoneSecond, params), // 绑定新手机号

  applicationInfoQueryAll: params => GET(url.applicationInfoQueryAll, params), // 获取应用信息

  statisticsRecordQuery: params => GET(url.statisticsRecordQuery, params), // 统计表格数据

  apiInfoListQuery: params => GET(url.apiInfoListQuery, params), // 统计接口使用的相关信息

  appfaceInfoQuery: params => GET(url.appInterfaceInfoQuery, params), // 通过appInterfaceId获取应用名与接口服务名

  appListQuery: params => GET(url.appListQuery, params), // 获取应用列表（用户已经绑定过的）

  appInterfaceListQuery: params => GET(url.appInterfaceListQuery, params), // 根据appId查询用户绑定的服务

  doDispatch: params => GET(url.doDispatch, params), // 跨域

  modifyUserAppInfo: params => GET(url.modifyUserAppInfo, params), // 修改应用绑定的信息

  unbindApp: params => GET(url.unbindApp, params), // 解绑应用

  queryRoughAppInfo: params => GET(url.queryRoughAppInfo, params), // 获取我的额度信息

  getAllRenews: params => GET(url.getAllRenews, params), // 获取套餐信息

  listAppInfoAndInterface: params => GET(url.listAppInfoAndInterface, params), // 统计的选择列表的相关查询

  listInterfaceWord: params => GET(url.listInterfaceWord, params), // 菜单

  getAiJson: params => FORM(url.getAiJson, params), // 人脸识别 file

  getAiJsonByUrl: params => GET(url.getAiJsonByUrl, params), // 人脸识别 url
};
