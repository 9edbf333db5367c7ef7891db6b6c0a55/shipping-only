<template lang="pug">
.dashboard
  navigation-bar.mb-5
  .header
    .container
      .header-body
        .row.align-items-end
          .col
            h6.header-pretitle
              | New Shipping Order
            // Title
            h1.header-title
              span.badge.badge-success.badge-sm.mr-2(v-if="!order.id") New
              | Shipping Order
              span.text-muted.order-id(v-if="order.id") # {{ order.id }}
          .col-auto
            // Button
            button.btn.btn-danger.btn-md(
              v-if="(order.items && order.items.length) && !order.id"
              @click="submitNewShippingOrder"
            )
              | Submit Shipping Order

            button.btn.btn-white.btn-md(v-else @click="returToTheDashboard")
              | Back to the dashboard

  call-to-action-jumbotron(
    v-if="!order.items || !order.items.length"
    v-bind="jumbotronConfig"
    v-on:method-to-invoke="openAddItemToShippingOrderModal"
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
                a.btn.btn-sm.btn-info(v-if="!order.id" @click="openAddItemToShippingOrderModal")
                  | Add Item to Order
            // / .row
          .table-responsive.mb-0(data-toggle='lists',
            data-lists-values='["goal-project", "goal-status", "goal-progress", "goal-date"]')
            table.table.table-sm.table-nowrap.card-table
              thead
                tr
                  th
                    a.text-muted.sort(href='#', data-sort='goal-project')
                      | Item Description
                  th
                    a.text-muted.sort(href='#', data-sort='goal-status')
                      | Quantity
                  th
                    a.text-muted.sort(href='#', data-sort='goal-progress')
                      | Merchant
                  th
                    a.text-muted.sort(href='#', data-sort='goal-status')
                      | Catgory
                  th
                    a.text-muted.sort(href='#', data-sort='goal-date')
                      | Recipient #No.
                  th(v-if="!order.id")
                    a.text-muted.sort(href='#', data-sort='goal-date')
                      | Options
              tbody.list
                tr(v-for="item in order.items" :key="item.id")
                  td.goal-project
                    | {{ item.productDesc }}
                  td.goal-status
                    |  {{ item.quantity }}
                  td.goal-status
                    | {{ item.merchant }}
                  td.goal-status
                    //- span.text-success ● &nbsp;
                    | {{ item.category }}
                  td.goal-date
                    | {{ item.phoneNumber }}
                  td.goal-date(v-if="!order.id")
                    button.btn-sm.btn-white(
                      @click="removeItemFromShippingOrder(item.id)"
                    ) Remove

  // Modal
  #addOrderModal.modal.fade(tabindex='-1' role='dialog'
    aria-labelledby='exampleModalLabel' aria-hidden='true')
    .modal-dialog(role='document')
      .modal-content
        .modal-header
          h3#exampleModalLabel.modal-title Add Shipping Item
          button.close(type='button', data-dismiss='modal', aria-label='Close')
            span(aria-hidden='true') ×

        .modal-body
          form
            .form-group
              label Product Title/Short Description
              input.form-control#email-address(
                type="text"
                v-on:keyup="validateAuthenticationForm",
                v-model="itemToValidate.productDesc",
                required,
                placeholder="product title or short description",
                v-bind:class="{'is-invalid': validation.productDesc.invalid }"
              )
              .invalid-feedback(v-show="validation.productDesc.invalid")
                | Please provide a short description or title of the product

            .form-group
              label Item Category
              h5.text-muted.text-sm.text-left.mb-3
                | Select a category your items falls under.
              select.form-control#role(
                data-toggle="select"
                v-model="itemToValidate.itemCategory"
                v-on:change="validateAuthenticationForm"
              )
                option(value='', disabled selected)
                  | Select category of the item
                option(v-for="itemCat in itemCategory" :value="itemCat.value") {{ itemCat.text }}
              .invalid-feedback(v-show="validation.itemCategory.invalid")
                | Please select a category that your item falls under

            .form-group
              label From Which Merchant
              input.form-control#email-address(
                type="email"
                v-on:keyup="validateAuthenticationForm",
                v-model="itemToValidate.merchant",
                required,
                placeholder="ordered or bought from which merchant",
                v-bind:class="{'is-invalid': validation.merchant.invalid }"
              )
              .invalid-feedback(v-show="validation.merchant.invalid")
                | Merchant required

            .form-group
              label Quantity
              input.form-control#email-address(
                type="email"
                v-on:keyup="validateAuthenticationForm",
                v-model="itemToValidate.quantity",
                required,
                placeholder="eg. 99",
                v-bind:class="{'is-invalid': validation.quantity.invalid }"
              )
              .invalid-feedback(v-show="validation.quantity.invalid")
                | Please provide a valid quantity at least 1

            .form-group
              label Recipient Phone Number
              input.form-control#names(
                type="text"
                v-on:keyup="validateAuthenticationForm"
                v-model="itemToValidate.phoneNumber"
                required
                placeholder="eg. +25472101010"
                v-bind:class="{'is-invalid': validation.phoneNumber.invalid }"
              )
              .invalid-feedback(v-show="validation.phoneNumber.invalid")
                | Please provide a valid phone no. eg. 072101010

        .modal-footer
          button.btn.btn-secondary(type='button' data-dismiss='modal') Close
          button.btn.btn-primary(
            type='button'
            v-on:click.prevent.stop="addItemToShippingOrder"
            v-bind:disabled="formInputsAreInvalid"
          ) Save changes
</template>

<script>
/* eslint-disable prettier/prettier, max-len, vue/name-property-casing, no-console */
import { mapState } from 'vuex';
import { CREATE_NEW_SHIPPING_ORDERS } from '@store/actionTypes';

import validateAuthenticationForm from '@mixin/validateAuthenticationForm';
import NavigationBar from '@component/re-usable/navigationBar.vue';
import CallToActionJumbotron from '@component/re-usable/callToActionJumbotron.vue';

export default {
  name: 'AddShippingOrder',
  components: {
    NavigationBar,
    CallToActionJumbotron,
  },
  mixins: [validateAuthenticationForm],
  data() {
    return {
      shippingOrderNo: '(fetching...)',
      valuesToValidate: ['productDesc', 'phoneNumber', 'merchant', 'quantity'],
      selectsToValidate: ['itemCategory'],
      itemCategory: [
        { text: "ARTS & CRAFT", value: 10 },
        { text: "AUTOMOTIVE", value: 11 },
        { text: "BABY", value: 12 },
        { text: "BEDDING", value: 13 },
        { text: "BOOKS", value: 14 },
        { text: "CLOTHES", value: 15 },
        { text: "COLOGNES, PERFUMES and POTIONS", value: 16 },
        { text: "COMPUTER ACCESSORIES", value: 17 },
        { text: "DRY GOODS", value: 18 },
        { text: "HAND/BOOK BAGS", value: 19 },
        { text: "HOUSEHOLD GOODS", value: 20 },
        { text: "HEALTH & BEAUTY", value: 21 },
        { text: "KITCHENWARE", value: 22 },
        { text: "LITHIUM BATTERIES", value: 23 },
        { text: "MUSIC", value: 24 },
        { text: "OUTDOOR", value: 25 },
        { text: "PETS", value: 26 },
        { text: "PHONE ACCESSORIES", value: 27 },
        { text: "PHOTO ACCESSORIES", value: 28 },
        { text: "SHOES", value: 29 },
        { text: "SPORTING GOODS", value: 30 },
        { text: "TOOLS", value: 31 },
        { text: "TOYS", value: 32 },
      ],
      validation: {
        productDesc: {
          regexp: /^[\w\W\s\S]{6,}$/,
          invalid: false,
        },
        itemCategory: {
          regexp: /\S/,
          invalid: false,
        },
        merchant: {
          regexp: /^[\w\W\s\S]{6,}$/,
          invalid: false,
        },
        quantity: {
          regexp: /^[\d]{1,4}$/,
          invalid: false,
        },
        phoneNumber: {
          regexp: /^(\+254|0)[\d]{9}$/,
          invalid: false,
        },
      },
      jumbotronConfig: {
        header: 'Add items to your new shipment order.',
        paragraph: 'please feel free to list the items we expect from your new shipment order',
        buttonConfig: {
          text: 'Add Items to Order',
          methodToInvoke: 'openAddItemToShippingOrderModal',
        },
      },
    };
  },
  computed: {
    ...mapState({
      order: 'currentShippingOrder',
      shippingOrders: 'shippingOrders',
    })
  },
  mounted() {
    if (this.$route.params.orderId) {
      const [shippingOrder] = this.shippingOrders.filter((odr) => String(odr.id) === String(this.$route.params.orderId));
      if (shippingOrder) {
        this.$store.commit('setCurrentShippingOrders', shippingOrder);
      }
      console.log(shippingOrder, this.shippingOrders, this.$route.params.orderId);
    }

    this.itemToValidate.itemCategory = '';
  },
  methods: {
    invokeThisMethod(method) {
      if(this[method]) this[method]();
    },
    openAddItemToShippingOrderModal() {
      $('#addOrderModal').modal('toggle');
    },
    addItemToShippingOrder() {
      // eslint-disable-next-line
      const { productDesc, itemCategory: category, merchant, quantity, phoneNumber } = this.itemToValidate
      const [{ text: categoryText }] = this.itemCategory.filter((cat) => cat.value === category);

      this.$store.commit('addItemsToShippingOrder', {
        productDesc,
        category: categoryText,
        merchant,
        quantity: Number(quantity),
        phoneNumber,
      });

      $('#addOrderModal').modal('toggle');
    },
    removeItemFromShippingOrder(itemId) {
      this.$store.commit('removeItemFromShippingOrder', itemId);
    },
    submitNewShippingOrder() {
      this.$store.dispatch(CREATE_NEW_SHIPPING_ORDERS, this.order);
    },
    returToTheDashboard() {
      this.$store.commit('resetNewShippingOrder');
      this.$router.push({ name: 'dashboard' });
    },
  },
};
</script>

<style lang="scss" scoped>
.btn:not(.btn-white){
  color: white !important;
}
.modal-content{
  margin-top: 20%;
}
span.order-id{
  margin-left: 10px;
}
</style>
