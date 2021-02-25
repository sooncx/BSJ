import { Ref, unref, nextTick, ref, reactive, toRefs, inject } from 'vue';
import BMap from "BMap";// 引入百度地图
import BMapLib from "BMapLib";
// import styleJson from "../../../assets/js/BmapStyle";
import GPS from "@/assets/js/GPS";
import { message } from 'ant-design-vue';
import { getCarPng, AmapGetOneAddress } from "./mapFn";
import { GetGeo } from "@/api/apiFn";
// mapRef 地图实例
// centerPoint 地图中心点坐标
// zoom 默认缩放级别
// mapClick 是否关闭百度地图默认点击事件，阻止默认信息窗口弹出。
export function useBmap(mapRef: Ref<HTMLDivElement>, centerPoint = [114.410658, 33.113539], zoom = 10, mapClick = false,) {
    let map: any = null;
    let Cluster = inject("Cluster") as any; // 聚合开关标识
    let ClusterChangeFlag = ref(true);
    let updateCluster = inject("updateCluster") as Function;
    let updateSelectedVeh = inject("updateSelectedVeh") as Function; // 修改选中车辆
    let updateChoseAssociatedVehs = inject("updateChoseAssociatedVehs") as Function; // 修改选中关联车辆
    let mapObj = ref(null);
    let pathObj = ref(null) as any; // 绘图后返回的经纬度
    let TrafficInstance = null as any; // 路况图实例
    let ClusterInstance = null as any; // 聚合实例
    let DistanceToolObject = null as any;
    let infoBox = null as any;
    let markerMap = new Map() as any; // 当前地图点 V -> marker 映射数据，用于当点变化后获取上一次的点数据
    // let markerDataMap = new Map() as any; // 当前地图车辆 V -> vehInfo映射数据，用于当车辆变化后获取上一次的车辆数据
    let MapFn = inject("MapFn") as Function; // 地图操作函数
    let MapFnType = ref("开始绘制") as any;
    // -----------------------------------------------------------------------------------
    let Trackpolyline = null as any;
    let startMarker = null as any;
    let drawCircles = new Map();
    let AllPointInstance = null as any;
    let AllPoints = [] as any;
    let AllFences = [] as any;
    let homeMarker = [[], []] as any; // home停留点实例集合
    let companyMarker = [[], []] as any; // company停留点实例集合
    let normalMarker = [] as any; // 普通点实例集合
    let homeAndCompanyMarker = [] as any; // 停留点实例集合
    let TwoChargePoints = [[], []] as any; // 二押点实例集合
    let TwoChargePointInfowindow = null as any;
    let AssociateMarkers = [] as any; // 关联车辆点实例
    const data = reactive({
        mouseTool: null,
        overlays: []
    })
    const {
        BMAP_HYBRID_MAP,
        BMAP_NORMAL_MAP,
        BMAP_ANCHOR_BOTTOM_RIGHT,
        BMAP_DRAWING_MARKER,
        BMAP_DRAWING_CIRCLE,
        BMAP_DRAWING_POLYLINE,
        BMAP_DRAWING_POLYGON,
        BMAP_DRAWING_RECTANGLE } = window as any;
    let { mouseTool, overlays } = toRefs(data) as any;
    // 地图初始化
    function initMap() {
        nextTick(() => {
            if (!centerPoint) {
                centerPoint = [114.410658, 33.113539]
            }
            const res = GPS.gcj_encrypt(centerPoint[1], centerPoint[0]);
            const { lon, lat } = GPS.bd_encrypt(res.lat, res.lon);
            let mapInstance: any = unref(mapRef);
            if (!mapInstance || !unref(mapInstance)) {
                return;
            }
            map = new BMap.Map(mapInstance, { enableMapClick: mapClick });
            setCenterAndZoom([lon, lat], zoom); // 设置中心点和缩放级别
            setMinZoom(0); // 设置地图最小缩放级别
            setMaxZoom(18); // 设置地图最大缩放级别
            map.addControl(new BMap.ScaleControl()); // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
            // map.addControl(new BMap.NavigationControl({ offset: new BMap.Size(10, 80) })); // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
            // map.setMapStyleV2({ styleJson: styleJson }); // 地图底色
            mapObj.value = map;
        })
    }
    // 百度地图围栏设置中心点和缩放
    function setFenceZoom(item: any) {
        if (!item) return;
        let arr = [] as any;
        const list = item.pointList || item.pointList;
        if (!list) return;
        list.map((item: any) => {
            const res = GPS.gcj_encrypt(item.oriLat, item.oriLon);
            const { lon, lat } = GPS.bd_encrypt(res.lat, res.lon);
            arr.push(new BMap.Point(lon, lat));
        });
        map.setViewport(arr, {
            zoomFactor: -1,
        });
    };
    // 清除围栏
    function clearAllFences() {
        if (AllFences && AllFences.length > 0) {
            AllFences.map((item: any) => {
                map && map.removeOverlay(item);
            });
            AllFences = [];
        }
    }
    // 批量画围栏
    function drawAllFences(list: any) {
        clearAllFences();
        let arr = [] as any;
        list &&
            list.map((item: any, i: number) => {
                arr.push([]);
                item.pointList &&
                    item.pointList.map((items: any) => {
                        // 高德经纬度转百度地图显示
                        const mylat = items.oriLat;
                        const mylng = items.oriLon;
                        const res = GPS.gcj_encrypt(mylat, mylng);
                        const { lon, lat } = GPS.bd_encrypt(res.lat, res.lon);
                        arr[i].push(new BMap.Point(lon, lat));
                    });
            });
        let pointArr = [] as any;
        arr.map((item: any, i: number) => {
            const polygons = new BMap.Polygon([...item], {
                strokeColor: "#FF33FF",
                strokeWeight: 2,
                strokeOpacity: 0.2,
                fillOpacity: 0.4,
                fillColor: "#1791fc",
            });
            polygons.pathName = list[i].pathName;
            map.addOverlay(polygons); //增加多边形
            let label = null as any;
            polygons.addEventListener("mouseover", (e: any) => {
                let opts = {
                    position: e.point, // 指定文本标注所在的地理位置
                };
                label = new BMap.Label(e.target.pathName, opts); // 创建文本标注对象
                label.setStyle({
                    padding: ".25rem .25rem",
                    borderRadius: ".25rem",
                    backgroundColor: "white",
                    borderWidth: 0,
                    textAlign: "center",
                    fontSize: "12px",
                    color: "blue",
                });
                map.addOverlay(label);
            });
            polygons.addEventListener("mouseout", () => {
                label && map && map.removeOverlay(label);
            });
            AllFences.push(polygons);
            pointArr.push(...item);
        });
        map.setViewport(pointArr, {
            zoomFactor: -1,
        });
    };
    // 清除位置点
    function clearAllPoints(open = false) {
        // 开了聚合
        if (open) {
            AllPointInstance && AllPointInstance.clearMarkers();
            AllPointInstance = null;
            AllPoints = [];
        } else {
            // 没开聚合
            AllPointInstance && AllPointInstance.clearMarkers();
            AllPointInstance = null;
            AllPoints.map((item: any) => {
                map && map.removeOverlay(item)
            })
            AllPoints = [];
        }
    }
    // 聚焦到选中覆盖物
    function zoomOverlay(veh: any, type = "位置点", change = false) {
        if (type == "位置点") {
            if (!veh.oriLon) return;
            const { lon, lat } = GPS.bd_encrypt(veh.oriLat, veh.oriLon);
            map.centerAndZoom(new BMap.Point(lon, lat), 18);
        }
        else if (type == "围栏") {
            setFenceZoom(veh);
        }
        else if (type == "二押点") {
            if (!veh.lon || !veh.lat) return;
            let lon = veh.lon;
            let lat = veh.lat;
            if (change) {
                const res = GPS.gcj_encrypt(parseFloat(veh.lat), parseFloat(veh.lon));
                const res2 = GPS.bd_encrypt(res.lat, res.lon);
                lon = res2.lon;
                lat = res2.lat;
            } else {
                const res = GPS.bd_encrypt(veh.lat, veh.lon);
                lon = res.lon;
                lat = res.lat;
            }
            map.centerAndZoom(new BMap.Point(lon, lat), 18);
        }
    }
    // 设置中心点和缩放级别
    function setZoomAndCenter(zoom: number, point: any, change = true) {
        if (change) {
            const res = GPS.gcj_encrypt(point.lat, point.lng);
            const { lon, lat } = GPS.bd_encrypt(res.lat, res.lon);
            map.centerAndZoom(new BMap.Point(lon, lat), 18);
        } else {
            const { lon, lat } = GPS.gcj_encrypt(point.lat, point.lng);
            map.centerAndZoom(new BMap.Point(lon, lat), 18);
        }
    }
    // 清除所有二押点
    function clearAllTwoChargePoints() {
        TwoChargePoints[0].map((item: any) => {
            map && map.removeOverlay(item);
        });
        TwoChargePoints[1].map((item: any) => {
            map && map.removeOverlay(item);
        });
        TwoChargePoints = [[], []];
        map.closeInfoWindow();
    }
    // 批量绘制二押点
    function drawTwoChargePoints(list: any[]) {
        clearAllTwoChargePoints();
        let arr = [] as any;
        function setAddress(name: string, latlng: any) {
            let address = "暂无位置信息";
            // 转换成WGS-84再获取地址
            const res = GPS.gcj_decrypt_exact(latlng.lat, latlng.lon);
            AmapGetOneAddress({
                lat: res.lat,
                lng: res.lon,
            }).then((result: any) => {
                address = result.address;
                if (!["暂无位置信息", "获取位置失败"].includes(address)) {
                    address = "地址:" + address;
                }
                let opts = {
                    offset: new BMap.Size(0, -25),
                    title: "二押点:" + name
                };
                let content = `<div class='TwoChargePoints__AmapLabel'><p>${address}</p></div>`;
                TwoChargePointInfowindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象
                // 转成百度经纬度再设置中心位置
                const res2 = GPS.bd_encrypt(latlng.lat, latlng.lon);
                map.openInfoWindow(TwoChargePointInfowindow, new BMap.Point(res2.lon, res2.lat)); //开启信息窗口
            });
        }
        list && list.map(async (item) => {
            // 二押点
            // const { lon, lat } = GPS.gcj_encrypt(parseFloat(item.lat), parseFloat(item.lon));
            // 先转换成百度经纬度，再绘制点
            const { lon, lat } = GPS.bd_encrypt(item.lat, item.lon);
            const point = new BMap.Point(lon, lat);
            arr.push(point); // 用于聚焦
            let marker = new BMap.Marker(point, {
                offset: new BMap.Size(0, 0),
            });
            map.addOverlay(marker);
            marker.addEventListener("click", () => {
                setAddress(item.name, { lat: item.lat, lon: item.lon });
            });
            const circle = new BMap.Circle(new BMap.Point(lon, lat), parseFloat(item.radius), {
                fillColor: "#E0E0E0",   // 圆形填充颜色
                strokeColor: '#333', // 描边颜色
                strokeWeight: 1, // 描边宽度
            });
            map.addOverlay(circle);
            TwoChargePoints[0].push(marker);
            TwoChargePoints[1].push(circle);
        });
        setTimeout(() => {
            setAddress(list[0].name, { lat: list[0].lat, lon: list[0].lon });
            map.setViewport(arr, {
                zoomFactor: -1,
            });
        }, 0);
    }
    // 批量画信息点
    function drawAllPoints(list: any[], open = false) {
        clearAllPoints(open);
        let arr = [] as any;
        list && list.map((item) => {
            const { lon, lat } = GPS.bd_encrypt(item.oriLat, item.oriLon);
            const point = new BMap.Point(lon, lat);
            arr.push(point); // 用于聚焦
            let marker = new BMap.Marker(point, {
                offset: new BMap.Size(0, 0),
            }); // 创建点
            const label = new BMap.Label("", {
                offset: new BMap.Size(-20, 30),
            });
            const vehData = [item.oriLat, item.oriLon].join("-");
            let html = `<div class='AllPoints__AmapLabel'><p>${item.name}</p><span>|</span><a onmouseover="window.showAddress('${vehData}', event)" onmouseout="window.hideAddress(event)">详情</a></div>`;
            label.setContent(html);
            label.setStyle({
                border: "none",
            });
            marker.setLabel(label);
            AllPoints.push(marker);
            !open && map.addOverlay(marker);
        });
        setTimeout(() => {
            if (AllPoints.length > 0 && open) {
                AllPointInstance = new BMapLib.MarkerClusterer(map, {
                    markers: AllPoints,
                });
            }
            map.setViewport(arr);
        }, 0);
    }
    // 画圆形围栏
    function drawCircle(V: string | number, center: any, radius: number) {
        if (drawCircles.has(V)) {
            map && map.removeOverlay(drawCircles.get(V))
        }
        const res = GPS.gcj_encrypt(center.lat, center.lng);
        const { lon, lat } = GPS.bd_encrypt(res.lat, res.lon);
        const circle = new BMap.Circle(new BMap.Point(lon, lat), radius, {
            fillColor: 'rgba(0, 0, 0, 0.452)',   // 圆形填充颜色
            strokeColor: '#fff', // 描边颜色
            strokeWeight: 1, // 描边宽度
            fillOpacity: 0.7,
        });
        drawCircles.set(V, circle);
        map.addOverlay(circle);
    }
    //删除圆形围栏
    function deleteCircle(V: any, all = false) {
        if (all) {
            [...drawCircles.values()].map(item => {
                map && map.removeOverlay(item);
            })
        } else if (V instanceof Array) {
            [...drawCircles.keys()].map(item => {
                if (!V.includes(item)) {
                    map && map.removeOverlay(drawCircles.get(item))
                }
            })
        } else {
            map && map.removeOverlay(drawCircles.get(V))
        }
    }
    // 清除经常停留点
    function removeHomeAndCompany() {
        if (homeAndCompanyMarker.length > 0) {
            homeAndCompanyMarker.map((item: any) => {
                map && map.removeOverlay(item);
            })
        }
    }
    // 新建点标记
    function newMarker(centerPoint: any[], type = "normal", setLabel = true, change = true, zoomAllView = true) {
        nextTick(() => {
            // change用于判断是否需要做经纬度转换
            // type用于判断新建marker的类型
            // setLabel用于判断是否给marker添加label框
            // makerType用于判断停留点是home还是company
            let arr = [] as any;// 用于聚焦
            centerPoint.map((item: any) => {
                if (!item.lat || !item.lng) return;
                let mylat = item.lat;
                let mylon = item.lng;
                if (change) {
                    const res = GPS.gcj_encrypt(item.lat, item.lng);
                    const { lon, lat } = GPS.bd_encrypt(res.lat, res.lon);
                    mylat = lat;
                    mylon = lon;
                } else {
                    const { lon, lat } = GPS.gcj_encrypt(item.lat, item.lng);
                    mylat = lat;
                    mylon = lon;
                }
                // 若新建普通点
                if (type == "normal") {
                    normalMarker.length > 0 && map && map.removeOverlay(normalMarker);
                    normalMarker = [];
                    const point = new BMap.Point(mylon, mylon);
                    let marker = new BMap.Marker(point, {
                        offset: new BMap.Size(0, 0),
                    }); // 创建点
                    map.addOverlay(marker);
                    normalMarker.push(marker);
                    arr.push(point); // 用于聚焦
                    map.setViewport(arr);
                }
                // 若新建停留点 
                else if (type == "homeAndCompany") {
                    let icon = new BMap.Icon(
                        item.type == "company" ? require("@/assets/img/map/company.png") : require("@/assets/img/map/home.png"),
                        new BMap.Size(20, 32)
                    );
                    // 创建点
                    const point = new BMap.Point(mylon, mylat);
                    arr.push(point);
                    let marker = new BMap.Marker(point, {
                        offset: new BMap.Size(-10, -28),
                    });
                    marker.setIcon(icon);
                    !setLabel && setCircle();
                    if (item.type == "home") {
                        homeMarker[0].length > 0 && map && map.removeOverlay(homeMarker[0]);
                        homeMarker[0] = [];
                        homeMarker[0].push(marker)
                    } else if (item.type == "company") {
                        companyMarker[0].length > 0 && map && map.removeOverlay(companyMarker[0]);
                        companyMarker[0] = [];
                        companyMarker[0].push(marker);
                    }
                    const label = new BMap.Label("", {
                        offset: new BMap.Size(15, 35),
                    });
                    let html = `<div class='AllPoints__AmapLabel'><p>${item.name + "经常停车点"}</p><span>|</span>${item.type == "company" ? "公司" : "家"}</div>`;
                    label.setContent(html);
                    label.setStyle({
                        border: "none",
                        transform: "translateX(-50%)",
                    });
                    setLabel && marker.setLabel(label);
                    map.addOverlay(marker);
                    function setCircle() {
                        const circle = new BMap.Circle(new BMap.Point(mylon, mylat), 1000, {
                            fillColor: "#BBE9aa",   // 圆形填充颜色
                            strokeColor: '#fff', // 描边颜色
                            strokeWeight: 1, // 描边宽度
                        });
                        map.addOverlay(circle);
                        homeAndCompanyMarker.push(circle);
                        if (item.type == "home") {
                            homeMarker[1].length > 0 && map && map.removeOverlay(homeMarker[1]);
                            homeMarker[1] = [];
                            homeMarker[1].push(circle)
                        } else if (item.type == "company") {
                            companyMarker[1].length > 0 && map && map.removeOverlay(companyMarker[1]);
                            companyMarker[1] = [];
                            companyMarker[1].push(circle);
                        }
                    }
                    homeAndCompanyMarker.push(marker);
                    zoomAllView && map.setViewport(arr, {
                        zoomFactor: -1,
                    });
                }
            })
        })
    }
    // 滚轮缩放开关
    function mapScroll(open: Boolean) {
        nextTick(() => {
            open ? map.enableScrollWheelZoom() : map.disableScrollWheelZoom()
        })
    }
    // 百度地图模糊搜索
    function inputSearch() {
        function G(id: String) {
            return document.getElementById(id as any);
        }
        const ac = new BMap.Autocomplete({
            input: "suggestId",
            location: map,
        }); //建立一个自动完成的对象
        ac.addEventListener("onhighlight", (e: any) => {
            //鼠标放在下拉列表上的事件
            let str = "";
            let _value = e.fromitem.value || "";
            let value = "";
            if (e.fromitem.index > -1) {
                value =
                    _value.province +
                    _value.city +
                    _value.district +
                    _value.street +
                    _value.business;
            }
            str =
                "FromItem<br />index = " +
                e.fromitem.index +
                "<br />value = " +
                value;

            value = "";
            if (e.toitem.index > -1) {
                _value = e.toitem.value;
                value =
                    _value.province +
                    _value.city +
                    _value.district +
                    _value.street +
                    _value.business;
            }
            str +=
                "<br />ToItem<br />index = " +
                e.toitem.index +
                "<br />value = " +
                value;
            (G("searchResultPanel") as any).innerHTML = str;
        });
        let myValue = '';
        ac.addEventListener("onconfirm", (e: any) => {
            //鼠标点击下拉列表后的事件
            const _value = e.item.value;
            myValue =
                _value.province +
                _value.city +
                _value.district +
                _value.street +
                _value.business;
            (G("searchResultPanel") as any).innerHTML =
                "onconfirm<br />index = " +
                e.item.index +
                "<br />myValue = " +
                myValue;
            setPlace();
        });
        function setPlace() {
            map.clearOverlays(); //清除地图上所有覆盖物
            async function myFun() {
                const pp = await local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
                // const point = new BMap.Point(pp.lng, pp.lat);
                // map.panTo(point);
                map.centerAndZoom(pp, 12);
            }
            const local = new BMap.LocalSearch(map, {
                //智能搜索
                onSearchComplete: myFun,
            });
            local.search(myValue);
        }
    }
    // 绘图工具
    function mouseToolOpen() {
        nextTick(() => {
            const styleOptions = {
                strokeColor: "#1791fc", // 边线颜色
                fillColor: "skyblue", // 填充颜色。当参数为空时，圆形没有填充颜色
                strokeWeight: 1, // 边线宽度，以像素为单位
                strokeOpacity: 1, // 边线透明度，取值范围0-1
                fillOpacity: 0.4, // 填充透明度，取值范围0-1
                strokeStyle: "solid",
            };
            // 实例化鼠标绘制工具
            mouseTool = new BMapLib.DrawingManager(map, {
                // isOpen: true,        // 是否开启绘制模式
                enableCalculate: false, // 绘制是否进行测距测面
                enableSorption: true, // 是否开启边界吸附功能
                sorptiondistance: 20, // 边界吸附距离
                polygonOptions: styleOptions, // 多边形的样式
                rectangleOptions: styleOptions, // 矩形的样式
                circleOptions: styleOptions, // 圆形的样式
            });
            mouseTool.addEventListener("overlaycomplete", (e: any) => {
                // 给不同的绘制图形设置不同的类型标示，方便后期区分操作
                e.overlay.type = 'draw';
                overlays = [];
                // let arr: any = [];
                let path = [] as any;
                e.overlay.getPath().map((item: any) => {
                    // 百度地图画围栏后将经纬度转成高德经纬度存入数据库
                    const res = GPS.bd_decrypt(item.lat, item.lng);
                    const { lon, lat } = GPS.deltaOut(res.lat, res.lon);
                    // arr.push(new BMap.Point(lon, lat));
                    overlays.push({
                        lat: item.lat,
                        lng: item.lng,
                    });
                    path.push([lon, lat]);
                    pathObj.value = path;
                });
                setTimeout(() => {
                    mouseTool.close();
                    MapFn && MapFn(MapFnType.value, path);
                    // 绘制矩形后删除图形
                    for (let item of map.getOverlays()) {
                        if (item.type == 'draw') {
                            map && map.removeOverlay(item);
                        }
                    }
                    // map.setViewport(arr, {
                    //     zoomFactor: 0,
                    // })
                }, 100);
            });
        })
    }
    // 测距工具
    function DistanceToolOpen() {
        nextTick(() => {
            DistanceToolObject = new BMapLib.DistanceTool(map, { lineStroke: 2 });
            DistanceToolObject.addEventListener("drawend", (e: any) => {
            });
        })
    }
    // 绘制最新点 marker 点实例,  nowVehInfo 当前车辆信息
    function drawMarker(marker: any, nowVehInfo: any) {
        // 若该点已存在，则清除该点
        if (markerMap.has(nowVehInfo.V)) {
            map && map.removeOverlay(markerMap.get(nowVehInfo.V));
        }
        const label = new BMap.Label("", {
            offset: new BMap.Size(15, -40),
        });
        let html = `<div class="Bmap-infowindow"><span class="BmapLabel">${nowVehInfo.P}</span></div>`;
        label.setContent(html);
        marker.setLabel(label);
        label.setStyle({
            border: "none",
            transform: "translateX(-50%)",
        });
        map.addOverlay(marker);
    }
    //分批设置marker 图标和角度
    function batchSetContent(marker: any, item: any, changeNum = 0, num = 100, ms = 50) {
        //changeNum代表当前渲染到多少辆了， num代表每多少辆暂停会执行， ms代表暂停多少毫秒
        return new Promise<void>((resolve) => {
            let icon = null;
            icon = new BMap.Icon(
                getCarPng(item),
                new BMap.Size(32, 35)
            );
            marker.setIcon(icon);
            marker.setRotation(item.F || 0);
            if (changeNum % num === 0) {
                //每num辆则等ms再渲染
                setTimeout(() => {
                    resolve();
                }, ms);
            } else {
                resolve();
            }
        });
    }
    //分批设置marker位置
    function batchSetPosition(marker: any, position: any, changeNum = 0, num = 100, ms = 50) {
        //changeNum代表当前渲染到多少辆了， num代表每多少辆暂停会执行， ms代表暂停多少毫秒
        return new Promise<void>((resolve) => {
            marker.setPosition(new BMap.Point(position[0], position[1]));
            if (changeNum % num === 0) {
                //每num辆则等ms再渲染
                setTimeout(() => {
                    resolve();
                }, ms);
            } else {
                resolve();
            }
        });
    }
    // 绘制关联车辆点
    async function dwawAssociateMarker(list: any[]) {
        AssociateMarkers.length > 0 && AssociateMarkers.map((item: any) => {
            map && map && map.removeOverlay(item);
        });
        AssociateMarkers = [];
        if (list.length == 0) return;
        list.map((item: any) => {
            if (item.X && item.Y) {
                const res = GPS.gcj_encrypt(item.Y, item.X);
                const { lon, lat } = GPS.bd_encrypt(res.lat, res.lon);
                let icon = null;
                icon = new BMap.Icon(
                    require("../../../assets/img/map/glCarMark.png"),
                    new BMap.Size(26, 35)
                );
                const point = new BMap.Point(lon, lat);
                let marker = new BMap.Marker(point, {
                    icon: icon,
                    offset: new BMap.Size(0, 0),
                }); // 创建点
                AssociateMarkers.push(marker);
                marker.addEventListener("click", () => {
                    updateChoseAssociatedVehs(item);
                });
                map.addOverlay(marker);
            }
        })
    }
    //分批渲染函数 item 车辆数据， InfoWindowRef 信息窗口实例
    function batchMarker(item: any, selectedAllVehs: any, renderNum: any, InfoWindowRef: any, num = 1000, ms = 50) {
        //renderNum代表当前渲染到多少辆了， num代表每多少辆暂停会执行， ms代表暂停多少毫秒
        if (selectedAllVehs.size > 10 * num) {
            num = Math.ceil(selectedAllVehs.size / 10);
        }
        return new Promise<void>(async (resolve) => {
            const res = GPS.gcj_encrypt(item.Y, item.X);
            const { lon, lat } = GPS.bd_encrypt(res.lat, res.lon);
            let icon = null;
            icon = new BMap.Icon(
                getCarPng(item),
                new BMap.Size(32, 35)
            );
            const point = new BMap.Point(lon, lat);
            let marker = new BMap.Marker(point, {
                icon: icon,
                offset: new BMap.Size(0, 0),
            }); // 创建点
            const label = new BMap.Label("", {
                offset: new BMap.Size(15, -40),
            });
            marker.setRotation(item.F || 0); // 设置角度
            marker.extraData = { ...item };
            let html = `<div class="Bmap-infowindow"><span class="BmapLabel">${item.P}</span></div>`;
            label.setContent(html);
            marker.setLabel(label);
            label.setStyle({
                border: "none",
                transform: "translateX(-50%)",
            });
            marker.addEventListener("click", () => {
                updateSelectedVeh(item);
                zoomMarker(item, InfoWindowRef);
            });
            markerMap.set(item.V, marker);
            // markerDataMap.set(item.V, item);
            !Cluster.value && map.addOverlay(marker);
            if (renderNum % num === 0) {
                //每num辆则等ms再渲染
                setTimeout(() => {
                    resolve();
                }, ms);
            } else {
                resolve();
            }
        });
    }
    // 百度地图多车（非聚合）模式
    // selectedAllVehs 已选车辆集合, InfoWindowRef 自定义信息窗口ref, vehsLimit 限制聚合最小车辆数
    async function showAllVehs(selectedAllVehs: any, InfoWindowRef: any, vehsLimit: number) {
        nextTick(async () => {
            // 关闭点聚合并清除
            if (!Cluster.value) {
                ClusterInstance && ClusterInstance.clearMarkers();
                ClusterInstance = null;
            }
            //删除索引内不存在的车辆
            [...markerMap.keys()].map((V) => {
                if (!selectedAllVehs.has(V)) {
                    map && map.removeOverlay(markerMap.get(V)); // 清除不存在的车辆marker
                    markerMap.delete(V); // 从vehId -> marker 映射中删除不存在的车辆数据
                    // markerDataMap.delete(V);// 从vehId -> vehInfo 映射中删除不存在的车辆数据
                }
            });
            //添加或删除车辆
            let renderNum = 0;
            let changeNum = 0;
            const vehs = [...selectedAllVehs.values()]; // 所有已选车辆数据
            // 遍历所有已选车辆
            for (let i = 0; i < vehs.length; i++) {
                const nowVehInfo = { ...vehs[i] }; //复制防止内存泄露
                //如果markerMap内存有该车辆，即该车已经在地图上绘制marker，再判断存在车辆的数值是否发生变化，若变化，则更新车辆marker对应属性（不重绘！）
                if (markerMap.has(nowVehInfo.V)) {
                    const res = GPS.gcj_encrypt(nowVehInfo.Y, nowVehInfo.X);
                    const { lon, lat } = GPS.bd_encrypt(res.lat, res.lon);
                    const marker = markerMap.get(nowVehInfo.V);
                    const oldVehInfo = marker.extraData;
                    // markerDataMap.get(nowVehInfo.V); //获取旧数据
                    marker.extraData = nowVehInfo;
                    // markerDataMap.set(nowVehInfo.V, nowVehInfo); //设置最新数据
                    //超过数量限制则代表开聚合
                    vehs.length > vehsLimit
                        ? map && map.removeOverlay(marker)
                        : drawMarker(marker, nowVehInfo);

                    if (
                        nowVehInfo.X !== oldVehInfo.X ||
                        nowVehInfo.Y !== oldVehInfo.Y
                    ) {
                        //位置改变时才设置车辆位置
                        changeNum++;
                        await batchSetPosition(
                            marker,
                            [lon, lat],
                            changeNum,
                            50,
                            50
                        );
                    }

                    if (
                        nowVehInfo.state !== oldVehInfo.state ||
                        nowVehInfo.vehicleType != oldVehInfo.vehicleType ||
                        nowVehInfo.F != oldVehInfo.F
                    ) {
                        //如果图片信息有变化则重新设置图片
                        changeNum++;
                        await batchSetContent(
                            marker,
                            nowVehInfo,
                            changeNum,
                            50,
                            50
                        );
                    }
                } else {
                    //如果markerMap内没存有该车辆， 则在地图上绘制该车辆marker
                    renderNum++;
                    await batchMarker(nowVehInfo, selectedAllVehs, renderNum, InfoWindowRef, 1000, 50); //分批渲染
                }
            }
            // 若选中车辆数超出限制，则开启聚合模式绘制车辆marker
            if (!Cluster.value && selectedAllVehs.size > vehsLimit) {
                ClusterChangeFlag.value = false;
                updateCluster(true); // 聚合表识设为true
                message.warning(
                    `由于地图车辆超过${vehsLimit}辆, 开启聚合以优化性能`
                );
                setTimeout(() => {
                    ClusterChangeFlag.value = true;
                }, 500);
            }
            // 绘制完所有车辆marker后,再进行聚合和非聚合操作，因为聚合操作中需要先创建marker，与非聚合中的创建marker操作重复，
            // 所以将创建/修改marker操作统一提前，最后进行聚合。
            Cluster.value && toggleCluster(selectedAllVehs, InfoWindowRef, vehsLimit);
        })
    }
    // 百度地图聚合模式（聚合模式的marker在batchMarker函数中先创建）
    function ClusterOpen() {
        // 清除非聚合模式车辆marker
        [...markerMap.values()].map((item) => {
            map && map.removeOverlay(item);
        });
        // 重置聚合实例
        ClusterInstance && ClusterInstance.clearMarkers();
        ClusterInstance = null;
        let arr: any = [];
        [...markerMap.values()].map((marker) => {
            const label = new BMap.Label("", {
                offset: new BMap.Size(15, -40),
            });
            let html = `<div class="Bmap-infowindow"><span class="BmapLabel">${marker.extraData.P
                }</span></div>`;
            label.setContent(html);
            marker.setLabel(label);
            label.setStyle({
                border: "none",
                transform: "translateX(-50%)",
            });
            arr.push(marker);
        });
        ClusterInstance = new BMapLib.MarkerClusterer(map, {
            markers: [...arr],
        });
    }
    // 聚合开关
    function toggleCluster(selectedAllVehs: any, InfoWindowRef: any, vehsLimit: number) {
        nextTick(() => {
            // 聚合开
            if (Cluster.value) {
                ClusterOpen();
            }
            // 聚合关
            else {
                showAllVehs(selectedAllVehs, InfoWindowRef, vehsLimit);
            }
        })
    }
    // 关闭信息窗口
    function closeInfoWindow() {
        infoBox && infoBox.close && infoBox.close();
    }
    // 聚焦到选中车辆
    function zoomMarker(veh: any, InfoWindowRef: any, track = true) {
        nextTick(async () => {
            if (!veh) return;
            infoBox && infoBox.close && infoBox.close();
            infoBox = null;
            if (!InfoWindowRef) await nextTick();
            const res = GPS.gcj_encrypt(veh.Y, veh.X);
            const { lon, lat } = GPS.bd_encrypt(res.lat, res.lon);
            infoBox = new BMapLib.InfoBox(map, InfoWindowRef.value.$el, {
                // closeIconMargin: "9px 19px 0 0",
                closeIconUrl: require("../../../assets/img/map/close.png"),
                boxStyle: {
                    // width: "450px",
                    // height: "400px",
                    // boxShadow: "0px 4px 10px 2px #00000030",
                    // background: "red",
                    pointerEvents: 'auto',
                },
                offset: new BMap.Size(0, 3),
            });
            const point = new BMap.Point(lon, lat);
            let marker = new BMap.Marker(point, {
                offset: new BMap.Size(0, 0),
            }); // 创建点
            // let marker = new BMap.Marker(new BMap.Point(lon, lat));
            infoBox.open(marker);
            const imgDom: any = document
                .getElementsByClassName("infoBox")[0]
                .getElementsByTagName("img")[0];
            if (imgDom) {
                imgDom.style = "display: none";
            }
            // map.panTo(new BMap.Point(lon, lat));
            track && map.centerAndZoom(new BMap.Point(lon, lat), 17);

        })
    }
    // 绘制矩形
    function drawRectangle(MyMapFnType = null, type = "rectangle") {
        MyMapFnType && (MapFnType.value = MyMapFnType);
        pathObj.value = null;
        for (let item of map.getOverlays()) {
            if (item.type == 'draw') {
                map && map.removeOverlay(item);
            }
        }
        mouseTool.open();
        overlays = [];
        draw(type);
    }
    function getDistance(open = false) {
        if (open) {
            DistanceToolObject.open();
        } else {
            DistanceToolObject.close();
        }
    }
    // 鼠标样式
    function cursorStyle(type = "crosshair") {
        const body: any = document.getElementsByClassName("BMap_mask")[0];
        body.style.cursor = type;
    }
    // 设置地图最小缩放级别
    function setMinZoom(minZoom: number) {
        map.setMinZoom(minZoom);
    }
    // 设置地图最大缩放级别
    function setMaxZoom(maxZoom: number) {
        map.setMaxZoom(maxZoom);
    }
    // 设置中心点和缩放级别
    function setCenterAndZoom(centerPoint: number[], zoom: number) {
        const point = new BMap.Point(centerPoint[0], centerPoint[1]);
        map.centerAndZoom(point, zoom); // 设置中心点和缩放级别
    }
    // 清空地图
    function clearMap() {
        map && map.clearOverlays && map.clearOverlays();
    }
    function draw(type: string) {
        switch (type) {
            case 'polygon': {
                mouseTool.setDrawingMode(BMAP_DRAWING_POLYGON);
                break;
            }
            case 'rectangle': {
                mouseTool.setDrawingMode(BMAP_DRAWING_RECTANGLE);
                break;
            }
            case 'circle': {
                mouseTool.setDrawingMode(BMAP_DRAWING_CIRCLE);
                break;
            }
            default:
                break;
        }
    }
    // 百度地图卫星图
    function setSatellite(mapType = "Bmap", Satellite = false) {
        nextTick(() => {
            if (mapType != "Bmap") return;
            if (Satellite) {
                map && map.setMapType(BMAP_HYBRID_MAP);
            } else {
                map && map.setMapType(BMAP_NORMAL_MAP);
            }
        })
    }
    // 百度路况图
    function SetTraffic(mapType = "Bmap", Traffic = false) {
        nextTick(() => {
            if (mapType != "Bmap") return;
            if (TrafficInstance == null) {
                TrafficInstance = new BMapLib.TrafficControl({
                    showPanel: false //是否显示路况提示面板
                });
                map && map.addControl(TrafficInstance);
                TrafficInstance.setAnchor(BMAP_ANCHOR_BOTTOM_RIGHT);
                if (document.getElementById("tcBtn")) {
                    (document.getElementById("tcBtn") as any).style = "display:none"; //隐藏路况按钮
                }
                if (document.getElementById("tcWrap")) {
                    (document.getElementById("tcWrap") as any).style = "display:none"; // 隐藏路况图信息面板
                }
                if (document.getElementById("tcWrap_mobile")) {
                    (document.getElementById("tcWrap_mobile") as any).style = "display:none"; // 隐藏路况图信息面板
                }
            }
            if (Traffic) {
                TrafficInstance.show();
            } else {
                TrafficInstance.hide();
            }
        })
    }
    function track(path: any[], veh: any, flag = true) {
        if (flag) {
            startMarker && map && map.removeOverlay(startMarker);
            startMarker = null;
            Trackpolyline && map && map.removeOverlay(Trackpolyline);
            Trackpolyline = null;
            let pathArr = [] as any;
            path.map((item) => {
                const res = GPS.gcj_encrypt(item.Y, item.X);
                const { lon, lat } = GPS.bd_encrypt(res.lat, res.lon);
                pathArr.push(new BMap.Point(lon, lat));
            });
            startMarker = new BMap.Marker(
                new BMap.Point(pathArr[0].lng, pathArr[0].lat), //起始点的经纬度
                {
                    icon: new BMap.Icon(
                        require("@/assets/img/map/start.png"),
                        new BMap.Size(36, 36),
                        {
                            imageOffset: new BMap.Size(0, 0), //图片的偏移量。为了是图片底部中心对准坐标点。
                        }
                    )
                }
            );
            Trackpolyline = new BMap.Polyline(pathArr, {
                strokeColor: "#3d79f8", // 线颜色
                strokeOpacity: 1, // 线透明度
                strokeWeight: 2, // 线宽
                strokeStyle: "solid", // 线样式
            });
            map.addOverlay(startMarker);
            map.addOverlay(Trackpolyline);
            const marker = markerMap.get(veh.V);
            // 重绘marker的位置
            batchSetPosition(
                marker,
                [pathArr[pathArr.length - 1].lng, pathArr[pathArr.length - 1].lat]
            );
            // 重绘marker的方向
            batchSetContent(
                marker,
                veh
            );
        } else {
            startMarker && map && map.removeOverlay(startMarker);
            startMarker = null;
            Trackpolyline && map && map.removeOverlay(Trackpolyline);
            Trackpolyline = null;
        }
    }
    return {
        mapObj,
        initMap,
        clearMap,
        setCenterAndZoom,
        setMinZoom,
        setMaxZoom,
        setSatellite,
        SetTraffic,
        getDistance,
        drawRectangle,
        zoomMarker,
        DistanceToolOpen,
        mouseToolOpen,
        toggleCluster,
        showAllVehs,
        closeInfoWindow,
        ClusterChangeFlag,
        track,
        mapScroll,
        inputSearch,
        drawCircle,
        deleteCircle,
        drawAllPoints,
        clearAllPoints,
        zoomOverlay,
        drawAllFences,
        clearAllFences,
        setFenceZoom,
        removeHomeAndCompany,
        newMarker,
        drawTwoChargePoints,
        clearAllTwoChargePoints,
        setZoomAndCenter,
        dwawAssociateMarker,
        ...toRefs(data)
    }
}