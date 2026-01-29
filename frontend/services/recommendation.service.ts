import api from "./api";

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
data: RecommendationRequest, p0: { maxPrice: number; maxDistance: number; roomType: string; facilities: string[]; }): Promise<HostelRecommendation[]> => {
  const res = await api.post("/recommendations", data);
  return res.data.data;
};
