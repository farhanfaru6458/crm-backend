import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
  {
    dealName: { type: String, required: true },
    dealStage: {
      type: String,
      enum: [
        "Presentation Scheduled",
        "Qualified to Buy",
        "Contract Sent",
        "Appointment Scheduled",
        "Decision Maker Bought In",
        "Closed Won",
        "Closed Lost",
      ],
      required: true,
    },
    amount: { type: Number, required: true },
    dealOwner: { type: String, required: true },
    closeDate: { type: String }, // Format "May 5, 2025" or YYYY-MM-DD
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
    },
    associatedLeadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
  },
  {
    timestamps: true,
  },
);

const Deal = mongoose.model("Deal", dealSchema);
export default Deal;
