// import { useContext, useState } from "react";
// import { CartContext } from "../context/CartContext";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function Checkout() {
//   const { cartItems, clearCart } = useContext(CartContext);
//   const navigate = useNavigate();

//   const [houseNumber, setHouseNumber] = useState("");
//   const [street, setStreet] = useState("");
//   const [landmark, setLandmark] = useState("");
//   const [addressType, setAddressType] = useState("Home");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");
//   const [errors, setErrors] = useState({});

//   const total = cartItems.reduce((sum, item) => sum + item.price, 0);

//   const validateForm = () => {
//     const newErrors = {};
//     if (!houseNumber.trim()) newErrors.houseNumber = "House/Flat No. is required";
//     if (!street.trim()) newErrors.street = "Street/Colony is required";
//     if (!selectedDate) newErrors.date = "Please select a date";
//     if (!selectedTime) newErrors.time = "Please select a time";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const getNextThreeDates = () => {
//     const today = new Date();
//     const dates = [];
//     for (let i = 1; i <= 3; i++) {
//       const future = new Date(today);
//       future.setDate(today.getDate() + i);
//       dates.push(future.toISOString().split("T")[0]); // Format: YYYY-MM-DD
//     }
//     return dates;
//   };

//   const timeSlots = [
//     "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
//     "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM",
//     "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM",
//     "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"
//   ];

//   const handlePayNow = async () => {
//     if (!validateForm()) return;

//     const fullAddress = {
//       houseNumber,
//       street,
//       landmark,
//       addressType,
//       fullAddress: `${houseNumber}, ${street}${landmark ? `, Landmark: ${landmark}` : ""} (${addressType})`,
//       timeSlot: `${selectedDate} at ${selectedTime}`,
//     };

//     try {
//       await axios.post(
//         "http://82.29.165.206:7000/api/orders/place",
//         {
//           items: cartItems,
//           totalAmount: total,
//           address: fullAddress,
//           timeSlot: fullAddress.timeSlot,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       clearCart();
//       alert("✅ Order placed successfully!");
//       navigate("/my-orders");
//     } catch (err) {
//       console.error("❌ Order failed:", err);
//       alert("Failed to place order.");
//     }
//   };

//   const availableDates = getNextThreeDates();

//   return (
//     <div className="max-w-xl mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Confirm Your Order</h2>

//       <ul className="mb-4 space-y-2">
//         {cartItems.map((item) => (
//           <li key={item._id} className="border p-2 rounded shadow">
//             <p className="font-medium">{item.title}</p>
//             <p>₹{item.price}</p>
//           </li>
//         ))}
//       </ul>

//       <p className="font-semibold text-lg mb-4">Total: ₹{total}</p>

//       {/* Address Fields */}
//       <div className="space-y-4 mb-6">
//         <div>
//           <label className="block font-semibold mb-1">House / Flat Number<span className="text-red-500">*</span></label>
//           <input
//             className="w-full p-2 border rounded"
//             value={houseNumber}
//             onChange={(e) => setHouseNumber(e.target.value)}
//           />
//           {errors.houseNumber && <p className="text-red-500 text-sm">{errors.houseNumber}</p>}
//         </div>

//         <div>
//           <label className="block font-semibold mb-1">Street or Colony<span className="text-red-500">*</span></label>
//           <input
//             className="w-full p-2 border rounded"
//             value={street}
//             onChange={(e) => setStreet(e.target.value)}
//           />
//           {errors.street && <p className="text-red-500 text-sm">{errors.street}</p>}
//         </div>

//         <div>
//           <label className="block font-semibold mb-1">Landmark (Optional)</label>
//           <input
//             className="w-full p-2 border rounded"
//             value={landmark}
//             onChange={(e) => setLandmark(e.target.value)}
//           />
//         </div>

//         {/* Address Type */}
//         <div>
//           <label className="block font-semibold mb-1">Save Address As</label>
//           <div className="flex gap-4">
//             {["Home", "Office", "Other"].map((type) => (
//               <label key={type} className="flex items-center gap-1">
//                 <input
//                   type="radio"
//                   name="addressType"
//                   value={type}
//                   checked={addressType === type}
//                   onChange={() => setAddressType(type)}
//                 />
//                 {type}
//               </label>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Time Slot */}
//       <div className="mb-6">
//         <p className="font-semibold mb-2">
//           When should the professional arrive? <br />
//           <span className="text-gray-500 text-sm">Service will take approx. 1 hr & 30 mins</span>
//         </p>

//         <div className="space-y-2 mb-2">
//           <label className="block font-semibold">Select Date</label>
//           <select
//             className="w-full p-2 border rounded"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//           >
//             <option value="">Choose a date</option>
//             {availableDates.map((date) => (
//               <option key={date} value={date}>{date}</option>
//             ))}
//           </select>
//           {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
//         </div>

//         <div className="space-y-2">
//           <label className="block font-semibold">Select Time</label>
//           <select
//             className="w-full p-2 border rounded"
//             value={selectedTime}
//             onChange={(e) => setSelectedTime(e.target.value)}
//           >
//             <option value="">Choose a time</option>
//             {timeSlots.map((time) => (
//               <option key={time} value={time}>{time}</option>
//             ))}
//           </select>
//           {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
//         </div>
//       </div>

//       <button
//         onClick={handlePayNow}
//         className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full"
//       >
//         Pay Now
//       </button>
//     </div>
//   );
// }

import React from 'react'

const Checkout = () => {
  return (
    <div>Checkout</div>
  )
}

export default Checkout








// http://82.29.165.206:5173/upload-documents                           
1// after this page I want the the Partner dashboard page in this page they can see the partner job id  and they can see the total no of orders , pending order ,  cancle order , and they can also see the todays order and they also see the total earning, todays earning, tips , First time customers and return customers and they can see there name and the logout button also while click on the button they can logout   
2// upload documentation process i want to verify the partners means in the partner documents page in admin i want 2 buttons verify or decline when i click on the verify then partner can see the full 