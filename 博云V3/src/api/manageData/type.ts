interface Res {
  msg: string;
  flag: number;
}

interface Param {
  /**
   * 当前页
   */
  pageNumber?: number;
  /**
   * 每页条数
   */
  pageSize?: number;
}

interface UserInfo {
  userId? : number; //用户Id
  name: string; //姓名 
  corpName: string; //客户名称
  phone: string; //电话
  remark: string; // 备注
  accountType: number; // 帐号类型(1.代理监控2管理员,我的客户3,4监控客户)
}

interface UserCheck {
  checkGroup: number ;// 是否有删除车组的权限,0有，1无
  checkOffOil: number ;// 是否有断油电的权限,0有，1无
  checkUser: number; //是否有删除用户的权限,0有，1无
  checkVehicle: number; //是否有删除车辆的权限,0有，1无
}

interface importCarInfo {
  terminalNo: string; // 终端编号
  terminalType: string; // 终端类型
  plate: string; // 车牌号
  sim: string; // sim
}

interface ResPage {
  /**
   * 当前页
   */
  pageNumber?: number;
  /**
   * 每页条数
   */
  pageSize?: number;
  /**
   * 总数
   */
  total?: number;
}

  
declare namespace APIType {
  // 查询结清车辆列表 请求
  export type pageSettleListParam = {
    groupId?: number | string; //车组ID
    vehicleId?: number | string; //	车辆id
  } & Param;
  // 查询结清车辆列表 返回
  export type pageSettleListRes = {
    obj:{
      total: number; // 总数
      pageNumber: number; // 当前页数
      pageSize: number; //每页数量
      data: {
        vehicleId: number;
        groupId: number;
        plate: string;
        sim: string;
        frameNo: string;
        settleTime: string;
        groupName: string
      }
    }
  }& Res;
  // 查询车辆续费数据 请求
  export type pageVehicleExpireParam = {
    expireTime: number;  //参数为秒数:过期和即将过期都会筛选出来
    groupId?: number | string; //车组ID
    vehicleId?: number | string; //	车辆id
    isState: number | string;  //在过期时间expireTime的基础上筛选出正常0，已过期1，或全部(不传参)，不续费2
    vehicleState: string; //车辆状态
    offlineTimeBegin: number | string; //离线开始时间
    offlineTimeEnd: number | string; //离线结束时间
    displayYear: number; //续费年限单位年，传入0则不筛选
    activationTmeStart: string; //激活时间开始时间段
    activationTmeEnd: string; //结束激活时间时间段
    installDateStart: string; //开始安装时间时间段
    installDateEnd: string; //结束安装时间时间段
  } & Param;
  // 查询车辆续费数据 返回
  export type pageVehicleExpireRes = {
    obj: {
      data: {
        NOW: string; //当前系统时间
        vehicleId: number; //车辆id
        plate: string; //车牌号
        terminalNo: string; //设备号
        frameNo: string; //车架号
        sim: string; //sim卡号
        activationTme: string; //激活时间
        groupId: string; //车组ID
        groupName: string; //车组名称
        expireDate: string; //到期时间
        installDate: string; //安装时间
        displayYear: string; //续费年限
        state: number; //车辆续费状态，1：过期，0：正常，2：不续费
        vehState: number; //车辆行驶状态
      }[],
      pageNumber: number;
      pageSize: number;
      total: number;
      tipMessage: string;
    },
  } & Res;
  // 续费接口 请求
  export type vehicleStateRechargeParam = {
    gvids: string;  //车辆，车组集合形式eg:（375155,31565901）
    addMonth: number; //增加的月数
  };
  // 续费接口 返回
  export type vehicleStateRechargeRes = {
    obj: {
      tipMessage: string; //结果
    }
  } & Res;
  // 批量转入不续费 请求
  export type batchVehicleStateRechargeParam = {
    gvids: string;  //车辆，车组集合形式eg:（375155,31565901）
    isState: number; //2为不续费，0为续费
  };
  // 批量转入不续费 返回
  export type batchVehicleStateRechargeRes = {
    obj: {
      tipMessage: string; //结果
    }
  } & Res;

  // 自定义续费接口 请求
  export type batchRechargeParams = {
    terminalNo: string;  //设备号[设备号与设备号之间以英文逗号分隔]
    addMonth:  number; //续费时间，单位月
  };
  // 自定义续费接口 返回
  export type batchRechargeRes = {
    tipMessage: string; //结果
  } & Res;

  // 自定义不续费接口 请求
  export type batchTransferStateParam = {
    terminalNos: string;  //设备号[设备号与设备号之间以英文逗号分隔]
    isState: number; //2为不续费，0为续费
  };
  // 自定义不续费接口 返回
  export type batchTransferStateRes = {
    obj:{
      data: {
        noPermission?: string[]; // 无权限
        nonexistent?: string[];  // 无设备
        success?: string[]       // 完成
      },
      tipMessage: string; 
    }
  } & Res;
  // 查询车辆续费记录 请求
  export type pageVehicleFreeLogParam = {
    vid: number | string;  //车辆id
    startTime: string; //开始时间
    endTime: string;   //结束时间
  } & Param;
  // 查询车辆续费记录 返回
  export type pageVehicleFreeLogRes = {
    obj:{
      data:{
        list: {
          ctime: string; // 充值时间
          groupName: string; // 分组名称
          money: number; //使用币数
          newExpire: string; //新过期时间
          operTime: string; //操作人+时间
          plate: string; //车牌
          terminalNo: string; //终端号
          vehId: string;  //车辆ID
        }[]; // 续费的车辆信息
        moneyAll: number; //车辆总数
        plateCount: number; // 共充值币数
      },
      total: number
    }
  } & Res;

  // 车币划拨 请求
  export type userRechargeParam = {
    userId: number | null;  //用户id
    chargeNum: number | null; //划拨的币数
  };
  // 车币划拨 返回
  export type userRechargeRes = {
    obj:{
      data:{
        moneyAfter: number,
        operTime: string,
        money: number,
        userB: string,
        userBCorpName: string
      }
    }
  } & Res;

  // 查询余额和总车辆数 返回
  export type queryMyStateRes = {
    obj:{
      data: {
        money: number,
        vehCount: number,
      }
    }
  } & Res;

  // 查询车辆划拨记录 请求
  export type pageRechargeLogParam = {
    userId: number | null //用户ID
    startTime: string; //开始时间
    endTime: string;   //结束时间
  }  & Param;
  // 查询车辆划拨记录 返回
  export type pageRechargeLogRes = {
    obj:{
      data:{
        chargeSum: string,  //计算充值总数
        giveSum: string,  //赠送总数
        logList: {         //操作记录
          chargeCount:number, 
          ctime: string,  //记录的时间
          id: number,   //自增长
          longStayVehCount: number, //无线车辆数
          money: number,  //充值币数
          moneyAfter: number, //充值后币数
          moneyAfterStr: string,
          moneyBefore: number,  //充值前币数
          moneyBeforeStr: string,
          moneyGive: number,  //赠送比例
          moneyGiveStr: string,
          moneyStr: string,
          noLongStayVehCount: number, //有线车辆数
          operTime: string, //操作人加时间
          price: number,
          rate: number, //利率列，这并不会记录到RDS，而是由WEB-SERVER计算出来的
          rmb: number,  //充值金额
          rmbStr: string, 
          userA: string,  //充值方
          userB: string,  //客户代码
          userBCorpName: string,  //客戶公司名（即客户名称）
          userIdA: number,
          remark: string, // 赠送理由
          userCode: string, // 客户代码
          userIdB: number,  //客户用户id
          vehCount: number, //车辆数
          years: number
        }[] 
      }
    },
  } & Res;

  // 查询工单列表 请求
  export type pageWorkSheetListByConditionParam = {
    type?: number; // 0导出工单 1导出安装人员
    name?: string; //用户ID
    userId: number;  //用户Id
    status: number; //工单状态：0.全部;1.待确认;2.待安装;3.已安装;4.已完成;5.已取消6.已删除
    endTime: string;   //结束时间
    startTime: string;   //开始时间
    searchType: number; //搜索类型：-1:查询所有0：车主、安装人员姓名、车牌1:车主2:userId3:车牌4:设备号
    searchValues: string | null; //搜索值
    terminalType: string; //终端类型
  } & Param;
  // 查询工单列表 返回
  export type pageWorkSheetListByConditionRes = {
    obj:{
      pageNumber: number; 
      pageSize: number; 
      total: number; 
      data: {
        id:number,  
        carOwner:string,  //车主
        phone: string,  //车主联系电话
        installTime:string, //安装时间
        finishTime:string,  //完成时间
        installWorker:number, //安装人员
        installWorkerName:string, //安装人员
        address:string,   //安装地址
        remark:string,  //备注
        createTime:string,  //创建时间
        updateTime:string,  //更新时间
        adminId:number, //操作人员
        adminType:number, //创建工单者类型
        vehicleIds:string,  //vehicleId
        installPositions:string,  //安装部位
        pictureUrls:string, //图片地址
        majorIds:string,  //设备对应记录id
        terminalTypes:string, //设备型号
        installWorkerFlag:number, //安装人员在职状态1:在职2:离职
        carPicture:string,  //车身照片
        cancelTime:string,  //取消时间
        confirmTime:string, //用户确认时间
        installedTime:string, //用户安装时间
        vehicleFlag:number, //是否具有设备信息0:是1:否
        status:number,  //工单状态：0.全部;1.待确认;2.待安装;3.已安装;4.已完成;5.已取消6.已删除
        workSheetDeviceVo: {  //工单安装设备集合
          plate: string,  //车牌
          majorId: string,  //设备对应记录id
          deviceId: number, //车辆id
          terminalNo: string, //设备号
          workSheetId: number,  //工单Id
          terminalType: string, //设备类型
          pictureUrl: string, //图片地址
          installPosition: string,  //安装部位
          longStayTer: number,  //有线无线类型：1为无线，0为有线
        }
      }[]; // 列表
    }
  } & Res;
  
  //添加/修改工单 请求
  export type workSheetParam = {
    id?: number;
    phone: string; //车主联系电话
    address: string; //安装地址
    devices: string; //批量vehicleId 逗号区分
    carOwner: string; //车主
    remark: string; // 备注
    vehicleFlag: number; //是否具有设备信息0:是1:否
    installTime: string; //安装时间
    installWorker: number | null; //安装人员Id
  }

  //分页展示安装人员下拉框信息 返回
  export type pageInstallWorkerRes = {
    obj:{
      flag: number; //员工状态:1.任职;2.离职
      name: string; //安装人员姓名
      userId: number //安装人员Id
    }[]
  } & Res;

  //删除工单 请求
  export type deleteWorkSheetParams = {
    ids: string
  };

  //修改工单状态 请求
  export type updateWorkSheetStatusParams = {
    id: number; // id
    status: number; //工单状态：0.全部;1.待确认;2.待安装;3.已安装;4.已完成;5.已取消6.已删除
  };

  // 分页展示安装人员搜索列表 请求
  export type pageInstallWorkerListByConditionParam = {
    name: string; //安装人员姓名
    startTime: string; //开始时间
    endTime	: string; //结束时间
  }  & Param;
  // 分页展示安装人员搜索列表 返回
  export type pageInstallWorkerListByConditionRes = {
    obj:{
      pageNumber: number,  //当前分页
      pageSize: number,  //分页数量
      total: number,  //总数
      data: {         //操作记录
        userId:number,  //安装人员id
        name:string,  //安装人员姓名
        phone:string,  //电话号码
        username:string,  //账号
        password:string,  //密码
        createTime:string,  //创建时间
        allCounts:number,  //全部订单数量
        processiveCounts:number,  //待安装订单数量
        confirmCounts:number,  //待确认订单数量
        remark:string,  //备注
      }[]
    },
  } & Res;

  //添加安装人员 请求
  export type installWorkerParams = {
    userId? : number; //安装人员id
    name: string; //安装人员姓名
    phone: string | number; //电话号码
    username	: string; //账号
    password	: string; //密码
    remark	: string; //备注
  };

  //删除安装人员 请求
  export type deleteInstallWorkerParams = {
    userId: number; // 安装人员
  };

  //批量删除安装人员信息 请求
  export type deleteInstallWorkersParams = {
    userIds: string; // 安装人员
  };

  // 查询车组下所有车辆 请求
  export type listVehicleByGroupRdsParam = {
    groupId: number | any; //车组id
  }  & Param;
  // 查询车组下所有车辆 返回
  export type listVehicleByGroupRdsRes = {
    obj:{
      data: {
        EP?:string,  //过期时间
        NOW:string,  //当前时间
        formatTime:string,  //上线时间
        frameNo:string,  //车架号
        gpsTime:string,  //最后位置数据终端时间
        installDate:string,  //安装时间
        nowRemark:string,  //备注
        plate:string,  //车牌号
        sim:string,  //sim卡号
        terminalNo:string,  //终端编号
        terminalType:string,  //终端类型
        vehicleId:number,  //车辆Id
        vehicleStatus:number,  //车辆状态0：从未上线1：行驶2：停车3：离线，默认从未上线
        mac:string,  //mac
      }[],
      pageNumber: number,  //当前分页
      pageSize: number,  //分页数量
      total: number,  //总数
    },
  } & Res;

  //添加车组信息 | 修改车组信息 请求
  export type vehGroupInfoParams = {
    groupId? : number; //车组信息
    groupName: string; //车组名称
    parentId: number; //上级车组id
    parentName	: string; //上级车组名称
    phone: string; //手机号
    remark: string; //备注
    isFinance: string; //是否是库存车组，如果取值为1则为金融账号下的库存车组
    notice: string; //车组公告
  };
  //添加车组信息 返回
  export type addVehGroupRes = {
    obj:{
      data:{
        groupId: number; //车组Id
        cgroupId: number; //车组Id
        delFlag: number; //判断显示标记（0表示车辆在回收站中，1表示显示）
        isFinance: number; //是否库存车组,取值为1时候，表示库存车组
        groupName: number; //车组名称
        parentId: number; //父车组Id
        parentName: number; //父车组名称
        phone: number; //联系方式
        remark: number; //备注
      }
    }
  } & Res;

  //删除车组信息 请求
  export type deleteVehicleGroupParams = {
    groupId: number; // 车组ID
  };

  // 车组信息信息返回
  export type getGroupRes = {
    obj:{
      data:{
        groupId: number,
        groupName: string,
        parentId: number,
        parentName: string,
        phone: string,
        remark: string,
      }
    }
  } & Res;
  

  //根据车辆id获取车辆信息 请求
  export type queryVehicleInfoParams = {
    vehicleId	: number; // 车辆id
  };
  //根据车辆id获取车辆信息 返回
  export type queryVehicleInfoRes = {
    obj: {
      delFlag: number; // 显示判断标记(1显示，0表示车辆在回收站中)
      groupId: number; // 车组id
      groupName: string; // 车组名称
      parentId: number; // 父车组id
      vehicle: number; //车辆id
    }
  } & Res;
  //单台车辆转移 请求
  export type singleVehTranParams = {
    vehicleId: string; //车辆id
    groupId: string; //转移的车组id
    befGroupId: string; //原车组id
  };

  //删除车辆 请求
  export type deleteVehicleParams = {
    vehicleId: string; //车辆id
    groupId: string; //转移的车组id
  };

  //根据车牌号/设备号转移车辆 请求
  export type transVehicleParams = {
    transType: string; //转移类型(plate:根据车牌号转移terminalNo:根据设备号转移)
    groupId: string; //车组id
    list: string; //车牌号或设备号
  };

  //自定义删除 请求
  export type batchDelVehicleParams = {
    terminalNos: string; //设备号，多个用英文逗号分隔(String)
  };
  //自定义删除 返回
  export type batchDelVehicleRes = {
    obj:{
      data: {
        noPermission?: string[]; // 没有删除权限的
        nonexistent?: string[];  // 设备号不存在的
        success?: string[];       // 没有删除权限的
        successNum: number; //删除成功的
        recvNum: number; //删除失败的数量
      }
    }
  } & Res;

  //列表查询用户 请求
  export type listUserParams = {
    userId?: number;
    type: number;
  };
  //列表查询用户 返回
  export type listUserRes = {
    obj: {
      alarmSoundFlag: number; //报警铃声控制，0开1关
      cd149: boolean; //是否是CD149
      checkSim: number; //用于区分A级客户在新增下级用户的时候的权限分配,1：A权限(无限制)2:B权限(只可查看SIM卡状态，发短信，无法进行其他的操作)
      corpName: string; //客户名称
      lookPassword: number; //是否能看到下级的密码0:无1:可
      system4s: number; //4s权限,0无权限，1有权限
      workSheetFlag: number; //工单状态0:查看1:隐藏
      cuserId: number; //客户代码级id
      delFlag: number; //判断显示标记（0表示车辆在回收站中，1表示显示）
      parentId: number; // 上级用户Id
      parentCorp: string; //上级公司名
      parentName: string; //上级用户名称
      createTime: string; //创建时间
      password: string; //密码
      money: number; //币数
    } & UserInfo & UserCheck
  } & Res;

  //分页列表查询用户 请求
  export type pageUserParams = {
    userName?: string;
    userId?: number;
    type?: number;
  } & Param;
  //分页列表查询用户 返回
  export type pageUserRes = {
    obj: {
      pageNumber: number; //
      pageSize: number; //
      total: number; //
      data: {
        parentId: number; //上级用户id
        parentName: string; //上级用户名
        parentCorp: string; //上级公司名
        createTime: string; //创建时间
        money: number; //币值
        customCode: string; //客户代码
      } & UserInfo;
    }
  } & Res;

  //新增客户 请求
  export type saveClientUserParams = {
    password: string; //账户密码
    parentId: number; //上级账户ID
    groupIds: string; //车组Id
    permissionValue?: string; //添加保单权限值
    isOffOil?: number; //监控客户是否可断油电（只针对客户代码级），1：是；0：否
    permission?: string; //拥有的权限
    isMsgCheck?: number; //是否需要短信校验
  } & UserInfo & UserCheck;
  //新增客户 返回
  export type saveClientUserRes = {
    obj: {
      alarmSoundFlag: number; //报警铃声控制，0开1关
      cd149: boolean; //是否是CD149
      checkSim: number; //用于区分A级客户在新增下级用户的时候的权限分配,1：A权限(无限制)2:B权限(只可查看SIM卡状态，发短信，无法进行其他的操作)
      corpName: string; //客户名称
      lookPassword: number; //是否能看到下级的密码0:无1:可
      system4s: number; //4s权限,0无权限，1有权限
      workSheetFlag: number; //工单状态0:查看1:隐藏
      cuserId: number; //客户代码级id
      delFlag: number; //判断显示标记（0表示车辆在回收站中，1表示显示）
      parentId: number; // 上级用户Id
      parentCorp: string; //上级公司名
      parentName: string; //上级用户名称
      ctime: string; //创建时间
      password: string; //密码
      money: number; //币数
      groupId: string; //车组Id
      logoUserId: string; //LOGO所对应的userId
      serviceType: string; //2是金融帐号
    } & UserInfo & UserCheck
  } & Res;

  //修改客户 请求
  export type updateClientUserParams = {
    isMsgCheck?: number; //短信校验
    isOffOil?: number; //监控客户是否可断油电（只针对客户代码级），1：是；0：否
    permission?: number; //拥有的权限
    permissionValue?: number; //添加保单权限值
  } & UserInfo & UserCheck;

  //修改用户本身密码 请求
  export type updateUserPasswordParams = {
    bPwd: string; //旧密码
    nPwd: string; //新密码
  };

  //用户绑定车组 请求
  export type bindUserGroupParams = {
    userId: number | null; //绑定的用户Id
    groupIds: string; //绑定的车组,多个用英文逗号“,”分隔
  };

  //删除客户 请求
  export type deleteClientUserParams = {
    userId: number; //用户Id
    type: number; //0是默认删除，1的时候强制删除，当默认删除返回有子账号时，传1强制删除(Integer)
  };

  //重置用户密码 请求
  export type resetUserPasswordParams = {
    userId: number; //用户Id
    type: number; //重置类型，0请求重置密码，1确定重置密码(Integer)
  };

  //重置用户密码 返回
  export type resetUserPasswordRes = {
    obj: string
  } & Res;
  

  //查询用户绑定的车组 请求
  export type listUserGroupParams = {
    userId: number; //用户Id
  };
  //查询用户绑定的车组 返回
  export type listUserGroupRes = {
    obj: {
      groupId: number; //车组Id
      groupName: string; //车组名称
      parentId: number; //上级用户Id
      parentName: string; //父车组名称
    }[]
  } & Res;

  //单个查询用户 请求
  export type getUserParams = {
    userId?: number; //用户id，不传时查询当前用户(Integer)
  };
  //单个查询用户 返回
  export type getUserRes = {
    obj: {
      password: string; //密码
      userId: number;
      createTime: string; //创建时间
      parentId: string; //上级用户id
      parentName: string; //上级用户名
      parentCorp: string; //上级公司名
      money: string; //币值
      customCode?: string; //客户代码
    } & UserInfo & UserCheck
  } & Res;

  //获取中间表的错误数据 返回
  export type getImportVehicleDataRes = {
    obj: {
      data:{
        rightData: importCarInfo[] ; //正确的信息
        rightNum: number ; //正确的行数
        errorData: importCarInfo[] ; //错误的信息
        errorNum: number ; //错误的行数
      },
      tipMessage: string;
    }
  } & Res;

  //没有错误数数把数据全部插入表格中 请求
  export type insertBatchVehParams = {
    groupId: number; //车组id
    addMonth: number; //续费的时间
  };

  //没有错误数数把数据全部插入表格中 请求
  export type getLocationDataParams = {
    vehicleId: number; //车辆id
    pageSize: number; //分页代销
  };
  //获取中间表的错误数据 返回
  export type getLocationDataRes = {
    obj:{
      data: {
        groupId: number; // 车组id
        jump: number; // 在第几条
        pageNumber: number; //在第几页
      }
    }
  } & Res;

  //新增角色 请求
  export type roleParams = {
    roleId?: number; //角色ID
    roleName: string; //角色名称
    roleDesc: string; //角色描述
    resourceIdList: [Number]; //资源id集合
  };

  //分配角色资源 请求
  export type updateResourceParams = {
    roleId: number; //角色名称
    resourceIdList: string; //资源id集合
  };

  
  //删除角色 请求
  export type deleteRoleParams = {
    roleId: number; //角色ID
  };

  //分页查询角色 请求
  export type pageRoleParams = {
    roleName: string; //角色名称
    status: number; //角色状态，0全部，1使用，2冻结
  } & Param;

  //分页查询角色 返回
  export type pageRoleRes = {
    obj: {
      pageNumber: number; // 车组id
      pageSize: number; // 在第几条
      total: number; //在第几页
      data: {
        roleId: number; //主键id
        roleName: string; //角色名
        roleDesc: string; //角色说明
        tenantId: number; //租户id
      }
    }
  } & Res;

  //单个查询角色 请求
  export type getRoleParams = {
    roleId: number;
  }

  //单个查询角色 返回
  export type getRoleRes = {
    obj: {
      roleId: number; // 角色id
      roleName: string; // 角色名称
      roleDesc: string; //角色描述
      resourceIdList: [number] //资源id集合 ,Integer
    }
  } & Res;

  // 公用单独返回RES
  export type PublicRes = Res;
}

export default APIType;