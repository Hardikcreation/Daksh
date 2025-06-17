import express from "express";
import {
  registerPartner,
  verifyOTP,
  loginPartner,
  getAllPartners,
  deletePartner,
  getPartnerDashboardStats,
  forgotPassword,
  resetPassword,
  getMe,
  updatePersonalDetails,
} from "../controllers/partnerController.js";
import { handlePartnerSupport } from "../controllers/partnerSupportController.js";
import {
  uploadPartnerDocuments,
  updateDocumentStatus,
  checkDocumentsStatus,
} from "../controllers/partnerDocs.js";
import { adminProtect } from "../middleware/adminAuthMiddleware.js";
import partnerAuth from "../middleware/partnerAuth.js";
import { protectPartner, authPartner } from "../middleware/authPartner.js";
import multer from "multer";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Authenticated partner details
router.get("/me", protectPartner, getMe);

// Registration & Auth
router.post("/register", registerPartner);
router.post("/verify", verifyOTP);
router.post("/login", loginPartner);
router.post("/forget-password-partner", forgotPassword);
router.put("/reset-password-partner/:token", resetPassword);

// Partner management
router.get("/", getAllPartners); // List all
router.delete("/:id", deletePartner);

// Partner dashboard stats
router.get("/dashboard-stats", protectPartner, getPartnerDashboardStats);

// Documents
router.get("/check-documents", partnerAuth, checkDocumentsStatus);
router.post(
  "/upload-documents",
  authPartner,
  upload.fields([
    { name: "aadhaar", maxCount: 1 },
    { name: "pan", maxCount: 1 },
    { name: "marksheet10", maxCount: 1 },
    { name: "marksheet12", maxCount: 1 },
    { name: "diploma", maxCount: 1 },
    { name: "degree", maxCount: 1 },
    { name: "policeVerification", maxCount: 1 },
  ]),
  uploadPartnerDocuments
);
router.put("/verify-documents/:partnerId", adminProtect, updateDocumentStatus);

// Support
router.post("/support", protectPartner, handlePartnerSupport);

// Personal details update
router.post("/update-personal-details", authPartner, updatePersonalDetails);

// --------- FIX: Middleware to set req.partner from req.user if missing ---------
// This should be placed before any routes that expect req.partner to exist.
// For example, you can place it here, or directly in updatePersonalDetails controller if only used there.
router.use((req, res, next) => {
  if (!req.partner && req.user) {
    req.partner = req.user;
  }
  next();
});

export default router;