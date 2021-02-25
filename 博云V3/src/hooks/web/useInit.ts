import API from "@/api/httpApi";
import VAPI from "@/api/vehGroup";
import MDAPI from "@/api/manageData";
import MAPI from "@/api/monitorCenter";
import UAPI from "@/api/manageData";
import store from "@/store/index";

export function useInit() {
  /**
   * 获取车组数据
   */
  // const getGroup = async () => {
  //   try {
  //     const { obj } = await VAPI.loadGroups({ concernNeed: false });
  //     store.commit("COMMIT_GROUPLIST", obj.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  async function getVehGroupData() {
    try {
      const { obj } = await VAPI.loadGroups({ concernNeed: true });
      store.commit("COMMIT_ALLGROUPLIST", obj.data);
      store.commit("COMMIT_GROUPLIST", obj.data.filter((item: any) => (item.gi !== -1 && item.gi !== -2)));
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 获取用户数据
   */
  async function getUserAllData() {
    try {
      const { obj } = await MDAPI.listUser({type:0});
      store.commit("COMMIT_USERLIST", obj);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 获取省市区数据
   */
  async function getCitys() {
    const { obj, flag } = await API.getAreaBaseInfo();
    if (flag == 1) {
      const { list } = obj;
      store.commit("COMMIT_CITYS", list);
    }
  }

  /**
   * 获取车辆类型
   */
  async function getVehTypes() {
    const { obj, flag } = await API.getTerminalMap();
    if (flag == 1) {
      const { data } = obj;
      store.commit("COMMIT_VEHTYPES", data);
    }
  }

  /**
   * 获取保险明细和险种明细
   */
  async function GetInsuranceList(type: number) {
    try {
      const { flag, obj } = await MAPI.GetInsuranceList({ type: type });
      if (flag == 1 && obj) {
        if (type == 1) {
          store.commit("COMMIT_INSURANCE", obj);
        } else if (type == 3) {
          store.commit("COMMIT_INSURANCETYPE", obj);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 获取设备类型对应的指令
   */
  async function listCommandResource() {
    try {
      const { flag, obj } = await API.listCommandResource();
      if (flag === 1) {
        store.commit("COMMIT_TERMINALLIST", obj);
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 列表查询设备的指令权限
   */
  async function listTerminalResource() {
    try {
      const { flag, obj } = await API.listTerminalResource();
      if (flag === 1) {
        store.commit("COMMIT_TERMINALRESOURCE", obj || []);
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 获取用户权限设置列表
   */
  async function listPermission() {
    try {
      const { flag, obj } = await API.listPermission();
      const data = await API.userPermissionList();
      if (flag === 1) {
        obj.forEach((item: any) => {
          data.obj.forEach((items: any) => {
            if (item.permissionId === items.permissionId) {
              item.checked = items.status === 0 ? true : false;
            }
          });
        });
        store.commit("COMMIT_SYSTEMSETLIST", obj);
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 列表查询登录用户所有资源（指令资源、用户设置）
   */
  async function getListAll() {
    try {
      const { flag, obj } = await API.listAll();

      if (flag === 1) {
        // 获取设备类型对应的指令
        store.commit("COMMIT_TERMINALLIST", obj.commandResource);
        // 获取用户权限设置列表
        getSysPermission(obj.sysPermission);
        // 设备特殊菜单资源
        store.commit("COMMIT_SPECTERMINALLIST", obj.terminalMenuResource);
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 处理用户系统设置
   */
  async function getSysPermission(list: any) {
    const { obj, flag } = await API.userPermissionList();
    list.forEach((item: any) => {
      if (flag === 1) {
        obj.forEach((items: any) => {
          if (item.permissionId === items.permissionId) {
            item.checked = items.status === 0 ? true : false;
          }
        });
      } else {
        item.checked = true;
      }
    });
    store.commit("COMMIT_SYSTEMSETLIST", list);
  }

  /**
   * 获取用户信息
   */
  async function getUser() {
    try {
      const { flag, obj } = await UAPI.getUser({});

      if (flag === 1) {
        store.commit("COMMIT_USER", obj);
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 
   * 获取用户设备在线状态
   */
  async function getUserVehicleCount() {
    try {
      const { obj,flag,msg } = await MDAPI.getUserVehicleCount({});
      if(flag !== 1){
        throw msg
      }
      store.commit("COMMIT_VEHCOUNT", obj.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function init(flag?: boolean) {
    await getUser();
    getUserAllData();
    getVehGroupData();
    getListAll();
    getUserVehicleCount();
    listTerminalResource();
    if (flag) {
      getVehTypes();
      GetInsuranceList(1);
      GetInsuranceList(3);
      getCitys();
    }
  }

  return {
    init,
    getVehGroupData,
    getUserAllData
  }
}