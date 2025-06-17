import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

// Only show on these paths
const ALLOWED_PATHS = ["/", "/products","/product/:id", "/my-orders", "/cart", "/profile"];

export default function MobileStickyNav() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Only show nav if on allowed page and mobile
  if (!isMobile || !ALLOWED_PATHS.includes(location.pathname)) return null;

  const active = (path) => location.pathname === path;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 shadow-lg border-t border-gray-400 flex justify-around items-center py-2 z-50">
      <Link to="/" className={`flex flex-col items-center py-1 ${active("/") ? "text-green-400" : "text-yellow-400"}`}>
        <div className={`rounded-full p-1 ${active("/") ? "bg-blue-100" : ""}`}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <span className="text-xs mt-1 font-medium">Home</span>
      </Link>
      <Link to="/products" className={`flex flex-col items-center py-1 ${active("/products") ? "text-green-400" : "text-yellow-400"}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span className="text-xs mt-1">Services</span>
      </Link>
      <Link to="/my-orders" className={`flex flex-col items-center py-1 ${active("/my-orders") ? "text-green-400" : "text-yellow-400"}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
        <span className="text-xs mt-1">My Orders</span>
      </Link>
      <Link to="/cart" className={`flex flex-col items-center py-1 ${active("/cart") ? "text-green-400" : "text-yellow-400"}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <span className="text-xs mt-1">Cart</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center py-1 ${active("/profile") ? "text-green-400" : "text-yellow-400"}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </div>
  );
}