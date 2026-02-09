import { Request, Response, NextFunction } from "express";
import { RecommendationService } from "./recommendation.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export class RecommendationController {
  static async getRecommendations(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { maxPrice, maxDistance, roomType, facilities } = req.body;

      // Validate input
      if (!maxPrice || !maxDistance || !roomType) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: maxPrice, maxDistance, roomType",
        });
      }

      // Get user ID from authenticated request
      const userId = req.user?.id;

      // Call the recommendation service with all parameters
      const recommendations = await RecommendationService.recommend({
        maxPrice: Number(maxPrice),
        maxDistance: Number(maxDistance),
        roomType,
        facilities: facilities || [],
        //userId, // Pass user ID for collaborative filtering
      });

      res.status(200).json({
        success: true,
        message: "Recommendations generated successfully",
        data: recommendations,
      });
    } catch (error) {
      console.error("Error getting recommendations:", error);
      next(error);
    }
  }
}