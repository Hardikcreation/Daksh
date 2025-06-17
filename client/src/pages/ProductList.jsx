import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/products`)
      .then((res) => {
        setProducts(Array.isArray(res.data) ? res.data : []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load services. Please try again later.");
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6 sm:py-12">
      {/* Header Section */}
      <div className="text-center mb-6 sm:mb-12">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
          Our Services
        </h1>
        <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Professional home services tailored to your needs
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm sm:shadow-md overflow-hidden animate-pulse"
            >
              <div className="bg-gray-200 h-36 sm:h-48 w-full rounded-xl sm:rounded-none"></div>
              <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 sm:h-10 bg-gray-200 rounded w-full mt-3 sm:mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No services available
          </h3>
          <p className="mt-1 text-sm text-gray-500">Please check back later</p>
        </div>
      ) : (
        <div
          className="
            grid 
            grid-cols-1 
            xs:grid-cols-2 
            md:grid-cols-3 
            gap-3 sm:gap-6 lg:gap-8
          "
        >
          {products.map((product) => {
            const isAvailable = product.partnerAvailable !== false;
            return (
              <div
                key={product._id}
                className={`
                  bg-white 
                  rounded-2xl sm:rounded-2xl
                  shadow-lg sm:shadow-md
                  overflow-hidden 
                  hover:shadow-xl sm:hover:shadow-xl 
                  transition-all duration-300
                  flex flex-col
                  border-0 sm:border border-gray-100
                  relative
                  transform hover:scale-[1.02] sm:hover:scale-100
                  ${!isAvailable ? "opacity-60 pointer-events-none" : ""}
                `}
              >
                {/* Overlay if not available */}
                {!isAvailable && (
                  <div className="absolute inset-0 z-20 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-2xl">
                    <div className="bg-white px-4 py-2 rounded-full">
                      <span className="text-red-600 font-bold text-sm sm:text-lg">
                        Not Available
                      </span>
                    </div>
                  </div>
                )}

                {/* Mobile rating badge - positioned better */}
                {product.rating && (
                  <div className="absolute top-3 right-3 sm:top-2 sm:right-2 bg-black/70 sm:bg-white/90 px-3 py-1.5 sm:px-2 sm:py-1 rounded-full text-xs font-semibold flex items-center shadow-lg sm:shadow-sm z-10">
                    <span className="text-yellow-400 sm:text-gray-800 mr-1">⭐</span>
                    <span className="text-white sm:text-gray-800">{Number(product.rating).toFixed(1)}</span>
                  </div>
                )}

                {/* Image */}
                <div className="relative h-44 sm:h-48 overflow-hidden">
                  <img
                    src={
                      Array.isArray(product.images) && product.images[0]
                        ? `${BASE_URL}/uploads/${product.images[0]}`
                        : "https://via.placeholder.com/400x300?text=Service+Image"
                    }
                    alt={product.name}
                    className="
                      w-full h-full object-cover 
                      transition-transform duration-500 
                      hover:scale-110 sm:hover:scale-105
                    "
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=Service+Image";
                    }}
                  />
                  {/* Mobile gradient overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent sm:hidden"></div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 flex flex-col flex-1">
                  {/* Title and Price Row */}
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 sm:text-gray-800 line-clamp-1 flex-1">
                      {product.name}
                    </h2>
                    <div className="flex flex-col items-end">
                      <p className="text-xl sm:text-lg font-bold text-green-600 whitespace-nowrap">
                        ₹{product.price}
                      </p>
                      <span className="text-xs text-gray-500 sm:hidden">starting from</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-gray-600 line-clamp-2 mb-4 sm:mb-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Mobile-specific features */}
                  <div className="sm:hidden mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Quick Service
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Verified
                      </span>
                    </div>
                  </div>

                  <div className="flex-grow"></div>
                  
                  {/* CTA Button */}
                  <Link
                    to={isAvailable ? `/product/${product._id}` : "#"}
                    tabIndex={isAvailable ? 0 : -1}
                    className={`
                      mt-3 sm:mt-6 
                      inline-block 
                      w-full 
                      text-center 
                      ${isAvailable 
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 sm:bg-indigo-600 sm:hover:bg-indigo-700 active:scale-95 sm:active:scale-100" 
                        : "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                      } 
                      text-white 
                      px-4 py-3 sm:px-6 sm:py-3 
                      rounded-xl sm:rounded-lg
                      font-semibold sm:font-medium
                      transition-all duration-200
                      text-base sm:text-base
                      shadow-lg sm:shadow-sm
                      flex items-center justify-center
                    `}
                    aria-disabled={!isAvailable}
                    onClick={e => {
                      if (!isAvailable) e.preventDefault();
                    }}
                  >
                    {isAvailable ? (
                      <>
                        <span className="sm:hidden">Book Now</span>
                        <span className="hidden sm:inline">View Details</span>
                        <svg className="w-5 h-5 ml-2 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    ) : (
                      "Not Available"
                    )}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}