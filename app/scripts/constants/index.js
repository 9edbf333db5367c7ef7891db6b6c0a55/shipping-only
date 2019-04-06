export const VITUMOB_USER = 'vitumobUser';
export const SERVER_LOCATION =
  process.env.ENVIRONMENT === 'development'
    ? 'http://localhost:8080'
    : 'https://vitumob-xyz.appspot.com';
