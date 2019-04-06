import Vue from 'vue';
import Router from 'vue-router';

import dashboard from '@component/dashboard.vue';
import addShippingOrder from '@component/addShippingOrder.vue';
import signUp from '@component/signUp.vue';
import signIn from '@component/signIn.vue';
import { isLoggedIn } from './guards/auth';

Vue.use(Router);
const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: dashboard,
    beforeEnter: isLoggedIn,
  },
  {
    path: '/order/:orderId',
    name: 'addShippingOrder',
    component: addShippingOrder,
    beforeEnter: isLoggedIn,
  },
  {
    path: '/sign-up',
    name: 'signUp',
    component: signUp,
  },
  {
    path: '/sign-in',
    name: 'signIn',
    component: signIn,
  },
  {
    path: '/*',
    redirect: '/',
  },
];

export default new Router({
  routes,
});
