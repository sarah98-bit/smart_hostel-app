import { Request, Response } from "express";
import { ProfileService } from "./profile.service";

export class ProfileController {
  static async createProfile(req: Request, res: Response) {
    try {
      const profile = await ProfileService.createProfile(req.body);
      res.json({ success: true, data: profile });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;

      const profile = await ProfileService.getProfile(userId);

      res.json({ success: true, data: profile });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;

      const profile = await ProfileService.updateProfile(userId, req.body);

      res.json({ success: true, data: profile });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}