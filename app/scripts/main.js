import '@style/main.scss';

import Vue from 'vue';
import firebase from './plugins/firebase';
import setOrRemoveBlueBackground from './plugins/setOrRemoveBlueBackground';
import router from './router';
import store from './store';
import App from './app';

Vue.config.debug = true;
Vue.config.productionTip = false;

const RaiseWebAppConfig = {
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App,
  },
};

Vue.use(firebase);
Vue.use(setOrRemoveBlueBackground);

/* eslint-disable no-new */
new Vue(RaiseWebAppConfig);
