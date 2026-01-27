import { Request, Response } from "express";
import { AppDataSource } from "../../config/data-source";
import { Payment } from "./payment.entity";
import { Booking } from "../bookings/booking.entity";
import { stkPush } from "./payment.service";

export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const { bookingId, phone } = req.body;

    if (!bookingId || !phone) {
      return res.status(400).json({ success: false, message: "bookingId and phone are required" });
    }

    const bookingRepo = AppDataSource.getRepository(Booking);
    const paymentRepo = AppDataSource.getRepository(Payment);

    const booking = await bookingRepo.findOne({ where: { id: bookingId } });

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    const stkRes = await stkPush(phone, booking.price, booking.id);

    if (!stkRes || stkRes.ResponseCode !== "0") {
      return res.status(500).json({ success: false, message: "Failed to initiate STK Push", mpesaResponse: stkRes });
    }

    const payment = paymentRepo.create({
      booking,
      phone,
      amount: booking.price,
      checkoutRequestId: stkRes.CheckoutRequestID,
      status: "PENDING",
    });

    await paymentRepo.save(payment);

    return res.status(200).json({
      success: true,
      message: "STK push sent successfully",
      checkoutRequestId: stkRes.CheckoutRequestID,
    });
  } catch (error: any) {
    console.error("PAYMENT CONTROLLER ERROR:", error.response?.data || error);
    return res.status(500).json({
      success: false,
      message: "Payment initiation failed",
      error: error.response?.data || error.message,
    });
  }
};
