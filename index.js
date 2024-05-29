import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { dbConnection } from "./database/dbConnection.js";
import authRoutes from "./routes/authRoutes.js";
config({ path: "./config/config.env" });
dbConnection();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use((err, req, res, next) => {
  const message = err.message || "Internal Server Error";
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
const PORT = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log(`Server is running on port ${PORT}`);
});
