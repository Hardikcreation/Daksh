import Order from "../models/Order.js";
import { assignPartnerAutomatically } from "../controllers/partnerAssignmentController.js";

// Utility: Generate a random 4-digit code
function generate4DigitCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Create order (if you use this endpoint)
export const createOrder = async (req, res) => {
  try {
    const { services, totalPrice } = req.body;

    const newOrder = new Order({
      user: req.user.id,
      services,
      totalPrice,
      status: "Confirmed",
      requestStatus: "Pending",
      createdAt: new Date(),
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error("❌ Create Order Error:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
};

// Place order (with codes)
export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, address } = req.body;
    const userId = req.userId;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "No items to place order" });

    // Generate 2 different codes
    const happyCode = generate4DigitCode();
    let completeCode = generate4DigitCode();
    while (completeCode === happyCode) completeCode = generate4DigitCode();

    const newOrder = new Order({
      user: req.userId,
      items,
      totalAmount,
      address: { ...address },
      status: "Confirmed",
      requestStatus: "Pending",
      happyCode,
      completeCode,
      createdAt: new Date(),
    });

        await newOrder.save();
     


    // Don't assign a partner here: assignment logic will trigger async
    req.params.orderId = newOrder._id;
    await assignPartnerAutomatically(req, {
      status: () => ({ json: () => {} }),
    });

     res.status(201).json({ message: "Order placed; partner will respond shortly.", order: newOrder });
  } catch (err) {
    console.error("❌ placeOrder error:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
  
};

// Get orders for a user - including provider details and auto-setting NoPartner after 5 minutes
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    let orders = await Order.find({ user: userId })
      .populate("assignedPartner", "name email phone");

    // Check for pending orders that are older than 5 minutes and not assigned, and set to NoPartner
    const now = Date.now();
    await Promise.all(
      orders.map(async (order) => {
        if (
          (!order.assignedPartner || !order.assignedPartner.name) &&
          order.requestStatus === "pending"
        ) {
          const created = new Date(order.createdAt).getTime();
          if (now - created > 5 * 60 * 1000) {
            order.requestStatus = "NoPartner";
            await order.save();
          }
        }
      })
    );

    // refetch to ensure up-to-date status for frontend
    orders = await Order.find({ user: userId })
      .populate("assignedPartner", "name email phone");

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Fetch Orders Error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user.id && order.user.toString() !== req.userId)
      return res.status(403).json({ message: "Unauthorized" });

    order.status = "Cancelled";
    await order.save();
    res.status(200).json({ message: "Order cancelled" });
  } catch (err) {
    console.error("❌ Cancel Order Error:", err);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("assignedPartner", "name email")
      .populate("rejectedPartners", "name email");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Fetch all orders error:", error);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
};

// Get orders for a partner
export const getPartnerOrders = async (req, res) => {
  try {
    const partnerId = req.partnerId;

    const orders = await Order.find({ assignedPartner: partnerId })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    // Only include user email/name if requestStatus is Accepted or status is processing/Completed
    orders.forEach(order => {
      if (
        order.requestStatus !== "Accepted" &&
        order.status !== "processing" &&
        order.status !== "Completed"
      ) {
        if (order.user) {
          order.user = { name: "Hidden until accepted" };
        }
      }
    });

    res.json(orders);
  } catch (err) {
    console.error("❌ Failed to fetch partner orders:", err);
    res.status(500).json({ message: "Failed to load orders" });
  }
};

// Change order time slot and reassign partner
export const changeOrderTimeSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { timeSlot } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.address) {
      return res.status(400).json({ message: "Order address missing" });
    }

    // Update time slot and reset assignment
    order.address.timeSlot = timeSlot;
    order.status = "Confirmed";
    order.requestStatus = "Pending";
    order.assignedPartner = null;
    order.requestExpiresAt = null;
    order.rejectedPartners = [];

    await order.save();

    // Call this function to re-assign a partner and send new request/notification
    await assignPartnerAutomatically({ params: { orderId: order._id } }, {
      status: () => ({ json: () => {} }),
    });

    res.status(200).json({ message: "Time slot updated and reassignment started." });
  } catch (err) {
    console.error("Error in changeOrderTimeSlot:", err);
    res.status(500).json({ message: "Failed to update time slot" });
  }
};

// Submit partner feedback for an order
export const submitPartnerFeedback = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { rating, review, by } = req.body;

    // Only allow partner to submit feedback to partnerFeedback
    if (by !== "partner") {
      return res.status(400).json({ message: "Invalid feedback role" });
    }

    // Find the order and ensure partnerFeedback is not already given
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.partnerFeedback) {
      return res.status(400).json({ message: "Feedback already submitted" });
    }

    // Save feedback
    order.partnerFeedback = { rating, review };
    await order.save();

    res.json({ message: "Feedback submitted successfully", order });
  } catch (err) {
    console.error("Feedback error:", err);
    res.status(500).json({ message: "Server error" });
  }
};