import { AuthTokens, User } from './types/auth';

// Token management
export const setTokens = (tokens: AuthTokens): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
};

export const getTokens = (): AuthTokens | null => {
  if (typeof window === 'undefined') return null;

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken || !refreshToken) return null;

  return { accessToken, refreshToken };
};

export const clearTokens = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// User management
export const setUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;

  const userJson = localStorage.getItem('user');
  if (!userJson) return null;

  try {
    return JSON.parse(userJson);
  } catch {
    clearUser();
    return null;
  }
};

export const clearUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!getTokens() && !!getUser();
};

export const logout = (): void => {
  clearTokens();
  clearUser();
};
