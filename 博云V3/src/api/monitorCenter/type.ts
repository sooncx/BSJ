namespace APIType {
    // 获取车辆信息传参
    export type vehParam = {
        groupId: number | string; // 组织id
        showVehId?: string | number; // 当前已选中车辆，用于轮询获取选中车辆最新数据
        searchVehId?: number | string; // 模糊查询选中项若是车辆而不是车组
        state: number | string; // 查询状态1：在线（行驶、静止），2：离线（离线、从未上线、已到期）
        alarmPermission: number | string; // 过滤三急报警权限，0过滤，1不过滤
        pageNumber?: number | string; // 当前页数
        pageSize: number | string; //每页数量
    }
    // 查询车辆返回信息
    export type vehRes = {

    }
}
export default APIType;