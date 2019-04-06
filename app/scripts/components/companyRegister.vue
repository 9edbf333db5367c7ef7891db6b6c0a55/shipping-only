<template lang="pug">
  .company-registration
    navigation-bar.mb-5
    .container.center.form
      .row.justify-content-center
       .col-12.col-md-10.col-xl-8.mb-5
        .header.text-center
          .header-body
            h6.header-pretitle
              | Add company
            h1.header-title
              | Company Registration

        form.card.container.p-2
          .card-title.pt-4.px-4
            h3.text-info.my-0 Company Details
          .card-body
            .form-group
              label Company name
              input.form-control#company-name(
                type="text"
                v-model="itemToValidate.companyName"
                v-on:keyup="validateAuthenticationForm"
                required,
                placeholder="Company Name Inc",
                v-bind:class="{'is-invalid': validation.companyName.invalid }"
              )
              .invalid-feedback(v-show="validation.companyName.invalid")
                | Please provide a valid Company Name

            .form-group
              label Date of incorperation
              input.form-control#incorperation-date(
                type="date"
                v-model="itemToValidate.dateOfIncorperation"
                placeholder="Choose Date of incorperation"
                data-toggle="flatpickr"
              )

            .form-group
              label Country of incorperation
              select.form-control#incorperation-country(
                v-model="itemToValidate.countryOfIncorperation"
                v-on:change="validateAuthenticationForm"
              )
                option(value='', disabled selected)
                  | Choose the country the company was incorperation
                option(
                  v-for="country in countries"
                  :value="country.code"
                ) {{country.countryName}}

            .form-group
              label Incorperation code
              input.form-control#incorperation-code(
                type="text"
                v-model="itemToValidate.incorperationCode"
                placeholder="Enter you company tax id"
                v-on:keyup="validateAuthenticationForm"
                required
                v-bind:class="{'is-invalid': validation.incorperationCode.invalid }"
              )
              .invalid-feedback(v-show="validation.incorperationCode.invalid")
                | Please provide your Incorperation Code

            .form-group
              label Incorperation File (pdf, jpeg, png)
              br
              input#incorperationFile(
                type="file"
                accept=".png, .jpg, .jpeg, .pdf"
                placeholder=" Upload Incorperation File (pdf, jpeg, jpg, png)"

                v-on:change="incorperationFileSelected($event.target.files)"
              )

          .content-seperator

          .card-title.px-4
            h3.text-info.my-0 Company Address
          .card-body
            .form-group
              label Street Address
              input.form-control#company-street(
                type="address"
                required,
                v-model="itemToValidate.streetAddress"
                v-on:keyup="validateAuthenticationForm"
                placeholder="Company Street"
                v-bind:class="{'is-invalid': validation.streetAddress.invalid }"
              )
              .invalid-feedback(v-show="validation.streetAddress.invalid")
                | Please provide a valid Company Street

            .form-group
              label City
              input.form-control#company-city(
                type="text"
                v-model="itemToValidate.city"
                v-on:keyup="validateAuthenticationForm"
                required
                placeholder="Enter Company City"
                v-bind:class="{'is-invalid': validation.city.invalid }"
              )
              .invalid-feedback(v-show="validation.city.invalid")
                | Please provide a valid Company City

            .form-group
              label Country
              select.form-control#company-country(
                v-model="itemToValidate.country",
                v-on:change="validateAuthenticationForm"
              )
                option(value='', disabled selected)
                  | Choose the country the company is currently located
                option(
                  v-for="country in countries"
                  :value="country.code"
                ) {{country.countryName}}

            .form-group
              label Postal code
              input.form-control#company-postal-code(
                type="text"
                v-model="itemToValidate.postalZipCode"
                placeholder="Enter you Postal Code",
              )

          .content-seperator
          .card-title.px-4
            h3.text-info.my-0 Additional information
          .card-body
            .form-group
              label Website
              input.form-control#company-website(
                type="website"
                v-model="itemToValidate.website"
                placeholder="http://website.com",
              )

            .form-group
              label Logo
              br
              input#company-logo(
                type="file"
                accept=".png, .jpg, .jpeg"
                v-on:change="logoAdded($event.target.files)"
                placeholder="Choose company logo"
              )

            .form-group
              label Business description
              textarea.form-control#company-description(
                v-model="itemToValidate.businessDescription"
              )

            .alert.alert-danger.alert-dismissible.fade.show(
              v-if="!registrationSuccess"
              role="alert"
            ) Registration failed! Please Try Again
              button.close(
                type="button"
                data-dismiss="alert"
                aria-label="Close"
              )
                span(
                  aria-hidden="true"
                ) &times;

            .content-seperator.my-5

            //- TODO: Implement register functionality
            button.btn.btn-lg.btn-block.btn-primary.my-3(
              v-on:click.prevent="registerCompany"
              v-bind:disabled="formInputsAreInvalid"
            ) Register Company
</template>

<script>
// TODO: Implement Invite CA component
import { mapState } from 'vuex';
import { REGISTER_COMPANY, UPLOAD_FILES, UPLOAD_FILE_TO_FIREBASE } from '@store/actionTypes';
import NavigationBar from '@component/re-usable/navigationBar.vue';
import validateAuthenticationForm from '@mixin/validateAuthenticationForm';
import { COUNTRIES } from '@constant';

export default {
  name: 'CompanyRegister',
  components: {
    NavigationBar,
  },
  mixins: [validateAuthenticationForm],
  data() {
    return {
      registrationSuccess: true,
      countries: COUNTRIES,
      valuesToValidate: ['companyName', 'incorperationCode', 'streetAddress', 'city'],
      selectsToValidate: ['countryOfIncorperation', 'country'],
      filesToValidate: ['incorperationFile'],
      validation: {
        companyName: {
          regexp: /\S/,
          invalid: false,
        },
        incorperationCode: {
          regexp: /\S/,
          invalid: false,
        },
        streetAddress: {
          regexp: /\S/,
          invalid: false,
        },
        city: {
          regexp: /\S/,
          invalid: false,
        },
        country: {
          regexp: /\S/,
          invalid: false,
        },
        countryOfIncorperation: {
          regexp: /\S/,
          invalid: false,
        },
      },
    };
  },
  computed: mapState({
    userId: (state) => state.user.id,
  }),
  beforeMount() {
    this.selectsToValidate.forEach((select) => {
      this.itemToValidate[select] = '';
    });
  },
  methods: {
    logoAdded(file) {
      [this.itemToValidate.logo] = file;
    },

    incorperationFileSelected(file) {
      [this.itemToValidate.incorperationFile] = file;
      this.validateAuthenticationForm();
    },

    registerCompany() {
      const asyncFunctions = [];
      const uploadIncorperationFile = this.$store.dispatch(UPLOAD_FILES, {
        file: this.itemToValidate.incorperationFile,
        category: 'incorperationFile',
        companyName: this.itemToValidate.companyName,
      });
      asyncFunctions.push(uploadIncorperationFile);

      if (this.itemToValidate.logo) {
        const file = this.itemToValidate.logo;
        const ext = file.name.split('.').pop();
        const timeStamp = new Date().getTime();
        const fileName = `Logo-${timeStamp}.${ext}`;
        const uploadLogoImage = this.$store.dispatch(UPLOAD_FILE_TO_FIREBASE, {
          file,
          fileName,
          folder: 'logos',
        });
        asyncFunctions.push(uploadLogoImage);
      }

      Promise.all(asyncFunctions)
        .then((values) => {
          [this.itemToValidate.files, this.itemToValidate.logoUrl] = values;
          this.uploadCompanyInfo();
        })
        .catch(() => {
          this.registrationSuccess = false;
        });
    },
    uploadCompanyInfo() {
      // eslint-disable-next-line prefer-const
      let { incorperationFile, logo, ...companyDataToSync } = this.itemToValidate;
      companyDataToSync = {
        founders: [],
        companyRegistrer: this.userId,
        isApproved: false,
        ...companyDataToSync,
      };
      this.$store
        .dispatch(REGISTER_COMPANY, {
          companyDataToSync,
        })
        .then() // Handle next step
        .catch(() => {
          this.registrationSuccess = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
