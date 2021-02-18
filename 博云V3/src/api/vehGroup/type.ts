interface Res {
  msg: string;
  flag: number;
}

namespace APIType {

  /**
   * 车辆搜索
   */
  export type searchVehicleParam = {
    /**
     * 模糊搜索名称
     */
    plate: string,
    /**
     * 搜索类型
     */
    searchType: number
  };

  /**
   * 车辆搜索
   */
  export type searchVehicleRes = {
    /**
     * 车辆列表
     */
    obj: {
      data: {
        vehicleId: number;
        type: number;
        terminalType: string;
        sortType: number;
        sim: string;
        plate: string;
        owner: string;
        groupId: number;
        fullType: number;
        frameNo: string;
        terminalNo: string;
      }[]
    }
  } & Res;

  /**
   * 加载车组数据
   */
  export type loadGroupsParam = {
    /**
     * 是否添加重点关注 无线设备追车车组
     */
    concernNeed?: boolean,
    sessionId?: string
  }

  /**
   * 加载车组数据
   */
  export type loadGroupsRes = {
    obj: {
      data: {
        /**
         * 当前车组数量
         */
        an: number;
        /**
         * 车组ID
         */
        gi: number;
        /**
         * 父级Id
         */
        pi: number;
        /**
         * 车组车辆总数
         */
        tt: number;
        /**
         * 车组名
         */
        gn: string;
      }[],
      /**
       * 请求时间
       */
      gmt: string
    }
  } & Res;

  /**
   * 根据车组ID获取车辆列表
   */
  export type getVehiclesByGroupRdsParam = {
    groupId: number
  }

  /**
   * 根据车组ID获取车辆列表
   */
  export type getVehiclesByGroupRdsRes = {
    obj: {
      data: {
        formatTime: string;
        frameNo: string;
        gpsTime: string;
        installDate: string;
        nowRemark: string;
        plate: string;
        sim: string;
        terminalNo: string;
        terminalType: string;
        vehicleId: number;
        vehicleStatus: number;
      }[],
      pageNumber: number;
      pageSize: number;
      total: number;
    }
  } & Res;
}

export default APIType