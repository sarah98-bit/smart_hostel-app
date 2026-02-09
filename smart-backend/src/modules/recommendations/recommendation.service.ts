import axios from "axios";
import { AppDataSource } from "../../config/data-source";
import { Hostel } from "../hostels/hostel.entity";

interface PreferenceInput {
  maxPrice: number;
  maxDistance: number;
  roomType: string;
  facilities: string[];
  userId?: string;
}

interface MLRecommendation {
  hostel_id: string;
  name: string;
  price_kes_per_month: number;
  distance_km: number;
  room_types: string;
  facilities: string;
  score: number;
}

export class RecommendationService {
  private static ML_API_URL = process.env.ML_API_URL || "http://localhost:8000";

  /**
   * Get recommendations using the ML model API
   */
  static async recommend(preferences: PreferenceInput) {
    try {
      // Prepare request payload for ML API
      const mlPayload = {
        maxPrice: preferences.maxPrice,
        maxDistance: preferences.maxDistance,
        roomType: preferences.roomType,
        facilities: preferences.facilities,
        user_id: preferences.userId ? `U${preferences.userId}` : undefined,
        top_n: 10, // Get top 10 recommendations
      };

      console.log("Calling ML API with payload:", mlPayload);

      // Call ML API
      const response = await axios.post<MLRecommendation[]>(
        `${this.ML_API_URL}/recommendations`,
        mlPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );

      console.log(`Received ${response.data.length} recommendations from ML API`);

      // Return the ML recommendations
      return response.data;
    } catch (error) {
      console.error("Error calling ML API:", error);

      // Fallback to basic recommendation if ML API fails
      console.log("Falling back to basic recommendation logic");
      return this.fallbackRecommend(preferences);
    }
  }

  /**
   * Fallback recommendation logic using database only
   * Used when ML API is unavailable
   */
  private static async fallbackRecommend(preferences: PreferenceInput) {
    const hostelRepo = AppDataSource.getRepository(Hostel);
    const hostels = await hostelRepo.find();

    const scored = hostels.map((hostel) => {
      let score = 0;

      // Price matching (3 points)
      if (hostel.price_kes_per_month <= preferences.maxPrice) {
        score += 3;
      }

      // Distance matching (3 points)
      if (hostel.distance_km <= preferences.maxDistance) {
        score += 3;
      }

      // Room type matching (2 points)
      if (
        hostel.room_types
          .toLowerCase()
          .includes(preferences.roomType.toLowerCase())
      ) {
        score += 2;
      }

      // Facilities matching (1 point per matched facility)
      const hostelFacilities = hostel.facilities
        .split(",")
        .map((f) => f.trim().toLowerCase());

      const matchedFacilities = preferences.facilities.filter((f) =>
        hostelFacilities.includes(f.toLowerCase())
      );

      score += matchedFacilities.length;

      // Add rating bonus (up to 1 point based on rating)
      score += (hostel.rating / 5) * 1;

      return {
        hostel_id: hostel.id,
        name: hostel.name,
        price_kes_per_month: hostel.price_kes_per_month,
        distance_km: hostel.distance_km,
        room_types: hostel.room_types,
        facilities: hostel.facilities,
        rating: hostel.rating,
        score: Math.round(score * 100) / 100, // Round to 2 decimal places
      };
    });

    // Sort by score descending and return top 10
    return scored.sort((a, b) => b.score - a.score).slice(0, 10);
  }
}