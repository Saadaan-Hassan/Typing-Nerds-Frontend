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
  getUser,
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
  fetchAndUpdateUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const initAuth = async () => {
      console.log('Initializing auth context...');

      // First check if we have a user in localStorage
      const storedUser = getUser();
      const tokensExist = !!getTokens();

      if (tokensExist) {
        console.log('Tokens found in localStorage');

        if (storedUser) {
          console.log('User found in localStorage:', storedUser);
          setUserState(storedUser);
        }

        try {
          // Verify with backend
          console.log('Verifying with backend...');
          await fetchCurrentUser();
        } catch (error) {
          console.error('Error fetching current user:', error);

          // If fetching current user fails, attempt to refresh the token
          const refreshed = await refreshTokens();
          if (refreshed) {
            try {
              await fetchCurrentUser();
            } catch (refreshError) {
              console.error('Error after token refresh:', refreshError);
              handleLogout();
            }
          } else {
            console.log('Token refresh failed, logging out');
            handleLogout();
          }
        }
      } else {
        console.log('No tokens found, user is not authenticated');
        handleLogout(); // Clear any potential stale data
      }

      setLoading(false);
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCurrentUser = async () => {
    try {
      console.log('Fetching current user data...');
      const response = await apiCaller(
        API_ROUTES.AUTH.CURRENT_USER,
        'GET',
        undefined,
        {},
        true
      );

      if (response.data.success) {
        const userData = response.data.data;
        console.log('Current user data fetched successfully:', userData);
        setUserState(userData);
        setUser(userData);
        return userData;
      } else {
        console.error('Current user fetch failed:', response.data);
        return null;
      }
    } catch (error) {
      console.error('Error in fetchCurrentUser:', error);
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
        router.push(ROUTES.DASHBOARD);
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
      console.log('Attempting to refresh tokens...');
      const tokens = getTokens();
      if (!tokens?.refreshToken) {
        console.log('No refresh token found');
        return false;
      }

      const response = await apiCaller(
        API_ROUTES.AUTH.REFRESH_TOKEN,
        'POST',
        { refreshToken: tokens.refreshToken },
        {},
        false
      );

      if (response.data.success) {
        const { accessToken, refreshToken } = response.data.data;
        console.log('Token refresh successful, setting new tokens');
        setTokens({ accessToken, refreshToken });

        // Fetch latest user data after successful token refresh
        await fetchAndUpdateUser();

        return true;
      }

      console.log('Token refresh failed:', response.data);
      return false;
    } catch (error) {
      console.error('Error in refreshTokens:', error);
      return false;
    }
  };

  const fetchAndUpdateUser = async (): Promise<User | null> => {
    try {
      console.log('Fetching and updating current user...');
      const userData = await fetchCurrentUser();
      return userData;
    } catch (error) {
      console.error('Error fetching and updating user:', error);
      return null;
    }
  };

  const handleLogout = () => {
    console.log('Handling logout, clearing user data and tokens');
    clearTokens();
    clearUser();
    setUserState(null);
  };

  const logout = async () => {
    try {
      await apiCaller(API_ROUTES.AUTH.LOGOUT, 'POST');
    } catch (error) {
      console.error('Logout error:', error);
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
        fetchAndUpdateUser,
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
