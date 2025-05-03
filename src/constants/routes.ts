export const ROUTES = {
  AUTH: {
    LOGIN: '/auth',
    SIGNUP: '/auth/signup',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  DASHBOARD: '/dashboard',
  PRACTICE: '/practice',
  LEADERBOARD: '/leaderboard',
  USER: {
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
  },
} as const;
