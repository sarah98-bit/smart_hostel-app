import { AppDataSource } from "../../config/data-source";
import { Payment } from "./payment.entity";
import { Booking } from "../bookings/booking.entity";

export class PaymentService {
  static async makePayment(bookingId: string, amount: number) {
    const bookingRepo = AppDataSource.getRepository(Booking);
    const paymentRepo = AppDataSource.getRepository(Payment);

    const booking = await bookingRepo.findOneBy({ id: bookingId });
    if (!booking) throw new Error("Booking not found");

    booking.status = "PAID";
    await bookingRepo.save(booking);

    const payment = paymentRepo.create({ booking, amount });
    return paymentRepo.save(payment);
  }
}
