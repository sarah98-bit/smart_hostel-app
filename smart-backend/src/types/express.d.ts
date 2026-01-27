import { Request } from "express";
import { User } from "../entities/user.entity"; // make sure path matches your project

export interface AuthenticatedRequest extends Request {
  user: User;
}
