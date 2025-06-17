import jwt from "jsonwebtoken";
import Partner from "../models/Partner.js";

export const protectPartner = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.partnerId = decoded.id; // 🔑 Required by getPartnerOrders
      req.partner = await Partner.findById(decoded.id);

      if (!req.partner) {
        console.log("❌ Partner not found for decoded ID");
        return res.status(401).json({ message: "Not authorized" });
      }

      next();
    } catch (error) {
      console.error("❌ Token verification failed:", error.message);
      return res.status(401).json({ message: "Token failed" });
    }
  } else {
    console.log("❌ No token provided in headers");
    return res.status(401).json({ message: "No token" });
  }
};


export const uploadDocAccess = async (req, res, next) => {
  try {
    const token = req.cookies.partner_token;
    if (!token) return res.status(401).json({ message: 'Not logged in' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const partner = await Partner.findById(decoded.id);

    if (!partner || !partner.isVerified) {
      return res.status(403).json({ message: 'Account not verified' });
    }

    // Allow upload page only before approval
    if (partner.isApproved) {
      return res.status(403).json({ message: 'You are already verified. Access not allowed here.' });
    }

    req.partner = partner;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Not authorized', error: err.message });
  }
};

export const authPartner = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const partner = await Partner.findById(decoded.id).select("-password");
    if (!partner) {
      return res.status(401).json({ message: "Partner not found" });
    }

    req.user = partner;
    next();
  } catch (err) {
    console.error("authPartner error:", err.message);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};