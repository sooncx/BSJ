import Vue from "vue";
import API from "@/api/httpApi";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element";

import "@/assets/css/reset.scss";

Vue.prototype.$API = API;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
