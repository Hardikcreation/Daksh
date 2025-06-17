import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Partner from "../models/Partner.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [products, users, orders, partners] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
      Partner.countDocuments()
    ]);

    res.json({
      products,
      users,
      orders,
      partners,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
