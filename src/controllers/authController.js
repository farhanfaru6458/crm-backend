import { generateOTP } from "../utils/generateOtp.js";
import { sendEmailAsync } from "../utils/sendEmail.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ================= TOKEN GENERATOR ================= */
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT secret not configured");
  }

  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    }
  );
};


/* ================= REGISTER ================= */
export const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      companyName,
      industry,
      country,
      password,
      confirmPassword,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !companyName ||
      !industry ||
      !country ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const normalizedEmail = email.toLowerCase();
    const isAdmin = normalizedEmail.startsWith("admin");
    const role = isAdmin ? "admin" : "user";
    const emailToVerify = isAdmin ? normalizedEmail.substring(5) : normalizedEmail;

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    const user = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      phone,
      companyName,
      industry,
      country,
      password: hashedPassword,
      role,
      otp: hashedOTP,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });

    console.log(`[REGISTER] OTP for ${emailToVerify}: ${otp}`);

    // Fire-and-forget — response is instant, email sends in background
    sendEmailAsync(
      emailToVerify,
      "CRM Email Verification",
      `Your OTP is ${otp}. It expires in 5 minutes.`
    );

    res.status(201).json({
      message: "OTP sent to your email",
      userId: user._id,
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};



/* ================= VERIFY OTP (BY EMAIL) ================= */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email already verified",
      });
    }

    if (!user.otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


/* ================= LOGIN ================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    /*  Validate fields */
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });

if (!user) {
  return res.status(400).json({
    message: "Invalid email or password",
  });
}

if (!user.isVerified) {
  const otp = generateOTP();
  const hashedOTP = await bcrypt.hash(otp, 10);

  user.otp = hashedOTP;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;

  await user.save();

  console.log(`[LOGIN] OTP for unverified user ${user.email}: ${otp}`);

  // Fire-and-forget — response is instant, email sends in background
  sendEmailAsync(
    user.email,
    "CRM Email Verification",
    `Your OTP is ${otp}. It expires in 5 minutes.`
  );

  return res.status(400).json({
    message: "Please verify your email first",
  });
}
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    /*  Generate Token */
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        companyName: user.companyName,
        industry: user.industry,
        country: user.country,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


/* ================= RESEND OTP ================= */
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    user.otp = hashedOTP;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    console.log(`[RESEND OTP] OTP for ${user.email}: ${otp}`);

    // Fire-and-forget — response is instant, email sends in background
    sendEmailAsync(
      user.email,
      "CRM OTP Resend",
      `Your new OTP is ${otp}. It expires in 5 minutes.`
    );

    res.json({ message: "OTP resent successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= GET PROFILE ================= */
export const getUserProfile = async (req, res) => {
  res.status(200).json(req.user);
};


/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      firstName,
      lastName,
      phone,
      companyName,
      industry,
      country,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phone = phone || user.phone;
    user.companyName = companyName || user.companyName;
    user.industry = industry || user.industry;
    user.country = country || user.country;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        companyName: updatedUser.companyName,
        industry: updatedUser.industry,
        country: updatedUser.country,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    user.resetPasswordOTP = hashedOTP;
    user.resetPasswordExpiry = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    console.log(`[FORGOT PASSWORD] OTP for ${user.email}: ${otp}`);

    // Fire-and-forget — response is instant, email sends in background
    sendEmailAsync(
      user.email,
      "Password Reset OTP",
      `Your password reset OTP is ${otp}. It expires in 10 minutes.`
    );

    res.json({ message: "Reset OTP sent to your email" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= RESET PASSWORD ================= */

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.resetPasswordExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp, user.resetPasswordOTP);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordOTP = null;
    user.resetPasswordExpiry = null;
    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};