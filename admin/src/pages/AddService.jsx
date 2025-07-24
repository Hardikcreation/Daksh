import { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AddService() {
  const [form, setForm] = useState({
    name: "",
    visitingPrice: "",
    images: [],
  });

  const [subServices, setSubServices] = useState([
    { 
      name: "", 
      price: "", 
      image: null,
      imagePreview: null 
    }
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    setForm((prev) => ({ ...prev, images: files }));
  };

  const handleSubChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...subServices];
    updated[index][name] = value;
    setSubServices(updated);
  };

  const handleSubImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...subServices];
      updated[index].image = file;
      updated[index].imagePreview = URL.createObjectURL(file);
      setSubServices(updated);
    }
  };

  const removeSubServiceImage = (index) => {
    const updated = [...subServices];
    updated[index].image = null;
    updated[index].imagePreview = null;
    setSubServices(updated);
  };

  const addSubService = () => {
    setSubServices([...subServices, { 
      name: "", 
      price: "", 
      image: null,
      imagePreview: null 
    }]);
  };

  const removeSubService = (index) => {
    const updated = [...subServices];
    updated.splice(index, 1);
    setSubServices(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("visitingPrice", form.visitingPrice);
    
    // Add main service images
    form.images.forEach((file) => {
      formData.append("images", file);
    });

    // Add subservices with their images
    const subServicesData = subServices.map(sub => ({
      name: sub.name,
      price: sub.price,
      image: sub.image ? sub.image.name : null // Send the original file name if uploading
    }));
    formData.append("subServices", JSON.stringify(subServicesData));

    // Add subservice images
    subServices.forEach((sub, index) => {
      if (sub.image) {
        formData.append(`subServiceImages`, sub.image);
      }
    });

    try {
      console.log("📤 Sending form data:", {
        name: form.name,
        visitingPrice: form.visitingPrice,
        imagesCount: form.images.length,
        subServicesCount: subServices.length
      });
      
      const response = await axios.post(`${BASE_URL}/api/products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      console.log("✅ Response:", response.data);
      alert("✅ Service added successfully!");
      setForm({
        name: "",
        visitingPrice: "",
        images: [],
      });
      setSubServices([{ 
        name: "", 
        price: "", 
        image: null,
        imagePreview: null 
      }]);
    } catch (err) {
      console.error("❌ Failed to add service:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Unknown error occurred";
      alert(`❌ Failed to add service: ${errorMessage}`);
    }
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
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
              {/* Main Service Details */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-1">
                    Service Name
                  </label>
                  <input 
                    id="name" 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    required 
                    className="w-full border rounded px-3 py-2" 
                  />
                </div>
                
                <div>
                  <label htmlFor="visitingPrice" className="block text-base font-medium text-gray-700 mb-1">
                    Visiting Price (₹)
                  </label>
                  <input 
                    id="visitingPrice" 
                    name="visitingPrice" 
                    type="number" 
                    value={form.visitingPrice} 
                    onChange={handleChange} 
                    required 
                    className="w-full border rounded px-3 py-2" 
                  />
                </div>
                
                <div>
                  <label htmlFor="images" className="block text-base font-medium text-gray-700 mb-1">
                    Service Images (Max 5)
                  </label>
                  <input 
                    id="images" 
                    name="images" 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleImageChange} 
                    required 
                    className="w-full border rounded px-3 py-2" 
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {form.images.length} images
                  </p>
                </div>
              </div>

              {/* Sub-Services */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-base font-medium text-gray-700">
                    Sub-Services
                  </label>
                  <button 
                    type="button" 
                    onClick={addSubService} 
                    className="text-blue-600 hover:underline text-sm"
                  >
                    + Add Sub-Service
                  </button>
                </div>
                
                <div className="grid gap-4">
                  {subServices.map((sub, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-700">Sub-Service {index + 1}</h4>
                        {subServices.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => removeSubService(index)} 
                            className="text-red-600 hover:text-red-800 text-xl"
                          >
                            ×
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sub-Service Name
                          </label>
                          <input
                            name="name"
                            value={sub.name}
                            placeholder="Enter sub-service name"
                            onChange={(e) => handleSubChange(index, e)}
                            required
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price (₹)
                          </label>
                          <input
                            name="price"
                            value={sub.price}
                            type="number"
                            placeholder="Enter price"
                            onChange={(e) => handleSubChange(index, e)}
                            required
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sub-Service Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSubImageChange(index, e)}
                          className="w-full border rounded px-3 py-2"
                        />
                        {sub.imagePreview && (
                          <div className="mt-2 flex items-center gap-2">
                            <img 
                              src={sub.imagePreview} 
                              alt="Preview" 
                              className="w-20 h-20 object-cover rounded border"
                            />
                            <button 
                              type="button" 
                              onClick={() => removeSubServiceImage(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
