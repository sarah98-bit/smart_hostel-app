import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { Hostel } from "../modules/hostels/hostel.entity";
import { Room } from "../modules/hostels/room.entity";
import { Preference } from "../modules/preferences/preference.entity";
import { Booking } from "../modules/bookings/booking.entity";
import { Payment } from "../modules/payments/payment.entity";
import dotenv from "dotenv";

dotenv.config();  
/**
 * Central TypeORM data source
 * Used across services via AppDataSource.getRepository()
 */
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_NAME || "smart_hostel",

  /**
   * DEVELOPMENT ONLY
   * Auto-creates tables from entities
   * Disable in production
   */
  synchronize: true,

  logging: false,

  entities: [
    User,
    Hostel,
    Room,
    Preference,
    Booking,
    Payment,
  ],

  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});
