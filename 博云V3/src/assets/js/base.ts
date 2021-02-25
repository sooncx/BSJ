// 防抖
export const debounce: Function = (function () {
    let timer = 0;
    return function (callback: Function, ms: number): void {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();
// 是否全屏
export function isFullscreenFn() {
    let res = (document as any).fullscreen ||
        (document as any).msFullscreenElement ||
        (document as any).mozFullScreen ||
        (document as any).webkitIsFullScreen || false;
    return res;
}
// 退出全屏
export function ExitFullscreen() {
    //W3C
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    //FireFox
    else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
    }
    //Chrome等
    else if ((document as any).webkitCancelFullScreen) {
        (document as any).webkitCancelFullScreen();
    }
    //IE11
    else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
    }
}
// 全屏
export function Fullscreen() {
    const docElm = document.documentElement as any;
    //W3C
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    }
    //FireFox
    else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    }
    //Chrome等
    else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
    }
    //IE11
    else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
    }
}
export const TwoCoordinateAzimuth: Function = function (start: any, end: any) {
    let d = 0,
        lat_a = (start.lat * Math.PI) / 180,
        lng_a = (start.lng * Math.PI) / 180,
        lat_b = (end.lat * Math.PI) / 180,
        lng_b = (end.lng * Math.PI) / 180;

    d =
        Math.sin(lat_a) * Math.sin(lat_b) +
        Math.cos(lat_a) * Math.cos(lat_b) * Math.cos(lng_b - lng_a);
    d = Math.sqrt(1 - d * d);
    d = (Math.cos(lat_b) * Math.sin(lng_b - lng_a)) / d;
    d = (Math.asin(d) * 180) / Math.PI;
    d = d % 360;

    //判断在终点在第几象限
    const x = end.lng - start.lng,
        y = end.lat - start.lat;
    if (x < 0 && y > 0) {
        d = 360 + d;
    } else if (y < 0) {
        d = 180 - d;
    }

    d = d >= 0 ? d : 360 + d;
    return d;
}
export const deepClone: Function = function (source: any) {
    if (!source && typeof source !== "object") {
        throw new Error("error arguments");
    }
    const targetObj = (source.constructor === Array ? [] : {}) as any;
    Object.keys(source).forEach(keys => {
        if (source[keys] && typeof source[keys] === "object") {
            targetObj[keys] = deepClone(source[keys]);
        } else {
            targetObj[keys] = source[keys];
        }
    });
    return targetObj;
}
//获取地图车辆图标
// export const getCarIcon: Function = function ({ state = 0, vehicleType = 0 } = {}) {
//     let statusObj: any = {};
//     let typeObj: any = {};
//     statusObj = {
//         0: "stop", //静止
//         1: "online", //运动
//         2: "online", //作业
//         3: "offline", //离线
//         4: "offline", //从未上线
//         5: "work", // 用于首页展示
//     };
//     typeObj = {
//         0: "others", //其他
//         1: "truck", //货车
//         2: "bus", //客车
//         3: "bus", //公交车
//         4: "bus", //旅游大巴
//     }
//     const status = statusObj[state];
//     const type = typeObj[vehicleType];
//     return require(`@/assets/img/carIcon/${type}_${status}.png`);
// }