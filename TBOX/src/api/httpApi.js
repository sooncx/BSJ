import url from "./url";
import { GET, POST, FORM, GetGeo, exportFile } from "./apiFn";

export default {
  /**
   @method doLoginAdmin
   @param {String,String} 参数名:{userName,password}
   @description 账号,密码
 */
  doLoginAdmin: params => GET(url.doLoginAdmin, params), // 登录

  /**
   @method doLoginAdmin
   @param {} 参数名:{}
   @description
 */
  doLoginOut: params => POST(url.doLoginOut, params), // 退出

  /**
   @method doLoginAdmin
   @param {Number,String,String,String,String,String,String} 参数名:{parentId,userName,password,userRights,stateType,phone,emailAddress}
   @description 上级ID,用户名,密码,权限,使用状态,联系电话,邮箱地址
 */
  doAddUser: params => GET(url.doAddUser, params), // 添加用户

  /**
   @method doLoginAdmin
   @param {String} 参数名:{ids}
   @description 用户id 	格式：1,2,3
 */
  doDeleteUser: params => POST(url.doDeleteUser, params), // 删除用户

  /**
   @method doLoginAdmin
   @param {Number,Number,String,String,String,String,String,String} 参数名:{userId,parentId,userName,password,userRights,stateType,phone,emailAddress}
   @description 用户ID,上级ID,用户名,密码,权限,使用状态,联系电话,邮箱地址
 */
  doUpdateUser: params => POST(url.doUpdateUser, params), // 修改用户

  /**
   @method doLoginAdmin
   @param {String,String,String} 参数名:{emailAddress,phone,userName}
   @description 用户名，或邮箱地址，或电话号码
 */
  doGetUser: params => GET(url.doGetUser, params), // 根据用户名，或邮箱地址，或电话号码查找用户

  /**
   @method doShowUserMessage
   @param {} 参数名:{}
   @description
 */
  doShowUserMessage: params => GET(url.doShowUserMessage, params), // 前台展示用户信息

  /**
   @method doShowOrganization
   @param {} 参数名:{}
   @description
 */
  doShowOrganization: params => GET(url.doShowOrganization, params), // 首页展示用户组织车辆等信息

  /**
   @method doGetVehicleByOrganizationId
   @param {Number} 参数名:{organizationId}
   @description 组织id
 */
  doGetVehicleByOrganizationId: params => GET(url.doGetVehicleByOrganizationId, params), // 根据组织id显示车辆信息

  /**
   @method doAddOrganization
   @param {string, number, number} 参数名:{organizationName, parentId, userId}
   @description organizationName, parentId, userId
 */
  doAddOrganization: params => GET(url.doAddOrganization, params), // 根据组织id显示车辆信息

  /**
   @method doAddVehicle
   @param {} 参数名:{}
   @description
 */
  doAddVehicle: params => POST(url.doAddVehicle, params), // 根据组织id显示车辆信息

  /**
   @method doMoveVehicle
   @param {number, string} 参数名:{organizationId, plate}
   @description 转移到那个组织, 转移的车辆i
 */
  doMoveVehicle: params => POST(url.doMoveVehicle, params), // 转移车辆

  /**
   @method doDeleteVehicle
   @param {string} 参数名:{plate}
   @description 转移的车辆
 */
  doDeleteVehicle: params => POST(url.doDeleteVehicle, params), // 批量删除车辆信息

  /**
   @method doUpdateVehicle
   @param {} 参数名:{}
   @description 转移的车辆
 */
  doUpdateVehicle: params => POST(url.doUpdateVehicle, params), // 修改车辆信息

  /**
   @method doUpdateOrganization
   @param {string, number, number} 参数名:{organizationName, parentId, userId}
   @description 组织名称, 不允许修改, 不允许修改
 */
  doUpdateOrganization: params => POST(url.doUpdateOrganization, params), // 修改车辆信息

  /**
   @method doDeleteOrganization
   @param {string} 参数名:{ids}
   @description 组织id
 */
  doDeleteOrganization: params => POST(url.doDeleteOrganization, params), // 修改车辆信息

  /**
   @method doGetVehicleByType
   @param {Number, Number} 参数名:{type, vehicleType}
   @description 按哪一种方式来查询车辆, 需要中呢一种车辆信息
 */
  doGetVehicleByType: params => GET(url.doGetVehicleByType, params), // 修改车辆信息

  /**
   @method getVehicleMonitoringByOrganizationId
   @param {Number} 参数名:{organizationId}
   @description 组织id
 */
  getVehicleMonitoringByOrganizationId: params =>
    GET(url.getVehicleMonitoringByOrganizationId, params), // 获取组织下的所有车辆位置信息

  /**
   @method getVehicleMonitoringByOrganizationId
   @param {string} 参数名:{string}
   @description 	查询参数
 */
  getVehiclesMonitoringByString: params => GET(url.getVehiclesMonitoringByString, params), // 模糊查询

  /**
   @method doMoveOrganization
   @param {string, Number} 参数名:{organizationId, userId}
   @description 	组织id, 	转移到的用户
 */
  doMoveOrganization: params => POST(url.doMoveOrganization, params), // 模糊查询

  /**
   @method all
   @param {} 参数名:{}
   @description
 */
  all: params => GET(url.all, params), // 首页统计

  GetGeo, //高德获取地址

  /**
   @method doUpdate
   @param {} 参数名:{newPassword, oldPassword}
   @description
 */
  doUpdate: params => POST(url.doUpdate, params), // 修改密码

  /**
   @method doChangeState
   @param {number, string} 参数名:{state, userIds}
   @description
 */
  doChangeState: params => POST(url.doChangeState, params), // 修改用户的账号状态

  /**
   @method vehicleHot
   @param {} 参数名:{}
   @description
 */
  vehicleHot: params => GET(url.vehicleHot, params), // 首页热力图

  /**
   @method doGetVehicleModel
   @param {String} 参数名:{model}
   @description
 */
  doGetVehicleModel: params => GET(url.doGetVehicleModel, params), // 查找车型

  /**
   @method doUpdateVehicleModel
   @param {} 参数名:{}
   @description
 */
  doUpdateVehicleModel: params => POST(url.doUpdateVehicleModel, params), // 车型修改

  /**
   @method doAddVehicleModel
   @param {} 参数名:{}
   @description
 */
  doAddVehicleModel: params => POST(url.doAddVehicleModel, params), // 添加车型

  /**
   @method doImportExcelVehicle
   @param {} 参数名:{}
   @description
 */
  doImportExcelVehicle: params => FORM(url.doImportExcelVehicle, params), // 添加车型

  /**
   @method doDownFile
   @param {} 参数名:{}
   @description
 */
  doDownFile: params => exportFile(url.doDownFile, params), // 模板下载

  /**
   @method doWriteExcelVehicle
   @param {} 参数名:{}
   @description
 */
  doWriteExcelVehicle: params => exportFile(url.doWriteExcelVehicle, params), // 导出车辆

  /**
   @method doWriteExcelUser
   @param {} 参数名:{}
   @description
 */
  doWriteExcelUser: params => exportFile(url.doWriteExcelUser, params), // 导出用户


  /**
   @method exportUser
   @param {} 参数名:{}
   @description
*/
  exportUser: params => exportFile(url.exportUser, params), // 导出用户

  /**
   @method doGetErrorVehicleMessage
   @param {} 参数名:{}
   @description
 */
  doGetErrorVehicleMessage: params => GET(url.doGetErrorVehicleMessage, params), // 显示错误信息

  /**
   @method doDelCVehicle
   @param {} 参数名:{}
   @description
 */
  doDelCVehicle: params => POST(url.doDelCVehicle, params), // 清除临时表

  /**
   @method doUpdateErrorVehicleMessage
   @param {JSON} 参数名:{json}
   @description 错误信息修改后, 组织id
 */
  doUpdateErrorVehicleMessage: params => POST(url.doUpdateErrorVehicleMessage, params), // 修改错误信息

  /**
   @method getVehicleTrackInfo
   @param {String, String, Number} 参数名:{endTime, startTime, vehicleId}
   @description
 */
  getVehicleTrackInfo: params => GET(url.getVehicleTrackInfo, params), // 修改错误信息

  /**
   @methods getOfflineReport
   @param {number} 参数名:{beginTimeMin,endTimeMin,organizationId,pageNumber,pageSize,vehicleId}
   @description
   */
  getOfflineReport: params => GET(url.getOfflineReport, params),

  /**
   @methods exportOfflineReport
   @param {number} 参数名:{beginTimeMin,endTimeMin,organizationId,pageNumber,pageSize,vehicleId}
   @description
 */
  exportOfflineReport: params => exportFile(url.exportOfflineReport, params),

  /**
   @methods getMileageReport
   @param {}
   @description
*/
  getMileageReport: params => GET(url.getMileageReport, params),

  /**
   @methods exportMileageReport
   @param {}
   @description
*/
  exportMileageReport: params => exportFile(url.exportMileageReport, params),

  /**
   @methods getNoxReport
   @param {}
   @description
*/
  getNoxReport: params => GET(url.getNoxReport, params),

  /**
   @methods exportNoxReport
   @param {}
   @description
*/
  exportNoxReport: params => exportFile(url.exportNoxReport, params),

  /**
   @methods getNoxDetail
   @param {}
   @description
*/
  getNoxDetail: params => GET(url.getNoxDetail, params),

  /**
   @methods exportNoxDetail
   @param {}
   @description
*/
  exportNoxDetail: params => exportFile(url.exportNoxDetail, params),

  /**
   @methods getIllegalReport
   @param {}
   @description
*/
  getIllegalReport: params => GET(url.getIllegalReport, params),

  /**
   @methods exportIllegalReport
   @param {}
   @description
*/
  exportIllegalReport: params => exportFile(url.exportIllegalReport, params),

  /**
   @methods getIllegalDetail
   @param {}
   @description
*/
  getIllegalDetail: params => GET(url.getIllegalDetail, params),

  /**
   @methods exportIllegalDetail
   @param {}
   @description
*/
  exportIllegalDetail: params => exportFile(url.exportIllegalDetail, params),

  /**
   @methods getMileageDetail
   @param {}
   @description
*/
  getMileageDetail: params => GET(url.getMileageDetail, params),

  /**
   @methods exportMileageDetail
   @param {}
   @description
*/
  exportMileageDetail: params => exportFile(url.exportMileageDetail, params),

  /**
   @methods getOBDReport
   @param {}
   @description
*/
  getOBDReport: params => GET(url.getOBDReport, params),

  /**
   @methods exportOBDReport
   @param {}
   @description
*/
  exportOBDReport: params => exportFile(url.exportOBDReport, params),
};
