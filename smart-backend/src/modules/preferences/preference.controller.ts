import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { AppDataSource } from "../../config/data-source";
import { Preference } from "./preference.entity";

const prefRepo = AppDataSource.getRepository(Preference);

export class PreferenceController {
  static async save(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const pref = prefRepo.create({
        ...req.body,
        student: { id: req.user!.id },
      });

      await prefRepo.save(pref);

      res.json({ success: true, data: pref });
    } catch (error) {
      next(error);
    }
  }
}
