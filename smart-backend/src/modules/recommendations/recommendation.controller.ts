import { Request, Response, NextFunction } from "express";
import { RecommendationService } from "./recommendation.service";

export class RecommendationController {
  static async getRecommendations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const preferences = req.body;

      const recommendations =
        await RecommendationService.recommend(preferences);

      res.status(200).json({
        success: true,
        message: "Recommendations generated successfully",
        data: recommendations,
      });
    } catch (error) {
      next(error);
    }
  }
}
