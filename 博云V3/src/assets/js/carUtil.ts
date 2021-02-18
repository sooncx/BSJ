import GPS from './GPS';
import { ElementOf } from '@/utils';
import APIType from "@/api/playBack/type";

export interface carType {
  isWired: number;
  statusTxt: string;
  speed: string | number;
  date: string;
  mileage: number;
  posType: number;
  posTxt: string;
  angle: number;
  accStateTxt: string;
  isStop: boolean;
  hasNoLocation: boolean,
  position: {
    aMap: {
      x: number;
      y: number;
    };
    bMap: {
      x: number;
      y: number;
    };
  },
  componentStateTxt?: string;
};

export class carUtil {
  isWired(carData: any) { // 是否是有线设备 监控中心直接根据longStayTer判断无线：1，有线：0 
    if (carData.longStayTer === undefined) {
      console.error("carData.longStayTer为undefined，不能获取设备有线还是无线")
      return true
    } else if (carData.longStayTer === 0) {
      return true
    } else {
      return false
    }
  }

  getMapStatusTxt(carData: any, key = "Z") {
    let result = "";
    switch (carData[key]) {
      case 0:
        result = "离线";
        break;
      case 1:
        result = "行驶";
        break;
      case 2:
        result = "停车";
        break;
      case 3:
        result = "从未上线";
        break;
      case 4:
        result = "已过期";
        break;
      default:
        break;
    }
    return result;
  }

  getStopTxt(mongoData: any, key = "m") { //轨迹回放获取静止的文本
    var minutes: any = parseInt((mongoData[key] / 60).toString());
    //累加停车时间
    if (minutes == 0) {
      minutes = minutes == 0 ? "<1分" : minutes + "分";
    }
    else if (minutes > 60) {
      var h = parseInt((minutes / 60).toString());
      var m = minutes % 60;
      if (m == 0) {
        minutes = h + "小时";
      }
      else {
        minutes = h + "小时" + m + "分";
      }
    }
    else {
      minutes = minutes + "分";
    }
    return "静止" + minutes
  }


  getPos(data: any, key = 'pos') {
    let result = ""
    switch (data[key]) {
      case 0:
        result = "GPS信号弱";
        break;
      case 1:
        result = "GPS定位";
        break;
      case 2:
        result = "WIFI定位";
        break;
      case 3:
        result = "多基站";
        break; // 多基站
      case 4:
        result = "单基站";
        break; // 单基站
      case 5:
        result = "混合定位";
        break; // 单基站
    }
    return result
  }

  getAccStateTxt(carData: any, key = "e") { // 获取Acc状态--轨迹回放key="e"
    var result = "";
    switch (carData[key]) {
      case 0:
        result = "ACC开"
        break;
      case 1:
        result = "ACC关"
        break;
    };
    return result
  }

  getIsStop(data: any, key = "x") {
    if (data[key] === 2) {

      return true
    }
    return false
  }

  getHasNoLocation(mongoData: any) { // 是否包含不定位补数据
    if (mongoData.extend && mongoData.extend.snp && mongoData.extend.snp.length > 0) return true
    return false
  }

  getComponentStateTxt(carData: any) { // 获取部件状态--轨迹回放
    var result = carData.posTxt + " " + carData.accStateTxt
    if (carData.b === 1) {
      result += " 盲补数据"
    }
    if (carData.power) {
      result += " 电量:" + carData.power + "%"
    }
    return result
  }

  handlerMongo(mongoData: ElementOf<APIType.listVehTrackPointRes['obj']['data']['trackList']>) { // 处理轨迹GetVehTrackMongo.json接口返回的数据
    const result = Object.assign(mongoData, {
      isWired: this.isWired(mongoData), // 是否有线
      statusTxt: this.getMapStatusTxt(mongoData, "x"), // 行驶状态
      speed: mongoData["x"] === 1 ? mongoData["s"] : this.getStopTxt(mongoData), // 速度
      date: mongoData["t"], // 时间
      mileage: mongoData["g"], // 里程
      posType: mongoData["i"], // 定位方式
      posTxt: this.getPos(mongoData, "i"), // 定位方式显示文本
      angle: mongoData["d"], // 方向
      accStateTxt: this.getAccStateTxt(mongoData),
      isStop: this.getIsStop(mongoData, "x"),
      hasNoLocation: this.getHasNoLocation(mongoData),
      position: GPS.defaultToPosition(mongoData.a, mongoData.o),
      componentStateTxt: <string | undefined>undefined,
    });
    result.componentStateTxt = this.getComponentStateTxt(result);
    return result

  }
}
