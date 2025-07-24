// middleware/authCallCentre.js
import jwt from "jsonwebtoken";
const SECRET = process.env.CALLCENTRE_SECRET || "callcentre_secret";

const authCallCentre = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, SECRET);
    req.callCentre = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid' });
  }
};

export default authCallCentre;
