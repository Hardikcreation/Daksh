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

export default function PartnerDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    earnings: 0,
    completedOrders: 0,
    incompleteOrders: 0,
  });

  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [partnerOrders, setPartnerOrders] = useState([]); // <-- NEW for showing user details
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

    // Fetch partner orders for user details (name/email/phone)
    const fetchPartnerOrders = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/orders/partner-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPartnerOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setPartnerOrders([]);
      }
    };

    fetchDashboardData();
    fetchRequests();
    fetchPartnerOrders();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
    // Note: partnerOrders not in deps, only fetch on mount
    // eslint-disable-next-line
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
      color: "from-blue-500 to-blue-600",
      icon: "📊",
      onClick: () => navigate("/partner-orders"),
    },
    {
      title: "Earnings",
      value: `₹${stats.earnings.toLocaleString()}`,
      color: "from-green-500 to-green-600",
      icon: "💰",
      onClick: () => navigate("/partner-earnings"),
    },
    {
      title: "Completed",
      value: stats.completedOrders,
      color: "from-purple-500 to-purple-600",
      icon: "✅",
      onClick: () => navigate("/partner-orders?filter=Completed"),
    },
    {
      title: "Pending",
      value: stats.incompleteOrders,
      color: "from-orange-500 to-orange-600",
      icon: "⏳",
      onClick: () => navigate("/partner-orders?filter=Incomplete"),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile App Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM13 10a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1h-6a1 1 0 01-1-1v-2zM13 16a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1h-6a1 1 0 01-1-1v-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-xs text-gray-500 md:hidden">Partner Portal</p>
            </div>
          </div>
          
          {/* Notification Bell */}
          <div className="relative">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5-5-5h5zm0 0V3"/>
              </svg>
            </div>
            {pendingRequests.length > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{pendingRequests.length}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Date - Hidden on mobile, shown on desktop */}
        <div className="hidden md:block text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="px-4 py-6 md:px-6 max-w-7xl mx-auto">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={card.onClick}
              className={`cursor-pointer bg-gradient-to-r ${card.color} text-white p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95`}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl md:text-3xl">{card.icon}</span>
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xs md:text-sm font-medium opacity-90 mb-1">{card.title}</h3>
                  <p className="text-lg md:text-2xl font-bold">{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="bg-white/70 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg border border-white/50">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-3 md:space-y-0">
            <h3 className="text-lg md:text-xl font-bold text-gray-800">Order Statistics</h3>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-600">Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm text-gray-600">Incomplete</span>
              </div>
            </div>
          </div>

          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
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
                  tick={{ fill: "#6B7280", fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "rgba(255, 255, 255, 0.95)", 
                    border: "none", 
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
                  }} 
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions - Mobile Only */}
        <div className="md:hidden mt-6 grid grid-cols-2 gap-3">
          <button 
            onClick={() => navigate("/partner-orders")}
            className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50 flex items-center space-x-3 hover:bg-white/90 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-lg">📋</span>
            </div>
            <span className="font-medium text-gray-700">View Orders</span>
          </button>
          
          <button 
            onClick={() => navigate("/partner-earnings")}
            className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50 flex items-center space-x-3 hover:bg-white/90 transition-colors"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-lg">💳</span>
            </div>
            <span className="font-medium text-gray-700">Earnings</span>
          </button>
        </div>

        {/* Show assigned user details for each partner order */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-700 mb-2">Recent Orders & Customer Details</h2>
          <div className="space-y-6">
            {partnerOrders.length === 0 && (
              <div className="text-gray-500 text-sm">No assigned orders yet.</div>
            )}
            {partnerOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-blue-600 font-bold">Order #{order._id.slice(-8).toUpperCase()}</div>
                  <div className="mt-1 text-gray-700 text-sm">
                    <span>{order.user?.name}</span> <br />
                    <span>{order.user?.email}</span> <br />
                    <span>{order.user?.phone}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {order.address?.fullAddress} <br />
                    {order.address?.timeSlot}
                  </div>
                </div>
                <div className="mt-2 md:mt-0 md:text-right">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    order.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : order.status === "processing"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "Confirmed"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-200 text-gray-500"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Notification Modal */}
      {pendingRequests.map((req) => (
        <div
          key={req._id}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🔔</span>
                </div>
                <h2 className="text-xl font-bold text-white">New Service Request</h2>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-blue-500">🛠️</span>
                  <div>
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-semibold text-gray-800">{req.items?.[0]?.title}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-green-500">👤</span>
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-semibold text-gray-800">{req.user?.name}</p>
                    <p className="text-gray-600 text-xs">{req.user?.email}</p>
                    <p className="text-gray-600 text-xs">{req.user?.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500">📍</span>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-semibold text-gray-800">{req.address?.fullAddress}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-purple-500">⏰</span>
                  <div>
                    <p className="text-sm text-gray-500">Time Slot</p>
                    <p className="font-semibold text-gray-800">{req.address?.timeSlot}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Actions */}
            <div className="px-6 pb-6 flex space-x-3">
              <button
                onClick={() => handleResponse(req._id, "Declined")}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors active:scale-95"
              >
                Decline
              </button>
              <button
                onClick={() => handleResponse(req._id, "Accepted")}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors active:scale-95"
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