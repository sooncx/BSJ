// 旧版接口
const beforeUrl = {
  login: "/oauth/token", // 登录
  logout: "/oauth/logout", // 退出登录
  modifyPwd: "/car/v1/api/user/updateUserPassword.json", // 修改密码
  listRecord: "/car/v1/accelerate/export/listExportRecord.json", // 下载列表
  download: '/car/v1/accelerate/export/download.json', // 下载列表导出
  GetInformation: "/car/v1/accelerate//export/exportDataReport.json", // 导出资料
  QueryTextUpAndCmdDownInfo: "/car/v1/accelerate/report/commandReport/pageCommandAndTextUp.json", // 获取命令下发报表
  getAreaBaseInfo: "/car/v1/api/monitor/listAdminRegion", // 获取省市区数据
  getResource: "/car/v1/api/resource/list.json", // 查询用户拥有的资源
  listTerminalResource: "/car/v1/api/resource/listTerminalResource.json", // 列表查询设备的指令权限
  listCommandResource: "/car/v1/api/resource/listCommandResource.json", // 列表查询指令功能
  listPermission: '/car/v1/api/user/permission/listPermission.json', // 查询权限默认列表
  userPermissionList: '/car/v1/api/user/permission/list.json', // 查询用户权限
  updatePermissionList: '/car/v1/api/user/permission/update.json', // 修改用户权限
  listAll: '/car/v1/api/resource/listAll.json', // 列表查询登录用户所有资源（指令资源、用户设置）

  // 轨迹回放
  listVehTrackPoint: '/car/v1/accelerate/track/listVehTrackPoint.json', // 获取车辆轨迹位置点
  listAlarmInfo: '/car/v1/accelerate/report/alarm/alarmInfoList.json', // 获取报警点信息
  pageQueryStopReport: '/car/v1/accelerate/report/stopReport/pageStopReport.json', // 获取经常停留点
  listDownloadInfo: '/car/v1/accelerate/track/listDownloadInfo.json', // 获取下载列表
  exportSimple: '/car/v1/accelerate/track/exportSimple.json', // 简单轨迹导出，2000条以下
  exportTrack: '/car/v1/accelerate/track/export.json', // 轨迹导出文件，2000条以上
  getProcessInfo: '/car/v1/accelerate/track/getProcessInfo.json', // 查询异步导出进度,可用来检测是否存在升级任务
  downloadFile: '/car/v1/accelerate/track/downloadFile.json', // 下载文件

  // 轨迹回放  监控中心共用
  queryPolygonalFence: '/car/v1/api/fence/queryPolygonalFence', // 获取多边形围栏
  queryRoundFence: '/car/v1/api/fence/queryRoundFence', // 获取圆形围栏

  // 数据报表
  pageAlarm: '/car/v1/accelerate/report/alarm/alarmAnalysis.json', // 查询报警报表
  listAlarmDetail: '/car/v1/accelerate/report/alarm/alarmDetail.json', // 查询报警明细报表
  exportAlarm: '/car/v1/accelerate/export/alarm.json', // 导出报警数据
  exportAlarmDetail: '/car/v1/accelerate/report/alarm/exportAlarmDetail.json', // 导出报警明细
  pageOffOnline: '/car/v1/accelerate/report/offOnlineReport/pageOffOnline.json', // 离线统计
  exportOffOnline: '/car/v1/accelerate/report/offOnlineReport/exportOffOnline.json', // 离线统计数据导出
  pageAccReport: '/car/v1/accelerate/report/accReport/pageAccReport.json', // 行车统计查询
  pageAccDetail: '/car/v1/accelerate/report/accReport/pageAccDetail.json', // 行车统计明细查询
  exportAccReport: '/car/v1/accelerate/report/accReport/exportAccReport.json', // 行车统计导出
  exportPageAccDetail: '/car/v1/accelerate/report/accReport/exportPageAccDetail.json', // 行车统计明细导出
  pageNowStopRePort: '/car/v1/accelerate/report/nowStopReport/pageNowStopReport.json', // 停车报表查询
  exportNowStopRePort: '/car/v1/accelerate/report/nowStopReport/exportStopReport.json', // 停车报表导出
  pageStopRePort: '/car/v1/accelerate/report/stopReport/pageStopReport.json', // 经常停留点查询
  exportStopRePort: '/car/v1/accelerate/report/stopReport/exportStopRePort.json', // 经常停留点导出
  pageEnergyReport: '/car/v1/accelerate/report/energyReport/pageEnergyReport.json', // 剩余电量查询
  exportEnergyReport: '/car/v1/accelerate/report/energyReport/exportEnergyReport.json', // 剩余电量导出
  pageMileage: '/car/v1/accelerate/report/mileageReport/pageMileage.json', // 查询里程报表
  exportMileage: '/car/v1/accelerate/export/mileage.json', // 里程导出
  listMileageDetail: '/car/v1/accelerate/report/mileageReport/listMileageDetail.json', // 查询里程报表明细
  exportMileageDetail: '/car/v1/accelerate/report/mileageReport/exportMileageDetail.json', // 查询里程报表详情导出
  pageTotalMileageReport: '/car/v1/accelerate/report/totalMileageReport/pageTotalMileageReport.json', // 总里程查询
  exportTotalMileageReport: '/car/v1/accelerate/report/totalMileageReport/exportTotalMileageReport.json', // 总里程查询数据导出
  pageCommandReport: '/car/v1/accelerate/report/commandReport/pageCommandReport.json', // 指令查询
  exportCommandReport: '/car/v1/accelerate/report/commandReport/exportCommandReport.json', // 指令查询数据导出
  pageOperRecord: '/car/v1/accelerate/report/operRecord/pageOperRecord.json', // 操作记录查询
  exportOperRecord: '/car/v1/accelerate/report/operRecord/exportOperRecord.json', // 操作记录导出
  pageMaintainReport: '/car/v1/accelerate/report/maintainReport/pageMaintainReport.json', // 保养报表查询
  exportMaintainReport: '/car/v1/accelerate/report/maintainReport/exportMaintainReport.json', // 保养报表导出
  pageInsuranceReport: '/car/v1/accelerate/report/insuranceReport/pageInsuranceReport.json', // 保险报表查询
  exportInsuranceReport: '/car/v1/accelerate/report/insuranceReport/exportInsuranceReport.json', // 保险报表导出
  pageOBDAlarmList: '/car/v1/accelerate/report/alarm/pageOBDAlarmList.json', // OBD报表查询
  pageBluetoothAlarmReport: '/car/v1/accelerate/report/bluetoothReport/pageBluetoothAlarmReport.json', // 物流锁报警记录查询
  pageUnlockHistory: '/car/v1/accelerate/report/bluetoothReport/pageUnlockHistory.json', // 物流锁操作记录查询

  // 风控中心
  pageHomePageOne: '/car/v1/accelerate/home/pageHomePageOne.json', // 查询风控报警
  pageHomePageTwo: '/car/v1/accelerate/home/pageHomePageTwo.json', // 查询风控报警
  pageHomePageRisk: '/car/v1/accelerate/home/queryHomePageRisk.json', // 查询风控报警
  pageHomeUserConcern: '/car/v1/accelerate/home/pageHomeUserConcern.json', // 查询重点关注详情
  pageRelatedOffline: '/car/v1/accelerate/home/pageRelatedOffline.json', // 查询多设备离线
  pageHomePageAlarmInfo: '/car/v1/accelerate/home/pageHomePageAlarmInfo.json', // 查询报警
  pageLongStop: '/car/v1/accelerate/home/pageLongStop.json', // 查询超长停车报警详情
  pageRiskAnalysis: '/car/v1/accelerate/home/pageRiskAnalysis.json', // 查询风险车辆详情
  excelAlarmExport: '/car/v1/accelerate/home/excelAlarmExport.json', // 报警导出
  getInsuranceRiskNum: '/car/v1/api/insuranceRisk/getInsuranceRiskNum.json', // 获取保险近近七天的过期数量
  getInsuranceRiskData: '/car/v1/api/insuranceRisk/getInsuranceRiskData.json', // 获取保险近七天的过期数据
  getMaintainRiskNum: '/car/v1/api/maintainRisk/getMaintainRiskNum.json', // 获取保养风控就七天的数量
  getMaintainRiskData: '/car/v1/api/maintainRisk/getMaintainRiskData.json', // 获取保养风控七天内的数据
  getRenewRiskNum: '/car/v1/api/maintainRisk/getRenewRiskNum.json', // 获取当前七天内的续费风控数量
  getRenewRiskData: '/car/v1/api/maintainRisk/getRenewRiskData.json', // 获取当前七天内的续费风控数据
  getStopTimeSetting: '/car/v1/accelerate/home/getStopTimeSetting.json', // 获得用户查询停留点设置
  addStopTimeSetting: '/car/v1/accelerate/home/addStopTimeSetting.json', // 添加停留时间设置值

  // 监控中心
  loadVehicles: '/car/v1/api/monitor/loadVehicles', // 分页加载车辆数据
  GetGroupVehNum: '/car/v1/api/monitor/statisticsGroupVehicleNum', // 获取不同状态车辆统计数
  SearchVehicleInArea: '/car/v1/api/monitor/listVehicleInArea', // 区域查车
  exportVehicleInArea: "/car/v1/api/monitor/exportVehicleInArea", // 区域查车导出
  GetInsuranceList: '/car/v1/api/monitor/queryInsuranceList', //获取保险明细和险种明细
  querySettleDetail: "/car/v1/api/settle/querySettleDetail", // 获取车辆关联车辆（即结清列表）
  updateSettleStatus: "/car/v1/api/settle/updateSettleStatus", // 结清/结清撤回

  SelectPointByUserId: '/car/v1/api/fence/listLocationPoint', // 查询位置点
  AddPoint: "/car/v1/api/fence/saveLocationPoint", // 添加位置点
  GetRealTimeByVehListState: "/car/v1/api/settle/querySettleDetail", // 获取关联车辆
  DeletePoint: '/car/v1/api/fence/deleteLocationPoint', //删除位置点

  getArea: '/car/v1/api/fence/queryAllPolygonalFence', // 查询围栏
  addPath: '/car/v1/api/fence/savePolygonalFence', // 添加多边形围栏
  delPath: '/car/v1/api/fence/deletePolygonalFence', //删除围栏
  updatePath: '/car/v1/api/fence/updatePolygonalFence', //修改围栏
  getVehicleInfo: '/car/v1/api/fence/listAddFenceVehicle', // 根据围栏id查询围栏绑车信息
  bindVehicleToPath: '/car/v1/api/fence/bindPolygonalFence', //围栏绑车
  getPathIdByVehicleId: '/car/v1/api/fence/queryPolygonalFence', // 查询车辆多边形围栏
  removeBound: '/car/v1/api/fence/updateBindFence', // 围栏解绑

  GetVehicleCircle: '/car/v1/api/fence/queryRoundFence', //查询圆形围栏数据
  SetVehicleCircle: "/car/v1/api/fence/saveRoundFence", // 设置圆形围栏
  saveRoundFence: "/car/v1/api/fence/saveRoundFence", // 添加圆形围栏
  updateRoundFence: "/car/v1/api/fence/updateRoundFence", // 修改圆形围栏
  deleteRoundFence: "/car/v1/api/fence/deleteRoundFence", // 删除圆形围栏

  GetVehicleStayPoint: '/car/v1/api/fence/queryStoppingPoint', //停留点查询
  saveStoppingPoint: "/car/v1/api/fence/saveStoppingPoint", // 添加停留点
  updateStoppingPoint: "/car/v1/api/fence/updateStoppingPoint", // 修改停留点
  deleteStoppingPoint: "/car/v1/api/fence/deleteStoppingPoint", //删除停留点

  GetTwoChargeByUserId: '/car/v1/api/twoCharge/pageTwoCharge', // 查询二押点
  addTwoCharge: "/car/v1/api/twoCharge/saveTwoCharge", // 添加二押点
  deleteTwoCharge: "/car/v1/api/twoCharge/deleteTwoCharge", // 删除二押点
  QueryMortgagePoint: "/car/v1/api/twoCharge/listCloudTwoCharge", // 查询市云端二押点数据
  getVehicleChargeByUserId: "/car/v1/api/twoCharge/listBindVehicleByUserId", // 二押点已绑车辆数据
  getVehicleInfoByGroupList: "/car/v1/api/twoCharge/listBindVehicleByGroupIds", // 根据车组查询车组下车辆
  UpdateOrAddVehicleCharge: "/car/v1/api/twoCharge/saveBindVehicle", // 二押点绑车
  deleteVehicleCharge: "/car/v1/api/twoCharge/updateBindVehicle", // 二押点取消绑车
  saveVehicleConcern: "/car/v1/api/concern/saveVehicleConcern", // 添加关注
  deleteVehicleConcern: "/car/v1/api/concern/deleteVehicleConcern", // 清除关注
  getAdminRegion: "/car/v1/api/monitor/getAdminRegion", // 查询车辆绑定省市区
  bindAdminRegion: "/car/v1/api/monitor/bindAdminRegion", // 修改车辆绑定省市区
  deleteAdminRegion: "/car/v1/api/monitor/deleteAdminRegion", //解除车辆绑定省市区
  getAdminRegionGroup: "/car/v1/api/monitor/getAdminRegionGroup", // 查询车组绑定省市区
  listAdminRegionGroup: "/car/v1/api/monitor/listAdminRegionGroup", // 修改车组绑定省市区
  deleteAdminRegionGroup: "/car/v1/api/monitor/deleteAdminRegionGroup", // 解除车组绑定省市区
  queryInOutVehicleReportList: '/car/v1/api/monitor/queryInOutVehicleReportList', // ocar出入库
  exportInOutVehicleReport: "/car/v1/api/monitor/exportInOutVehicleReport", // 导出Ocar数据

  getRemarkList: "/car/v1/api/concern/getRemarkList", 
  AddUserConcern: "/car/v1/api/concern/saveVehicleConcern", // 添加关注度
  DelUserConcern: "/car/v1/api/concern/deleteVehicleConcern", // 清除关注度
  AudioInfoList: "/car/v1/api/audioImage/pageAudio.json", // 获取录音列表
  getTerminalMap: "/car/v1/api/terminal/getTerminalMap.json", // 获取设备类型
  searchVehicleInfo: "/car/v1/api/vehicle/searchVehicleInfo.json",// 查询车辆信息
  saveVehicle: "/car/v1/api/vehicle/saveVehicle.json", // 添加车辆
  updateVehicle: "/car/v1/api/vehicle/updateVehicle.json", //修改车辆

  getMaintain: "/car/v1/api/maintain/getMaintain.json", //获取车辆保养数据
  maintenanceSettings: "/car/v1/api/maintain/maintenanceSettings.json", //修改车辆保养设置
  GetInsuranceDate: "/car/v1/api/insurance/getInsuranceDate.json", // 获取车辆保险数据
  insertInsuranceDate: "/car/v1/api/insurance/insertInsuranceDate.json", // 设置车辆保险信息

  queryAlarm: "/car/v1/api/monitor/queryAlarm", // 查询监控中心报警数据
  processAlarm: "/car/v1/api/monitor/processAlarm", // 报警处理
  sendCommandDown: "/car/v1/api/command/down.json", // 指令下发
  groupDown: "/car/v1/api/command/group/down.json", // 车组指令下发
  getPassBack: "/car/v1/api/command/getPassBack.json", // 查询无线回传
  getGroupPassBack: "/car/v1/api/command/group/getPassBack.json", // 查询车组无线回传
  getWorkMode: "/car/v1/api/command/getWorkMode.json", // 查询工作模式
  pageImage: "/car/v1/api/audioImage/pageImage.json", // 查询照片库
  getOBDVehicleInfo: "/car/v1/api/monitor/getOBDVehicleInfo", // OBD数据
  getVehicleDateByPlate: "/car/v1/api/vehicle/getVehicleDateByPlate.json", // 车辆资料关联数据

  // 视频直播
  realVideoReq: "/car/v1/video/cmd/realVideoReq.json", // 实时视频请求
  realControlReq: "/car/v1/video/cmd/realControlReq.json", // 实时视频控制请求
  replayReq: "/car/v1/video/cmd/replayReq.json", // 录像回放请求
  replayControlReq: "/car/v1/video/cmd/replayControlReq.json", // 录像回放控制请求
  replayResourceReq: "/car/v1/video/cmd/replayResourceReq.json", // 资源目录请求
  queryResourceResponse: "/car/v1/video/cmd/queryResourceResponse.json", // 查询资源列表结果

  // 资料管理
  pageSettleList: '/car/v1/api/settle/pageSettleList', // 结清车辆列表
  getUserVehicleCount: '/car/v1/api/renew/getUserVehicleCount.json', // 获取当前用户设备数量
  pageVehicleExpire: '/car/v1/api/renew/pageVehicleExpire.json', // 车辆续费列表
  carRechargeDownLoadDoc: 'https://bycl.oss-cn-shenzhen.aliyuncs.com/%E8%BD%A6%E8%BE%86%E7%BB%AD%E8%B4%B9%E6%93%8D%E4%BD%9C%E6%96%87%E6%A1%A3.docx', // 下载文档
  vehicleStateRecharge: '/car/v1/api/renew/vehicleStateRecharge.json', // 单辆车续费接口
  exportVehicleExpire: '/car/v1/api/renew/exportVehicleExpire.json', // 导出车辆续费数据
  exportSettleList: '/car/v1/api/settle/exportSettleList', //结清列表导出
  batchRecharge: '/car/v1/api/renew/batchRecharge.json', //自定义续费接口
  batchTransferState: '/car/v1/api/renew/batchTransferState.json', //自定义不续费接口
  batchVehicleStateRecharge: '/car/v1/api/renew/batchVehicleStateRecharge.json', //批量转入不续费
  pageVehicleFreeLog: '/car/v1/api/renew/pageVehicleFreeLog.json', //查询车辆续费记录
  userRecharge: '/car/v1/api/renew/userRecharge.json',   //车币划拨
  queryMyState: '/car/v1/api/renew/queryMyState.json', //查询余额和总车辆数
  pageRechargeLog: '/car/v1/api/renew/pageRechargeLog.json', //查询车辆划拨记录
  pageWorkSheetListByCondition: '/car/v1/worksheet/management/pageWorkSheetListByCondition.json', //查询工单列表
  saveWorkSheet: '/car/v1/worksheet/management/saveWorkSheet.json',  //添加工单
  updateWorkSheet: '/car/v1/worksheet/management/updateWorkSheet.json', //修改工单
  deleteWorkSheet: '/car/v1/worksheet/management/deleteWorkSheet.json', //删除工单
  updateWorkSheetStatus: '/car/v1/worksheet/management/updateWorkSheetStatus.json', //修改工单状态
  exportWorkSheet: '/car/v1/worksheet/management/exportWorkSheet.json', // 导出工单/导出安装人员
  pageInstallWorker: '/car/v1/worksheet/management/pageInstallWorker.json', //分页展示安装人员下拉框信息
  pageInstallWorkerListByCondition: '/car/v1/worksheet/installWorker/pageInstallWorkerListByCondition.json',//分页展示安装人员搜索列表
  saveInstallWorker: '/car/v1/worksheet/installWorker/saveInstallWorker.json',//添加安装人员
  updateInstallWorker: '/car/v1/worksheet/installWorker/updateInstallWorker.json',//修改安装人员信息
  deleteInstallWorker: '/car/v1/worksheet/installWorker/deleteInstallWorker.json',//删除安装人员
  deleteInstallWorkers: '/car/v1/worksheet/installWorker/deleteInstallWorkers.json',//批量删除安装人员信息
  listVehicleByGroupRds: '/car/v1/api/vehicle/listVehicleByGroupRds.json', //查询车组下所有车辆
  addVehGroup: '/car/v1/api/group/addVehGroup.json', //添加车组信息
  updateVehicleGroup: '/car/v1/api/group/updateVehicleGroup.json', //修改车组信息
  getLocationData: '/car/v1/api/group/getLocationData.json', //获取模糊查询的定位数据
  deleteVehicleGroup: '/car/v1/api/group/deleteVehicleGroup.json', //删除车组信息
  getGroup: '/car/v1/api/group/getGroup.json', //车组详细信息
  singleVehTran: '/car/v1/api/vehicle/singleVehTran',//单台车辆转移
  deleteVehicle: '/car/v1/api/vehicle/deleteVehicle.json',//删除车辆
  batchDelVehicle: '/car/v1/api/vehicle/batchDelVehicle.json',//自定义删除
  transVehicle: '/car/v1/api/group/transVehicle.json',//根据车牌号、设备号转移车辆
  queryVehicleInfo: '/car/v1/api/vehicleManagement/queryVehicleInfo', //根据车辆id获取车辆信息
  treeUser: '/car/v1/api/user/treeUser.json', // 树形用户列表
  listUser: '/car/v1/api/user/listUser.json', // 查询用户列表
  exportUser: '/car/v1/api/user/export.json', // 用户导出
  pageUser: '/car/v1/api/user/pageUser.json', // 分页查询用户列表
  saveClientUser: '/car/v1/api/user/saveClientUser.json', // 新增客户
  updateClientUser: '/car/v1/api/user/updateClientUser.json', // 修改客户
  deleteClientUser: '/car/v1/api/user/deleteClientUser.json', // 删除客户
  updateUserPassword: '/car/v1/api/user/updateUserPassword.json', // 修改用户密码
  resetUserPassword: '/car/v1/api/user/resetUserPassword.json', // 重置用户密码
  listUserGroup: '/car/v1/api/user/listUserGroup.json', // 查询用户绑定的车组
  bindUserGroup: '/car/v1/api/user/bindUserGroup.json', // 用户绑定车组
  getUser: '/car/v1/api/user/getUser.json', //单个查询用户
  searchUser: "/car/v1/api/user/searchUser.json", // 模糊查询用户
  pageRole: "/car/v1/api/role/page.json", // 分页查询角色
  getRole: "/car/v1/api/role/get.json", // 单个查询角色
  deleteRole: "/car/v1/api/role/delete.json", // 删除角色
  updateRole: "/car/v1/api/role/update.json", // 修改角色
  updateResource: "/car/v1/api/role/updateResource.json", // 分配角色资源
  addRole: "/car/v1/api/role/add.json", // 新增角色
  resourceTree: "/car/v1/api/resource/tree.json", // 树形查询用户拥有的资源
  exportVehicleByGroupRds: "/car/v1/api/vehicle/exportVehicleByGroupRds.json", // 导出车组下所有车辆
  getImportVehicleData: '/car/v1/api/importVehicle/getImportVehicleData.json', //获取中间表的错误数据
  delImportVehicleData: '/car/v1/api/importVehicle/delImportVehicleData.json', //删除中间标的所有数据
  updateErrorImportVehicle: '/car/v1/api/importVehicle/updateErrorImportVehicle.json', //批量修改错误信息
  insertBatchVeh: '/car/v1/api/importVehicle/insertBatchVeh.json', //没有错误数数把数据全部插入表格中
  getExportFile: '/car/v1/api/importVehicle/getExportFile.json', //获取批量导入模板
  importVehicle: '/car/v1/api/importVehicle/importVehicle.json', //上传批量导入的文件
}
export default beforeUrl;