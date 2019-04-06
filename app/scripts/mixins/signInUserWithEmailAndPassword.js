/* eslint-disable  camelcase */
import firebase from 'firebase';
import { SYNC_USER_LOCALLY_AND_FIREBASE, SYNC_USER_TO_DATASTORE } from '@store/actionTypes';
import { VITUMOB_USER } from '@constant';

export default {
  methods: {
    signInUserWithEmailAndPassword() {
      if (!this.formInputsAreInvalid) {
        this.formInputsAreInvalid = true;
        const credentials = [this.itemToValidate.email, this.itemToValidate.password];
        const firebaseAuth = firebase.auth();

        firebaseAuth
          .signInWithEmailAndPassword(...credentials)
          .then((user) => {
            this.$store.commit('setUser', user);
            window.localStorage.setItem(VITUMOB_USER, JSON.stringify(user));
            this.redirectTheUserToTheDashboard();
          })
          .catch((signInError) => {
            if (signInError.code === 'auth/wrong-password') {
              this.formInputsAreInvalid = false;
              this.errorMessage = 'Invalid password or email address.';
              return;
            }

            if (signInError.code === 'auth/user-not-found') {
              if (this.$route.name === 'signUp') {
                this.createUserWithEmailAndPassword(credentials);
                return;
              }

              this.formInputsAreInvalid = false;
              this.$router.push({ name: 'signUp' });
            }
          });
      }
    },
    forwardUserCredentialsToFirebase(user) {
      this.errorMessage = null;

      const { uid: id, displayName, photoURL, email, emailVerified } = user;
      const { uid, credential, metadata, refreshToken } = user;
      const userDataToSyncToFirebase = {
        uid,
        displayName,
        email,
        photoURL,
        emailVerified,
        metadata,
        credential: credential || { refreshToken },
      };

      const userDataToSyncToDatastore = { id, email, email_verified: emailVerified, credential };
      if (displayName) userDataToSyncToDatastore.name = displayName;

      return this.$store
        .dispatch(SYNC_USER_TO_DATASTORE, userDataToSyncToDatastore)
        .done(() => {
          this.errorMessage = null;

          // send the user an email to validate their existence
          if (!emailVerified && 'sendEmailVerification' in user) {
            user.sendEmailVerification().then(() => {
              this.isSignedUp = true;
              this.notificationMessage =
                // eslint-disable-next-line max-len
                "We've sent a verification email, please follow/click the link the email address to verify your account";
            });
          }

          return this.$store.dispatch(SYNC_USER_LOCALLY_AND_FIREBASE, {
            user: userDataToSyncToFirebase,
            redirect: this.redirectTheUserToTheDashboard,
          });
        })
        .fail(({ responseJSON: error }) => {
          if (error.message.indexOf('error/user-exists') > -1) {
            this.$store.commit('setUser', userDataToSyncToFirebase);
            this.$router.push({ name: 'dashboard' });
          }
        });
    },
    redirectTheUserToTheDashboard() {
      this.$router.push({
        name: 'dashboard',
      });
    },
  },
};
