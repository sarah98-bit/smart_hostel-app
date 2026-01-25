import { RequestHandler, Router } from "express";
import { PaymentController } from "./payment.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware as RequestHandler,
  roleMiddleware(["STUDENT"]) as RequestHandler,
  PaymentController.pay as RequestHandler
);

export default router;
