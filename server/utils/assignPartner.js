import Partner from "../models/Partner.js";
import nodemailer from "nodemailer";

/**
 * Assigns the next eligible partner to the order.
 * - Skips partners in order.rejectedPartners.
 * - Sets requestExpiresAt to 30 seconds from now.
 * - Marks order as "NoServiceProvider" if none left.
 * - Sends email notification to the new partner (optional).
 */
export const assignNextAvailablePartner = async (order) => {
  try {
    const serviceCategory = order.items[0]?.title?.trim();
    if (!serviceCategory) {
      order.requestStatus = "No service provider is available";
      order.status = "Declined";
      order.assignedPartner = null;
      order.requestExpiresAt = null;
      await order.save();
      return;
    }

    // Find all eligible partners for the service
    const eligiblePartners = await Partner.find({
      category: serviceCategory,
      isApproved: true,
      isVerified: true,
      isDeclined: false,
      verificationStatus: "verified",
      isDocumentsSubmitted: true,
    });

    // Exclude partners already tried
    const previouslyTriedPartnerIds = (order.rejectedPartners || []).map(p => p.toString());
    const availablePartners = eligiblePartners.filter(
      (partner) => !previouslyTriedPartnerIds.includes(partner._id.toString())
    );

    if (availablePartners.length === 0) {
      order.requestStatus = "No service provider is available";
      order.status = "Declined";
      order.assignedPartner = null;
      order.requestExpiresAt = null;
      await order.save();
      console.log("No service providers left; marked as No service provider is available/Declined:", order._id);
      return;
    }

    // Assign the next available partner (FIFO)
    const newPartner = availablePartners[0];
    order.assignedPartner = newPartner._id;
    order.requestStatus = "Pending";
    order.requestExpiresAt = new Date(Date.now() + 30 * 1000); // 30 seconds from now
    await order.save();

    // Optionally: send notification to newPartner here
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

    console.log(
      "Order reassigned to partner:",
      newPartner._id,
      "Order:",
      order._id
    );
  } catch (err) {
    console.error("Failed to reassign order:", err);
    order.requestStatus = "No service provider is available";
    order.status = "Declined";
    order.assignedPartner = null;
    order.requestExpiresAt = null;
    await order.save();
  }
};