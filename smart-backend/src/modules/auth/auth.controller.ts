import { Request, Response } from "express";
import { AuthService } from "./auth.service";

// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.register(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.login(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};
