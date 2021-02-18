import AMap from "AMap";// 引入高德地图
import GPS from "@/assets/js/GPS";
import { Item } from "ant-design-vue/lib/vc-menu";
// 根据距离获取合适的缩放级别
export function getMapZoom(diff: any) {
    let room = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14);
    let diffArr = new Array(
        360,
        180,
        90,
        45,
        22,
        11,
        5,
        2.5,
        1.25,
        0.6,
        0.3,
        0.15,
        0.07,
        0.03,
        0
    );
    for (let i = 0; i < diffArr.length; i++) {
        if (diff - diffArr[i] >= 0) {
            return room[i] + 6;
        }
    }
    return 18;
};
// 根据坐标数组求中心坐标
export function calculateCenter(lnglatarr: any) {
    let total = lnglatarr.length;
    let X = 0,
        Y = 0,
        Z = 0;
    lnglatarr &&
        lnglatarr.map((lnglat: any) => {
            let lng = (lnglat.lng * Math.PI) / 180;
            let lat = (lnglat.lat * Math.PI) / 180;
            let x, y, z;
            x = Math.cos(lat) * Math.cos(lng);
            y = Math.cos(lat) * Math.sin(lng);
            z = Math.sin(lat);
            X += x;
            Y += y;
            Z += z;
        });
    X = X / total;
    Y = Y / total;
    Z = Z / total;

    let Lng = Math.atan2(Y, X);
    let Hyp = Math.sqrt(X * X + Y * Y);
    let Lat = Math.atan2(Z, Hyp);
    return new AMap.LngLat((Lng * 180) / Math.PI, (Lat * 180) / Math.PI);
};
// 获取车辆图标
export function getCarPng(item: any) {
    switch (item.Z.toString()) {
        case "0":
            if (item.B && item.B != "") {
                return require("@/assets/img/car/car_alarm.png");
            }
            return require("@/assets/img/car/car_offline.png");
            break;
        case "1":
            return require("@/assets/img/car/car_online.png");
            break;
        case "2":
            return require("@/assets/img/car/car_stop.png");
            break;
        default:
            if (item.B && item.B != "") {
                return require("@/assets/img/car/car_alarm.png");
            }
            return require("@/assets/img/car/car_offline.png");
            break;
    }
}
// 获取单个地址
export async function AmapGetOneAddress(points: any, change = true): Promise<any> {
    const geocoder = new AMap.Geocoder({
        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        city: '010'
    });
    let lnglat = null as any;
    if ([null, 'null'].includes(points.lat) || [null, 'null'].includes(points.lng)) {
        lnglat = null;
    }
    else if (change) {
        const { lon, lat } = GPS.gcj_encrypt(parseFloat(points.lat), parseFloat(points.lng));
        lnglat = [lon, lat];
    } else {
        lnglat = [parseFloat(points.lng), parseFloat(points.lat)];
    }
    return new Promise(async (resolve: any, reject: any) => {
        if (lnglat && lnglat.length > 0) {
            await geocoder.getAddress(lnglat, (status: any, result: any) => {
                if (status === 'complete' && result.info === 'OK') {
                    resolve({ address: result.regeocode.formattedAddress });
                } else {
                    resolve({ address: "获取地址失败" });
                }
            })
        } else {
            resolve({ address: "" });
        }
    })
}
// 获取多个地址
export async function AmapGetAddress(points: any[], change = false): Promise<any> {
    const geocoder = new AMap.Geocoder({
        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        city: '010'
    });
    const setAddress = function (lnglat: any) {
        return new Promise(async (resolve: any, reject: any) => {
            if (lnglat) {
                await geocoder.getAddress(lnglat, (status: any, result: any) => {
                    if (status === 'complete' && result.info === 'OK') {
                        resolve({ address: result.regeocode.formattedAddress });
                    } else {
                        resolve({ address: "" });
                    }
                })
            } else {
                resolve({ address: "" });
            }
        })
    };
    return new Promise((resolve: any) => {
        let res = [] as any;
        let L = points.length - 1;
        console.log(points, "points");
        points.map(async (item: any, index: number) => {
            if (change) {
                let lnglat = null;
                if (![null, 'null'].includes(item.lat) && ![null, 'null'].includes(item.lng)) {
                    const { lon, lat } = GPS.gcj_encrypt(parseFloat(item.lat), parseFloat(item.lng));
                    lnglat = [lon, lat];
                }
                await setAddress(lnglat).then((result: any) => {
                    res.push({ ...result, type: item.type });
                    if (index == L) {
                        setTimeout(() => {
                            resolve(res);
                        }, 0);
                    }
                });
            } else {
                let lnglat = null;
                if (![null, 'null'].includes(item.lat) && ![null, 'null'].includes(item.lng)) {
                    lnglat = [parseFloat(item.lng), parseFloat(item.lat)];
                }
                await setAddress(lnglat).then((result: any) => {
                    res.push({ ...result, type: item.type });
                    if (index == L) {
                        setTimeout(() => {
                            resolve(res);
                        }, 0);
                    }
                });
            }
        });
        console.log(res, "resresresresres");
    })
}