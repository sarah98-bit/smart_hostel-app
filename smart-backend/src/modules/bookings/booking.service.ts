import { AppDataSource } from "../../config/data-source";
import { Booking } from "./booking.entity";
import { Hostel } from "../hostels/hostel.entity";
import { User } from "../../entities/user.entity";

export class BookingService {
  static async createBooking(
    studentId: string,
    hostelId: string
  ): Promise<Booking> {
    const bookingRepo = AppDataSource.getRepository(Booking);
    const hostelRepo = AppDataSource.getRepository(Hostel);
    const userRepo = AppDataSource.getRepository(User);

    const student = await userRepo.findOneBy({ id: studentId });
    if (!student) throw new Error("Student not found");

    const hostel = await hostelRepo.findOneBy({ id: hostelId });
    if (!hostel) throw new Error("Hostel not found");

    const booking = bookingRepo.create({
      student,
      hostel,
      price: hostel.price_kes_per_month,
      status: "PENDING",
    });

    return bookingRepo.save(booking);
  }
}
