import { Ref, unref, nextTick, watch, ref, reactive, toRefs, inject } from 'vue';
import AMap from "AMap";// 引入高德地图
import GPS from "@/assets/js/GPS";
import { message } from 'ant-design-vue';
import { getMapZoom, calculateCenter, getCarPng, AmapGetOneAddress } from "./mapFn";
import { GetGeo } from "@/api/apiFn";
// mapRef 地图实例
// centerPoint 地图中心点坐标
// zoom 默认缩放级别
// 高德地图的各种实例不能是Proxy数据!!!!!!!!!!
export function useAmap(mapRef: Ref<HTMLDivElement>, centerPoint = [114.410658, 33.113539], zoom = 10) {
    let map = ref(null) as any;
    let mapClickFlag = ref(true) as any;;
    let mapObj = ref(null) as any;
    let inputSearchObj = ref(new Map()) as any;
    let drawType = ref("");
    let ClusterChangeFlag = ref(true); // 是否允许聚合切换标识
    let Cluster = inject("Cluster") as any; // 聚合开关标识
    let updateCluster = inject("updateCluster") as Function;
    let updateSelectedVeh = inject("updateSelectedVeh") as Function; // 修改选中车辆
    let updateChoseAssociatedVehs = inject("updateChoseAssociatedVehs") as Function; // 修改选中关联车辆
    let MapFn = inject("MapFn") as Function; // 地图操作函数
    let MapFnType = ref("开始绘制") as any;
    let pathObj = ref(null) as any; // 绘图后返回的经纬度
    let drawPointsObj = ref(null) as any; // 用于存储点击地图绘制点的数据和查询后设置点的数据，供外部获取这些操作后的绘制点的数据。
    // -----------------------------------------------------------------
    let SatelliteInstance = null as any; // 卫星图实例
    let TrafficInstance = null as any; // 路况图实例
    let ClusterInstance = null as any; // 聚合实例
    let infoWindow = null as any; // 信息窗口实例
    let markerMap = new Map(); // 当前地图点 车辆id -> marker 映射数据，用于当点变化后获取上一次的点数据
    let ClusterMarkerMap = new Map(); // 当前地图点 车辆id -> 聚合数据，用于当点变化后获取上一次的点数据
    let Trackpolyline = null as any; // 追踪轨迹实例
    let startMarker = null as any; // 追踪起点
    let clickMarker = null as any; // 点击地图绘制点实例
    let drawPoints = []; // 点击地图绘制点实例集合
    let drawCircles = new Map(); // 圆形围栏实例集合
    let AllPointInstance = null as any; // 位置点聚合实例，该功能已删除
    let AllPoints = [] as any; // 位置点实例集合 
    let TwoChargePoints = [[], []] as any; // 二押点实例集合
    let AllFences = [] as any; // 多边形围栏实例集合
    let homeMarker = [[], []] as any; // home停留点实例集合
    let companyMarker = [[], []] as any; // company停留点实例集合
    let normalMarker = [] as any; // 普通点实例集合
    let homeAndCompanyMarker = [] as any; // 停留点实例集合
    let citysPolygons = [] as any; // 省市区围栏实例
    let TwoChargePointInfowindow = null as any; // 二押点弹窗实例
    let AssociateMarkers = [] as any; // 关联车辆点实例
    const data = reactive({
        mouseTool: null,
        DistanceToolObject: null,
        overlays: []
    })
    let { mouseTool, DistanceToolObject, overlays } = toRefs(data) as any;
    // 地图初始化
    function initMap() {
        nextTick(() => {
            if (!centerPoint || !centerPoint[0] || !centerPoint[1]) {
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
                // doubleClickZoom: false, 
                center: [lon, lat],
                zoom: zoom,
            });

            AMap.plugin([
                // 'AMap.ToolBar',
                'AMap.Scale',
            ], function () {
                // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
                // map.addControl(new AMap.ToolBar({
                //     position: {
                //         top: '80px',
                //         left: '10px'
                //     }
                // }));
                // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
                // map.addControl(new AMap.Scale());
            });

            mapObj.value = map;
        })
    }
    // 销毁地图
    function destroyMap() {
        map && map.destroy();
    }
    // 设置地图属性
    function mapSetStatus(option: any) {
        map.setStatus(option)
    }
    // 绘制省市区覆盖物
    function drawCitys(code: string) {
        const district = new AMap.DistrictSearch({
            level: "district",
            extensions: "all",
        });
        //清除地图上所有覆盖物
        for (let i = 0, l = citysPolygons.length; i < l; i++) {
            citysPolygons[i].setMap(null);
        }
        citysPolygons = [];
        function getData(data: any) {
            let bounds = data.boundaries;
            if (bounds) {
                for (let i = 0; i < bounds.length; i++) {
                    let polygon = new AMap.Polygon({
                        map: map,
                        strokeWeight: 1,
                        strokeColor: '#0091ea',
                        fillColor: '#80d8ff',
                        fillOpacity: 0.2,
                        path: bounds[i]
                    });
                    citysPolygons.push(polygon);
                }
            }
        }
        district.search(code, async function (status: any, result: any) {
            if (status == 'complete') {
                await getData(result.districtList[0]);
                setTimeout(() => {
                    map.setFitView([...citysPolygons], true);
                }, 0);
            }
        });
    }
    // 根据车辆id画该车的圆形围栏
    function drawCircle(V: string | number, center: any, radius: number, color = 'rgba(0, 0, 0, 0.452)') {
        if (drawCircles.has(V)) {
            map && map.remove(drawCircles.get(V))
        }
        const { lon, lat } = GPS.gcj_encrypt(center.lat, center.lng);
        const circle = new AMap.Circle({
            center: new AMap.LngLat(lon, lat),  // 圆心位置
            radius: radius, // 圆半径
            fillColor: color,   // 圆形填充颜色
            strokeColor: '#fff', // 描边颜色
            strokeWeight: 1, // 描边宽度
            fillOpacity: 0.3,
        });
        drawCircles.set(V, circle);
        map.add(circle);
    }
    //删除圆形围栏
    function deleteCircle(V: any, all = false) {
        if (all) {
            [...drawCircles.values()].map(item => {
                map && map.remove(item);
            })
        } else if (V instanceof Array) {
            [...drawCircles.keys()].map(item => {
                if (!V.includes(item)) {
                    map && map.remove(drawCircles.get(item))
                }
            })
        } else {
            map && map.remove(drawCircles.get(V))
        }
    }
    // 聚焦到选中覆盖物
    function zoomOverlay(veh: any, type = "位置点", change = false) {
        if (type == "位置点") {
            if (!veh.oriLon || !veh.oriLat) return;
            let lon = veh.oriLon;
            let lat = veh.oriLat;
            if (change) {
                const res = GPS.gcj_encrypt(parseFloat(veh.oriLat), parseFloat(veh.oriLon));
                lon = res.lon;
                lat = res.lat;
            }
            map.setZoomAndCenter(18, [lon, lat], true);
        }
        else if (type == "围栏") {
            setFenceZoom(veh, true);
        } else if (type == "二押点") {
            if (!veh.lon || !veh.lat) return;
            let lon = veh.lon;
            let lat = veh.lat;
            if (change) {
                const res = GPS.gcj_encrypt(parseFloat(veh.lat), parseFloat(veh.lon));
                lon = res.lon;
                lat = res.lat;
            }
            map.setZoomAndCenter(18, [lon, lat], true);
        }
    }
    // 高德地图设置围栏中心点和缩放级别
    function setFenceZoom(item: any, change = false) {
        let arr = [] as any;
        if (!item) return;
        const list = item.pointList;
        if (!list) return;
        list.map((item: any) => {
            let lat = item.oriLat;
            let lon = item.oriLon;
            if (change) {
                const res = GPS.gcj_encrypt(parseFloat(item.oriLat), parseFloat(item.oriLon));
                lat = res.lat;
                lon = res.lon;
            }
            arr.push({
                lng: lon,
                lat: lat,
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
        AllFences && map && map.remove(AllFences);
        AllFences = [];
    }
    // 批量画围栏
    function drawAllFences(list: any[]) {
        clearAllFences();
        let arr = [] as any;
        let FenceName = null as any;
        function showInfoOut() {
            map && map.remove(FenceName);
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
                const { lon, lat } = GPS.gcj_encrypt(parseFloat(items.oriLat), parseFloat(items.oriLon));
                path.push([lon, lat]);
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
    // 清除所有二押点
    function clearAllTwoChargePoints() {
        map && map.remove(TwoChargePoints[0]);
        map && map.remove(TwoChargePoints[1]);
        TwoChargePoints = [[], []];
        TwoChargePointInfowindow && TwoChargePointInfowindow.close();
    }
    // 批量绘制二押点改
    function drawTwoChargePoints(list: any[]) {
        clearAllTwoChargePoints();
        TwoChargePointInfowindow && TwoChargePointInfowindow.close();
        TwoChargePointInfowindow = new AMap.InfoWindow({
            anchor: "bottom-center",
            offset: new AMap.Pixel(0, -40)
        });
        function setAddress(name: string, latlng: any) {
            let address = "暂无位置信息";
            const { lon, lat } = GPS.gcj_decrypt_exact(parseFloat(latlng.lat), parseFloat(latlng.lon));
            AmapGetOneAddress({
                lat: lat,
                lng: lon,
            }).then((res: any) => {
                address = res.address;
                if (!["暂无位置信息", "获取位置失败"].includes(address)) {
                    address = "地址:" + address;
                }
                TwoChargePointInfowindow.setContent(
                    `<div class='TwoChargePoints__AmapLabel'><p>${'二押点:' + name}</p><p>${address}</p></div>`
                );
                TwoChargePointInfowindow.open(map, [latlng.lon, latlng.lat]);
            });
        }
        list && list.map(async (item) => {
            let marker = new AMap.Marker({
                position: [
                    item.lon,
                    item.lat,
                ],
                zIndex: 101,
                map: map,
            });
            marker.on("click", () => {
                setAddress(item.name, { lat: parseFloat(item.lat), lon: parseFloat(item.lon) });
            });
            const circle = new AMap.Circle({
                center: new AMap.LngLat(item.lon, item.lat),  // 圆心位置
                radius: parseFloat(item.radius), // 圆半径
                fillColor: "#E0E0E0",   // 圆形填充颜色
                strokeColor: '#333', // 描边颜色
                strokeWeight: 1, // 描边宽度
            });
            map.add(circle);
            TwoChargePoints[0].push(marker);
            TwoChargePoints[1].push(circle);
        });
        setTimeout(async () => {
            setAddress(list[0].name, { lat: parseFloat(list[0].lat), lon: parseFloat(list[0].lon) });
            map.setFitView([...TwoChargePoints[0]], true); //地图自适应
        }, 0);
    }
    // 批量绘制二押点
    // function drawTwoChargePoints(list: any[]) {
    //     clearAllTwoChargePoints();
    //     TwoChargePointInfowindow && TwoChargePointInfowindow.close();
    //     let addressMap = new Map();
    //     list && list.map(async (item) => {
    //         // 二押点不纠偏
    //         // const { lon, lat } = GPS.gcj_encrypt(parseFloat(item.lat), parseFloat(item.lon));
    //         let marker = new AMap.Marker({
    //             position: [
    //                 item.lon,
    //                 item.lat,
    //             ],
    //             zIndex: 101,
    //             map: map,
    //         });
    //         let arr = [
    //             {
    //                 lat: parseFloat(item.lat),
    //                 lon: parseFloat(item.lon),
    //             },
    //         ];
    //         let address = "暂无位置信息";
    //         marker.setExtData(item.name);
    //         let res = await GetGeo(arr, false);
    //         address = res[0].address;
    //         if (!["暂无位置信息", "获取位置失败"].includes(address)) {
    //             address = "地址:" + address;
    //             addressMap.set(item.name, address);
    //         }
    //         TwoChargePointInfowindow = new AMap.InfoWindow({
    //             anchor: "bottom-center",
    //             offset: new AMap.Pixel(0, -40),
    //             content: `<div class='TwoChargePoints__AmapLabel'><p>${'二押点:' + item.name}</p><p>${address}</p></div>`,
    //         });
    //         marker.on("click", () => {
    //             TwoChargePointInfowindow.setContent(
    //                 `<div class='TwoChargePoints__AmapLabel'><p>${'二押点:' + marker.getExtData()}</p><p>${addressMap.get(marker.getExtData())}</p></div>`
    //             );
    //             TwoChargePointInfowindow.open(map, marker.getPosition());
    //         });
    //         const circle = new AMap.Circle({
    //             center: new AMap.LngLat(item.lon, item.lat),  // 圆心位置
    //             radius: parseFloat(item.radius), // 圆半径
    //             fillColor: "#E0E0E0",   // 圆形填充颜色
    //             strokeColor: '#333', // 描边颜色
    //             strokeWeight: 1, // 描边宽度
    //         });
    //         map.add(circle);
    //         TwoChargePoints[0].push(marker);
    //         TwoChargePoints[1].push(circle);
    //     });
    //     setTimeout(async () => {
    //         let arr = [
    //             {
    //                 lat: parseFloat(list[0].lat),
    //                 lon: parseFloat(list[0].lon),
    //             },
    //         ];
    //         let res = await GetGeo(arr, false);
    //         TwoChargePointInfowindow = new AMap.InfoWindow({
    //             anchor: "bottom-center",
    //             offset: new AMap.Pixel(0, -40),
    //             content: `<div class='TwoChargePoints__AmapLabel'><p>${'二押点:' + list[0].name}</p><p>${res[0].address}</p></div>`,
    //         });
    //         TwoChargePointInfowindow.open(map, [parseFloat(list[0].lon), parseFloat(list[0].lat)]);
    //         map.setFitView([...TwoChargePoints[0]], true); //地图自适应
    //     }, 0);
    // }
    // 清除位置点
    function clearAllPoints(open = false) {
        if (open) {
            AllPointInstance && AllPointInstance.clearMarkers();
            AllPointInstance = null;
            AllPoints = [];
        } else {
            AllPointInstance && AllPointInstance.clearMarkers();
            AllPointInstance = null;
            map && map.remove(AllPoints);
            AllPoints = [];
        }
    }
    // 批量画位置点
    // open原本用于判断是否开聚合，地图2.0 后删除了该功能
    function drawAllPoints(list: any[], open = false) {
        // 清除所有位置点
        clearAllPoints(open);
        list && list.map(async (item) => {
            // 位置点，不用纠偏
            const { lon, lat } = GPS.gcj_encrypt(parseFloat(item.oriLat), parseFloat(item.oriLon));
            let marker = new AMap.Marker({
                position: [
                    item.oriLon,
                    item.oriLat,
                ],
                offset: new AMap.Pixel(-12, -12),
                zIndex: 101,
                map: map,
            });
            const vehData = [item.oriLat, item.oriLon].join("-");
            marker.setLabel({
                offset: new AMap.Pixel(0, 55), //设置文本标注偏移量
                content: `<div class='AllPoints__AmapLabel'><p>${item.name}</p><span>|</span><a onmouseenter="window.showAddress('${vehData}', event)" onmouseleave="window.hideAddress(event)">详情</a></div>`, //设置文本标注内容
                direction: "bottom", //设置文本标注方位
            });
            AllPoints.push(marker);
        });
        setTimeout(() => {
            // if (AllPoints.length > 0 && open) {
            //     AllPointInstance = new AMap.MarkerClusterer(
            //         map,
            //         AllPoints,
            //         { gridSize: 80 }
            //     );
            // }
            map.setFitView([...AllPoints], true); //地图自适应
        }, 0);
    }
    // 关闭地图点击事件
    function closeMapClickFn() {
        map.clearEvents('click');
    }
    // 高德地图点击事件
    function drawClickMarker() {
        mapClickFlag.value = true;
        map.on("click", (e: any) => {
            if (!mapClickFlag.value) return;
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
                false, 200
            );
            selected_e = e;
            drawPoints = [];
            drawPoints.push(selected_e.lnglat);
        });
        clickMarker.setMap(map);
        // map.setFitView();
        map.setZoomAndCenter(map.getZoom(), clickMarker.getPosition(), false, 200);
        // 每次点击地图绘制普通点时清空数据
        drawPointsObj.value = null;
        drawPointsObj.value = drawPoints;
    }
    // 地址查询定位
    function inputSearch(keyword: String, showMarker = false, type = "normal") {
        nextTick(() => {
            // 输入提示
            AMap.plugin(
                ["AMap.AutoComplete", "AMap.PlaceSearch", "AMap.ToolBar"],
                () => {
                    const autoOptions = {
                        input: keyword, //使用联想输入的input的id
                    };
                    const autocomplete = new AMap.AutoComplete(autoOptions);
                    const placeSearch = new AMap.PlaceSearch({
                        map: map,
                    });
                    autocomplete.on("select", function (e: any) {
                        // /TODO 针对选中的poi实现自己的功能
                        placeSearch.setCity(e.poi.adcode);
                        inputSearchObj.value.set(keyword, e);
                        placeSearch.search(e.poi.name, () => {
                            // 清除点击绘制marker
                            clickMarker && map && map.remove(clickMarker);
                            // 清除搜索marker
                            map && map.remove(placeSearch.render._overlays);
                            setTimeout(() => {
                                if (showMarker) {
                                    if (!e.poi.location) {
                                        message.warning(
                                            "地址不够详细，无法确定具体位置！"
                                        );
                                    } else {
                                        map.setZoomAndCenter(15, [e.poi.location.lng, e.poi.location.lat], true);
                                        if (type == "normal") {
                                            newMarker(
                                                [
                                                    {
                                                        lat: e.poi.location.lat,
                                                        lng: e.poi.location.lng,
                                                    }
                                                ],
                                                "normal",
                                                false, // 显示label
                                                false, // 纠偏
                                                false // 全覆盖物聚焦
                                            )
                                        } else {
                                            newMarker(
                                                [
                                                    {
                                                        lat: e.poi.location.lat,
                                                        lng: e.poi.location.lng,
                                                        type: type,
                                                    }
                                                ],
                                                "homeAndCompany",
                                                false, // 显示label
                                                false, // 纠偏
                                                false // 全覆盖物聚焦
                                            );
                                        }
                                    }
                                } else {
                                    map.setZoomAndCenter(16, [e.poi.location.lng, e.poi.location.lat], true);
                                }
                            }, 200);
                        });
                    })
                }
            );
        })
    }
    // 清除经常停留点
    function removeHomeAndCompany() {
        homeAndCompanyMarker.length > 0 && map && map.remove(homeAndCompanyMarker);
    }
    // 新建点标记
    function newMarker(centerPoint: any[], type = "normal", setLabel = true, change = true, zoomAllView = true) {
        nextTick(() => {
            // change用于判断是否需要做经纬度转换
            // type用于判断新建marker的类型
            // setLabel用于判断是否给marker添加label框
            // makerType用于判断停留点是home还是company
            centerPoint.map((item: any) => {
                if (!item.lat || !item.lng) return;
                let mylat = item.lat;
                let mylon = item.lng;
                if (change) {
                    const { lon, lat } = GPS.gcj_encrypt(item.lat, item.lng);
                    mylat = lat;
                    mylon = lon;
                } else {
                    mylat = item.lat;
                    mylon = item.lng;
                }
                // 若新建普通点
                if (type == "normal") {
                    normalMarker.length > 0 && map && map.remove(normalMarker);
                    normalMarker = [];
                    let marker = new AMap.Marker({
                        map: map,
                        position: [mylon, mylat], // 位置
                    });
                    normalMarker.push(marker);
                    // 查询绘制普通点后将数据传入drawPointsObj, 供外部获取
                    drawPointsObj.value = [{ lat: mylat, lng: mylon }]
                    map.setFitView(normalMarker, true);
                }
                // 若新建停留点 
                else if (type == "homeAndCompany") {
                    let icon = new AMap.Icon({
                        size: new AMap.Size(20, 32), // 图标尺寸
                        image: item.type == "company" ? require("@/assets/img/map/company.png") : require("@/assets/img/map/home.png"),
                        imageSize: new AMap.Size(20, 32), // 根据所设置的大小拉伸或压缩图片
                    });
                    let marker = new AMap.Marker({
                        map: map,
                        icon: icon,
                        offset: new AMap.Pixel(-10, -28), // 设置图标偏移度
                        position: [mylon, mylat], // 位置
                    });
                    !setLabel && setCircle();
                    if (item.type == "home") {
                        homeMarker[0].length > 0 && map && map.remove(homeMarker[0]);
                        homeMarker[0] = [];
                        homeMarker[0].push(marker)
                    } else if (item.type == "company") {
                        companyMarker[0].length > 0 && map && map.remove(companyMarker[0]);
                        companyMarker[0] = [];
                        companyMarker[0].push(marker);
                    }
                    setLabel && marker.setLabel({
                        offset: new AMap.Pixel(0, 55), //设置文本标注偏移量
                        content: `<div class='AllPoints__AmapLabel'><p>${item.name + "经常停车点"}</p><span>|</span>${item.type == "company" ? "公司" : "家"}</div>`, //设置文本标注内容
                        direction: "bottom", //设置文本标注方位
                    });
                    function setCircle() {
                        const circle = new AMap.Circle({
                            center: new AMap.LngLat(mylon, mylat),  // 圆心位置
                            radius: 1000, // 圆半径
                            fillColor: "#BBE9aa",   // 圆形填充颜色
                            strokeColor: '#fff', // 描边颜色
                            strokeWeight: 1, // 描边宽度
                        });
                        map.add(circle);
                        homeAndCompanyMarker.push(circle);
                        if (item.type == "home") {
                            homeMarker[1].length > 0 && map && map.remove(homeMarker[1]);
                            homeMarker[1] = [];
                            homeMarker[1].push(circle)
                        } else if (item.type == "company") {
                            companyMarker[1].length > 0 && map && map.remove(companyMarker[1]);
                            companyMarker[1] = [];
                            companyMarker[1].push(circle);
                        }
                    }
                    homeAndCompanyMarker.push(marker);
                    zoomAllView && map.setFitView(homeAndCompanyMarker, true);
                }
            })
        })
    }
    //分批设置marker 图标和角度
    function batchSetContent(marker: any, item: any, changeNum = 0, num = 100, ms = 50) {
        //changeNum代表当前渲染到多少辆了， num代表每多少辆暂停会执行， ms代表暂停多少毫秒
        return new Promise<void>((resolve) => {
            marker && marker.setContent(
                `<img style="width: 32px;height:32px;transform: rotate(${item.F || 0
                }deg);" src="${getCarPng(item)}" />`
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
        return new Promise<void>((resolve) => {
            marker && marker.setPosition(new AMap.LngLat(...position));
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
        AssociateMarkers && AssociateMarkers.length > 0 && map && map.remove(AssociateMarkers);
        if (list.length == 0) return;
        list.map((item: any) => {
            if (item.X && item.Y) {
                const { lon, lat } = GPS.gcj_encrypt(parseFloat(item.Y), parseFloat(item.X));
                let marker = new AMap.Marker({
                    map: map,
                    position: [lon, lat], // 位置
                    offset: new AMap.Pixel(-12, -17.5), // 设置图标偏移度
                    content: `<img style="width: 24px;height:35px" src="${require('../../../assets/img/map/glCarMark.png')}" />`,
                });
                AssociateMarkers.push(marker);
                marker.on("click", () => {
                    //更新车辆信息
                    updateChoseAssociatedVehs({ ...item });
                });
            }
        })
    }
    //分批渲染marker
    function batchMarker(item: any, selectedAllVehs: any, vehsLimit: number, renderNum: number, num = 1000, ms = 50) {
        //renderNum代表当前渲染到多少辆了， num代表每多少辆暂停会执行， ms代表暂停多少毫秒
        if (selectedAllVehs.size > 10 * num) {
            num = Math.ceil(selectedAllVehs.size / 10);
        }
        return new Promise<void>((resolve) => {
            const { lon, lat } = GPS.gcj_encrypt(item.Y, item.X);
            let marker = new AMap.Marker({
                map: selectedAllVehs.size > vehsLimit ? null : map,
                position: [lon, lat], // 位置
                offset: new AMap.Pixel(-16, -17.5), // 设置图标偏移度
                content: `<img style="width: 32px;height:32px;transform: rotate(${item.F || 0
                    }deg);" src="${getCarPng(item)}" />`,
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
                updateSelectedVeh(item);
                infoWindow.open(map, [lon, lat]);
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
            // 若选中车辆数超出限制，则开启聚合模式绘制车辆marker
            if (!Cluster.value && selectedAllVehs.size > vehsLimit) {
                ClusterChangeFlag.value = false;
                updateCluster(true); // 聚合标识设为true
                message.warning(
                    `由于地图车辆超过${vehsLimit}辆, 开启聚合以优化性能`
                );
                setTimeout(() => {
                    ClusterChangeFlag.value = true;
                }, 500);
            }
            //设置点聚合
            if (Cluster.value) {
                ClusterOpen(selectedAllVehs);
                return;
            }
            //清除点聚合
            if (!Cluster.value) {
                ClusterInstance && ClusterInstance.setMap(null);
                ClusterInstance = null;
            }
            // 清除地图上所有非聚合车辆marker
            // [...markerMap.values()].map((item) => {
            //     map.remove(item);
            // });
            //删除索引内不存在的车辆
            [...markerMap.keys()].map((V) => {
                if (!selectedAllVehs.has(V)) {
                    markerMap.get(V).setMap(null); // 取消车辆从地图中删除
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
                        nowVehInfo.Z !== oldVehInfo.Z ||
                        nowVehInfo.T != oldVehInfo.T ||
                        nowVehInfo.F != oldVehInfo.F
                    ) {
                        //如果车辆状态/类型/方向等信息有变化则重新设置图片
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
        })
    }
    // marker聚焦
    function zoomMarker(veh: any, InfoWindowRef: any, track = true) {
        nextTick(async () => {
            if (!veh) return;
            const { lon, lat } = GPS.gcj_encrypt(veh.Y, veh.X);
            infoWindow = new AMap.InfoWindow({
                offset: new AMap.Pixel(0, -30),
                isCustom: true,
                autoMove: false,
                content: InfoWindowRef.value.$el,
            });
            infoWindow.open(map, [lon, lat]);
            // map.setCenter([lon, lat]);
            track && map.setZoomAndCenter(17, [lon, lat], false, 200);
            map.panBy(0, 30);
        })
    }
    // 关闭弹窗
    function closeInfoWindow() {
        infoWindow.close();
    }
    // 聚合开关
    function ClusterOpen(selectedAllVehs: any) {
        // 清除非聚合模式车辆marker
        map && map.remove([...markerMap.values()]);
        // 若取消选中任意车辆,则清空聚合实例，重绘聚合实例，因为高德地图2.0聚合实例没有删除某个聚合点的方法。
        if (selectedAllVehs.size < ClusterMarkerMap.size) {
            ClusterInstance && ClusterInstance.setMap(null);
            ClusterInstance = null;
        }
        let newPoints = [] as any;
        let changeFlag = 0; // 集合点变化标识
        //删除索引内不存在的车辆
        [...ClusterMarkerMap.keys()].map((V) => {
            if (!selectedAllVehs.has(V)) {
                ClusterMarkerMap.delete(V);
            }
        });
        [...selectedAllVehs.values()].map((item: any) => {
            //X是经度lng Y是纬度lat
            const { lon, lat } = GPS.gcj_encrypt(parseFloat(item.Y), parseFloat(item.X));
            // 若该车辆已经绘制聚合点
            if (ClusterMarkerMap.has(item.V)) {
                const oldVehInfo = ClusterMarkerMap.get(item.V);
                const nowVehInfo = item;
                // 若某辆车位置/状态/设备类型/方向发生变化
                // 则更新ClusterMarkerMap中变化的聚合点的数据为最新数据
                if (nowVehInfo.X !== oldVehInfo.X ||
                    nowVehInfo.Y !== oldVehInfo.Y ||
                    nowVehInfo.Z !== oldVehInfo.Z ||
                    nowVehInfo.T !== oldVehInfo.T ||
                    nowVehInfo.F !== oldVehInfo.F) {
                    changeFlag = 1;
                    ClusterMarkerMap.set(item.V, {
                        ...item,
                        weight: 1,
                        lnglat: [lon == 0 ? 0.000001 : lon, lat == 0 ? 0.000001 : lat]
                    });
                }
            } else {
                newPoints.push({
                    ...item,
                    weight: 1,
                    lnglat: [lon == 0 ? 0.000001 : lon, lat == 0 ? 0.000001 : lat]
                });
                ClusterMarkerMap.set(item.V, {
                    ...item,
                    weight: 1,
                    lnglat: [lon == 0 ? 0.000001 : lon, lat == 0 ? 0.000001 : lat]
                });
            }
        });
        // 若任意车辆位置/状态/设备类型/方向发生变化，则重新绘制所有聚会点
        // if (changeFlag) {
        //     ClusterInstance && ClusterInstance.setMap(null);
        //     ClusterInstance = null;
        // }
        const getBg = function (count: number) {
            if (count <= 10) {
                return "http://webapi.amap.com/theme/v1.3/m1.png";
            } else if (count <= 100) {
                return "http://webapi.amap.com/theme/v1.3/m2.png";
            } else if (count <= 1000) {
                return "http://webapi.amap.com/theme/v1.3/m3.png";
            } else if (count <= 10000) {
                return "http://webapi.amap.com/theme/v1.3/m4.png";
            } else if (count > 10000) {
                return "http://webapi.amap.com/theme/v1.3/m5.png";
            }
        }
        const count = selectedAllVehs.size;
        const renderClusterMarker = function (context: any) {
            const div = document.createElement('div');
            const size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
            div.style.width = div.style.height = size + 'px';
            div.style.borderRadius = size / 2 + 'px';
            div.style.background = `url(${getBg(context.count)})`;
            div.style.backgroundSize = "100%";
            div.innerHTML = context.count;
            div.style.lineHeight = size + 'px';
            div.style.color = "#333";
            div.style.fontSize = '12px';
            div.style.textAlign = 'center';
            context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
            context.marker.setContent(div)
            // 自定义点击事件
            context.marker.on('click', function (e: any) {
                let curZoom = map.getZoom();
                if (curZoom < 20) {
                    curZoom += 2;
                }
                map.setZoomAndCenter(curZoom, e.lnglat, false, 200);
            });
        }
        const renderMarker = function (context: any) {
            const { data } = context;
            let item = data[0];
            const { lon, lat } = GPS.gcj_encrypt(parseFloat(item.Y), parseFloat(item.X));
            let content = `<img style="width: 32px;height:32px;transform: rotate(${item.F || 0
                }deg);" src="${getCarPng(item)}" />`;
            let offset = new AMap.Pixel(-16, -17.5);
            // context.marker.setExtData(item);
            context.marker.setPosition(new AMap.LngLat(lon, lat));
            context.marker.setContent(content);
            context.marker.setOffset(offset);
            // label默认蓝框白底左上角显示，样式className为：amap-marker-label
            context.marker.setLabel({
                offset: new AMap.Pixel(0, 33),  //设置文本标注偏移量
                content: `<div class="Amap-infowindow"><span class="AmapLabel">${item.P}</span></div>`, //设置文本标注内容
                direction: 'top' //设置文本标注方位
            });
            context.marker.on('click', function (e: any) {
                // const point = e.target.getPosition();
                //更新车辆信息
                updateSelectedVeh(item);
                infoWindow.open(map, [lon, lat]);
            })
        }
        if (ClusterInstance) {
            // 添加新的聚合点
            ClusterMarkerMap.size > 0 && ClusterInstance.addData(newPoints);
            // 修改变化的聚合点
            changeFlag > 0 && ClusterInstance.setData([...ClusterMarkerMap.values()]);
        } else {
            // 初始化聚合点
            ClusterMarkerMap.size > 0 &&
                (ClusterInstance = new AMap.MarkerCluster(
                    map,
                    [...ClusterMarkerMap.values()],
                    {
                        gridSize: 80, // 设置网格像素大小
                        maxZoom: 18,
                        renderClusterMarker: renderClusterMarker,
                        renderMarker: renderMarker,
                    }
                ));
        }
    }
    //设置点聚合切换
    function toggleCluster(selectedAllVehs: any, vehsLimit: number) {
        nextTick(() => {
            // 开聚合
            if (Cluster.value) {
                ClusterOpen(selectedAllVehs);
                // 关聚合
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
                        hide ? mouseTool.close(true) : mouseTool.close(false);
                        cursorStyle("")
                    }, 100);
                    return;
                }
                overlays.push(obj);
                let path: any = null;
                if (drawType.value == 'rectangle') {
                    path = obj[
                        Object.keys(obj).find(
                            (p: any) => obj[p] && (obj[p] instanceof Array) && obj[p][0] && obj[p][0][0].length > 2
                        ) as any
                    ][0][0];
                } else if (drawType.value == 'polygon') {
                    path = obj[
                        Object.keys(obj).find(
                            (p: any) => obj[p] && obj[p].path && obj[p].path.length > 2
                        ) as any
                    ].path;
                    map.setFitView(overlays, true);
                }
                setTimeout(() => {
                    let changePath = [] as any;
                    // 围栏数据需转换成WGS-84数据再传给后台
                    path.map((item: any) => {
                        const { lon, lat } = GPS.deltaOut(item[1], item[0]);
                        changePath.push([lon, lat]);
                    })
                    pathObj.value = changePath;
                    MapFn && MapFn(MapFnType.value, changePath);
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
        mapClickFlag.value = false;
        DistanceToolObject && map && map.remove(DistanceToolObject);
        if (open) {
            DistanceToolObject.turnOn();
        } else {
            DistanceToolObject.turnOff();
        }
    }
    // 绘制矢量图
    function drawRectangle(MyMapFnType = null, type = "rectangle") {
        MyMapFnType && (MapFnType.value = MyMapFnType);
        drawType.value = type;
        pathObj.value = null;
        cursorStyle();
        // mouseTool.close(true);
        map && map.remove(overlays);
        overlays = [];
        draw(type);
    }
    // 鼠标样式
    function cursorStyle(type = "crosshair") {
        const body: any = document.getElementsByClassName("amap-maps")[0];
        body.style.cursor = type;
    }
    // 选择绘制各类矢量图
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
    function setZoomAndCenter(zoom: number, point: any, change = true) {
        if (change) {
            const { lon, lat } = GPS.gcj_encrypt(point.lat, point.lng);
            map.setZoomAndCenter(zoom, [lon, lat], false, 200);
        } else {
            map.setZoomAndCenter(zoom, [point.lng, point.lat], false, 200);
        }
    }
    // 清空地图
    function clearMap() {
        map && map.clearMap && map.clearMap();
        // 清空地图后将drawPointsObj置空
        drawPointsObj.value = null;
    }
    // 高德地图卫星图
    function setSatellite(mapType = "Amap", Satellite = false) {
        nextTick(() => {
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
            startMarker && map && map.remove(startMarker);
            startMarker = null;
            Trackpolyline && map && map.remove(Trackpolyline);
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
                const { lon, lat } = GPS.gcj_encrypt(item.Y, item.X);
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
            // 聚合模式追踪
            if (Cluster.value) {
                const { lon, lat } = GPS.gcj_encrypt(parseFloat(veh.Y), parseFloat(veh.X));
                ClusterMarkerMap.set(veh.V, {
                    ...veh,
                    weight: 1,
                    lnglat: [lon == 0 ? 0.000001 : lon, lat == 0 ? 0.000001 : lat]
                });
                ClusterInstance.setData([...ClusterMarkerMap.values()])
            }
            // 非聚合模式追踪
            else {
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
        }
        // 关闭追踪
        else {
            startMarker && map && map.remove(startMarker);
            startMarker = null;
            Trackpolyline && map && map.remove(Trackpolyline);
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
        removeHomeAndCompany,
        drawTwoChargePoints,
        clearAllTwoChargePoints,
        drawCitys,
        dwawAssociateMarker,
        mapSetStatus,
        destroyMap,
        closeMapClickFn,
        ...toRefs(data)
    }
}