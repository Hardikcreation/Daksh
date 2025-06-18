import Order from "../models/Order.js";
import { assignNextAvailablePartner } from "../utils/assignPartner.js";

/**
 * Cron job: Run every 20s or 30s
 * - Uses lean() for faster reads and minimal population.
 * - Uses in-place update for rejectedPartners.
 */
export async function autoReassignExpiredOrdersJob() {
  try {
    // Only fetch _id and relevant fields (avoid full document unless needed)
    const expiredOrders = await Order.find({
      requestStatus: "Pending",
      assignedPartner: { $ne: null },
      requestExpiresAt: { $lt: new Date() },
      status: { $in: ["Pending", "Confirmed"] },
    }).select("_id assignedPartner rejectedPartners items address user requestStatus status").exec();

    for (const o of expiredOrders) {
      // Use findByIdAndUpdate to atomically add rejectedPartner and reset fields
      const update = {
        $addToSet: { rejectedPartners: o.assignedPartner },
        $set: {
          assignedPartner: null,
          requestExpiresAt: null,
        }
      };
      await Order.findByIdAndUpdate(o._id, update);

      // Reload updated order (for assignNextAvailablePartner)
      const order = await Order.findById(o._id);

      // Assign to next eligible partner or mark as NoPartner
      await assignNextAvailablePartner(order);
    }

    if (expiredOrders.length > 0) {
      console.log(`[autoReassignExpiredOrdersJob] Reassigned ${expiredOrders.length} expired orders.`);
    }
  } catch (err) {
    console.error("[autoReassignExpiredOrdersJob] Error:", err);
  }
}