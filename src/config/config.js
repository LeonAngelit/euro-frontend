import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const config = {
  env: import.meta.env.NODE_ENV || 'dev',
  isProd: import.meta.env.NODE_ENV === 'production',
  baseUrl: import.meta.env.VITE_REACT_APP_BASEURL,
  appAdmin: import.meta.env.VITE_REACT_APP_ADMIN,
  authP: import.meta.env.VITE_REACT_APP_AUTH_P,
  key: import.meta.env.VITE_REACT_APP_P_KEY,
  defProfilePicUrl: 'https://ui-avatars.com/api/',
  joinRoomLink: import.meta.env.VITE_REACT_APP_JOIN_ROOM
};

export default config;
