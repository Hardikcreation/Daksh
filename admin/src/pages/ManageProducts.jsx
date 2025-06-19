import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function EditProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    rating: product.rating,
    review: product.review || "",
    images: [], // new files to upload
  });
  const [existingImages, setExistingImages] = useState(Array.isArray(product.images) ? [...product.images] : []);
  const [subServices, setSubServices] = useState(
    Array.isArray(product.subServices) && product.subServices.length > 0
      ? [...product.subServices]
      : [{ title: "", price: "" }]
  );

  // Handle text/number input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle new image uploads
  const handleImageChange = (e) => {
    setForm((prev) => ({
      ...prev,
      images: Array.from(e.target.files),
    }));
  };

  // Remove an existing image from the product
  const handleRemoveExistingImage = (idx) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // Remove a new image from the preview list
  const handleRemoveNewImage = (idx) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  // Subservice change
  const handleSubChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...subServices];
    updated[index][name] = value;
    setSubServices(updated);
  };

  // Add/remove subservices
  const addSubService = () => {
    setSubServices([...subServices, { title: "", price: "" }]);
  };
  const removeSubService = (index) => {
    if (subServices.length === 1) return;
    const updated = [...subServices];
    updated.splice(index, 1);
    setSubServices(updated);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    // Add text fields
    Object.entries(form).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((file) => formData.append("images", file));
      } else {
        formData.append(key, value);
      }
    });
    // Always append existingImages (as JSON), even if empty
    formData.append("existingImages", JSON.stringify(existingImages || []));
    // Subservices
    formData.append("subServices", JSON.stringify(subServices || []));

    try {
      await axios.put(
        `${BASE_URL}/api/products/${product._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("✅ Product updated!");
      onSave(); // refresh parent
    } catch (err) {
      alert("❌ Failed to update product.");
      console.error(err);
    }
  };

  // Modal UI
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 overflow-y-auto max-h-[95vh] shadow-lg">
        <h2 className="text-xl font-bold mb-3">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name, Description */}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
          </div>
          {/* Price, Rating, Review */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium">Price (₹)</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Rating</label>
              <input name="rating" type="number" step="0.1" min="1" max="5" value={form.rating} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Review (Optional)</label>
            <input name="review" value={form.review} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>
          {/* Existing Images */}
          <div>
            <label className="block text-sm font-medium">Existing Images</label>
            <div className="flex gap-2 flex-wrap">
              {existingImages.map((img, idx) => (
                <div key={img} className="relative">
                  <img
                    src={`${BASE_URL}/uploads/${img}`}
                    alt={`img${idx}`}
                    className="w-20 h-16 object-cover border rounded"
                  />
                  <button type="button" onClick={() => handleRemoveExistingImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">×</button>
                </div>
              ))}
              {existingImages.length === 0 && <span className="text-xs text-gray-500">No images left</span>}
            </div>
          </div>
          {/* Add New Images */}
          <div>
            <label className="block text-sm font-medium">Add Images</label>
            <input type="file" multiple onChange={handleImageChange} className="block" />
            {/* Preview new images */}
            {form.images.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {form.images.map((file, idx) => (
                  <div key={idx} className="relative">
                    <img src={URL.createObjectURL(file)} alt="preview" className="w-20 h-16 object-cover border rounded" />
                    <button type="button" onClick={() => handleRemoveNewImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subservices */}
          <div>
            <label className="block text-sm font-medium">Sub-Services</label>
            {subServices.map((sub, index) => (
              <div key={index} className="flex gap-2 items-center my-1">
                <input
                  name="title"
                  value={sub.title}
                  placeholder="Title"
                  onChange={(e) => handleSubChange(index, e)}
                  required
                  className="flex-1 border rounded px-2 py-1"
                />
                <input
                  name="price"
                  value={sub.price}
                  type="number"
                  placeholder="Price"
                  onChange={(e) => handleSubChange(index, e)}
                  required
                  className="w-24 border rounded px-2 py-1"
                />
                {subServices.length > 1 && (
                  <button type="button" onClick={() => removeSubService(index)} className="text-red-600 text-xl">×</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addSubService} className="text-blue-600 hover:underline text-xs mt-1">+ Add Another Sub-Service</button>
          </div>
          {/* Buttons */}
          <div className="flex items-center gap-2 mt-3">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save Changes</button>
            <button type="button" onClick={onClose} className="ml-2 px-4 py-2 rounded border">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [editing, setEditing] = useState(null); // product to edit or null
  const navigate = useNavigate();

  const fetchProducts = () => {
    setIsLoading(true);
    axios.get(`${BASE_URL}/api/products`)
      .then((res) => {
        setProducts(res.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    }
  };

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
                  src={`${BASE_URL}/uploads/${product.images && product.images[0] ? product.images[0] : ''}`}
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
                {/* Subservices */}
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
                <div className="flex items-center justify-between mt-4 gap-2">
                  <span className="text-xl font-bold text-green-600">₹{product.price}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(product)}
                      className="text-white bg-yellow-500 hover:bg-yellow-600 px-3 py-1.5 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
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

      {/* Edit Modal */}
      {editing && (
        <EditProductModal
          product={editing}
          onClose={() => setEditing(null)}
          onSave={() => {
            setEditing(null);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}