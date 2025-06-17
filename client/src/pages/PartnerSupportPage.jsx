import React, { useState } from "react";
import axios from "axios";
import { FiMail, FiSend, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PartnerSupportPage = () => {
  const [form, setForm] = useState({ subject: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const token = localStorage.getItem("partnerToken");
      await axios.post(`${BASE_URL}/api/partners/support`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus("sent");
      setForm({ subject: "", message: "" });
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-8 text-white">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-full">
                <FiMail className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Partner Support</h2>
                <p className="text-indigo-100 mt-1">We're here to help you</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Briefly describe your issue"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition min-h-[150px]"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Please provide details about your request"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  status === "sending"
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg"
                } text-white`}
                disabled={status === "sending"}
              >
                {status === "sending" ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend className="h-5 w-5" />
                    Send Support Request
                  </>
                )}
              </button>
            </div>

            {/* Status Messages */}
            {status === "sent" && (
              <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-start gap-2">
                <FiCheckCircle className="h-5 w-5 mt-0.5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-medium">Support request sent!</p>
                  <p className="text-sm mt-1">
                    We've received your message and will get back to you soon.
                  </p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start gap-2">
                <FiAlertCircle className="h-5 w-5 mt-0.5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-medium">Failed to send</p>
                  <p className="text-sm mt-1">
                    Please check your connection and try again.
                  </p>
                </div>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              Need immediate assistance? Call us at{" "}
              <a href="tel:9109190390" className="text-indigo-600 hover:underline">
                9109190390
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerSupportPage;