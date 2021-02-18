import { GET, exportFile, POST } from "../apiFn";
import url from '../url';
import APIType from "./type";

export default {
  /**
   * 查询报警报表
   */
  pageAlarm: (params: APIType.pageAlarmParam): Promise<APIType.pageAlarmRes> =>
  GET(url.pageAlarm, params),

  /**
   * 查询报警明细报表
   */
  listAlarmDetail: (params: APIType.listAlarmDetailParam): Promise<APIType.listAlarmDetailRes> =>
  GET(url.listAlarmDetail, params),

  /**
   * 导出报警数据
   */
  exportAlarm: (params: APIType.pageAlarmParam): Promise<APIType.pageAlarmRes> =>
  GET(url.exportAlarm, params),

  /**
   * 导出报警明细
   */
  exportAlarmDetail: (params: APIType.pageAlarmDetailParam): void =>
  exportFile(url.exportAlarmDetail, params),
  
  /**
   * 离线统计
   */
  pageOffOnline: (params: APIType.pageOffOnlineParam): Promise<APIType.pageOffOnlineRes> =>
  POST(url.pageOffOnline, params),

  /**
   * 离线统计数据导出
   */
  exportOffOnline: (params: APIType.pageOffOnlineParam): void =>
  exportFile(url.exportOffOnline, params),

  /**
   * 行车统计查询
   */
  pageAccReport: (params: APIType.pageAccReportParam): Promise<APIType.pageAccReportRes> =>
  POST(url.pageAccReport, params),

  /**
   * 行车统计明细查询
   */
  pageAccDetail: (params: APIType.pageAccDetailParam): Promise<APIType.pageAccDetailRes> =>
  POST(url.pageAccDetail, params),

  /**
   * 行车统计导出
   */
  exportAccReport: (params: APIType.pageAccReportParam): void =>
  exportFile(url.exportAccReport, params),

  /**
   * 行车统计明细导出
   */
  exportPageAccDetail: (params: APIType.exportPageAccDetailParam): void =>
  exportFile(url.exportPageAccDetail, params),

  /**
   * 停车报表查询
   */
  pageNowStopRePort: (params: APIType.pageNowStopRePortParam): Promise<APIType.pageNowStopRePortRes> =>
  POST(url.pageNowStopRePort, params),

  /**
   * 停车报表导出
   */
  exportNowStopRePort: (params: APIType.pageNowStopRePortParam): void =>
  exportFile(url.exportNowStopRePort, params),

  /**
   * 经常停留点查询
   */
  pageStopRePort: (params: APIType.pageStopRePortParam): Promise<APIType.pageStopRePortRes> =>
  POST(url.pageStopRePort, params),

  /**
   * 停车报表导出
   */
  exportStopRePort: (params: APIType.pageStopRePortParam): void =>
  exportFile(url.exportStopRePort, params),

  /**
   * 剩余电量查询
   */
  pageEnergyReport: (params: APIType.pageEnergyReportParam): Promise<APIType.pageEnergyReportRes> =>
  POST(url.pageEnergyReport, params),

  /**
   * 剩余电量导出
   */
  exportEnergyReport: (params: APIType.pageEnergyReportParam): void =>
  exportFile(url.exportEnergyReport, params),

  /**
   * 查询里程报表
   */
  pageMileage: (params: APIType.pageMileageParam): Promise<APIType.pageMileageRes> =>
  POST(url.pageMileage, params),

  /**
   * 里程导出
   */
  exportMileage: (params: APIType.pageMileageParam): Promise<APIType.pageMileageRes> =>
  GET(url.exportMileage, params),

  /**
   * 查询里程报表明细
   */
  listMileageDetail: (params: APIType.listMileageDetailParam): Promise<APIType.listMileageDetailRes> =>
  POST(url.listMileageDetail, params),

  /**
   * 查询里程报表详情导出
   */
  exportMileageDetail: (params: APIType.exportMileageDetailParam): void =>
  exportFile(url.exportMileageDetail, params),

  /**
   * 总里程查询
   */
  pageTotalMileageReport: (params: APIType.pageTotalMileageReportParam): Promise<APIType.pageTotalMileageReportRes> =>
  POST(url.pageTotalMileageReport, params),

  /**
   * 总里程导出
   */
  exportTotalMileageReport: (params: APIType.pageTotalMileageReportParam): void =>
  exportFile(url.exportTotalMileageReport, params),

  /**
   * 指令查询
   */
  pageCommandReport: (params: APIType.pageCommandReportParam): Promise<APIType.pageCommandReportRes> =>
  POST(url.pageCommandReport, params),

  /**
   * 指令查询导出
   */
  exportCommandReport: (params: APIType.pageCommandReportParam): void =>
  exportFile(url.exportCommandReport, params),

  /**
   * 操作记录
   */
  pageOperRecord: (params: APIType.pageOperRecordParam): Promise<APIType.pageOperRecordRes> =>
  POST(url.pageOperRecord, params),

  /**
   * 操作记录导出
   */
  exportOperRecord: (params: APIType.pageOperRecordParam): void =>
  exportFile(url.exportOperRecord, params),

  /**
   * 保养报表查询
   */
  pageMaintainReport: (params: APIType.pageMaintainReportParam): Promise<APIType.pageMaintainReportRes> =>
  POST(url.pageMaintainReport, params),

  /**
   * 保养报表导出
   */
  exportMaintainReport: (params: APIType.pageMaintainReportParam): void =>
  exportFile(url.exportMaintainReport, params),

  /**
   * 保险报表查询
   */
  pageInsuranceReport: (params: APIType.pageInsuranceReportParam): Promise<APIType.pageInsuranceReportRes> =>
  POST(url.pageInsuranceReport, params),

  /**
   * 保险报表导出
   */
  exportInsuranceReport: (params: APIType.pageInsuranceReportParam): void =>
  exportFile(url.exportInsuranceReport, params),

  /**
   * OBD报表查询
   */
  pageOBDAlarmList: (params: APIType.pageOBDAlarmListParam): Promise<APIType.pageOBDAlarmListRes> =>
  GET(url.pageOBDAlarmList, params),

  /**
   * 物流锁报警记录查询
   */
  pageBluetoothAlarmReport: (params: APIType.pageBluetoothAlarmReportParam): Promise<APIType.pageBluetoothAlarmReportRes> =>
  POST(url.pageBluetoothAlarmReport, params),

  /**
   * 物流锁报警记录导出
   */
  exporBluetoothAlarmReport: (params: APIType.pageBluetoothAlarmReportParam): void =>
  exportFile(url.pageBluetoothAlarmReport, params),

  /**
   * 物流锁报警记录查询
   */
  pageUnlockHistory: (params: APIType.pageUnlockHistoryParam): Promise<APIType.pageUnlockHistoryRes> =>
  POST(url.pageUnlockHistory, params),

  /**
   * 物流锁报警记录导出
   */
  exporUnlockHistory: (params: APIType.pageUnlockHistoryParam): void =>
  exportFile(url.pageUnlockHistory, params),
}