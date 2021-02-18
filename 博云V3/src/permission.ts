import router from './router';
import store from './store';

router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.ignoreAuth)) {
    // 判断该路由是否需要登录权限
    if (store.state.sessionId) {
      if (store.state.headerMenu.length !== 0) {
        const permissions = store.state.headerMenu.concat(store.state.dataReportMenu, store.state.manageDataMenu);
        const flag = permissions.find((item: any) => item.id === to.meta.id);

        // 系统设置工单菜单路由拦截
        const sysPermissions = store.state.systemSetList;
        let sysflag = true;
        if (sysPermissions) {
          const workSheet = sysPermissions.filter((item: any) => item.permissionId === 11);
          sysflag = workSheet ? workSheet[0].checked : true;
          if (to.meta.id === 1606 || to.meta.id === 1607) {
            if (!sysflag) {
              localStorage.removeItem('manageData_histroyRoute');
            }
          }
        }

        if (flag && !((to.meta.id === 1606 || to.meta.id === 1607) && !sysflag)) {
          next();
        } else {
          next('/404');
        }
      } else {
        store.dispatch('GenerateRoutes').then(accessRoutes => {
          if (accessRoutes.headerMenu.length !== 0) {
            next();
            accessRoutes.manageDataMenu.length !== 0 &&
              localStorage.setItem('manageData_histroyRoute', findTarget(accessRoutes.manageDataMenu[0].id, router.options.routes).name);
            accessRoutes.dataReportMenu.length !== 0 &&
              localStorage.setItem('dataReport_histroyRoute', findTarget(accessRoutes.dataReportMenu[0].id, router.options.routes).name)
          } else {
            next('/login');
          }

        });
      }
    } else {
      next('/login');
    }
  } else {
    // 若没上面的判断，说明是访客组就可以访问的页面
    next();
  }
});

/**
 * 递归查询目标对象
 */
function findTarget(targetId: number, children: any): any {
  for (let i = 0; i < children.length; i++) {
    if (children[i].meta.id === targetId) {
      return children[i];
    }
    if (children[i].children) {
      const result = findTarget(targetId, children[i].children)
      if (result) {
        return result;
      }
    }
  }
}
