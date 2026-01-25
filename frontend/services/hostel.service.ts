import api from "./api";

export interface Hostel {
  id: string;
  name: string;
  price_kes_per_month: number;
  distance_km: number;
  rating: number;
  facilities: string;
  room_types: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const getHostels = async (): Promise<Hostel[]> => {
  const res = await api.get<ApiResponse<Hostel[]>>("/hostels");
  return res.data.data;
};
