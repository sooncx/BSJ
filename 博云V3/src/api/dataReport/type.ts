interface Res {
  msg: string;
  flag: number;
}

interface Param {
  /**
   * 车辆ID
   */
  chooseId?: number;
  /**
   * 车组ID
   */
  groupId?: number;
  /**
   * 查询类型。0是车组，1是车辆
   */
  flag?: number;
  /**
   * 有线无线。0全部，1无线，2有线
   */
  longStay?: number;
  /**
   * 当前页
   */
  pageNumber?: number;
  /**
   * 每页条数
   */
  pageSize?: number;

}

namespace APIType {
  /**
   * 查询报警报表
   */
  export type pageAlarmParam = {
    /**
     * 开始时间
     */
    startTime: string;
    /**
     * 结束时间
     */
    endTime: string;
    /**
     * 报警类型
     */
    alarmTypes: string;
  } & Param;

  /**
   * 查询报警报表
   */
  export type pageAlarmRes = {
    obj: {
      /**
       * 当前页
       */
      pageNumber: number;
      /**
       * 每页条数
       */
      pageSize: number;
      /**
       * 总条数
       */
      total: number;
      /**
       * 表格数据
       */
      data: {
        /**
         * 车辆ID
         */
        vehicleId: number;
        /**
         * 车牌号
         */
        plate: string;
        /**
         * 设备号
         */
        terminalNo: string;
        /**
         * 所属车组
         */
        groupName: string;
        /**
         * 开始时间
         */
        startTime: string;
        /**
         * 结束时间
         */
        endTime: string;
        /**
         * 报警次数
         */
        num: number;
        /**
         * 报警类型
         */
        type: string;
      }[]
    }
  } & Res;

  /**
   * 查询报警明细报表
   */
  export type listAlarmDetailParam = {
    /**
     * 车辆id
     */
    vehicleId: number;
    /**
     * 报警类型
     */
    type: string;
    /**
     * 开始时间
     */
    startTime: string;
    /**
     * 结束时间
     */
    endTime: string;
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
   * 查询报警明细报表
   */
  export type listAlarmDetailRes = {
    obj: {
      /**
       * 当前页
       */
      pageNumber: number;
      /**
       * 每页条数
       */
      pageSize: number;
      /**
       * 总条数
       */
      total: number;
      /**
       * 表格数据
       */
      data: {
        /**
         * 车辆ID
         */
        vehicleId: number;
        /**
         * 车牌号
         */
        plate: string;
        /**
         * 设备号
         */
        terminalNo: string;
        /**
         * 所属车组
         */
        groupName: string;
        /**
         * 开始时间
         */
        startTime: string;
        /**
         * 结束时间
         */
        endTime: string;
        /**
         * 报警次数
         */
        num: number;
        /**
         * 报警类型
         */
        type: number;
      }[]
    }
  } & Res;

  /**
   * 导出报警明细
   */
  export type pageAlarmDetailParam = {
    /**
     * 车辆id
     */
    vehicleId: number;
    /**
     * 报警类型
     */
    type: string;
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
   * 离线统计
   */
  export type pageOffOnlineParam = {
    /**
     * 起始离线时长查询（单位：分钟）
     */
    beginOffTimeMin: number;
    /**
     * 最长离线时长查询（单位：分钟）
     */
    endOffTimeMin: number;
  } & Param;

  /**
   * 离线统计
   */
  export type pageOffOnlineRes = {
    obj: {
      /**
       * 当前页
       */
      pageNumber: number;
      /**
       * 每页条数
       */
      pageSize: number;
      /**
       * 总条数
       */
      total: number;
      /**
       * 表格数据
       */
      data: {
        /**
         * 车组名字
         */
        G: string;
        /**
         * 离线时候的经度
         */
        O: number;
        /**
         * 离线时候的纬度
         */
        A: number;
        /**
         * 离线时候的时间
         */
        T: string;
        /**
         * 车牌
         */
        P: string;
        /**
         * 车辆类型
         */
        Y: string;
        /**
         * 离线时刻距今时间
         */
        S: string;
        /**
         * SIM卡号
         */
        M: string;
        /**
         * 终端编号
         */
        N: string;
        /**
         * 持续时间
         */
        D: string;
        /**
         * 过期时间
         */
        EP: string;
        /**
         * 当前时间
         */
        NOW: string;
        /**
         * 车辆状态 0：从未上线 1：行驶 2：停车 3：离线 4:过期，默认从未上线
         */
        Z: number;
        /**
         * 车组id
         */
        groupId: number;
        /**
         * 车辆id
         */
        vehicleId: number;
        /**
         * 关注等级
         */
        concernLevel: number;
        /**
         * 关注备注
         */
        remark: string;
      }[]
    }
  } & Res;

  /**
   * 行车统计查询
   */
  export type pageAccReportParam = {
    /**
     * 开始时间
     */
    accBeginTime: string;
    /**
     * 结束时间
     */
    accEndTime: string;
    /**
     * acc状态(0开1关)
     */
    accState: number;
  } & Param;

  /**
   * 行车统计查询
   */
  export type pageAccReportRes = {
    obj: {
      /**
       * 当前页
       */
      pageNumber: number;
      /**
       * 每页条数
       */
      pageSize: number;
      /**
       * 总条数
       */
      total: number;
      /**
       * 表格数据
       */
      data: {
        /**
         * 车牌号码
         */
        plate: string;
        /**
         * 车组名
         */
        groupName: string;
        /**
         * 车辆id
         */
        vehicleId: number;
        /**
         * 时间戳类型 开始时间
         */
        accBeginTime: number;
        /**
         * 开始时间
         */
        beginTime: string;
        /**
         * 时间戳类型 结束时间
         */
        accEndTime: number;
        /**
         * 结束时间
         */
        endTime: string;
        /**
         * 持续总的时间
         */
        accSpaceTime: string;
        /**
         * 持续时间
         */
        thisSecs: number;
        /**
         * 设备号
         */
        terminalNo: string;
        /**
         * acc信息
         */
        accInfos: {
          /**
           * 车组名称
           */
          groupName: string;
          /**
           * 序号
           */
          id: number;
          /**
           * 车牌号
           */
          plate: string;
          /**
           * 车辆ID
           */
          vehicleId: number;
          /**
           * 所属车组ID
           */
          groupId: number;
          /**
           * Acc开启0，关闭1
           */
          type: number;
          /**
           * 开始经度
           */
          lonBegin: number;
          /**
           * 开始纬度
           */
          latBegin: number;
          /**
           * 开始时间
           */
          accBeginTime: number;
          /**
           * 开始里程
           */
          mileageBegin: number;
          /**
           * 结束经度
           */
          lonEnd: number;
          /**
           * 结束纬度
           */
          latEnd: number;
          /**
           * 结束时间
           */
          accEndTime: number;
          /**
           * 结束里程
           */
          mileageEnd: number;
          /**
           * 更新时间
           */
          updateTime: number;
          /**
           * acc持续时间(开启持续时间，或关闭持续时间)
           */
          accSpaceTime: string;
          /**
           * 本次行程持续时间,单位秒
           */
          thisSecs: number;
          /**
           * 本次行程持续里程，单位公里
           */
          thisMileage: number;
        }[]
      }[]
    }
  } & Res;

  /**
   * 行车统计明细查询
   */
  export type pageAccDetailParam = {
    /**
     * 车辆id
     */
    vehicleId: number;
    /**
     * 开始时间
     */
    accBeginTime: string;
    /**
     * 结束时间
     */
    accEndTime: string;
    /**
     * acc状态(0开1关)
     */
    accState: number;
  }

  /**
   * 行车统计明细查询
   */
  export type pageAccDetailRes = {
    obj: {
      /**
       * 当前页
       */
      pageNumber: number;
      /**
       * 每页条数
       */
      pageSize: number;
      /**
       * 总条数
       */
      total: number;
      /**
       * 表格数据
       */
      data: {
        /**
         * 车牌号
         */
        plate: string;
        /**
         * Acc开启0，关闭1
         */
        type: number;
        /**
         * 开始经度
         */
        lonBegin: number;
        /**
         * 开始纬度
         */
        latBegin: number;
        /**
         * 开始时间
         */
        accBeginTime: string;
        /**
         * 结束经度
         */
        lonEnd: number;
        /**
         * 结束纬度
         */
        latEnd: number;
        /**
         * 结束时间
         */
        accEndTime: string;
        /**
         * acc持续时间(开启持续时间，或关闭持续时间)
         */
        accSpaceTime: string;
      }[]
    }
  } & Res;

  /**
   * 行车统计明细导出
   */
  export type exportPageAccDetailParam = {
    /**
     * 车辆id
     */
    vehicleId: number;
    /**
     * acc状态(0开1关)
     */
    accState: number;
    /**
     * 开始时间
     */
    accBeginTime: string | number;
    /**
     * 结束时间
     */
    accEndTime: string | number;
  }

  /**
   * 停车报表查询
   */
  export type pageNowStopRePortParam = {
    /**
     * 停车时长(单位小时)
     */
    min: number;
    /**
     * 是否返回所有的数据（-1返回所有）
     */
    all?: number;
  } & Param;

  /**
   * 停车报表查询
   */
  export type pageNowStopRePortRes = {
    obj: {
      /**
       * 当前页
       */
      pageNumber: number;
      /**
       * 每页条数
       */
      pageSize: number;
      /**
       * 总条数
       */
      total: number;
      /**
       * 表格数据
       */
      data: {
        /**
         * 车牌号
         */
        plate: string;
        /**
         * 设备号
         */
        terminalNo: string;
        /**
         * 设备类型
         */
        terminalType: string;
        /**
         * 停车时长（转转换成字符串）
         */
        displayTimeStr: string;
        /**
         * 停车时长
         */
        displayTime: number;
        /**
         * 车组名
         */
        groupName: string;
        /**
         * 是否定位（0不定位1定位）
         */
        isPos: number;
        /**
         * 经度
         */
        lon: number;
        /**
         * 纬度
         */
        lat: number;
        /**
         * 停车开始时间
         */
        beginTime: string;
      }[]
    }
  } & Res;

  /**
   * 经常停留点
   */
  export type pageStopRePortParam = {
    /**
     * 车辆id
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
     * 状态，1行，2停(暂时不使用)
     */
    state?: number;
    /**
     * 停车时长(分钟)
     */
    spaceTime: number;
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
   * 经常停留点
   */
  export type pageStopRePortRes = {
    obj: {
      /**
       * 当前页
       */
      pageNumber: number;
      /**
       * 每页条数
       */
      pageSize: number;
      /**
       * 总条数
       */
      total: number;
      /**
       * 数据
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
   * 剩余电量查询
   */
  export type pageEnergyReportParam = {
    /**
     * 查询电量的百分比
     */
    percent: number;
    /**
     * 大于或小于，输入g表示大于等于，输入l表示小于等于
     */
    gl: string;
    /**
     * 暂时不使用
     */
    longStay?: number;
    /**
     * 	当前页
     */
    pageNumber: number;
    /**
     * 每页条数
     */
    pageSize: number;
  }

  /**
   * 剩余电量查询
   */
  export type pageEnergyReportRes = {
    obj: {
      /**
       * 当前页
       */
      pageNumber: number;
      /**
       * 每页条数
       */
      pageSize: number;
      /**
       * 总条数
       */
      total: number;
      /**
       * 表格数据
       */
      data: {
        /**
         * 车辆Id:vehicleId:V
         */
        V: number;
        /**
         * 车牌号plate:P
         */
        P: string;
        /**
         * 车组groupId:G
         */
        G: string;
        /**
         * 车主:owner:W
         */
        W: string;
        /**
         * 设备号，即终端编号:terminalNo
         */
        N: string;
        /**
         * 剩余电量百分比percent:E
         */
        E: string;
        /**
         * sim卡号sim:I
         */
        I: string;
        /**
         * 流量，和ICCID相关,是用ICCID获取:C
         */
        C: string;
      }[]
    }
  } & Res;

  /**
   * 查询里程报表
   */
  export type pageMileageParam = {
    /**
     * 开始时间
     */
    startTime: string;
    /**
     * 结束时间
     */
    endTime: string;
  } & Param;

  /**
   * 查询里程报表
   * 
   */
  export type pageMileageRes = {
    obj: {
      /**
       * 当前页
       */
      pageNumber: number;
      /**
       * 每页条数
       */
      pageSize: number;
      /**
       * 总条数
       */
      total: number;
      /**
       * 表格数据
       */
      data: {
        /**
         * 车辆ID
         */
        vehicleId: number;
        /**
         * 车牌号
         */
        plate: string;
        /**
         * 设备号
         */
        terminalNo: string;
        /**
         * 所属车组
         */
        groupName: string;
        /**
         * 开始时间
         */
        beginTimeS: string;
        /**
         * 结束时间
         */
        endTimeS: string;
        /**
         * 行驶里程（km)
         */
        thisMileage: string;
      }[]
    }
  } & Res;

  /**
   * 查询里程报表明细
   */
  export type listMileageDetailParam = {
    /**
     * 车辆id
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
   * 查询里程报表明细
   */
  export type listMileageDetailRes = {
    obj: {
      /**
       * 当前页
       */
      pageNumber: number;
      /**
       * 每页条数
       */
      pageSize: number;
      /**
       * 总条数
       */
      total: number;
      /**
       * 表格数据
       */
      data: {
        /**
         * 车辆ID
         */
        vehicleId: number;
        /**
         * 车牌号
         */
        plate: string;
        /**
         * 设备号
         */
        terminalNo: string;
        /**
         * 所属车组
         */
        groupName: string;
        /**
         * 开始时间
         */
        beginTimeS: string;
        /**
         * 结束时间
         */
        endTimeS: string;
        /**
         * 行驶里程（km)
         */
        thisMileage: string;
      }[]
    }
  } & Res;

  /**
   * 查询里程报表详情导出
   */
  export type exportMileageDetailParam = {
    /**
     * 车辆id
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
   * 总里程查询
   */
  export type pageTotalMileageReportParam = Param;

  /**
   * 总里程查询
   */
  export type pageTotalMileageReportRes = {
    obj: {
      /**
       * 当前页
       */
      pageNumber: number;
      /**
       * 每页条数
       */
      pageSize: number;
      /**
       * 总条数
       */
      total: number;
      /**
       * 表格数据
       */
      data: {
        /**
         * 车组名称GN
         */
        GN: number;
        /**
         * 里程数(单位：公里)
         */
        MI: string;
        /**
         * 车牌PL
         */
        PL: string;
        /**
         * sim卡号
         */
        SI: string;
        /**
         * 设备号
         */
        TE: string;
        /**
         * 最后时间
         */
        TI: string;
        /**
         * 设备类型
         */
        TY: string;
      }[];
    }
  } & Res;

  /**
   * 指令查询
   */
  export type pageCommandReportParam = {
    /**
     * 开始时间
     */
    startTime: string;
    /**
     * 结束时间
     */
    endTime: string;
  } & Param;

  /**
   * 指令查询
   */
  export type pageCommandReportRes = {
    obj: {
      /**
       * 当前页
       */
      pageNumber: number;
      /**
       * 每页条数
       */
      pageSize: number;
      /**
       * 总条数
       */
      total: number;
      /**
       * 表格数据
       */
      data: {
        /**
         * uuid
         */
        uuid: string;
        /**
         * 车辆ID
         */
        vehicleId: number;
        /**
         * 所属车组ID
         */
        groupId: number;
        /**
         * 车牌号
         */
        plate: string;
        /**
         * 车组名称
         */
        groupName: string;
        /**
         * 用户名称
         */
        userName: string;
        /**
         * 命令创建时间
         */
        createTime: string;
        /**
         * 命令内容
         */
        CommandMsg: string;
        /**
         * 命令结果
         */
        result: string;
        /**
         * 命令结果备注
         */
        resultMsg: string;
        /**
         * 命令ID
         */
        CommandId: string;
        /**
         * 终端号
         */
        terminalNo: string;
      }[];
    }
  } & Res;

  /**
   * 操作记录查询
   */
  export type pageOperRecordParam = {
    /**
     * 开始时间(格式：yyyy-MM-ddHH:mm:ss)
     */
    startTime: string;
    /**
     * 结束时间(格式：yyyy-MM-ddHH:mm:ss)
     */
    endTime: string;
    /**
     * 查询操作类型0：用户操作 1：车辆操作
     */
    flag: number;
    /**
     * 车辆id
     */
    vehicleId?: number;
    /**
     * 车组id
     */
    groupId?: number;
    /**
     * 查车辆记录类型,0：根据车组ID查(车组及子车组所有的车辆),1：根据车辆ID查-1：查当前用户所有的车的操作记录
     */
    vehicleFlag: number;
    /**
     * 用户ID可以为当前登录用户的子用户
     */
    inputUserId?: number;
    /**
     * 当前页
     */
    pageNumber?: number;
    /**
     * 每页条数
     */
    pageSize?: number;
  };

  /**
   * 操作记录查询
   */
  export type pageOperRecordRes = {
    obj: {
      /**
       * 当前页
       */
      pageNumber: number;
      /**
       * 每页条数
       */
      pageSize: number;
      /**
       * 总条数
       */
      total: number;
      /**
       * 表格数据
       */
      data: {
        /**
         * type 
         * 0表示用户操作
         * 1表示车辆,不需要：
         * 3表示库存设备的操作（新增设备，装机，分配）。
         * 4拆机
         */
        type: number;
        /**
         * 用户车辆ID设备id和车辆id一样
         */
        theId: number;
        /**
         * 用户车辆名称终端编号(如果有修改就存修改之后的信息)
         */
        name: string;
        /**
         * 备注
         */
        remark: string;
        /**
         * 操作类型
         */
        operType: string;
        /**
         * 操作用户
         */
        operUserName: string;
        /**
         * 操作用户id
         */
        operUserId: number;
        /**
         * 操作时间
         */
        operTime: string;
        /**
         * 操作者的ip
         */
        ip: string;
      }[];
    }
  } & Res;

  /**
   * 保养报表查询
   */
  export type pageMaintainReportParam = {
    /**
     * 车辆或车组id
     */
    id: number;
    /**
     * 1：说明是车辆id否是车组id
     */
    type: number;
    /**
     * 开始时间(时间格式：yyyy-MM-ddHH:mm:ss)
     */
    startTime: string;
    /**
     * 结束时间(时间格式：yyyy-MM-ddHH:mm:ss)
     */
    endTime: string;
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
   * 保养报表查询
   */
  export type pageMaintainReportRes = {
    obj: {
      /**
       * 当前页
       */
      pageNumber: number;
      /**
       * 每页条数
       */
      pageSize: number;
      /**
       * 总条数
       */
      total: number;
      /**
       * 表格数据
       */
      data: {
        /**
         * 当前里程数
         */
        currentMileage: number;
        /**
         * 上次保养里程
         */
        lastMileage: number;
        /**
         * 上次保养时间
         */
        lastMaintainTime: string;
        /**
         * 提前多少天设置
         */
        leadTime: number;
        /**
         * 提前多少公里提醒
         */
        advanceKilometers: number;
        /**
         * 备注
         */
        remark: string;
        /**
         * 车辆id
         */
        vehicleId: number;
        /**
         * 车牌号
         */
        plate: string;
        /**
         * 设备号
         */
        terminalNo: string;
        /**
         * 车组名称
         */
        groupName: string;
        /**
         * 保养日期
         */
        keepDay: string;
        /**
         * 提示内容
         */
        tips: string;
        /**
         * 车主
         */
        owner: string;
        /**
         * 电话
         */
        phone: string;
        /**
         * 下次保养时间
         */
        nextTimeMaintainTime: string;
        /**
         * 下次保养里程
         */
        nextCurrentMileage: number;
      }[];
    }
  } & Res;

  /**
   * 保险报表查询
   */
  export type pageInsuranceReportParam = {
    /**
     * 车辆或车组id
     */
    id: number;
    /**
     * 1：说明是车辆id否是车组id
     */
    type: number;
    /**
     * 开始时间(时间格式：yyyy-MM-ddHH:mm:ss)
     */
    startTime: string;
    /**
     * 结束时间(时间格式：yyyy-MM-ddHH:mm:ss)
     */
    endTime: string;
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
   * 保险报表查询
   */
  export type pageInsuranceReportRes = {
    obj: {
      /**
       * 当前页
       */
      pageNumber: number;
      /**
       * 每页条数
       */
      pageSize: number;
      /**
       * 总条数
       */
      total: number;
      /**
       * 表格数据
       */
      data: {
        /**
         * 保险公司
         */
        insuranceCompany: string;
        /**
         * 续保公司
         */
        renewalCompany: string;
        /**
         * 续费次数
         */
        renewalsNums: number;
        /**
         * 保险类型
         */
        insuranceType: string;
        /**
         * 总金额
         */
        amountMoney: number;
        /**
         * 车辆id
         */
        vehicleId: number;
        /**
         * 提前多少天提醒
         */
        leadTime: number;
        /**
         * 备注
         */
        remark: string;
        /**
         * 登记日期
         */
        loginTime: string;
        /**
         * 1:是首保2:不是首保
         */
        type: number;
        /**
         * 车牌号
         */
        plate: string;
        /**
         * 设备号
         */
        terminalNo: string;
        /**
         * 车组名称
         */
        groupName: string;
        /**
         * 保养日期
         */
        keepDay: string;
        /**
         * 提示内容
         */
        tips: string;
        /**
         * 车主
         */
        owner: string;
        /**
         * 电话
         */
        phone: string;
        /**
         * 下一次续保的时间
         */
        nestTimeInsuranceTime: string;
      }[]
    }
  } & Res;

  /**
   * OBD报表查询
   */
  export type pageOBDAlarmListParam = {
    /**
     * 报警类型
     */
    alarmTypes: string;
    /**
     * 车辆id
     */
    vehicleId: number;
    /**
     * 开始时间(时间格式：yyyy-MM-ddHH:mm:ss)
     */
    startTime: string;
    /**
     * 结束时间(时间格式：yyyy-MM-ddHH:mm:ss)
     */
    endTime: string;
    /**
     * 车组id
     */
    groupId: number;
    /**
     * 当前页
     */
    pageNumber: number;
    /**
     * 每页条数
     */
    pageSize: number;
  }

  /***
   * OBD报表查询
   */
  export type pageOBDAlarmListRes = {
    obj: {
      /**
       * 当前页
       */
      pageNumber: number;
      /**
       * 每页条数
       */
      pageSize: number;
      /**
       * 总条数
       */
      total: number;
      /**
       * 表格数据
       */
      data: {
        /**
         * 设备id
         */
        vehicleId: number;
        /**
         * 车组名称
         */
        groupName: string;
        /**
         * 车组id
         */
        groupId: number;
        /**
         * 车牌
         */
        plate: string;
        /**
         * 类型名称
         */
        typeName: string;
        /**
         * 报警类型英文
         */
        alarmType: string;
        /**
         * 开始时间
         */
        startTime: string;
        /**
         * 报警次数
         */
        alarmInt: number;
        /**
         * 速度
         */
        speed: number;
        /**
         * 报警id
         */
        obdAlarmId: number;
        /**
         * 经度
         */
        lon: number;
        /**
         * 纬度
         */
        lat: number;
      }[]
    }
  } & Res;

  /**
   * 物流锁报警记录查询
   */
  export type pageBluetoothAlarmReportParam = {
    /**
     * 车辆id
     */
    vehicleId: number;
    /**
     * 报警类型
     */
    alarmTypes: string;
    /**
     * 开始时间(时间格式：yyyy-MM-ddHH:mm:ss)
     */
    beginTime: string;
    /**
     * 结束时间(时间格式：yyyy-MM-ddHH:mm:ss)
     */
    endTime: string;
    /**
     * 当前页
     */
    pageNumber?: number;
    /**
     * 每页条数
     */
    pageSize?: number;
  }

  /**
   * 物流锁报警记录查询
   */
  export type pageBluetoothAlarmReportRes = {
    obj: {
      /**
       * 当前页
       */
      pageNumber: number;
      /**
       * 每页条数
       */
      pageSize: number;
      /**
       * 总条数
       */
      total: number;
      /**
       * 表格数据
       */
      data: {
        /**
         * id
         */
        id: number;
        /**
         * 报警id
         */
        alarmId: string;
        /**
         * 车辆id
         */
        vehicleId: number;
        /**
         * 设备号
         */
        terminalNo: string;
        /**
         * mac地址（设备地址）
         */
        mac: string;
        /**
         * 纬度
         */
        lat: number;
        /**
         * 经度
         */
        lon: number;
        /**
         * 备注
         */
        remark: string;
        /**
         * 报警时间
         */
        alarmTime: number;
        /**
         * 报警类型
         */
        alarmType: string;
        /**
         * 报警地址
         */
        address: string;
        /**
         * 操作员
         */
        operator: string;
      }[]
    }
  } & Res;

  /**
   * 物流锁操作记录查询
   */
  export type pageUnlockHistoryParam = {
    /**
     * 车辆id
     */
    vehicleId: number;
    /**
     * 开始时间(时间格式：yyyy-MM-ddHH:mm:ss)
     */
    beginTime: string;
    /**
     * 结束时间(时间格式：yyyy-MM-ddHH:mm:ss)
     */
    endTime: string;
    /**
     * 查询类型默认查全部
     * 0查全部
     * 1查蓝牙解锁
     * 2查平台解锁
     */
    queryType: number;
    /**
     * 1: 查询开锁
     * 2：查询关锁
     */
    type: number;
    /**
     * 当前页
     */
    pageNumber?: number;
    /**
     * 每页条数
     */
    pageSize?: number;
  }

  /**
   * 物流锁操作记录查询
   */
  export type pageUnlockHistoryRes = {
    obj: {
      /**
       * 当前页
       */
      pageNumber: number;
      /**
       * 每页条数
       */
      pageSize: number;
      /**
       * 总条数
       */
      total: number;
      /**
       * 表格数据
       */
      data: {
        /**
         * 操作人
         */
        operater: string;
        /**
         * 操作记录
         */
        record: string;
        /**
         * 操作时间
         */
        operateTime: string;
        /**
         * 操作类型只有开锁和关锁
         */
        operateType: string;
        /**
         * 平台类型
         */
        platformType: string;
        /**
         * 开锁成功或失败类型
         */
        state: string;
      }[]
    }
  } & Res;
}

export default APIType;