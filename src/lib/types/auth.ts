export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicture: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user?: User;
    accessToken?: string;
    refreshToken?: string;
  };
}

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  [key: string]: string;
}

export interface LoginData {
  email: string;
  password: string;
  [key: string]: string;
}

export interface ForgotPasswordData {
  email: string;
  [key: string]: string;
}

export interface ResetPasswordData {
  password: string;
  confirmPassword: string;
  [key: string]: string;
}
