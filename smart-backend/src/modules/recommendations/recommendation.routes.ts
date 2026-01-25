import { RequestHandler, Router } from "express";
import { RecommendationController } from "./recommendation.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware as RequestHandler,
  roleMiddleware(["STUDENT"]) as RequestHandler,
  RecommendationController.getRecommendations
);

export default router;
