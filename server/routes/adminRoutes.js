import express from "express";
import { adminLogin,getAllPartnersByStatus, verifyPartner, declinePartner, verifyPartnerst, declinePartnerst } from "../controllers/adminController.js";
import { getAllPartnerDocuments , } from "../controllers/partnerDocs.js";
import partnerAuth from "../middleware/partnerAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { adminProtect } from "../middleware/adminAuthMiddleware.js";
import { verifyAdminToken } from "../middleware/verifyAdminToken.js";
const router = express.Router();

router.post("/login", adminLogin);

router.get("/admin/partner-documents", partnerAuth, getAllPartnerDocuments);

router.get("/partners-by-status", getAllPartnersByStatus);
router.put("/verify-partner/:id", verifyPartner);
router.put("/decline-partner/:id", declinePartner);
router.get("/partner-documents", getAllPartnerDocuments);


//for documents verification
router.post("/partners/:id/verify", verifyAdminToken, verifyPartnerst);
router.post("/partners/:partnerId/decline", adminProtect, declinePartnerst);

export default router;
