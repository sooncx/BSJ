import Vue from 'vue';
import store from '@/store';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err);
};

function redirectUrl() {
  const LOGINUSER = localStorage.getItem("LOGINUSER") ? JSON.parse(localStorage.getItem("LOGINUSER")) : null;
  if (!LOGINUSER) return "/home";
  return "/home";
}
function redirectUrl2() {
  return "/solution/financialRisk";
}
const routes = [
  // {
  //   path: "/AIPanel",
  //   name: "AIPanel",
  //   component: () => import('../views/AIPanel/index.vue'),
  // },
  {
    path: "/controlPanel",
    name: "controlPanel",
    component: () => import('../views/controlPanel/index.vue'),
    redirect: "/controlPanel/appManage",
    children: [{
      path: "/controlPanel/appManage",
      name: "appManage",
      component: () => import('../views/controlPanel/appManage/index.vue'),
      meta: {
        requiresAuth: true,
        roles: ['loginer']
      },
    },
    {
      path: "/controlPanel/limitBuy",
      name: "limitBuy",
      component: () => import('../views/controlPanel/limitBuy/index.vue'),
    },
    {
      path: "/controlPanel/limitApplyRecord",
      name: "limitApplyRecord",
      component: () => import('../views/controlPanel/limitApplyRecord/index.vue'),
    },
    {
      path: "/controlPanel/limitEquity",
      name: "limitEquity",
      component: () => import('../views/controlPanel/limitEquity/index.vue'),
    },
    {
      path: "/controlPanel/userCenter",
      name: "userCenter",
      component: () => import('../views/controlPanel/userCenter/index.vue'),
    },
    {
      path: "/controlPanel/Documentation",
      name: "Documentation",
      component: () => import('../views/controlPanel/Documentation/index.vue'),
    }]
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: redirectUrl,
    children: [{
      path: "/home",
      name: "home",
      component: () => import('../views/home/index.vue'),
    },
    {
      path: "/AIDetect",
      name: "AIDetect",
      component: () => import('../views/AIDetect/index.vue'),
      redirect: "/AIDetect/Detece"
    },
    {
      path: "/AIDetect/Detece",
      name: "Detece",
      component: () => import('../views/AIDetect/Detece/index.vue'),
    },
    {
      path: "/AIDetect/Compare",
      name: "Compare",
      component: () => import('../views/AIDetect/Compare/index.vue'),
    },
    {
      path: "/solution",
      name: "solution",
      component: () => import('../views/solution/index.vue'),
      redirect: redirectUrl2
    },
    {
      path: "/solution/financialRisk",
      name: "financialRisk",
      component: () => import('../views/solution/financialRisk/index.vue'),
    },
    {
      path: "/solution/schoolBus",
      name: "schoolBus",
      component: () => import('../views/solution/schoolBus/index.vue'),
    },
    {
      path: "/solution/coach",
      name: "coach",
      component: () => import('../views/solution/coach/index.vue'),
    },
    {
      path: "/solution/monitor",
      name: "monitor",
      component: () => import('../views/solution/monitor/index.vue'),
    },
    {
      path: "/solution/IOT",
      name: "IOT",
      component: () => import('../views/solution/IOT/index.vue'),
    },
    {
      path: "/solution/Tencent",
      name: "Tencent",
      component: () => import('../views/solution/Tencent/index.vue'),
    },
    {
      path: "/solution/AITechnology",
      name: "AITechnology",
      component: () => import('../views/solution/AITechnology/index.vue'),
    },
    {
      path: "/businessCooperation",
      name: "businessCooperation",
      component: () => import('../views/businessCooperation/index.vue'),
    },
    {
      path: "/developDoc",
      name: "developDoc",
      component: () => import('../views/developDoc/index.vue'),
    },
    {
      path: "/serviceUpgrade",
      name: "serviceUpgrade",
      component: () => import('../views/serviceUpgrade/index.vue'),
    }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  // {
  //   path: '/downloadPDF',
  //   name: 'downloadPDF',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/developDoc/downloadPDF/index.vue'),
  // }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  // base: process.env.NODE_ENV === "production" ? "/webConsole/" : process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requiresAuth)) {
    // 判断该路由是否需要登录权限
    if (store.state.LOGINUSER) {
      const role = store.state.LOGINUSER ? "loginer" : "visitor"; // 用作后期登陆类型扩展
      if (to.meta.roles.includes(role)) { // 只有登陆后可以查看的页面
        next();
      } else {
        next('/home');
      }
    } else {
      next('/home');
    }
  } else {
    // 若没上面的判断，说明是访客组就可以访问的页面
    next();
  }
});
export default router;
