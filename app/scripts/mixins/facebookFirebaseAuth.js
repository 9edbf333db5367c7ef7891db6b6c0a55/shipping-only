import firebase from 'firebase';

const scopes = ['public_profile', 'email', 'user_birthday', 'user_location'];

export default {
  data() {
    return {
      userIsLoginInWithFacebook: false,
    };
  },
  methods: {
    loginWithFacebookUsingFirebaseAuth() {
      this.userIsLoginInWithFacebook = true;
      $('form input').attr('disabled', true);

      const provider = new firebase.auth.FacebookAuthProvider();
      scopes.forEach((scope) => provider.addScope(scope));

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(({ credential, user }) => {
          user.credential = credential;
          return this.forwardUserCredentialsToFirebase(user);
        })
        .catch((loginWithFacebookError) => {
          $('form input').attr('disabled', false);
          this.errorMessage = loginWithFacebookError.message;
        });
    },
  },
};
