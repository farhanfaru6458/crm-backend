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

    /*  Validate Required Fields */
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
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    /*  Password Match Check */
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    /*  Normalize Email */
    const normalizedEmail = email.toLowerCase();

    /*  Check Existing User */
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    /*  Hash Password */
    const hashedPassword = await bcrypt.hash(password, 10);

    /*  Create User */
    const user = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      phone,
      companyName,
      industry,
      country,
      password: hashedPassword,
    });

    /*  Generate Token (Auto Login After Register) */
    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
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
    console.error("REGISTER ERROR:", error);
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