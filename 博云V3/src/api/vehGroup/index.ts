import { GET } from "../apiFn";
import APIType from "./type";

export default {
  /**
   * 车辆搜索
   */
  searchVehicle: (params: APIType.searchVehicleParam): Promise<APIType.searchVehicleRes> =>
  GET('/car/v1/api/vehicle/searchBindingOfVehicles.json', params),

  /**
   * 获取车组
   */
  loadGroups: (params: APIType.loadGroupsParam): Promise<APIType.loadGroupsRes> =>
  GET('/car/v1/api/monitor/loadGroups', params),

  /**
   * 根据车组ID获取车辆列表
   */
  getVehiclesByGroupRds: (params: APIType.getVehiclesByGroupRdsParam): Promise<APIType.getVehiclesByGroupRdsRes> =>
  GET('/car/v1/api/vehicle/listVehicleByGroupRds.json', params),

}
