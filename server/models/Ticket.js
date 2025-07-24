// 📁 server/models/Ticket.js
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, refPath: "userType" },
  userType: { type: String, enum: ["User", "Partner"], required: true },
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  issueType: String,
  status: { type: String, enum: ["open", "solved"], default: "open" },
  solution: String,
  createdAt: { type: Date, default: Date.now },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
});

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
