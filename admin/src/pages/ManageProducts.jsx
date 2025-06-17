import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState({}); // 👈 Step 1: Track expanded subservices
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE_URL}/api/products`)
      .then((res) => {
        setProducts(res.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    }
  };

  // Step 1: Expand/collapse sub-services
  const toggleSubServices = (productId) => {
    setExpanded((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  return (
    <div className="lg:ml-64 px-4 sm:px-6 py-6 sm:py-8 mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Products</h2>
          <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
            {products.length} {products.length === 1 ? 'product' : 'products'} available
          </p>
        </div>
        <button
          onClick={() => navigate("/add-service")}
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
        >
          Add New Product
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-4 animate-pulse">
              <div className="h-40 bg-gray-200 mb-4"></div>
              <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="bg-white border rounded-lg shadow-sm hover:shadow-lg transition duration-300">
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img
                  src={`${BASE_URL}/uploads/${product.images[0]}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Product+Image';
                  }}
                />
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                <p className="text-sm text-gray-700"><strong>Rating:</strong> {product.rating} ★</p>

                {/* Step 1: Toggle Button */}
                {product.subServices && product.subServices.length > 0 && (
                  <div className="mt-3">
                    <button
                      onClick={() => toggleSubServices(product._id)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      {expanded[product._id] ? 'Hide Sub-Services' : 'Show Sub-Services'}
                    </button>

                    {expanded[product._id] && (
                      <ul className="list-disc list-inside mt-2 text-sm text-gray-800 space-y-1">
                        {product.subServices.map((sub, idx) => (
                          <li key={idx}>
                            {sub.title} – ₹{sub.price}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-bold text-green-600">₹{product.price}</span>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first product</p>
          <div className="mt-4">
            <button
              onClick={() => navigate("/add-service")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
}