// server/jobs/autoRefundUnacceptedOrders.js
import Order from "../models/Order.js";
import { razorpay } from "../utils/razorpay.js";

export async function autoRefundUnacceptedOrdersJob() {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  const orders = await Order.find({
    requestStatus: "Pending",
    status: { $in: ["Pending", "Confirmed"] },
    createdAt: { $lt: fifteenMinutesAgo },
    paymentId: { $exists: true, $ne: null },
    assignedPartner: null
  });

  for (const order of orders) {
    try {
      // Refund via Razorpay
      await razorpay.payments.refund(order.paymentId, { amount: order.totalAmount * 100 }); // amount in paise
      order.status = "Refunded";
      order.requestStatus = "NoPartner";
      await order.save();
      // TODO: Notify user via email/SMS
      console.log(`[Refund] Refunded order ${order._id} for user ${order.user}`);
    } catch (err) {
      console.error(`[Refund] Error refunding order ${order._id}:`, err);
    }
  }
}
