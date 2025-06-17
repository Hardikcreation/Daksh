import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUser, FiCheckCircle, FiClock, FiAlertCircle, FiBriefcase, FiCalendar, FiSettings, FiHelpCircle } from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PartnersHome = () => {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const token = localStorage.getItem("partnerToken");
        const res = await axios.get(`${BASE_URL}/api/partners/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPartner(res.data);
      } catch (err) {
        setPartner(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPartner();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl sm:rounded-xl shadow-lg sm:shadow-md w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-14 w-14 sm:h-12 sm:w-12 border-t-3 border-b-3 sm:border-t-2 sm:border-b-2 border-indigo-500 mx-auto mb-6 sm:mb-4"></div>
          <h3 className="text-xl sm:text-lg font-semibold sm:font-medium text-gray-800">Loading your details...</h3>
          <p className="text-gray-500 mt-2 sm:mt-1">Please wait while we fetch your information</p>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl sm:rounded-xl shadow-lg sm:shadow-md w-full max-w-md text-center">
          <div className="mx-auto flex items-center justify-center h-14 w-14 sm:h-12 sm:w-12 rounded-full bg-red-100 mb-6 sm:mb-4">
            <FiAlertCircle className="h-7 w-7 sm:h-6 sm:w-6 text-red-600" />
          </div>
          <h3 className="text-xl sm:text-lg font-semibold sm:font-medium text-gray-800">Could not load details</h3>
          <p className="text-gray-500 mt-3 sm:mt-2">Please try again or contact support if the problem persists</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 sm:mt-4 inline-flex items-center px-6 py-3 sm:px-4 sm:py-2 border border-transparent text-base sm:text-sm font-semibold sm:font-medium rounded-xl sm:rounded-md shadow-lg sm:shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!partner.isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl sm:rounded-xl shadow-lg sm:shadow-md w-full max-w-md text-center">
          <div className="mx-auto flex items-center justify-center h-14 w-14 sm:h-12 sm:w-12 rounded-full bg-yellow-100 mb-6 sm:mb-4">
            <FiClock className="h-7 w-7 sm:h-6 sm:w-6 text-yellow-600" />
          </div>
          <h3 className="text-xl sm:text-lg font-semibold sm:font-medium text-gray-800">Account Verification Pending</h3>
          <p className="text-gray-500 mt-3 sm:mt-2">
            Your account is under verification. We'll notify you via email once you're verified.
          </p>
          <div className="mt-8 sm:mt-6 bg-blue-50 rounded-xl sm:rounded-lg p-5 sm:p-4 text-left">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Note:</span> This process typically takes 1-2 business days.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-0 sm:py-8 px-0 sm:px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-none sm:rounded-xl shadow-none sm:shadow-sm overflow-hidden">
          {/* Header - Enhanced for mobile */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-4 sm:px-6 py-10 sm:py-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-2xl sm:text-3xl font-bold leading-tight">Welcome back,</h1>
                <h1 className="text-3xl sm:text-2xl sm:text-3xl font-bold leading-tight">{partner.name}!</h1>
                <p className="mt-3 sm:mt-2 opacity-90 text-lg sm:text-base">You are now part of the Daksh Team! 🎉</p>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-white bg-opacity-20">
                  <FiUser className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 py-6 sm:py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Partner Info - Enhanced for mobile */}
              <div className="bg-gray-50 rounded-2xl sm:rounded-lg p-5 sm:p-6 border border-gray-100 sm:border-none">
                <h3 className="text-xl sm:text-lg font-bold sm:font-semibold text-gray-800 mb-5 sm:mb-4 flex items-center gap-3 sm:gap-2">
                  <div className="p-2 sm:p-0 bg-indigo-100 sm:bg-transparent rounded-xl sm:rounded-none">
                    <FiUser className="text-indigo-500 w-5 h-5 sm:w-4 sm:h-4" />
                  </div>
                  Partner Information
                </h3>
                <div className="space-y-4 sm:space-y-3">
                  <div className="bg-white sm:bg-transparent p-4 sm:p-0 rounded-xl sm:rounded-none shadow-sm sm:shadow-none">
                    <p className="text-sm font-medium sm:font-normal text-gray-500">Job ID</p>
                    <p className="font-bold sm:font-medium text-gray-800 text-lg sm:text-base mt-1">{partner.jobId}</p>
                  </div>
                  <div className="bg-white sm:bg-transparent p-4 sm:p-0 rounded-xl sm:rounded-none shadow-sm sm:shadow-none">
                    <p className="text-sm font-medium sm:font-normal text-gray-500">Status</p>
                    <div className="flex items-center gap-2 sm:gap-1 mt-1">
                      <FiCheckCircle className="text-green-500 w-5 h-5 sm:w-4 sm:h-4" />
                      <span className="font-bold sm:font-medium text-green-600 text-lg sm:text-base">Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services - Enhanced for mobile */}
              <div className="bg-gray-50 rounded-2xl sm:rounded-lg p-5 sm:p-6 border border-gray-100 sm:border-none">
                <h3 className="text-xl sm:text-lg font-bold sm:font-semibold text-gray-800 mb-5 sm:mb-4 flex items-center gap-3 sm:gap-2">
                  <div className="p-2 sm:p-0 bg-indigo-100 sm:bg-transparent rounded-xl sm:rounded-none">
                    <FiBriefcase className="text-indigo-500 w-5 h-5 sm:w-4 sm:h-4" />
                  </div>
                  Your Services
                </h3>
                <ul className="space-y-3 sm:space-y-2">
                  {partner.category && (
                    <li className="flex items-center gap-3 sm:gap-2 bg-white px-5 py-4 sm:px-4 sm:py-3 rounded-xl sm:rounded-lg shadow-sm sm:shadow-xs border border-gray-100">
                      <div className="h-3 w-3 sm:h-2 sm:w-2 rounded-full bg-indigo-500"></div>
                      <span className="font-semibold sm:font-medium text-gray-800 text-base sm:text-sm">{partner.category}</span>
                      <span className="ml-auto sm:ml-2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full sm:bg-transparent sm:px-0 sm:py-0 sm:rounded-none">(Main Category)</span>
                    </li>
                  )}
                  {(partner.services || []).map((service, i) => (
                    <li
                      key={service.id || service._id || service || i}
                      className="flex items-center gap-3 sm:gap-2 bg-white px-5 py-4 sm:px-4 sm:py-3 rounded-xl sm:rounded-lg shadow-sm sm:shadow-xs border border-gray-100"
                    >
                      <div className="h-3 w-3 sm:h-2 sm:w-2 rounded-full bg-indigo-400"></div>
                      <span className="font-semibold sm:font-medium text-gray-800 text-base sm:text-sm">{service.name || service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick Actions - Enhanced for mobile */}
            <div className="mt-8">
              <h3 className="text-xl sm:text-lg font-bold sm:font-semibold text-gray-800 mb-5 sm:mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  className="bg-white border-2 border-gray-100 sm:border border-gray-200 rounded-2xl sm:rounded-lg p-6 sm:p-4 text-left hover:border-indigo-300 hover:shadow-lg sm:hover:shadow-sm transition-all shadow-sm sm:shadow-none active:scale-95 sm:active:scale-100"
                  onClick={() => navigate("/partner-orders")}
                >
                  <div className="flex items-center gap-4 sm:gap-0 sm:block">
                    <div className="p-3 sm:p-0 bg-indigo-100 sm:bg-transparent rounded-xl sm:rounded-none mb-0 sm:mb-0">
                      <FiCalendar className="w-6 h-6 sm:w-5 sm:h-5 text-indigo-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold sm:font-medium text-gray-800 text-lg sm:text-base">View Schedule</h4>
                      <p className="text-sm text-gray-500 mt-1">Check your upcoming appointments</p>
                    </div>
                  </div>
                </button>
                <button
                  className="bg-white border-2 border-gray-100 sm:border border-gray-200 rounded-2xl sm:rounded-lg p-6 sm:p-4 text-left hover:border-indigo-300 hover:shadow-lg sm:hover:shadow-sm transition-all shadow-sm sm:shadow-none active:scale-95 sm:active:scale-100"
                  onClick={() => navigate("/partner-update-profile")}
                >
                  <div className="flex items-center gap-4 sm:gap-0 sm:block">
                    <div className="p-3 sm:p-0 bg-indigo-100 sm:bg-transparent rounded-xl sm:rounded-none mb-0 sm:mb-0">
                      <FiSettings className="w-6 h-6 sm:w-5 sm:h-5 text-indigo-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold sm:font-medium text-gray-800 text-lg sm:text-base">Update Profile</h4>
                      <p className="text-sm text-gray-500 mt-1">Edit your personal details</p>
                    </div>
                  </div>
                </button>
                <button
                  className="bg-white border-2 border-gray-100 sm:border border-gray-200 rounded-2xl sm:rounded-lg p-6 sm:p-4 text-left hover:border-indigo-300 hover:shadow-lg sm:hover:shadow-sm transition-all shadow-sm sm:shadow-none active:scale-95 sm:active:scale-100"
                  onClick={() => navigate("/partner-Support")}
                >
                  <div className="flex items-center gap-4 sm:gap-0 sm:block">
                    <div className="p-3 sm:p-0 bg-indigo-100 sm:bg-transparent rounded-xl sm:rounded-none mb-0 sm:mb-0">
                      <FiHelpCircle className="w-6 h-6 sm:w-5 sm:h-5 text-indigo-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold sm:font-medium text-gray-800 text-lg sm:text-base">Support</h4>
                      <p className="text-sm text-gray-500 mt-1">Get help from our team</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnersHome;