import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
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

const Meeting = mongoose.model("Meeting", meetingSchema);
export default Meeting;
