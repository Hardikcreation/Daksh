import express from "express";
import multer from "multer";
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
import { protectPartner, authPartner } from "../middleware/authPartner.js";
import partnerAuth from "../middleware/partnerAuth.js"; // You can consolidate this if needed

const router = express.Router();

// ✅ Multer file upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Auth & Registration
router.post("/register", registerPartner);
router.post("/verify", verifyOTP);
router.post("/login", loginPartner);
router.post("/forget-password-partner", forgotPassword);
router.put("/reset-password-partner/:token", resetPassword);

// ✅ Partner Authenticated Routes
router.get("/me", protectPartner, getMe);
router.get("/dashboard-stats", protectPartner, getPartnerDashboardStats);
router.post("/support", protectPartner, handlePartnerSupport);

// ✅ Update personal details (authenticated)
router.post("/update-personal-details", authPartner, updatePersonalDetails);

// ✅ Document Handling
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

// ✅ Admin Panel Routes
router.get("/", getAllPartners); // Consider protecting this with adminProtect
router.delete("/:id", deletePartner); // Same here

// ✅ Optional: Middleware to sync req.user -> req.partner if needed
router.use((req, res, next) => {
  if (!req.partner && req.user) {
    req.partner = req.user;
  }
  next();
});

export default router;
