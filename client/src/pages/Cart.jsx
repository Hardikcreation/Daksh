import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiCheck, FiX } from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Cart() {
  const { cartItems, removeFromCart, clearCart, updateCartItem } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [productSubServices, setProductSubServices] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  // Fetch subservices for each product in cart
  useEffect(() => {
    async function fetchSubServices() {
      const result = {};
      for (const item of cartItems) {
        try {
          const res = await axios.get(`${BASE_URL}/api/products/${item.id}`);
          result[item.id] = Array.isArray(res.data?.subServices) ? res.data.subServices : [];
        } catch {
          result[item.id] = [];
        }
      }
      setProductSubServices(result);
    }
    if (cartItems.length > 0) fetchSubServices();
  }, [cartItems]);

  // Calculate subtotal
  const subtotal = cartItems.reduce((acc, item) => {
    const subTotal = (Array.isArray(item.subServices) ? item.subServices : []).reduce(
      (subAcc, sub) => subAcc + Number(sub.price), 0
    );
    return acc + Number(item.price) + subTotal;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 sm:p-6 text-center bg-gray-50 text-gray-800">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-100 p-6 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-6">
            <FiX className="text-gray-500 text-3xl sm:text-4xl" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Your Cart is Empty
          </h2>
          <p className="mb-6 text-gray-600">
            Looks like you haven't added any services yet.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg text-base sm:text-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 px-2 sm:py-8 sm:px-4 bg-gray-50 text-gray-800">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Cart</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cartItems.map((item, idx) => {
              const subServices = Array.isArray(item.subServices) ? item.subServices : [];
              const allSubs = Array.isArray(productSubServices[item.id]) ? productSubServices[item.id] : [];
              const subTotal = subServices.reduce((acc, sub) => acc + Number(sub.price), 0);
              const mainPrice = Number(item.price);
              const itemTotal = mainPrice + subTotal;

              return (
                <div
                  key={item.id || idx}
                  className="p-3 sm:p-5 rounded-xl shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <img
                      src={item.imageUrl
                        ? `${BASE_URL}/uploads/${item.imageUrl}`
                        : (Array.isArray(item.images) && item.images[0]
                          ? `${BASE_URL}/uploads/${item.images[0]}`
                          : "/default-service.png")
                      }
                      alt={item.title}
                      className="w-full sm:w-24 h-24 object-cover rounded-lg mb-4 sm:mb-0"
                    />
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                          {item.title || item.name}
                        </h2>
                        <p className="text-green-600 font-bold text-base sm:text-lg">₹{itemTotal}</p>
                      </div>
                      <p className="text-xs sm:text-sm mt-1 text-gray-600">Base Price: ₹{mainPrice}</p>
                      {/* Selected Subservices */}
                      {subServices.length > 0 && (
                        <div>
                          <ul className="space-y-1">
                            {subServices.map(sub => (
                              <li
                                key={sub._id || sub.title}
                                className="flex justify-between items-center pl-2 pr-2 py-0.5 text-xs sm:text-sm rounded bg-gray-50 text-gray-600"
                              >
                                <span>{sub.title}</span>
                                <span className="text-green-600 font-bold">{sub.price && `+₹${sub.price}`}</span>
                                <button
                                  onClick={() => {
                                    const updatedItem = {
                                      ...item,
                                      subServices: subServices.filter(
                                        s => (s._id || s.title) !== (sub._id || sub.title)
                                      ),
                                    };
                                    updateCartItem(updatedItem);
                                  }}
                                  className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                                  title="Remove this sub-service"
                                >
                                  <FiTrash2 size={14} />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Available Subservices as Cards */}
                      {allSubs.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3">Available Sub-services</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {allSubs.map(sub => {
                              const subKey = sub._id || sub.title;
                              const isSelected = subServices.some(
                                s => (s._id || s.title) === subKey
                              );
                              return (
                                <div
                                  key={subKey}
                                  className={`bg-white border rounded-xl shadow-sm flex flex-col items-center p-2 cursor-pointer transition-all duration-200 ${
                                    isSelected
                                      ? 'border-blue-500 ring-2 ring-blue-200'
                                      : 'border-gray-200 hover:border-blue-400'
                                  }`}
                                  style={{ minWidth: 120 }}
                                  onClick={() => {
                                    if (isSelected) {
                                      const updatedItem = {
                                        ...item,
                                        subServices: (item.subServices || []).filter(
                                          s => (s._id || s.title) !== subKey
                                        ),
                                      };
                                      updateCartItem(updatedItem);
                                    } else {
                                      const updatedItem = {
                                        ...item,
                                        subServices: [
                                          ...(Array.isArray(item.subServices) ? item.subServices : []),
                                          sub,
                                        ],
                                      };
                                      updateCartItem(updatedItem);
                                    }
                                  }}
                                >
                                  <img
                                    src={`${BASE_URL}/uploads/${sub.image}`}
                                    alt={sub.title}
                                    className="w-24 h-16 object-cover rounded mb-2"
                                    onError={e => { e.target.style.display = 'none'; }}
                                  />
                                  <div className="flex justify-between items-center w-full px-1">
                                    <span className="text-sm font-medium text-gray-800">{sub.title}</span>
                                    <span className="text-green-600 font-bold text-sm">₹{sub.price}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1.5 self-end sm:self-center transition-colors duration-200 mt-2 sm:mt-0 bg-red-50 hover:bg-red-100 text-red-600"
                    >
                      <FiTrash2 size={16} />
                      <span className="text-xs sm:text-sm">Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 bg-white sticky top-6">
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 pb-2 border-b text-gray-900 border-gray-200">
                Order Summary
              </h3>
              {(() => {
                const taxRate = 0.18;
                const taxAmount = subtotal * taxRate;
                const total = subtotal + taxAmount;
                return (
                  <>
                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span className="text-sm">Subtotal</span>
                        <span className="text-sm">₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span className="text-sm">Tax (18%)</span>
                        <span className="text-sm">₹{taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-2 sm:pt-3 border-t border-gray-200">
                        <span className="font-medium text-sm">Total</span>
                        <span className="font-bold text-base sm:text-lg text-green-700">
                          ₹{total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <button
                        onClick={() => {
                          if (!isAuthenticated) {
                            alert("Please login to proceed with checkout.");
                            navigate("/login");
                            return;
                          }
                          setShowConfirmation(true);
                        }}
                        className="w-full px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 shadow-md hover:shadow-lg text-base sm:text-lg bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <FiCheck size={18} />
                        Proceed to Checkout
                      </button>
                      <button
                        onClick={clearCart}
                        className="w-full px-4 py-2.5 rounded-lg border flex items-center justify-center gap-1.5 transition-colors duration-200 text-sm sm:text-base text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 bg-white hover:bg-red-50"
                      >
                        <FiTrash2 size={16} />
                        Clear Cart
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}