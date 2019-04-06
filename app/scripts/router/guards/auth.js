import { VITUMOB_USER } from '@constant';

// eslint-disable-next-line import/prefer-default-export
export const isLoggedIn = (to, from, next) => {
  if (!window.localStorage.getItem(VITUMOB_USER)) {
    next({
      name: 'signIn',
    });
    return;
  }
  next();
};
