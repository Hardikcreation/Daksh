import express from "express";
import { signup,login, verifyEmail ,  forgotPassword,
  resetPassword, } from "../controllers/authController.js";

const router = express.Router();


// Auth Routes
router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/login", login);

// Forgot Password & Reset Password Routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
