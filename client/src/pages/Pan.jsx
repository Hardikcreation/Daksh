import React from 'react'

const Pan = () => {
  return (
    <div>Pan</div>
  )
}

export default Pan




// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   Cell
// } from "recharts";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const notificationSound = new Audio("/notificationn.mp3"); // 🔔 Add your mp3 file in public folder

// export default function PartnerDashboard() {
//   const [stats, setStats] = useState({
//     totalOrders: 0,
//     earnings: 0,
//     completedOrders: 0,
//     incompleteOrders: 0,
//   });

//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();
//   const token = localStorage.getItem("partnerToken");

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const statsRes = await axios.get(`${BASE_URL}/api/partners/dashboard-stats`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setStats(statsRes.data);
//       } catch (err) {
//         console.error("Error fetching dashboard data", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const fetchRequests = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/api/orders/partner-pending-requests`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         // Play sound only if new requests arrived
//         if (Array.isArray(res.data) && res.data.length > pendingRequests.length && res.data.length > 0) {
//           notificationSound.play();
//         }
//         setPendingRequests(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         console.error("Error fetching requests", err);
//       }
//     };

//     fetchDashboardData();
//     fetchRequests();
//     const interval = setInterval(fetchRequests, 5000);
//     return () => clearInterval(interval);
//     // eslint-disable-next-line
//   }, [token, pendingRequests.length]);

//   // ⏹️ Stop notification sound when no pending requests!
//   useEffect(() => {
//     if (pendingRequests.length === 0) {
//       notificationSound.pause();
//       notificationSound.currentTime = 0;
//     }
//   }, [pendingRequests]);

//   const handleResponse = async (orderId, response) => {
//     try {
//       await axios.post(
//         `${BASE_URL}/api/orders/respond/${orderId}`,
//         { response },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Stop notification sound after accepting/declining
//       notificationSound.pause();
//       notificationSound.currentTime = 0;
//       setPendingRequests((prev) => prev.filter((r) => r._id !== orderId));
//     } catch (err) {
//       console.error("Response failed:", err);
//     }
//   };

//   const chartData = [
//     { name: "Completed", value: stats.completedOrders, color: "#10B981" },
//     { name: "Incomplete", value: stats.incompleteOrders, color: "#EF4444" },
//   ];

//   const cards = [
//     {
//       title: "Total Orders",
//       value: stats.totalOrders,
//       color: "bg-blue-500",
//       onClick: () => navigate("/partner-orders"),
//     },
//     {
//       title: "Earnings",
//       value: `₹${stats.earnings.toLocaleString()}`,
//       color: "bg-green-500",
//       onClick: () => navigate("/partner-earnings"),
//     },
//     {
//       title: "Completed Orders",
//       value: stats.completedOrders,
//       color: "bg-purple-500",
//       onClick: () => navigate("/partner-orders?filter=Completed"),
//     },
//     {
//       title: "Incomplete Orders",
//       value: stats.incompleteOrders,
//       color: "bg-red-500",
//       onClick: () => navigate("/partner-orders?filter=Incomplete"),
//     },
//   ];

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen relative">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-3xl font-bold text-gray-800">Partner Dashboard</h2>
//           <div className="text-sm text-gray-500">
//             {new Date().toLocaleDateString("en-US", {
//               weekday: "long",
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//             })}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {cards.map((card, index) => (
//             <div
//               key={index}
//               onClick={card.onClick}
//               className={`cursor-pointer ${card.color} text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col`}
//             >
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="text-lg font-semibold">{card.title}</h3>
//                   <p className="text-3xl mt-2 font-bold">{card.value}</p>
//                 </div>
//               </div>
//               <div className="mt-4 text-sm font-medium opacity-80">
//                 Click to view details →
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-md">
//           <div className="flex justify-between items-center mb-6">
//             <h3 className="text-xl font-semibold text-gray-800">Order Statistics</h3>
//             <div className="flex space-x-2">
//               <div className="flex items-center">
//                 <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
//                 <span className="text-sm">Completed</span>
//               </div>
//               <div className="flex items-center">
//                 <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
//                 <span className="text-sm">Incomplete</span>
//               </div>
//             </div>
//           </div>

//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
//                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6B7280" }} />
//                 <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#6B7280" }} />
//                 <Tooltip contentStyle={{ backgroundColor: "#fff", border: "none", borderRadius: "8px" }} />
//                 <Bar dataKey="value" radius={[4, 4, 0, 0]}>
//                   {chartData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {pendingRequests.map((req) => (
//         <div
//           key={req._id}
//           className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
//         >
//           <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
//             <h2 className="text-xl font-semibold mb-2">New Service Request</h2>
//             <p><strong>Service:</strong> {req.items?.[0]?.title}</p>
//             <p><strong>Customer:</strong> {req.user?.name}</p>
//             <p><strong>Address:</strong> {req.address?.fullAddress}</p>
//             <p><strong>Time Slot:</strong> {req.address?.timeSlot}</p>
//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 onClick={() => handleResponse(req._id, "Declined")}
//                 className="bg-red-500 text-white px-4 py-2 rounded"
//               >
//                 Decline
//               </button>
//               <button
//                 onClick={() => handleResponse(req._id, "Accepted")}
//                 className="bg-green-600 text-white px-4 py-2 rounded"
//               >
//                 Accept
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell
} from "recharts";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const notificationSound = new Audio("/notificationn.mp3");
// nSound = new Audio("/notificationn.mp3");

export default function PartnerDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    earnings: 0,
    completedOrders: 0,
    incompleteOrders: 0,
  });

  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("partnerToken");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await axios.get(`${BASE_URL}/api/partners/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(statsRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/orders/partner-pending-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(res.data) && res.data.length > pendingRequests.length && res.data.length > 0) {
          notificationSound.play();
        }
        setPendingRequests(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching requests", err);
      }
    };

    fetchDashboardData();
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, [token, pendingRequests.length]);

  useEffect(() => {
    if (pendingRequests.length === 0) {
      notificationSound.pause();
      notificationSound.currentTime = 0;
    }
  }, [pendingRequests]);

  const handleResponse = async (orderId, response) => {
    try {
      await axios.post(
        `${BASE_URL}/api/orders/respond/${orderId}`,
        { response },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      notificationSound.pause();
      notificationSound.currentTime = 0;
      setPendingRequests((prev) => prev.filter((r) => r._id !== orderId));
    } catch (err) {
      console.error("Response failed:", err);
    }
  };

  const chartData = [
    { name: "Completed", value: stats.completedOrders, color: "#10B981" },
    { name: "Incomplete", value: stats.incompleteOrders, color: "#EF4444" },
  ];

  const cards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: "📦",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      onClick: () => navigate("/partner-orders"),
    },
    {
      title: "Earnings",
      value: `₹${stats.earnings.toLocaleString()}`,
      icon: "💰", 
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      onClick: () => navigate("/partner-earnings"),
    },
    {
      title: "Completed",
      value: stats.completedOrders,
      icon: "✅",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      onClick: () => navigate("/partner-orders?filter=Completed"),
    },
    {
      title: "Incomplete",
      value: stats.incompleteOrders,
      icon: "❌",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      onClick: () => navigate("/partner-orders?filter=Incomplete"),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* App Header */}
      <div className="sticky top-0 z-10 bg-white p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric"
            })}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Stats Cards - Mobile Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={card.onClick}
              className={`${card.bgColor} ${card.textColor} p-4 rounded-xl border border-gray-100 active:scale-95 transition-transform`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium">{card.title}</p>
                  <p className="text-xl font-bold mt-1">{card.value}</p>
                </div>
                <span className="text-2xl">{card.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Statistics */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Order Stats</h2>
            <div className="flex space-x-3">
              <div className="flex items-center text-xs">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                <span>Incomplete</span>
              </div>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#6B7280", fontSize: 12 }} 
                />
                <YAxis 
                  allowDecimals={false} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#6B7280", fontSize: 10 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#fff", 
                    border: "1px solid #e5e7eb", 
                    borderRadius: "8px",
                    fontSize: "12px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                  }} 
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={24}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2">
         <button 
          className="flex flex-col items-center p-2 text-blue-600"
          onClick={() => navigate("/partner-home")}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </button>
        <button 
          className="flex flex-col items-center p-2 text-blue-600"
          onClick={() => navigate("/partner-dashboard")}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM13 10a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1h-6a1 1 0 01-1-1v-2zM13 16a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1h-6a1 1 0 01-1-1v-2z" />
          </svg>
          <span className="text-xs mt-1">Dashboard</span>
        </button>
        <button 
          className="flex flex-col items-center p-2 text-gray-500"
          onClick={() => navigate("/partner-orders")}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-xs mt-1">Orders</span>
        </button>
        <button 
          className="flex flex-col items-center p-2 text-gray-500"
          onClick={() => navigate("/partner-earnings")}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs mt-1">Earnings</span>
        </button>
      </div> */}

      {/* Request Notification Modal */}
      {pendingRequests.map((req) => (
        <div
          key={req._id}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-xl w-full max-w-sm">
            <div className="p-5">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-800">New Request</h2>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex">
                  <span className="font-medium w-24">Service:</span>
                  <span>{req.items?.[0]?.title || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">Customer:</span>
                  <span>{req.user?.name || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">Address:</span>
                  <span className="flex-1">{req.address?.fullAddress || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">Time Slot:</span>
                  <span>{req.address?.timeSlot || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 flex divide-x divide-gray-200">
              <button
                onClick={() => handleResponse(req._id, "Declined")}
                className="flex-1 py-3 text-red-600 font-medium active:bg-gray-100"
              >
                Decline
              </button>
              <button
                onClick={() => handleResponse(req._id, "Accepted")}
                className="flex-1 py-3 bg-blue-600 text-white font-medium active:bg-blue-700 rounded-br-xl"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}







// productdetails.jsx


// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { CartContext } from "../context/CartContext";
// import { AuthContext } from "../context/AuthContext";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// export default function ProductDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { addToCart, cartItems } = useContext(CartContext);
//   const { isAuthenticated } = useContext(AuthContext);

//   const [product, setProduct] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showAddedCard, setShowAddedCard] = useState(false);
//   const [showAlreadyInCart, setShowAlreadyInCart] = useState(false);
//   const [mainImage, setMainImage] = useState(0);
//   const [selectedSubServices, setSelectedSubServices] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [subServiceToAdd, setSubServiceToAdd] = useState("");
//   const [showFullDescription, setShowFullDescription] = useState(false);

//   useEffect(() => {
//     axios
//       .get(`${BASE_URL}/api/products/${id}`)
//       .then((res) => {
//         setProduct(res.data);
//         setTotalPrice(res.data.price);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         setIsLoading(false);
//       });
//   }, [id]);

//   useEffect(() => {
//     if (product) {
//       const extra = selectedSubServices.reduce((sum, item) => sum + item.price, 0);
//       setTotalPrice(product.price + extra);
//     }
//   }, [selectedSubServices, product]);

//   const handleAddSubService = () => {
//     if (!subServiceToAdd) return;
//     if (selectedSubServices.find((sub) => sub.title === subServiceToAdd)) {
//       alert("Sub-service already selected.");
//       return;
//     }
//     const selected = Array.isArray(product.subServices)
//       ? product.subServices.find((s) => s.title === subServiceToAdd)
//       : null;
//     if (selected) {
//       setSelectedSubServices((prev) => [...prev, selected]);
//       setSubServiceToAdd("");
//     }
//   };

//   const handleRemoveSubService = (title) => {
//     setSelectedSubServices((prev) => prev.filter((sub) => sub.title !== title));
//   };

//   const handleAddToCart = () => {
//     if (!isAuthenticated) {
//       navigate("/login");
//       return;
//     }

//     const alreadyInCart = cartItems.some((item) => item.id === product._id);
//     if (alreadyInCart) {
//       setShowAlreadyInCart(true);
//       return;
//     }

//     addToCart({
//       id: product._id,
//       title: product.name,
//       price: product.price,
//       imageUrl: Array.isArray(product.images) && product.images[0] ? product.images[0] : "",
//       subServices: selectedSubServices,
//     });

//     setShowAddedCard(true);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading service details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//         <div className="text-center">
//           <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </div>
//           <h3 className="text-xl font-semibold text-gray-900 mb-2">Service Not Found</h3>
//           <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
//           <button 
//             onClick={() => navigate(-1)}
//             className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Mobile Header */}
//       <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
//         <div className="flex items-center justify-between">
//           <button 
//             onClick={() => navigate(-1)}
//             className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
//           >
//             <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>
//           <h1 className="text-lg font-semibold text-gray-900 truncate mx-4">Service Details</h1>
//           <button className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors">
//             <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
//             </svg>
//           </button>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto">
//         {/* Desktop Layout */}
//         <div className="hidden md:grid md:grid-cols-2 gap-10 px-4 py-10">
//           {/* Desktop Image Gallery */}
//           <div>
//             <img
//               src={
//                 Array.isArray(product.images) && product.images[mainImage]
//                   ? `${BASE_URL}/uploads/${product.images[mainImage]}`
//                   : "https://via.placeholder.com/400x300?text=Service+Image"
//               }
//               alt={product.name}
//               className="rounded-xl w-full h-96 object-cover shadow-lg"
//             />
//             <div className="mt-6 grid grid-cols-4 gap-3">
//               {Array.isArray(product.images) &&
//                 product.images.map((img, i) => (
//                   <img
//                     key={i}
//                     src={`${BASE_URL}/uploads/${img}`}
//                     alt="Thumbnail"
//                     onClick={() => setMainImage(i)}
//                     className={`cursor-pointer h-20 w-full object-cover rounded-lg border-2 ${
//                       mainImage === i ? "border-blue-500 scale-105" : "border-gray-200"
//                     } transition-all duration-200 hover:border-blue-300`}
//                   />
//                 ))}
//             </div>
//           </div>

//           {/* Desktop Product Info */}
//           <div className="space-y-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
//               <div className="flex items-center space-x-4 mb-4">
//                 <span className="text-2xl font-bold text-green-600">₹{totalPrice}</span>
//                 {product.rating && (
//                   <div className="flex items-center space-x-1">
//                     <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                     <span className="text-gray-600">{Number(product.rating).toFixed(1)}</span>
//                   </div>
//                 )}
//               </div>
//               <p className="text-gray-700 leading-relaxed">{product.description}</p>
//             </div>

//             {/* Desktop Sub-services */}
//             {Array.isArray(product.subServices) && product.subServices.length > 0 && (
//               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
//                 <h3 className="text-xl font-semibold mb-4 text-gray-800">Customize Your Service</h3>
//                 <div className="flex gap-3 mb-4">
//                   <select
//                     value={subServiceToAdd}
//                     onChange={(e) => setSubServiceToAdd(e.target.value)}
//                     className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="" disabled>Select additional service</option>
//                     {product.subServices.map((sub, i) => (
//                       <option key={i} value={sub.title}>
//                         {sub.title} – ₹{sub.price}
//                       </option>
//                     ))}
//                   </select>
//                   <button
//                     onClick={handleAddSubService}
//                     disabled={!subServiceToAdd}
//                     className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Add
//                   </button>
//                 </div>

//                 {selectedSubServices.length > 0 && (
//                   <div className="space-y-3">
//                     {selectedSubServices.map((sub, i) => (
//                       <div key={i} className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg">
//                         <span>{sub.title} – <strong>₹{sub.price}</strong></span>
//                         <button
//                           onClick={() => handleRemoveSubService(sub.title)}
//                           className="text-red-600 hover:text-red-700 text-sm font-medium"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             <button
//               onClick={handleAddToCart}
//               className="w-full py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
//             >
//               Add to Cart – ₹{totalPrice}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Layout */}
//         <div className="md:hidden">
//           {/* Mobile Image Gallery */}
//           <div className="relative">
//             <div className="aspect-w-16 aspect-h-12">
//               <img
//                 src={
//                   Array.isArray(product.images) && product.images[mainImage]
//                     ? `${BASE_URL}/uploads/${product.images[mainImage]}`
//                     : "https://via.placeholder.com/400x300?text=Service+Image"
//                 }
//                 alt={product.name}
//                 className="w-full h-72 object-cover"
//               />
//             </div>
            
//             {/* Image Counter */}
//             {Array.isArray(product.images) && product.images.length > 1 && (
//               <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
//                 {mainImage + 1} / {product.images.length}
//               </div>
//             )}

//             {/* Rating Badge */}
//             {product.rating && (
//               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1 shadow-sm">
//                 <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                 </svg>
//                 <span className="text-sm font-medium text-gray-800">{Number(product.rating).toFixed(1)}</span>
//               </div>
//             )}
//           </div>

//           {/* Mobile Image Thumbnails */}
//           {Array.isArray(product.images) && product.images.length > 1 && (
//             <div className="px-4 py-4 bg-white">
//               <div className="flex space-x-3 overflow-x-auto pb-2">
//                 {product.images.map((img, i) => (
//                   <img
//                     key={i}
//                     src={`${BASE_URL}/uploads/${img}`}
//                     alt="Thumbnail"
//                     onClick={() => setMainImage(i)}
//                     className={`cursor-pointer h-16 w-16 flex-shrink-0 object-cover rounded-lg border-2 ${
//                       mainImage === i ? "border-blue-500" : "border-gray-200"
//                     } transition-all duration-200`}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Mobile Product Info */}
//           <div className="bg-white">
//             <div className="px-4 py-6">
//               <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
//               <div className="flex items-center justify-between mb-4">
//                 <span className="text-2xl font-bold text-green-600">₹{totalPrice}</span>
//                 {product.category && (
//                   <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
//                     {product.category}
//                   </span>
//                 )}
//               </div>
              
//               {/* Description */}
//               <div className="mb-6">
//                 <p className={`text-gray-700 leading-relaxed ${!showFullDescription ? 'line-clamp-3' : ''}`}>
//                   {product.description}
//                 </p>
//                 {product.description && product.description.length > 150 && (
//                   <button
//                     onClick={() => setShowFullDescription(!showFullDescription)}
//                     className="text-blue-600 font-medium text-sm mt-2 hover:text-blue-700"
//                   >
//                     {showFullDescription ? 'Show Less' : 'Read More'}
//                   </button>
//                 )}
//               </div>

//               {/* Key Features */}
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Included</h3>
//                 <div className="space-y-2">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                     <span className="text-gray-700">Professional service</span>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                     <span className="text-gray-700">Quality guarantee</span>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                     <span className="text-gray-700">Customer support</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Mobile Sub-services */}
//             {Array.isArray(product.subServices) && product.subServices.length > 0 && (
//               <div className="border-t border-gray-200 px-4 py-6">
//                 <h3 className="text-lg font-semibold mb-4 text-gray-900">Add Extra Services</h3>
                
//                 <div className="space-y-3 mb-4">
//                   <select
//                     value={subServiceToAdd}
//                     onChange={(e) => setSubServiceToAdd(e.target.value)}
//                     className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
//                   >
//                     <option value="" disabled>Choose additional service</option>
//                     {product.subServices.map((sub, i) => (
//                       <option key={i} value={sub.title}>
//                         {sub.title} – ₹{sub.price}
//                       </option>
//                     ))}
//                   </select>
//                   <button
//                     onClick={handleAddSubService}
//                     disabled={!subServiceToAdd}
//                     className="w-full py-3 bg-blue-100 text-blue-700 rounded-xl font-medium hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Add Selected Service
//                   </button>
//                 </div>

//                 {selectedSubServices.length > 0 && (
//                   <div className="space-y-3">
//                     <h4 className="font-medium text-gray-900">Selected Extra Services:</h4>
//                     {selectedSubServices.map((sub, i) => (
//                       <div key={i} className="flex justify-between items-center bg-blue-50 px-4 py-3 rounded-xl">
//                         <div>
//                           <span className="font-medium text-gray-900">{sub.title}</span>
//                           <div className="text-sm text-green-600 font-semibold">₹{sub.price}</div>
//                         </div>
//                         <button
//                           onClick={() => handleRemoveSubService(sub.title)}
//                           className="text-red-600 hover:text-red-700 p-2"
//                         >
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                           </svg>
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Reviews Section */}
//             {product.review && (
//               <div className="border-t border-gray-200 px-4 py-6">
//                 <h3 className="text-lg font-semibold mb-4 text-gray-900">Customer Review</h3>
//                 <div className="bg-gray-50 p-4 rounded-xl">
//                   <p className="text-gray-700 italic">"{product.review}"</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile Sticky Bottom Button */}
//       <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
//         <button
//           onClick={handleAddToCart}
//           className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 2L4 5H2m5 8l-1 5h10m-1-5a2 2 0 100 4 2 2 0 000-4z" />
//           </svg>
//           <span>Add to Cart – ₹{totalPrice}</span>
//         </button>
//       </div>

//       {/* Success Modal */}
//       {showAddedCard && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
//           <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm mx-auto text-center animate-scale-in">
//             <div className="flex flex-col items-center space-y-4">
//               <div className="bg-green-100 rounded-full p-3 animate-bounce">
//                 <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-bold text-gray-900">Added to Cart!</h3>
//               <p className="text-gray-600">Your service has been added successfully.</p>
//               <div className="flex space-x-3 w-full pt-2">
//                 <button
//                   onClick={() => setShowAddedCard(false)}
//                   className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
//                 >
//                   Continue Shopping
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowAddedCard(false);
//                     navigate('/cart');
//                   }}
//                   className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
//                 >
//                   View Cart
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Already in Cart Modal */}
//       {showAlreadyInCart && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
//           <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm mx-auto text-center">
//             <div className="flex flex-col items-center space-y-4">
//               <div className="bg-yellow-100 rounded-full p-3">
//                 <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-bold text-gray-900">Already in Cart</h3>
//               <p className="text-gray-600">This service is already in your cart.</p>
//               <div className="flex space-x-3 w-full pt-2">
//                 <button
//                   onClick={() => setShowAlreadyInCart(false)}
//                   className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
//                 >
//                   OK
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowAlreadyInCart(false);
//                     navigate('/cart');
//                   }}
//                   className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
//                 >
//                   View Cart
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         @keyframes scale-in {
//           0% { transform: scale(0.9); opacity: 0; }
//           100% { transform: scale(1); opacity: 1; }
//         }
//         .animate-scale-in {
//           animation: scale-in 0.2s ease-out;
//         }
//         .line-clamp-3 {
//           display: -webkit-box;
//           -webkit-line-clamp: 3;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>
//     </div>
//   );
// }









//productlist 




// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// export default function ProductList() {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
//   const [activeFilter, setActiveFilter] = useState('All Services');
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     axios
//       .get(`${BASE_URL}/api/products`)
//       .then((res) => {
//         const productsData = Array.isArray(res.data) ? res.data : [];
//         setProducts(productsData);
//         setFilteredProducts(productsData);
        
//         // Extract unique categories from products
//         const uniqueCategories = [...new Set(productsData.map(product => product.category).filter(Boolean))];
//         setCategories(['All Services', ...uniqueCategories]);
        
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching products:", err);
//         setError("Failed to load services. Please try again later.");
//         setIsLoading(false);
//       });
//   }, []);

//   // Filter products based on selected category
//   useEffect(() => {
//     if (activeFilter === 'All Services') {
//       setFilteredProducts(products);
//     } else {
//       const filtered = products.filter(product => 
//         product.category && product.category.toLowerCase() === activeFilter.toLowerCase()
//       );
//       setFilteredProducts(filtered);
//     }
//   }, [activeFilter, products]);

//   const handleFilterChange = (category) => {
//     setActiveFilter(category);
//   };

//   const LoadingSkeleton = () => (
//     <div className="space-y-4">
//       {[...Array(6)].map((_, index) => (
//         <div
//           key={index}
//           className="bg-white rounded-xl p-4 shadow-sm animate-pulse"
//         >
//           <div className="flex space-x-4">
//             <div className="bg-gray-200 h-20 w-20 rounded-xl flex-shrink-0"></div>
//             <div className="flex-1 space-y-3">
//               <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//               <div className="h-3 bg-gray-200 rounded w-full"></div>
//               <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//               <div className="flex justify-between items-center">
//                 <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//                 <div className="h-8 bg-gray-200 rounded w-20"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   const EmptyState = () => (
//     <div className="flex flex-col items-center justify-center py-16 px-4">
//       <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
//         <svg
//           className="w-12 h-12 text-blue-500"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="1.5"
//             d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//           />
//         </svg>
//       </div>
//       <h3 className="text-xl font-semibold text-gray-800 mb-2">
//         {activeFilter === 'All Services' ? 'No Services Available' : `No ${activeFilter} Services Available`}
//       </h3>
//       <p className="text-gray-500 text-center max-w-sm">
//         {activeFilter === 'All Services' 
//           ? "We're working hard to bring you amazing services. Check back soon!"
//           : `No services found in the ${activeFilter} category. Try selecting a different category.`
//         }
//       </p>
//       {activeFilter !== 'All Services' && (
//         <button 
//           onClick={() => setActiveFilter('All Services')}
//           className="mt-4 px-6 py-2 bg-gray-500 text-white rounded-full font-medium hover:bg-gray-600 transition-colors"
//         >
//           View All Services
//         </button>
//       )}
//       <button 
//         onClick={() => window.location.reload()} 
//         className="mt-2 px-6 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
//       >
//         Refresh
//       </button>
//     </div>
//   );

//   const ErrorState = () => (
//     <div className="bg-red-50 border border-red-200 rounded-xl p-4 mx-4 mb-6">
//       <div className="flex items-start space-x-3">
//         <div className="flex-shrink-0">
//           <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
//             <svg
//               className="w-4 h-4 text-red-500"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </div>
//         </div>
//         <div className="flex-1">
//           <h3 className="text-sm font-medium text-red-800 mb-1">
//             Connection Error
//           </h3>
//           <p className="text-sm text-red-700">{error}</p>
//           <button 
//             onClick={() => window.location.reload()}
//             className="mt-3 text-sm font-medium text-red-600 hover:text-red-500"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   const ProductCard = ({ product }) => {
//     const isAvailable = product.partnerAvailable !== false;
    
//     return (
//       <Link
//         to={isAvailable ? `/product/${product._id}` : "#"}
//         className={`block ${!isAvailable ? "pointer-events-none" : ""}`}
//         onClick={e => {
//           if (!isAvailable) e.preventDefault();
//         }}
//       >
//         <div className={`
//           bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden
//           transition-all duration-200 active:scale-95
//           ${isAvailable ? "hover:shadow-md" : "opacity-60"}
//           ${!isAvailable ? "relative" : ""}
//         `}>
//           {/* Unavailable Overlay */}
//           {!isAvailable && (
//             <div className="absolute inset-0 z-10 bg-white/80 flex items-center justify-center">
//               <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                 Unavailable
//               </div>
//             </div>
//           )}

//           <div className="flex p-4 space-x-4">
//             {/* Service Image */}
//             <div className="relative flex-shrink-0">
//               <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
//                 <img
//                   src={
//                     Array.isArray(product.images) && product.images[0]
//                       ? `${BASE_URL}/uploads/${product.images[0]}`
//                       : "https://via.placeholder.com/80x80?text=Service"
//                   }
//                   alt={product.name}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.target.src = "https://via.placeholder.com/80x80?text=Service";
//                   }}
//                 />
//               </div>
//               {/* Rating Badge */}
//               {product.rating && (
//                 <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full text-xs font-bold flex items-center">
//                   ⭐ {Number(product.rating).toFixed(1)}
//                 </div>
//               )}
//             </div>

//             {/* Service Info */}
//             <div className="flex-1 min-w-0">
//               <div className="flex justify-between items-start mb-2">
//                 <h3 className="font-semibold text-gray-900 text-base line-clamp-1 pr-2">
//                   {product.name}
//                 </h3>
//                 <div className="text-right flex-shrink-0">
//                   <span className="text-lg font-bold text-green-600">
//                     ₹{product.price}
//                   </span>
//                 </div>
//               </div>
              
//               <p className="text-sm text-gray-600 line-clamp-2 mb-3">
//                 {product.description}
//               </p>

//               {/* Category Badge */}
//               {product.category && (
//                 <div className="mb-2">
//                   <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
//                     {product.category}
//                   </span>
//                 </div>
//               )}

//               {/* Action Button */}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   {/* Available Status */}
//                   <div className={`
//                     flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
//                     ${isAvailable 
//                       ? "bg-green-100 text-green-700" 
//                       : "bg-red-100 text-red-700"
//                     }
//                   `}>
//                     <div className={`w-1.5 h-1.5 rounded-full ${
//                       isAvailable ? "bg-green-500" : "bg-red-500"
//                     }`}></div>
//                     <span>{isAvailable ? "Available" : "Unavailable"}</span>
//                   </div>
//                 </div>
                
//                 {isAvailable && (
//                   <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
//                     Book Now
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </Link>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
//         <div className="px-4 py-4">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 Our Services
//               </h1>
//               <p className="text-sm text-gray-600 mt-1">
//                 {filteredProducts.length} services available
//                 {activeFilter !== 'All Services' && ` in ${activeFilter}`}
//               </p>
//             </div>
            
//             {/* View Toggle - Hidden for now since we're using single view */}
//             <div className="hidden">
//               <div className="flex bg-gray-100 rounded-lg p-1">
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`p-2 rounded-md transition-colors ${
//                     viewMode === 'list' 
//                       ? 'bg-white shadow-sm text-blue-600' 
//                       : 'text-gray-500'
//                   }`}
//                 >
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className={`p-2 rounded-md transition-colors ${
//                     viewMode === 'grid' 
//                       ? 'bg-white shadow-sm text-blue-600' 
//                       : 'text-gray-500'
//                   }`}
//                 >
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
          
//           {/* Dynamic Category Filters */}
//           <div className="flex space-x-2 overflow-x-auto pb-2">
//             {categories.map((category) => (
//               <button
//                 key={category}
//                 onClick={() => handleFilterChange(category)}
//                 className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
//                   activeFilter === category
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 {category}
//                 {category !== 'All Services' && (
//                   <span className="ml-1 text-xs opacity-75">
//                     ({products.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase()).length})
//                   </span>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Error State */}
//       {error && <ErrorState />}

//       {/* Content */}
//       <div className="px-4 py-4 pb-20">
//         {isLoading ? (
//           <LoadingSkeleton />
//         ) : filteredProducts.length === 0 ? (
//           <EmptyState />
//         ) : (
//           <div className="space-y-3">
//             {filteredProducts.map((product) => (
//               <ProductCard key={product._id} product={product} />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Floating Action Button (Optional) */}
//       <div className="fixed bottom-20 right-4 z-30">
//         <button className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// }














//productsList    OLD


// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// export default function ProductList() {
//   const [products, setProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     axios
//       .get(`${BASE_URL}/api/products`)
//       .then((res) => {
//         setProducts(Array.isArray(res.data) ? res.data : []);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching products:", err);
//         setError("Failed to load services. Please try again later.");
//         setIsLoading(false);
//       });
//   }, []);

//   return (
//     <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6 sm:py-12">
//       {/* Header Section */}
//       <div className="text-center mb-6 sm:mb-12">
//         <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
//           Our Services
//         </h1>
//         <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto">
//           Professional home services tailored to your needs
//         </p>
//       </div>

//       {/* Error State */}
//       {error && (
//         <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded">
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <svg
//                 className="h-5 w-5 text-red-500"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-red-700">{error}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Loading State */}
//       {isLoading ? (
//         <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
//           {[...Array(6)].map((_, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-2xl shadow-sm sm:shadow-md overflow-hidden animate-pulse"
//             >
//               <div className="bg-gray-200 h-36 sm:h-48 w-full rounded-xl sm:rounded-none"></div>
//               <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
//                 <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4"></div>
//                 <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
//                 <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
//                 <div className="h-8 sm:h-10 bg-gray-200 rounded w-full mt-3 sm:mt-4"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : products.length === 0 ? (
//         <div className="text-center py-12">
//           <svg
//             className="mx-auto h-12 w-12 text-gray-400"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="1.5"
//               d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//           <h3 className="mt-4 text-lg font-medium text-gray-900">
//             No services available
//           </h3>
//           <p className="mt-1 text-sm text-gray-500">Please check back later</p>
//         </div>
//       ) : (
//         <div
//           className="
//             grid 
//             grid-cols-1 
//             xs:grid-cols-2 
//             md:grid-cols-3 
//             gap-3 sm:gap-6 lg:gap-8
//           "
//         >
//           {products.map((product) => {
//             const isAvailable = product.partnerAvailable !== false;
//             return (
//               <div
//                 key={product._id}
//                 className={`
//                   bg-white 
//                   rounded-2xl 
//                   shadow-md 
//                   overflow-hidden 
//                   hover:shadow-lg sm:hover:shadow-xl 
//                   transition-shadow duration-300
//                   flex flex-col
//                   border border-gray-100
//                   relative
//                   ${!isAvailable ? "opacity-60 pointer-events-none" : ""}
//                 `}
//               >
//                 {/* Overlay if not available */}
//                 {!isAvailable && (
//                   <div className="absolute inset-0 z-20 bg-gray-200 bg-opacity-70 flex items-center justify-center">
//                     <span className="text-red-600 font-bold text-base sm:text-lg">
//                       Not Available
//                     </span>
//                   </div>
//                 )}

//                 {/* Mobile-top badge */}
//                 {product.rating && (
//                   <div className="absolute top-3 left-3 sm:top-2 sm:right-2 sm:left-auto bg-white/90 px-2 py-1 rounded-full text-xs font-semibold flex items-center shadow-sm z-10">
//                     ⭐ {Number(product.rating).toFixed(1)}
//                   </div>
//                 )}

//                 {/* Image */}
//                 <div className="relative h-36 sm:h-48 overflow-hidden flex items-center justify-center">
//                   <img
//                     src={
//                       Array.isArray(product.images) && product.images[0]
//                         ? `${BASE_URL}/uploads/${product.images[0]}`
//                         : "https://via.placeholder.com/400x300?text=Service+Image"
//                     }
//                     alt={product.name}
//                     className="
//                       w-full h-full object-cover 
//                       transition-transform duration-500 
//                       rounded-xl sm:rounded-none
//                       hover:scale-105
//                     "
//                     onError={(e) => {
//                       e.target.src =
//                         "https://via.placeholder.com/400x300?text=Service+Image";
//                     }}
//                   />
//                 </div>

//                 {/* Content */}
//                 <div className="p-3 sm:p-6 flex flex-col flex-1">
//                   <div className="flex justify-between items-start gap-2">
//                     <h2 className="text-base sm:text-xl font-bold text-gray-800 line-clamp-1">
//                       {product.name}
//                     </h2>
//                     <p className="text-base sm:text-lg font-bold text-green-600 whitespace-nowrap">
//                       ₹{product.price}
//                     </p>
//                   </div>

//                   <p className="mt-1 sm:mt-2 text-xs sm:text-base text-gray-600 line-clamp-2">
//                     {product.description}
//                   </p>

//                   <div className="flex-grow"></div>
//                   <Link
//                     to={isAvailable ? `/product/${product._id}` : "#"}
//                     tabIndex={isAvailable ? 0 : -1}
//                     className={`
//                       mt-3 sm:mt-6 
//                       inline-block 
//                       w-full 
//                       text-center 
//                       ${isAvailable ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"} 
//                       text-white 
//                       px-4 py-2 sm:px-6 sm:py-3 
//                       rounded-lg 
//                       font-medium 
//                       transition-colors 
//                       text-sm sm:text-base
//                       shadow-sm
//                     `}
//                     aria-disabled={!isAvailable}
//                     onClick={e => {
//                       if (!isAvailable) e.preventDefault();
//                     }}
//                   >
//                     {isAvailable ? "View Details" : "Not Available"}
//                   </Link>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }










// productdetails NEW

// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { CartContext } from "../context/CartContext";
// import { AuthContext } from "../context/AuthContext";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// export default function ProductDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { addToCart, cartItems } = useContext(CartContext);
//   const { isAuthenticated } = useContext(AuthContext);

//   const [product, setProduct] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showAddedCard, setShowAddedCard] = useState(false);
//   const [showAlreadyInCart, setShowAlreadyInCart] = useState(false);
//   const [mainImage, setMainImage] = useState(0);
//   const [selectedSubServices, setSelectedSubServices] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [subServiceToAdd, setSubServiceToAdd] = useState("");
//   const [showFullDescription, setShowFullDescription] = useState(false);

//   useEffect(() => {
//     axios
//       .get(`${BASE_URL}/api/products/${id}`)
//       .then((res) => {
//         setProduct(res.data);
//         setTotalPrice(res.data.price);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         setIsLoading(false);
//       });
//   }, [id]);

//   useEffect(() => {
//     if (product) {
//       const extra = selectedSubServices.reduce((sum, item) => sum + item.price, 0);
//       setTotalPrice(product.price + extra);
//     }
//   }, [selectedSubServices, product]);

//   const handleAddSubService = () => {
//     if (!subServiceToAdd) return;
//     if (selectedSubServices.find((sub) => sub.title === subServiceToAdd)) {
//       alert("Sub-service already selected.");
//       return;
//     }
//     const selected = Array.isArray(product.subServices)
//       ? product.subServices.find((s) => s.title === subServiceToAdd)
//       : null;
//     if (selected) {
//       setSelectedSubServices((prev) => [...prev, selected]);
//       setSubServiceToAdd("");
//     }
//   };

//   const handleRemoveSubService = (title) => {
//     setSelectedSubServices((prev) => prev.filter((sub) => sub.title !== title));
//   };

//   const handleAddToCart = () => {
//     if (!isAuthenticated) {
//       navigate("/login");
//       return;
//     }

//     const alreadyInCart = cartItems.some((item) => item.id === product._id);
//     if (alreadyInCart) {
//       setShowAlreadyInCart(true);
//       return;
//     }

//     addToCart({
//       id: product._id,
//       title: product.name,
//       price: product.price,
//       imageUrl: Array.isArray(product.images) && product.images[0] ? product.images[0] : "",
//       subServices: selectedSubServices,
//     });

//     setShowAddedCard(true);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading service details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//         <div className="text-center">
//           <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </div>
//           <h3 className="text-xl font-semibold text-gray-900 mb-2">Service Not Found</h3>
//           <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
//           <button 
//             onClick={() => navigate(-1)}
//             className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Mobile Header */}
//       <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
//         <div className="flex items-center justify-between">
//           <button 
//             onClick={() => navigate(-1)}
//             className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
//           >
//             <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>
//           <h1 className="text-lg font-semibold text-gray-900 truncate mx-4">Service Details</h1>
//           <button className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors">
//             <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
//             </svg>
//           </button>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto">
//         {/* Desktop Layout */}
//         <div className="hidden md:grid md:grid-cols-2 gap-10 px-4 py-10">
//           {/* Desktop Image Gallery */}
//           <div>
//             <img
//               src={
//                 Array.isArray(product.images) && product.images[mainImage]
//                   ? `${BASE_URL}/uploads/${product.images[mainImage]}`
//                   : "https://via.placeholder.com/400x300?text=Service+Image"
//               }
//               alt={product.name}
//               className="rounded-xl w-full h-96 object-cover shadow-lg"
//             />
//             <div className="mt-6 grid grid-cols-4 gap-3">
//               {Array.isArray(product.images) &&
//                 product.images.map((img, i) => (
//                   <img
//                     key={i}
//                     src={`${BASE_URL}/uploads/${img}`}
//                     alt="Thumbnail"
//                     onClick={() => setMainImage(i)}
//                     className={`cursor-pointer h-20 w-full object-cover rounded-lg border-2 ${
//                       mainImage === i ? "border-blue-500 scale-105" : "border-gray-200"
//                     } transition-all duration-200 hover:border-blue-300`}
//                   />
//                 ))}
//             </div>
//           </div>

//           {/* Desktop Product Info */}
//           <div className="space-y-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
//               <div className="flex items-center space-x-4 mb-4">
//                 <span className="text-2xl font-bold text-green-600">₹{totalPrice}</span>
//                 {product.rating && (
//                   <div className="flex items-center space-x-1">
//                     <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                     <span className="text-gray-600">{Number(product.rating).toFixed(1)}</span>
//                   </div>
//                 )}
//               </div>
//               <p className="text-gray-700 leading-relaxed">{product.description}</p>
//             </div>

//             {/* Desktop Sub-services */}
//             {Array.isArray(product.subServices) && product.subServices.length > 0 && (
//               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
//                 <h3 className="text-xl font-semibold mb-4 text-gray-800">Customize Your Service</h3>
//                 <div className="flex gap-3 mb-4">
//                   <select
//                     value={subServiceToAdd}
//                     onChange={(e) => setSubServiceToAdd(e.target.value)}
//                     className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="" disabled>Select additional service</option>
//                     {product.subServices.map((sub, i) => (
//                       <option key={i} value={sub.title}>
//                         {sub.title} – ₹{sub.price}
//                       </option>
//                     ))}
//                   </select>
//                   <button
//                     onClick={handleAddSubService}
//                     disabled={!subServiceToAdd}
//                     className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Add
//                   </button>
//                 </div>

//                 {selectedSubServices.length > 0 && (
//                   <div className="space-y-3">
//                     {selectedSubServices.map((sub, i) => (
//                       <div key={i} className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg">
//                         <span>{sub.title} – <strong>₹{sub.price}</strong></span>
//                         <button
//                           onClick={() => handleRemoveSubService(sub.title)}
//                           className="text-red-600 hover:text-red-700 text-sm font-medium"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             <button
//               onClick={handleAddToCart}
//               className="w-full py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
//             >
//               Add to Cart – ₹{totalPrice}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Layout */}
//         <div className="md:hidden">
//           {/* Mobile Image Gallery */}
//           <div className="relative">
//             <div className="aspect-w-16 aspect-h-12">
//               <img
//                 src={
//                   Array.isArray(product.images) && product.images[mainImage]
//                     ? `${BASE_URL}/uploads/${product.images[mainImage]}`
//                     : "https://via.placeholder.com/400x300?text=Service+Image"
//                 }
//                 alt={product.name}
//                 className="w-full h-72 object-cover"
//               />
//             </div>
            
//             {/* Image Counter */}
//             {Array.isArray(product.images) && product.images.length > 1 && (
//               <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
//                 {mainImage + 1} / {product.images.length}
//               </div>
//             )}

//             {/* Rating Badge */}
//             {product.rating && (
//               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1 shadow-sm">
//                 <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                 </svg>
//                 <span className="text-sm font-medium text-gray-800">{Number(product.rating).toFixed(1)}</span>
//               </div>
//             )}
//           </div>

//           {/* Mobile Image Thumbnails */}
//           {Array.isArray(product.images) && product.images.length > 1 && (
//             <div className="px-4 py-4 bg-white">
//               <div className="flex space-x-3 overflow-x-auto pb-2">
//                 {product.images.map((img, i) => (
//                   <img
//                     key={i}
//                     src={`${BASE_URL}/uploads/${img}`}
//                     alt="Thumbnail"
//                     onClick={() => setMainImage(i)}
//                     className={`cursor-pointer h-16 w-16 flex-shrink-0 object-cover rounded-lg border-2 ${
//                       mainImage === i ? "border-blue-500" : "border-gray-200"
//                     } transition-all duration-200`}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Mobile Product Info */}
//           <div className="bg-white">
//             <div className="px-4 py-6">
//               <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
//               <div className="flex items-center justify-between mb-4">
//                 <span className="text-2xl font-bold text-green-600">₹{totalPrice}</span>
//                 {product.category && (
//                   <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
//                     {product.category}
//                   </span>
//                 )}
//               </div>
              
//               {/* Description */}
//               <div className="mb-6">
//                 <p className={`text-gray-700 leading-relaxed ${!showFullDescription ? 'line-clamp-3' : ''}`}>
//                   {product.description}
//                 </p>
//                 {product.description && product.description.length > 150 && (
//                   <button
//                     onClick={() => setShowFullDescription(!showFullDescription)}
//                     className="text-blue-600 font-medium text-sm mt-2 hover:text-blue-700"
//                   >
//                     {showFullDescription ? 'Show Less' : 'Read More'}
//                   </button>
//                 )}
//               </div>

//               {/* Key Features */}
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Included</h3>
//                 <div className="space-y-2">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                     <span className="text-gray-700">Professional service</span>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                     <span className="text-gray-700">Quality guarantee</span>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                     <span className="text-gray-700">Customer support</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Mobile Sub-services */}
//             {Array.isArray(product.subServices) && product.subServices.length > 0 && (
//               <div className="border-t border-gray-200 px-4 py-6">
//                 <h3 className="text-lg font-semibold mb-4 text-gray-900">Add Extra Services</h3>
                
//                 <div className="space-y-3 mb-4">
//                   <select
//                     value={subServiceToAdd}
//                     onChange={(e) => setSubServiceToAdd(e.target.value)}
//                     className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
//                   >
//                     <option value="" disabled>Choose additional service</option>
//                     {product.subServices.map((sub, i) => (
//                       <option key={i} value={sub.title}>
//                         {sub.title} – ₹{sub.price}
//                       </option>
//                     ))}
//                   </select>
//                   <button
//                     onClick={handleAddSubService}
//                     disabled={!subServiceToAdd}
//                     className="w-full py-3 bg-blue-100 text-blue-700 rounded-xl font-medium hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Add Selected Service
//                   </button>
//                 </div>

//                 {selectedSubServices.length > 0 && (
//                   <div className="space-y-3">
//                     <h4 className="font-medium text-gray-900">Selected Extra Services:</h4>
//                     {selectedSubServices.map((sub, i) => (
//                       <div key={i} className="flex justify-between items-center bg-blue-50 px-4 py-3 rounded-xl">
//                         <div>
//                           <span className="font-medium text-gray-900">{sub.title}</span>
//                           <div className="text-sm text-green-600 font-semibold">₹{sub.price}</div>
//                         </div>
//                         <button
//                           onClick={() => handleRemoveSubService(sub.title)}
//                           className="text-red-600 hover:text-red-700 p-2"
//                         >
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                           </svg>
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Reviews Section */}
//             {product.review && (
//               <div className="border-t border-gray-200 px-4 py-6">
//                 <h3 className="text-lg font-semibold mb-4 text-gray-900">Customer Review</h3>
//                 <div className="bg-gray-50 p-4 rounded-xl">
//                   <p className="text-gray-700 italic">"{product.review}"</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile Sticky Bottom Button */}
//       <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
//         <button
//           onClick={handleAddToCart}
//           className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 2L4 5H2m5 8l-1 5h10m-1-5a2 2 0 100 4 2 2 0 000-4z" />
//           </svg>
//           <span>Add to Cart – ₹{totalPrice}</span>
//         </button>
//       </div>

//       {/* Success Modal */}
//       {showAddedCard && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
//           <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm mx-auto text-center animate-scale-in">
//             <div className="flex flex-col items-center space-y-4">
//               <div className="bg-green-100 rounded-full p-3 animate-bounce">
//                 <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-bold text-gray-900">Added to Cart!</h3>
//               <p className="text-gray-600">Your service has been added successfully.</p>
//               <div className="flex space-x-3 w-full pt-2">
//                 <button
//                   onClick={() => setShowAddedCard(false)}
//                   className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
//                 >
//                   Continue Shopping
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowAddedCard(false);
//                     navigate('/cart');
//                   }}
//                   className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
//                 >
//                   View Cart
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Already in Cart Modal */}
//       {showAlreadyInCart && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
//           <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm mx-auto text-center">
//             <div className="flex flex-col items-center space-y-4">
//               <div className="bg-yellow-100 rounded-full p-3">
//                 <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-bold text-gray-900">Already in Cart</h3>
//               <p className="text-gray-600">This service is already in your cart.</p>
//               <div className="flex space-x-3 w-full pt-2">
//                 <button
//                   onClick={() => setShowAlreadyInCart(false)}
//                   className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
//                 >
//                   OK
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowAlreadyInCart(false);
//                     navigate('/cart');
//                   }}
//                   className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
//                 >
//                   View Cart
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         @keyframes scale-in {
//           0% { transform: scale(0.9); opacity: 0; }
//           100% { transform: scale(1); opacity: 1; }
//         }
//         .animate-scale-in {
//           animation: scale-in 0.2s ease-out;
//         }
//         .line-clamp-3 {
//           display: -webkit-box;
//           -webkit-line-clamp: 3;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>
//     </div>
//   );
// }










// myOrder.jsx old 

// import { useEffect, useState } from "react";
// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // Available time slots for rescheduling
// const AVAILABLE_TIME_SLOTS = [
//   "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
//   "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM",
//   "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM",
//   "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"
// ];

// export default function MyOrders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // For rescheduling
//   const [editingOrderId, setEditingOrderId] = useState(null);
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

//   const fetchOrders = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`${BASE_URL}/api/orders/my-orders`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setOrders(Array.isArray(response.data) ? response.data : []);
//     } catch (err) {
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const cancelOrder = async (id) => {
//     const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
//     if (!confirmCancel) return;

//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`${BASE_URL}/api/orders/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       fetchOrders();
//     } catch (err) {
//       alert("Failed to cancel order");
//     }
//   };

//   // --- Step 2: Reschedule (Time Slot Change) Logic ---
//   const handleOpenTimeSlotEditor = (order) => {
//     setEditingOrderId(order._id);
//     setSelectedTimeSlot(order.address?.timeSlot || "");
//   };

//   const handleTimeSlotChange = (e) => {
//     setSelectedTimeSlot(e.target.value);
//   };

//   const handleSaveTimeSlot = async (order) => {
//     if (!selectedTimeSlot || selectedTimeSlot === order.address?.timeSlot) {
//       setEditingOrderId(null);
//       return;
//     }
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         `${BASE_URL}/api/orders/${order._id}/change-timeslot`,
//         { timeSlot: selectedTimeSlot },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setEditingOrderId(null);
//       fetchOrders();
//     } catch (err) {
//       alert("Failed to update time slot.");
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingOrderId(null);
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
//       <div className="flex items-center mb-8">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-6 w-6 mr-3 text-indigo-600"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//         </svg>
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Orders</h1>
//       </div>

//       {loading ? (
//         <div className="space-y-6">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
//               <div className="flex justify-between">
//                 <div className="h-6 bg-gray-200 rounded w-1/4"></div>
//                 <div className="h-6 bg-gray-200 rounded w-1/6"></div>
//               </div>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
//                 <div className="space-y-3">
//                   <div className="h-4 bg-gray-200 rounded w-1/3"></div>
//                   <div className="h-4 bg-gray-200 rounded w-full"></div>
//                   <div className="h-4 bg-gray-200 rounded w-2/3"></div>
//                 </div>
//                 <div className="h-64 bg-gray-200 rounded-lg"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : orders.length === 0 ? (
//         <div className="bg-white p-8 sm:p-10 rounded-xl shadow-sm text-center max-w-md mx-auto">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-16 w-16 mx-auto text-gray-400"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v16a2 2 0 01-2 2z" />
//           </svg>
//           <h3 className="mt-5 text-lg font-medium text-gray-900">No orders yet</h3>
//           <p className="mt-2 text-gray-500">You haven't placed any orders yet.</p>
//           <button
//             onClick={() => (window.location.href = "/products")}
//             className="mt-6 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
//           >
//             Browse Services
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {orders.map((order) => (
//             <div
//               key={order._id}
//               className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100"
//             >
//               {/* Header */}
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
//                 <div>
//                   <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
//                     Order #{order._id.slice(-8).toUpperCase()}
//                   </h2>
//                   <p className="text-sm text-gray-500 mt-1">
//                     {new Date(order.createdAt).toLocaleString("en-IN", {
//                       dateStyle: "medium",
//                       timeStyle: "short",
//                     })}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <p className="text-lg font-semibold text-gray-800 mr-2">₹{order.totalAmount}</p>
//                   <span
//                     className={`px-3 py-1 rounded-full text-sm font-medium ${
//                       order.status === "Cancelled"
//                         ? "bg-red-100 text-red-800"
//                         : order.status === "Completed"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-yellow-100 text-yellow-800"
//                     }`}
//                   >
//                     {order.status}
//                   </span>
//                 </div>
//               </div>

//               {/* Partner assignment message (NEW) */}
//               {order.partner && order.partner.name && (
//                 <div className="mb-4 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
//                   <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A7 7 0 0012 19a7 7 0 006.879-1.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                   </svg>
//                   <div>
//                     <span className="block text-green-700 font-semibold">
//                       Partner Assigned: {order.partner.name}
//                     </span>
//                     <span className="block text-green-600 text-sm mt-0.5">
//                       Partner is assigned. We will share the details before the time slot. Thank you!
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {/* Start/Complete Codes for the user */}
//               <div className="flex flex-col sm:flex-row gap-4 mb-4">
//                 <div className="flex-1">
//                   <span className="block text-xs text-gray-500 mb-1">Happy Code (Share this code with the Partner to begin the work):</span>
//                   <span className="block font-mono font-bold text-lg text-green-700">{order.happyCode || "----"}</span>
//                 </div>
//                 <div className="flex-1">
//                   <span className="block text-xs text-gray-500 mb-1">Complete Code (Share this code with the Partner to mark the work as finished):</span>
//                   <span className="block font-mono font-bold text-lg text-blue-700">{order.completeCode || "----"}</span>
//                 </div>
//               </div>

//               {/* Order Details */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Address */}
//                 <div className="bg-white shadow-md p-6 rounded-xl border border-gray-200">
//                   <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-6 w-6 mr-2 text-indigo-600"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                       />
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                       />
//                     </svg>
//                     Delivery Address
//                   </h3>
//                   <div className="space-y-4 text-gray-700">
//                     <div className="flex items-center">
//                       <span className="w-28 text-sm text-gray-500">🏠 House No:</span>
//                       <span className="text-sm font-medium">{order.address?.houseNumber}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="w-28 text-sm text-gray-500">🛣️ Street:</span>
//                       <span className="text-sm font-medium">{order.address?.street}</span>
//                     </div>
//                     {order.address?.landmark && (
//                       <div className="flex items-center">
//                         <span className="w-28 text-sm text-gray-500">📍 Landmark:</span>
//                         <span className="text-sm font-medium">{order.address.landmark}</span>
//                       </div>
//                     )}
//                     <div className="flex items-center">
//                       <span className="w-28 text-sm text-gray-500">🏷️ Type:</span>
//                       <span className="text-sm font-medium">{order.address?.addressType}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="w-28 text-sm text-gray-500">⏰ Time Slot:</span>
//                       <span className="text-sm font-medium">
//                         {order.requestStatus === "NoPartner" ? (
//                           editingOrderId === order._id ? (
//                             <span className="flex items-center gap-2">
//                               <select
//                                 value={selectedTimeSlot}
//                                 onChange={handleTimeSlotChange}
//                                 className="border rounded px-2 py-1 text-sm"
//                               >
//                                 <option value="">Select a time slot</option>
//                                 {AVAILABLE_TIME_SLOTS.map((slot) => (
//                                   <option key={slot} value={slot}>{slot}</option>
//                                 ))}
//                               </select>
//                               <button
//                                 className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
//                                 onClick={() => handleSaveTimeSlot(order)}
//                               >
//                                 Save
//                               </button>
//                               <button
//                                 className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-xs"
//                                 onClick={handleCancelEdit}
//                               >
//                                 Cancel
//                               </button>
//                             </span>
//                           ) : (
//                             <span className="flex items-center gap-2">
//                               {order.address?.timeSlot}
//                               <button
//                                 className="ml-2 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
//                                 onClick={() => handleOpenTimeSlotEditor(order)}
//                               >
//                                 Change
//                               </button>
//                             </span>
//                           )
//                         ) : (
//                           order.address?.timeSlot
//                         )}
//                       </span>
//                     </div>
//                     {/* Time slot warning */}
//                     {order.requestStatus === "NoPartner" && (
//                       <div className="mt-2 text-xs text-red-500">
//                         ⚠️ No partner was available in your selected time slot. Please choose a different time slot.
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Order Items (shows subservices) */}
//                 <div className="rounded-xl shadow-md bg-white p-4 flex flex-col gap-3">
//                   <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5 mr-2 text-indigo-600"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
//                       />
//                     </svg>
//                     Order Items
//                   </h3>
//                   <div className="flex flex-col gap-4">
//                     {(Array.isArray(order.items) ? order.items : []).map((item, idx) => (
//                       <div
//                         key={idx}
//                         className="flex items-start gap-5 border border-gray-100 rounded-lg p-4 bg-gray-50"
//                       >
//                         {/* IMAGE LEFT */}
//                         <img
//                           src={`${BASE_URL}/uploads/${item.imageUrl}`}
//                           className="w-32 h-32 object-cover rounded-lg border shadow"
//                           alt={item.title}
//                           onError={e => {
//                             e.target.src = "https://via.placeholder.com/128x128?text=Service";
//                           }}
//                         />
//                         {/* RIGHT: service info, subservices, price */}
//                         <div className="flex flex-col flex-1 h-full justify-between">
//                           <div>
//                             <h4 className="text-lg font-bold text-gray-800 mb-1">{item.title}</h4>
//                             {Array.isArray(item.subServices) && item.subServices.length > 0 && (
//                               <ul className="mb-2 mt-1 pl-2 text-gray-700 text-base space-y-1">
//                                 {item.subServices.map((sub, subIdx) => (
//                                   <li key={subIdx} className="flex justify-between items-center">
//                                     <span>{sub.title}</span>
//                                     <span className="text-gray-800 font-semibold ml-4">₹{sub.price}</span>
//                                   </li>
//                                 ))}
//                               </ul>
//                             )}
//                           </div>
//                           <div className="flex flex-col items-end pt-2">
//                             <span className="text-xs text-gray-500 font-medium mb-0.5">
//                               Visiting Price
//                             </span>
//                             <span className="text-indigo-700 font-bold text-lg">₹{item.price}</span>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Cancel Button */}
//               {order.status !== "Cancelled" && order.status !== "Completed" && (
//                 <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
//                   <button
//                     onClick={() => cancelOrder(order._id)}
//                     className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4 mr-2"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                     Cancel Order
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }






//myOrder.jsx new 



// import { useEffect, useState } from "react";
// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // Available time slots for rescheduling
// const AVAILABLE_TIME_SLOTS = [
//   "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
//   "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM",
//   "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM",
//   "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"
// ];

// export default function MyOrders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // For rescheduling
//   const [editingOrderId, setEditingOrderId] = useState(null);
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

//   const fetchOrders = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`${BASE_URL}/api/orders/my-orders`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setOrders(Array.isArray(response.data) ? response.data : []);
//     } catch (err) {
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const cancelOrder = async (id) => {
//     const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
//     if (!confirmCancel) return;

//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`${BASE_URL}/api/orders/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       fetchOrders();
//     } catch (err) {
//       alert("Failed to cancel order");
//     }
//   };

//   // --- Step 2: Reschedule (Time Slot Change) Logic ---
//   const handleOpenTimeSlotEditor = (order) => {
//     setEditingOrderId(order._id);
//     setSelectedTimeSlot(order.address?.timeSlot || "");
//   };

//   const handleTimeSlotChange = (e) => {
//     setSelectedTimeSlot(e.target.value);
//   };

//   const handleSaveTimeSlot = async (order) => {
//     if (!selectedTimeSlot || selectedTimeSlot === order.address?.timeSlot) {
//       setEditingOrderId(null);
//       return;
//     }
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         `${BASE_URL}/api/orders/${order._id}/change-timeslot`,
//         { timeSlot: selectedTimeSlot },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setEditingOrderId(null);
//       fetchOrders();
//     } catch (err) {
//       alert("Failed to update time slot.");
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingOrderId(null);
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
//       {/* Header - Mobile optimized */}
//       <div className="flex items-center mb-6 sm:mb-8">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-indigo-600"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//         </svg>
//         <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">My Orders</h1>
//       </div>

//       {loading ? (
//         <div className="space-y-4 sm:space-y-6">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
//               <div className="flex justify-between">
//                 <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/3 sm:w-1/4"></div>
//                 <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/4 sm:w-1/6"></div>
//               </div>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-4 sm:mt-6">
//                 <div className="space-y-3">
//                   <div className="h-4 bg-gray-200 rounded w-1/3"></div>
//                   <div className="h-4 bg-gray-200 rounded w-full"></div>
//                   <div className="h-4 bg-gray-200 rounded w-2/3"></div>
//                 </div>
//                 <div className="h-48 sm:h-64 bg-gray-200 rounded-lg"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : orders.length === 0 ? (
//         <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-sm text-center max-w-md mx-auto">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v16a2 2 0 01-2 2z" />
//           </svg>
//           <h3 className="mt-4 sm:mt-5 text-base sm:text-lg font-medium text-gray-900">No orders yet</h3>
//           <p className="mt-1 sm:mt-2 text-sm text-gray-500">You haven't placed any orders yet.</p>
//           <button
//             onClick={() => (window.location.href = "/products")}
//             className="mt-4 sm:mt-6 px-4 sm:px-5 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm sm:text-base"
//           >
//             Browse Services
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-4 sm:space-y-6">
//           {orders.map((order) => (
//             <div
//               key={order._id}
//               className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl shadow-sm border border-gray-100"
//             >
//               {/* Header - Mobile optimized layout */}
//               <div className="flex flex-col gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1 min-w-0">
//                     <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 truncate">
//                       Order #{order._id.slice(-8).toUpperCase()}
//                     </h2>
//                     <p className="text-xs sm:text-sm text-gray-500 mt-1">
//                       {new Date(order.createdAt).toLocaleString("en-IN", {
//                         dateStyle: "short",
//                         timeStyle: "short",
//                       })}
//                     </p>
//                   </div>
//                   <div className="flex flex-col items-end gap-2 ml-3">
//                     <p className="text-base sm:text-lg font-semibold text-gray-800">₹{order.totalAmount}</p>
//                     <span
//                       className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${
//                         order.status === "Cancelled"
//                           ? "bg-red-100 text-red-800"
//                           : order.status === "Completed"
//                           ? "bg-green-100 text-green-800"
//                           : "bg-yellow-100 text-yellow-800"
//                       }`}
//                     >
//                       {order.status}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Partner assignment message - Mobile optimized */}
//               {order.partner && order.partner.name && (
//                 <div className="mb-4 flex items-start gap-2 sm:gap-3 bg-green-50 border border-green-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3">
//                   <svg className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A7 7 0 0012 19a7 7 0 006.879-1.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                   </svg>
//                   <div className="min-w-0 flex-1">
//                     <span className="block text-green-700 font-semibold text-sm sm:text-base">
//                       Partner Assigned: {order.partner.name}
//                     </span>
//                     <span className="block text-green-600 text-xs sm:text-sm mt-0.5 leading-relaxed">
//                       Partner is assigned. We will share the details before the time slot. Thank you!
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {/* Start/Complete Codes - Mobile stacked layout */}
//               <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
//                 <div className="bg-green-50 p-3 rounded-lg border border-green-200">
//                   <span className="block text-xs text-green-600 mb-1 font-medium">Happy Code (Share with Partner to begin):</span>
//                   <div className="flex items-center justify-between">
//                     <span className="font-mono font-bold text-base sm:text-lg text-green-700">{order.happyCode || "----"}</span>
//                     <button className="text-green-600 p-1" onClick={() => navigator.clipboard?.writeText(order.happyCode || "")}>
//                       <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//                 <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
//                   <span className="block text-xs text-blue-600 mb-1 font-medium">Complete Code (Share to mark finished):</span>
//                   <div className="flex items-center justify-between">
//                     <span className="font-mono font-bold text-base sm:text-lg text-blue-700">{order.completeCode || "----"}</span>
//                     <button className="text-blue-600 p-1" onClick={() => navigator.clipboard?.writeText(order.completeCode || "")}>
//                       <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Order Details - Mobile first approach */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
//                 {/* Address - Mobile optimized */}
//                 <div className="bg-gray-50 sm:bg-white sm:shadow-md p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gray-200">
//                   <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4 sm:h-6 sm:w-6 mr-2 text-indigo-600"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                       />
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                       />
//                     </svg>
//                     Delivery Address
//                   </h3>
//                   <div className="space-y-3 sm:space-y-4 text-gray-700">
//                     <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
//                       <span className="text-xs sm:text-sm text-gray-500 sm:w-28">🏠 House No:</span>
//                       <span className="text-sm font-medium">{order.address?.houseNumber}</span>
//                     </div>
//                     <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
//                       <span className="text-xs sm:text-sm text-gray-500 sm:w-28">🛣️ Street:</span>
//                       <span className="text-sm font-medium break-words">{order.address?.street}</span>
//                     </div>
//                     {order.address?.landmark && (
//                       <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
//                         <span className="text-xs sm:text-sm text-gray-500 sm:w-28">📍 Landmark:</span>
//                         <span className="text-sm font-medium">{order.address.landmark}</span>
//                       </div>
//                     )}
//                     <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
//                       <span className="text-xs sm:text-sm text-gray-500 sm:w-28">🏷️ Type:</span>
//                       <span className="text-sm font-medium">{order.address?.addressType}</span>
//                     </div>
//                     <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
//                       <span className="text-xs sm:text-sm text-gray-500 sm:w-28">⏰ Time Slot:</span>
//                       <div className="text-sm font-medium">
//                         {order.requestStatus === "NoPartner" ? (
//                           editingOrderId === order._id ? (
//                             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                               <select
//                                 value={selectedTimeSlot}
//                                 onChange={handleTimeSlotChange}
//                                 className="border rounded px-2 py-1 text-sm w-full sm:w-auto"
//                               >
//                                 <option value="">Select a time slot</option>
//                                 {AVAILABLE_TIME_SLOTS.map((slot) => (
//                                   <option key={slot} value={slot}>{slot}</option>
//                                 ))}
//                               </select>
//                               <div className="flex gap-2 w-full sm:w-auto">
//                                 <button
//                                   className="flex-1 sm:flex-none px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
//                                   onClick={() => handleSaveTimeSlot(order)}
//                                 >
//                                   Save
//                                 </button>
//                                 <button
//                                   className="flex-1 sm:flex-none px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-xs"
//                                   onClick={handleCancelEdit}
//                                 >
//                                   Cancel
//                                 </button>
//                               </div>
//                             </div>
//                           ) : (
//                             <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//                               <span>{order.address?.timeSlot}</span>
//                               <button
//                                 className="self-start px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
//                                 onClick={() => handleOpenTimeSlotEditor(order)}
//                               >
//                                 Change
//                               </button>
//                             </div>
//                           )
//                         ) : (
//                           order.address?.timeSlot
//                         )}
//                       </div>
//                     </div>
//                     {/* Time slot warning */}
//                     {order.requestStatus === "NoPartner" && (
//                       <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-600 border border-red-200">
//                         ⚠️ No partner was available in your selected time slot. Please choose a different time slot.
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Order Items - Mobile optimized */}
//                 <div className="rounded-lg sm:rounded-xl shadow-sm sm:shadow-md bg-gray-50 sm:bg-white p-3 sm:p-4 flex flex-col gap-3">
//                   <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3 flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-indigo-600"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
//                       />
//                     </svg>
//                     Order Items
//                   </h3>
//                   <div className="flex flex-col gap-3 sm:gap-4">
//                     {(Array.isArray(order.items) ? order.items : []).map((item, idx) => (
//                       <div
//                         key={idx}
//                         className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5 border border-gray-200 rounded-lg p-3 sm:p-4 bg-white"
//                       >
//                         {/* IMAGE - Mobile full width, desktop left */}
//                         <img
//                           src={`${BASE_URL}/uploads/${item.imageUrl}`}
//                           className="w-full h-32 sm:w-32 sm:h-32 object-cover rounded-lg border shadow"
//                           alt={item.title}
//                           onError={e => {
//                             e.target.src = "https://via.placeholder.com/128x128?text=Service";
//                           }}
//                         />
//                         {/* Service info - Mobile below image */}
//                         <div className="flex flex-col flex-1 justify-between">
//                           <div>
//                             <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-1">{item.title}</h4>
//                             {Array.isArray(item.subServices) && item.subServices.length > 0 && (
//                               <ul className="mb-2 mt-1 text-gray-700 text-sm sm:text-base space-y-1">
//                                 {item.subServices.map((sub, subIdx) => (
//                                   <li key={subIdx} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
//                                     <span className="flex-1 pr-2">{sub.title}</span>
//                                     <span className="text-gray-800 font-semibold">₹{sub.price}</span>
//                                   </li>
//                                 ))}
//                               </ul>
//                             )}
//                           </div>
//                           <div className="flex justify-between items-end sm:flex-col sm:items-end pt-2">
//                             <span className="text-xs text-gray-500 font-medium mb-0.5">
//                               Visiting Price
//                             </span>
//                             <span className="text-indigo-700 font-bold text-lg">₹{item.price}</span>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Cancel Button - Mobile optimized */}
//               {order.status !== "Cancelled" && order.status !== "Completed" && (
//                 <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100 flex justify-center sm:justify-end">
//                   <button
//                     onClick={() => cancelOrder(order._id)}
//                     className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4 mr-2"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                     Cancel Order
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }