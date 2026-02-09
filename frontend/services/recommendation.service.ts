import api from "./api";

export interface RecommendationRequest {
  maxPrice: number;
  maxDistance: number;
  roomType: string;
  facilities: string[];
}

export interface HostelRecommendation {
  hostel_id: string;
  name: string;
  price_kes_per_month: number;
  distance_km: number;
  rating?: number;
  facilities: string;
  room_types: string;
  score: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Get hostel recommendations based on user preferences
 * Calls the backend API which in turn calls the ML service
 */
export const getRecommendations = async (
  data: RecommendationRequest
): Promise<HostelRecommendation[]> => {
  try {
    console.log("Fetching recommendations with data:", data);

    const response = await api.post<ApiResponse<HostelRecommendation[]>>(
      "/recommendations",
      data
    );

    console.log("Received recommendations:", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to get recommendations");
    }

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching recommendations:", error);
    
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || "Server error occurred";
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response
      throw new Error("No response from server. Please check your connection.");
    } else {
      // Other errors
      throw new Error(error.message || "Failed to get recommendations");
    }
  }
};