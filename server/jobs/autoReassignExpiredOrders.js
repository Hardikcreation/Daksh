import Order from "../models/Order.js";
import { assignNextAvailablePartner } from "../utils/assignPartner.js";

// Cron job: Run every 30s (or less)
export async function autoReassignExpiredOrdersJob() {
  try {
    // Find orders where the last assigned partner didn't respond in time
    const expiredOrders = await Order.find({
      requestStatus: "Pending",
      assignedPartner: { $ne: null },
      requestExpiresAt: { $lt: new Date() },
      status: { $in: ["Pending", "Confirmed"] }, // Only active orders
    });

    for (const order of expiredOrders) {
      // Add last tried partner to rejectedPartners
      if (
        order.assignedPartner &&
        !order.rejectedPartners.map(String).includes(order.assignedPartner.toString())
      ) {
        order.rejectedPartners.push(order.assignedPartner);
      }
      order.assignedPartner = null;
      order.requestExpiresAt = null; // Will be set on next assign
      await order.save();

      // Assign to next eligible partner or mark as NoPartner
      await assignNextAvailablePartner(order);
    }

    if (expiredOrders.length > 0) {
      console.log(
        `[autoReassignExpiredOrdersJob] Reassigned ${expiredOrders.length} expired orders.`
      );
    }
  } catch (err) {
    console.error("[autoReassignExpiredOrdersJob] Error:", err);
  }
}