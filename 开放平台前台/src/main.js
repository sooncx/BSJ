import Vue from "vue";
import API from "@/api/httpApi";
import day from "dayjs";
import $ from 'jquery';
import axios from "axios";
import VueClipboard from 'vue-clipboard2';
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element";
import "@/assets/css/reset.scss";
import "@/assets/css/animate.scss";

VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);
Vue.prototype.$ = $;
Vue.prototype.$API = API;
Vue.prototype.$http = axios;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  day,
  render: h => h(App)
}).$mount("#app");
