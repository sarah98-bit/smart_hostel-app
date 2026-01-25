import { Request, Response, NextFunction } from "express";
import { PaymentService } from "./payment.service";

export class PaymentController {
  static async pay(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await PaymentService.makePayment(
        req.body.bookingId,
        req.body.amount
      );

      res.status(201).json({
        success: true,
        message: "Payment successful",
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }
}
