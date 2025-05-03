export const API_ROUTES = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    CURRENT_USER: '/api/auth/me',
    VERIFY_EMAIL: '/api/auth/verify-email',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    GOOGLE: '/api/auth/google',
    GITHUB: '/api/auth/github',
  },
  USER: {
    PROFILE: '/api/user/profile',
  },
} as const;
