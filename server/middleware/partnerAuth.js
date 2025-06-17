import jwt from "jsonwebtoken";
// ✅ Correct
import Partner from "../models/Partner.js";
import PartnerDocument from "../models/partnerDocument.js";

export const partnerAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const partner = await Partner.findById(decoded.id);

    if (!partner) return res.status(401).json({ message: "Invalid token" });

    req.user = partner; // <--- This is critical
    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default partnerAuth;