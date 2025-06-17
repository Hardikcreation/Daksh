import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes, FaChevronLeft, FaChevronRight, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin-login");
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Utility for NavLink (used below)
  const navLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? "bg-blue-600 text-white"
        : "hover:bg-gray-700 text-gray-300"
    }`;

  return (
    <>
      {/* Mobile Menu Button (only shows on small screens) */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white h-screen p-4 flex flex-col fixed top-0 transition-all duration-300 z-40
          ${isCollapsed ? "w-20" : "w-64"}
          ${isMobileMenuOpen ? "left-0" : "-left-full md:left-0"}
        `}
      >
        {/* Collapse/Expand Button */}
        <button
          onClick={toggleCollapse}
          className="hidden md:flex absolute -right-3 top-6 bg-gray-700 text-white p-1 rounded-full border-2 border-gray-800 hover:bg-gray-600 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
        </button>

        {/* Logo/Title */}
        <h2
          className={`text-xl font-bold mb-8 mt-4 px-4 whitespace-nowrap overflow-hidden ${
            isCollapsed ? "text-center text-sm" : ""
          }`}
        >
          {isCollapsed ? "Admin" : "Admin Dashboard"}
        </h2>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 flex-1">
          <NavLink to="/dashboard" className={navLinkClass}>
            <span className={isCollapsed ? "mx-auto" : ""}>📊</span>
            {!isCollapsed && <span className="ml-3">Dashboard</span>}
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            <span className={isCollapsed ? "mx-auto" : ""}>🛍️</span>
            {!isCollapsed && <span className="ml-3">Manage Products</span>}
          </NavLink>
          <NavLink to="/orders" className={navLinkClass}>
            <span className={isCollapsed ? "mx-auto" : ""}>📦</span>
            {!isCollapsed && <span className="ml-3">Manage Orders</span>}
          </NavLink>
          <NavLink to="/providers" className={navLinkClass}>
            <span className={isCollapsed ? "mx-auto" : ""}>🤝</span>
            {!isCollapsed && <span className="ml-3">Manage Partners</span>}
          </NavLink>
          <NavLink to="/users" className={navLinkClass}>
            <span className={isCollapsed ? "mx-auto" : ""}>👥</span>
            {!isCollapsed && <span className="ml-3">Manage Users</span>}
          </NavLink>
          <NavLink to="/add-service" className={navLinkClass}>
            <span className={isCollapsed ? "mx-auto" : ""}>➕</span>
            {!isCollapsed && <span className="ml-3">Add New Service</span>}
          </NavLink>
          <NavLink to="/admin/register-partners" className={navLinkClass}>
            <span className={isCollapsed ? "mx-auto" : ""}>✅</span>
            {!isCollapsed && <span className="ml-3">Verify Partners</span>}
          </NavLink>
          <NavLink to="/admin/partner-documents" className={navLinkClass}>
            <span className={isCollapsed ? "mx-auto" : ""}>📄</span>
            {!isCollapsed && <span className="ml-3">Partner Documents</span>}
          </NavLink>
          <NavLink to="/assign-order" className={navLinkClass}>
            <span className={isCollapsed ? "mx-auto" : ""}>📝</span>
            {!isCollapsed && <span className="ml-3">Assign Orders</span>}
          </NavLink>
          <button 
  onClick={handleLogout} 
  className={
    "mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 " +
    (isCollapsed ? "justify-center" : "")
  }
>
  <FaSignOutAlt className="h-5 w-5" />
  {!isCollapsed && <span>Logout</span>}
</button>
        </nav>

        {/* Footer Area */}
        <div
          className={`p-4 text-gray-400 text-sm ${
            isCollapsed ? "text-center" : ""
          }`}
        >
          {!isCollapsed && "v1.0.0"}
        </div>
      </aside>

      {/* Overlay for mobile menu (only shows on small screens) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
}