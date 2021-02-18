import url from "./url";
import { POST, GET, exportFile, POSTBody } from "./apiFn";
import APIType from "./type";

export default {
  /**
   * 登录
   */
  login: (params: APIType.loginParam): Promise<APIType.loginRes> =>
    POST(url.login, params),

  /**
   * 
   */
  logout: (): Promise<{ flag: number, msg: string }> =>
    GET(url.logout),

  /**
   * 修改密码
   */
  modifyPwd: (params: any): Promise<any> =>
    POSTBody(url.modifyPwd, params),

  /**
   * 下载列表
   */
  listRecord: (params: any): Promise<any> =>
    POST(url.listRecord, params),

  /**
   * 下载列表导出
   */
  download: (params: any): void =>
    exportFile(url.download, params),

  /**
   * 导出资料
   */
  GetInformation: (): Promise<any> =>
    GET(url.GetInformation),

  /**
   * 获取命令下发报表
   */
  QueryTextUpAndCmdDownInfo: (params: any): Promise<any> =>
    GET(url.QueryTextUpAndCmdDownInfo, params),

  /**
   * 获取省市区数据
   */
  getAreaBaseInfo: (): Promise<APIType.getAreaBaseInfoRes> =>
    GET(url.getAreaBaseInfo),
  /**
   * 获取设备类型
   */
  getTerminalMap: (): Promise<any> => GET(url.getTerminalMap),
  /**
   * 获取权限
   */
  getResource: (): Promise<any> =>
    GET(url.getResource),

  /**
   * 列表查询设备的指令权限
   */
  listTerminalResource: (): Promise<any> =>
    GET(url.listTerminalResource),

  /**
   * 列表查询指令功能
   */
  listCommandResource: (): Promise<any> =>
    GET(url.listCommandResource),

  /**
   * 查询权限默认列表
   */
  listPermission: (): Promise<any> =>
    GET(url.listPermission),

  /**
   * 查询用户权限
   */
  userPermissionList: (): Promise<any> =>
    GET(url.userPermissionList),

  /**
   * 修改用户权限
   */
  updatePermissionList: (params: any): Promise<any> =>
    POSTBody(url.updatePermissionList, params),

  /**
   * 列表查询登录用户所有资源（指令资源、用户设置）
   */
  listAll: (): Promise<any> =>
    GET(url.listAll),
}
