import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    ticketName: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["New", "Waiting on us", "Waiting on contact"],
      required: true,
    },

    source: {
      type: String,
      enum: ["Chat", "Email", "Phone"],
      required: true,
    },

    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      required: true,
    },

    owner: {
      type: String,
      required: true,
    },

    // Optional association
    associatedDealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
      default: null,
    },

    associatedCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },

    // Ticket belongs to logged in user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);