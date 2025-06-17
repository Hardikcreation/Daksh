import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBars, FaTimes, FaHome, FaClipboardList, FaMoneyBillAlt, FaChartLine, FaFileUpload, FaSignOutAlt, FaPlusCircle, FaBell, FaUser } from "react-icons/fa";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PartnerNavbar() {
  const navigate = useNavigate();
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initial fetch
  useEffect(() => {
    const token = localStorage.getItem("partnerToken");
    if (!token) return;
    axios
      .get(`${BASE_URL}/api/partners/check-documents`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPartnerInfo({
          verificationStatus: res.data.status,
          isDocumentsSubmitted: res.data.isDocumentsSubmitted,
        });
      })
      .catch(() => {
        localStorage.removeItem("partnerToken");
        navigate("/partner-login");
      });
  }, [navigate]);

  // Poll for status if not yet verified
  useEffect(() => {
    let interval;
    if (partnerInfo && partnerInfo.verificationStatus !== "verified") {
      interval = setInterval(() => {
        const token = localStorage.getItem("partnerToken");
        if (!token) return;
        axios
          .get(`${BASE_URL}/api/partners/check-documents`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setPartnerInfo({
              verificationStatus: res.data.status,
              isDocumentsSubmitted: res.data.isDocumentsSubmitted,
            });
          });
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [partnerInfo]);

  const handleLogout = () => {
    localStorage.removeItem("partnerToken");
    localStorage.removeItem("partnerInfo");
    setPartnerInfo(null);
    navigate("/partner-login");
  };

  const handleregister = () => {
    localStorage.removeItem("partnerToken");
    localStorage.removeItem("partnerInfo");
    setPartnerInfo(null);
    navigate("/partner-register");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const renderLinks = () => {
    if (!partnerInfo) return null;
    const hasAccess = partnerInfo.isDocumentsSubmitted && partnerInfo.verificationStatus === "verified";
    return (
      <>
        {hasAccess ? (
          <>
            <Link to="/partner-home" className="hover:text-blue-400 flex items-center gap-1 transition-colors">
              <FaHome className="mr-1" /> Home
            </Link>
            <Link to="/partner-orders" className="hover:text-blue-400 flex items-center gap-1 transition-colors">
              <FaClipboardList className="mr-1" /> Orders
            </Link>
            <Link to="/partner-earnings" className="hover:text-blue-400 flex items-center gap-1 transition-colors">
              <FaMoneyBillAlt className="mr-1" /> Earnings
            </Link>
            <Link to="/partner-dashboard" className="hover:text-blue-400 flex items-center gap-1 transition-colors">
              <FaChartLine className="mr-1" /> Dashboard
            </Link>
          </>
        ) : (
          <div className="text-yellow-300 text-sm italic mr-4">🔒 Access restricted until documents are approved</div>
        )}
        <Link
          to="/upload-documents"
          className={`hover:text-blue-400 flex items-center gap-1 transition-colors ${
            partnerInfo?.isDocumentsSubmitted === false ? 'text-yellow-400 animate-pulse' : ''
          }`}
        >
          <FaFileUpload className="mr-1" /> Documents
        </Link>
        <button onClick={handleLogout} className="hover:text-red-400 flex items-center gap-1 transition-colors">
          <FaSignOutAlt className="mr-1" /> Logout
        </button>
      </>
    );
  };

  const renderMobileLinks = () => {
    if (!partnerInfo) return null;
    const hasAccess = partnerInfo.isDocumentsSubmitted && partnerInfo.verificationStatus === "verified";
    
    const menuItems = [
      ...(hasAccess ? [
        { to: "/partner-home", icon: FaHome, label: "Home", color: "text-blue-400" },
        { to: "/partner-orders", icon: FaClipboardList, label: "Orders", color: "text-green-400" },
        { to: "/partner-earnings", icon: FaMoneyBillAlt, label: "Earnings", color: "text-yellow-400" },
        { to: "/partner-dashboard", icon: FaChartLine, label: "Dashboard", color: "text-purple-400" },
      ] : []),
      { 
        to: "/upload-documents", 
        icon: FaFileUpload, 
        label: "Documents", 
        color: partnerInfo?.isDocumentsSubmitted === false ? 'text-yellow-400' : 'text-gray-300',
        pulse: partnerInfo?.isDocumentsSubmitted === false
      }
    ];

    return (
      <>
        {!hasAccess && (
          <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-500 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-300 text-sm">
              <span className="text-lg">🔒</span>
              <span>Access restricted until documents are approved</span>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={index}
                to={item.to}
                onClick={toggleMenu}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-gray-600/50 ${item.color} ${item.pulse ? 'animate-pulse' : ''} group`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-600 group-hover:bg-gray-500 transition-colors">
                  <IconComponent className="text-lg" />
                </div>
                <span className="font-medium">{item.label}</span>
                <div className="ml-auto">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-600">
          <button
            onClick={() => { handleLogout(); toggleMenu(); }}
            className="flex items-center gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-red-600/20 text-red-400 group w-full"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600/20 group-hover:bg-red-600/30 transition-colors">
              <FaSignOutAlt className="text-lg" />
            </div>
            <span className="font-medium">Logout</span>
            <div className="ml-auto">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden">
        {/* Top Bar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg">
          <div className="flex items-center justify-between p-4">
            {/* Logo/Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <FaUser className="text-white text-sm" />
              </div>
              <div>
                <h1 className="text-white font-semibold text-lg">Partner</h1>
                <div className="flex items-center gap-2">
                  {partnerInfo?.verificationStatus === "verified" ? (
                    <span className="text-green-400 text-xs flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Verified
                    </span>
                  ) : (
                    <span className="text-yellow-400 text-xs flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
                <FaBell className="text-lg" />
                {partnerInfo?.verificationStatus !== "verified" && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </button>

              {/* Menu Toggle */}
              <button 
                onClick={toggleMenu} 
                className="p-2 text-white hover:bg-gray-700 rounded-lg transition-colors focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              onClick={toggleMenu}
            ></div>
            <div className="fixed top-0 right-0 h-full w-80 bg-gray-800 z-50 transform transition-transform duration-300 ease-out shadow-2xl">
              <div className="p-6 pt-20">
                {/* Menu Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-600">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-lg">Partner Portal</h2>
                    <p className="text-gray-400 text-sm">Manage your services</p>
                  </div>
                </div>

                {/* Menu Items */}
                {partnerInfo ? renderMobileLinks() : (
                  <button 
                    onClick={() => { handleregister(); toggleMenu(); }} 
                    className="flex items-center gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-green-600/20 text-green-400 group w-full"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600/20 group-hover:bg-green-600/30 transition-colors">
                      <FaPlusCircle className="text-lg" />
                    </div>
                    <span className="font-medium">Join as Partner</span>
                    <div className="ml-auto">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-green-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Desktop Navigation (unchanged) */}
      <nav className="hidden md:flex bg-gray-800 text-white p-4 flex-col md:flex-row justify-between items-center fixed w-full z-40">
        <div className="text-xl font-bold mb-4 md:mb-0">Partner Dashboard</div>
        <div className="flex space-x-6">
          {partnerInfo ? renderLinks() : (
            <button onClick={handleregister} className="hover:text-green-400 flex items-center gap-1 transition-colors">
              <FaPlusCircle className="mr-1" /> Signup
            </button>
          )}
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-20 md:h-20"></div>
    </>
  );
}