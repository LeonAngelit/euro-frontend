require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'dev',
  isProd: process.env.NODE_ENV === 'production',
  baseUrl: process.env.REACT_APP_BASEURL,
  appAdmin: process.env.REACT_APP_ADMIN,
  authP: process.env.REACT_APP_AUTH_P,
  key: process.env.REACT_APP_P_KEY
};

module.exports = config;
