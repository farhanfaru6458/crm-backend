import mongoose from "mongoose";

const callSchema = new mongoose.Schema(
  {
    outcome: { type: String, required: true },
    duration: { type: String, default: "N/A" },
    date: { type: String, required: true },
    time: { type: String, required: true },
    note: { type: String },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "entityType",
    },
    entityType: {
      type: String,
      required: true,
      enum: ["Lead", "Deal", "Ticket", "Company", "Contact"],
    },
    createdBy: { type: String, default: "User" },
  },
  {
    timestamps: true,
  },
);

const Call = mongoose.model("Call", callSchema);
export default Call;
