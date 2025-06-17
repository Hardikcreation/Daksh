import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import { FiX, FiShoppingCart, FiArrowUp } from "react-icons/fi";

// Allowed paths for showing CartBar in both mobile and desktop view
const ALLOWED_PATHS = [
  "/",              // Home
  "/about",         // About
  "/services",      // Services
  "/products",      // Product list
];
const isProductDetailsPath = (pathname) => /^\/product\/[^/]+$/.test(pathname);

export default function CartBar({ serviceName = "Your Selected Service" }) {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hide CartBar on the /cart page
  const isCartPage = location.pathname === "/cart";
  // Hide CartBar on any route that starts with "/partners" (dashboard or any subpage)
  const isPartnersPage = location.pathname.startsWith("/partners");

  // Only show on allowed paths (including /product/:id) in both mobile and desktop view
  const showCartBarOnThisPage =
    (
      ALLOWED_PATHS.includes(location.pathname) ||
      isProductDetailsPath(location.pathname)
    ) && !isCartPage && !isPartnersPage;

  useEffect(() => {
    if (!cartItems.length) {
      setVisible(true);
    }
  }, [cartItems.length]);

  useEffect(() => {
    if (cartItems.length && !visible) {
      setVisible(true);
    }
    // eslint-disable-next-line
  }, [cartItems.length]);

  if (
    !cartItems.length ||
    !visible ||
    !showCartBarOnThisPage
  )
    return null;

  // Utility to count sub-services in a service (if present)
  const getSubServiceCount = (item) => {
    if (item && Array.isArray(item.subServices)) {
      return item.subServices.length;
    }
    return 0;
  };

  // If all items are of the same service, show sub-services count
  // If multiple different services, show number of services
  let displayCount = 0;
  let displayLabel = "items";
  if (cartItems.length === 1) {
    // Only one service, show number of sub-services if present, else 1
    const subServiceCount = getSubServiceCount(cartItems[0]);
    displayCount = subServiceCount > 0 ? subServiceCount : (cartItems[0].quantity || 1);
    displayLabel = displayCount === 1 ? "item" : "items";
  } else if (cartItems.length > 1) {
    // Multiple services, show number of services
    displayCount = cartItems.length;
    displayLabel = displayCount === 1 ? "service" : "services";
  }

  const firstItem = cartItems[0];
  const name = firstItem?.title || firstItem?.name || serviceName;

  // Scroll to top handler for desktop
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Hide the cart bar
  const handleClose = () => {
    setVisible(false);
  };

  // --- MOBILE: Minimal bar ---
  if (isMobile) {
    // Show just a floating "View Cart" button + badge, above the mobile sticky nav
    return (
      <div
        className="fixed z-50 left-0 right-0 bottom-[56px] w-full flex justify-center"
        style={{
          pointerEvents: "none", // allows nav bar clicks except for button
        }}
      >
        <div className="w-full flex justify-end pr-4">
          <button
            onClick={() => navigate("/cart")}
            className="relative flex items-center justify-center w-14 h-14 rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold text-lg shadow-2xl transition-all border-4 border-white"
            style={{
              pointerEvents: "auto",
              gap: 10,
              marginBottom: "40px",
              boxShadow: "0 6px 24px 0 rgba(241, 164, 190, 0.25)",
              minWidth: 56, // Ensures a minimum circular size
              minHeight: 56,
            }}
          >
            <FiShoppingCart size={22} className="drop-shadow text-gray-800" />
            <span className="absolute -top-1 -right-1 bg-white text-yellow-500 font-bold rounded-full text-sm w-7 h-7 flex items-center justify-center shadow border-2 border-yellow-200">
              {displayCount}
            </span>
          </button>
        </div>
      </div>
    );
  }

  // --- DESKTOP: Full bar ---
  return (
    <div
      className="fixed z-50 left-0 right-0 bottom-0 w-full max-w-full shadow-lg"
      style={{
        width: "fit-content",
        boxShadow: "0 1px 15px 0 rgba(0,0,0,0.12)",
        borderTopLeftRadius: "12px",
        borderTopRightRadius: "12px",
        borderBottomLeftRadius: "12px",
        borderBottomRightRadius: "12px",
        borderTop: "1px solid #f1f1f1",
        justifyContent: "center",
        alignItems: "center",
        background: "#fff",
        margin: "0 auto 40px auto",
        left: 0,
        right: 0,
      }}
    >
      <div className="flex items-center px-3 py-2">
        {/* Item Image + Badge */}
        <div className="relative flex-shrink-0 mr-2">
          <img
            src={
              firstItem?.imageUrl
                ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${firstItem.imageUrl}`
                : (Array.isArray(firstItem?.images) && firstItem.images[0]
                  ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${firstItem.images[0]}`
                  : "/default-service.png")
            }
            alt={name}
            className="w-7 h-7 rounded-md object-cover border border-gray-100 shadow-sm"
          />
          <span className="absolute -top-2 -right-2 bg-white text-yellow-500 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm border-2 border-yellow-300">
            {displayCount}
          </span>
        </div>
        {/* Name & Items count */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 text-xs truncate">{name}</div>
          <div className="text-xs text-gray-700 flex items-center gap-1">
            <FiShoppingCart className="inline text-gray-700" size={11} />
            {displayCount} {displayLabel}
          </div>
        </div>
        {/* Actions */}
        <div className="flex items-center ml-auto gap-1">
          {/* Scroll to top */}
          <button
            onClick={handleScrollTop}
            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
            aria-label="Scroll to top"
            title="Scroll to top"
          >
            <FiArrowUp size={15} />
          </button>
          {/* View Cart */}
          <button
            onClick={() => navigate("/cart")}
            className="px-3 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold text-xs shadow-md transition-all"
            style={{ minWidth: 80 }}
          >
            View Cart
          </button>
          {/* Close */}
          <button
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={handleClose}
            aria-label="Close cart bar"
          >
            <FiX size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}