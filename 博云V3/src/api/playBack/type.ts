interface Res {
  msg: string;
  flag: number;
}

namespace APIType {
  /**
   * 获取轨迹数据
   */
  export type listVehTrackPointParam = {
    /**
     * 静止时间
     */
    filterTime: number;
    /**
     * 间隔时间(分钟)
     */
    spaceTime?: number;
    /**
     * 速度
     */
    speed?: number;
    /**
     * 车辆ID
     */
    vehicleId: number;
    /**
     * 车牌号
     */
    plate: string;
    /**
     * 开始时间
     */
    beginTime: string;
    /**
     * 结束时间
     */
    endTime: string;
  };

  /**
   * 获取轨迹数据
   */
  export type listVehTrackPointRes = {
    obj: {
      data: {
        /**
         * 车辆Id
         */
        vehicleId: number;
        /**
         * 车组Id
         */
        groupId: number;
        /**
         * 车组名称
         */
        groupName: string;
        /**
         * 超长待机类型
         * 0超长待机加有线
         * 1超长待机
         */
        longStayTer: number;
        /**
         * 车牌号
         */
        plate: string;
        /**
         * 终端类型
         */
        terminalType: string;
        /**
         * 轨迹点
         */
        trackList: {
          /**
           * 纬度lat
           */
          a: number;
          /**
           * 是否是补传数据
           * 0：实时数据
           * 1：补传数据
           */
          b: number;
          /**
           * 方向direct
           */
          d: number;
          /**
           * 状态state：ACC（1关，0开）
           */
          e: number;
          /**
           * 里程mileage
           */
          g: number;
          /**
           * 是否定位isStop（1是，0否）
           */
          i: number;
          /**
           * 停车时长stopTimes
           */
          m: number;
          /**
           * 经度lon
           */
          o: number;
          /**
           * 速度speed
           */
          s: number;
          /**
           * 终端上的时间time
           */
          t: string;
          /**
           * GPS数据上报类型,0x00定时上传0,0x01定距上传1,0x02拐点上传2,0x03ACC状态改变上传3,0x04静止最后位置上传4
           */
          u: number;
          /**
           * 行停状态，1行2停,3离线
           */
          x: number;
        }[]
      },
      /**
       * 总数
       */
      total: number;
    }
  } & Res;

  /**
   * 获取报警点信息
   */
  export type listAlarmInfoParam = {
    /**
     * 报警类型
     */
    alarmTypes: string;
    /**
     * 车辆Id
     */
    vehicleId: number;
    /**
     * 开始时间
     */
    startTime: string;
    /**
     * 结束时间
     */
    endTime: string;
  }

  /**
   * 获取报警点信息
   */
  export type listAlarmInfoRes = {
    obj: {
      /**
       * 当前页
       */
      pageNumber: number;
      /**
       * 页码大小
       */
      pageSize: number;
      /**
       * 总数
       */
      total: number;
      /**
       * 表格数据
       */
      data: {
        /**
         * 报警Id
         */
        alarmId: string;
        /**
         * 车辆id
         */
        vehicleId: number;
        /**
         * 车组id
         */
        groupId: number;
        /**
         * 车牌
         */
        plate: string;
        /**
         * 报警类型
         */
        type: string;
        /**
         * 报警类型多个 ,String
         */
        alarmTypeList: string;
        /**
         * 开始时间
         */
        timeBegin: string;
        /**
         * 开始经度
         */
        lonBegin: number;
        /**
         * 开始纬度
         */
        latBegin: number;
        /**
         * 开始速度
         */
        speedBegin: number;
        /**
         * 开始里程
         */
        mileageBegin: number;
        /**
         * 开始方向
         */
        directBegin: number;
        /**
         * 拓展位数据
         */
        data: string;
        /**
         * 结束时间
         */
        timeEnd: string;
        /**
         * 结束经度
         */
        lonEnd: number;
        /**
         * 结束纬度
         */
        latEnd: number;
        /**
         * 结束速度
         */
        speedEnd: number;
        /**
         * 结束里程
         */
        mileageEnd: number;
        /**
         * 结束方向
         */
        directEnd: number;
        /**
         * 插入时间
         */
        insertTime: string;
        /**
         * 更新时间
         */
        updateTime: string;
        /**
         * 处理结果
         */
        result: string;
        /**
         * 处理备注
         */
        remark: string;
        /**
         * 处理时间
         */
        proTime: string;
        /**
         * 处理帐号
         */
        userName: string;
        /**
         * 处理的联系人
         */
        contact: string;
        /**
         * 处理的联系电话
         */
        phone: string;
        /**
         * 车组名称
         */
        groupName: string;
        /**
         * 地址名称
         */
        pathName: string;
        /**
         * 报警次数
         */
        alarmNum: number;
        /**
         * 时间
         */
        time: number;
        /**
         * 图片列表
         */
        photoList: string;
        /**
         * 设备号
         */
        terminalNo: string;
      }[]
    }
  } & Res;

  /**
   * 获取经常停留点
   */
  export type pageQueryStopReportParam = {
    /**
     * 车辆Id
     */
    vehicleId: number;
    /**
     * 开始时间
     */
    runStopBeginTime: string;
    /**
     * 结束时间
     */
    runStopEndTime: string;
    /**
     * 状态，1行，2停
     */
    state?: number;
    /**
     * 间隔时间(分钟)
     */
    spaceTime: number;
    /**
     * 
     */
    longStay: number;
    /**
     * 当前页
     */
    pageNumber: number;
    /**
     * 每页条数
     */
    pageSize: number;
  }

  /**
   * 获取经常停留点
   */
  export type pageQueryStopReportRes = {
    obj: {
      /**
       * 当前页
       */
      pageNumber: number;
      /**
       * 页码大小
       */
      pageSize: number;
      /**
       * 总数
       */
      total: number;
      /**
       * 表格数据
       */
      data: {
        /**
         * 车辆数据
         */
        dvehicleInfo: {
          /**
           * 车辆Id
           */
          vehicleId: number;
          /**
           * 车牌
           */
          plate: string;
          /**
           * 终端编号
           */
          terminalNo: string;
          /**
           * 终端类型
           */
          terminalType: string;
          /**
           * 车组id
           */
          groupId: number;
          /**
           * 车组名称
           */
          groupName: string;
          /**
           * 车辆过期时间
           */
          expireDate: string;
          /**
           * 激活时间
           */
          activationTme: string;
        },
        /**
         * 停留点
         */
        newRunStopReportDTOS: {
          /**
           * 开始纬度latBegin
           */
          aB: number;
          /**
           * 结束纬度latEnd
           */
          aE: number;
          /**
           * 行停状态state，0是没有，1是行2是停
           */
          e: number;
          /**
           * 次数
           */
          n: number;
          /**
           * 开始经度lonBegin
           */
          oB: number;
          /**
           * 结束经度lonEnd
           */
          oE: number;
          /**
           * 持续时间spaceTime
           */
          sT: string;
          /**
           * 报表集合 ,Collection
           */
          details: {
            num: number;
            spaceTime: number;
            time: string
          }[]
          /**
           * 时间详情 ,String
           */
          timeDetails: string[]
        }[]
      }
    }
  } & Res;

  /**
   * 查询多边形围栏
   */
  export type queryPolygonalFenceParam = {
    /**
     * 车辆ID
     */
    vehicleId: number;
  }

  /**
   * 查询多边形围栏
   */
  export type queryPolygonalFenceRes = {
    obj: {
      /**
       * 多边形经纬度点
       */
      pointList: {
        oriLat: number;
        oriLon: number;
        pathId: number;
        pointId: number;
      }[];
      belongUser: boolean;
      param: number;
      pathId: number;
      pathName: string;
      pathType: number;
      settingTime: number;
      userId: number;
    }[]
  } & Res;

  /**
   * 获取圆形围栏
   */
  export type queryRoundFenceParam = {
    /**
     * 车辆ID
     */
    vehicleId: number;
  }

  /**
   * 获取圆形围栏
   */
  export type queryRoundFenceRes = {
    obj: {
      /**
       * 纬度
       */
      lat: number;
      /**
       * 经度
       */
      lon: number;
      /**
       * 半径
       */
      radii: number;
    }
  } & Res;

  /**
   * 获取下载列表框
   */
  export type listDownloadInfoRes = {
    obj: {
      /**
       * 列表名称
       */
      name: string;
      /**
       * 排序编号
       */
      sortNum: number;
      /**
       * 文件类型
       */
      type?: string;
    }[]
  } & Res;
}

export default APIType;
