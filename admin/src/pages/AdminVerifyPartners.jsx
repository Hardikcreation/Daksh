import { useEffect, useState } from "react";
import axios from "axios";
import { FiMail, FiClock, FiCheck, FiX, FiLoader } from "react-icons/fi";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminVerifyPartners() {
  const [partners, setPartners] = useState({
    unverified: [],
    pending: [],
    verified: [],
    declined: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchPartners = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/admin/partners-by-status`, { 
        withCredentials: true 
      });
      setPartners(data);
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handlePartnerAction = async (id, action) => {
    try {
      setIsProcessing(true);
      await axios.put(`${BASE_URL}/api/admin/${action}-partner/${id}`);
      await fetchPartners();
    } catch (error) {
      console.error(`Error ${action}ing partner:`, error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderList = (list, actions = true) => (
    <div className="space-y-3">
      {list.length === 0 ? (
        <div className="p-4 text-gray-500 text-center bg-gray-50 rounded-lg">
          No partners in this category
        </div>
      ) : (
        list.map((p) => (
          <div key={p._id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-gray-800 truncate">{p.name}</h3>
                <p className="text-gray-600 truncate">{p.email}</p>
                <p className="text-gray-500">Phone: {p.phone}</p>
                {p.businessName && <p className="text-gray-500">Business: {p.businessName}</p>}
              </div>
              {actions && (
                <div className="flex flex-col sm:flex-row gap-2 self-end sm:self-center">
                  <button 
                    onClick={() => handlePartnerAction(p._id, 'verify')}
                    disabled={isProcessing}
                    className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? <FiLoader className="animate-spin" /> : <FiCheck />}
                    <span className="hidden sm:inline">Verify</span>
                  </button>
                  <button 
                    onClick={() => handlePartnerAction(p._id, 'decline')}
                    disabled={isProcessing}
                    className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? <FiLoader className="animate-spin" /> : <FiX />}
                    <span className="hidden sm:inline">Decline</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="lg:ml-64 p-4 sm:p-6 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="lg:ml-64 p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Partner Verification Dashboard</h1>
        <button 
          onClick={fetchPartners}
          className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
        >
          <FiLoader className="text-gray-600" />
          Refresh Data
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Unverified Partners */}
        <section className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full text-blue-800">
              <FiMail size={20} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-blue-800">
              Unverified Partners <span className="text-sm font-normal">(Email not verified)</span>
            </h2>
            <span className="ml-auto bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              {partners.unverified.length}
            </span>
          </div>
          <div className="mt-3">
            {renderList(partners.unverified, false)}
          </div>
        </section>

        {/* Pending Approval */}
        <section className="bg-amber-50 p-4 rounded-lg border border-amber-100">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-full text-amber-800">
              <FiClock size={20} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-amber-800">
              Pending Approval
            </h2>
            <span className="ml-auto bg-amber-200 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
              {partners.pending.length}
            </span>
          </div>
          <div className="mt-3">
            {renderList(partners.pending)}
          </div>
        </section>

        {/* Verified Partners */}
        <section className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full text-green-800">
              <FiCheck size={20} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-green-800">
              Verified Partners
            </h2>
            <span className="ml-auto bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              {partners.verified.length}
            </span>
          </div>
          <div className="mt-3">
            {renderList(partners.verified, false)}
          </div>
        </section>

        {/* Declined Partners */}
        <section className="bg-red-50 p-4 rounded-lg border border-red-100">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full text-red-800">
              <FiX size={20} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-red-800">
              Declined Partners
            </h2>
            <span className="ml-auto bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
              {partners.declined.length}
            </span>
          </div>
          <div className="mt-3">
            {renderList(partners.declined, false)}
          </div>
        </section>
      </div>
    </div>
  );
}