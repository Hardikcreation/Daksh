import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FiLogOut, FiHelpCircle, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // <-- Add this import

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CustomerProfile() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate(); // <-- Add this line

  useEffect(() => {
    if (isAuthenticated) {
      axios
        .get(`${BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.error("Failed to load profile:", err);
        });
    } else {
      setShowLoginPopup(true);
    }
  }, [isAuthenticated]);

  // Show popup if not logged in or user data not loaded
  if (!user) {
    return (
      <>
        {showLoginPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-xs text-center">
              <div className="text-rose-600 font-bold text-lg mb-4">Your access token is expired </div>
              <div className="mb-6 text-gray-700">You must be logged in to see your profile information.</div>
              <button
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded font-semibold"
                onClick={() => (window.location.href = "/login")}
              >
                Go to Login
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            {user.profilePicUrl ? (
              <img
                src={user.profilePicUrl}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border"
              />
            ) : (
              <FiUser className="text-blue-600 text-2xl" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
            <p className="text-gray-500">Manage your account information</p>
          </div>
        </div>

          <button
          className="text-blue-600 hover:text-blue-800 flex items-center"
          onClick={() => navigate("/help")}
        >
          <FiHelpCircle className="mr-1" />
          Help
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium">{user.phone || "Not Provided"}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Account Details</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{user.location || "Not Set"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Account Status</p>
              <p className="font-medium text-green-600">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}