import { GET, exportFile, POST, POSTBody, JSONP } from "../apiFn";
import url from '../url';
import APIType from "./type";

export default {
   /**
* 获取车辆数据
*/
   loadVehicles: (params: any): Promise<any> => GET(url.loadVehicles, params),
   /**
* 获取车辆分类统计数据
*/
   GetGroupVehNum: (params: any): Promise<any> => GET(url.GetGroupVehNum, params),
   /**
    * 区域查车
    */
   SearchVehicleInArea: (params: any): Promise<any> => GET(url.SearchVehicleInArea, params),
   /**
    * 区域查车导出
   */
   exportVehicleInArea: (params: any): void => exportFile(url.exportVehicleInArea, params),
   /**
    * 获取保险明细和险种明细
    */
   GetInsuranceList: (params: any): Promise<any> => GET(url.GetInsuranceList, params),
   /**
    * 查询多边形围栏
    */
   getPathIdByVehicleId: (params: any): Promise<any> => GET(url.getPathIdByVehicleId, params),
   /**
    * 围栏解绑
    */
   removeBound: (params: any): Promise<any> => POSTBody(url.removeBound, params),
   /**
    * 查询位置点
    */
   SelectPointByUserId: (params: any): Promise<any> => GET(url.SelectPointByUserId, params),
   /**
    * 添加位置点
    */
   AddPoint: (params: any): Promise<any> => POSTBody(url.AddPoint, params),

   /**
    * 获取关联车辆
    */
   GetRealTimeByVehListState: (params: any): Promise<any> => GET(url.GetRealTimeByVehListState, params),
   /**
    * 删除位置点
    */
   DeletePoint: (params: any): Promise<any> => GET(url.DeletePoint, params),
   /**
    * 查询围栏
    */
   getArea: (params: any): Promise<any> => GET(url.getArea, params),
   /**
    * 添加多边形围栏
    */
   addPath: (params: any): Promise<any> => POSTBody(url.addPath, params),
   /**
    * 删除围栏
    */
   delPath: (params: any): Promise<any> => GET(url.delPath, params),
   /**
    * 修改围栏
    */
   updatePath: (params: any): Promise<any> => POSTBody(url.updatePath, params),
   /**
    * 根据围栏id查询围栏绑车数据
    */
   getVehicleInfo: (params: any): Promise<any> => GET(url.getVehicleInfo, params),
   /**
    * 围栏绑车
    */
   bindVehicleToPath: (params: any): Promise<any> => POSTBody(url.bindVehicleToPath, params),
   /**
    * 查询圆形围栏数据
    */
   GetVehicleCircle: (params: any): Promise<any> => GET(url.GetVehicleCircle, params),
   /**
    * 设置圆形围栏
    */
   SetVehicleCircle: (params: any): Promise<any> => GET(url.SetVehicleCircle, params),
   /**
    * 添加圆形围栏
    */
   saveRoundFence: (params: any): Promise<any> => POSTBody(url.saveRoundFence, params),
   /**
    * 修改圆形围栏
    */
   updateRoundFence: (params: any): Promise<any> => POSTBody(url.updateRoundFence, params),
   /**
    * 删除圆形围栏
    */
   deleteRoundFence: (params: any): Promise<any> => GET(url.deleteRoundFence, params),
   /**
    * 停留点查询
    */
   GetVehicleStayPoint: (params: any): Promise<any> => GET(url.GetVehicleStayPoint, params),
   /**
    * 添加停留点
    */
   saveStoppingPoint: (params: any): Promise<any> => GET(url.saveStoppingPoint, params),
   /**
    * 修改停留点
    */
   updateStoppingPoint: (params: any): Promise<any> => GET(url.updateStoppingPoint, params),
   /**
    * 删除停留点
    */
   deleteStoppingPoint: (params: any): Promise<any> => GET(url.deleteStoppingPoint, params),
   /**
    * 查询二押点
    */
   GetTwoChargeByUserId: (params: any): Promise<any> => GET(url.GetTwoChargeByUserId, params),
   /**
    * 添加二押点
    */
   addTwoCharge: (params: any): Promise<any> => POSTBody(url.addTwoCharge, params),
   /**
    * 删除二押点
    */
   deleteTwoCharge: (params: any): Promise<any> => GET(url.deleteTwoCharge, params),
   /**
    * 查询市对应云端二押点数据
    */
   QueryMortgagePoint: (params: any): Promise<any> => GET(url.QueryMortgagePoint, params),
   /**
    * 二押点已绑车辆数据
    */
   getVehicleChargeByUserId: (params: any): Promise<any> => GET(url.getVehicleChargeByUserId, params),
   /**
    * 根据车组查询车组下车辆
    */
   getVehicleInfoByGroupList: (params: any): Promise<any> => GET(url.getVehicleInfoByGroupList, params),
   /**
    * 二押点绑车，可批量
    */
   UpdateOrAddVehicleCharge: (params: any): Promise<any> => GET(url.UpdateOrAddVehicleCharge, params),
   /**
    * 二押点取消绑车
    */
   deleteVehicleCharge: (params: any): Promise<any> => GET(url.deleteVehicleCharge, params),
   /**
    * 获取录音列表
    */
   AudioInfoList: (params: any): Promise<any> => GET(url.AudioInfoList, params),
   /**
    * 关注备注列表
    */
   getRemarkList: (params: any): Promise<any> => GET(url.getRemarkList, params),
   /**
    * 添加关注
    */
   saveVehicleConcern: (params: any): Promise<any> => POSTBody(url.saveVehicleConcern, params),
   /**
    * 清除关注
    */
   deleteVehicleConcern: (params: any): Promise<any> => GET(url.deleteVehicleConcern, params),
   /**
    * 查询车辆绑定省市区
    */
   getAdminRegion: (params: any): Promise<any> => GET(url.getAdminRegion, params),
   /**
    * 修改车辆绑定省市区
    */
   bindAdminRegion: (params: any): Promise<any> => GET(url.bindAdminRegion, params),
   /**
    * 解除车辆绑定省市区
    */
   deleteAdminRegion: (params: any): Promise<any> => GET(url.deleteAdminRegion, params),
   /**
    * 查询车组绑定省市区
    */
   getAdminRegionGroup: (params: any): Promise<any> => GET(url.getAdminRegionGroup, params),
   /**
    * 修改车组绑定省市区
    */
   listAdminRegionGroup: (params: any): Promise<any> => POSTBody(url.listAdminRegionGroup, params),
   /**
    * 解除车组绑定省市区
    */
   deleteAdminRegionGroup: (params: any): Promise<any> => GET(url.deleteAdminRegionGroup, params),
   /**
    * 获取车辆关联车辆和结清列表
    */
   querySettleDetail: (params: any): Promise<any> => GET(url.querySettleDetail, params),
   /**
    * 结清/结清撤回
    */
   updateSettleStatus: (params: any): Promise<any> => POST(url.updateSettleStatus, params),
   /**
    * 获取保养数据
    */
   getMaintain: (params: any): Promise<any> => GET(url.getMaintain, params),
   /**
    * 设置保养信息
    */
   maintenanceSettings: (params: any): Promise<any> => POSTBody(url.maintenanceSettings, params),
   /**
    * 获取车辆保险信息
    */
   GetInsuranceDate: (params: any): Promise<any> => GET(url.GetInsuranceDate, params),
   /**
    * 设置车辆保险信息
    */
   insertInsuranceDate: (params: any): Promise<any> => POSTBody(url.insertInsuranceDate, params),
   /**
    * 查询监控中心报警数据
    */
   queryAlarm: (params: any): Promise<any> => GET(url.queryAlarm, params),
   /**
    * 报警处理
    */
   processAlarm: (params: any): Promise<any> => POSTBody(url.processAlarm, params),
   /**
    * 获取设备统计数量
    */
   getUserVehicleCount: (): Promise<any> => GET(url.getUserVehicleCount),
   /**
    * 指令下发
    */
   sendCommandDown: (params: any): Promise<any> => POSTBody(url.sendCommandDown, params),
   /**
    * 车组指令下发
    */
   groupDown: (params: any): Promise<any> => POSTBody(url.groupDown, params),
   /**
    * 查询无线回传
    */
   getPassBack: (params: any): Promise<any> => GET(url.getPassBack, params),
   /**
    * 查询车组无线回传
    */
   getGroupPassBack: (params: any): Promise<any> => GET(url.getGroupPassBack, params),
   /**
    * 查询工作模式
    */
   getWorkMode: (params: any): Promise<any> => GET(url.getWorkMode, params),
   /**
    * 查询照片库
    */
   pageImage: (params: any): Promise<any> => GET(url.pageImage, params),
   /**
    * ocar出入库
    */
   queryInOutVehicleReportList: (params: any): Promise<any> => GET(url.queryInOutVehicleReportList, params),
   /**
    * 导出Ocar出入库数据
    */
   exportInOutVehicleReport: (params: any): void => exportFile(url.exportInOutVehicleReport, params),
   /**
    * OBD数据
    */
   getOBDVehicleInfo: (params: any): Promise<any> => GET(url.getOBDVehicleInfo, params),
   /**
    * 车辆资料关联数据
    */
   getVehicleDateByPlate: (params: any): Promise<any> => GET(url.getVehicleDateByPlate, params),
   /**
    * 车辆资料关联数据
    */
   realVideoReq: (params: any): Promise<any> => POSTBody(url.realVideoReq, params),
   /**
    * 车辆资料关联数据
    */
   realControlReq: (params: any): Promise<any> => POSTBody(url.realControlReq, params),
   /**
    * 录像回放请求
    */
   replayReq: (params: any): Promise<any> => POSTBody(url.replayReq, params),
   /**
    * 录像回放控制请求
    */
   replayControlReq: (params: any): Promise<any> => POSTBody(url.replayControlReq, params),
   /**
    * 资源目录请求
    */
   replayResourceReq: (params: any): Promise<any> => POSTBody(url.replayResourceReq, params),
   /**
    * 查询资源列表结果
    */
   queryResourceResponse: (params: any): Promise<any> => POSTBody(url.queryResourceResponse, params),
}