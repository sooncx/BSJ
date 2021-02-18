import { createApp } from 'vue';

import { setupAntd } from '@/setup/ant-design-vue';
import { setupElement } from '@/setup/element-plus';
import { ElMessage } from 'element-plus';
import { setupRouter } from '@/router';
import store from './store';

import App from './App.vue';
import '@/assets/css/reset.less';

const app = createApp(App);
app.config.globalProperties.$Elmessage = ElMessage;
// ui
setupAntd(app);
setupElement(app);
// router
setupRouter(app);
// store
app.use(store);
import './permission';

// 按钮权限
app.directive('permission', {
  mounted(el, binding) {
    let btnPermission = store.state.btnPermission;
    if (binding.value) {
      if (!btnPermission.includes(binding.value as never)) {
        el.parentNode.removeChild(el);
      }
    }
  }
});

app.mount('#app');
