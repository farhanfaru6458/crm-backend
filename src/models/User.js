import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
     isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },
  
  },
  
  { timestamps: true }
);

export default mongoose.model("User", userSchema);