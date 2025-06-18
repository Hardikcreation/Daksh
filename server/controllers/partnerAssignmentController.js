import Order from "../models/Order.js";
import Partner from "../models/Partner.js";
import nodemailer from "nodemailer";
import { assignNextAvailablePartner } from "../utils/assignPartner.js";

// Setup nodemailer transporter (configure with your Gmail or SMTP service)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ========== ADMIN: Manual assignment of partner ==========
export const assignPartnerToOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { partnerId } = req.body;
    // Only fetch what you need
    const order = await Order.findById(orderId).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const partner = await Partner.findOne({
      _id: partnerId,
      isVerified: true,
      isApproved: true,
      verificationStatus: "verified",
    }).select("email");
    if (!partner) return res.status(404).json({ message: "Partner not found or unavailable" });

    order.assignedPartner = partner._id;
    order.requestStatus = "Pending";
    order.requestExpiresAt = new Date(Date.now() + 30 * 1000);
    await order.save();

    // Notify partner
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: partner.email,
      subject: "Manual Service Assignment",
      html: `<p>You have a new service request from ${order.user.name}</p>
             <p>Address: ${order.address?.fullAddress || ""}</p>`,
    });

    res.status(200).json({
      message: "Partner manually assigned and notified",
      order,
    });
  } catch (err) {
    console.error("❌ Manual Partner Assignment Error:", err);
    res.status(500).json({ message: "Failed to manually assign partner" });
  }
};

// ========== ADMIN: Auto-assign partner based on service category ==========
export const assignPartnerAutomatically = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const serviceName = order.items[0]?.title?.trim().toLowerCase();
    // Use $nin for rejectedPartners, and only select the first eligible partner
    const partner = await Partner.findOne({
      category: new RegExp(`^${serviceName}$`, "i"),
      isVerified: true,
      isApproved: true,
      verificationStatus: "verified",
      isDocumentsSubmitted: true,
      _id: { $nin: order.rejectedPartners || [] },
    }).select("email name");

    if (!partner) {
      order.assignedPartner = null;
      order.requestStatus = "NoPartner";
      await order.save();
      return res.status(404).json({ message: `No available partner found for category '${serviceName}'` });
    }

    order.assignedPartner = partner._id;
    order.requestStatus = "Pending";
    order.requestExpiresAt = new Date(Date.now() + 30 * 1000);
    await order.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: partner.email,
      subject: "New Service Request",
      html: `
       <p>New service request from ${order.user.name}</p>
             <p>Time Slot: ${order.address?.timeSlot || ""}</p>
             <p>Address: ${order.address?.fullAddress || ""}</p>
        <p>Please accept or decline within 30 seconds in your dashboard.</p>
      `,
    });

    res.status(200).json({
      message: "Partner assigned based on category",
      partner,
    });
  } catch (err) {
    console.error("🔥 assignPartnerAutomatically error:", err);
    res.status(500).json({ message: "Failed to assign partner", error: err.message });
  }
};

// ========== PARTNER: Accept or Decline Request ==========
export const partnerRespondToRequest = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { response } = req.body; // "Accepted" or "Declined"
    const partnerId = req.partner?._id?.toString() || req.partnerId;

    const order = await Order.findById(orderId).populate("assignedPartner");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (!order.assignedPartner || order.assignedPartner._id.toString() !== partnerId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (new Date() > order.requestExpiresAt) {
      return res.status(400).json({ message: "Request expired" });
    }

    if (response === "Accepted") {
      order.status = "Confirmed";
      order.requestStatus = "Accepted";
      order.requestExpiresAt = null;
      await order.save();
      return res.status(200).json({ message: " accepted " });

    }

    if (response === "Declined") {
      // Direct atomic update for rejectedPartners
      await Order.updateOne(
        { _id: orderId },
        {
          $addToSet: { rejectedPartners: partnerId },
          $set: {
            assignedPartner: null,
            requestStatus: "Declined",
            requestExpiresAt: null,
          },
        }
      );
      // Reload updated order for next assignment
      const updatedOrder = await Order.findById(orderId);
      await assignNextAvailablePartner(updatedOrder);
      return res.status(200).json({ message: "Declined and reassigned" });
    }

    res.status(400).json({ message: "Invalid response" });

  } catch (err) {
    console.error("❌ Partner response error:", err);
    res.status(500).json({ message: "Failed to respond to request", error: err.message });
  }
};

// ========== PARTNER: Get all assigned/accepted orders ==========
export const getPartnerOrders = async (req, res) => {
  try {
    const partnerId = req.partner?._id?.toString() || req.partnerId;
    if (!partnerId) return res.status(401).json({ message: "Unauthorized: No partner ID" });

    const orders = await Order.find({
      assignedPartner: partnerId,
      status: { $in: ["Pending", "Confirmed", "processing", "Completed"] }
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("🔥 getPartnerOrders error:", err);
    res.status(500).json({ message: "Failed to fetch partner orders", error: err.message });
  }
};

// ========== PARTNER: Start Order ==========
export const startOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const partnerId = req.partner?._id?.toString() || req.partnerId;

    // Use findOne for both checks
    const order = await Order.findOne({ _id: orderId, assignedPartner: partnerId });
    if (!order) {
      return res.status(404).json({ message: "Order not found or unauthorized" });
    }

    order.startedAt = new Date();
    order.status = "processing";
    await order.save();

    res.status(200).json({ message: "Order started successfully" });
  } catch (err) {
    console.error("Start Order Error:", err);
    res.status(500).json({ message: "Failed to start order" });
  }
};

// ========== PARTNER: Complete Order ==========
export const completeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const partnerId = req.partner?._id?.toString() || req.partnerId;

    const order = await Order.findOne({ _id: orderId, assignedPartner: partnerId });
    if (!order) {
      return res.status(404).json({ message: "Order not found or unauthorized" });
    }

    if (!order.startedAt) {
      return res.status(400).json({ message: "Order must be started before completing" });
    }

    order.completedAt = new Date();
    order.status = "Completed";
    order.requestStatus = "Accepted";
    await order.save();

    res.status(200).json({ message: "Order marked as completed" });
  } catch (err) {
    console.error("Complete Order Error:", err);
    res.status(500).json({ message: "Failed to complete order" });
  }
};

// ========== PARTNER: Submit Feedback ==========
export const submitFeedback = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { rating, review } = req.body;
    const partnerId = req.partner?._id?.toString() || req.partnerId;

    const order = await Order.findOne({
      _id: orderId,
      assignedPartner: partnerId,
      completedAt: { $ne: null }
    });
    if (!order) {
      return res.status(400).json({ message: "Order not eligible for feedback" });
    }

    order.partnerFeedback = { rating, review };
    await order.save();

    res.status(200).json({ message: "Feedback submitted successfully" });
  } catch (err) {
    console.error("Feedback Error:", err);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
};

// ========== PARTNER: Get Pending Requests ==========
export const getPendingRequests = async (req, res) => {
  try {
    const partnerId = req.partner?._id?.toString() || req.partnerId;

    const requests = await Order.find({
      assignedPartner: partnerId,
      requestStatus: "Pending",
      requestExpiresAt: { $gt: new Date() }
    }).populate("user", "name email");

    res.status(200).json(requests);
  } catch (err) {
    console.error("❌ Error fetching partner requests", err);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};