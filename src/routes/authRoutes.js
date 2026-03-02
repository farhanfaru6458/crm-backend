import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfile,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= PUBLIC ROUTES ================= */
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile", protect, updateProfile);
/* ================= PROTECTED ROUTES ================= */
router.get("/profile", protect, getUserProfile);

/* ================= ADMIN TEST ROUTE ================= */
router.get("/admin-test", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome Admin " });
});

/* ================= OTP VERIFICATION ================= */
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
export default router;



/* ================= FORGOT PASSWORD ================= */
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

