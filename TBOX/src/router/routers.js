import Router from "vue-router";
import Vue from "vue";

Vue.use(Router);

//生成重定向页面
function redirectUrl() {
  const USER = localStorage.getItem("USER") ? JSON.parse(localStorage.getItem("USER")) : null;
  if (!USER) return "/login";
  return "/home";
}

export default new Router({
  routes: [
    {
      path: "/login",
      name: "login",
      component: resolve => require(['@/views/login/index.vue'], resolve)
    },
    {
      path: "/",
      name: "index",
      component: resolve => require(['@/views/index.vue'], resolve),
      redirect: redirectUrl,
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
          path: "/playback",
          name: "playback",
          component: resolve => require(["@/views/playback/index.vue"], resolve)
        },
        {
          path: "/manageData",
          name: "manageData",
          component: resolve => require(['@/views/manageData/index.vue'], resolve),
          redirect: "/manageData/userManage",
          children: [
            {
              path: "/manageData/userManage",
              name: "userManage",
              component: resolve => require(['@/views/manageData/userManage/index.vue'], resolve)
            },
            {
              path: "/manageData/vehManage",
              name: "vehManage",
              component: resolve => require(['@/views/manageData/vehManage/index.vue'], resolve)
            },
            {
              path: "/manageData/vehTypeManage",
              name: "vehTypeManage",
              component: resolve => require(['@/views/manageData/vehTypeManage/index.vue'], resolve)
            },
            {
              path: "/manageData/importVehsExcel",
              name: "importVehsExcel",
              component: resolve => require(['@/views/manageData/importVehsExcel/index.vue'], resolve)
            }
          ]
        },
        {
          path: "/reportCenter",
          name: "reportCenter",
          component: resolve => require(['@/views/reportCenter/index.vue'], resolve),
          redirect: "/reportCenter/offLine",
          children: [
            {
              path: "/reportCenter/offLine",
              name: "offLine",
              component: resolve => require(['@/views/reportCenter/offLine/index.vue'], resolve)
            },
            {
              path: "/reportCenter/dailyOilWear",
              name: "dailyOilWear",
              component: resolve => require(['@/views/reportCenter/dailyOilWear/index.vue'], resolve)
            },
            {
              path: "/reportCenter/nox",
              name: "nox",
              component: resolve => require(['@/views/reportCenter/nox/index.vue'], resolve)
            },
            {
              path: "/reportCenter/illegal",
              name: "illegal",
              component: resolve => require(['@/views/reportCenter/illegal/index.vue'], resolve)
            },
            {
              path: "/reportCenter/OBDHistory",
              name: "OBDHistory",
              component: resolve => require(['@/views/reportCenter/OBDHistory/index.vue'], resolve)
            }
          ]
        }
      ]
    }
  ]
});
