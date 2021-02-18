import { GET, exportFile, POST,POSTBody,UPLOADFILE } from "../apiFn";
import url from '../url';
import APIType from "./type";

export default {
   // 查询车辆续费数据
   pageVehicleExpire: (params: APIType.pageVehicleExpireParam): Promise<APIType.pageVehicleExpireRes> => 
   POST(url.pageVehicleExpire, params),
   // 查询结清车辆列表
   pageSettleList: (params: APIType.pageSettleListParam): Promise<APIType.pageSettleListRes> => GET(url.pageSettleList, params),
   // 获取当前用户设备数量
   getUserVehicleCount: (params: any): Promise<any> => GET(url.getUserVehicleCount, params),
   // 结清车辆列表导出
   exportSettleList: (params: any): void => exportFile(url.exportSettleList, params), 
   // 下载车辆续费文档
   carRechargeDownLoadDoc: (params: any): void => exportFile(url.carRechargeDownLoadDoc, params), 
   // 车辆续费导出
   exportVehicleExpire: (params: any): void => exportFile(url.exportVehicleExpire, params), 
   // 续费接口
   vehicleStateRecharge: (params: APIType.vehicleStateRechargeParam): Promise<APIType.vehicleStateRechargeRes> => 
   POST(url.vehicleStateRecharge, params),
   // 批量转入不续费
   batchVehicleStateRecharge: (params: APIType.batchVehicleStateRechargeParam): Promise<APIType.batchVehicleStateRechargeRes> => 
   POST(url.batchVehicleStateRecharge, params),
   // 自定义续费接口
   batchTransferState: (params: APIType.batchTransferStateParam): Promise<APIType.batchTransferStateRes> => 
   POST(url.batchTransferState, params),
   // 查询车辆续费记录
   pageVehicleFreeLog: (params: APIType.pageVehicleFreeLogParam): Promise<APIType.pageVehicleFreeLogRes> => 
   POST(url.pageVehicleFreeLog, params),
   // 车币划拨
   userRecharge: (params: APIType.userRechargeParam): Promise<APIType.userRechargeRes> => 
   POST(url.userRecharge, params),
   // 查询余额和总车辆数
   queryMyState: (): Promise<APIType.queryMyStateRes> => 
   GET(url.queryMyState,{}),
   // 查询车辆划拨记录
   pageRechargeLog: (params: APIType.pageRechargeLogParam): Promise<APIType.pageRechargeLogRes> => 
   POST(url.pageRechargeLog, params),
   // 查询工单列表
   pageWorkSheetListByCondition: (params: APIType.pageWorkSheetListByConditionParam): Promise<APIType.pageWorkSheetListByConditionRes> => 
   POSTBody(url.pageWorkSheetListByCondition, params),
   // 创建工单
   saveWorkSheet: (params: APIType.workSheetParam): Promise<APIType.PublicRes> => 
   POSTBody(url.saveWorkSheet, params),
   // 修改工单
   updateWorkSheet: (params: APIType.workSheetParam): Promise<APIType.PublicRes> => 
   POSTBody(url.updateWorkSheet, params),
   // 分页展示安装人员下拉框信息
   pageInstallWorker: (): Promise<APIType.pageInstallWorkerRes> => 
   GET(url.pageInstallWorker, {}),
   // 删除工单
   deleteWorkSheet: (params: APIType.deleteWorkSheetParams): Promise<APIType.PublicRes> => 
   GET(url.deleteWorkSheet, params),
   // 修改工单
   updateWorkSheetStatus: (params: APIType.updateWorkSheetStatusParams): Promise<APIType.PublicRes> => 
   GET(url.updateWorkSheetStatus, params),
   // 导出工单/导出安装人员
   exportWorkSheet: (params: APIType.pageWorkSheetListByConditionParam): void => exportFile(url.exportWorkSheet, params), 
   // 分页展示安装人员搜索列表
   pageInstallWorkerListByCondition: (params: APIType.pageInstallWorkerListByConditionParam): Promise<APIType.pageInstallWorkerListByConditionRes> => 
   POSTBody(url.pageInstallWorkerListByCondition, params),
   // 添加安装人员
   saveInstallWorker: (params: APIType.installWorkerParams): Promise<APIType.PublicRes> => 
   POSTBody(url.saveInstallWorker, params),
   // 修改安装人员信息
   updateInstallWorker: (params: APIType.installWorkerParams): Promise<APIType.PublicRes> => 
   POSTBody(url.updateInstallWorker, params),
   // 删除安装人员
   deleteInstallWorker: (params: APIType.deleteInstallWorkerParams): Promise<APIType.PublicRes> => 
   GET(url.deleteInstallWorker, params),
   // 批量删除安装人员信息
   deleteInstallWorkers: (params: APIType.deleteInstallWorkersParams): Promise<APIType.PublicRes> => 
   GET(url.deleteInstallWorkers, params),
   // 查询车组下所有车辆
   listVehicleByGroupRds: (params: APIType.listVehicleByGroupRdsParam): Promise<APIType.listVehicleByGroupRdsRes> => 
   GET(url.listVehicleByGroupRds, params),
   // 添加车组信息
   addVehGroup: (params: APIType.vehGroupInfoParams): Promise<APIType.addVehGroupRes> => 
   POST(url.addVehGroup, params),
   // 修改车组信息
   updateVehicleGroup: (params: APIType.vehGroupInfoParams): Promise<APIType.PublicRes> => 
   POST(url.updateVehicleGroup, params),
   // 获取车组信息
   getGroup: (params: APIType.deleteVehicleGroupParams): Promise<APIType.getGroupRes> => 
   POST(url.getGroup, params),
   // 删除车组信息
   deleteVehicleGroup: (params: APIType.deleteVehicleGroupParams): Promise<APIType.PublicRes> => 
   POST(url.deleteVehicleGroup, params),
   // 根据车辆id获取车辆信息
   queryVehicleInfo: (params: APIType.queryVehicleInfoParams): Promise<APIType.queryVehicleInfoRes> => 
   GET(url.queryVehicleInfo, params),
   // 单台车辆转移
   singleVehTran: (params: APIType.singleVehTranParams): Promise<APIType.PublicRes> => 
   POST(url.singleVehTran, params),
   // 删除车辆
   deleteVehicle: (params: APIType.deleteVehicleParams): Promise<APIType.PublicRes> => 
   POST(url.deleteVehicle, params),
   // 根据车牌号/设备号转移车辆
   transVehicle: (params: APIType.transVehicleParams): Promise<APIType.PublicRes> => 
   POST(url.transVehicle, params),
   // 自定义删除
   batchDelVehicle: (params: APIType.batchDelVehicleParams): Promise<APIType.batchDelVehicleRes> => 
   POST(url.batchDelVehicle, params),
   // 自定义续费
   batchRecharge: (params: APIType.batchRechargeParams): Promise<APIType.batchRechargeRes> => 
   POST(url.batchRecharge, params),
   // 列表查询用户
   listUser: (params: APIType.listUserParams): Promise<APIType.listUserRes> => 
   GET(url.listUser, params),
   // 分页列表查询用户
   pageUser: (params: APIType.pageUserParams): Promise<APIType.pageUserRes> => 
   GET(url.pageUser, params),
   // 新增客户
   saveClientUser: (params: APIType.saveClientUserParams): Promise<APIType.saveClientUserRes> => 
   POSTBody(url.saveClientUser, params),
   //删除用户
   deleteClientUser: (params: APIType.deleteClientUserParams): Promise<APIType.PublicRes> => 
   GET(url.deleteClientUser, params),
   // 修改客户
   updateClientUser: (params: APIType.updateClientUserParams): Promise<APIType.PublicRes> => 
   POSTBody(url.updateClientUser, params),
   // 重置密码
   resetUserPassword: (params: APIType.resetUserPasswordParams): Promise<APIType.resetUserPasswordRes> => 
   GET(url.resetUserPassword, params),
   // 修改用户本身密码
   updateUserPassword: (params: APIType.updateUserPasswordParams): Promise<APIType.PublicRes> => 
   POST(url.updateUserPassword, params),
   // 用户绑定车组
   bindUserGroup: (params: APIType.bindUserGroupParams): Promise<APIType.PublicRes> => 
   POSTBody(url.bindUserGroup, params),
   // 查询车辆信息
   searchVehicleInfo: (params: any): Promise<any> => GET(url.searchVehicleInfo, params),
   // 添加车辆
   saveVehicle: (params: any): Promise<any> => POSTBody(url.saveVehicle, params),
   // 修改车辆
   updateVehicle: (params: any): Promise<any> => POSTBody(url.updateVehicle, params),
   // 单个查询用户
   getUser: (params: APIType.getUserParams): Promise<APIType.getUserRes> => 
   GET(url.getUser, params),
   // 查询用户绑定的车组
   listUserGroup: (params: APIType.listUserGroupParams): Promise<APIType.listUserGroupRes> => 
   GET(url.listUserGroup, params),
   // 结清车辆列表导出
   getExportFile: (params: any): void => exportFile(url.getExportFile, params), 
   // 没有错误数数把数据全部插入表格中
   insertBatchVeh: (params: APIType.insertBatchVehParams):  Promise<APIType.PublicRes> => GET(url.insertBatchVeh, params), 
   // 获取中间表的错误数据
   getImportVehicleData: ():  Promise<APIType.getImportVehicleDataRes> => GET(url.getImportVehicleData), 
   // 批量修改错误信息
   updateErrorImportVehicle: (params: any): Promise<any> => POSTBody(url.updateErrorImportVehicle, params),
   // 删除中间标的所有数据
   delImportVehicleData: (params: any): Promise<any> => GET(url.delImportVehicleData, params),
   // 上传文件
   importVehicle: (params: any): Promise<any> => UPLOADFILE(url.importVehicle, params),
   /**
    * 模糊查询用户
    */
   searchUser: (params: any): Promise<any> => GET(url.searchUser, params),
   // 查询车辆信息
   getLocationData: (params: APIType.getLocationDataParams): Promise<APIType.getLocationDataRes> => GET(url.getLocationData, params),
   // 新增角色
   addRole: (params: APIType.roleParams): Promise<APIType.PublicRes> => POSTBody(url.addRole, params),
   // 分配角色资源
   updateResource: (params: APIType.updateResourceParams): Promise<APIType.PublicRes> => GET(url.updateResource, params),
   // 修改角色
   updateRole: (params: APIType.roleParams): Promise<APIType.PublicRes> => POSTBody(url.updateRole, params),
   // 删除角色
   deleteRole: (params: APIType.deleteRoleParams): Promise<APIType.PublicRes> => GET(url.deleteRole, params),
   // 分页查询角色数据
   pageRole: (params: APIType.pageRoleParams): Promise<APIType.pageRoleRes> => GET(url.pageRole, params),
   // 单个查询角色
   getRole: (params: APIType.getRoleParams): Promise<APIType.getRoleRes> => GET(url.getRole, params),
   // 树形查询用户拥有的资源
   resourceTree: ({}): Promise<any> => GET(url.resourceTree),
   // 导出车组下所有车辆
   exportVehicleByGroupRds: (params: any): void => exportFile(url.exportVehicleByGroupRds, params), 
   // 用户数据导出
   exportUser: (params: any): void => exportFile(url.exportUser, params), 
}