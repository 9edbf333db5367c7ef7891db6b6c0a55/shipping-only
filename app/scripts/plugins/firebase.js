import { auth, initializeApp } from 'firebase';
import { mapState } from 'vuex';

export default {
  install(Vue) {
    Vue.mixin({
      computed: mapState({
        user: 'user',
      }),
      created() {
        const signedInUserCredentials = window.localStorage.getItem('vitumobUser');
        if (signedInUserCredentials && !this.user.email) {
          const { currentUser } = auth();
          const user = currentUser || JSON.parse(signedInUserCredentials);
          this.$store.commit('setUser', 'user' in user ? user.user : user);
        }
      },
      methods: {
        signOutUser() {
          // prettier-ignore
          auth().signOut().then(() => {
            window.localStorage.removeItem('vitumobUser');
            this.$store.commit('setUser', {});
            this.$router.push({ name: 'dashboard' });
          });
        },
      },
    });

    initializeApp(process.env.FIREBASE_CONFIGURATION);
  },
};
