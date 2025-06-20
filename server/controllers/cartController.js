// server/controllers/cartController.js
import Cart from "../models/Cart.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }); // use req.user.id from JWT
    res.json(cart || { items: [] });
  } catch (err) {
    console.error("❌ Error getting cart:", err);
    res.status(500).json({ message: "Error getting cart" });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { items } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { items },
      { upsert: true, new: true }
    );
    res.json(cart);
  } catch (err) {
    console.error("❌ Error updating cart:", err);
    res.status(500).json({ message: "Error updating cart" });
  }
};
