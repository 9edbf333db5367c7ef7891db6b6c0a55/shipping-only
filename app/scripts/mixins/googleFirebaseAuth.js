import firebase from 'firebase';

const scopes = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/plus.me',
];

export default {
  data() {
    return {
      userIsLoginInWithGoogle: false,
    };
  },
  methods: {
    loginWithGoogleUsingFirebaseAuth() {
      this.userIsLoginInWithGoogle = true;
      $('form input').attr('disabled', true);

      const provider = new firebase.auth.GoogleAuthProvider();
      scopes.forEach((scope) => provider.addScope(scope));

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(({ credential, user }) => {
          user.credential = credential;
          return this.forwardUserCredentialsToFirebase(user);
        })
        .catch((loginWithGoogleError) => {
          $('form input').attr('disabled', false);
          this.errorMessage = loginWithGoogleError.message;
        });
    },
  },
};
