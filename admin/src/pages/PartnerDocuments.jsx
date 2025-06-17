import { useEffect, useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PartnerDocuments() {
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
    // eslint-disable-next-line
  }, []);

  const fetchPartners = () => {
    setIsLoading(true);
    axios
      .get(`${BASE_URL}/api/admin/partner-documents`, { withCredentials: true })
      .then((res) => setPartners(res.data))
      .catch((err) => {
        console.error("Error fetching documents:", err);
        alert("Failed to fetch documents");
      })
      .finally(() => setIsLoading(false));
  };

  const handleVerification = async (partnerDocId, partnerId, action) => {
    try {
      const Token = localStorage.getItem("adminToken");

      let endpoint;
      if (action === "verify") {
        endpoint = `${BASE_URL}/api/admin/partners/${partnerDocId}/verify`;
      } else {
        endpoint = `${BASE_URL}/api/admin/partners/${partnerId}/decline`;
      }

      await axios.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      alert(`Partner ${action}ed successfully`);
      fetchPartners();
    } catch (err) {
      console.error(`Failed to ${action} partner`, err);
      alert(`${action === "verify" ? "Verification" : "Decline"} failed`);
    }
  };

  return (
    <div className="lg:ml-64 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-indigo-100 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Partner Documents</h2>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : 
        
        /* Empty State */
        partners.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center max-w-md mx-auto">
            <div className="mx-auto h-16 w-16 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v16a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No documents submitted</h3>
            <p className="mt-2 text-sm text-gray-500">Partner documents will appear here once submitted.</p>
          </div>
        ) : 
        
        /* Partner List */
        (
          <div className="space-y-5">
            {partners.map((partner) => (
              <div key={partner._id || partner.email} className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                {/* Partner Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 truncate">
                      {partner.name}
                    </h3>
                    <p className="text-sm text-gray-500">{partner.email}</p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 sm:mt-0 ${
                    (partner.verificationStatus ?? "pending") === "verified"
                      ? "bg-green-100 text-green-800"
                      : (partner.verificationStatus ?? "pending") === "declined"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {partner.verificationStatus ?? "pending"}
                  </span>
                </div>

                {/* Personal Details */}
                <div className="mb-5">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Personal Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    {[
                      { label: "Full Name", value: partner.personalDetails?.fullName || partner.personal_details?.fullName || partner.fullName || "-" },
                      { label: "Date of Birth", value: partner.personalDetails?.dob || partner.personal_details?.dob || partner.dob || "-" },
                      { label: "Gender", value: partner.personalDetails?.gender || partner.personal_details?.gender || partner.gender || "-" },
                      { label: "Address", value: partner.personalDetails?.address || partner.personal_details?.address || partner.address || "-" },
                      { label: "Phone", value: partner.personalDetails?.phone || partner.personal_details?.phone || partner.phone || "-" },
                      { label: "Email", value: partner.personalDetails?.email || partner.personal_details?.email || partner.email || "-" },
                    ].map((item, idx) => (
                      <div className="space-y-1" key={item.label}>
                        <p className="text-gray-500">{item.label}</p>
                        <p className="font-medium">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div className="mb-5">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Documents</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {partner.documents &&
                      Object.entries(partner.documents).map(([docKey, url]) => {
                        if (!url) return null;
                        return (
                          <div
                            key={`${partner._id || partner.email}-${docKey}`}
                            className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center">
                              <div className="p-2 rounded-md bg-blue-50 mr-3">
                                <svg
                                  className="h-5 w-5 text-blue-600"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700 capitalize">
                                  {docKey.replace(/([A-Z])/g, " $1")}
                                </p>
                                <a
                                  href={`${BASE_URL}/${url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  View Document
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Actions */}
                {(partner.verificationStatus ?? "pending") === "pending" && partner.partnerDocId && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleVerification(partner.partnerDocId, partner._id, "verify")}
                      className="flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Verify
                    </button>
                    <button
                      onClick={() => handleVerification(partner.partnerDocId, partner._id, "decline")}
                      className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}