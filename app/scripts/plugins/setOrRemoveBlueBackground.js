export default {
  install(Vue) {
    Vue.mixin({
      beforeRouteEnter(to, from, next) {
        document.querySelector('body').style.backgroundImage =
          'linear-gradient(to right, #fefefe 0%, #fefefe 100%)';

        // Check whether the user is opening the signIn or signUp page
        if (['signUp', 'signIn'].some((route) => route === to.name)) {
          const backgroundImage = 'linear-gradient(to right, #21226b 0%, #3701ff 100%)';
          // eslint-disable-next-line prettier/prettier
          document.querySelector('body').style.backgroundImage = backgroundImage;
        }
        next();
      },
      beforeRouteLeave(to, from, next) {
        document.querySelector('body').style.backgroundImage =
          'linear-gradient(to right, #fefefe 0%, #fefefe 100%)';
        next();
      },
    });
  },
};
