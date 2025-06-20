// controllers/partnerAssignmentController.js
import Order from "../models/Order.js";
import Partner from "../models/Partner.js";
import nodemailer from "nodemailer";
import { assignNextAvailablePartner } from "../utils/assignPartner.js"; // handles reassignment logic

// Setup nodemailer transporter (configure with your Gmail or SMTP service)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Assign specific partner to order based on availability
export const assignPartnerToOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const serviceType = order.items[0]?.title?.toLowerCase();
    if (!serviceType) {
      return res.status(400).json({ message: "Service type missing in order items" });
    }

    const availablePartner = await Partner.findOne({
      isVerified: true,
      isApproved: true,
      isDeclined: false,
      verificationStatus: "verified",
    });

    if (!availablePartner) {
      return res.status(404).json({ message: "No available partner found" });
    }

    order.assignedPartner = availablePartner._id;
    order.requestStatus = "Pending";
    order.requestExpiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 mins
    await order.save();

    const emailOptions = {
      from: process.env.EMAIL_USER,
      to: availablePartner.email,
      subject: "New Service Request",
      html: `
        <h3>New Service Request Assigned</h3>
        <p><strong>Customer:</strong> ${order.user.name}</p>
        <p><strong>Email:</strong> ${order.user.email}</p>
        <p><strong>Service:</strong> ${order.items[0].title}</p>
        <p><strong>Scheduled Time:</strong> ${order.address.timeSlot}</p>
        <p><strong>Address:</strong> ${order.address.fullAddress}</p>
        <p>Please log in to your dashboard to accept or decline the job within 2 minutes.</p>
      `,
    };

    await transporter.sendMail(emailOptions);

    res.status(200).json({
      message: "Partner assigned and notified via email",
      order,
    });
  } catch (err) {
    console.error("❌ Partner Assignment Error:", err);
    res.status(500).json({ message: "Failed to assign partner" });
  }
};


// ✅ Auto-assign partner based on service category match
export const assignPartnerAutomatically = async (req, res) => {
  try {
    const { orderId } = req.params;
    // console.log("📦 Received orderId:", orderId);

    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      // console.log("❌ Order not found");
      return res.status(404).json({ message: "Order not found" });
    }

    const serviceName = order.items[0]?.title?.trim().toLowerCase();
    // console.log("🔍 Extracted service name:", serviceName);

    if (!serviceName) {
      return res.status(400).json({ message: "Service name missing in order" });
    }

    const availablePartner = await Partner.findOne({
      category: new RegExp(`^${serviceName}$`, 'i'),
      isApproved: true,
      isVerified: true,
      isDeclined: false,
      verificationStatus: "verified",
      isDocumentsSubmitted: true,
    });

    if (!availablePartner) {
      // console.log("❌ No matching partner found for category:", serviceName);
      return res.status(404).json({ message: `No available partner found for category '${serviceName}'` });
    }

    // console.log("✅ Assigned Partner:", availablePartner.email, "Category:", availablePartner.category);

    order.assignedPartner = availablePartner._id;
    order.requestStatus = "Pending";
    order.requestExpiresAt = new Date(Date.now() + 30 * 1000);
    await order.save();

    // console.log("📌 Order assigned successfully:", order._id);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: availablePartner.email,
      subject: "New Service Request",
      html: `
        <h3>New ${serviceName} Service Request</h3>
        <p><strong>Customer:</strong> ${order.user.name}</p>
        <p><strong>Time Slot:</strong> ${order.address.timeSlot}</p>
        <p><strong>Address:</strong> ${order.address.fullAddress}</p>
        <p>Please accept or decline within 2 minutes in your dashboard.</p>
      `,
    });

    res.status(200).json({
      message: "Partner assigned based on category",
      partner: availablePartner,
    });
  } catch (err) {
    console.error("🔥 assignPartnerAutomatically error:", err);
    res.status(500).json({ message: "Failed to assign partner", error: err.message });
  }
};

// ✅ Partner accepts or declines request
export const partnerRespondToRequest = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { response } = req.body;
    const partnerId = req.partner?._id?.toString();

    const order = await Order.findById(orderId)
      .populate("user")
      .populate("assignedPartner");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.assignedPartner || order.assignedPartner._id.toString() !== partnerId) {
      return res.status(403).json({ message: "Unauthorized partner" });
    }

    if (new Date() > new Date(order.requestExpiresAt)) {
      return res.status(400).json({ message: "Request has expired" });
    }

    if (response === "Accepted") {
      order.status = "Confirmed";
      order.requestStatus = "Accepted";
      await order.save();

      // Fetch partner details (should already be populated as assignedPartner)
      const partner = order.assignedPartner;

      // Send email to user with partner details
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: order.user.email,
        subject: "Your Service Provider Has Been Assigned",
        html: `
          <h2>Your service provider is assigned!</h2>
          <p>Dear ${order.user.name},</p>
          <p>Your service provider has been assigned. Here are the details:</p>
          <ul>
            <li><b>Name:</b> ${partner.name}</li>
            <li><b>Phone:</b> ${partner.phone}</li>
            <li><b>Email:</b> ${partner.email}</li>
          </ul>
          <p>Thank you for choosing us!</p>
        `
      });

      return res.status(200).json({ message: "Request accepted successfully and user notified by email." });
    } else if (response === "Declined") {
      order.assignedPartner = null;
      order.requestStatus = "Pending";
      order.status = "Declined";
      await order.save();

      // Reassignment logic
      await assignNextAvailablePartner(order);
      return res.status(200).json({ message: "Request declined and reassigned" });
    }

    return res.status(400).json({ message: "Invalid response" });

  } catch (err) {
    console.error("❌ Partner response error:", err);
    return res.status(500).json({ message: "Failed to respond to request", error: err.message });
  }
};

// ✅ Partner dashboard: Get all assigned/accepted orders
// ✅ Fetch all orders assigned to the logged-in partner
export const getPartnerOrders = async (req, res) => {
  try {
    const partnerId = req.partnerId;
    // console.log("🔑 Fetching orders for partner ID:", partnerId);

    if (!partnerId) {
      // console.log("❌ partnerId not found in request");
      return res.status(401).json({ message: "Unauthorized: No partner ID" });
    }

    const orders = await Order.find({ assignedPartner: partnerId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    // console.log("📦 Orders found:", orders.length);

    res.status(200).json(orders);
  } catch (err) {
    console.error("🔥 getPartnerOrders error:", err);
    res.status(500).json({ message: "Failed to fetch partner orders", error: err.message });
  }
};

//start 
export const startOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const partnerId = req.partnerId;

    const order = await Order.findById(orderId);
    if (!order || order.assignedPartner.toString() !== partnerId) {
      return res.status(404).json({ message: "Order not found or unauthorized" });
    }

    order.startedAt = new Date();
    await order.save();

    res.status(200).json({ message: "Order started successfully" });
  } catch (err) {
    console.error("Start Order Error:", err);
    res.status(500).json({ message: "Failed to start order" });
  }
};

//completeorder
export const completeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const partnerId = req.partnerId;

    const order = await Order.findById(orderId);
    if (!order || order.assignedPartner.toString() !== partnerId) {
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

//feedback
export const submitFeedback = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { rating, review } = req.body;
    const partnerId = req.partnerId;

    const order = await Order.findById(orderId);
    if (!order || order.assignedPartner.toString() !== partnerId || !order.completedAt) {
      return res.status(400).json({ message: "Order not eligible for feedback" });
    }

    order.feedback = { rating, review };
    await order.save();

    res.status(200).json({ message: "Feedback submitted successfully" });
  } catch (err) {
    console.error("Feedback Error:", err);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const partnerId = req.partnerId;

    const requests = await Order.find({
      assignedPartner: partnerId,
      requestStatus: "Pending",
      requestExpiresAt: { $gt: new Date() } // not expired
    }).populate("user", "name email");

    res.status(200).json(requests);
  } catch (err) {
    console.error("❌ Error fetching partner requests", err);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};