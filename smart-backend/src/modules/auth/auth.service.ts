import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../config/data-source";
import { User } from "../../entities/user.entity";

// ✅ Define allowed roles based on your PostgreSQL enum
const ALLOWED_ROLES = ["admin", "student"] as const;
type Role = typeof ALLOWED_ROLES[number];

export class AuthService {
  // ✅ Register a new user
  static async register(body: { email: string; password: string; role: string }) {
    const { email, password, role } = body;

    if (!email || !password || !role) {
      throw new Error("Email, password, and role are required");
    }

    // ✅ Validate role automatically
    if (!ALLOWED_ROLES.includes(role as Role)) {
      throw new Error(`Invalid role. Allowed roles: ${ALLOWED_ROLES.join(", ")}`);
    }

    const userRepo = AppDataSource.getRepository(User);

    // Check if user already exists
    const existing = await userRepo.findOne({ where: { email } });
    if (existing) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userRepo.create({
      email,
      password: hashedPassword,
      role: role.toUpperCase() as "STUDENT" | "ADMIN",
    });

    await userRepo.save(user);

    // Return user info (without password)
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  // ✅ Login user
  static async login(data: { email: string; password: string }) {
    if (!data) throw new Error("Request body is missing");

    const { email, password } = data;
    if (!email || !password) throw new Error("Email and password are required");

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });

    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    // Sign JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
