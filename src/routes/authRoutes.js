import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfile,
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

export default router;