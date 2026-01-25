import { RequestHandler, Router } from "express";
import { StudentController } from "./student.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();

router.get(
  "/profile",
  authMiddleware as RequestHandler,
  roleMiddleware(["STUDENT"]) as RequestHandler,
  StudentController.profile as RequestHandler
);

export default router;
