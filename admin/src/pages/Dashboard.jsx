import { useEffect, useState } from "react";
import axios from "axios";
import StatsChart from "../Components/StatsChart";
import { 
  FiTool, 
  FiUsers, 
  FiPackage, 
  FiUserCheck,
  FiCalendar,
  FiTrendingUp,
  FiRefreshCw
} from "react-icons/fi";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export default function Dashboard() {
  const [stats, setStats] = useState({ 
    products: 0, 
    users: 0, 
    orders: 0, 
    partners: 0 
  });
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState("annual");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/dashboard/stats`);
      setStats(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="lg:ml-64 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FiTrendingUp className="text-blue-600" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
              Overview of your platform statistics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
              Last updated: {lastUpdated.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit'
              })}
            </div>
            <button 
              onClick={fetchStats}
              className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="Refresh data"
            >
              <FiRefreshCw className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard 
            label="Services" 
            value={stats.products} 
            color="indigo" 
            icon={<FiTool size={20} />}
            loading={loading}
          />
          <StatCard 
            label="Users" 
            value={stats.users} 
            color="green" 
            icon={<FiUsers size={20} />}
            loading={loading}
          />
          <StatCard 
            label="Orders" 
            value={stats.orders} 
            color="orange" 
            icon={<FiPackage size={20} />}
            loading={loading}
          />
          <StatCard 
            label="Providers" 
            value={stats.partners} 
            color="red" 
            icon={<FiUserCheck size={20} />}
            loading={loading}
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Platform Overview
            </h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveChart("monthly")}
                className={`px-3 py-1 text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-1 ${
                  activeChart === "monthly" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <FiCalendar size={14} />
                <span>Monthly</span>
              </button>
              <button 
                onClick={() => setActiveChart("annual")}
                className={`px-3 py-1 text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-1 ${
                  activeChart === "annual" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <FiCalendar size={14} />
                <span>Annual</span>
              </button>
            </div>
          </div>
          <div className="h-64 sm:h-80">
            <StatsChart data={stats} loading={loading} period={activeChart} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon, loading }) {
  const colorMap = {
    indigo: { 
      bg: "bg-indigo-50", 
      text: "text-indigo-700", 
      border: "border-indigo-100",
      progress: "bg-indigo-200",
      iconBg: "bg-indigo-100"
    },
    green: { 
      bg: "bg-green-50", 
      text: "text-green-700", 
      border: "border-green-100",
      progress: "bg-green-200",
      iconBg: "bg-green-100"
    },
    orange: { 
      bg: "bg-orange-50", 
      text: "text-orange-700", 
      border: "border-orange-100",
      progress: "bg-orange-200",
      iconBg: "bg-orange-100"
    },
    red: { 
      bg: "bg-red-50", 
      text: "text-red-700", 
      border: "border-red-100",
      progress: "bg-red-200",
      iconBg: "bg-red-100"
    },
  };

  return (
    <div className={`${colorMap[color].bg} ${colorMap[color].border} border p-4 sm:p-6 rounded-xl shadow-sm transition-all hover:shadow-md`}>
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-xs font-semibold ${colorMap[color].text} uppercase tracking-wider mb-1`}>
            {label}
          </p>
          {loading ? (
            <div className="h-7 w-3/4 bg-gray-200 rounded mt-1 animate-pulse"></div>
          ) : (
            <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
              {value.toLocaleString()}
            </p>
          )}
        </div>
        <span className={`p-2 sm:p-3 rounded-lg ${colorMap[color].iconBg} text-gray-700`}>
          {icon}
        </span>
      </div>
      <div className="mt-4 sm:mt-6">
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${colorMap[color].progress} rounded-full`} 
            style={{ width: `${Math.min(100, value / 10)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}