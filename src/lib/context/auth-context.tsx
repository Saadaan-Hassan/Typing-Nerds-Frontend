'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { API_ROUTES } from '@/constants/api-routes';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';

import apiCaller from '@/lib/api-caller';
import {
  clearTokens,
  clearUser,
  getTokens,
  isAuthenticated,
  setTokens,
  setUser,
} from '@/lib/auth';
import { LoginData, RegistrationData, User } from '@/lib/types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegistrationData) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticated()) {
        try {
          await fetchCurrentUser();
        } catch {
          // If fetching current user fails, attempt to refresh the token
          const refreshed = await refreshTokens();
          if (refreshed) {
            await fetchCurrentUser();
          } else {
            handleLogout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await apiCaller(
        API_ROUTES.AUTH.CURRENT_USER,
        'GET',
        undefined,
        {},
        true
      );
      if (response.data.success) {
        const userData = response.data.data;
        setUserState(userData);
        setUser(userData);
        return userData;
      }
      return null;
    } catch (error) {
      throw error;
    }
  };

  const login = async (data: LoginData) => {
    try {
      const response = await apiCaller(API_ROUTES.AUTH.LOGIN, 'POST', data);

      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;

        if (accessToken && refreshToken) {
          setTokens({ accessToken, refreshToken });
        }

        if (user) {
          setUserState(user);
          setUser(user);
        }

        toast.success('Login successful');
        router.push('/dashboard');
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to login, please try again.';
      toast.error(message);
      throw error;
    }
  };

  const register = async (data: RegistrationData) => {
    try {
      const response = await apiCaller(API_ROUTES.AUTH.REGISTER, 'POST', data);

      if (response.data.success) {
        toast.success(
          'Registration successful! Please verify your email to continue.'
        );
        router.push(ROUTES.AUTH.LOGIN);
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to register, please try again.';
      toast.error(message);
      throw error;
    }
  };

  const refreshTokens = async (): Promise<boolean> => {
    try {
      const tokens = getTokens();
      if (!tokens?.refreshToken) return false;

      const response = await apiCaller(
        API_ROUTES.AUTH.REFRESH_TOKEN,
        'POST',
        { refreshToken: tokens.refreshToken },
        {},
        false
      );

      if (response.data.success) {
        const { accessToken, refreshToken } = response.data.data;
        setTokens({ accessToken, refreshToken });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleLogout = () => {
    clearTokens();
    clearUser();
    setUserState(null);
  };

  const logout = async () => {
    try {
      await apiCaller(API_ROUTES.AUTH.LOGOUT, 'POST');
    } catch {
      console.error('Logout error');
    } finally {
      handleLogout();
      toast.success('Logged out successfully');
      router.push(ROUTES.AUTH.LOGIN);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
