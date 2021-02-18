import { createStore } from 'vuex';

import ApiType from '@/api/vehGroup/type';
import API from '@/api/httpApi';
import { toTreeData } from "@/utils";

interface stateType {
  sessionId: string | null,
  groupList: ApiType.loadGroupsRes['obj']['data'] | null,
  allGroupList: ApiType.loadGroupsRes['obj']['data'] | null,
  playIndex: number,
  USER: Object, // 用户信息
  insurance: Object, // 保险明细
  insuranceType: Object, // 险种明细
  headerMenu: any, // 顶部菜单栏权限
  dataReportMenu: any, // 数据报表菜单栏权限
  manageDataMenu: any, // 资料管理菜单栏权限
  btnPermission: any, // 按钮权限
  citys: Object, // 省市区
  vehTypes: Object, // 设备类型
  userList: any, // 用户列表
  excludeConfig: string[], // 缓存列表
  terminalList: {
    /**
     * 指令id
     */
    resourceId: number;
    /**
     * 指令名称
     */
    name: string;
    /**
     * 指令类型
     */
    param: string;
  }[], // 设备类型命令列表
  terminalResource: any[], // 设备的指令权限
  systemSetList: any[], // 系统设置列表
  specTerminalList: any[], // 设备特殊菜单资源
  groupListTree: any,
  VehCount: any, // 用户全部设备数量
}

export default createStore({
  state: {
    sessionId: localStorage.getItem("sessionId") ? JSON.parse(localStorage.getItem("sessionId") as any) : null,
    VehCount: localStorage.getItem("VehCount") ? JSON.parse(localStorage.getItem("VehCount") as any) : null,
    groupList: localStorage.getItem("groupList") ? JSON.parse(localStorage.getItem("groupList") as any) : null,
    playIndex: 0,
    USER: localStorage.getItem("USER") ? JSON.parse(localStorage.getItem("USER") as any) : null,
    insurance: localStorage.getItem("insurance") ? JSON.parse(localStorage.getItem("insurance") as any) : null,
    insuranceType: localStorage.getItem("insuranceType") ? JSON.parse(localStorage.getItem("insuranceType") as any) : null,
    allGroupList: localStorage.getItem("allGroupList") ? JSON.parse(localStorage.getItem("allGroupList") as any) : null,
    headerMenu: [],
    dataReportMenu: [],
    manageDataMenu: [],
    btnPermission: [],
    citys: localStorage.getItem("citys") ? JSON.parse(localStorage.getItem("citys") as any) : null,
    vehTypes: localStorage.getItem("vehTypes") ? JSON.parse(localStorage.getItem("vehTypes") as any) : null,
    userList: localStorage.getItem("userList") ? JSON.parse(localStorage.getItem("userList") as any) : null,
    excludeConfig: ['riskCenter', 'dateReport', 'manageData'],
    terminalList: localStorage.getItem("terminalList") ? JSON.parse(localStorage.getItem("terminalList") as any) : null,
    terminalResource: localStorage.getItem("terminalResource") ? JSON.parse(localStorage.getItem("terminalResource") as any) : null,
    systemSetList: localStorage.getItem("systemSetList") ? JSON.parse(localStorage.getItem("systemSetList") as any) : null,
    specTerminalList: localStorage.getItem("specTerminalList") ? JSON.parse(localStorage.getItem("specTerminalList") as any) : null,
    groupListTree: localStorage.getItem("groupListTree") ? JSON.parse(localStorage.getItem("groupListTree") as any) : null,
  },
  mutations: {
    COMMIT_VEHCOUNT(state: any, val: any) {
      val ? localStorage.setItem("VehCount", JSON.stringify(val)) : localStorage.removeItem("VehCount");
      state.VehCount = val;
    },
    COMMIT_VEHTYPES(state: any, val: any) {
      val ? localStorage.setItem("vehTypes", JSON.stringify(val)) : localStorage.removeItem("vehTypes");
      state.vehTypes = val;
    },
    COMMIT_CITYS(state: any, val: any) {
      val ? localStorage.setItem("citys", JSON.stringify(val)) : localStorage.removeItem("citys");
      state.citys = val;
    },
    COMMIT_USER(state: any, val: any) {
      val ? localStorage.setItem("USER", JSON.stringify(val)) : localStorage.removeItem("USER");
      state.USER = val;
    },
    COMMIT_INSURANCE(state: any, val: any) {
      val ? localStorage.setItem("insurance", JSON.stringify(val)) : localStorage.removeItem("insurance");
      state.insurance = val;
    },
    COMMIT_INSURANCETYPE(state: any, val: any) {
      val ? localStorage.setItem("insuranceType", JSON.stringify(val)) : localStorage.removeItem("insuranceType");
      state.insuranceType = val;
    },
    COMMIT_ALLGROUPLIST(state: any, val: any) {
      val ? localStorage.setItem("allGroupList", JSON.stringify(val)) : localStorage.removeItem("allGroupList");
      state.allGroupList = val;
    },
    COMMIT_SESSIONID(state: stateType, val: string) {
      val ? localStorage.setItem("sessionId", JSON.stringify(val)) : localStorage.removeItem("sessionId");
      state.sessionId = val;
    },
    COMMIT_GROUPLIST(state: stateType, val: any) {
      val ? localStorage.setItem("groupList", JSON.stringify(val)) : localStorage.removeItem("groupList");
      state.groupList = val;
      state.groupListTree =  toTreeData(val, { id: "gi", parentId: "pi" });
      localStorage.setItem("groupListTree", JSON.stringify(state.groupListTree));
    },
    COMMIT_PLAYINDEX(state: stateType, val: number) {
      state.playIndex = val;
    },
    COMMIT_HEADERMENU(state: stateType, val: any) {
      state.headerMenu = val;
    },
    COMMIT_DATAREPORTMENU(state: stateType, val: any) {
      state.dataReportMenu = val;
    },
    COMMIT_MANAGEDATAMENU(state: stateType, val: any) {
      state.manageDataMenu = val;
    },
    COMMIT_BTNPERMISSION(state: stateType, val: any) {
      state.btnPermission = val;
    },
    COMMIT_CLEAR(state: stateType) {
      state.headerMenu = [];
      state.dataReportMenu = [];
      state.manageDataMenu = [];
      state.btnPermission = [];
      state.allGroupList = [];
      state.sessionId = null;
      state.userList = null;
      state.playIndex = 0;
      state.excludeConfig = ['riskCenter', 'dateReport', 'manageData', 'monitorCenter'];
    },
    COMMIT_USERLIST(state: stateType, val: any) {
      val ? localStorage.setItem("userList", JSON.stringify(val)) : localStorage.removeItem("userList");
      state.userList = val;
    },
    COMMIT_EXCLUDECONFIG(state: stateType, val: string[]) {
      state.excludeConfig = val;
    },
    COMMIT_TERMINALLIST(state: stateType, val: stateType["terminalList"]) {
      val ? localStorage.setItem("terminalList", JSON.stringify(val)) : localStorage.removeItem("terminalList");
      state.terminalList = val;
    },
    COMMIT_TERMINALRESOURCE(state: stateType, val: any) {
      val ? localStorage.setItem("terminalResource", JSON.stringify(val)) : localStorage.removeItem("terminalResource");
      state.terminalResource = val;
    },
    COMMIT_SYSTEMSETLIST(state: stateType, val: any) {
      val ? localStorage.setItem("systemSetList", JSON.stringify(val)) : localStorage.removeItem("systemSetList");
      state.systemSetList = val;
    },
    COMMIT_SPECTERMINALLIST(state: stateType, val: any) {
      val ? localStorage.setItem("specTerminalList", JSON.stringify(val)) : localStorage.removeItem("specTerminalList");
      state.specTerminalList = val;
    },
  },
  actions: {
    GenerateRoutes({ commit }: any) {
      return new Promise((resolve, reject) => {
        // 向后端请求路由数据
        API.getResource().then(res => {
          let headerMenu: any[] = [];
          let dataReportMenu: any[] = [];
          let manageDataMenu: any[] = [];
          let btnpermission: any[] = [];
          // let demo: any[] = [];
          res.obj.forEach((item: any) => {
            if (item.type === 1) {
              headerMenu.push(item);
            }
            if (item.type === 2 && item.parentId === 15) {
              dataReportMenu.push(item);
            }
            if (item.type === 2 && item.parentId === 16) {
              manageDataMenu.push(item);
            }
            if (item.type === 3) {
              // demo.push(item);
              btnpermission.push(item.id);
            }
          });
          btnpermission.push(1);
          // console.log(demo);
          commit('COMMIT_HEADERMENU', headerMenu);
          commit('COMMIT_DATAREPORTMENU', dataReportMenu);
          commit('COMMIT_MANAGEDATAMENU', manageDataMenu);
          commit('COMMIT_BTNPERMISSION', btnpermission);
          resolve({
            headerMenu,
            dataReportMenu,
            manageDataMenu,
            btnpermission
          });
        }).catch(err => {
          reject(err);
        });
      })
    }
  }
})
