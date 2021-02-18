import Vue from '@/assets/js/usePlugin';
import "@/assets/js/BSJMap";
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element'

Vue.config.productionTip = false;


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');


BSJMap.Config({
  mapOpts: {
    mapType: 'AMap',
  }
})
