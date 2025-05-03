import { API_ROUTES } from '@/constants/api-routes';

import apiCaller from '@/lib/api-caller';

export interface DrillResult {
  wpm: number;
  accuracy: number;
  roundTime: number;
  content: string;
  category: 'word' | 'code';
  totalLetters: number;
  correctLetters: number;
  incorrectLetters: number;
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
    type: string;
    value: number;
  };
}

export interface DrillResponse {
  success: boolean;
  data: {
    drill: DrillResult & {
      _id: string;
      user: string;
      createdAt: string;
    };
    stats: UserStats;
    newBadges: Badge[];
  };
}

export interface StatsResponse {
  success: boolean;
  data: {
    stats: UserStats;
    badges: Badge[];
  };
}

export interface DrillsResponse {
  success: boolean;
  count: number;
  data: Array<
    DrillResult & {
      _id: string;
      user: string;
      createdAt: string;
    }
  >;
}

export const DrillService = {
  async saveDrillResult(data: DrillResult): Promise<DrillResponse> {
    try {
      const response = await apiCaller(
        API_ROUTES.DRILLS.SAVE,
        'POST',
        { ...data },
        {},
        true
      );
      return response.data;
    } catch (error) {
      console.error('Error saving drill result:', error);
      throw error;
    }
  },

  async getUserDrills(): Promise<DrillsResponse> {
    try {
      const response = await apiCaller(
        API_ROUTES.DRILLS.GET_USER_DRILLS,
        'GET',
        undefined,
        {},
        true
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user drills:', error);
      throw error;
    }
  },

  async getUserStats(): Promise<StatsResponse> {
    try {
      const response = await apiCaller(
        API_ROUTES.DRILLS.GET_STATS,
        'GET',
        undefined,
        {},
        true
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },
};
