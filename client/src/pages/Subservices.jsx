import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Subservices() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, removeFromCart, cartItems } = useContext(CartContext);
  const [suggestions, setSuggestions] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const suggestionsRef = useRef(null);

  const scrollSuggestions = (direction) => {
    const container = suggestionsRef.current;
    if (!container) return;
    const scrollAmount = 220 + 16; // card width + gap (px)
    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError("Failed to load subservices.");
        setIsLoading(false);
      });

    // Fetch suggestions
    axios.get(`${BASE_URL}/api/products`).then(res => {
      const allSubs = res.data
        .filter(p => p._id !== id)
        .flatMap(p => (p.subServices || []).map(sub => ({
          ...sub,
          parentProductId: p._id,
          parentProductName: p.name
        })));
      setSuggestions(allSubs);
    });
  }, [id]);

  // Hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center rounded-lg max-w-md mx-auto mt-10 bg-red-50 text-red-500">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      {error}
    </div>
  );

  if (!product) return (
    <div className="p-8 text-center rounded-lg max-w-md mx-auto mt-10 bg-gray-50 text-gray-600">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Product not found.
    </div>
  );

  const isInCart = (sub, parentProductId) => {
    return cartItems.some(item =>
      item.title === sub.name &&
      item.parentProductId === parentProductId &&
      item.subService === true
    );
  };

  return (
    <div className="mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen bg-white text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Service name and Back button in a single row */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {product.name}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-lg transition-all duration-300 shadow-md flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Services
          </button>
        </div>

        {/* Main Services Grid */}
        <div className="mb-12">
          <div className="flex overflow-x-auto gap-4 p-3 hide-scrollbar">
            {product.subServices.map((sub, idx) => {
              const inCart = isInCart(sub, product._id);
              return (
                <div 
                  key={idx}
                  className={`min-w-[200px] max-w-[220px] border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 relative cursor-pointer group ${inCart ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => {
                    if (!inCart) {
                      addToCart({
                        id: product._id + '-' + (sub.name || idx),
                        title: sub.name,
                        price: sub.price,
                        imageUrl: sub.image,
                        parentProductId: product._id,
                        subService: true
                      });
                      setToastMsg(`${sub.name} added to cart!`);
                      setShowToast(true);
                    }
                  }}
                >
                  <div className="h-32 bg-gray-100 overflow-hidden">
                    <img
                      src={sub.image ? `${BASE_URL}/uploads/${sub.image}` : '/img/default-service.png'}
                      alt={sub.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.src = '/img/default-service.png'; }}
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm text-gray-800 mb-1">{sub.name}</h3>
                    <div className="text-sm font-semibold">₹{sub.price}</div>
                    {sub.originalPrice && (
                      <span className="ml-2 text-xs text-gray-500 line-through">₹{sub.originalPrice}</span>
                    )}
                    {sub.rating && (
                      <div className="flex items-center text-xs bg-blue-50 px-2 py-1 rounded mt-1">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1">{sub.rating}</span>
                        <span className="text-gray-500 ml-1">({sub.reviewCount})</span>
                      </div>
                    )}
                  </div>
                  {inCart && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        removeFromCart(product._id + '-' + (sub.name || idx));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-lg font-bold shadow hover:bg-red-600 z-10"
                      title="Remove"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Suggestions Section */}
        {suggestions.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">You may also like</h2>
            <div className="relative">
              <button
                onClick={() => scrollSuggestions("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border shadow rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-100"
                style={{ left: "-20px" }}
                aria-label="Scroll left"
              >
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div
                ref={suggestionsRef}
                className="flex overflow-x-auto gap-4 p-3 scroll-smooth hide-scrollbar"
                style={{ scrollBehavior: "smooth" }}
              >
                {suggestions.slice(0, 10).map((sub, idx) => {
                  const inCart = isInCart(sub, sub.parentProductId);
                  return (
                    <div 
                      key={idx} 
                      className={`min-w-[200px] max-w-[220px] border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 relative cursor-pointer group ${inCart ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => {
                        if (!inCart) {
                          addToCart({
                            id: sub.parentProductId + '-' + (sub.name || idx),
                            title: sub.name,
                            price: sub.price,
                            imageUrl: sub.image,
                            parentProductId: sub.parentProductId,
                            subService: true
                          });
                          setToastMsg(`${sub.name} added to cart!`);
                          setShowToast(true);
                        }
                      }}
                    >
                      <div className="h-32 bg-gray-100 overflow-hidden">
                        <img
                          src={sub.image ? `${BASE_URL}/uploads/${sub.image}` : '/img/default-service.png'}
                          alt={sub.name}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.src = '/img/default-service.png'; }}
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-sm text-gray-800 mb-1">{sub.name}</h3>
                        <div className="text-xs text-gray-500 mb-2">from {sub.parentProductName}</div>
                        <div className="text-sm font-semibold">₹{sub.price}</div>
                      </div>
                      {inCart && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            removeFromCart(sub.parentProductId + '-' + (sub.name || idx));
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-lg font-bold shadow hover:bg-red-600 z-10"
                          title="Remove"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => scrollSuggestions("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border shadow rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-100"
                style={{ right: "-20px" }}
                aria-label="Scroll right"
              >
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Floating Cart Button */}
        <div className="fixed right-8 bottom-16 z-50">
          <button
            onClick={() => navigate('/cart')}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg flex items-center justify-center text-white text-3xl hover:scale-110 transition-transform duration-200 border-4 border-white relative"
            title="Go to Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-base font-bold border-2 border-white">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
        {/* Toast/Popup */}
        {showToast && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-blue-200 shadow-lg rounded-xl px-6 py-4 flex items-center gap-4 animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold text-gray-800">{toastMsg}</span>
            <button
              onClick={() => navigate('/cart')}
              className="ml-4 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              View Cart
            </button>
            <button
              onClick={() => setShowToast(false)}
              className="ml-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              title="Close"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
}