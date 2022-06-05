import { createApp } from 'vue';
import App from './App.vue';
import './style/main.scss';

const waitAfterClick = {
  install(app) {
    app.config.globalProperties.$canClick = true;
    app.config.globalProperties.$waitAfterClick = function (ms) {
      this.$canClick = false;
      setTimeout(() => (this.$canClick = true), ms);
    };
  },
};

createApp(App).use(waitAfterClick).mount('#app');
