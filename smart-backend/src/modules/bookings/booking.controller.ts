import { Response } from "express";
import { AuthenticatedRequest } from "../../types/express"
import { BookingService } from "./booking.service";

export const BookingController = {
  createBooking: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { hostelId } = req.body;
      if (!hostelId) return res.status(400).json({ message: "hostelId is required" });

      const booking = await BookingService.createBooking(req.user, hostelId);
      return res.status(200).json({ success: true, data: booking });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  getPendingBooking: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { hostelId } = req.query;
      if (!hostelId) return res.status(400).json({ message: "hostelId is required" });

      const booking = await BookingService.getPendingBooking(req.user, hostelId as string);
      return res.status(200).json({ success: true, data: booking });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  confirmBooking: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { bookingId } = req.body;
      if (!bookingId) return res.status(400).json({ message: "bookingId is required" });

      const booking = await BookingService.confirmBooking(bookingId);
      return res.status(200).json({ success: true, data: booking });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  cancelBooking: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { bookingId } = req.body;
      if (!bookingId) return res.status(400).json({ message: "bookingId is required" });

      const booking = await BookingService.cancelBooking(bookingId);
      return res.status(200).json({ success: true, data: booking });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
