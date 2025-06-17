import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { FiUser } from "react-icons/fi";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Navbar() {
  const { cartItems } = useContext(CartContext);
  const { isAuthenticated, logout, user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useState(user?.location || "Detecting...");
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const mobileMenuRef = useRef(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    const handleRouteChange = () => setIsMobileMenuOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && !user?.location) {
      setIsLocationLoading(true);
      navigator.geolocation?.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const address = data?.display_name?.split(",")[0] || "Your Location";
            setLocation(address);
            await axios.put(
              `${BASE_URL}/api/users/location`,
              { location: address },
              { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            setUser((prev) => ({ ...prev, location: address }));
          } catch (error) {
            setLocation("Location unavailable");
          } finally {
            setIsLocationLoading(false);
          }
        },
        () => {
          setLocation("Allow location access");
          setIsLocationLoading(false);
        }
      );
    } else if (user?.location) {
      setLocation(user.location);
    }
  }, [isAuthenticated, user?.location]);

  const handleManualLocationChange = async () => {
    const newLocation = prompt("Enter your location:", location);
    if (newLocation && newLocation !== location) {
      try {
        setLocation(newLocation);
        await axios.put(
          `${BASE_URL}/api/users/location`,
          { location: newLocation },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setUser((prev) => ({ ...prev, location: newLocation }));
      } catch (error) {
        console.error("Failed to update location:", error);
        setLocation(location);
      }
    }
  };

  return (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side - Logo & Navigation */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              DAKSH
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              <Link
                to="/products"
                className="text-gray-300 hover:text-white px-3 py-2 font-medium transition-colors"
              >
                Services
              </Link>
              <Link
                to="/partner-register"
                className="text-gray-300 hover:text-white px-3 py-2 font-medium transition-colors"
              >
                Partner
              </Link>
              <Link
                to="/about"
                className="text-gray-300 hover:text-white px-3 py-2 font-medium transition-colors"
              >
                About
              </Link>
            </div>
          </div>

          {/* Right side - Auth & Cart */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && (
              <div
                onClick={handleManualLocationChange}
                className="flex items-center text-sm text-gray-300 cursor-pointer hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 mr-1 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {isLocationLoading ? "Detecting..." : location}
              </div>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 relative"
            >
              <svg className="w-6 h-6 text-gray-300 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Auth */}
            {!isAuthenticated ? (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium rounded-md transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1 border border-gray-300 text-gray-300 hover:bg-gray-800 font-medium rounded-md transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">Hi, {user?.name}</span>
                <Link
                  to="/my-orders"
                  className="text-sm text-yellow-400 hover:text-white transition-colors"
                >
                  My Orders
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-1 text-sm text-gray-300 hover:text-white font-medium transition-colors"
                >
                  Logout
                </button>
                <Link
                  to="/profile"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-500"
                >
                  <FiUser size={20} className="text-gray-800" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile Cart Icon */}
            <Link
              to="/cart"
              className="p-2 relative"
            >
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Bottom Sheet Menu */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${isMobileMenuOpen ? "block" : "pointer-events-none"}`}
        style={{ background: isMobileMenuOpen ? "rgba(0,0,0,0.5)" : "transparent" }}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          ref={mobileMenuRef}
          className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 transform ${isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
            } max-h-[85vh] overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>

          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(85vh-120px)]">
            {/* User Profile Section */}
            {isAuthenticated && (
              <div className="px-6 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-yellow-400 text-white shadow-lg">
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center w-full h-full text-white-600 text-sm font-medium hover:text-blue-700"
                      style={{ textDecoration: 'none' }}
                    >
                      <FiUser size={24} />
                      <span className="sr-only">View Profile</span>
                    </Link>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{user?.name}</h3>
                    <div
                      onClick={handleManualLocationChange}
                      className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-blue-600 transition-colors mt-1"
                    >
                      <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {isLocationLoading ? "Detecting..." : location}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/products"
                  className="flex items-center justify-center p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Services
                </Link>
                <Link
                  to="/partner-register"
                  className="flex items-center justify-center p-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Partner
                </Link>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="px-6 py-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Menu</h3>
              <div className="space-y-2"  style={{ marginBottom: "70px" }}>
                {isAuthenticated && (
                  <Link
                    to="/my-orders"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4 group-hover:bg-blue-500 group-hover:text-white transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">My Orders</p>
                      <p className="text-sm text-gray-500">Track your bookings</p>
                    </div>
                  </Link>
                )}
                {/* About button removed for mobile */}
                {/* Logout button in place of About for mobile */}
                {isAuthenticated && (
                 <button
  onClick={() => {
    logout();
    setIsMobileMenuOpen(false);
  }}
  className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 font-medium rounded-xl transition-colors border border-red-200 mb-[0px]"
>
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
  Logout
</button>
                )}
              </div>
            </div>

            {/* Auth Section */}
            <div className="px-6 py-6 border-t border-gray-100 bg-gray-50">
              {!isAuthenticated ? (
<div
  className="space-y-3"
  style={{ marginBottom: "70px" }}
>                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login to Your Account
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-xl transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Create New Account
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}