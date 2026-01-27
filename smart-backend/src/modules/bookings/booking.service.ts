import { AppDataSource } from "../../config/data-source";
import { Booking } from "./booking.entity";
import { Hostel } from "../hostels/hostel.entity";
import { User } from "../../entities/user.entity";

const bookingRepo = AppDataSource.getRepository(Booking);
const hostelRepo = AppDataSource.getRepository(Hostel);

export class BookingService {
  // Get a pending booking for a user & hostel
  static async getPendingBooking(user: User, hostelId: string) {
    return bookingRepo.findOne({
      where: {
        user: { id: user.id },
        hostel: { id: hostelId },
        status: "PENDING",
      },
      relations: ["hostel", "payments"],
    });
  }

  // Create a new booking
  static async createBooking(user: User, hostelId: string) {
    // Fetch hostel and verify it exists
    const hostel = await hostelRepo.findOne({
      where: { id: hostelId },
    });

    if (!hostel) {
      console.error(`Hostel not found for id: ${hostelId}`);
      throw new Error("Hostel not found");
    }

    // Check for existing pending booking
    const existingBooking = await this.getPendingBooking(user, hostelId);
    if (existingBooking) {
      console.log("Returning existing pending booking:", existingBooking.id);
      return existingBooking;
    }

    // Create new booking
    const booking = bookingRepo.create({
      user,
      hostel,
      price: hostel.price_kes_per_month,
      status: "PENDING",
    });

    const savedBooking = await bookingRepo.save(booking);
    console.log("Created new booking:", savedBooking.id);
    return savedBooking;
  }

  // Confirm a booking
  static async confirmBooking(bookingId: string) {
    const booking = await bookingRepo.findOne({ where: { id: bookingId } });
    if (!booking) throw new Error("Booking not found");

    booking.status = "CONFIRMED";
    return bookingRepo.save(booking);
  }

  // Cancel a booking
  static async cancelBooking(bookingId: string) {
    const booking = await bookingRepo.findOne({ where: { id: bookingId } });
    if (!booking) throw new Error("Booking not found");

    booking.status = "CANCELLED";
    return bookingRepo.save(booking);
  }
}
