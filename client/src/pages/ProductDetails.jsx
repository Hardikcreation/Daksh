import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddedCard, setShowAddedCard] = useState(false);
  const [showAlreadyInCart, setShowAlreadyInCart] = useState(false);
  const [mainImage, setMainImage] = useState(0);
  const [selectedSubServices, setSelectedSubServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [subServiceToAdd, setSubServiceToAdd] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setTotalPrice(res.data.price);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (product) {
      const extra = selectedSubServices.reduce((sum, item) => sum + item.price, 0);
      setTotalPrice(product.price + extra);
    }
  }, [selectedSubServices, product]);

  const handleAddSubService = () => {
    if (!subServiceToAdd) return;
    if (selectedSubServices.find((sub) => sub.title === subServiceToAdd)) {
      alert("Sub-service already selected.");
      return;
    }
    const selected = Array.isArray(product.subServices)
      ? product.subServices.find((s) => s.title === subServiceToAdd)
      : null;
    if (selected) {
      setSelectedSubServices((prev) => [...prev, selected]);
      setSubServiceToAdd("");
    }
  };

  const handleRemoveSubService = (title) => {
    setSelectedSubServices((prev) => prev.filter((sub) => sub.title !== title));
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const alreadyInCart = cartItems.some((item) => item.id === product._id);
    if (alreadyInCart) {
      setShowAlreadyInCart(true);
      return;
    }

    addToCart({
      id: product._id,
      title: product.name,
      price: product.price,
      imageUrl: Array.isArray(product.images) && product.images[0] ? product.images[0] : "",
      subServices: selectedSubServices,
    });

    setShowAddedCard(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Service Not Found</h3>
          <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900 truncate mx-4">Service Details</h1>
          <button className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-10 px-4 py-10">
          {/* Desktop Image Gallery */}
          <div>
            <img
              src={
                Array.isArray(product.images) && product.images[mainImage]
                  ? `${BASE_URL}/uploads/${product.images[mainImage]}`
                  : "https://via.placeholder.com/400x300?text=Service+Image"
              }
              alt={product.name}
              className="rounded-xl w-full h-96 object-cover shadow-lg"
            />
            <div className="mt-6 grid grid-cols-4 gap-3">
              {Array.isArray(product.images) &&
                product.images.map((img, i) => (
                  <img
                    key={i}
                    src={`${BASE_URL}/uploads/${img}`}
                    alt="Thumbnail"
                    onClick={() => setMainImage(i)}
                    className={`cursor-pointer h-20 w-full object-cover rounded-lg border-2 ${
                      mainImage === i ? "border-blue-500 scale-105" : "border-gray-200"
                    } transition-all duration-200 hover:border-blue-300`}
                  />
                ))}
            </div>
          </div>

          {/* Desktop Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-2xl font-bold text-green-600">₹{totalPrice}</span>
                {product.rating && (
                  <div className="flex items-center space-x-1">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-gray-600">{Number(product.rating).toFixed(1)}</span>
                  </div>
                )}
              </div>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Desktop Sub-services */}
            {Array.isArray(product.subServices) && product.subServices.length > 0 && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Customize Your Service</h3>
                <div className="flex gap-3 mb-4">
                  <select
                    value={subServiceToAdd}
                    onChange={(e) => setSubServiceToAdd(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="" disabled>Select additional service</option>
                    {product.subServices.map((sub, i) => (
                      <option key={i} value={sub.title}>
                        {sub.title} – ₹{sub.price}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddSubService}
                    disabled={!subServiceToAdd}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>

                {selectedSubServices.length > 0 && (
                  <div className="space-y-3">
                    {selectedSubServices.map((sub, i) => (
                      <div key={i} className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg">
                        <span>{sub.title} – <strong>₹{sub.price}</strong></span>
                        <button
                          onClick={() => handleRemoveSubService(sub.title)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
            >
              Add to Cart – ₹{totalPrice}
            </button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Mobile Image Gallery */}
          <div className="relative">
            <div className="aspect-w-16 aspect-h-12">
              <img
                src={
                  Array.isArray(product.images) && product.images[mainImage]
                    ? `${BASE_URL}/uploads/${product.images[mainImage]}`
                    : "https://via.placeholder.com/400x300?text=Service+Image"
                }
                alt={product.name}
                className="w-full h-72 object-cover"
              />
            </div>
            
            {/* Image Counter */}
            {Array.isArray(product.images) && product.images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                {mainImage + 1} / {product.images.length}
              </div>
            )}

            {/* Rating Badge */}
            {product.rating && (
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1 shadow-sm">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium text-gray-800">{Number(product.rating).toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Mobile Image Thumbnails */}
          {Array.isArray(product.images) && product.images.length > 1 && (
            <div className="px-4 py-4 bg-white">
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={`${BASE_URL}/uploads/${img}`}
                    alt="Thumbnail"
                    onClick={() => setMainImage(i)}
                    className={`cursor-pointer h-16 w-16 flex-shrink-0 object-cover rounded-lg border-2 ${
                      mainImage === i ? "border-blue-500" : "border-gray-200"
                    } transition-all duration-200`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Mobile Product Info */}
          <div className="bg-white">
            <div className="px-4 py-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-green-600">₹{totalPrice}</span>
                {product.category && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                )}
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <p className={`text-gray-700 leading-relaxed ${!showFullDescription ? 'line-clamp-3' : ''}`}>
                  {product.description}
                </p>
                {product.description && product.description.length > 150 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-600 font-medium text-sm mt-2 hover:text-blue-700"
                  >
                    {showFullDescription ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </div>

              {/* Key Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Included</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Professional service</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Quality guarantee</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Customer support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Sub-services */}
            {Array.isArray(product.subServices) && product.subServices.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Add Extra Services</h3>
                
                <div className="space-y-3 mb-4">
                  <select
                    value={subServiceToAdd}
                    onChange={(e) => setSubServiceToAdd(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  >
                    <option value="" disabled>Choose additional service</option>
                    {product.subServices.map((sub, i) => (
                      <option key={i} value={sub.title}>
                        {sub.title} – ₹{sub.price}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddSubService}
                    disabled={!subServiceToAdd}
                    className="w-full py-3 bg-blue-100 text-blue-700 rounded-xl font-medium hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Selected Service
                  </button>
                </div>

                {selectedSubServices.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Selected Extra Services:</h4>
                    {selectedSubServices.map((sub, i) => (
                      <div key={i} className="flex justify-between items-center bg-blue-50 px-4 py-3 rounded-xl">
                        <div>
                          <span className="font-medium text-gray-900">{sub.title}</span>
                          <div className="text-sm text-green-600 font-semibold">₹{sub.price}</div>
                        </div>
                        <button
                          onClick={() => handleRemoveSubService(sub.title)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Section */}
            {product.review && (
              <div className="border-t border-gray-200 px-4 py-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Customer Review</h3>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-700 italic">"{product.review}"</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
        <button
          onClick={handleAddToCart}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 2L4 5H2m5 8l-1 5h10m-1-5a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <span>Add to Cart – ₹{totalPrice}</span>
        </button>
      </div>

      {/* Success Modal */}
      {showAddedCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm mx-auto text-center animate-scale-in">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-green-100 rounded-full p-3 animate-bounce">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Added to Cart!</h3>
              <p className="text-gray-600">Your service has been added successfully.</p>
              <div className="flex space-x-3 w-full pt-2">
                <button
                  onClick={() => setShowAddedCard(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => {
                    setShowAddedCard(false);
                    navigate('/cart');
                  }}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  View Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Already in Cart Modal */}
      {showAlreadyInCart && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm mx-auto text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-yellow-100 rounded-full p-3">
                <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Already in Cart</h3>
              <p className="text-gray-600">This service is already in your cart.</p>
              <div className="flex space-x-3 w-full pt-2">
                <button
                  onClick={() => setShowAlreadyInCart(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  OK
                </button>
                <button
                  onClick={() => {
                    setShowAlreadyInCart(false);
                    navigate('/cart');
                  }}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  View Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}