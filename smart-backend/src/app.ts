import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

// Middlewares (ORDER MATTERS)
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", routes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Handler (LAST)
app.use(errorHandler);

export default app;
