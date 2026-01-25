import { RequestHandler, Router } from "express";
import { AdminController } from "./admin.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();

router.get(
  "/bookings",
  authMiddleware as RequestHandler,
  roleMiddleware(["ADMIN"]) as  RequestHandler,
  AdminController.bookings
);

export default router;
