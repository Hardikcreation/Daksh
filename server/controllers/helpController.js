// controllers/helpController.js
import HelpRequest from '../models/HelpRequest.js';

export const submitHelpRequest = async (req, res) => {
  try {
    const { name, email, phone, issueType, message } = req.body;

    const newRequest = new HelpRequest({
      name,
      email,
      phone,
      issueType,
      message,
    });

    await newRequest.save();

    res.status(201).json({ message: 'Help request submitted successfully.' });
  } catch (err) {
    console.error("❌ Help form submission error:", err);
    res.status(500).json({ message: 'Failed to submit help request.' });
  }
};
