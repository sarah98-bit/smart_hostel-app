import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { AppDataSource } from "../../config/data-source";
import { User } from "../../entities/user.entity";
import { RegisterDTO, LoginDTO } from "./auth.dto";

const userRepository = AppDataSource.getRepository(User);

export class AuthService {
  static async register(data: RegisterDTO) {
    const { email, password } = data;

    const existingUser = await userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userRepository.create({
      email,
      password: hashedPassword,
      role: "STUDENT",
    });

    await userRepository.save(user);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  static async login(data: LoginDTO) {
    const { email, password } = data;

    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    const expiresIn = process.env.JWT_EXPIRES_IN ?? "1h";

    const secret = process.env.JWT_SECRET as jwt.Secret | undefined;
    if (!secret) {
      throw new Error("JWT_SECRET not set in environment");
    }

    const signOptions: jwt.SignOptions = { expiresIn: expiresIn as unknown as any };

    const token = jwt.sign({ id: user.id, role: user.role }, secret, signOptions);

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
