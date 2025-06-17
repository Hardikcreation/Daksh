import { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AddService() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    rating: "",
    review: "",
    images: [],
  });

  const [subServices, setSubServices] = useState([{ title: "", price: "" }]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setForm((prev) => ({ ...prev, images: Array.from(e.target.files) }));
  };

  const handleSubChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...subServices];
    updated[index][name] = value;
    setSubServices(updated);
  };

  const addSubService = () => {
    setSubServices([...subServices, { title: "", price: "" }]);
  };

  const removeSubService = (index) => {
    const updated = [...subServices];
    updated.splice(index, 1);
    setSubServices(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((file) => formData.append("images", file));
      } else {
        formData.append(key, value);
      }
    });

    formData.append("subServices", JSON.stringify(subServices));

    try {
      await axios.post(`${BASE_URL}/api/products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Service added successfully!");
      setForm({
        name: "",
        description: "",
        price: "",
        rating: "",
        review: "",
        images: [],
      });
      setSubServices([{ title: "", price: "" }]);
    } catch (err) {
      console.error("❌ Failed to add service:", err);
      alert("❌ Failed to add service. Please try again.");
    }
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Add New Service
          </h1>
          <p className="mt-2 text-base sm:text-xl text-gray-500">
            Fill out the form to list your service
          </p>
        </div>

        <div className="bg-white shadow-md sm:shadow-xl rounded-lg sm:rounded-2xl overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">

              {/* All Original Fields */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-1">Service Name</label>
                  <input id="name" name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label htmlFor="description" className="block text-base font-medium text-gray-700 mb-1">Description</label>
                  <textarea id="description" name="description" rows={4} value={form.description} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-base font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input id="price" name="price" type="number" value={form.price} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label htmlFor="rating" className="block text-base font-medium text-gray-700 mb-1">Rating (/5)</label>
                    <input id="rating" name="rating" type="number" step="0.1" min="1" max="5" value={form.rating} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                  </div>
                </div>
                <div>
                  <label htmlFor="review" className="block text-base font-medium text-gray-700 mb-1">Review (Optional)</label>
                  <input id="review" name="review" value={form.review} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label htmlFor="images" className="block text-base font-medium text-gray-700 mb-1">Service Images</label>
                  <input id="images" name="images" type="file" multiple onChange={handleImageChange} required className="w-full border rounded px-3 py-2" />
                </div>
              </div>

              {/* Sub-Services */}
              <div className="space-y-3">
                <label className="block text-base font-medium text-gray-700">Sub-Services</label>
                {subServices.map((sub, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      name="title"
                      value={sub.title}
                      placeholder="Title"
                      onChange={(e) => handleSubChange(index, e)}
                      required
                      className="flex-1 border rounded px-3 py-1"
                    />
                    <input
                      name="price"
                      value={sub.price}
                      type="number"
                      placeholder="Price"
                      onChange={(e) => handleSubChange(index, e)}
                      required
                      className="w-32 border rounded px-3 py-1"
                    />
                    {subServices.length > 1 && (
                      <button type="button" onClick={() => removeSubService(index)} className="text-red-600 text-xl">×</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addSubService} className="text-blue-600 hover:underline text-sm mt-1">
                  + Add Another Sub-Service
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-2 sm:pt-4">
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
                >
                  Publish Service
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
