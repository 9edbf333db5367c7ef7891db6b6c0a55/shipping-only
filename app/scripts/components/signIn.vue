<template lang="pug">
#sign-up-form.container.center-form
  .row.justify-content-center
    .col-12.col-md-5.col-xl-4.my-5

      img(src="https://res.cloudinary.com/dpmk2cnpi/image/upload/v1483876646/vm-logo_hsvchn.png")
      h1.display-4.text-center.mb-3 Welcome Back
      p.text-muted.text-center.mb-5(v-show="!errorMessage") Log in to carry on with the day...
      p.text-danger.text-center.mb-5(v-show="errorMessage") {{ errorMessage }}
      p.text-danger.text-center.mb-5(v-show="notificationMessage") {{ notificationMessage }}

      form
        .form-group
          label Email Address
          input.form-control#email-address(
            type="email"
            v-on:keyup="validateAuthenticationForm",
            v-model="itemToValidate.email",
            required,
            placeholder="name@address.com",
            v-bind:class="{'is-invalid': validation.email.invalid }"
          )
          .invalid-feedback(v-show="validation.email.invalid")
            | Please provide a valid email address eg. name@address.com

        .form-group
          label Password
          .input-group.input-group-merge
            input.form-control.form-control-appended#password(
              type="password",
              v-on:keyup="validateAuthenticationForm",
              v-model="itemToValidate.password",
              required,
              placeholder="Enter your password",
              v-bind:class="{'is-invalid': validation.email.invalid }"
            )
            .input-group-append
              span.input-group-text: i.fe.fe-eye
          .invalid-feedback(v-show="validation.password.invalid")
            | Please provide a password that is of 6 characters or more

        button.btn.btn-lg.btn-block.btn-primary.mb-3(
          v-on:click.prevent.stop="signInUserWithEmailAndPassword"
          v-bind:disabled="formInputsAreInvalid"
        ) Sign in

        .content-seperator: span.text-muted or log in using

        button.btn.btn-lg.btn-facebook.btn-block.mb-4(
          v-on:click.prevent.stop="loginWithFacebookUsingFirebaseAuth"
        )
          i.fab.fa-google-plus &nbsp;
          | Log In Using Facebook

        button.btn.btn-lg.btn-danger.btn-block.mb-4(
          v-on:click.prevent.stop="loginWithGoogleUsingFirebaseAuth"
        )
          i.fab.fa-google-plus &nbsp;
          | Log In Using Google

        .text-center
          small.text-muted.text-center Don't have an account?&nbsp;
            router-link(:to="{ name: 'signUp' }") Sign up.
</template>

<script>
import validateAuthenticationForm from '@mixin/validateAuthenticationForm';
import signInUserWithEmailAndPassword from '@mixin/signInUserWithEmailAndPassword';
import googleFirebaseAuth from '@mixin/googleFirebaseAuth';
import facebookFirebaseAuth from '@mixin/facebookFirebaseAuth';

export default {
  name: 'SignIn',
  mixins: [
    signInUserWithEmailAndPassword,
    validateAuthenticationForm,
    googleFirebaseAuth,
    facebookFirebaseAuth,
  ],
  data() {
    return {
      valuesToValidate: ['email', 'password'],
      validation: {
        email: {
          regexp: /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/im,
          invalid: false,
        },
        password: {
          regexp: /^[\w\W\s\S]{6,}$/,
          invalid: false,
        },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
/* prettier-ignore */
.container{
  .signin-title-secondary{
    margin-bottom: 30px;
  }
  .btn-facebook{
    background-color: #3259A9 !important;
    color: #fefefe;
  }
  .btn-signin{
    background-image: #3701ff !important;
  }
  img {
    width: 80%;
    margin: 8% 10%;
    text-align: center;
  }
  form{
    font-weight: 500;
    h2,
    h3,
    h5 {
      text-align: center;
      font-size: bold;
      &.error {
        padding-bottom: 5%;
      }
    }
  }
}
</style>
