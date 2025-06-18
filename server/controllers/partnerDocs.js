import Partner from "../models/Partner.js";
import PartnerDocument from "../models/partnerDocument.js";
import express from "express";
const app = express();

app.use('/uploads', express.static('uploads'));
// Upload documents
export const uploadPartnerDocuments = async (req, res) => {
  try {
    const { id, name, email } = req.user;
    const existingDocs = await PartnerDocument.findOne({ partner: id });
    if (existingDocs) {
      return res.status(400).json({ message: "Documents already submitted." });
    }
    const newDoc = new PartnerDocument({
      partner: id,
      name,
      email,
      documents: {
        aadhaar: req.files?.aadhaar?.[0]?.path,
        pan: req.files?.pan?.[0]?.path,
        marksheet10: req.files?.marksheet10?.[0]?.path,
        marksheet12: req.files?.marksheet12?.[0]?.path,
        diploma: req.files?.diploma?.[0]?.path,
        degree: req.files?.degree?.[0]?.path || null,
        policeVerification: req.files?.policeVerification?.[0]?.path,
      },
    });

    await newDoc.save();
    await Partner.findByIdAndUpdate(id, { isDocumentsSubmitted: true, verificationStatus: 'pending' });
    res.status(200).json({ message: "Documents uploaded successfully" });
  } catch (err) {
    console.error("Upload Error:", err.message);
    res.status(500).json({ message: "Upload failed" });
  }
};

// Update document verification status 
export const updateDocumentStatus = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { status } = req.body; // 'verified' or 'declined'

    if (!["verified", "declined"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const doc = await PartnerDocument.findOneAndUpdate(
      { partner: partnerId },
      { status },
      { new: true }
    );

    if (!doc) return res.status(404).json({ message: "Document not found" });

    res.status(200).json({ message: `Document ${status} successfully` });
  } catch (err) {
    console.error("Status Update Error:", err.message);
    res.status(500).json({ message: "Failed to update document status" });
  }
};

// Check documents exist or not 
export const checkDocumentsStatus = async (req, res) => {
  try {
    const partner = await Partner.findById(req.user.id);
    if (!partner) return res.status(404).json({ message: "Partner not found" });
    const documents = await PartnerDocument.findOne({ partner: req.user.id });

    const status = partner.verificationStatus || documents?.status || "pending";

    res.json({
      isDocumentsSubmitted: partner.isDocumentsSubmitted,
      status
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to check document status" });
  }
};

// Fetch all partner documents (for ADMIN)
export const getAllPartnerDocuments = async (req, res) => {
  try {
    const docs = await PartnerDocument.find()
      .populate("partner") // Get all partner info, including personalDetails
      .lean();

    const result = docs.map(doc => {
      const pd = doc.partner?.personalDetails || {};
      return {
        partnerDocId: doc._id,
        documents: doc.documents,
        status: doc.status || "pending",
        verificationStatus: doc.partner?.verificationStatus ?? doc.status ?? "pending",
        _id: doc.partner?._id,
        name: doc.partner?.name ?? doc.name,
        email: doc.partner?.email ?? doc.email,
        personalDetails: {
          fullName: pd.fullName ?? doc.partner?.name ?? doc.name,
          dob: pd.dob ?? "",
          gender: pd.gender ?? "",
          address: pd.address ?? "",
          phone: pd.phone ?? doc.partner?.phone,
          email: pd.email ?? doc.partner?.email ?? doc.email,
        }
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};