import App from './App.vue'
import router from './router'
import store from './store'
import Vue from './assets/js/usePlugin'
import i18n from './i18n/i18n'

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  components: { App },
  template: '<App/>',
  store
})
