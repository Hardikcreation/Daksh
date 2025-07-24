import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  
  // Navigation items with icons
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/help-query", label: "Help Query", icon: "❓" },
    { path: "/logout", label: "Logout", icon: "🚪" },
  ];

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-indigo-700 to-indigo-900 text-white p-6 flex flex-col fixed">
      {/* Branding */}
      <div className="mb-10 pt-4 flex items-center gap-3 border-b border-indigo-500 pb-6">
        <div className="bg-white text-indigo-700 w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold">
          CC
        </div>
        <div>
          <h1 className="text-2xl font-bold">CallCentre</h1>
          <p className="text-indigo-300 text-xs">Support Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-indigo-600 hover:shadow-md ${
              location.pathname === item.path
                ? "bg-white text-indigo-700 font-semibold shadow-lg"
                : "text-indigo-100"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="mt-auto pt-6 border-t border-indigo-500">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500 w-12 h-12 rounded-full flex items-center justify-center text-lg">
            👤
          </div>
          <div>
            <p className="font-medium">Admin User</p>
            <p className="text-indigo-300 text-sm">admin@callcentre.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;