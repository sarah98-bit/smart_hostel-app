import "reflect-metadata";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { AppDataSource } from "../config/data-source";
import { Hostel } from "../modules/hostels/hostel.entity";
import { User } from "../entities/user.entity";
import bcrypt from "bcryptjs";

async function seedHostels() {
  const hostelRepo = AppDataSource.getRepository(Hostel);
  const csvPath = path.join(__dirname, "../../data/dkut_hostels.csv");
  const rows: any[] = [];

  // Read CSV completely
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  // Insert hostels sequentially
  for (const row of rows) {
    const exists = await hostelRepo.findOne({ where: { name: row.name } });
    if (!exists) {
      const hostel = hostelRepo.create({
        name: row.name,
        price_kes_per_month: Number(row.price_kes_per_month),
        distance_km: Number(row.distance_km),
        rating: Number(row.rating),
        facilities: row.facilities,
        room_types: row.room_types,
      });
      await hostelRepo.save(hostel);
      console.log(`🏠 Inserted hostel: ${row.name}`);
    } else {
      console.log(`ℹ️ Hostel exists: ${row.name}`);
    }
  }
}

async function seedUsers() {
  const userRepo = AppDataSource.getRepository(User);

  // Define users
  const users = [
    { email: "admin@dkut.ac.ke", password: "admin123", role: "admin" },
    { email: "test@students.dkut.ac.ke", password: "password123", role: "student" },
  ];

  const ALLOWED_ROLES = ["admin", "student"];

  for (const u of users) {
    // Validate role
    if (!ALLOWED_ROLES.includes(u.role)) {
      console.log(`❌ Skipping invalid role for user: ${u.email}`);
      continue;
    }

    const exists = await userRepo.findOne({ where: { email: u.email } });
    if (exists) {
      console.log(`ℹ️ User exists: ${u.email}`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(u.password, 10);

    const user = userRepo.create({
      email: u.email,
      password: hashedPassword,
      role: u.role.toUpperCase() as "STUDENT" | "ADMIN",
    });

    await userRepo.save(user);
    console.log(`✅ Created user: ${u.email} (${u.role})`);
  }
}

async function seedAll() {
  try {
    await AppDataSource.initialize();
    console.log("🌐 Database connected");

    await seedHostels();
    await seedUsers();

    await AppDataSource.destroy();
    console.log("🌱 Seeding completed successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedAll();
