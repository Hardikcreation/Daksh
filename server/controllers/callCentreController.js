// 📁 server/controllers/callCentreController.js
import CallCentreStaff from '../models/CallCentreStaff.js';
import Ticket from '../models/Ticket.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const SECRET = 'callcentre_secret'; // Use ENV in production

export async function loginCallCentre(req, res) {
  const { email, password } = req.body;

  const staff = await CallCentreStaff.findOne({ email });
  if (!staff) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, staff.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: staff._id }, SECRET, { expiresIn: '1d' });
  res.json({ token });
}

export async function getAllQueries(req, res) {
  try {
    const queries = await Ticket.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch queries' });
  }
}

export async function updateQueryStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, solution } = req.body;
    await Ticket.findByIdAndUpdate(id, { status, solution });
    res.json({ message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
}
