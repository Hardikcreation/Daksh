import { Admin } from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Partner from "../models/Partner.js";
import PartnerDocuments from "../models/partnerDocument.js";
import { sendMail } from "../utils/sendMail.js";
//admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ adminId: admin._id , role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.status(200).json({
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
// Get all partners grouped by status
export const getAllPartnersByStatus = async (req, res) => {
  try {
    const unverified = await Partner.find({ isVerified: false });
    const pending = await Partner.find({ isVerified: true, isApproved: false, isDeclined: false });
    const verified = await Partner.find({ isApproved: true });
    const declined = await Partner.find({ isDeclined: true });

    res.json({ unverified, pending, verified, declined });
  } catch (err) {
    console.error("Error in getAllPartnersByStatus:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
//Verify partner
export const verifyPartner = async (req, res) => {
  await Partner.findByIdAndUpdate(req.params.id, {
    isApproved: true,
    isDeclined: false,
  });
  res.json({ message: "Partner verified" });
};

//Decline partner
export const declinePartner = async (req, res) => {
  await Partner.findByIdAndUpdate(req.params.id, { isDeclined: true, isApproved: false });
  res.json({ message: "Partner declined" });
};

// Verify a partner docs 
export const verifyPartnerst = async (req, res) => {
  try {
    const docId = req.params.id; // This is the PartnerDocuments _id
    const partnerDoc = await PartnerDocuments.findById(docId);

    if (!partnerDoc) {
      return res.status(404).json({ message: "PartnerDocument not found" });
    }

    const partnerId = partnerDoc.partner;

    // Update PartnerDocuments status
    await PartnerDocuments.findByIdAndUpdate(docId, { status: "verified" });

    // Update Partner status
    const updatedPartner = await Partner.findByIdAndUpdate(
      partnerId,
      { verificationStatus: "verified", isVerified: true },
      { new: true }
    );

    if (!updatedPartner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    // ======== EMAIL NOTIFICATION START ==========
    try {
      await sendMail({
        to: updatedPartner.email,
        subject: "Welcome to the Daksh Team! 🎉",
        html: `
          <h2>Congratulations, ${updatedPartner.name}!</h2>
          <p>Your documents have been successfully verified, and you are now a part of the <b>Daksh Team</b>!</p>
          <p>You can now start providing your services on our platform.</p>
          <hr/>
          <p>
            <strong>Service:</strong> ${updatedPartner.category || "N/A"}<br/>
            <strong>Name:</strong> ${updatedPartner.name}<br/>
            <strong>Job ID:</strong> ${updatedPartner._id}
          </p>
          <p style="margin-top:24px;">We wish you a successful journey ahead!<br/>- Team Daksh</p>
        `,
      });
      console.log("Verification email sent to partner:", updatedPartner.email);
    } catch (mailErr) {
      console.error("Failed to send verification email:", mailErr);
      // Continue, do not fail the request
    }
    // ======== EMAIL NOTIFICATION END ==========

    res.status(200).json({ message: "Partner verified", partner: updatedPartner });
  } catch (err) {
    console.error("Error verifying partner:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// Decline a partner docs
export const declinePartnerst = async (req, res) => {
  try {
    const partnerId = req.params.partnerId;

    // Update PartnerDocuments status
    await PartnerDocuments.findOneAndUpdate(
      { partner: partnerId },
      { status: "declined" }
    );

    // Update Partner status
    await Partner.findByIdAndUpdate(
      partnerId,
      { verificationStatus: "declined", isVerified: false }
    );

    res.status(200).json({ message: "Partner declined successfully" });
  } catch (err) {
    console.error("Decline partner error:", err);
    res.status(500).json({ message: "Failed to decline partner" });
  }
};
