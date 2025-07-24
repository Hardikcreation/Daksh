import { useEffect, useState } from "react";
import axios from "axios";

const AllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [solutions, setSolutions] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedTicket, setExpandedTicket] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/tickets/all");
      setTickets(res.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const solveTicket = async (id) => {
    try {
      await axios.patch(`/api/tickets/solve/${id}`, { solution: solutions[id] });
      // Clear solution for this ticket
      setSolutions(prev => {
        const newSols = { ...prev };
        delete newSols[id];
        return newSols;
      });
      fetchTickets();
    } catch (error) {
      console.error("Error solving ticket:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSolutionChange = (id, value) => {
    setSolutions(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const toggleExpand = (id) => {
    setExpandedTicket(expandedTicket === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-700">All Support Tickets</h2>
        <div className="text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
          {tickets.length} {tickets.length === 1 ? "Ticket" : "Tickets"}
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No tickets found</h3>
          <p className="text-gray-500">All support requests have been resolved</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((t) => (
            <div key={t._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div 
                className="p-4 cursor-pointer flex justify-between items-start"
                onClick={() => toggleExpand(t._id)}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      t.userType === "User" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {t.userType}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      t.status === "open" 
                        ? "bg-yellow-100 text-yellow-800" 
                        : "bg-green-100 text-green-800"
                    }`}>
                      {t.status === "open" ? "Open" : "Solved"}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800">{t.subject}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    From: {t.name} • {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(t._id);
                  }}
                >
                  {expandedTicket === t._id ? "▲" : "▼"}
                </button>
              </div>
              
              {expandedTicket === t._id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Message:</h4>
                    <p className="text-gray-600 whitespace-pre-line">{t.message}</p>
                  </div>
                  
                  {t.status === "open" ? (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add Solution:
                      </label>
                      <textarea
                        placeholder="Write your solution here..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows={4}
                        value={solutions[t._id] || ""}
                        onChange={(e) => handleSolutionChange(t._id, e.target.value)}
                      />
                      <div className="mt-3 flex justify-end gap-2">
                        <button
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                          onClick={() => toggleExpand(t._id)}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                          onClick={() => solveTicket(t._id)}
                          disabled={!solutions[t._id]?.trim()}
                        >
                          Mark as Solved
                        </button>
                      </div>
                    </div>
                  ) : (
                    t.solution && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Solution:</h4>
                        <p className="text-gray-600 bg-white p-3 rounded-lg border border-gray-200 whitespace-pre-line">
                          {t.solution}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTickets;