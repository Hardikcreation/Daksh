import PartnerSupport from "../models/PartnerSupport.js";

export const handlePartnerSupport = async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message are required." });
    }

    // req.partnerId is set by protectPartner middleware
    const ticket = new PartnerSupport({
      partner: req.partnerId,
      subject,
      message,
    });

    await ticket.save();
    res.status(201).json({ message: "Support query submitted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit support query.", error: err.message });
  }
};