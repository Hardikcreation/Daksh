import User from "../models/User.js";

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id); // ✅ use req.user.id
    if (user && user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Access denied: Admins only." });
    }
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
