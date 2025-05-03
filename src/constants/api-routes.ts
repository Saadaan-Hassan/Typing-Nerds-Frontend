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
  ROOMS: {
    CREATE: '/api/rooms/create',
    JOIN: '/api/rooms/join',
    LEAVE: '/api/rooms/leave',
    PUBLIC: '/api/rooms/public',
    RESULTS: `/api/rooms/results`,
    GET_ROOM: (roomId: string) => `/api/rooms/${roomId}`,
    GET_MESSAGES: (roomId: string) => `/api/rooms/${roomId}/messages`,
    SEND_MESSAGE: (roomId: string) => `/api/rooms/${roomId}/messages/send`,
  },
} as const;
