import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function getDateNDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function HelpQuery() {
  const [queries, setQueries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [replyingId, setReplyingId] = useState(null);
  const [reply, setReply] = useState({ solution: "", status: "solved" });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchQueries = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/tickets/all`);
      setQueries(res.data);
    } catch (err) {
      setQueries([]);
    }
  }, []);

  useEffect(() => {
    fetchQueries();
  }, [fetchQueries]);

  useEffect(() => {
    let filteredTickets = [...queries];

    if (filter === "1d") {
      const from = getDateNDaysAgo(1);
      filteredTickets = filteredTickets.filter(q => new Date(q.createdAt) >= from);
    } else if (filter === "3d") {
      const from = getDateNDaysAgo(3);
      filteredTickets = filteredTickets.filter(q => new Date(q.createdAt) >= from);
    } else if (filter === "7d") {
      const from = getDateNDaysAgo(7);
      filteredTickets = filteredTickets.filter(q => new Date(q.createdAt) >= from);
    } else if (filter === "custom" && customFrom && customTo) {
      const from = new Date(customFrom);
      const to = new Date(customTo);
      to.setHours(23, 59, 59, 999);
      filteredTickets = filteredTickets.filter(q => {
        const created = new Date(q.createdAt);
        return created >= from && created <= to;
      });
    }
    setFiltered(filteredTickets);
  }, [queries, filter, customFrom, customTo]);

  // Only set reply state when opening the reply box!
  const handleReplyClick = (id, currentSolution, currentStatus) => {
    setReplyingId(id);
    setReply({ solution: currentSolution || "", status: currentStatus || "solved" });
  };

  const handleReplyChange = (e) => {
    setReply(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReplySubmit = async (id) => {
    setLoading(true);
    try {
      await axios.patch(`${API_BASE}/api/tickets/${id}`, reply);
      setReplyingId(null);
      setReply({ solution: "", status: "solved" });
      fetchQueries();
    } catch (err) {
      alert("Failed to update ticket");
    }
    setLoading(false);
  };

  const isSolved = (ticket) => ticket.status === "solved";

  const statusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
    if (status === "solved") return <span className={`${baseClasses} bg-green-100 text-green-800`}>Solved</span>;
    if (status === "open") return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
    return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
  };

  const getDisplayedQueries = () => {
    let result = filtered;
    if (activeTab === "users") result = result.filter(q => q.userType === "User");
    if (activeTab === "partners") result = result.filter(q => q.userType === "Partner");
    if (statusFilter !== "all") result = result.filter(q => q.status === statusFilter);
    return result;
  };

  // QueryCard is now a pure function, not a component, to avoid state reset
  function renderQueryCard(query) {
    return (
      <div key={query._id} className={`border p-4 rounded-lg mb-4 shadow-sm transition-all hover:shadow-md ${
        isSolved(query) ? "bg-gray-50" : "bg-white"
      }`}>
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-lg font-semibold text-gray-800">{query.subject}</h4>
          <div className="flex items-center space-x-2">
            {statusBadge(query.status)}
            <span className="text-xs text-gray-500">
              {new Date(query.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div>
            <p className="text-gray-600"><span className="font-medium">From:</span> {query.name}</p>
            <p className="text-gray-600"><span className="font-medium">Type:</span> {query.issueType}</p>
          </div>
          <div>
            <p className="text-gray-600"><span className="font-medium">Email:</span> {query.email}</p>
            <p className="text-gray-600"><span className="font-medium">Phone:</span> {query.phone || 'N/A'}</p>
          </div>
        </div>
        <div className="mb-3">
          <p className="text-gray-700">{query.message}</p>
        </div>
        {query.solution && (
          <div className="bg-blue-50 p-3 rounded-md mb-3">
            <p className="font-medium text-blue-800">Our Response:</p>
            <p className="text-blue-700">{query.solution}</p>
          </div>
        )}
        {isSolved(query) ? (
          <div className="mt-2 text-green-600 text-sm font-medium flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            This issue has been resolved
          </div>
        ) : replyingId === query._id ? (
          <div className="mt-3 space-y-2">
            <textarea
              name="solution"
              value={reply.solution}
              onChange={handleReplyChange}
              placeholder="Enter your response here..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <div className="flex items-center space-x-4">
              <select
                name="status"
                value={reply.status}
                onChange={handleReplyChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="open">Pending</option>
                <option value="solved">Solved</option>
              </select>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleReplySubmit(query._id)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : 'Save Response'}
                </button>
                <button
                  onClick={() => setReplyingId(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => handleReplyClick(query._id, query.solution, query.status)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Respond to Query
          </button>
        )}
      </div>
    );
  }

  const FilterControls = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-sm font-medium rounded-l-md ${
                filter === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("1d")}
              className={`px-3 py-1 text-sm font-medium ${
                filter === "1d" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Last 24h
            </button>
            <button
              onClick={() => setFilter("3d")}
              className={`px-3 py-1 text-sm font-medium ${
                filter === "3d" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Last 3d
            </button>
            <button
              onClick={() => setFilter("7d")}
              className={`px-3 py-1 text-sm font-medium ${
                filter === "7d" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Last 7d
            </button>
            <button
              onClick={() => setFilter("custom")}
              className={`px-3 py-1 text-sm font-medium rounded-r-md ${
                filter === "custom" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Custom
            </button>
          </div>
        </div>
        {filter === "custom" && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">From:</label>
              <input
                type="date"
                value={customFrom}
                onChange={e => setCustomFrom(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                max={customTo || undefined}
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">To:</label>
              <input
                type="date"
                value={customTo}
                onChange={e => setCustomTo(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={customFrom || undefined}
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <span className="text-sm font-medium text-gray-700">Status:</span>
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1 text-sm font-medium rounded-l-md ${
              statusFilter === "all" ? "bg-green-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("open")}
            className={`px-3 py-1 text-sm font-medium ${
              statusFilter === "open" ? "bg-yellow-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter("solved")}
            className={`px-3 py-1 text-sm font-medium rounded-r-md ${
              statusFilter === "solved" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Solved
          </button>
        </div>
      </div>
    </div>
  );

  const TabControls = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => setActiveTab("all")}
          className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "all"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          All Queries
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "users"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          User Queries
        </button>
        <button
          onClick={() => setActiveTab("partners")}
          className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "partners"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Partner Queries
        </button>
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Help Desk Tickets</h2>
          <p className="text-gray-600 mt-2">Manage and respond to user and partner queries</p>
        </div>
        <FilterControls />
        <TabControls />
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {getDisplayedQueries().length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No tickets found</h3>
              <p className="mt-1 text-gray-500">
                {filter === "all"
                  ? "There are currently no help tickets."
                  : "No tickets match your current filters."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {getDisplayedQueries().map(query => renderQueryCard(query))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}