import "reflect-metadata";
import dotenv from "dotenv";
import app from "./app";
import { AppDataSource } from "./config/data-source";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize database then start server
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database");
    console.error(error);
    process.exit(1);
  });
