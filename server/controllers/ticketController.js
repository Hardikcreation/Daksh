// other imports...
import Ticket from '../models/Ticket.js';
import User from "../models/User.js";
import Partner from "../models/Partner.js";

// Create ticket (for user or partner)
export const createTicket = async (req, res) => {
  try {
    const { subject, message, issueType, orderId, name, phone } = req.body;
    let userType, userId, email;

    if (req.user) {
      userType = "User";
      userId = req.user._id;
      email = req.user.email;
    } else if (req.partner) {
      userType = "Partner";
      userId = req.partner._id;
      email = req.partner.email;
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const ticket = new Ticket({
      userId,
      userType,
      name,
      email,
      phone,
      subject,
      message,
      issueType,
      orderId: orderId || null,
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Failed to create ticket" });
  }
};

// Get tickets for current user/partner
export const getMyTickets = async (req, res) => {
  try {
    let userType, userId;
    if (req.user) {
      userType = "User";
      userId = req.user._id;
    } else if (req.partner) {
      userType = "Partner";
      userId = req.partner._id;
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const tickets = await Ticket.find({ userId, userType }).populate("orderId");
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

// Get all tickets (for call-centre/admin)
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};

export const getTicketById = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Not found' });
  res.json(ticket);
};

export const updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status, solution } = req.body;

  try {
    await Ticket.findByIdAndUpdate(id, { status, solution });
    res.json({ message: "Ticket updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update ticket" });
  }
};

export const deleteTicket = async (req, res) => {
  await Ticket.findByIdAndDelete(req.params.id);
  res.json({ message: 'Ticket deleted' });
};

// ✅ Updated version to support userType as query param
export const getTicketsByUser = async (req, res) => {
  const { userId } = req.params;
  const { userType } = req.query;

  if (!userType) {
    return res.status(400).json({ error: "userType query is required" });
  }

  try {
    const tickets = await Ticket.find({ userId, userType }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user tickets" });
  }
};
