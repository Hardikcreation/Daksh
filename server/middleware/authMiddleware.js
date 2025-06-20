import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Partner from "../models/Partner.js";
import { config } from "../config/keys.js"; // ensure config.jwtSecret is set correctly

// 🔒 Middleware to protect user routes
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = await User.findById(decoded.userId).select("-password");
      req.userId = decoded.userId || decoded.id; // used in cartController
      return next();
    } catch (err) {
      const msg = err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
      return res.status(401).json({ message: msg });
    }
  }

  return res.status(401).json({ message: "No token, not authorized" });
};

// 🔒 Middleware to protect partner routes
export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Partner.findById(decoded.id).select("-password");
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

// 🔒 Middleware to verify partner during restricted access
export const verifyPartnerAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const partner = await Partner.findById(decoded.id);
    if (!partner) return res.status(401).json({ message: "Invalid token: partner not found" });

    req.partner = partner;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
