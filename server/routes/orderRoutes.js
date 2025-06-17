import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminAuthMiddleware.js";
import { protectPartner } from "../middleware/authPartner.js";

import {
  createOrder,
  getUserOrders,
  placeOrder,
  getAllOrders,
  cancelOrder,
  changeOrderTimeSlot,
  submitPartnerFeedback
} from "../controllers/orderController.js";

import {
  assignPartnerAutomatically,
  assignPartnerToOrder,
  partnerRespondToRequest,
  getPartnerOrders,
  startOrder,
  completeOrder,
  submitFeedback,
  getPendingRequests
} from "../controllers/partnerAssignmentController.js";

// Import your Partner and Order models
import Partner from "../models/Partner.js";
import Order from "../models/Order.js";

const router = express.Router();

// ========== USER ROUTES ==========
router.post("/", protect, createOrder);
router.post("/place", protect, placeOrder);
router.get("/my-orders", protect, getUserOrders);
router.delete("/:id", protect, cancelOrder);
router.put('/:id/change-timeslot', protect, changeOrderTimeSlot);

// ========== ADMIN ROUTES ==========
router.get("/AllOrders", adminProtect, getAllOrders);
router.post("/assign-partner/:orderId", adminProtect, assignPartnerAutomatically);
router.post("/assign-partner-manual/:orderId", adminProtect, assignPartnerToOrder); // optional manual route
router.get("/partner-pending-requests", protectPartner, getPendingRequests);

// NEW: Get eligible providers for an order
router.get("/:orderId/eligible-providers", adminProtect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('user', 'name email')
      .populate('assignedPartner', 'name email')
      .populate('rejectedPartners', 'name email');
    if (!order) return res.status(404).json({ message: "Order not found" });

    const serviceCategory = order.items[0]?.title?.trim();
    if (!serviceCategory) return res.status(400).json({ message: "Service category not found" });

    const eligibleProviders = await Partner.find({
      category: serviceCategory,
      isApproved: true,
      isVerified: true,
      isDeclined: false,
      verificationStatus: "verified",
      isDocumentsSubmitted: true,
    }).select("name email phone");

    res.json({
      order,
      eligibleProviders,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========== PARTNER ROUTES ==========
router.post("/respond/:orderId", protectPartner, partnerRespondToRequest);
router.get("/partner-orders", protectPartner, getPartnerOrders);
router.post("/start/:orderId", protectPartner, startOrder);
router.post("/complete/:orderId", protectPartner, completeOrder);
router.post("/feedback/:orderId", protectPartner, submitFeedback);
router.post("/orders/feedback/:orderId", submitPartnerFeedback);

export default router;