import { useEffect, useState } from "react";
import axios from "axios";
import { useMediaQuery } from "react-responsive";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AVAILABLE_TIME_SLOTS = [
  "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
  "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM",
  "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM",
  "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"
];

const CANCEL_TIME_LIMIT = 240; // seconds (4 minutes)

function slotToDateObject(slot) {
  const [time, meridiem] = slot.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
}

function getTimeLeft(createdAt, now) {
  const created = new Date(createdAt).getTime();
  const diff = Math.max(0, 240000 - (now - created));
  const seconds = Math.floor(diff / 1000);
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  return { min, sec, isOver: diff <= 0 };
}

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [now, setNow] = useState(Date.now());

  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Time slot filtering: Only show slots 2+ hours ahead from now
  const nowDate = new Date(now);
  const minTime = new Date(nowDate.getTime() + 2 * 60 * 60 * 1000);
  const validTimeSlots = AVAILABLE_TIME_SLOTS.filter(slot => slotToDateObject(slot) > minTime);

  const userId = localStorage.getItem("userId");

  const CANCEL_LIMIT = 3; // example limit

  const getUserCancelCount = () => {
    return parseInt(localStorage.getItem(`cancelCount_${userId}`) || "0", 10);
  };
  const setUserCancelCount = (count) => {
    localStorage.setItem(`cancelCount_${userId}`, count);
  };

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sorted = Array.isArray(response.data)
        ? [...response.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];
      setOrders(sorted);
    } catch (err) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const canShowCancelBtn = (order, index) => {
    let cancelCount = getUserCancelCount();

    if (cancelCount >= CANCEL_LIMIT) return false;
    if (index >= CANCEL_LIMIT) return false;
    if (order.status === "Cancelled" || order.status === "Completed") return false;

    const { isOver } = getTimeLeft(order.createdAt, now);
    return !isOver;
  };

  const cancelOrder = async (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchOrders();
      // Optionally update cancel count
      setUserCancelCount(getUserCancelCount() + 1);
    } catch (err) {
      alert("Failed to cancel order");
    }
  };

  const handleOpenTimeSlotEditor = (order) => {
    setEditingOrderId(order._id);
    setSelectedTimeSlot(order.address?.timeSlot || "");
  };

  const handleTimeSlotChange = (e) => {
    setSelectedTimeSlot(e.target.value);
  };

  const handleSaveTimeSlot = async (order) => {
    if (!selectedTimeSlot || selectedTimeSlot === order.address?.timeSlot) {
      setEditingOrderId(null);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/api/orders/${order._id}/change-timeslot`,
        { timeSlot: selectedTimeSlot },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingOrderId(null);
      fetchOrders();
    } catch (err) {
      alert("Failed to update time slot.");
    }
  };

  const handleCancelEdit = () => {
    setEditingOrderId(null);
  };

  // UI classes
  const mobileCard = isMobile
    ? "bg-white border-gray-200 text-black shadow-lg px-2 py-4 rounded-2xl"
    : "bg-white border-gray-100";
  const mobileButton = isMobile
    ? "bg-blue-700 hover:bg-blue-800 text-white"
    : "bg-indigo-600 hover:bg-indigo-700 text-white";
  const mobileCancelBtn = isMobile
    ? "bg-red-600 hover:bg-red-700 text-white"
    : "bg-red-600 hover:bg-red-700 text-white";
  const mobileSection = isMobile
    ? "bg-gray-50 border-gray-200 text-black"
    : "bg-gray-50 border-gray-200";

  const getSubservicesTotal = (subServices) =>
    Array.isArray(subServices)
      ? subServices.reduce((sum, sub) => sum + (Number(sub.price) || 0), 0)
      : 0;

  return (
    <div className={`max-w-7xl mx-auto px-2 sm:px-6 py-4 sm:py-8 ${isMobile ? "bg-white min-h-screen text-black" : ""}`}>
      <div className="flex items-center mb-4 sm:mb-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 ${isMobile ? "text-blue-700" : "text-indigo-600"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${isMobile ? "text-black" : "text-gray-800"}`}>My Orders</h1>
      </div>

      {loading ? (
        <div className="space-y-4 sm:space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`p-4 sm:p-6 rounded-xl shadow-lg border bg-white animate-pulse`}>
              <div className="flex justify-between">
                <div className="h-5 sm:h-6 bg-gray-300 rounded w-1/3 sm:w-1/4"></div>
                <div className="h-5 sm:h-6 bg-gray-300 rounded w-1/4 sm:w-1/6"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-4 sm:mt-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
                <div className="h-48 sm:h-64 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className={`p-6 sm:p-8 lg:p-10 rounded-xl shadow-lg text-center max-w-md mx-auto bg-white`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v16a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-4 sm:mt-5 text-base sm:text-lg font-medium text-black">No orders yet</h3>
          <p className="mt-1 sm:mt-2 text-sm text-gray-500">You haven't placed any orders yet.</p>
          <button
            onClick={() => (window.location.href = "/products")}
            className={`mt-4 sm:mt-6 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg ${mobileButton} transition-colors shadow-sm text-sm sm:text-base`}
          >
            Browse Services
          </button>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {orders.map((order, index) => (
            <div
              key={order._id}
              className={`p-4 sm:p-5 lg:p-6 rounded-xl ${mobileCard} shadow-lg border`}
            >
              {/* --- Order Status, Time Slot Selection, and Codes --- */}
              {(() => {
                const created = new Date(order.createdAt).getTime();
                const tenMinutes = 10 * 60 * 1000;
                const processExpired = now - created > tenMinutes;

                if ((order.requestStatus === "Pending" || order.status === "processing") && !processExpired) {
                  return (
                    <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-800">
                      <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                      </svg>
                      <span>
                        Looking for a provider... <b>Your order is being processed.</b>
                      </span>
                    </div>
                  );
                }

                if ((order.requestStatus === "Pending" || order.status === "processing") && processExpired) {
                  return null;
                }

                if (order.assignedPartner && order.requestStatus === "Pending" && !processExpired) {
                  return (
                    <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-300 bg-blue-50 text-blue-800">
                      <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                      </svg>
                      <span>
                        Your request has been sent to <b>{order.assignedPartner.name}</b>. If they accept, your order will be confirmed.
                      </span>
                    </div>
                  );
                }

                if (order.requestStatus === "Accepted" && order.assignedPartner) {
                  return (
                    <div className="mb-4 flex flex-col gap-2 px-3 py-2 rounded-lg border border-green-300 bg-green-50 text-green-800">
                      <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>
                          Provider <b>{order.assignedPartner.name}</b> accepted your request. <b>Confirmed!</b>
                        </span>
                      </div>
                      <div className="pl-7 text-sm">
                        <div>
                          <span className="font-bold">Email:</span>{" "}
                          <a href={`mailto:${order.assignedPartner.email}`} className="underline text-blue-700">
                            {order.assignedPartner.email}
                          </a>
                        </div>
                        {order.assignedPartner.phone && (
                          <div>
                            <span className="font-bold">Phone:</span>{" "}
                            <a href={`tel:${order.assignedPartner.phone}`} className="underline text-blue-700">
                              {order.assignedPartner.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                if (order.requestStatus === "Declined") {
                  return (
                    <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg border border-red-300 bg-red-50 text-red-700">
                      <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>
                        Provider declined your request.
                      </span>
                    </div>
                  );
                }

                if (order.requestStatus === "NoPartner" || order.requestStatus === "No service provider is available") {
                  // Show slot select if editing, else show current slot and "Change" button
                  return (
                    <div className={`mb-4`}>
                      <div className={`p-3 rounded-lg border ${isMobile ? "bg-red-100 text-red-700 border-red-300" : "bg-red-50 text-red-600 border-red-200"}`}>
                        ⚠️ No provider was available in your selected time slot. Please choose a different time slot below.
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2">
                        {editingOrderId === order._id ? (
                          <>
                            <select
                              value={selectedTimeSlot}
                              onChange={handleTimeSlotChange}
                              className={`border rounded px-2 py-1 text-sm w-full sm:w-auto ${mobileSection} border-gray-300`}
                            >
                              <option value="">Select a time slot</option>
                              {validTimeSlots.map((slot) => (
                                <option key={slot} value={slot}>{slot}</option>
                              ))}
                            </select>
                            <div className="flex gap-2 w-full sm:w-auto">
                              <button
                                className={`flex-1 sm:flex-none px-3 py-1 rounded bg-green-700 text-white hover:bg-green-800 text-xs`}
                                onClick={() => handleSaveTimeSlot(order)}
                              >
                                Save
                              </button>
                              <button
                                className={`flex-1 sm:flex-none px-3 py-1 rounded bg-gray-400 text-gray-100 hover:bg-gray-500 text-xs`}
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <span>{order.address?.timeSlot}</span>
                            <button
                              className={`self-start px-2 py-1 rounded bg-yellow-700 text-white hover:bg-yellow-800 text-xs`}
                              onClick={() => handleOpenTimeSlotEditor(order)}
                            >
                              Change
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Happy/Complete Codes */}
              <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="p-3 rounded-lg border font-mono bg-green-50 border-green-200 text-green-700">
                  <span className="block text-xs mb-1 font-medium">Happy Code (Share with Partner to begin):</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base sm:text-lg">{order.happyCode || "----"}</span>
                    <button className="text-green-700 p-1" onClick={() => navigator.clipboard?.writeText(order.happyCode || "")}>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-3 rounded-lg border font-mono bg-blue-50 border-blue-200 text-blue-700">
                  <span className="block text-xs mb-1 font-medium">Complete Code (Share to mark finished):</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base sm:text-lg">{order.completeCode || "----"}</span>
                    <button className="text-blue-700 p-1" onClick={() => navigator.clipboard?.writeText(order.completeCode || "")}>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Address and Items */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                <div className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border ${mobileSection}`}>
                  <h3 className="text-base sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-6 sm:w-6 mr-2 text-blue-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Delivery Address
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm sm:w-28 text-blue-700">🏠 House No:</span>
                      <span className="text-sm font-medium">{order.address?.houseNumber}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm sm:w-28 text-blue-700">🛣️ Street:</span>
                      <span className="text-sm font-medium break-words">{order.address?.street}</span>
                    </div>
                    {order.address?.landmark && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                        <span className="text-xs sm:text-sm sm:w-28 text-blue-700">📍 Landmark:</span>
                        <span className="text-sm font-medium">{order.address.landmark}</span>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm sm:w-28 text-blue-700">🏷️ Type:</span>
                      <span className="text-sm font-medium">{order.address?.addressType}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm sm:w-28 text-blue-700">⏰ Time Slot:</span>
                      <div className="text-sm font-medium">{order.address?.timeSlot}</div>
                    </div>
                  </div>
                </div>
                <div className={`rounded-lg sm:rounded-xl bg-white p-3 sm:p-4 flex flex-col gap-3`}>
                  <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3 flex items-center text-blue-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Order Items
                  </h3>
                  <div className="flex flex-col gap-3 sm:gap-4">
                    {(Array.isArray(order.items) ? order.items : []).map((item, idx) => {
                      const subTotal = getSubservicesTotal(item.subServices);
                      const totalPrice = (Number(item.price) || 0) + subTotal;

                      return (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5 border rounded-lg p-3 sm:p-4 bg-gray-50 border-gray-200"
                        >
                          <img
                            src={item.imageUrl ? `${BASE_URL}/uploads/${item.imageUrl}` : "https://via.placeholder.com/128x128?text=Service"}
                            className="w-full h-32 sm:w-32 sm:h-32 object-cover rounded-lg border shadow"
                            alt={item.title}
                            onError={e => {
                              e.target.src = "https://via.placeholder.com/128x128?text=Service";
                            }}
                          />
                          <div className="flex flex-col flex-1 justify-between">
                            <div>
                              <h4 className="text-base sm:text-lg font-bold mb-1 text-black">{item.title}</h4>
                              {Array.isArray(item.subServices) && item.subServices.length > 0 && (
                                <ul className="mb-2 mt-1 text-sm sm:text-base space-y-1 text-blue-700">
                                  {item.subServices.map((sub, subIdx) => (
                                    <li key={subIdx} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                                      <span className="flex-1 pr-2">{sub.title}</span>
                                      <span className="font-semibold">{sub.price && `₹${sub.price}`}</span>
                                    </li>
                                  ))}
                                  <li className="flex justify-between items-center pt-2 mt-2 border-t border-blue-300">
                                    <span className="font-semibold text-xs sm:text-sm text-blue-700">Subservices Total</span>
                                    <span className="font-bold text-xs sm:text-base text-blue-700">₹{subTotal}</span>
                                  </li>
                                </ul>
                              )}
                            </div>
                            <div className="flex flex-col gap-1 pt-2">
                              <div className="flex justify-between items-end">
                                <span className="text-xs font-medium mb-0.5 text-blue-700">
                                  Visiting Price
                                </span>
                                <span className="font-bold text-lg text-blue-700">₹{item.price}</span>
                              </div>
                              {subTotal > 0 && (
                                <div className="flex justify-between items-end">
                                  <span className="text-xs font-semibold text-blue-900">Total (Visiting + Subservices)</span>
                                  <span className="font-bold text-lg text-blue-900">₹{totalPrice}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Cancel Button with timer */}
              {canShowCancelBtn(order, index) && (() => {
                const { min, sec } = getTimeLeft(order.createdAt, now);
                return (
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100 flex justify-center sm:justify-end">
                    <button
                      onClick={() => cancelOrder(order._id)}
                      className={`w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-lg ${mobileCancelBtn} text-sm font-medium transition-colors flex items-center justify-center`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel ({min}:{sec})
                    </button>
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}