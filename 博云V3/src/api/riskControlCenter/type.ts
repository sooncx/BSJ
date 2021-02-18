interface Res {
  msg: string;
  flag: number;
}

interface Param {
  /**
   * 当前页
   */
  pageNumber: number;
  /**
   * 每页条数
   */
  pageSize: number;
}

interface ResPage {
  /**
   * 当前页
   */
  pageNumber: number;
  /**
   * 每页条数
   */
  pageSize: number;
  /**
   * 总数
   */
  total: number;
}

namespace APIType {
  /**
   * 获取风控报警
   */
  export type pageHomePageOneRes = {
    obj: {
      /**
       * 超长停车数量
       */
      longStopNum: number;
      /**
       * 多设备离线数量
       */
      carVehOfflineNum: number;
    }
  } & Res;

  /**
   * 获取风控报警
   */
  export type pageHomePageTwoRes = {
    obj: {
      /**
       * 异常停留
       */
      stopNum: number;
      /**
       * 区域报警
       */
      regionNum: number;
      /**
       * 出省报警
       */
      superNum: number;
      /**
       * 超速报警
       */
      speedNum: number;
      /**
       * 重点关注
       */
      concernList: number;
      /**
       * 紧急报警
       */
      urgentNum: number;
      /**
       * 拆除报警
       */
      removeNum: number;
      /**
       * 分离报警
       */
      separateNum: number;
      /**
       * 其他报警
       */
      other: number;
      /**
       * 结清数
       */
      settleNum?: number;
      /**
       * 掉电报警
       */
      electricNum: number;
      /**
       * 二押点报警
       */
      twoNum: number;
    }
  } & Res;

  /**
   * 获取风控报警
   */
  export type pageHomePageRiskRes = {
    obj: {
      /**
       * 风险总数量
       */
      riskTotalNum: number;
    }
  } & Res;


  /**
   * 查询重点关注详情
   */
  export type pageHomeUserConcernParam = Param;

  /**
   * 查询重点关注详情
   */
  export type pageHomeUserConcernRes = {
    obj: {
      /**
       * 表格数据
       */
      data: {
        /**
         * 车牌
         */
        plate?: string;
        /**
         * 车辆状态0：离线1：行驶2：停车3：从未上线，默认从未上线，4：过期
         */
        state?: number;
        /**
         * 最后上传数据
         */
        devTime?: string;
        /**
         * 状态持续时间
         */
        stateTime?: string;
        /**
         * 定位状态，默认不定位(0：不定位，1：GPS，2：WIFI，3：多基站，4：单基站)
         */
        pos?: number;
        /**
         * 报警字符串
         */
        alarmStr?: string;
        /**
         * 当前经度
         */
        lon?: number;
        /**
         * 当前纬度
         */
        lat?: number;
        /**
         * 关注级别
         */
        concernLevel?: number;
        /**
         * 车组id
         */
        groupId?: number;
        /**
         * 车辆id
         */
        vehId?: number;
        /**
         * 速度
         */
        speed?: number;
        /**
         * sim卡
         */
        sim?: string;
        /**
         * 设备类型
         */
        terminalType?: string;
        /**
         * 设备号
         */
        terminalNo?: string;
        /**
         * iccid
         */
        iccid?: string;
        /**
         * 激活时间
         */
        activationTme?: string;
        /**
         * 安装时间
         */
        installDate?: string;
        /**
         * 车主
         */
        owner?: string;
        /**
         * 车组名称
         */
        groupName?: string;
        /**
         * 备注
         */
        nowRemark?: string;
        /**
         * 当前地址
         */
        address?: string;
        /**
         * 车架号
         */
        frameNo?: string;
        /**
         * 是否结清
         */
        settle?: number;
        /**
         * 当前地址
         */
        nowAddress?: string;
        /**
         * 关注备注
         */
        remark?: string;
      }[]
    } & ResPage;
  } & Res;

  /**
   * 查询多设备离线
   */
  export type pageRelatedOfflineParam = Param;

  /**
   * 查询多设备离线
   */
  export type pageRelatedOfflineRes = {
    obj: {
      /**
       * 表格数据
       */
      data: {
        /**
         * 车辆设备id
         */
        vehicleId: number;
        /**
         * 车牌
         */
        plate: string;
        /**
         * 车辆状态
         */
        isOnline: string;
        /**
         * 纬度
         */
        lat: number;
        /**
         * 经度
         */
        lon: number;
        /**
         * 车辆状态标记(在线是0，无线设备离线是1，有线设备离线2，从未上线3,已过期4)
         */
        vehicleFlag: number;
        /**
         * 0车牌 1车架号
         */
        carPlate: number;
        /**
         * 车组ID
         */
        groupId: number;
        /**
         * 车组名
         */
        groupName: string;
        /**
         * 
         */
        carType: number;
        /**
         * 回传模式
         */
        tag: number;
        /**
         * 回传模式设置的值
         */
        schemaValue: string;
        /**
         * 排序时间
         */
        sortTime: number;
        /**
         * 
         */
        carId: string;
      }[]
    } & ResPage;
  } & Res;

  /**
   * 查询超长停车
   */
  export type pageLongStopParam = {
    /**
     * 开始时间(单位天)
     */
    startDay: number;
    /**
     * 结束时间(单位天)
     */
    endDay: number;
  } & Param;

  /**
   * 查询超长停车
   */
  export type pageLongStopRes = {
    obj: {
      data: {
        /**
         * 车组id
         */
        groupId: number;
        /**
         * 车辆id
         */
        vehicleId: number;
        /**
         * 车组名称
         */
        groupName: string;
        /**
         * 经度
         */
        lon: number;
        /**
         * 纬度
         */
        lat: number;
        /**
         * 离线时长
         */
        timeInterval: string;
        /**
         * 车架号
         */
        frameNo: string;
        /**
         * 备注
         */
        nowRemark: string;
        /**
         * SIM卡号
         */
        sim: string;
        /***
         * 设备类型
         */
        terminalType: string;
        /**
         * 设备号
         */
        terminalNo: string;
        /**
         * iccid
         */
        iccid: string;
        /**
         * 激活时间
         */
        activationTme: string;
        /**
         * 安装时间
         */
        installDate: string;
        /**
         * 车组
         */
        owner: string;
        /**
         * 关注级别(1:高,2:中,3:低)
         */
        concernLevel: number;
        /**
         * 离线时长装成天提示语
         */
        displayTime: string;
      }[]
    } & ResPage
  } & Res;

  /**
   * 查询风险车辆详情
   */
  export type pageRiskAnalysisParam = {
    /**
     * 	1是设备拆除风险，2是生活轨迹异常，3是省外异常
     */
    type: number;
  } & Param;

  /**
   * 查询风险车辆详情
   */
  export type pageRiskAnalysisRes = {
    obj: {
      data: {
        /**
         * 报警名称
         */
        alarmName: string;
        /**
         * 报警时间
         */
        alarmTime: string;
        /**
         * 报警地址名称
         */
        pathName: string;
        /**
         * 经度
         */
        alarmLon: number;
        /**
         * 纬度
         */
        alarmLat: number;
        /**
         * 车组id
         */
        groupId: number;
        /**
         * 车辆设备id
         */
        vehicleId: number;
        /**
         * 车牌
         */
        plate: string;
        /**
         * 关注等级
         */
        concernLevel: number;
        /**
         * 关注备注
         */
        remark: string;
        /**
         * sim卡
         */
        sim: string;
        /**
         * 设备类型
         */
        terminalType: string;
        /**
         * 设备号
         */
        terminalNo: string;
        /**
         * iccid
         */
        iccid: string;
        /**
         * 激活时间
         */
        activationTme: string;
        /**
         * 安装时间
         */
        installDate: string;
        /**
         * 车主
         */
        owner: string;
        /**
         * 车组名称
         */
        groupName: string;
        /**
         * 备注
         */
        nowRemark: string;
        /**
         * 地址
         */
        address: string;
        /**
         * 当前地址
         */
        nowAddress: string;
        /**
         * 报警地址
         */
        alarmAddress: string;
        /**
         * 车架号
         */
        frameNo: string;
      }[]
    } & ResPage;
  } & Res;

  /**
   * 查询分离拆除掉电二压点出省异常停留区域超速紧急其他报警详情
   */
  export type pageHomePageAlarmInfoParam = {
    /**
     * 0 出省报警
     * 1 区域报警
     * 3 二押点报警
     * 4 异常停留
     * 5 超速报警
     * 6 掉电报警
     * 7 防拆除报警
     * 8 紧急报警
     * 9 其他报警
     * 10 分离报警
     */
    type: string;
  } & Param;

  /**
   * 查询分离拆除掉电二压点出省异常停留区域超速紧急其他报警详情
   */
  export type pageHomePageAlarmInfoRes = {
    obj: {
      /**
       * 表格数据
       */
      data: {
        /**
         * 报警名称
         */
        alarmName: string;
        /**
         * 车牌号
         */
        plate: string;
        /**
         * 车架号
         */
        frameNo: string;
        /**
         * sim卡号
         */
        sim: string;
        /**
         * 设备类型
         */
        terminalType: string;
        /**
         * 设备号
         */
        terminalNo: string;
        /**
         * iccid
         */
        iccid: string;
        /**
         * 激活时间
         */
        activationTme: string;
        /**
         * 安装时间
         */
        installDate: string;
        /**
         * 车主
         */
        owner: string;
        /**
         * 备注
         */
        nowRemark: string;
        /**
         * 报警时间
         */
        alarmTime: string;
        /**
         * 报警地址名称
         */
        pathName: string;
        /**
         * 经度
         */
        lon: number;
        /**
         * 纬度
         */
        lat: number;
        /**
         * 车组id
         */
        groupId: number;
        /**
         * 车辆ID
         */
        vehicleId: number;
        /**
         * 车组名称
         */
        groupName: string;
        /**
         * 关注车辆的等级
         */
        concernLevel: string;
        /**
         * 关注备注
         */
        remark: string;
      }[]
    } & ResPage
  } & Res;
}

export default APIType;
