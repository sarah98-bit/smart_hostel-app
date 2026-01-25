import {AppDataSource} from "../../config/data-source"
import { Hostel } from "../hostels/hostel.entity";

interface PreferenceInput {
  maxPrice: number;
  maxDistance: number;
  roomType: string;
  facilities: string[];
}

export class RecommendationService {
  static async recommend(preferences: PreferenceInput) {
    const hostelRepo = AppDataSource.getRepository(Hostel);
    const hostels = await hostelRepo.find();

    const scored = hostels.map((hostel) => {
      let score = 0;

      if (hostel.price_kes_per_month <= preferences.maxPrice) score += 3;
      if (hostel.distance_km <= preferences.maxDistance) score += 3;

      if (
        hostel.room_types
          .toLowerCase()
          .includes(preferences.roomType.toLowerCase())
      ) {
        score += 2;
      }

      const hostelFacilities = hostel.facilities
        .split(",")
        .map((f) => f.trim().toLowerCase());

      const matchedFacilities = preferences.facilities.filter((f) =>
        hostelFacilities.includes(f.toLowerCase())
      );

      score += matchedFacilities.length;

      return {
        ...hostel,
        score,
      };
    });

    return scored.sort((a, b) => b.score - a.score);
  }
}

