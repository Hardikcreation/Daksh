import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiUser } from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PartnerUpdateProfile = () => {
  const [partner, setPartner] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const token = localStorage.getItem("partnerToken");
        const res = await axios.get(`${BASE_URL}/api/partners/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPartner(res.data);
        setForm({
          name: res.data.name,
          phone: res.data.phone,
          email: res.data.email,
          category: res.data.category,
          // Add other fields as needed
        });
      } catch (err) {
        setPartner(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPartner();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("partnerToken");
      await axios.put(`${BASE_URL}/api/partners/update-profile`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated!");
    } catch (err) {
      alert("Update failed.");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!partner) return <div className="p-8 text-center">Could not load profile.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="bg-white shadow-lg rounded-xl max-w-lg w-full p-8 relative">
        {/* Top-right image or icon */}
        <div className="absolute top-6 right-6">
          {/* You can replace FiUser with an actual image if you have partner.profileImage */}
          <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
            <FiUser className="h-8 w-8 text-indigo-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-6">Update Your Profile</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
            <input
              className="w-full border rounded p-2"
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone</label>
            <input
              className="w-full border rounded p-2"
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              className="w-full border rounded p-2"
              name="email"
              value={form.email || ""}
              onChange={handleChange}
              required
              type="email"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Service Category</label>
            <input
              className="w-full border rounded p-2"
              name="category"
              value={form.category || ""}
              onChange={handleChange}
              required
            />
          </div>
          {/* Add more editable fields as needed */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default PartnerUpdateProfile;