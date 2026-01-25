import { RequestHandler, Router } from "express";
import { PreferenceController } from "./preference.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware as RequestHandler,
  roleMiddleware(["STUDENT"]) as RequestHandler,
  PreferenceController.save as RequestHandler
);

export default router;