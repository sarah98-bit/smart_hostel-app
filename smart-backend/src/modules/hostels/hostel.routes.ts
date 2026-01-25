import { Router } from "express";
import { HostelController } from "./hostel.controller";

const router = Router();

router.get("/", HostelController.list);

export default router;
