import mongoose from "mongoose";

// Document Uploads Schema
const documentsSchema = new mongoose.Schema(
  {
    aadhaar: { type: String, required: false }, // file path or URL
    pan: { type: String, required: false },
    marksheet10: { type: String, required: false },
    marksheet12: { type: String, required: false },
    diploma: { type: String, required: false },
    degree: { type: String, required: false },
    policeVerification: { type: String, required: false },
  },
  { _id: false }
);

// Personal Details Schema
const personalDetailsSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  { _id: false }
);

// Aadhaar Verification Schema (optional)
const aadhaarVerificationSchema = new mongoose.Schema(
  {
    aadharNumber: { type: String },
    verified: { type: Boolean, default: false },
    verificationDate: { type: Date }
  },
  { _id: false }
);

// Police Verification Schema (optional)
const policeVerificationSchema = new mongoose.Schema(
  {
    status: { type: String, enum: ["pending", "verified", "declined"], default: "pending" },
    verificationDate: { type: Date }
  },
  { _id: false }
);

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  isVerified: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  isDeclined: { type: Boolean, default: false },
  verificationStatus: { type: String, enum: ['pending', 'verified', 'declined'], default: 'pending' },
  isDocumentsSubmitted: { type: Boolean, default: false },

  otp: { type: String },
  otpExpires: { type: Date },

  category: { type: String, required: true },
  jobId: { type: String, unique: true },
  services: [String],

  resetPasswordToken: String,
  resetPasswordExpires: Date,

  createdAt: { type: Date, default: Date.now },

  // NEW FIELDS
  personalDetails: { type: personalDetailsSchema, required: false }, // Not required at registration
  documents: { type: documentsSchema, required: false }, // Not required at registration!
  aadhaarVerification: { type: aadhaarVerificationSchema, required: false },
  policeVerification: { type: policeVerificationSchema, required: false },
});

// Check if model already exists before defining
const Partner = mongoose.models.Partner || mongoose.model("Partner", partnerSchema);
export default Partner;