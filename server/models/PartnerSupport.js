import mongoose from "mongoose";

const partnerSupportSchema = new mongoose.Schema({
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
    required: true,
  },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["open", "closed"], default: "open" }
});

export default mongoose.models.PartnerSupport || mongoose.model("PartnerSupport", partnerSupportSchema);