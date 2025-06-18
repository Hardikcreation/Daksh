import Partner from "../models/Partner.js";
import nodemailer from "nodemailer";

/**
 * Assigns the next eligible partner to the order.
 * - Uses a single query to fetch the next eligible partner.
 * - Uses $nin for rejectedPartners and _id for atomic selection.
 * - Sets requestExpiresAt to 30 seconds from now.
 * - Marks order as "No service provider is available" if none left.
 * - Sends email notification to the new partner.
 */
export const assignNextAvailablePartner = async (order) => {
  try {
    const serviceCategory = order.items[0]?.title?.trim();
    if (!serviceCategory) {
      await order.updateOne({
        $set: {
          requestStatus: "No service provider is available",
          status: "Declined",
          assignedPartner: null,
          requestExpiresAt: null,
        }
      });
      return;
    }

    // Directly fetch the next eligible partner (no need to fetch all and JS filter)
    const newPartner = await Partner.findOne({
      category: serviceCategory,
      isApproved: true,
      isVerified: true,
      isDeclined: false,
      verificationStatus: "verified",
      isDocumentsSubmitted: true,
      _id: { $nin: order.rejectedPartners || [] }
    }).sort({ createdAt: 1 }); // FIFO

    if (!newPartner) {
      await order.updateOne({
        $set: {
          requestStatus: "No service provider is available",
          status: "Declined",
          assignedPartner: null,
          requestExpiresAt: null,
        }
      });
      console.log("No eligible partners left for order", order._id);
      return;
    }

    await order.updateOne({
      $set: {
        assignedPartner: newPartner._id,
        requestStatus: "Pending",
        requestExpiresAt: new Date(Date.now() + 30 * 1000),
      }
    });

    // Notify
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: newPartner.email,
        subject: "New Service Request",
        html: `
          <h3>New Service Request Assigned</h3>
          <p><strong>Order:</strong> ${order._id}</p>
          <p><strong>Service:</strong> ${order.items[0]?.title}</p>
          <p><strong>Scheduled Time:</strong> ${order.address?.timeSlot}</p>
          <p>Please log in to your dashboard to accept or decline.</p>
        `,
      });
    } catch (notifyErr) {
      console.error("Partner notification failed:", notifyErr);
    }

    console.log("Order reassigned to partner:", newPartner._id, "Order:", order._id);
  } catch (err) {
    console.error("Failed to reassign order:", err);
    await order.updateOne({
      $set: {
        requestStatus: "No service provider is available",
        status: "Declined",
        assignedPartner: null,
        requestExpiresAt: null,
      }
    });
  }
};