// 📁 server/routes/ticketRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { protectPartner } from "../middleware/authPartner.js";
import { createTicket, getMyTickets, getAllTickets, updateTicketStatus } from "../controllers/ticketController.js";

const router = express.Router();

router.post("/", protect, createTicket); // for users
router.post("/partner", protectPartner, createTicket); // for partners
router.get("/", protect, getMyTickets); // for users
router.get("/partner", protectPartner, getMyTickets); // for partners
router.get("/all", getAllTickets); // Optionally add call-centre/admin auth middleware
router.patch("/:id", updateTicketStatus); // Add this line

export default router;
