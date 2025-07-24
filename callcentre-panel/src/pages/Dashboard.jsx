import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/tickets/all`);
        setTickets(res.data);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const userQueries = tickets.filter(t => t.userType === "User");
  const partnerQueries = tickets.filter(t => t.userType === "Partner");
  const pendingQueries = tickets.filter(t => t.status === "open");
  const solvedQueries = tickets.filter(t => t.status === "solved");

  // Status colors for consistent styling
  const statusColors = {
    open: "bg-yellow-100 text-yellow-800",
    solved: "bg-green-100 text-green-800",
  };

  // Chart Data
  const barData = {
    labels: ["All Tickets", "User Queries", "Partner Queries", "Pending", "Solved"],
    datasets: [
      {
        label: "Ticket Count",
        data: [
          tickets.length,
          userQueries.length,
          partnerQueries.length,
          pendingQueries.length,
          solvedQueries.length,
        ],
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(250, 204, 21, 0.8)",
          "rgba(107, 114, 128, 0.8)",
        ],
        borderColor: [
          "rgb(79, 70, 229)",
          "rgb(22, 163, 74)",
          "rgb(37, 99, 235)",
          "rgb(234, 179, 8)",
          "rgb(75, 85, 99)",
        ],
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const pieData = {
    labels: ["User Queries", "Partner Queries"],
    datasets: [
      {
        label: "Query Distribution",
        data: [userQueries.length, partnerQueries.length],
        backgroundColor: ["rgba(34, 197, 94, 0.8)", "rgba(59, 130, 246, 0.8)"],
        borderColor: ["rgb(22, 163, 74)", "rgb(37, 99, 235)"],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-2">Call Centre Dashboard</h1>
        <p className="text-gray-600">Analytics and ticket management overview</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <SummaryCard 
          title="Total Tickets" 
          value={tickets.length} 
          color="bg-indigo-100 text-indigo-700" 
          icon="📋"
        />
        <SummaryCard 
          title="User Queries" 
          value={userQueries.length} 
          color="bg-green-100 text-green-700" 
          icon="👤"
        />
        <SummaryCard 
          title="Partner Queries" 
          value={partnerQueries.length} 
          color="bg-blue-100 text-blue-700" 
          icon="🤝"
        />
        <SummaryCard 
          title="Pending" 
          value={pendingQueries.length} 
          color="bg-yellow-100 text-yellow-700" 
          icon="⏱️"
        />
        <SummaryCard 
          title="Solved" 
          value={solvedQueries.length} 
          color="bg-gray-100 text-gray-700" 
          icon="✅"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ChartCard title="Ticket Statistics">
          <Bar 
            data={barData} 
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: { 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  titleColor: '#333',
                  bodyColor: '#333',
                  borderColor: '#eee',
                  borderWidth: 1,
                  padding: 12,
                  cornerRadius: 8,
                }
              },
              scales: {
                y: { 
                  beginAtZero: true, 
                  ticks: { stepSize: 1 },
                  grid: { color: 'rgba(0, 0, 0, 0.05)' }
                },
                x: {
                  grid: { display: false }
                }
              }
            }} 
          />
        </ChartCard>
        
        <ChartCard title="Query Distribution">
          <div style={{ position: 'relative', width: '100%', maxWidth: 400, height: 350, margin: '0 auto' }}>
            <Pie 
              data={pieData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "bottom", labels: { padding: 20 } },
                  tooltip: { 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    bodyColor: '#333',
                    padding: 12,
                    cornerRadius: 8,
                  }
                },
                elements: {
                  arc: {
                    borderWidth: 2
                  }
                }
              }} 
              height={350}
              width={400}
            />
          </div>
        </ChartCard>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">All Tickets</h2>
          <p className="text-sm text-gray-600 mt-1">{tickets.length} total records</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solution</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map(ticket => (
                <tr key={ticket._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{ticket.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ticket.userType === "User" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {ticket.userType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 max-w-xs">
                    {ticket.issueType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[ticket.status]}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 max-w-xs">
                    {ticket.solution || (
                      <span className="text-gray-400 italic">No solution yet</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Reusable Summary Card Component
const SummaryCard = ({ title, value, color, icon }) => (
  <div className={`${color} rounded-xl shadow-sm p-5 transition-all hover:shadow-md`}>
    <div className="flex items-center">
      <div className="text-2xl mr-3">{icon}</div>
      <div>
        <p className="text-sm font-medium opacity-80">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

// Reusable Chart Card Component
const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-md p-5 flex flex-col">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
    <div className="flex-1 min-h-[300px]">
      {children}
    </div>
  </div>
);
  
  export default Dashboard;