import { Router } from "express";
import { login, register } from "./auth.controller";

const router = Router();

router.post("/register", register); // register new user
router.post("/login", login);       // login existing user

export default router;
