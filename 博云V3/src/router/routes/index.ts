import type { AppRouteRecordRaw } from '@/router/types';

//生成重定向页面
function redirectUrl() {
  // const USER = localStorage.getItem("USER") ? JSON.parse(localStorage.getItem("USER") as any) : null;
  // if (!USER) return "/login";
  return "/monitorCenter";
}
// 用于侧边栏历史路由记录模式
function histroyRedirectUrl(path: string) {
  const name: string = path.split("/")[1];
  const histroyRoute: any = localStorage.getItem([name, "_histroyRoute"].join(""));
  let newPath: any[] = path.split("/");
  newPath[newPath.length - 1] = histroyRoute;
  console.log(newPath.join("/"), "历史重定向url");
  if (histroyRoute && !["", null, "null"].includes(histroyRoute)) {
    return newPath.join("/");
  }
  return path;
}
// 主框架根路由
export const LoginRoute: AppRouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home/index.vue'),
    meta: {
      id: 11,
      title: '首页',
      ignoreAuth: true,
    },
  },
  {
    path: '/playBack',
    name: 'playBack',
    component: () => import('@/views/playBack/index.vue'),
    meta: {
      id: 14,
      title: '轨迹回放',
      ignoreAuth: true,
    },
  },
  {
    path: "/",
    name: "index",
    component: () => import('@/views/index.vue'),
    redirect: () => redirectUrl(),
    meta: {
      title: 'index',
      ignoreAuth: true,
    },
    children: [
      {
        path: '/monitorCenter',
        name: 'monitorCenter',
        component: () => import('@/views/monitorCenter/index.vue'),
        meta: {
          id: 13,
          title: '监控中心',
          ignoreAuth: true,
        },
      },
      {
        path: '/dataReport',
        name: 'dataReport',
        component: () => import('@/views/dataReport/index.vue'),
        redirect: () => histroyRedirectUrl("/dataReport/alarmInfo"),
        meta: {
          id: 15,
          title: '数据报表',
          ignoreAuth: true,
        },
        children: [
          {
            path: '/dataReport/alarmInfo',
            name: 'alarmInfo',
            component: () => import('@/views/dataReport/pages/alarmInfo/index.vue'),
            meta: {
              id: 1501,
              title: '报警记录',
              ignoreAuth: true,
            },
          },
          {
            path: '/dataReport/offline',
            name: 'offline',
            component: () => import('@/views/dataReport/pages/offline/index.vue'),
            meta: {
              id: 1502,
              title: '离线统计',
              ignoreAuth: true,
            },
          },
          {
            path: '/dataReport/drivingStatistics',
            name: 'drivingStatistics',
            component: () => import('@/views/dataReport/pages/drivingStatistics/index.vue'),
            meta: {
              id: 1503,
              title: '行车统计',
              ignoreAuth: true,
            },
          },
          {
            path: '/dataReport/parkingReport',
            name: 'parkingReport',
            component: () => import('@/views/dataReport/pages/parkingReport/index.vue'),
            meta: {
              id: 1504,
              title: '停车报表',
              ignoreAuth: true,
            },
          },
          {
            path: '/dataReport/frequentStops',
            name: 'frequentStops',
            component: () => import('@/views/dataReport/pages/frequentStops/index.vue'),
            meta: {
              id: 1505,
              title: '经常停留',
              ignoreAuth: true,
            },
          },
          {
            path: '/dataReport/remainderElectric',
            name: 'remainderElectric',
            component: () => import('@/views/dataReport/pages/remainderElectric/index.vue'),
            meta: {
              id: 1506,
              title: '剩余电量',
              ignoreAuth: true,
            },
          },
          {
            path: '/dataReport/mileageReport',
            name: 'mileageReport',
            component: () => import('@/views/dataReport/pages/mileageReport/index.vue'),
            meta: {
              id: 1507,
              title: '里程报表',
              ignoreAuth: true,
            },
          },
          {
            path: '/dataReport/totalMileage',
            name: 'totalMileage',
            component: () => import('@/views/dataReport/pages/totalMileage/index.vue'),
            meta: {
              id: 1508,
              title: '总里程报表',
              ignoreAuth: true,
            },
          },
          {
            path: '/dataReport/instruction',
            name: 'instruction',
            component: () => import('@/views/dataReport/pages/instruction/index.vue'),
            meta: {
              id: 1509,
              title: '指令查询',
              ignoreAuth: true,
            },
          },
          {
            path: '/dataReport/operationRecord',
            name: 'operationRecord',
            component: () => import('@/views/dataReport/pages/operationRecord/index.vue'),
            meta: {
              id: 1510,
              title: '操作记录',
              ignoreAuth: true,
            },
          },
          {
            path: '/dataReport/maintainReport',
            name: 'maintainReport',
            component: () => import('@/views/dataReport/pages/maintainReport/index.vue'),
            meta: {
              id: 1511,
              title: '保养报表',
              ignoreAuth: true,
            },
          },
          {
            path: '/dataReport/insuranceReport',
            name: 'insuranceReport',
            component: () => import('@/views/dataReport/pages/insuranceReport/index.vue'),
            meta: {
              id: 1512,
              title: '保险报表',
              ignoreAuth: true,
            },
          },
          {
            path: '/dataReport/obdReport',
            name: 'obdReport',
            component: () => import('@/views/dataReport/pages/obdReport/index.vue'),
            meta: {
              id: 1513,
              title: 'OBD报表',
              ignoreAuth: true,
            },
          },
          {
            path: '/dataReport/lockAlarmRecord',
            name: 'lockAlarmRecord',
            component: () => import('@/views/dataReport/pages/lockAlarmRecord/index.vue'),
            meta: {
              id: 1514,
              title: '物流锁报警记录',
              ignoreAuth: true,
            },
          },
          {
            path: '/dataReport/lockOperationRecord',
            name: 'lockOperationRecord',
            component: () => import('@/views/dataReport/pages/lockOperationRecord/index.vue'),
            meta: {
              id: 1515,
              title: '物流锁操作记录',
              ignoreAuth: true,
            },
          },
        ],
      },
      {
        path: '/manageData',
        name: 'manageData',
        component: () => import('@/views/manageData/index.vue'),
        redirect: () => histroyRedirectUrl('/manageData/pages/userManage'),
        meta: {
          id: 16,
          title: '资料管理',
          ignoreAuth: true,
        },
        children: [
          {
            path: '/manageData/pages/userManage',
            name: 'userManage',
            component: () => import('@/views/manageData/pages/userManage/index.vue'),
            meta: {
              id: 1601,
              title: '用户管理',
              ignoreAuth: true,
            },
          },
          {
            path: '/manageData/pages/roleManage',
            name: 'roleManage',
            component: () => import('@/views/manageData/pages/roleManage/index.vue'),
            meta: {
              title: 'roleManage',
            },
          },
          {
            path: '/manageData/pages/carManage',
            name: 'carManage',
            component: () => import('@/views/manageData/pages/carManage/index.vue'),
            meta: {
              id: 1602,
              title: '车辆管理',
              ignoreAuth: true,
            },
          },
          {
            path: '/manageData/pages/stepsImport',
            name: 'stepsImport',
            component: () => import('@/views/manageData/pages/stepsImport/index.vue'),
            meta: {
              id: 1603,
              title: '批量导入',
              ignoreAuth: true,
            },
          },
          {
            path: '/manageData/pages/carRecharge',
            name: 'carRecharge',
            component: () => import('@/views/manageData/pages/carRecharge/index.vue'),
            meta: {
              id: 1604,
              title: '车辆续费',
              ignoreAuth: true,
            },
          },
          {
            path: '/manageData/pages/settleList',
            name: 'settleList',
            component: () => import('@/views/manageData/pages/settleList/index.vue'),
            meta: {
              id: 1605,
              title: '结清列表',
              ignoreAuth: true,
            },
          },
          {
            path: '/manageData/pages/workSheet',
            name: 'workSheet',
            component: () => import('@/views/manageData/pages/workSheet/index.vue'),
            meta: {
              id: 1606,
              title: '工单管理',
              ignoreAuth: true,
            },
          },
          {
            path: '/manageData/pages/installWorker',
            name: 'installWorker',
            component: () => import('@/views/manageData/pages/installWorker/index.vue'),
            meta: {
              id: 1607,
              title: '安装人员管理',
              ignoreAuth: true,
            },
          },
        ]
      },
      {
        path: '/riskControlCenter',
        name: 'riskControlCenter',
        component: () => import('@/views/riskControlCenter/index.vue'),
        meta: {
          id: 12,
          title: '风控中心',
          ignoreAuth: true,
        },
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/404/index.vue'),
    meta: {
      title: '404',
    },
  },
]

// 基础路由
export const basicRoutes = LoginRoute;
