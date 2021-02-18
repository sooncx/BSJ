
import VehGroupType from "@/components/VehGroup/src/type";

export interface filterType {
  /**
   * 车辆
   */
  vehgroup: VehGroupType | null;
  /**
   * 开始时间
   */
  startTime: string;
  /**
   * 结束时间
   */
  endTime: string;
  /**
   * 静止时间
   */
  restTime: number;
}
