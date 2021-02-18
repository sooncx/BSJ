interface Res {
  msg: string;
  flag: number;
}

namespace APIType {
  /**
   * 获取首页统计数据
   */
  export type pageHomePageOneRes = {
    obj: {
      /**
       * 车辆总数量
       */
      vehNum: number;
      /**
       * 1个月到期
       */
      expiredOneNum: number;
      /**
       * 7天到期
       */
      expiredTwoNum: number;
      /**
       * 3天到期
       */
      expiredThreeNum: number;
      /**
       * 已过期
       */
      expiredFourNum: number;
      /**
       * 无线设备
       */
      wirelessNum: number;
      /**
       * 有线设备
       */
      wiredNum: number;
      /**
       * 具体设备类型
       */
      typeList: {
        /**
         * 类型名称
         */
        nameType: string;
        /**
         * 数量
         */
        num: number;
      }[];
      /**
       * 从未上线
       */
      neverOnLine: number;
      /**
       * 在线
       */
      onLineNum: number;
      /**
       * 离线
       */
      offLineNum: number;
      /**
       * 30天数据  新增车辆趋势数据
       */
      thirtyDayMap: any[];
      /**
       * 12个月数据  新增车辆趋势数据
       */
      twelveMonthMap: any[];
    }
  } & Res;

  export type pageHomePageTwoRes = {
    obj: {
      /**
       * 结清数
       */
      settleNum: number;
    }
  } & Res;
};

export default APIType;
