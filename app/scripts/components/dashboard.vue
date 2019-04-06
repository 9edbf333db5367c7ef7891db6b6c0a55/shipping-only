<template lang="pug">
.dashboard
  navigation-bar.mb-5
  .header
    .container
      .header-body
        .row.align-items-end
          .col
            h6.header-pretitle
              | Overview
            // Title
            h1.header-title
              | Shipments
          .col-auto
            // Button
            button.btn.btn-primary(@click="gotoOrAddNewShippingOrder")
              | Create Shipping Order

  call-to-action-jumbotron(
    v-if="!shippingOrders.length"
    v-bind="jumbotronConfig"
    v-on:method-to-invoke="invokeThisMethod"
  )

  .container(v-else)
    .row
      .col-12.col-xs-12
        .card
          .card-header
            .row.align-items-center
              .col
                // Title
                h4.card-header-title
                  | Orders
              .col-auto
                // Button
                //- a.btn.btn-sm.btn-white(href='#!')
                //-   | Add Shipping Order
            // / .row
          .table-responsive.mb-0(data-toggle='lists',
            data-lists-values='["goal-project", "goal-status", "goal-progress", "goal-date"]')
            table.table.table-sm.table-nowrap.card-table
              thead
                tr
                  th
                    a.text-muted.sort(href='#', data-sort='goal-project')
                      | Order ID
                  th
                    a.text-muted.sort(href='#', data-sort='goal-status')
                      | No. of orders
                  th
                    a.text-muted.sort(href='#', data-sort='goal-progress')
                      | Status
                  th
                    a.text-muted.sort(href='#', data-sort='goal-date')
                      | Creation date
              tbody.list
                tr(v-for="order in shippingOrders")
                  td.goal-project
                    a.btn.btn-white.btn-sm(@click="gotoOrAddNewShippingOrder(order.id)")
                      | {{ order.id }}
                  td.goal-status
                    |  {{ order.items.length }}
                  td.goal-progress
                    span.text-success ● &nbsp;
                    | N/A
                  td.goal-date
                    time(v-bind:datetime='order.createdAt')
                      | {{ order.createdAt | humanReadableDate }}
</template>

<script>
/* eslint-disable prettier/prettier, max-len, vue/name-property-casing, no-console */
import { mapState } from 'vuex';
import moment from "moment";
import validateAuthenticationForm from '@mixin/validateAuthenticationForm';
import { GET_ALL_USERS_SHIPPING_ORDERS } from '@store/actionTypes';
import NavigationBar from '@component/re-usable/navigationBar.vue';
import CallToActionJumbotron from '@component/re-usable/callToActionJumbotron.vue';

export default {
  name: 'Dashboard',
  components: {
    NavigationBar,
    CallToActionJumbotron,
  },
  filters: {
    humanReadableDate(date) {
      return moment(date).format('LLL');
    },
  },
  mixins: [validateAuthenticationForm],
  data() {
    return {
      jumbotronConfig: {
        header: 'Hey! Feel free to add new shipping orders.',
        paragraph: 'To clearly know what you have is the 1st step to aknowledging how powerful your are.',
        buttonConfig: {
          text: 'Create Shipping Order',
          methodToInvoke: 'gotoOrAddNewShippingOrder',
        },
      },
    };
  },
  computed: {
    ...mapState({
      shippingOrders: 'shippingOrders',
    }),
  },
  created() {
    this.$store.dispatch(GET_ALL_USERS_SHIPPING_ORDERS, this.user.id || this.user.uid);
  },
  methods: {
    invokeThisMethod(method) {
      if(this[method]) this[method]();
    },
    gotoOrAddNewShippingOrder(orderId) {
      this.$router.push({ name: 'addShippingOrder', params: { orderId: orderId || 'new' } });
    },
  },
};
</script>
