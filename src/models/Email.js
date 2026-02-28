import mongoose from "mongoose";

const emailSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    body: { type: String, required: true },
    to: { type: String, required: true },
    from: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
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

const Email = mongoose.model("Email", emailSchema);
export default Email;
