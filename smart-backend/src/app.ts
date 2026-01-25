import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

/* 🔴 MUST BE FIRST */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Routes */
app.use("/api", routes);

/* Debug middleware (TEMPORARY) */
app.use((req, _res, next) => {
  console.log("FINAL BODY:", req.body);
  next();
});

export default app;
