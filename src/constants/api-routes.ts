export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/token',
    SIGNUP: '/user/register/',
    LOGOUT: '/api/users/logout/',
    CHANGE_PASSWORD: '/api/user/change-password/',
    REFRESH_TOKEN: '/api/token/refresh/',
    VERIFY_TOKEN: '/api/token/verify/',
  },
  USER: {
    GET_USER_DATA: '/user/profile/',
  },
} as const;
