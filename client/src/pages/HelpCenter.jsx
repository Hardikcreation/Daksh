import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function HelpCenter() {
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    subject: "",
    message: "",
    issueType: "",
    orderId: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch user profile, orders, and tickets on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm((prev) => ({
          ...prev,
          name: res.data.name || "",
          phone: res.data.phone || "",
        }));
      } catch (err) {
        // fallback or leave blank
      }
    };
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        setOrders([]);
      }
    };
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/tickets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(res.data);
      } catch (err) {
        setTickets([]);
      }
    };
    fetchProfile();
    fetchOrders();
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/api/tickets`,
        {
          ...form,
          orderId: form.orderId || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Query submitted successfully!");
      setForm((prev) => ({
        ...prev,
        subject: "",
        message: "",
        issueType: "",
        orderId: ""
      }));
      // Refresh tickets
      const res = await axios.get(`${BASE_URL}/api/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data);
    } catch (err) {
      setError("Failed to submit query. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Help Center</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-10 space-y-6">
          <h2 className="text-xl font-semibold text-indigo-700 mb-2">Submit a Query</h2>
          {success && <div className="bg-green-50 text-green-700 p-2 rounded">{success}</div>}
          {error && <div className="bg-red-50 text-red-700 p-2 rounded">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order (optional)</label>
            <select
              name="orderId"
              value={form.orderId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select an order (if related)</option>
              {orders.map((order) => (
                <option key={order._id} value={order._id}>
                  {order._id} - {order.status} - {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
            <select
              name="issueType"
              value={form.issueType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select issue type</option>
              <option value="Booking">Booking Issue</option>
              <option value="Payment">Payment Issue</option>
              <option value="Service">Service Quality</option>
              <option value="Technical">Technical Problem</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              rows={4}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-semibold"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Query"}
          </button>
        </form>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">Your Previous Queries</h2>
          {tickets.length === 0 ? (
            <div className="text-gray-500 text-center">No queries submitted yet.</div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket._id} className="border p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium text-gray-800">{ticket.subject}</span>
                      {ticket.orderId && (
                        <span className="ml-2 text-xs text-gray-500">Order: {ticket.orderId._id || ticket.orderId}</span>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ticket.status === "solved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {ticket.status === "solved" ? "Solved" : "Pending"}
                    </span>
                  </div>
                  <div className="text-gray-700 mb-2">{ticket.message}</div>
                  {ticket.solution && (
                    <div className="bg-blue-50 p-2 rounded text-blue-800 mb-1">
                      <span className="font-medium">Solution:</span> {ticket.solution}
                    </div>
                  )}
                  <div className="text-xs text-gray-400">{ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : ""}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}