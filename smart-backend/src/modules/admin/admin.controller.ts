import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../config/data-source";
import { Booking } from "../bookings/booking.entity";

export class AdminController {
  static async bookings(req: Request, res: Response, next: NextFunction) {
    try {
      const bookings = await AppDataSource.getRepository(Booking).find({
        relations: ["student", "room"],
      });
      res.json({ success: true, data: bookings });
    } catch (error) {
      next(error);
    }
  }
}
