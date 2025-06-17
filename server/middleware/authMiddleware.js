import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Partner from "../models/Partner.js";
import { config } from "../config/keys.js";
import { log } from 'console';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, config.jwtSecret );
      req.user = await User.findById(decoded.userId).select("-password");
      req.userId = decoded.userId || decoded.id; // ✅ Fixed here
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      } else {
        return res.status(401).json({ message: "Invalid token" });
      }
    }
  } else {
    return res.status(401).json({ message: "No token, not authorized" });
  }
};

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Partner.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// verify partner 
export const verifyPartnerAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log(token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ use correct secret
    console.log("Decoded:", decoded);
    const partner = await Partner.findById(decoded.id);
    if (!partner) {
      return res.status(401).json({ message: "Invalid token: partner not found" });
    }

    req.partner = partner;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;