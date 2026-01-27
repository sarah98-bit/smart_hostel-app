import express from "express";
import { initiatePayment } from "./payment.controller";
import { mpesaCallback } from "./callback.controller";

const router = express.Router();

router.post("/payments/initiate", initiatePayment);
router.post("/stk-push", initiatePayment);
router.post("/payments/callback", mpesaCallback);

export default router;
