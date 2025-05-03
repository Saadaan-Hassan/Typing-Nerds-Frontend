export const ROUTES = {
  AUTH: {
    LOGIN: '/auth',
    SIGNUP: '/auth/signup',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  LEADERBOARD: '/leaderboard',
  USER: {
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
  },
} as const;
