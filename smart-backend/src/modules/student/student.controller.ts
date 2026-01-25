import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { AppDataSource } from "../../config/data-source";
import { User } from "../../entities/user.entity";

const userRepo = AppDataSource.getRepository(User);

export class StudentController {
  static async profile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const student = await userRepo.findOneBy({ id: req.user!.id });
      res.json({ success: true, data: student });
    } catch (error) {
      next(error);
    }
  }
}
