import { Ref, unref, nextTick, watch, ref, reactive, toRefs, inject } from 'vue';
import { message } from 'ant-design-vue';
import { ElMessage } from "element-plus";
import { GetGeo } from "@/api/apiFn";
import API from "@/api/monitorCenter";
import GPS from "@/assets/js/GPS";
import manageDataAPI from "@/api/manageData";
import { AmapGetOneAddress } from "./map/mapFn";
export function useFunction() {
    const data = reactive({
    });
    function showAMsg(msg: string, type = 'warning') {
        if (type == 'warning') {
            message.warning(
                msg
            );
        } else {
            message.success(
                msg
            );
        }
    }
    function showMsg(msg: string) {
        ElMessage({
            dangerouslyUseHTMLString: true,
            duration: 2000,
            customClass: "msgBox_cx",
            iconClass: "msgIcon_cx",
            message: msg,
            offset: document.body.clientHeight / 2,
        });
    }
    function normalShowMsg(msg: string) {
        ElMessage({
            message: msg,
        });
    }
    // 围栏查车
    async function SearchVehicleInArea(point: any) {
        const params = {
            lat1: point.lat1,
            lat2: point.lat2,
            lon1: point.lon1,
            lon2: point.lon2
        }
        try {
            const { flag, msg, obj } = await API.SearchVehicleInArea(params);
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    async function exportVehicleInArea(point: any) {
        const params = {
            lat1: point.lat1,
            lat2: point.lat2,
            lon1: point.lon1,
            lon2: point.lon2
        }
        try {
            API.exportVehicleInArea(params);
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 查询多边形围栏
    async function getPathIdByVehicleId(vehicleId: string) {
        try {
            const { flag, msg, obj } = await API.getPathIdByVehicleId({
                vehicleId: vehicleId
            });
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 围栏解绑
    async function removeBound(params: any) {
        try {
            const { flag, msg } = await API.removeBound(params);
            if (flag == 1) {
                showAMsg("围栏解绑成功", "success");
                return flag;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 查询全部位置点
    async function SelectPointByUserId() {
        try {
            const { flag, msg, obj } = await API.SelectPointByUserId({});
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 添加位置点
    async function AddPoint(pointData: any) {
        const params = {
            ...pointData
        }
        try {
            const { flag, msg } = await API.AddPoint(JSON.stringify(params));
            if (flag == 1) {
                return flag;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 删除位置点
    async function DeletePoint(pointData: any) {
        const params = {
            ...pointData
        }
        try {
            const { flag, msg } = await API.DeletePoint(params);
            if (flag == 1) {
                return flag;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 查询围栏
    async function getArea() {
        try {
            const { flag, msg, obj } = await API.getArea({});
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 添加围栏
    async function addPath(areaData: any) {
        console.log(JSON.stringify(areaData), 'JSON.stringify(params)');
        try {
            const { flag, msg, obj } = await API.addPath(JSON.stringify(areaData));
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 删除围栏
    async function delPath(pathId: string | number) {
        try {
            const { flag, msg } = await API.delPath({ pathId: pathId });
            if (flag == 1) {
                return flag;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 修改围栏
    async function updatePath(areaData: any) {
        try {
            const { flag, msg } = await API.updatePath(JSON.stringify(areaData));
            if (flag == 1) {
                return flag;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 根据围栏id查询围栏绑车信息
    async function getVehicleInfo(pathId: string | number) {
        try {
            const { flag, msg, obj } = await API.getVehicleInfo({ pathId: pathId });
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 围栏绑车
    async function bindVehicleToPath(bindData: any) {
        try {
            const { flag, msg } = await API.bindVehicleToPath(bindData);
            if (flag == 1) {
                showAMsg("围栏绑车成功", "success");
                return flag;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 查询圆形围栏
    async function GetVehicleCircle(params: any) {
        try {
            const { flag, msg, obj } = await API.GetVehicleCircle(params);
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 添加圆形围栏
    async function saveRoundFence(params: any) {
        try {
            const { flag, msg } = await API.saveRoundFence(JSON.stringify(params));
            if (flag == 1) {
                showAMsg("添加圆形围栏成功", "success");
                return flag;
            } else {
                showAMsg("圆形围栏设置失败:范围是200到5000");
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 修改圆形围栏
    async function updateRoundFence(params: any) {
        try {
            const { flag, msg } = await API.updateRoundFence(JSON.stringify(params));
            if (flag == 1) {
                showAMsg("圆形围栏修改成功", "success");
                return flag;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 删除圆形围栏
    async function deleteRoundFence(vehicleId: string | number) {
        try {
            const { flag, msg } = await API.deleteRoundFence({
                vehicleId: vehicleId
            });
            if (flag == 1) {
                showAMsg("圆形围栏删除成功", "success");
                return flag;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 停留点查询
    async function GetVehicleStayPoint(params: any) {
        try {
            const { flag, msg, obj } = await API.GetVehicleStayPoint(params);
            if (flag == 1) {
                if (obj) {
                    return obj;
                }
                return;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 添加/修改停留点
    async function saveStoppingPoint(params: any) {
        try {
            const { flag, msg } = await API.saveStoppingPoint(params);
            if (flag == 1) {
                return flag;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 修改/添加停留点
    async function updateStoppingPoint(params: any) {
        try {
            const { flag, msg } = await API.updateStoppingPoint(params);
            if (flag == 1) {
                return flag;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 删除停留点
    async function deleteStoppingPoint(params: any) {
        try {
            const { flag, msg } = await API.deleteStoppingPoint(params);
            if (flag == 1) {
                return flag;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 查询二押点
    async function GetTwoChargeByUserId(currentPage = 1, pageSize = 5000) {
        const params = {
            pageNumber: currentPage,
            pageSize: pageSize
        }
        try {
            const { flag, msg, obj } = await API.GetTwoChargeByUserId(params);
            if (flag == 1 && ![null, undefined].includes(obj) && obj.data) {
                return obj.data;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 添加二押点
    async function addTwoCharge(params: any) {
        try {
            const { flag, msg } = await API.addTwoCharge(JSON.stringify(params));
            if (flag == 1) {
                return flag;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 删除二押点
    async function deleteTwoCharge(chargeId: string | number) {
        try {
            const { flag, msg } = await API.deleteTwoCharge({
                chargeId: chargeId
            });
            if (flag == 1) {
                return flag;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 查询市对应云端二押点数据
    async function QueryMortgagePoint(city: string) {
        try {
            const { flag, msg, obj } = await API.QueryMortgagePoint({
                city: city
            });
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 查询二押点已绑车辆数据
    async function getVehicleChargeByUserId() {
        try {
            const { flag, msg, obj } = await API.getVehicleChargeByUserId({});
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 查询车组下车辆数据
    async function getVehicleInfoByGroupList(groupStr: string) {
        try {
            const { flag, msg, obj } = await API.getVehicleInfoByGroupList({
                groupStr: groupStr
            });
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 二押点绑车
    async function UpdateOrAddVehicleCharge(vehicleId: string) {
        try {
            const { flag, msg } = await API.UpdateOrAddVehicleCharge({
                vehicleIds: vehicleId
            });
            if (flag == 1) {
                return flag;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 二押点取消绑车
    async function deleteVehicleCharge(vehicleId: string) {
        try {
            const { flag, msg } = await API.deleteVehicleCharge({
                vehicleIds: vehicleId
            });
            if (flag == 1) {
                return flag;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 获取车辆关联车辆和结清列表
    async function querySettleDetail(vehicleId: string | number) {
        try {
            const { flag, msg, obj } = await API.querySettleDetail({
                vehicleId: vehicleId,
                appState: 0
            });
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 结清/结清撤回
    async function updateSettleStatus(params: any) {
        try {
            const { flag, msg } = await API.updateSettleStatus(params);
            if (flag == 1) {
                return flag;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 地图位置点label详情
    async function labelDetailFn() {
        async function showAddress(item: any, event: any) {
            const dom = document.getElementById("mapLabel_detailBox");
            const { lon, lat } = GPS.gcj_decrypt_exact(parseFloat(item.split("-")[0]), parseFloat(item.split("-")[1]));
            let latlng = {
                lat: lat,
                lng: lon
            }
            let address = "暂无位置信息";
            AmapGetOneAddress(latlng).then((res: any) => {
                console.log(res, "位置地址");
                address = res.address;
                if (!["暂无位置信息", "获取位置失败"].includes(address)) {
                    address = "地址:" + address;
                }
                if (dom) {
                    dom.style.display = "block";
                    dom.style.position = "fixed";
                    dom.style.zIndex = " 99999 !important";
                    dom.innerHTML = `<div id='mapLabel_detail'>${address}</div>`;
                    dom.style.left = event.clientX + 10 + "px";
                    dom.style.top = event.clientY + 20 + "px";
                }
            });
        }
        function hideAddress() {
            const dom = document.getElementById("mapLabel_detailBox");
            if (dom) {
                dom.style.display = "none";
                dom.innerHTML = "";
            }
        }
        (window as any).showAddress = showAddress;
        (window as any).hideAddress = hideAddress;
    }
    // 获取地址
    async function getAddress(point: any, change = false) {
        let address = "暂无位置信息";
        let arr = [] as any;
        point.map((item: any, index: number) => {
            if (change) {
                const { lon, lat } = GPS.gcj_decrypt_exact(parseFloat(item.lat), parseFloat(item.lng));
                arr.push({
                    lat: lat,
                    lon: lon,
                    tag: index,
                })
            } else {
                arr.push({
                    lat: parseFloat(item.lat),
                    lon: parseFloat(item.lng),
                    tag: index,
                })
            }

        });
        const addressList = await GetGeo(arr);
        return addressList;
    }

    // 获取关联车辆
    async function GetRealTimeByVehListState(vehicleId: string | number) {
        try {
            const { flag, msg, obj } = await API.GetRealTimeByVehListState({
                vehicleId: vehicleId
            });
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 查询车辆信息
    async function searchVehicleInfo(vehicleId: string | number) {
        try {
            const { flag, msg, obj } = await manageDataAPI.searchVehicleInfo({
                vehicleId: vehicleId
            });
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 添加车辆
    async function saveVehicle(params: any) {
        try {
            const { flag, msg } = await manageDataAPI.saveVehicle(JSON.stringify(params));
            if (flag == 1) {
                return flag;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 修改车辆
    async function updateVehicle(params: any) {
        try {
            const { flag, msg } = await manageDataAPI.updateVehicle(JSON.stringify(params));
            if (flag == 1) {
                return flag;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // 关注备注列表
    async function getRemarkList() {
        try {
            const { flag, msg, obj } = await API.getRemarkList({});
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 添加关注
    async function saveVehicleConcern(params: any) {
        try {
            const { flag, msg } = await API.saveVehicleConcern(JSON.stringify(params));
            if (flag == 1) {
                return flag
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 清除关注
    async function deleteVehicleConcern(vehicleId: string | number) {
        try {
            const { flag, msg } = await API.deleteVehicleConcern({
                vehicleId: vehicleId
            });
            if (flag == 1) {
                return flag
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 查询车辆绑定省市区
    async function getAdminRegion(vehicleId: string | number) {
        try {
            const { flag, msg, obj } = await API.getAdminRegion({
                vehicleId: vehicleId
            });
            if (flag == 1) {
                if (obj) {
                    return obj;
                }
                return;
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 查询车组绑定省市区
    async function getAdminRegionGroup(groupId: string | number) {
        try {
            const { flag, msg, obj } = await API.getAdminRegionGroup({
                groupId: groupId
            });
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 修改车组绑定省市区
    async function listAdminRegionGroup(params: any) {
        try {
            const { flag, msg } = await API.listAdminRegionGroup(JSON.stringify(params));
            if (flag == 1) {
                return flag
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 解除车组绑定省市区
    async function deleteAdminRegionGroup(params: any) {
        try {
            const { flag, msg } = await API.deleteAdminRegionGroup(params);
            if (flag == 1) {
                return flag
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 修改车辆绑定省市区
    async function bindAdminRegion(params: any) {
        try {
            const { flag, msg } = await API.bindAdminRegion(params);
            if (flag == 1) {
                return flag
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 解除车辆绑定省市区
    async function deleteAdminRegion(params: any) {
        try {
            const { flag, msg, obj } = await API.deleteAdminRegion(params);
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // 获取保养数据
    async function getMaintain(vehicleId: string | number) {
        try {
            const { flag, msg, obj } = await API.getMaintain({
                vehicleId: vehicleId
            });
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 设置保养信息
    async function maintenanceSettings(params: any) {
        try {
            const { flag, msg } = await API.maintenanceSettings(JSON.stringify(params));
            if (flag == 1) {
                return flag
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 获取车辆保险信息
    async function GetInsuranceDate(vehicleId: string | number) {
        try {
            const { flag, msg, obj } = await API.GetInsuranceDate({
                vehicleId: vehicleId
            });
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 设置车辆保险信息
    async function insertInsuranceDate(params: any) {
        try {
            const { flag, msg } = await API.insertInsuranceDate(JSON.stringify(params));
            if (flag == 1) {
                return flag
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 查询监控中心报警数据
    async function queryAlarm(params: any) {
        try {
            const { flag, msg, obj } = await API.queryAlarm(params);
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 报警处理
    async function processAlarm(params: any) {
        try {
            const { flag, msg } = await API.processAlarm(JSON.stringify(params));
            if (flag == 1) {
                return flag
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 获取设备统计数量
    async function getUserVehicleCount() {
        try {
            const { flag, msg, obj } = await API.getUserVehicleCount();
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 指令下发
    async function sendCommandDown(params: any) {
        try {
            const { flag, msg } = await API.sendCommandDown(params);
            if (flag == 1) {
                return flag
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 车组指令下发
    async function groupDown(params: any) {
        try {
            const { flag, msg } = await API.groupDown(params);
            if (flag == 1) {
                return flag
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 查询无线回传
    async function getPassBack(params: any) {
        try {
            const { flag, msg, obj } = await API.getPassBack(params);
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 查询车组无线回传
    async function getGroupPassBack(params: any) {
        try {
            const { flag, msg, obj } = await API.getGroupPassBack(params);
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 查询工作模式
    async function getWorkMode(params: any) {
        try {
            const { flag, msg, obj } = await API.getWorkMode(params);
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 查询照片库
    async function pageImage(params: any) {
        try {
            const { flag, msg, obj } = await API.pageImage(params);
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // ocar出入库查询
    async function queryInOutVehicleReportList(params: any) {
        try {
            const { flag, msg, obj } = await API.queryInOutVehicleReportList(params);
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj
            }
        } catch (error) {
            console.log(error);
        }
    }
    // Ocar导出
    async function exportInOutVehicleReport(params: any) {
        try {
            API.exportInOutVehicleReport(params);
        } catch (error) {
            console.log(error);
            showAMsg(error.msg);
        }
    }
    // OBD数据
    async function getOBDVehicleInfo(params: any) {
        try {
            const { flag, msg, obj } = await API.getOBDVehicleInfo(params);
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj
            } else {
                showAMsg(msg);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 车辆资料关联数据
    async function getVehicleDateByPlate(params: any) {
        try {
            const { flag, msg, obj } = await API.getVehicleDateByPlate(params);
            if (flag == 1 && ![null, undefined].includes(obj)) {
                return obj
            }
        } catch (error) {
            console.log(error);
        }
    }
    return {
        showMsg,
        normalShowMsg,
        showAMsg,
        SearchVehicleInArea,
        exportVehicleInArea,
        getPathIdByVehicleId,
        SelectPointByUserId,
        labelDetailFn,
        GetRealTimeByVehListState,
        AddPoint,
        DeletePoint,
        GetTwoChargeByUserId,
        getArea,
        addPath,
        delPath,
        updatePath,
        getVehicleInfo,
        bindVehicleToPath,
        removeBound,
        GetVehicleCircle,
        saveRoundFence,
        updateRoundFence,
        deleteRoundFence,
        GetVehicleStayPoint,
        getAddress,
        saveStoppingPoint,
        updateStoppingPoint,
        deleteStoppingPoint,
        addTwoCharge,
        deleteTwoCharge,
        QueryMortgagePoint,
        getVehicleChargeByUserId,
        getVehicleInfoByGroupList,
        UpdateOrAddVehicleCharge,
        deleteVehicleCharge,
        saveVehicle,
        updateVehicle,
        saveVehicleConcern,
        deleteVehicleConcern,
        getAdminRegion,
        getAdminRegionGroup,
        searchVehicleInfo,
        querySettleDetail,
        updateSettleStatus,
        getMaintain,
        maintenanceSettings,
        GetInsuranceDate,
        insertInsuranceDate,
        bindAdminRegion,
        deleteAdminRegion,
        listAdminRegionGroup,
        deleteAdminRegionGroup,
        queryAlarm,
        processAlarm,
        getUserVehicleCount,
        sendCommandDown,
        groupDown,
        getPassBack,
        getWorkMode,
        getGroupPassBack,
        getRemarkList,
        pageImage,
        queryInOutVehicleReportList,
        getOBDVehicleInfo,
        getVehicleDateByPlate,
        exportInOutVehicleReport,
        ...toRefs(data)
    }
}