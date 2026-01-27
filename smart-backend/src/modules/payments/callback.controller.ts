import { Request, Response } from "express";
import { AppDataSource } from "../../config/data-source";
import { Payment } from "./payment.entity";
import { Booking } from "../bookings/booking.entity";

export const mpesaCallback = async (req: Request, res: Response) => {
  try {
    console.log("MPESA CALLBACK RECEIVED:", JSON.stringify(req.body, null, 2));

    const callback = req.body?.Body?.stkCallback;
    if (!callback) return res.status(400).json({ message: "Invalid callback payload" });

    const { CheckoutRequestID, ResultCode, CallbackMetadata } = callback;

    const paymentRepo = AppDataSource.getRepository(Payment);
    const bookingRepo = AppDataSource.getRepository(Booking);

    const payment = await paymentRepo.findOne({
      where: { checkoutRequestId: CheckoutRequestID },
      relations: ["booking"],
    });

    if (!payment) {
      console.warn("Payment not found for CheckoutRequestID:", CheckoutRequestID);
      return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    if (ResultCode === 0) {
      payment.status = "SUCCESS";

      if (CallbackMetadata?.Item) {
        const items = CallbackMetadata.Item;
        const amountItem = items.find((i: any) => i.Name === "Amount");
        const receiptItem = items.find((i: any) => i.Name === "MpesaReceiptNumber");
        const phoneItem = items.find((i: any) => i.Name === "PhoneNumber");

        payment.amount = amountItem?.Value || payment.amount;
        payment.receiptNumber = receiptItem?.Value || "";
        payment.phone = phoneItem?.Value || payment.phone;
      }

      payment.booking.status = "CONFIRMED";
      await bookingRepo.save(payment.booking);
    } else {
      payment.status = "FAILED";
    }

    await paymentRepo.save(payment);

    return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (error) {
    console.error("CALLBACK ERROR:", error);
    return res.status(500).json({ message: "Callback processing failed" });
  }
};
