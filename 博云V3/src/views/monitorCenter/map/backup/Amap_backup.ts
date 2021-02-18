import { Ref, unref, nextTick, watch, ref, reactive, toRefs, inject } from 'vue';
import AMap from "AMap";// 引入高德地图
import GPS from "@/assets/js/GPS";
import { message } from 'ant-design-vue';
import { getMapZoom, calculateCenter } from "./mapFn";
import { GetGeo } from "@/api/apiFn";
import { add } from '@/views/manageData/pages/userManage/components/userTable';
// mapRef 地图实例
// centerPoint 地图中心点坐标
// zoom 默认缩放级别
// 高德地图的各种实例不能是Proxy数据!!!!!!!!!!
export function useAmap(mapRef: Ref<HTMLDivElement>, centerPoint = [114.410658, 33.113539], zoom = 10) {
    let map = ref(null) as any;
    let mapObj = ref(null) as any;
    let inputSearchObj = ref(new Map()) as any;
    let drawType = ref("");
    let ClusterChangeFlag = ref(true); // 是否允许聚合切换标识
    let Cluster = inject("Cluster") as any; // 聚合开关标识
    let updateCluster = inject("updateCluster") as Function;
    let MapFn = inject("MapFn") as Function; // 地图操作函数
    let pathObj = ref(null) as any; // 绘图后返回的经纬度
    let vehInfo = ref(null) as any;
    let drawPointsObj = ref(null) as any;
    // -----------------------------------------------------------------
    let SatelliteInstance = null as any; // 卫星图实例
    let TrafficInstance = null as any; // 路况图实例
    let ClusterInstance = null as any; // 聚合实例
    let infoWindow = null as any;
    let markerMap = new Map(); // 当前地图点 车辆id -> marker 映射数据，用于当点变化后获取上一次的点数据
    let ClusterMarkerMap = new Map(); // 当前地图点 车辆id -> 聚合数据，用于当点变化后获取上一次的点数据
    let Trackpolyline = null as any;
    let startMarker = null as any;
    let clickMarker = null as any;
    let drawPoints = [];
    let drawCircles = new Map();
    let AllPointInstance = null as any;
    let AllPoints = [] as any;
    let AllFences = [] as any;
    let FenceName = null as any;
    const data = reactive({
        mouseTool: null,
        DistanceToolObject: null,
        overlays: []
    })
    let { mouseTool, DistanceToolObject, overlays } = toRefs(data) as any;
    // 地图初始化
    function initMap() {
        nextTick(() => {
            if (!centerPoint) {
                centerPoint = [114.410658, 33.113539]
            }
            // gps转火星经纬度
            const { lon, lat } = GPS.gcj_encrypt(centerPoint[1], centerPoint[0]);
            const mapInstance: any = unref(mapRef);
            if (!mapInstance || !unref(mapInstance)) {
                return;
            }
            map = new AMap.Map(mapInstance, {
                resizeEnable: true,
                center: [lon, lat],
                zoom: zoom
            });
            // const toolbar = new AMap.ToolBar({ offset: new AMap.Pixel(0, 50) });
            // map.addControl(toolbar);
            mapObj.value = map;
        })
    }
    // 画圆形围栏
    function drawCircle(V: string | number, center: number[], radius: number) {
        console.log("画圆形");
        if (drawCircles.has(V)) {
            map.remove(drawCircles.get(V))
        }
        const { lon, lat } = GPS.bd_encrypt(center[1], center[0]);
        const circle = new AMap.Circle({
            center: new AMap.LngLat(lon, lat),  // 圆心位置
            radius: radius, // 圆半径
            fillColor: 'rgba(0, 0, 0, 0.452)',   // 圆形填充颜色
            strokeColor: '#fff', // 描边颜色
            strokeWeight: 1, // 描边宽度
        });
        drawCircles.set(V, circle);
        map.add(circle);
    }
    //删除圆形围栏
    function deleteCircle(V: string | number, all = false) {
        if (all) {
            [...drawCircles.values()].map(item => {
                map.remove(item);
            })
        } else {
            map.remove(drawCircles.get(V))
        }
    }
    // 高德地图设置围栏中心点和缩放级别
    function setFenceZoom(item: any) {
        let arr = [] as any;
        if (!item) return;
        const list = item.pointList;
        if (!list) return;
        list.map((item: any) => {
            arr.push({
                lng: item.oriLon,
                lat: item.oriLat,
            });
        });
        let p1 = [arr[0].lng, arr[0].lat];
        let p2 = [
            arr[Math.ceil(arr.length / 2)].lng,
            arr[Math.ceil(arr.length / 2)].lat,
        ];
        // 返回 p1 到 p2 间的地面距离，单位：米
        let dis = AMap.GeometryUtil.distance(p1, p2) / 1000;

        // 设置缩放级别和中心点
        map.setZoomAndCenter(getMapZoom(dis), [
            calculateCenter(arr).lng,
            calculateCenter(arr).lat,
        ], true);
    }
    // 清除围栏
    function clearAllFences() {
        AllFences && map.remove(AllFences);
        AllFences = [];
    }
    // 批量画围栏
    function drawAllFences(list: any[]) {
        clearAllFences();
        let arr = [] as any;
        function showInfoOut() {
            map.remove(FenceName);
        };
        function showInfoOver(e: any) {
            FenceName = new AMap.Text({
                text: e.target._opts.name,
                anchor: "center", // 设置文本标记锚点
                draggable: true,
                cursor: "pointer",
                style: {
                    padding: ".25rem .25rem",
                    "margin-top": "-15px",
                    "border-radius": ".25rem",
                    "background-color": "white",
                    "border-width": 0,
                    "text-align": "center",
                    "font-size": "12px",
                    color: "blue",
                },
                position: [e.lnglat.lng, e.lnglat.lat],
            });
            FenceName.setMap(map);
        };
        list && list.map((item: any) => {
            let path = [] as any;
            item.pointList && item.pointList.map((items: any) => {
                path.push([items.oriLon, items.oriLat]);
            });
            arr.push({
                name: item.pathName,
                path: path
            });
        });
        arr.forEach((item: any) => {
            const polygons = new AMap.Polygon({
                path: item.path,
                name: item.name,
                strokeColor: "#FF33FF",
                strokeWeight: 2,
                strokeOpacity: 0.2,
                fillOpacity: 0.4,
                fillColor: "#1791fc",
                zIndex: 50,
            });
            polygons.on("mouseover", showInfoOver);
            polygons.on("mouseout", showInfoOut);
            polygons.setMap(map);
            AllFences.push(polygons);
        });
        // 缩放地图到合适的视野级别
        map.setFitView([...AllFences], true);
    }
    // 清除位置点
    function clearAllPoints(open = false) {
        if (open) {
            AllPointInstance && AllPointInstance.clearMarkers();
            AllPointInstance = null;
            AllPoints = [];
        } else {
            AllPointInstance && AllPointInstance.clearMarkers();
            AllPointInstance = null;
            // AllPoints.map((item: any) => {
            //     map.remove(item)
            // })
            map.remove(AllPoints);
            AllPoints = [];
        }
    }
    // 聚焦到选中覆盖物
    function zoomOverlay(veh: any, type = "位置点") {
        if (type == "位置点") {
            if (!veh.oriLon) return;
            map.setZoomAndCenter(18, [veh.oriLon, veh.oriLat], true);
        }
    }
    // 批量画信息点
    function drawAllPoints(list: any[], open = false) {
        // 清除所有点
        clearAllPoints(open);
        // const geocoder = new AMap.Geocoder({
        //     city: "010", //城市设为北京，默认：“全国”
        //     radius: 1000, //范围，默认：500
        // });
        list && list.map(async (item) => {
            let marker = new AMap.Marker({
                position: [
                    item.oriLon,
                    item.oriLat,
                ],
                offset: new AMap.Pixel(-12, -12),
                zIndex: 101,
                map: map,
            });
            // await geocoder.getAddress(marker.getPosition(), (status: any, result: any) => {
            //     if (status === "complete" && result.regeocode) {
            //         address =
            //             result.regeocode.formattedAddress || "获取位置信息失败";
            //     }
            // });
            const vehData = [item.oriLat, item.oriLon].join("-");
            marker.setLabel({
                offset: new AMap.Pixel(0, 55), //设置文本标注偏移量
                content: `<div class='AllPoints__AmapLabel'><p>${item.name}</p><span>|</span><a onmouseenter="window.showAddress('${vehData}', event)" onmouseleave="window.hideAddress(event)">详情</a></div>`, //设置文本标注内容
                direction: "bottom", //设置文本标注方位
            });
            AllPoints.push(marker);
        });
        setTimeout(() => {
            if (AllPoints.length > 0 && open) {
                AllPointInstance = new AMap.MarkerClusterer(
                    map,
                    AllPoints,
                    { gridSize: 80 }
                );
            }
            map.setFitView([...AllPoints], true); //地图自适应
        }, 0);
    }
    // 高德地图点击事件
    function drawClickMarker() {
        map.on("click", (e: any) => {
            map.clearMap();
            initAmapMarker(e);
        });
    }
    // 高德地图点击地图画点
    function initAmapMarker(e: any) {
        clickMarker = new AMap.Marker({
            position: e.lnglat,
            // 设置是否可以拖拽
            draggable: true,
            cursor: "move",
            // 设置拖拽效果
            raiseOnDrag: true,
        });
        let selected_e = e;
        drawPoints = [];
        drawPoints.push(selected_e.lnglat);
        clickMarker.on("dragend", (e: any) => {
            map.setZoomAndCenter(
                map.getZoom(),
                clickMarker.getPosition(),
                true
            );
            selected_e = e;
            drawPoints = [];
            drawPoints.push(selected_e.lnglat);
        });
        clickMarker.setMap(map);
        // map.setFitView();
        map.setZoomAndCenter(map.getZoom(), clickMarker.getPosition(), true);
        drawPointsObj.value = drawPoints;
    }
    // 地址查询定位
    function inputSearch(keyword: String, showMarker = false, marker = null as any) {
        nextTick(() => {
            // 输入提示
            AMap.plugin(
                ["AMap.Autocomplete", "AMap.PlaceSearch", "AMap.ToolBar"],
                () => {
                    const autoOptions = {
                        input: keyword, //使用联想输入的input的id
                    };
                    const autocomplete = new AMap.Autocomplete(autoOptions);
                    const placeSearch = new AMap.PlaceSearch({
                        map: map,
                    });
                    AMap.event.addListener(autocomplete, "select", function (e: any) {
                        // /TODO 针对选中的poi实现自己的功能
                        placeSearch.setCity(e.poi.adcode);
                        console.log(e);
                        setTimeout(() => {
                            inputSearchObj.value.set(keyword, e);
                        }, 100);
                        if (marker) {
                            map.remove(marker)
                            marker = null;
                        }
                        if (showMarker) {
                            if (!e.poi.location) {
                                message.warning(
                                    "地址不够详细，无法确定具体位置！"
                                );
                            } else {
                                marker = new AMap.Marker({
                                    map: map,
                                    position: [e.poi.location.lng, e.poi.location.lat], // 位置
                                });
                            }
                        }
                        placeSearch.search(e.poi.name, () => {
                            // placeSearch.clear();
                            if (placeSearch) {
                                placeSearch.clear();
                                if (placeSearch.render) {
                                    placeSearch.render.markerList.clear();
                                }
                            }
                        });
                    });
                }
            );
        })
    }
    // 点标记
    function newMarker(centerPoint: any[], change = true) {
        nextTick(() => {
            // change用于判断是否需要做经纬度转换
            if (change) {
                const { lon, lat } = GPS.gcj_encrypt(centerPoint[1], centerPoint[0]);
                new AMap.Marker({
                    map: map,
                    position: [lon, lat], // 位置
                });
            } else {
                new AMap.Marker({
                    map: map,
                    position: [centerPoint[0], centerPoint[1]], // 位置
                });
            }
            map.setFitView([], true);
        })
    }
    //分批设置marker 图标和角度
    function batchSetContent(marker: any, item: any, changeNum = 0, num = 100, ms = 50) {
        //changeNum代表当前渲染到多少辆了， num代表每多少辆暂停会执行， ms代表暂停多少毫秒
        return new Promise((resolve) => {
            marker.setContent(
                `<img style="width: 32px;height:35px;transform: rotate(${item.F || 0
                }deg);" src="${require("../../../assets/img/car/car_online.png")}" />`
            );
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
        return new Promise((resolve) => {
            marker.setPosition(new AMap.LngLat(...position));
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
    //分批渲染marker
    function batchMarker(item: any, selectedAllVehs: any, vehsLimit: number, renderNum: number, num = 1000, ms = 50) {
        //renderNum代表当前渲染到多少辆了， num代表每多少辆暂停会执行， ms代表暂停多少毫秒
        if (selectedAllVehs.size > 10 * num) {
            num = Math.ceil(selectedAllVehs.size / 10);
        }
        return new Promise((resolve) => {
            const { lon, lat } = GPS.gcj_encrypt(item.Y, item.X);
            let marker = new AMap.Marker({
                map: selectedAllVehs.size > vehsLimit ? null : map,
                position: [lon, lat], // 位置
                offset: new AMap.Pixel(-16, -17.5), // 设置图标偏移度
                content: `<img style="width: 32px;height:35px;transform: rotate(${item.F || 0
                    }deg);" src="${require('../../../assets/img/car/car_online.png')}" />`,
                extData: item,
            });
            // label默认蓝框白底左上角显示，样式className为：amap-marker-label
            marker.setLabel({
                offset: new AMap.Pixel(0, 33),  //设置文本标注偏移量
                content: `<div class="Amap-infowindow"><span class="AmapLabel">${item.P}</span></div>`, //设置文本标注内容
                direction: 'top' //设置文本标注方位
            });
            marker.on("click", () => {
                //更新车辆信息
                vehInfo.value = Object.freeze(item);
                item.V === vehInfo.value.V && infoWindow.open(map);
            });
            markerMap.set(item.V, marker);
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
    // 渲染marker入口
    async function showAllVehs(selectedAllVehs: any, vehsLimit: number) {
        nextTick(async () => {
            //清除点聚合
            if (!Cluster.value) {
                ClusterInstance && ClusterInstance.clearMarkers();
                ClusterInstance = null;
            }
            // 清除地图上所有非聚合车辆marker
            // [...markerMap.values()].map((item) => {
            //     map.remove(item);
            // });
            //删除索引内不存在的车辆
            [...markerMap.keys()].map((V) => {
                if (!selectedAllVehs.has(V)) {
                    markerMap.get(V).setMap(null);
                    markerMap.delete(V);
                }
            });
            //添加或删除车辆
            let renderNum = 0;
            let changeNum = 0;
            const vehs = [...selectedAllVehs.values()];
            for (let i = 0; i < vehs.length; i++) {
                const nowVehInfo = { ...vehs[i] }; //复制防止内存泄露
                //如果markerMap内存有该车辆
                if (markerMap.has(nowVehInfo.V)) {
                    const { lon, lat } = GPS.gcj_encrypt(nowVehInfo.Y, nowVehInfo.X);
                    const marker = markerMap.get(nowVehInfo.V);
                    const oldVehInfo = marker.getExtData(); //获取旧数据
                    marker.setExtData(nowVehInfo); //设置最新数据

                    //超过数量限制则代表开聚合，不setMap影响性能
                    vehs.length > vehsLimit
                        ? marker.setMap(null)
                        : marker.setMap(map);
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
                            500,
                            50
                        );
                    }

                    if (
                        // nowVehInfo.state !== oldVehInfo.state ||
                        // nowVehInfo.vehicleType != oldVehInfo.vehicleType || 
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
                    //如果markerMap内没存有该车辆
                    renderNum++;
                    await batchMarker(nowVehInfo, selectedAllVehs, vehsLimit, renderNum, 1000, 50); //分批渲染
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
            //设置点聚合
            Cluster.value && toggleCluster(selectedAllVehs, vehsLimit);
        })
    }
    // marker聚焦
    function zoomMarker(veh: any, InfoWindowRef: any) {
        nextTick(async () => {
            if (!veh) return;
            if (!InfoWindowRef) await this.$nextTick();
            console.log("zoomMarker");
            const { lon, lat } = GPS.gcj_encrypt(veh.Y, veh.X);
            infoWindow = new AMap.InfoWindow({
                offset: new AMap.Pixel(0, -30),
                isCustom: true,
                autoMove: false,
                content: InfoWindowRef.value.$el,
            });
            infoWindow.open(map, [lon, lat]);
            map.setCenter([lon, lat]);
            map.panBy(0, 30);
        })
    }
    // 关闭弹窗
    function closeInfoWindow() {
        infoWindow.close();
    }
    // 聚合开关
    function ClusterOpen() {
        // 清除非聚合模式车辆marker
        [...markerMap.values()].map((item) => {
            map.remove(item);
        });
        if (ClusterInstance) {
            ClusterInstance.setMarkers([...markerMap.values()]);
        } else {
            markerMap.size > 0 &&
                (ClusterInstance = new AMap.MarkerClusterer(
                    map,
                    [...markerMap.values()],
                    { maxZoom: 17, gridSize: 80 }
                ));
        }
    }
    //设置点聚合
    function toggleCluster(selectedAllVehs: any, vehsLimit: number) {
        nextTick(() => {
            if (Cluster.value) {
                ClusterOpen();
            } else {
                showAllVehs(selectedAllVehs, vehsLimit);
            }
        })
    }
    // 绘图工具
    function mouseToolOpen(hide = false) {
        nextTick(() => {
            mouseTool = new AMap.MouseTool(map);
            mouseTool.on('draw', ({ obj }: any) => {
                if (drawType.value == 'circle') {
                    overlays.push(obj);
                    setTimeout(() => {
                        map.setFitView(overlays, true);
                        // pathObj.value = obj;
                        console.log(obj);
                        hide ? mouseTool.close(true) : mouseTool.close(false);
                        cursorStyle("")
                    }, 100);
                    return;
                }
                overlays.push(obj);
                const path: any = obj[
                    Object.keys(obj).find(
                        (p: any) => obj[p] && obj[p].path && obj[p].path.length > 2
                    ) as any
                ].path;
                setTimeout(() => {
                    map.setFitView(overlays, true);
                    pathObj.value = path;
                    MapFn && MapFn("区域查车", path);
                    hide ? mouseTool.close(true) : mouseTool.close(false);
                    cursorStyle("")
                }, 100);
            })
        })
    }
    // 测距工具
    function DistanceToolOpen() {
        nextTick(() => {
            DistanceToolObject = new AMap.RangingTool(map);
            DistanceToolObject.on("end", function () { DistanceToolObject.turnOff(); });
        })
    }
    // 测距
    function getDistance(open = false) {
        DistanceToolObject && map.remove(DistanceToolObject);
        if (open) {
            DistanceToolObject.turnOn();
        } else {
            DistanceToolObject.turnOff();
        }
    }
    // 绘制矩形
    function drawRectangle(type = "rectangle") {
        drawType.value = type;
        pathObj.value = null;
        cursorStyle();
        // mouseTool.close(true);
        map.remove(overlays);
        overlays = [];
        draw(type);
    }
    // 鼠标样式
    function cursorStyle(type = "crosshair") {
        const body: any = document.getElementsByClassName("amap-maps")[0];
        body.style.cursor = type;
    }
    function draw(type: string) {
        switch (type) {
            case 'polygon': {
                mouseTool.polygon({
                    strokeColor: "#1791fc",
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: "skyblue",
                    fillOpacity: 0.4,
                    strokeStyle: "solid",
                });
                break;
            }
            case 'rectangle': {
                mouseTool.rectangle({
                    strokeColor: "#1791fc",
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: "skyblue",
                    fillOpacity: 0.4,
                    strokeStyle: "solid",
                });
                break;
            }
            case 'circle': {
                mouseTool.circle({
                    strokeColor: "#1791fc",
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: "skyblue",
                    fillOpacity: 0.4,
                    strokeStyle: "solid",
                });
                break;
            }
            default:
                break;
        }
    }
    // 设置中心点和缩放级别
    function setZoomAndCenter(zoom: number, point: number[]) {
        map.setZoomAndCenter(zoom, point, true);
    }
    function clearMap() {
        console.log("clearAmap");
        map && map.clearMap && map.clearMap();
    }
    // 高德地图卫星图
    function setSatellite(mapType = "Amap", Satellite = false) {
        nextTick(() => {
            console.log(mapType, Satellite, "Amap_卫星");
            if (mapType != "Amap") return;
            if (SatelliteInstance == null) {
                SatelliteInstance = new AMap.TileLayer.Satellite();
                map && SatelliteInstance.setMap(map);
            }
            if (Satellite) {
                SatelliteInstance.show();
            } else {
                SatelliteInstance.hide();
            }
        })
    }
    // 高德路况图
    function SetTraffic(mapType = "Amap", Traffic = false) {
        nextTick(() => {
            console.log(mapType, Traffic, "Amap_路况");
            if (mapType != "Amap") return;
            if (TrafficInstance == null) {
                TrafficInstance = new AMap.TileLayer.Traffic({
                    zIndex: 10
                });
                map && TrafficInstance.setMap(map);
            }
            if (Traffic) {
                TrafficInstance.show();
            } else {
                TrafficInstance.hide();
            }
        })
    }
    // 追踪
    function track(path: any[], veh: any, flag = true) {
        // 开启追踪
        if (flag) {
            startMarker && map.remove(startMarker);
            startMarker = null;
            Trackpolyline && map.remove(Trackpolyline);
            Trackpolyline = null;
            //开始图标
            startMarker = new AMap.Marker({
                icon: new AMap.Icon({
                    size: new AMap.Size(36, 36),
                    image: require("@/assets/img/map/start.png"),
                    imageSize: new AMap.Size(36, 36),
                }),
                offset: new AMap.Pixel(-18, -18),
                visible: true,
            });
            let pathArr = [] as any;
            path.map(item => {
                const { lon, lat } = GPS.gcj_encrypt(item.lat, item.lng);
                pathArr.push(new AMap.LngLat(lon, lat));
            })
            startMarker.setPosition(pathArr[0]);
            map.add(startMarker);
            //轨迹样式
            Trackpolyline = new AMap.Polyline({
                strokeColor: "#3d79f8", // 线颜色
                strokeStyle: "solid", // 线样式
                strokeWeight: 2, // 线宽
                visible: true,
            });
            // 创建折线实例
            Trackpolyline.setPath(pathArr);
            // 将折线添加至地图实例
            map.add(Trackpolyline);
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
        }
        // 关闭追踪
        else {
            startMarker && map.remove(startMarker);
            startMarker = null;
            Trackpolyline && map.remove(Trackpolyline);
            Trackpolyline = null;
        }
    }
    return {
        mapObj,
        map,
        initMap,
        clearMap,
        setZoomAndCenter,
        setSatellite,
        SetTraffic,
        getDistance,
        drawRectangle,
        pathObj,
        DistanceToolOpen,
        mouseToolOpen,
        zoomMarker,
        vehInfo,
        closeInfoWindow,
        showAllVehs,
        toggleCluster,
        ClusterChangeFlag,
        track,
        inputSearch,
        newMarker,
        inputSearchObj,
        initAmapMarker,
        drawClickMarker,
        drawPointsObj,
        drawCircle,
        deleteCircle,
        drawAllPoints,
        clearAllPoints,
        zoomOverlay,
        drawAllFences,
        clearAllFences,
        setFenceZoom,
        ...toRefs(data)
    }
}