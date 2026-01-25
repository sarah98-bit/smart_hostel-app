import api from "./api";
import { PreferencesPayload } from "./preference.service";

export interface RecommendationRequest {
  maxPrice: number;
  maxDistance: number;
  roomType: string;
  facilities: string[];
}

export interface HostelRecommendation {
  id: string;
  name: string;
  price_kes_per_month: number;
  distance_km: number;
  rating: number;
  facilities: string;
  room_types: string;
  score: number;
}

export const getRecommendations = async (
preferences: PreferencesPayload, data: RecommendationRequest): Promise<HostelRecommendation[]> => {
  const res = await api.post("/recommendations", data);
  return res.data.data;
};
