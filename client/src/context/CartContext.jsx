import { createContext, useEffect, useState } from "react";
import axios from "axios";

const TOKEN_KEY = "token";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      console.warn("⚠️ No token found. Cannot fetch cart.");
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.items || []);
    } catch (err) {
      if (err.response?.status === 401) {
        console.warn("⛔ Unauthorized. Please log in again.");
      }
      console.error("❌ Failed to fetch cart:", err);
    }
  };

  const saveCart = async (items) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      console.warn("⚠️ No token found. Cannot save cart.");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/cart`,
        { items },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("❌ Failed to save cart:", err);
    }
  };

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === item.id);
      const updated = existing
        ? prevItems.map((i) => (i.id === item.id ? { ...i, ...item } : i))
        : [...prevItems, { ...item, subServices: item.subServices || [] }];

      saveCart(updated);
      return updated;
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveCart(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    saveCart([]);
  };

  const updateCartItem = (updatedItem) => {
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      );
      saveCart(updated);
      return updated;
    });
  };

  const updateItemSubServices = (itemId, subServices) => {
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.id === itemId ? { ...item, subServices } : item
      );
      saveCart(updated);
      return updated;
    });
  };

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItem,
        updateItemSubServices,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
