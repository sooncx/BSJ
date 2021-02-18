import { GET, POST, exportFile, POSTBody } from "../apiFn";
import url from '../url';
import APIType from "./type";

export default {
  /**
   * 首页统计数据
   */
  pageHomePageOne: (): Promise<APIType.pageHomePageOneRes> =>
    GET(url.pageHomePageOne),
    pageHomePageTwo: (): Promise<APIType.pageHomePageTwoRes> =>
    GET(url.pageHomePageTwo),

  /**
   * 离线统计
   */
  pageOffOnline: (params: any): Promise<any> =>
    POST(url.pageOffOnline, params),

  /**
   * 离线统计数据导出
   */
  exportOffOnline: (params: any): void =>
    exportFile(url.exportOffOnline, params),

  /**
    * 添加关注度
    */
  AddUserConcern: (params: any): Promise<any> => POSTBody(url.AddUserConcern, params),

  /**
   * 清除关注度
   */
  DelUserConcern: (params: any): Promise<any> => GET(url.DelUserConcern, params),
}