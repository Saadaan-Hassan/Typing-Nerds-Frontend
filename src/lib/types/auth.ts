export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicture: string;
  isEmailVerified: boolean;
  createdAt: string;
  stats?: UserStats;
  badges?: Badge[];
  detailedStats?: DetailedUserStats | null;
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

export interface UserStats {
  avgWpm: number;
  avgAccuracy: number;
  rank: string;
  totalRaces: number;
  totalDrills: number;
}

export interface Badge {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  criteria: {
    type: 'wpm' | 'accuracy' | 'totalDrills';
    value: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RaceHistory {
  competitionId: string;
  date: string;
  wpm: number;
  accuracy: number;
  position: number;
  finishTime: number;
}

export interface DrillHistory {
  date: string;
  wpm: number;
  accuracy: number;
  textType: string;
  duration: number;
}

export interface DetailedUserStats {
  _id: string;
  user: string;
  totalTypingTime: number;
  totalRaces: number;
  racesWon: number;
  totalDrills: number;
  highestWPM: number;
  averageWPM: number;
  highestAccuracy: number;
  averageAccuracy: number;
  raceHistory: RaceHistory[];
  drillHistory: DrillHistory[];
  createdAt: string;
  updatedAt: string;
}
