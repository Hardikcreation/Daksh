import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

const PAYMENT_METHODS = [
  { key: "razorpay", label: "Razorpay", icon: "/img/razorpay-icon.png" },
  { key: "gpay", label: "Google Pay", icon: "/img/gpay-icon.png" },
  { key: "phonepe", label: "PhonePe", icon: "/img/phonepe-icon.png" },
  { key: "post", label: "Post Service Payment", icon: "/img/cash-icon.png" },
  { key: "pre", label: "Pay pal", icon: "/img/prepay-icon.png" },
];

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.orderDetails;
  const { user } = useContext(AuthContext);
  const { clearCart } = useContext(CartContext);

  const [selectedMethod, setSelectedMethod] = useState("razorpay");

  useEffect(() => {
    if (!orderDetails) navigate("/cart");
  }, [orderDetails, navigate]);

  const handlePayment = async () => {
    if (selectedMethod === "razorpay") {
      // 1. Create Razorpay order on backend (optional, for signature verification)
      const { data: razorpayOrder } = await axios.post("http://localhost:8080/api/payment/create-order", {
        amount: orderDetails.total * 100, // in paise
      });

      // 2. Open Razorpay checkout
      const options = {
        key: "rzp_test_XXXXXXXXXXXXXX", // <-- your real Razorpay key_id
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Your App Name",
        description: "Service Payment",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          // 3. On payment success, create order in backend
          await axios.post("/api/orders/place", {
            ...orderDetails,
            paymentId: response.razorpay_payment_id,
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });
          clearCart(); // <-- clear the cart here
          navigate("/my-orders");
        },
        prefill: {
          name: orderDetails.userName,
          email: orderDetails.userEmail,
          contact: orderDetails.userPhone,
        },
        theme: { color: "#3399cc" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else if (selectedMethod === "gpay" || selectedMethod === "phonepe") {
      alert("Show UPI QR or intent for " + selectedMethod);
      // Implement UPI intent/QR logic here
    } else if (selectedMethod === "post") {
      // Place order with paymentType: "post"
      await axios.post("/api/orders/place", {
        items: orderDetails.items,
        totalAmount: orderDetails.total, // <-- ensure this is present and a number
        address: orderDetails.address,
        paymentType: "post",
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      clearCart(); // <-- clear the cart here
      navigate("/my-orders");
    } else if (selectedMethod === "pre") {
      // You can use Razorpay or another online method for pre-service payment
      // 1. Create Razorpay order on backend (optional, for signature verification)
      const { data: razorpayOrder } = await axios.post("http://localhost:8080/api/payment/create-order", {
        amount: orderDetails.total * 100, // in paise
      });

      // 2. Open Razorpay checkout
      const options = {
        key: "rzp_test_XXXXXXXXXXXXXX", // <-- your real Razorpay key_id
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Your App Name",
        description: "Service Payment",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          // 3. On payment success, create order in backend
          await axios.post("/api/orders/place", {
            ...orderDetails,
            paymentId: response.razorpay_payment_id,
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });
          clearCart(); // <-- clear the cart here
          navigate("/my-orders");
        },
        prefill: {
          name: orderDetails.userName,
          email: orderDetails.userEmail,
          contact: orderDetails.userPhone,
        },
        theme: { color: "#3399cc" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Complete Your Payment</h2>
        {/* Order Details Summary */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-2">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a8 8 0 11-16 0 8 8 0 0116 0z" /></svg>
            Order Summary
          </div>
          {/* User Info */}
          <div className="flex flex-col gap-1 mb-2 bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span>{orderDetails?.userName || 'User'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V8a4 4 0 00-8 0v4m8 0v4a4 4 0 01-8 0v-4" /></svg>
              <span>{orderDetails?.userEmail || 'Email not provided'}</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="mb-2">
              <span className="font-medium text-gray-700">Services:</span>
              <ul className="list-disc ml-6 mt-1 text-gray-800 text-sm">
                {orderDetails?.items?.map((item, idx) => (
                  <li key={idx} className="mb-1">
                    <span className="font-semibold">{item.title}</span>
                    {Array.isArray(item.subServices) && item.subServices.length > 0 && (
                      <ul className="list-disc ml-5 text-gray-600 text-xs mt-1">
                        {item.subServices.map((sub, subIdx) => (
                          <li key={subIdx}>
                            {sub.name || sub.title} <span className="text-green-600 font-semibold">₹{sub.price}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-3-3h-4a3 3 0 00-3 3v2h5z" /></svg>
              <span className="font-medium text-gray-700">Address:</span>
              <span className="text-gray-600 text-sm">{orderDetails?.address?.fullAddress}</span>
            </div>
            <div className="mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m-7 4h4m-9 4h14" /></svg>
              <span className="font-medium text-gray-700">Time Slot:</span>
              <span className="text-gray-600 text-sm">{orderDetails?.address?.timeSlot}</span>
            </div>
            {/* Discount row if present */}
            {orderDetails?.discount && orderDetails.discount > 0 && (
              <div className="flex justify-between items-center mt-2 mb-2 text-green-700 font-semibold bg-green-50 rounded px-2 py-1">
                <span>Discount</span>
                <span>-₹{orderDetails.discount}</span>
              </div>
            )}
            <div className="flex justify-between items-center mt-4 border-t pt-3">
              <span className="font-semibold text-lg">Total Amount:</span>
              <span className="font-bold text-2xl text-green-600">
                ₹{orderDetails?.total ? Number(orderDetails.total).toFixed(2) : "0.00"}
              </span>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="font-semibold mb-2">Choose Payment Method:</div>
          <div className="flex flex-wrap gap-3 mb-4">
            {PAYMENT_METHODS.map(method => (
              <button
                key={method.key}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  selectedMethod === method.key
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
                onClick={() => setSelectedMethod(method.key)}
                type="button"
              >
                {method.icon && <img src={method.icon} alt={method.label} className="w-6 h-6" />}
                {method.label}
              </button>
            ))}
          </div>
        </div>
        <button
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all"
          onClick={handlePayment}
        >
          {selectedMethod === "post"
            ? "Confirm Post Service Payment"
            : selectedMethod === "pre"
            ? "Pay Now (Pre Service)"
            : selectedMethod === "razorpay"
            ? "Pay with Razorpay"
            : selectedMethod === "gpay"
            ? "Pay with Google Pay"
            : selectedMethod === "phonepe"
            ? "Pay with PhonePe"
            : "Pay Now"}
        </button>
      </div>
    </div>
  );
}
