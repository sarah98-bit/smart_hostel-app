import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";

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
    // Add more entities here as you create them
  ],

  migrations: [],
  subscribers: [],
});
