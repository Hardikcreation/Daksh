import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function AssignOrder() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [eligibleProviders, setEligibleProviders] = useState([]);
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showAllOrders, setShowAllOrders] = useState(false);
  const [showAllStatus, setShowAllStatus] = useState(false);

  const topRef = useRef(null);

  function getAdminToken() {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("You are not logged in as admin. Please log in again.");
      throw new Error("No admin token");
    }
    return token;
  }

  useEffect(() => {
    let ignore = false;
    async function fetchOrders() {
      try {
        const token = getAdminToken();
        const res = await axios.get(`${API_BASE}/api/orders/AllOrders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (ignore) return;
        setOrders(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          alert("Session expired or unauthorized. Please log in again.");
        } else {
          alert("Failed to load orders.");
        }
      }
    }
    fetchOrders();
    return () => { ignore = true; };
  }, []);

  const handleSelectOrder = async (order) => {
    setSelectedOrder(order);
    try {
      const token = getAdminToken();
      const res = await axios.get(
        `${API_BASE}/api/orders/${order._id}/eligible-providers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrderDetail(res.data.order);
      setEligibleProviders(res.data.eligibleProviders);
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Session expired or unauthorized. Please log in again.");
        return;
      }
      try {
        const token = getAdminToken();
        const res2 = await axios.get(
          `${API_BASE}/api/partners?category=${order.items[0].title}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEligibleProviders(res2.data);
      } catch (e) {
        setEligibleProviders([]);
      }
      setOrderDetail(order);
    }
  };

  const handleAssign = async (partnerId) => {
    setLoading(true);
    try {
      const token = getAdminToken();
      await axios.post(
        `${API_BASE}/api/orders/assign-partner-manual/${selectedOrder._id}`,
        { partnerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Partner assigned!");
      setLoading(false);
      setSelectedOrder(null);
      setOrderDetail(null);
      setEligibleProviders([]);
      window.location.reload();
    } catch (err) {
      setLoading(false);
      if (err.response?.status === 401) {
        alert("Session expired or unauthorized. Please log in again.");
      } else {
        alert("Failed to assign partner.");
      }
    }
  };

  // Always sort orders by date descending (newest first)
  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Assign section: only show assignable orders
  const filteredOrders = sortedOrders.filter(order =>
    ["Pending", "NoPartner", "No service provider is available"].includes(order.requestStatus)
  );
  const showOrders = showAllOrders ? filteredOrders : filteredOrders.slice(0, 5);

  // Status section: show all or only latest 5
  const showStatusOrders = showAllStatus ? sortedOrders : sortedOrders.slice(0, 5);

  // Scroll to top handler
  const handleScrollTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="ml-64 min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 p-10 font-sans relative">
      <div ref={topRef}></div>

      {/* Move to Top Floating Button */}
      <button
        onClick={handleScrollTop}
        className="fixed right-8 bottom-8 bg-indigo-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition z-50"
        style={{ position: "fixed", zIndex: 1000 }}
        title="Move to top"
      >
        ⬆️ Top
      </button>

    <div className="bg-white rounded-xl shadow-lg p-8 max-w-5xl mx-auto mb-10">
  <h2 className="text-3xl font-bold text-indigo-600 text-center mb-4">Assign Service/Order</h2>
  {!selectedOrder ? (
    <>
      <table className="w-full mt-6 mb-4">
        <thead>
          <tr>
            <th className="bg-indigo-500 text-white font-semibold py-3 px-2 rounded-tl-lg">
              Order ID &<br />Date/Time
            </th>
            <th className="bg-indigo-500 text-white font-semibold py-3 px-2">Service</th>
            <th className="bg-indigo-500 text-white font-semibold py-3 px-2">User</th>
            <th className="bg-indigo-500 text-white font-semibold py-3 px-2">Status</th>
            <th className="bg-indigo-500 text-white font-semibold py-3 px-2">Accepted Provider</th>
            <th className="bg-indigo-500 text-white font-semibold py-3 px-2 rounded-tr-lg">Assign</th>
          </tr>
        </thead>
        <tbody>
          {showOrders.map(order => (
            <tr key={order._id} className="mb-2">
              <td className="bg-gray-50 text-center py-2 px-2 rounded-l-lg">
                {order._id}
                <br />
                <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
              </td>
              <td className="bg-gray-50 text-center py-2 px-2">{order.items[0].title}</td>
              <td className="bg-gray-50 text-center py-2 px-2">{order.user?.name}</td>
              <td className="bg-gray-50 text-center py-2 px-2">
                <span className={`px-3 py-1 rounded-lg font-semibold
                  ${order.requestStatus === "Pending"
                    ? "bg-red-100 text-red-600"
                    : order.requestStatus === "Accepted"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"}`}>
                  {order.requestStatus}
                </span>
              </td>
              {/* Accepted Provider column */}
              <td className="bg-gray-50 text-center py-2 px-2">
                {(order.requestStatus === "Accepted" || order.status === "Confirmed") && order.assignedPartner
                  ? <span className="text-green-600 font-semibold">
                      {order.assignedPartner.name} ({order.assignedPartner.email})
                    </span>
                  : <span className="text-gray-400">None</span>}
              </td>
              <td className="bg-gray-50 text-center py-2 px-2 rounded-r-lg">
                <button
                  className="bg-gradient-to-r from-indigo-500 to-green-300 text-white px-5 py-2 rounded shadow hover:from-indigo-600 transition"
                  onClick={() => handleSelectOrder(order)}
                >
                  Assign Partner
                </button>
              </td>
            </tr>
          ))}
          {!showOrders.length &&
            <tr>
              <td className="bg-gray-50 py-2 px-2 text-center" colSpan={6}>
                <span className="text-gray-500">No unassigned orders found.</span>
              </td>
            </tr>
          }
        </tbody>
      </table>
      {filteredOrders.length > 5 &&
        <div className="flex justify-center mb-2">
          <button
            className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded shadow hover:bg-indigo-200 transition"
            onClick={() => setShowAllOrders(s => !s)}
          >
            {showAllOrders ? "Show Less" : "Show More"}
          </button>
        </div>
      }
    </>
  ) : (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Order Details</h3>
      {orderDetail && (
        <div className="bg-gray-50 rounded-lg p-5 mb-4 shadow">
          <p><b>Order ID:</b> {orderDetail._id}</p>
          <p><b>Created At:</b> {new Date(orderDetail.createdAt).toLocaleString()}</p>
          <p><b>Service:</b> {orderDetail.items?.[0]?.title}</p>
          <p><b>User:</b> {orderDetail.user?.name}</p>
          <p><b>User Email:</b> {orderDetail.user?.email}</p>
          <p><b>Address:</b> {orderDetail.address?.fullAddress}</p>
          <p><b>Status:</b> {orderDetail.requestStatus}</p>
          <p><b>Current Assigned Provider:</b> {orderDetail.assignedPartner ? `${orderDetail.assignedPartner.name} (${orderDetail.assignedPartner.email})` : "None"}</p>
          <p>
            <b>Requests sent to:</b>{" "}
            {[...(orderDetail.rejectedPartners || []), ...(orderDetail.assignedPartner ? [orderDetail.assignedPartner] : [])]
              .map(p => `${p.name} (${p.email})`).join(", ") || "—"}
          </p>
        </div>
      )}
      <h4 className="text-base font-semibold text-gray-600 mb-1">Eligible Providers</h4>
      <ul className="mb-3">
        {eligibleProviders.map(partner => (
          <li key={partner._id} className="flex items-center bg-white shadow rounded mb-2 px-4 py-3">
            <span className="flex-1">
              <b>{partner.name}</b> ({partner.email})
              {partner.phone && <> - {partner.phone}</>}
            </span>
            <button
              disabled={loading}
              className={`ml-4 px-4 py-2 rounded font-semibold shadow
                ${loading ? "bg-gray-300 text-white cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600 text-white"}`}
              onClick={() => handleAssign(partner._id)}
            >
              {loading ? "Assigning..." : "Assign"}
            </button>
          </li>
        ))}
        {!eligibleProviders.length &&
          <li className="px-4 py-2 text-gray-400 bg-white rounded">No eligible providers found.</li>
        }
      </ul>
      <button className="bg-indigo-50 text-indigo-600 px-6 py-2 rounded shadow hover:bg-indigo-100 mt-2" onClick={() => setSelectedOrder(null)}>
        &larr; Back to Orders
      </button>
    </div>
  )}
</div>

      {/* Orders & Providers Status List Section */}
     <div className="bg-white rounded-xl shadow-lg p-8 max-w-5xl mx-auto mt-8 mb-20">
  <h2 className="text-2xl font-bold text-indigo-600 mb-7 text-center">Orders & Providers Status</h2>
  <div className="overflow-x-auto">
    <table className="min-w-full border-separate border-spacing-y-2">
      <thead>
        <tr>
          <th className="bg-indigo-400 text-white font-semibold py-2 px-2 rounded-tl-lg">Order ID &<br/>Date/Time</th>
          <th className="bg-indigo-400 text-white font-semibold py-2 px-2">Service</th>
          <th className="bg-indigo-400 text-white font-semibold py-2 px-2">Accepted Provider</th>
          {/* Removed Rejected Providers column */}
          <th className="bg-indigo-400 text-white font-semibold py-2 px-2 rounded-tr-lg">Status</th>
        </tr>
      </thead>
      <tbody>
        {showStatusOrders.map(order => (
          <tr key={order._id}>
            <td className="bg-gray-50 py-2 px-2 rounded-l-lg text-center">
              {order._id}
              <br />
              <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</span>
            </td>
            <td className="bg-gray-50 py-2 px-2 text-center">{order.items?.[0]?.title}</td>
            <td className="bg-gray-50 py-2 px-2 text-center">
              {order.assignedPartner
                ? <span className="text-green-600 font-semibold">
                    {order.assignedPartner.name} ({order.assignedPartner.email})
                  </span>
                : <span className="text-gray-400">None</span>}
            </td>
            {/* Removed Rejected Providers cell */}
            <td className="bg-gray-50 py-2 px-2 rounded-r-lg text-center">
              <span className={`px-3 py-1 rounded-lg font-semibold
                ${order.requestStatus === "Pending"
                  ? "bg-red-100 text-red-600"
                  : order.requestStatus === "Completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
                }`}>
                {order.requestStatus}
              </span>
            </td>
          </tr>
        ))}
        {!showStatusOrders.length && (
          <tr>
            <td className="bg-gray-50 py-2 px-2 text-center" colSpan={4}>
              <span className="text-gray-500">No orders found.</span>
            </td>
          </tr>
        )}
      </tbody>
    </table>
    {orders.length > 5 &&
      <div className="flex justify-center mt-3">
        <button
          className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded shadow hover:bg-indigo-200 transition"
          onClick={() => setShowAllStatus(s => !s)}
        >
          {showAllStatus ? "Show Less" : "Show More"}
        </button>
      </div>
    }
  </div>
</div>
    </div>
  );
}