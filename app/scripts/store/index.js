import Vue from 'vue';
import Vuex from 'vuex';
import actions from '@store/actions';
import { VITUMOB_USER } from '@constant';

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    user: {},
    shippingOrders: [],
    currentShippingOrder: {},
  },
  mutations: {
    setUser(state, user) {
      window.localStorage.setItem(VITUMOB_USER, JSON.stringify(user));
      state.user = user;
    },
    setUserShippingOrders(state, orders) {
      state.shippingOrders = orders;
    },
    setCurrentShippingOrders(state, shippingOrder) {
      state.currentShippingOrder = shippingOrder;
    },
    addItemsToShippingOrder(state, item) {
      if (!state.currentShippingOrder.items) {
        state.currentShippingOrder.initialized = true;
        state.currentShippingOrder.items = [];
      }

      // prettier-ignore
      const { currentShippingOrder: { items } } = state;
      item.id = new Date().getTime();
      items.push(item);

      state.currentShippingOrder = { items };
    },
    removeItemFromShippingOrder(state, itemId) {
      if (state.currentShippingOrder.items) {
        Vue.set(
          state.currentShippingOrder,
          'items',
          state.currentShippingOrder.items.filter((item) => item.id !== itemId)
        );
      }
    },
    updateShippingOrderDetails(state, orderMetaData) {
      state.currentShippingOrder = Object.assign({}, state.currentShippingOrder, orderMetaData);
    },
    resetNewShippingOrder(state) {
      state.currentShippingOrder = {};
    },
  },
  actions,
});
