import jwt from "jsonwebtoken";
import { Admin } from "../models/adminModel.js";

export const adminProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // console.log("Raw Admin Token:", req.headers.authorization);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await Admin.findById(decoded.adminId).select("-password");

      if (!admin) {
        return res.status(401).json({ message: "Admin not found" });
      }

      req.admin = admin; // ✅ You now have req.admin
      next();
    } catch (err) {
      console.error("Admin token error:", err);
      res.status(401).json({ message: "Invalid admin token" });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};
