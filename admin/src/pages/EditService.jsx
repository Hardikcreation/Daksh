import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    rating: "",
    review: "",
    images: [],
  });

  const [existingImages, setExistingImages] = useState([]);
  const [subServices, setSubServices] = useState([{ title: "", price: "" }]);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/products/${id}`).then((res) => {
      const data = res.data;
      setForm({
        name: data.name,
        description: data.description,
        price: data.price,
        rating: data.rating,
        review: data.review || "",
        images: [],
      });
      setExistingImages(data.images || []);
      setSubServices(data.subServices || [{ title: "", price: "" }]);
    });
  }, [id]);

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

  const removeExistingImage = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
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
    formData.append("existingImages", JSON.stringify(existingImages));

    try {
      await axios.put(`${BASE_URL}/api/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Product updated successfully!");
      navigate("/manage-orders");
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("❌ Failed to update product");
    }
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Edit Service</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Service Name" required />

          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Description" required rows={4} />

          <div className="grid grid-cols-2 gap-4">
            <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Price (₹)" required />
            <input name="rating" type="number" min="1" max="5" step="0.1" value={form.rating} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Rating" required />
          </div>

          <input name="review" value={form.review} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Review" />

          <div>
            <label className="block font-medium mb-1">Existing Images:</label>
            {existingImages.map((img, idx) => (
              <div key={idx} className="flex items-center gap-4 mb-2">
                <img src={`${BASE_URL}/uploads/${img}`} alt="" className="w-24 h-16 object-cover rounded" />
                <button type="button" onClick={() => removeExistingImage(idx)} className="text-red-600 text-sm">Remove</button>
              </div>
            ))}
          </div>

          <input type="file" multiple onChange={handleImageChange} className="w-full border rounded px-3 py-2" />

          <div>
            <label className="block font-medium mb-2">Sub-Services</label>
            {subServices.map((sub, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input name="title" value={sub.title} onChange={(e) => handleSubChange(index, e)} placeholder="Title" className="flex-1 border rounded px-2 py-1" required />
                <input name="price" value={sub.price} type="number" onChange={(e) => handleSubChange(index, e)} placeholder="Price" className="w-32 border rounded px-2 py-1" required />
                {subServices.length > 1 && (
                  <button type="button" onClick={() => removeSubService(index)} className="text-red-600 text-xl">×</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addSubService} className="text-blue-600 text-sm hover:underline">+ Add Sub-Service</button>
          </div>

          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700">Update Product</button>
        </form>s
      </div>
    </div>
  );
} 
