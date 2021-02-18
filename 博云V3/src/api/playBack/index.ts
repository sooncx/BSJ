import { GET, POST, exportFile } from "../apiFn";
import url from '../url';
import APIType from "./type";

export default {
  /**
   * 获取轨迹数据
   */
  listVehTrackPoint: (params: APIType.listVehTrackPointParam): Promise<APIType.listVehTrackPointRes> =>
  GET(url.listVehTrackPoint, params),

  /**
   * 获取报警点信息
   */
  listAlarmInfo: (params: APIType.listAlarmInfoParam): Promise<APIType.listAlarmInfoRes> =>
  GET(url.listAlarmInfo, params),

  /**
   * 获取经常停留点
   */
  pageQueryStopReport: (params: APIType.pageQueryStopReportParam): Promise<APIType.pageQueryStopReportRes> =>
  POST(url.pageQueryStopReport, params),

  /**
   * 获取多边形围栏
   */
  queryPolygonalFence: (params: APIType.queryPolygonalFenceParam): Promise<APIType.queryPolygonalFenceRes> =>
  GET(url.queryPolygonalFence, params),

  /**
   * 获取圆形围栏
   */
  queryRoundFence: (params: APIType.queryRoundFenceParam): Promise<APIType.queryRoundFenceRes> =>
  GET(url.queryRoundFence, params),

  /**
   * 获取下载列表框
   */
  listDownloadInfo: (): Promise<APIType.listDownloadInfoRes> =>
  GET(url.listDownloadInfo),

  /**
   * 简单轨迹导出，2000条以下
   */
  exportSimple: (params: any): void =>
  exportFile(url.exportSimple, params),

  /**
   * 轨迹导出文件，2000条以上
   */
  exportTrack: (params: any): void =>
  exportFile(url.exportTrack, params),

  /**
   * 查询异步导出进度,可用来检测是否存在升级任务
   */
  getProcessInfo: (): Promise<any> =>
  GET(url.getProcessInfo),

  /**
   * 下载文件
   */
  downloadFile: (params: any): void =>
  exportFile(url.downloadFile, params),
}