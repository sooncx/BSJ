import router from "./routers";
import store from '@/store'

router.beforeEach((to, from, next) => {

  if (to.meta.requireAuth) {
    // 判断该路由是否需要登录权限
    if (store.state.USER&&store.state.USER.TOKEN) {
      // 通过vuex state获取当前的token是否存在
      next();
    } else {
      next({
        path: "/login",
        query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  } else {
    next();
  }
});

export default router;
