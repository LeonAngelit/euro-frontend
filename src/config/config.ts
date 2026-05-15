interface Config {
  env: string
  isProd: boolean
  baseUrl: string
  appAdmin: string
  authP: string
  key: string
  defProfilePicUrl: string
  joinRoomLink: string
  confirmemailLink: string
  joinRoomPath: string
  clientID: string
  requestsUrl: string
  requestsBaseUrl: string
}

const config: Config = {
  env: import.meta.env.NODE_ENV || 'dev',
  isProd: import.meta.env.NODE_ENV === 'production',
  baseUrl: import.meta.env.VITE_REACT_APP_BASEURL || '',
  appAdmin: import.meta.env.VITE_REACT_APP_ADMIN || '',
  authP: import.meta.env.VITE_REACT_APP_AUTH_P || '',
  key: import.meta.env.VITE_REACT_APP_P_KEY || '',
  defProfilePicUrl: 'https://ui-avatars.com/api/',
  joinRoomLink: import.meta.env.VITE_REACT_APP_JOIN_ROOM || '',
  confirmemailLink: import.meta.env.VITE_REACT_APP_CONFIRM_EMAIL_URL || '',
  joinRoomPath: import.meta.env.VITE_REACT_APP_JOIN_ROOM_PATH || '',
  clientID: import.meta.env.VITE_REACT_APP_CLIENT_ID || '',
  requestsUrl: import.meta.env.VITE_REACT_APP_REQUESTS_URL || '',
  requestsBaseUrl: import.meta.env.VITE_REACT_APP_REQUESTS_BASE_URL || '',
}

export default config