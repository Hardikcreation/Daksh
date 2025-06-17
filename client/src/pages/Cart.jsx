import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FiTrash2,
  FiX,
  FiCheck,
  FiClock,
  FiMapPin,
  FiHome,
  FiCalendar,
} from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function formatDateYMD(date) {
  if (!date) return "";
  return date.toISOString().split("T")[0];
}
function formatTimeHM(date) {
  if (!date) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
const generateTimeSlots = (selectedDate) => {
  const slots = [];
  const today = new Date();
  const base = new Date(selectedDate);
  const isToday = base.toDateString() === today.toDateString();

  let startHour = 8;
  let endHour = 19;
  let now = new Date();
  if (isToday) {
    now.setMinutes(now.getMinutes() + 120);
    startHour = Math.max(startHour, now.getHours());
  }
  for (let hour = startHour; hour <= endHour; hour++) {
    [0, 30].forEach((minute) => {
      const slot = new Date(base);
      slot.setHours(hour, minute, 0, 0);
      if (!isToday || slot > now) {
        slots.push(slot);
      }
    });
  }
  return slots;
};

// Utility for displaying address, showing "Landmark" only if exists and valid
const getDisplayAddress = (addr) => {
  const hasLandmark =
    addr.landmark &&
    typeof addr.landmark === "string" &&
    addr.landmark.trim() !== "" &&
    addr.landmark.trim().toLowerCase() !== "resolved";
  return (
    <>
      {addr.houseNumber}, {addr.street}
      {hasLandmark && `, Landmark: ${addr.landmark}`}
      {addr.addressType ? `, ${addr.addressType}` : ""}
    </>
  );
};

export default function Cart() {
  const { cartItems, removeFromCart, clearCart, updateCartItem } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [addressType, setAddressType] = useState("Home");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [errors, setErrors] = useState({});
  const [productSubServices, setProductSubServices] = useState({});
  const [selectedSub, setSelectedSub] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const navigate = useNavigate();

  // For 3 date options: today, tomorrow, after tomorrow
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const afterTomorrow = new Date(today);
  afterTomorrow.setDate(today.getDate() + 2);
  const availableDates = [today, tomorrow, afterTomorrow];
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

  // Responsive mobile check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const subtotal = cartItems.reduce((acc, item) => {
    const subTotal = (Array.isArray(item.subServices) ? item.subServices : []).reduce(
      (subAcc, sub) => subAcc + Number(sub.price), 0
    );
    return acc + Number(item.price) + subTotal;
  }, 0);

  const handleAddSubService = (item) => {
    const allSubs = Array.isArray(productSubServices[item.id]) ? productSubServices[item.id] : [];
    const subToAdd = allSubs.find(sub => String(sub.title) === String(selectedSub[item.id]));
    if (!subToAdd) return;
    if ((Array.isArray(item.subServices) ? item.subServices : []).some(s => String(s.title) === String(subToAdd.title))) return;
    const updatedItem = {
      ...item,
      subServices: [...(Array.isArray(item.subServices) ? item.subServices : []), subToAdd]
    };
    updateCartItem(updatedItem);
    setSelectedSub(prev => ({ ...prev, [item.id]: "" }));
  };

  const handleRemoveSubService = (itemId, subServiceTitle) => {
    const item = cartItems.find(item => item.id === itemId);
    if (!item) return;
    const updatedSubServices = (Array.isArray(item.subServices) ? item.subServices : []).filter(sub => String(sub.title) !== String(subServiceTitle));
    updateCartItem({
      ...item,
      subServices: updatedSubServices
    });
  };

  useEffect(() => {
    if (showConfirmation) {
      fetchSavedAddresses();
    }
  }, [showConfirmation]);

  const fetchSavedAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/users/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedAddresses(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setSavedAddresses([]);
    }
  };

  useEffect(() => {
    if (selectedAddressIndex >= 0 && savedAddresses[selectedAddressIndex]) {
      const addr = savedAddresses[selectedAddressIndex];
      setHouseNumber(addr.houseNumber || "");
      setStreet(addr.street || "");
      setLandmark(addr.landmark || "");
      setAddressType(addr.addressType || "Home");
    }
    if (selectedAddressIndex === -1) {
      setHouseNumber("");
      setStreet("");
      setLandmark("");
      setAddressType("Home");
    }
  }, [selectedAddressIndex, savedAddresses]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await fetchAddressFromCoords(latitude, longitude);
      },
      () => {
        alert("Unable to retrieve your location. Permission denied or unavailable.");
      }
    );
  };

  const fetchAddressFromCoords = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();
      const address = data.address || {};
      setHouseNumber(address.house_number || "");
      setStreet(
        [
          address.road,
          address.neighbourhood,
          address.suburb,
          address.village,
          address.town,
          address.city,
        ]
          .filter(Boolean)
          .join(", ")
      );
      setLandmark(address.state_district || address.state || "");
      setAddressType("Home");
    } catch (e) {
      alert("Failed to get address from your location.");
    }
  };

  const handleEnterNewAddress = () => {
    setSelectedAddressIndex(-1);
    setHouseNumber("");
    setStreet("");
    setLandmark("");
    setAddressType("Home");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!houseNumber.trim())
      newErrors.houseNumber = "Flat/House No. is required";
    if (!street.trim()) newErrors.street = "Street/Colony is required";
    if (!selectedDate) newErrors.date = "Please select a date";
    if (!selectedTime) newErrors.time = "Please select a time";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const placeOrder = async () => {
    if (!validateForm()) return;
    setIsPlacingOrder(true);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not authenticated. Please log in.");
      navigate("/login");
      return;
    }
    const dateStr = formatDateYMD(selectedDate);
    const timeStr = formatTimeHM(selectedTime);
    const fullAddress = `${houseNumber}, ${street}${landmark ? `, Landmark: ${landmark}` : ""} (${addressType})`;
    const timeSlot = `${dateStr} at ${timeStr}`;
    try {
      await axios.post(
        `${BASE_URL}/api/orders/place`,
        {
          items: cartItems,
          totalAmount: subtotal,
          address: {
            fullAddress,
            timeSlot,
            houseNumber,
            street,
            landmark,
            addressType,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await axios.post(
        `${BASE_URL}/api/users/addresses`,
        { houseNumber, street, landmark, addressType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Order placed successfully!");
      clearCart();
      setShowConfirmation(false);
      navigate("/my-orders");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Something went wrong while placing your order.";
      alert(msg);
    } finally {
      setIsPlacingOrder(false);
    }
  };

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

  // Date picker: today to 3 months ahead
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const timeSlots = generateTimeSlots(selectedDate);

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
              const availableSubs = allSubs.filter(sub =>
                !subServices.some(s => String(s.title) === String(sub.title))
              );
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
                      {subServices.length > 0 && (
                        <div className="mt-2">
                          <div className="font-medium mb-1 text-sm text-gray-700">Sub-Services:</div>
                          <ul className="space-y-1">
                            {subServices.map(sub => (
                              <li
                                key={sub.title}
                                className="flex justify-between items-center pl-2 pr-2 py-0.5 text-xs sm:text-sm rounded bg-gray-50 text-gray-600"
                              >
                                <span>{sub.title}</span>
                                <span className="flex items-center gap-2">
                                  <span className="font-medium text-gray-700">{sub.price && `+₹${sub.price}`}</span>
                                  <button
                                    onClick={() => handleRemoveSubService(item.id, sub.title)}
                                    className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                                    title="Remove this sub-service"
                                  >
                                    <FiTrash2 size={14} />
                                  </button>
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {allSubs.length > 0 && (
                        <div className="my-2 sm:my-3">
                          <label className="font-medium mb-1 block text-sm text-gray-700">
                            Customize Your Service
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <select
                              value={selectedSub[item.id] || ""}
                              className="border border-gray-300 rounded px-2 py-1 w-full sm:w-auto bg-white text-gray-800 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors"
                              onChange={e =>
                                setSelectedSub(prev => ({ ...prev, [item.id]: e.target.value }))
                              }
                            >
                              <option value="">Select a sub-service</option>
                              {availableSubs.map(sub => (
                                <option key={sub.title} value={sub.title}>
                                  {sub.title} (+₹{sub.price})
                                </option>
                              ))}
                            </select>
                            <button
                              disabled={!selectedSub[item.id]}
                              onClick={() => handleAddSubService(item)}
                              className="px-3 py-1 rounded disabled:opacity-50 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                            >
                              Add
                            </button>
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

 {/* Order Confirmation Modal */}
{showConfirmation && (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center p-2 sm:p-4 transition-all duration-200">
    <div className={`bg-white/90 rounded-2xl shadow-[0_8px_40px_0_rgba(0,0,0,0.20)] border border-gray-200 w-full max-w-md overflow-y-auto
      ${isMobile ? "p-3 max-h-[80vh] glassmorphism" : "p-4 sm:p-8 max-h-[95vh]"}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
          <span className="bg-green-100 text-green-600 rounded-full p-1">
            <FiCheck size={22} />
          </span>
          Confirm Your Order
        </h2>
        <button
          onClick={() => setShowConfirmation(false)}
          className="text-gray-400 hover:text-gray-700 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label="Close"
        >
          <FiX size={28} />
        </button>
      </div>
      {/* Saved Addresses */}
      {savedAddresses.length > 0 && (
        <div className="mb-4">
          <label className="block font-medium mb-2 flex items-center gap-2 text-gray-700 text-base">
            <FiMapPin size={18} />
            <span>Select Saved Address</span>
          </label>
          <div className="space-y-2">
            {savedAddresses.map((addr, idx) => (
              <button
                key={idx}
                className={
                  "w-full border rounded-lg px-4 py-3 text-left font-medium shadow-sm transition-all " +
                  (selectedAddressIndex === idx
                    ? "border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-200"
                    : "border-gray-300 bg-gray-50 text-gray-700 hover:bg-blue-100/50 hover:border-blue-400 active:bg-blue-50")
                }
                style={{
                  fontSize: isMobile ? "1rem" : "",
                  minHeight: isMobile ? 48 : undefined
                }}
                onClick={() => setSelectedAddressIndex(idx)}
              >
                <span>{getDisplayAddress(addr)}</span>
              </button>
            ))}
            <button
              className={
                "w-full border rounded-lg px-4 py-3 text-left font-medium shadow-sm transition-all " +
                (selectedAddressIndex === -1
                  ? "border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-200"
                  : "border-gray-300 bg-gray-50 text-gray-700 hover:bg-blue-100/40 hover:border-blue-400 active:bg-blue-50")
              }
              style={{
                fontSize: isMobile ? "1rem" : "",
                minHeight: isMobile ? 48 : undefined
              }}
              onClick={handleEnterNewAddress}
            >
              <span className="flex items-center gap-2">
                <span className="text-blue-600 text-lg font-bold">+</span>
                Enter New Address
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Address Input only for new address */}
      {selectedAddressIndex === -1 && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="block font-medium flex items-center gap-1 text-base text-gray-700">
                <FiHome size={18} />
                Flat / House No.<span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center gap-2 text-xs sm:text-sm font-semibold shadow transition-all"
                onClick={handleUseMyLocation}
              >
                <span role="img" aria-label="Use location" className="text-lg">📍</span>
                Use My Location
              </button>
            </div>
            <input
              type="text"
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
              className={`w-full border rounded-lg p-2.5 text-base bg-white text-gray-800 placeholder-gray-400 shadow-sm transition-all ${errors.houseNumber ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"}`}
              disabled={selectedAddressIndex >= 0}
              placeholder="Enter flat/house number"
            />
            {errors.houseNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.houseNumber}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-2 flex items-center gap-1 text-base text-gray-700">
              <FiMapPin size={18} />
              Street / Colony<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className={`w-full border rounded-lg p-2.5 text-base bg-white text-gray-800 placeholder-gray-400 shadow-sm transition-all ${errors.street ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"}`}
              disabled={selectedAddressIndex >= 0}
              placeholder="Enter street or colony"
            />
            {errors.street && (
              <p className="text-red-500 text-xs mt-1">{errors.street}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-2 flex items-center gap-1 text-base text-gray-700">
              <FiMapPin size={18} />
              Landmark <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-base bg-white text-gray-800 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
              disabled={selectedAddressIndex >= 0}
              placeholder="Landmark"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 flex items-center gap-1 text-base text-gray-700">
              <FiHome size={18} />
              Address Type
            </label>
            <select
              value={addressType}
              onChange={(e) => setAddressType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-base bg-white text-gray-800 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 shadow-sm transition-all"
              disabled={selectedAddressIndex >= 0}
            >
              <option value="Home">Home</option>
              <option value="Office">Office</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      )}

      {/* Date Picker */}
     <div className="mt-3 sm:mt-6">
              <label className="block font-medium mb-1 flex items-center gap-1 text-sm text-gray-700">
                <FiCalendar size={16} />
                Select Date<span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {availableDates.map((date, idx) => {
                  const label =
                    idx === 0
                      ? "Today"
                      : idx === 1
                      ? "Tomorrow"
                      : "After Tomorrow";
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`flex flex-col items-center px-3 py-2 rounded-lg border text-xs sm:text-sm font-semibold transition-colors ${
                        selectedDate.toDateString() === date.toDateString()
                          ? "bg-blue-600 text-white border-blue-600 shadow"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                      }`}
                      onClick={() => {
                        setSelectedDate(new Date(date));
                        setSelectedTime(null); // reset time slot
                      }}
                    >
                      <span>{date.getDate()}</span>
                      <span className="text-[11px]">{label}</span>
                    </button>
                  );
                })}
              </div>
              {errors.date && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.date}</p>
              )}
            </div>

  <div className="mt-4">
  <label className="block font-medium mb-2 flex items-center gap-1 text-base text-gray-700">
    <FiClock size={18} />
    Select Time Slot<span className="text-red-500">*</span>
  </label>
  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
    {timeSlots.length === 0 ? (
      <span className="col-span-3 sm:col-span-4 text-gray-500 text-xs italic">
        No slots available, try another date.
      </span>
    ) : (
      timeSlots.map((slot, idx) => (
        <button
          key={idx}
          type="button"
          className={`flex flex-col items-center justify-center px-2 py-2 rounded-lg border text-xs sm:text-sm transition-colors min-h-[44px] ${
            selectedTime &&
            slot.getTime() === selectedTime.getTime()
              ? "bg-gray-400 text-white border-blue-600 font-bold shadow-md"
              : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
          }`}
          onClick={() => setSelectedTime(slot)}
        >
          <span className="font-semibold">{formatTimeHM(slot)}</span>
          <span className="text-[10px] text-gray-500">
            approx. 1 hour
          </span>
        </button>
      ))
    )}
  </div>
  {errors.time && (
    <p className="text-red-500 text-xs mt-1">{errors.time}</p>
  )}
</div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6">
        <button
          className="px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-base bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 transition-all"
          onClick={() => setShowConfirmation(false)}
          disabled={isPlacingOrder}
        >
          <FiX size={18} />
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-base bg-green-600 hover:bg-green-700 text-white shadow-md transition-all disabled:opacity-50"
          onClick={placeOrder}
          disabled={isPlacingOrder}
        >
          {isPlacingOrder ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Placing...
            </>
          ) : (
            <>
              <FiCheck size={18} />
              Confirm Order
            </>
          )}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}