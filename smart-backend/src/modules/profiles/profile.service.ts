import { AppDataSource } from "../../config/data-source";
import { Profile } from "./profile.entity";
import { User } from "../../entities/user.entity";
import { CreateProfileDTO, UpdateProfileDTO } from "./profile.dto";

const profileRepo = AppDataSource.getRepository(Profile);
const userRepo = AppDataSource.getRepository(User);

export class ProfileService {
  static async createProfile(data: CreateProfileDTO) {
    const user = await userRepo.findOne({ where: { id: data.userId } });

    if (!user) throw new Error("User not found");

    const profile = profileRepo.create({
      registrationNumber: data.registrationNumber,
      fullName: data.fullName,
      phone: data.phone,
      gender: data.gender,
      user,
    });

    return await profileRepo.save(profile);
  }

  static async getProfile(userId: string) {
    const profile = await profileRepo.findOne({
      where: { user: { id: userId } },
      relations: ["user"],
    });

    if (!profile) throw new Error("Profile not found");

    return profile;
  }

  static async updateProfile(userId: string, data: UpdateProfileDTO) {
    const profile = await profileRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!profile) throw new Error("Profile not found");

    Object.assign(profile, data);

    return await profileRepo.save(profile);
  }
}