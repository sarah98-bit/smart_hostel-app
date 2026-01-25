import { RequestHandler, Router } from "express";
import { BookingController } from "./booking.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware as RequestHandler,
  roleMiddleware(["STUDENT"]) as RequestHandler,
  BookingController.create
);

export default router;
