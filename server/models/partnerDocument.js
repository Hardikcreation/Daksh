// models/partnerDocuments.js

import mongoose from "mongoose";

const partnerDocumentsSchema = new mongoose.Schema(
  {
    partner: { type: mongoose.Schema.Types.ObjectId, ref: "Partner", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    documents: {
      aadhaar: { type: String, required: true },
      pan: { type: String, required: true },
      marksheet10: { type: String, required: true },
      marksheet12: { type: String, required: true },
      diploma: { type: String, required: true },
      degree: { type: String, default: null },
      policeVerification: { type: String, required: true },
    },
     status: {  type: String, enum: ["pending", "verified", "declined"], default: "pending", //for docs verification  
  },
  },
  { timestamps: true }
);

const PartnerDocuments = mongoose.model("PartnerDocuments", partnerDocumentsSchema);

export default PartnerDocuments;
