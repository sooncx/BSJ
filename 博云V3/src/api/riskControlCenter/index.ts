import { GET, POSTBody, exportFile } from "../apiFn";
import url from '../url';
import APIType from "./type";

export default {
  /**
   *  查询风控报警
   */
  pageHomePageOne: (): Promise<APIType.pageHomePageOneRes> =>
  GET(url.pageHomePageOne),
  pageHomePageTwo: (): Promise<APIType.pageHomePageTwoRes> =>
  GET(url.pageHomePageTwo),
  pageHomePageRisk: (): Promise<APIType.pageHomePageRiskRes> =>
  GET(url.pageHomePageRisk),

  /**
   * 查询重点关注详情
   */
  pageHomeUserConcern: (params: APIType.pageHomeUserConcernParam): Promise<APIType.pageHomeUserConcernRes> =>
  GET(url.pageHomeUserConcern, params),

  /**
   * 查询多设备离线
   */
  pageRelatedOffline: (params: APIType.pageRelatedOfflineParam): Promise<APIType.pageRelatedOfflineRes> =>
  GET(url.pageRelatedOffline, params),

  /**
   * 查询分离拆除掉电二压点出省异常停留区域超速紧急其他报警详情
   */
  pageHomePageAlarmInfo: (params: APIType.pageHomePageAlarmInfoParam): Promise<APIType.pageHomePageAlarmInfoRes> =>
  GET(url.pageHomePageAlarmInfo, params),

  /**
   * 查询超长停车报警详情
   */
  pageLongStop: (params: APIType.pageLongStopParam): Promise<APIType.pageLongStopRes> =>
  GET(url.pageLongStop, params),

  /**
   * 查询风险车辆详情
   */
  pageRiskAnalysis: (params: APIType.pageRiskAnalysisParam): Promise<APIType.pageRiskAnalysisRes> =>
  GET(url.pageRiskAnalysis, params),

   /**
    * 添加关注度
    */
   AddUserConcern: (params: any): Promise<any> => POSTBody(url.AddUserConcern, params),

   /**
    * 清除关注度
    */
   DelUserConcern: (params: any): Promise<any> => GET(url.DelUserConcern, params),

   /**
    * 报警导出
    */
   excelAlarmExport: (params: any): void => exportFile(url.excelAlarmExport, params),

  /**
   * 获取保险近近七天的过期数量
   */
  getInsuranceRiskNum: (): Promise<any> => GET(url.getInsuranceRiskNum),

  /**
   * 获取保险近七天的过期数据
   */
  getInsuranceRiskData: (params: any): Promise<any> => GET(url.getInsuranceRiskData, params),

  /**
   * 获取保养风控就七天的数量
   */
  getMaintainRiskNum: (): Promise<any> => GET(url.getMaintainRiskNum),

  /**
   * 获取保养风控七天内的数据
   */
  getMaintainRiskData: (params: any): Promise<any> => GET(url.getMaintainRiskData, params),

   /**
    * 获取当前七天内的续费风控数量
    */
   getRenewRiskNum: (): Promise<any> => GET(url.getRenewRiskNum),

   /**
    * 获取当前七天内的续费风控数据
    */
  getRenewRiskData: (params: any): Promise<any> => GET(url.getRenewRiskData, params),

  /**
   * 获得用户查询停留点设置
   */
  getStopTimeSetting: (): Promise<any> => GET(url.getStopTimeSetting),

  /**
   * 添加停留时间设置值
   */
  addStopTimeSetting: (params: any): Promise<any> => POSTBody(url.addStopTimeSetting, params),
}
