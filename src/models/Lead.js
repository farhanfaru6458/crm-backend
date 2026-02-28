import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    name: { type: String }, // Full name for easy reference
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    jobTitle: { type: String },
    company: { type: String },
    owner: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["Contacted","Qualified","Unqualified","Converted", "New", "In Progress"],
      default: "Open",
    },
    createdDate: { type: String },
  },
  {
    timestamps: true,
  },
);

// Pre-save middleware to create name from firstName and lastName
leadSchema.pre("save", function (next) {
  if (this.firstName || this.lastName) {
    this.name = `${this.firstName || ""} ${this.lastName || ""}`.trim();
  }
  // Ensure createdDate is set if not provided
  if (!this.createdDate) {
    const today = new Date();
    this.createdDate = today.toLocaleDateString("en-GB"); // DD/MM/YYYY
  }
  next();
});

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;
