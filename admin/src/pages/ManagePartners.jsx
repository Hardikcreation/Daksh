import { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch, FiTrash2, FiUser, FiMail, FiPhone, FiTool, FiAlertCircle } from "react-icons/fi";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export default function ManagePartners() {
  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${BASE_URL}/api/partners`);
      setPartners(res.data);
      setFilteredPartners(res.data);
    } catch (err) {
      console.error("Error fetching partners:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this partner?");
    if (!confirm) return;

    try {
      setIsDeleting(true);
      await axios.delete(`${BASE_URL}/api/partners/${id}`);
      const updated = partners.filter((partner) => partner._id !== id);
      setPartners(updated);
      setFilteredPartners(updated);
    } catch (err) {
      console.error("Error deleting partner:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = partners.filter(
      (p) =>
        p.name.toLowerCase().includes(value) ||
        p.email.toLowerCase().includes(value) ||
        (p.service && p.service.toLowerCase().includes(value))
    );
    setFilteredPartners(filtered);
  };

  return (
    <div className="lg:ml-64 p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <FiUser className="text-indigo-600" />
                Manage Partners
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                View and manage partner applications
              </p>
            </div>
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search partners..."
                value={search}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : (
          /* Partners Table */
          <div className="overflow-x-auto">
            {filteredPartners.length === 0 ? (
              <div className="p-8 text-center">
                <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {search ? "No matching partners found" : "No partner applications available"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {search ? "Try a different search term" : "Check back later for new applications"}
                </p>
              </div>
            ) : (
              <>
                {/* Mobile View */}
                <div className="md:hidden space-y-4 p-4">
                  {filteredPartners.map((partner) => (
                    <div key={partner._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{partner.name}</h3>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <FiMail className="mr-2" />
                            <span>{partner.email}</span>
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <FiPhone className="mr-2" />
                            <span>{partner.phone}</span>
                          </div>
                          {partner.service && (
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                              <FiTool className="mr-2" />
                              <span>{partner.service}</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDelete(partner._id)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View */}
                <table className="hidden md:table min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Full Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPartners.map((partner) => (
                      <tr key={partner._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {partner.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {partner.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {partner.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {partner.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDelete(partner._id)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-800 inline-flex items-center"
                          >
                            <FiTrash2 className="mr-1" />
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}