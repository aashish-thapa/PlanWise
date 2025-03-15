import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueToastification from 'vue-toastification';
import 'vue-toastification/dist/index.css'
createApp(App)
  .use(router)
  .use(store)
  .use(VueToastification)
  .mount('#app');
