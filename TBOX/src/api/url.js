export default {
  doLoginAdmin: "/user/doLoginAdmin.json", // 登录

  doLoginOut: "/user/doLoginOut.json", // 退出

  doShowUserMessage: "/user/doShowUserMessage.json", // 退出

  doAddUser: "/user/doAddUser.json", // 添加用户

  doDeleteUser: "/user/doDeleteUser.json", // 删除用户

  doUpdateUser: "/user/doUpdateUser.json", // 修改用户

  doGetUser: "/user/doGetUser.json", // 根据用户名，或邮箱地址，或电话号码查找用户

  doShowOrganization: "/user/doShowOrganization.json", //首页展示用户组织车辆等信息

  doGetVehicleByOrganizationId: "/user/doGetVehicleByOrganizationId.json", //根据组织id显示车辆信息

  doAddOrganization: "/organization/doAddOrganization.json", //添加组织

  doAddVehicle: "/vehicle/doAddVehicle.json", //添加车辆

  doMoveVehicle: "/vehicle/doMoveVehicle.json", //转移车辆

  doDeleteVehicle: "/vehicle/doDeleteVehicle.json", //批量删除车辆信息

  doUpdateVehicle: "/vehicle/doUpdateVehicle.json", //修改车辆信息

  doUpdateOrganization: "/organization/doUpdateOrganization.json", //修改组织用户信息

  doDeleteOrganization: "/organization/doDeleteOrganization.json", //批量删除组织

  doGetVehicleByType: "/vehicle/doGetVehicleByType.json", //批量删除组织

  getVehicleMonitoringByOrganizationId: "/monitoring/getVehicleMonitoringByOrganizationId.json", //获取组织下的所有车辆位置信息

  getVehiclesMonitoringByString: "/monitoring/getVehiclesMonitoringByString.json", //模糊查询

  doMoveOrganization: "/organization/doMoveOrganization.json", //批量转移组织用户

  all: "/home/count/all.json", //首页统计

  doUpdate: "/user/doUpdate.json", //修改密码

  doChangeState: "/user/doChangeState.json", //修改用户的账号状态

  vehicleHot: "/home/count/vehicleHot.json", //首页热力图

  doGetVehicleModel: "/vehicleModel/doGetVehicleModel.json", //查找车型

  doUpdateVehicleModel: "/vehicleModel/doUpdateVehicleModel.json", //车型修改

  doAddVehicleModel: "/vehicleModel/doAddVehicleModel.json", //添加车型

  doImportExcelVehicle: "/vehicle/doImportExcelVehicle.json", //批量导入

  doDownFile: "/vehicle/doDownFile.json", //模板下载

  doWriteExcelVehicle: "/vehicle/doWriteExcelVehicle.json", //导出车辆

  doWriteExcelUser: "/vehicle/doWriteExcelUser.json", //导出用户

  exportUser: "/user/doWriteExcelUser.json", //批量导出用户

  doGetErrorVehicleMessage: "/vehicle/doGetErrorVehicleMessage.json", //显示错误信息

  doDelCVehicle: "/vehicle/doDelCVehicle.json", //清除临时表

  doUpdateErrorVehicleMessage: "/vehicle/doUpdateErrorVehicleMessage.json", //修改错误信息

  getVehicleTrackInfo: "/monitoring/getVehicleTrackInfo.json", //轨迹查询

  getOfflineReport: "/reportCenter/offlineVehicle.json", //获取离线报表

  exportOfflineReport: "/export/offline.json", //离线报表导出

  getMileageReport: "/reportCenter/mileage.json", //获取里程报表

  exportMileageReport: "/export/mileage.json", //导出里程报表

  getMileageDetail: "/reportCenter/mileage/detail.json", //获取里程报表明细

  exportMileageDetail: "/export/mileage/detail.json", //里程表表明细导出

  getNoxReport: "/reportCenter/noxUnqualified.json", //获取不合格报表

  exportNoxReport: "/export/noxUnqualified.json", //导出不合格报表

  getNoxDetail: "reportCenter/noxUnqualified/detail.json", //获取不合格报表明细

  exportNoxDetail: "export/noxUnqualified/detail.json", //导出不合格报表明细

  getIllegalReport: "/reportCenter/illegalDriving.json", //获取违法报表

  exportIllegalReport: "/export/illegalDriving.json", //导出违法报表

  getIllegalDetail: "reportCenter/illegalDriving/detail.json", // 获取违规报表明细

  exportIllegalDetail: "export/illegalDriving/detail.json", //违规报表明细导出

  getOBDReport: "/reportCenter/getObdReportInfo.json", //获取OBD历史报表

  exportOBDReport: "/export/getObdReport.json" // 导出OBD历史报表
};
