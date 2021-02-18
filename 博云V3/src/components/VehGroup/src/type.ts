interface vehGroupType {
  /**
   * 车组ID
   */
  groupId: number;
  /**
   * 数据类型 0 车组  1车辆
   */
  flag: number;
  /**
   * 车辆ID
   */
  vehicleId: number;
  /**
   * 模糊搜索 类型
   * 0 车组
   * 1 车牌
   * 2 设备号
   * 3 SIM卡
   * 4 车主
   * 6 车架号
   */
  type?: number,
  /**
   * 车牌号
   */
  plate: string;
  /**
   * 设备号
   */
  terminalNo?: string;
  /**
   * SIM卡
   */
  sim?: string;
  /**
   * 车主
   */
  owner?: string;
  /**
   * 过期时间
   */
  EP?: string;
  /**
   * 车组名
   */
  groupName?: string;
  /**
   * 车架号
   */
  frameNo?: string;
}

export default vehGroupType;
