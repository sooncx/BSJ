import Vue from 'vue';
import VueRouter from 'vue-router';
import userManage from '@/views/userManage/index.vue'
import deviceManage from '@/views/deviceManage/index.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    component: resolve => require(['@/views/index.vue'], resolve),
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "home",
        component: resolve => require(['@/views/home/index.vue'], resolve)
      },
      {
        path: "/monitorCenter",
        name: "monitorCenter",
        component: resolve => require(['@/views/monitorCenter/index.vue'], resolve)
      },
      {
        path: '/deviceManage',
        name: 'deviceManage',
        component: deviceManage,
      },
      {
        path: '/userManage',
        name: 'userManage',
        component: userManage,
      }
    ]
  }
];

const router = new VueRouter({
  routes,
});

export default router;
