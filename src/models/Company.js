import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },

    // 🔥 New Fields
    domain: {
      type: String,
    },
    type: {
      type: String,
      enum: ["Client", "Partner", "Vendor"],
    },
    employees: {
      type: String,
    },
    revenue: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);