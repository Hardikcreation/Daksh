import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
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
        <button
          onClick={() => navigate(-1)}
          className="mb-8 px-5 py-2.5 rounded-lg transition-all duration-300 shadow-md flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Services
        </button>

        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          {product.name}
        </h1>

        {/* Main Services Grid */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Most booked services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.subServices.map((sub, idx) => {
              const inCart = isInCart(sub, product._id);
              return (
                <div 
                  key={idx} 
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="h-40 bg-gray-100 overflow-hidden">
                    <img
                      src={sub.image ? `${BASE_URL}/uploads/${sub.image}` : '/img/default-service.png'}
                      alt={sub.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.src = '/img/default-service.png'; }}
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-800">{sub.name}</h3>
                      {sub.rating && (
                        <div className="flex items-center text-sm bg-blue-50 px-2 py-1 rounded">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">{sub.rating}</span>
                          <span className="text-gray-500 ml-1">({sub.reviewCount})</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-lg font-semibold">
                        ₹{sub.price}
                        {sub.originalPrice && (
                          <span className="ml-2 text-sm text-gray-500 line-through">₹{sub.originalPrice}</span>
                        )}
                      </div>
                      
                      {inCart ? (
                        <button
                          onClick={() => removeFromCart(product._id + '-' + (sub.name || idx))}
                          className="px-3 py-1.5 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => addToCart({
                            id: product._id + '-' + (sub.name || idx),
                            title: sub.name,
                            price: sub.price,
                            imageUrl: sub.image,
                            parentProductId: product._id,
                            subService: true
                          })}
                          className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Book Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Suggestions Section */}
        {suggestions.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">You may also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {suggestions.slice(0, 5).map((sub, idx) => {
                const inCart = isInCart(sub, sub.parentProductId);
                return (
                  <div 
                    key={idx} 
                    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
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
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm font-semibold">₹{sub.price}</div>
                        {inCart ? (
                          <button
                            onClick={() => removeFromCart(sub.parentProductId + '-' + (sub.name || idx))}
                            className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            onClick={() => addToCart({
                              id: sub.parentProductId + '-' + (sub.name || idx),
                              title: sub.name,
                              price: sub.price,
                              imageUrl: sub.image,
                              parentProductId: sub.parentProductId,
                              subService: true
                            })}
                            className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                          >
                            Book Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Floating Cart Button */}
        <div className="fixed right-8 bottom-16 z-50">
          <button
            onClick={() => navigate('/cart')}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg flex items-center justify-center text-white text-3xl hover:scale-110 transition-transform duration-200 border-4 border-white"
            title="Go to Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}