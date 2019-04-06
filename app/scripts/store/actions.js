import firebase from 'firebase';
import moment from 'moment';
import {
  SYNC_USER_LOCALLY_AND_FIREBASE,
  GET_ALL_USERS_SHIPPING_ORDERS,
  CREATE_NEW_SHIPPING_ORDERS,
  SYNC_USER_TO_DATASTORE,
} from '@store/actionTypes';
import { SERVER_LOCATION, VITUMOB_USER } from '@constant';

export default {
  [SYNC_USER_LOCALLY_AND_FIREBASE]({ commit }, { user, redirect }) {
    commit('setUser', user);
    window.localStorage.setItem(VITUMOB_USER, JSON.stringify(user));

    const ref = firebase.database().ref(`users/${user.uid}`);
    return ref.once('value').then((snapshot) => {
      const transaction = snapshot.exists() ? ref.update(user) : ref.set(user);
      return typeof redirect === 'function' ? transaction.then(redirect) : transaction;
    });
  },
  [SYNC_USER_TO_DATASTORE](_, user) {
    const endpoint = `${SERVER_LOCATION}/user`;
    const isUpdate = 'phone_number' in user;
    const resourceUrl = isUpdate ? `${endpoint}/${user.id}` : endpoint;
    const HTTPMethod = isUpdate ? 'PUT' : 'POST';

    // delete empty/null/undefined properties from the object
    // prettier-ignore
    Object.keys(user).forEach(prop => { if (!user[prop]) delete user[prop]; });

    const userData = JSON.stringify({ user: JSON.stringify(user) });
    const createOrUpdateUserRequest = $.ajax({
      url: resourceUrl,
      type: HTTPMethod,
      dataType: 'json',
      data: userData,
      contentType: 'application/json',
    });
    return createOrUpdateUserRequest;
  },
  [GET_ALL_USERS_SHIPPING_ORDERS]({ commit }, userId) {
    // http://localhost:8080/user/vC2iFCwx9BYnVlB7rvmtG3SbNtm1/orders/shipping_only
    const getUserShippingOnlyOrdersRequest = $.get(
      `${SERVER_LOCATION}/user/${userId}/orders/shipping_only`
    );

    return getUserShippingOnlyOrdersRequest.done(({ orders: shippingOnlyOrders }) => {
      const orders = shippingOnlyOrders.map((order) => {
        const { id, items, created_at: createdAt } = order;
        return { id, items, createdAt };
      });
      // prettier-ignore
      commit('setUserShippingOrders', orders.sort((orderA, orderB) => (
        moment(orderB.createdAt).unix() - moment(orderA.createdAt).unix()
      )));
    });
  },
  [CREATE_NEW_SHIPPING_ORDERS]({ state, commit }, order) {
    order.user = state.user.id || state.user.uid;
    const createOrderRequest = $.ajax({
      url: `${SERVER_LOCATION}/order/shipping_only`,
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify({ order }),
      contentType: 'application/json',
    });

    return createOrderRequest.done((orderCreatedResponse) => {
      const { order_id: id, order_hex: hex } = orderCreatedResponse;
      commit('updateShippingOrderDetails', { id, hex });
    });
  },
};
