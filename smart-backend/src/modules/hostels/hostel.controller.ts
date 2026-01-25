import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../config/data-source";
import { Hostel } from "./hostel.entity";

export class HostelController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const hostels = await AppDataSource.getRepository(Hostel).find({
        relations: ["rooms"],
      });
      res.json({ success: true, data: hostels });
    } catch (error) {
      next(error);
    }
  }
}
