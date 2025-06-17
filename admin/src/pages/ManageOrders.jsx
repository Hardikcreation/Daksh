import { useEffect, useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ManageOrders() {
  const [ordersByUser, setOrdersByUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      setError("❌ Admin token missing. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/api/orders/AllOrders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const grouped = {};
      res.data.forEach((order) => {
        const userName = order.user?.name || "Guest";
        if (!grouped[userName]) grouped[userName] = [];
        grouped[userName].push(order);
      });

      for (const user in grouped) {
        grouped[user].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      setOrdersByUser(grouped);
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response?.status === 401) {
        setError("❌ Unauthorized. Please log in as an admin.");
      } else {
        setError("❌ Something went wrong while fetching orders.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrdersByUser = Object.fromEntries(
    Object.entries(ordersByUser).filter(([userName]) =>
      userName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="lg:ml-64 px-4 py-8 mx-auto max-w-6xl">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Manage Orders</h2>

      <div className="mb-6 flex gap-2 flex-wrap">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by user name..."
          className="border px-4 py-2 rounded w-full md:w-1/3"
        />
        <button
          onClick={fetchOrders}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="text-lg">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-lg">{error}</div>
      ) : Object.keys(filteredOrdersByUser).length === 0 ? (
        <div className="text-gray-600">No orders found.</div>
      ) : (
        <div className="space-y-4">
          {Object.entries(filteredOrdersByUser).map(([userName, orders]) => (
            <div key={userName} className="bg-white shadow-sm md:shadow rounded-lg md:rounded-xl border border-gray-200">
              <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 bg-gray-50 rounded-t-lg md:rounded-t-xl">
                <h3 className="text-lg md:text-xl font-semibold text-gray-700">
                  Customer: <span className="text-blue-600">{userName}</span>
                </h3>
                <p className="text-xs md:text-sm text-gray-500">{orders.length} order(s)</p>
              </div>
              <div className="p-3 md:p-4 divide-y divide-gray-100">
                {orders.map((order) => (
                  <div key={order._id} className="py-3 md:py-4 space-y-2">
                    <div className="mb-2 flex flex-col xs:flex-row justify-between text-xs md:text-sm text-gray-500 gap-1">
                      <span className="truncate">Order ID: {order._id}</span>
                      <span>
                        {new Date(order.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>

                    <div className="text-xs md:text-sm text-gray-700 space-y-1">
                      <p><strong className="text-gray-600">🏠 House No:</strong> {order.address?.houseNumber}</p>
                      <p><strong className="text-gray-600">🛣️ Street/Colony:</strong> {order.address?.street}</p>
                      {order.address?.landmark && (
                        <p><strong className="text-gray-600">📍 Landmark:</strong> {order.address.landmark}</p>
                      )}
                      <p><strong className="text-gray-600">🏷️ Address Type:</strong> {order.address?.addressType}</p>
                      <p className="break-words"><strong className="text-gray-600">📬 Full Address:</strong> {order.address?.fullAddress}</p>
                      <p><strong className="text-gray-600">🕑 Time Slot:</strong> {order.address?.timeSlot}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-2 md:gap-3 items-center border p-2 rounded-md bg-gray-50">
                          <img
                            src={`${BASE_URL}/uploads/${item.imageUrl}`}
                            alt={item.title}
                            className="w-10 h-10 md:w-12 md:h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm md:text-base truncate">{item.title}</p>
                            <p className="text-xs md:text-sm text-gray-600">
                              ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2">
                      <span
                        className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-sm md:text-base font-semibold text-gray-700">
                        Total: ₹{order.totalAmount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
