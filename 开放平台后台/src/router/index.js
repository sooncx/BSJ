import Vue from 'vue';
import store from '@/store';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

function redirectUrl() {
  return "/home";
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: resolve => require(['../views/Home'], resolve),
    redirect: redirectUrl,
    meta: {
      requiresAuth: true
    },
    children: [{
      path: "/home",
      name: "home",
      component: resolve => require(["../views/home/index.vue"], resolve),
      redirect: "/home/control",
      children: [{
        path: "/home/control",
        name: "control",
        component: resolve => require(["../views/home/control/index.vue"], resolve),
      },
      {
        path: "/home/userManage",
        name: "userManage",
        component: resolve => require(["../views/home/userManage/index.vue"], resolve),
      },
      {
        path: "/home/limitManage",
        name: "limitManage",
        component: resolve => require(["../views/home/limitManage/index.vue"], resolve),
      },
      {
        path: "/home/interfaceManage",
        name: "interfaceManage",
        component: resolve => require(["../views/home/interfaceManage/index.vue"], resolve),
      }]
    }]
  },
  {
    path: '/login',
    name: 'login',
    component: resolve => require(["../views/login/index.vue"], resolve),
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requiresAuth)) {
    // 判断该路由是否需要登录权限
    if (store.state.USER) {
      next();
    } else {
      next({
        path: "/login"
      });
    }
  } else { // 若没上面的判断，说明是访客组就可以访问的页面
    next();
  }
});
export default router;
