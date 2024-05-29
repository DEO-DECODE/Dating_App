import express from "express";
import { register, login, verifyOtp } from "../controllers/authController.js";

const router = express.Router();
router.post("/login",login);
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
export default router;
