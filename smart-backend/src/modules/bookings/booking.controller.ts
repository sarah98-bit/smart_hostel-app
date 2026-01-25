import { Request, Response, NextFunction } from "express";
import { BookingService } from "./booking.service";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; [key: string]: any };
    }
  }
}

export class BookingController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.user!.id; // from auth middleware
      const { hostelId } = req.body;

      if (!hostelId) {
        return res.status(400).json({
          success: false,
          message: "hostelId is required",
        });
      }

      const booking = await BookingService.createBooking(
        studentId,
        hostelId
      );

      res.status(201).json({
        success: true,
        message: "Booking created",
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }
}
