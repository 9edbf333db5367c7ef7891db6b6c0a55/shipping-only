<template lang="pug">
#sign-up-form.container.center-form
  .row.justify-content-center
    .col-12.col-md-5.col-xl-4.my-5
      router-link(:to="{ name: 'dashboard' }")
        img(src="https://res.cloudinary.com/dpmk2cnpi/image/upload/v1483876646/vm-logo_hsvchn.png")

      h3.display-4.text-center.mb-3 Get Started!
      h5.text-muted.text-center.mb-5 It&apos;s free to signup and only takes a minute.

      p.text-danger.text-center.mb-5(v-show="errorMessage") {{ errorMessage }}
      transition(name="fade")
        .alert.alert-success.mb-5(
          v-show="notificationMessage"
          role="alert"
        ) {{ notificationMessage }}

      form(v-show="!isSignedUp")
        .form-group(v-show="!userIsLoginInWithGoogle")
          label Your Names
          input.form-control#names(
            type="text"
            v-on:keyup="validateAuthenticationForm"
            v-model="itemToValidate.names"
            required
            placeholder="Your Names"
            v-bind:class="{'is-invalid': validation.names.invalid }"
          )
          .invalid-feedback(v-show="validation.names.invalid")
            | Please provide at least 2 valid Names

        .form-group(v-show="!userIsLoginInWithGoogle")
          label Your Phone Number
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

        .form-group(v-show="!userIsLoginInWithGoogle")
          label Email Address
          input.form-control#email(
            type="email"
            v-on:keyup="validateAuthenticationForm"
            v-model="itemToValidate.email"
            required
            placeholder="name@address.com"
            v-bind:class="{'is-invalid': validation.email.invalid }"
          )
          .invalid-feedback(v-show="validation.email.invalid")
            | Please provide a valid email address eg. username@address.com

        .form-group(v-show="!userIsLoginInWithGoogle")
          label Password
          input.form-control#password(
            type="password"
            v-on:keyup="validateAuthenticationForm"
            v-model="itemToValidate.password"
            required
            placeholder="Enter your password"
            v-bind:class="{'is-invalid': validation.password.invalid }"
          )
          .invalid-feedback(v-show="validation.password.invalid")
            | Please provide a password that is of 6 characters or more
          .invalid-feedback(v-show="validation.password.weak")
            | Please provide a stronger password

        button.btn.btn-lg.btn-block.btn-primary.mb-3.btn-signin(
          v-show="!userIsLoginInWithGoogle"
          v-on:click.prevent.stop="signInUserWithEmailAndPassword"
          v-bind:disabled="formInputsAreInvalid"
        ) Sign up

        .content-seperator(v-show="!userIsLoginInWithGoogle"): span.text-muted or sign up using

        button.btn.btn-lg.btn-facebook.btn-block.mb-4(
          v-on:click.prevent.stop="loginWithFacebookUsingFirebaseAuth"
        )
          i.fab.fa-google-plus &nbsp;
          |  Sign Up Using Facebook

        button.btn.btn-lg.btn-danger.btn-block.mb-4(
          v-on:click.prevent.stop="loginWithGoogleUsingFirebaseAuth"
        )
          i.fab.fa-google-plus &nbsp;
          |  Sign Up Using Google

        .text-center
          small.text-muted.text-center Already have an account?&nbsp;
            router-link(:to="{ name: 'signIn' }") Sign In
</template>

<script>
import firebase from 'firebase';
import validateAuthenticationForm from '@mixin/validateAuthenticationForm';
import signInUserWithEmailAndPassword from '@mixin/signInUserWithEmailAndPassword';
import googleFirebaseAuth from '@mixin/googleFirebaseAuth';
import facebookFirebaseAuth from '@mixin/facebookFirebaseAuth';

export default {
  name: 'SignUp',
  mixins: [
    signInUserWithEmailAndPassword,
    validateAuthenticationForm,
    googleFirebaseAuth,
    facebookFirebaseAuth,
  ],
  data() {
    return {
      isSignedUp: false,
      valuesToValidate: ['names', 'phoneNumber', 'email', 'password'],
      validation: {
        names: {
          regexp: /^([a-zA-Z'-]+\s)+/,
          invalid: false,
        },
        phoneNumber: {
          regexp: /^(\+254|0)[\d]{9}$/,
          invalid: false,
        },
        email: {
          regexp: /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/im,
          invalid: false,
        },
        password: {
          regexp: /^[\w\W\s\S]{6,}$/,
          invalid: false,
          weak: false,
        },
      },
      loadingExplanation: 'Finding the right door key to let you in...',
    };
  },
  methods: {
    createUserWithEmailAndPassword(credentials) {
      const firebaseAuth = firebase.auth();
      firebaseAuth
        .createUserWithEmailAndPassword(...credentials)
        .then(({ user }) => {
          if (!user.displayName && this.itemToValidate.names) {
            return user.updateProfile({ displayName: this.itemToValidate.names }).then(() => user);
          }

          return Promise.resolve(user);
        })
        .then((user) => this.forwardUserCredentialsToFirebase(user))
        .catch((signUpError) => {
          this.formInputsAreInvalid = false;
          if (signUpError.code === 'auth/weak-password') {
            this.itemToValidate.password = '';
            this.validation.password.weak = true;
            this.errorMessage = "We've detected weak password. Please enter a new strong one.";
            return;
          }

          this.errorMessage = 'Something went wrong. Please try again one more time!';
        });
    },
  },
};
</script>

<style lang="scss" scoped>
#sign-up-form {
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
  span.red {
    font-size: 12px;
  }
  img {
    width: 80%;
    margin: 8% 10%;
    text-align: center;
  }
  form {
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
  .signin-title-secondary {
    margin-bottom: 30px;
  }
  // prettier-ignore
  .btn-facebook{
    background-color: #3259a9 !important;
    color: #fefefe;
  }
}
</style>
