import { createContext, useEffect, useState } from "react";
import axios from "axios";

const TOKEN_KEY = "token";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("❌ Failed to fetch cart:", err);
    }
  };

  const saveCart = async (items) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
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
      const existingItem = prevItems.find((i) => i.id === item.id);
      let updatedItems;
      if (existingItem) {
        updatedItems = prevItems.map((i) =>
          i.id === item.id ? { ...i, ...item } : i
        );
      } else {
        updatedItems = [
          ...prevItems,
          {
            ...item,
            subServices: item.subServices || [],
          },
        ];
      }
      saveCart(updatedItems);
      return updatedItems;
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => {
      const updated = prevItems.filter((item) => item.id !== id);
      saveCart(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    saveCart([]);
  };

  const updateCartItem = (updatedItem) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      );
      saveCart(updatedItems);
      return updatedItems;
    });
  };

  const updateItemSubServices = (itemId, subServices) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === itemId ? { ...item, subServices } : item
      );
      saveCart(updatedItems);
      return updatedItems;
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
