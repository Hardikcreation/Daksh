import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialPersonal = {
  fullName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  address: "",
};

export default function UploadDocuments() {
  const [step, setStep] = useState(1);
  const [personal, setPersonal] = useState(initialPersonal);
  const [personalError, setPersonalError] = useState("");
  const [documents, setDocuments] = useState({});
  const [docError, setDocError] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [aadharStatus, setAadharStatus] = useState(null);
  const [policeVerificationFile, setPoliceVerificationFile] = useState(null);

  // For status after upload
  const [alreadyUploaded, setAlreadyUploaded] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [showLoginButton, setShowLoginButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("partnerToken");
  const navigate = useNavigate();

  // Check document status on mount
  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get(`${BASE_URL}/api/partners/check-documents`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setAlreadyUploaded(res.data.isDocumentsSubmitted);
          setVerificationStatus(res.data.status || "pending");
          if (res.data.status === "verified") {
            clearInterval(interval);
            navigate("/partner-dashboard");
          }
        })
        .catch(() => {});
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate, token]);

  useEffect(() => {
    let timer;
    if (alreadyUploaded && verificationStatus !== "declined") {
      timer = setTimeout(() => {
        setShowLoginButton(true);
      }, 5 * 60 * 1000);
    }
    return () => clearTimeout(timer);
  }, [alreadyUploaded, verificationStatus]);

  // ---- Step 1: PERSONAL DETAILS ----
  const handlePersonalChange = (e) => {
    setPersonal({ ...personal, [e.target.name]: e.target.value });
    setPersonalError("");
  };
  const validatePersonal = () => {
    for (let key of Object.keys(initialPersonal)) {
      if (!personal[key].trim()) {
        setPersonalError("All fields are required.");
        return false;
      }
    }
    setPersonalError("");
    return true;
  };

  // ---- Step 2: DOCUMENTS ----
  // "policeVerification" is optional, others required except degree
  const requiredDocs = [
    "aadhaar",
    "pan",
    "marksheet10",
    "marksheet12",
    "diploma"
  ];
  const allDocs = [
    ...requiredDocs,
    "degree",
    "policeVerification"
  ];
  const handleDocChange = (e) => {
    setDocuments({ ...documents, [e.target.name]: e.target.files[0] });
    setDocError("");
  };
  const validateDocuments = () => {
    for (let key of requiredDocs) {
      if (!documents[key]) {
        setDocError("All required documents must be uploaded.");
        return false;
      }
    }
    setDocError("");
    return true;
  };

  // ---- Step 3: Aadhaar Verification (optional) ----
  const handleAadharVerify = async () => {
    setAadharStatus("verifying");
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setAadharStatus("verified");
      alert("Aadhaar verified successfully!");
    } catch {
      setAadharStatus("error");
      alert("Aadhaar verification failed.");
    }
  };

  // ---- Step 4: Police Verification (optional upload) ----
  const handlePoliceVerificationFile = (e) => {
    setPoliceVerificationFile(e.target.files[0]);
  };

  // ---- Submit all data ----
  const handleSubmitAll = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // 1. Submit personal details
    try {
      await axios.post(`${BASE_URL}/api/partners/update-personal-details`, personal, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      setIsLoading(false);
      alert(err.response?.data?.message || "Failed to submit personal details");
      return;
    }

    // 2. Submit documents
    const form = new FormData();
    allDocs.forEach((key) => {
      if (documents[key]) form.append(key, documents[key]);
    });
    if (policeVerificationFile) form.append("policeVerification", policeVerificationFile);

    try {
      await axios.post(`${BASE_URL}/api/partners/upload-documents`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      setIsLoading(false);
      alert(err.response?.data?.message || "Document upload failed");
      return;
    }
    setIsLoading(false);
    setAlreadyUploaded(true);
    setVerificationStatus("pending");
    alert("Documents and details uploaded successfully.");
  };

  const handleLoginRedirect = () => {
    localStorage.removeItem("partnerToken");
    localStorage.removeItem("partnerInfo");
    navigate("/partner-login");
  };

  // ---- Steps UI ----
  const StepIndicator = () => (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {["Personal Details", "Documents", "Aadhaar (Optional)", "Police Verification (Optional)"].map(
        (label, idx) => (
          <div
            key={label}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap
              ${step === idx + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            style={{
              minWidth: 120,
              textAlign: "center"
            }}
          >
            {idx + 1}. {label}
          </div>
        )
      )}
    </div>
  );

  // ---- Render ----
  return (
    <div className="min-h-screen bg-gray-50 py-5 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="mx-auto bg-white rounded-2xl shadow-md overflow-hidden p-4 sm:p-6 max-w-full sm:max-w-2xl border border-gray-200 mb-6">
        <div className="text-center mb-7">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">Partner Onboarding</h1>
          <p className="mt-2 text-gray-600 text-sm sm:text-base">
            Complete all required steps. Personal details and document upload are <b>mandatory</b>. Aadhaar and Police Verification are <span className="text-blue-600">optional for now</span>.
          </p>
        </div>

        <StepIndicator />

        {alreadyUploaded ? (
          verificationStatus === "declined" ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg flex flex-col sm:flex-row items-center">
              <div className="flex-shrink-0 mb-2 sm:mb-0">
                <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-0 sm:ml-3 text-center sm:text-left">
                <p className="text-sm text-red-700 font-medium">
                  Your documents were declined. Please contact support or re-apply with correct documents.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg flex flex-col sm:flex-row items-center">
                <div className="flex-shrink-0 mb-2 sm:mb-0">
                  <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-0 sm:ml-3 text-center sm:text-left">
                  <p className="text-sm text-green-700 font-medium">
                    Your documents have been successfully uploaded and are under review.<br className="block sm:hidden"/> 
                    Please wait for 2 working days for verification. We will contact you soon.
                  </p>
                </div>
              </div>
              {showLoginButton && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleLoginRedirect}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Go to Login Page
                  </button>
                </div>
              )}
            </>
          )
        ) : (
          <>
            {/* ---- Step 1: Personal Details ---- */}
       {step === 1 && (
  <form
    onSubmit={e => {
      e.preventDefault();
      if (validatePersonal()) setStep(2);
    }}
    className="space-y-4 md:space-y-6"
  >
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 lg:gap-5">
      {/* Full Name */}
      <div className="space-y-1 col-span-1">
        <label className="block text-sm font-medium text-gray-700">
          Full Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="fullName"
          value={personal.fullName}
          onChange={handlePersonalChange}
          className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          required
        />
      </div>
      
      {/* Email */}
      <div className="space-y-1 col-span-1">
        <label className="block text-sm font-medium text-gray-700">
          Email<span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={personal.email}
          onChange={handlePersonalChange}
          className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          required
        />
      </div>
      
      {/* Phone */}
      <div className="space-y-1 col-span-1">
        <label className="block text-sm font-medium text-gray-700">
          Phone<span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={personal.phone}
          onChange={handlePersonalChange}
          className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          required
        />
      </div>
      
      {/* Date of Birth */}
      <div className="space-y-1 col-span-1">
        <label className="block text-sm font-medium text-gray-700">
          Date of Birth<span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="dob"
          value={personal.dob}
          onChange={handlePersonalChange}
          className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          required
        />
      </div>
      
      {/* Gender */}
      <div className="space-y-1 col-span-1">
        <label className="block text-sm font-medium text-gray-700">
          Gender<span className="text-red-500">*</span>
        </label>
        <select
          name="gender"
          value={personal.gender}
          onChange={handlePersonalChange}
          className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
          required
        >
          <option value="">Select...</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
      </div>
      
      {/* Address - Full width on all screens */}
      <div className="space-y-1 col-span-1 sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700">
          Address<span className="text-red-500">*</span>
        </label>
        <textarea
          name="address"
          value={personal.address}
          onChange={handlePersonalChange}
          className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          rows={3}
          required
        />
      </div>
    </div>
    
    {/* Error Message */}
    {personalError && (
      <div className="p-2.5 md:p-3 bg-red-50 text-red-600 text-xs md:text-sm rounded-md border border-red-100">
        {personalError}
      </div>
    )}
    
    {/* Submit Button - Full width on mobile, auto width on larger screens */}
    <div className="flex justify-end pt-1 md:pt-2">
      <button
        type="submit"
        className="w-full sm:w-auto px-4 py-2.5 md:px-6 md:py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base font-medium rounded-lg shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Next: Documents
      </button>
    </div>
  </form>
)}

           {/* ---- Step 2: Documents ---- */}
{step === 2 && (
  <form
    onSubmit={e => {
      e.preventDefault();
      if (validateDocuments()) setStep(3);
    }}
    className="space-y-5 md:space-y-6"
  >
    {/* Upload Instructions */}
    <div className="p-3 md:p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm md:text-base text-gray-700 mb-2">
      Upload all required documents (<span className="font-semibold text-blue-600">PDF or PNG only</span>). 
      <span className="block mt-1 text-gray-500">Degree and Police Verification are optional.</span>
    </div>

    {/* Document Upload Fields */}
    <div className="grid grid-cols-1 gap-4 md:gap-5">
      {allDocs.map((field) => (
        <div key={field} className="space-y-2">
          <label className="block text-sm md:text-base font-medium text-gray-700">
            {field
              .replace("marksheet10", "10th Marksheet")
              .replace("marksheet12", "12th Marksheet")
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, m => m.toUpperCase())}
            {(field !== "degree" && field !== "policeVerification") && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
          
          <div className="relative">
            <input
              type="file"
              name={field}
              accept="application/pdf, image/png"
              required={field !== "degree" && field !== "policeVerification"}
              onChange={handleDocChange}
              className="block w-full text-sm md:text-base text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                file:transition file:duration-150
                file:cursor-pointer
                border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      ))}
    </div>

    {/* Error Message */}
    {docError && (
      <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start">
        <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{docError}</span>
      </div>
    )}

    {/* Navigation Buttons */}
    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
      <button
        type="button"
        onClick={() => setStep(1)}
        className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 font-medium text-sm md:text-base"
      >
        Back
      </button>
      <button
        type="submit"
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 font-medium text-sm md:text-base"
      >
        Next: Aadhaar
      </button>
    </div>
  </form>
)}

            {/* ---- Step 3: Aadhaar Verification (Optional) ---- */}
         {step === 3 && (
  <div className="space-y-5 md:space-y-6">
    {/* Information Box */}
    <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-lg text-sm md:text-base text-gray-700">
      <div className="flex items-start">
        <svg className="w-5 h-5 mr-2 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Aadhaar verification is optional for now. You can complete it later.</span>
      </div>
    </div>

    {/* Aadhaar Input Field */}
    <div className="space-y-2">
      <label className="block text-sm md:text-base font-medium text-gray-700">
        Aadhaar Number
      </label>
      <input 
        type="text" 
        value={aadharNumber} 
        onChange={e => setAadharNumber(e.target.value)} 
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base md:text-lg"
        maxLength={12}
        placeholder="Enter 12-digit Aadhaar"
      />
    </div>

    {/* Status Messages */}
    {aadharStatus === "verified" && (
      <div className="p-3 bg-green-50 text-green-700 rounded-lg border border-green-100 flex items-center">
        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Aadhaar Verified Successfully!
      </div>
    )}
    
    {aadharStatus === "error" && (
      <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center">
        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Aadhaar verification failed. Please try again.
      </div>
    )}

    {/* Action Buttons */}
    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
      <button
        onClick={() => setStep(2)}
        className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 font-medium text-sm md:text-base"
      >
        Back
      </button>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <button
          onClick={handleAadharVerify}
          type="button"
          disabled={aadharStatus === "verifying" || !aadharNumber}
          className={`px-5 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 font-medium text-sm md:text-base flex-1 ${
            aadharStatus === "verifying" 
              ? "bg-indigo-400 cursor-not-allowed" 
              : !aadharNumber 
                ? "bg-indigo-300 cursor-not-allowed" 
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {aadharStatus === "verifying" ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </span>
          ) : "Verify Aadhaar"}
        </button>
        
        <button
          onClick={() => setStep(4)}
          className="px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-150 font-medium text-sm md:text-base flex-1"
        >
          Next: Police Verification
        </button>
      </div>
    </div>
  </div>
)}
            {/* ---- Step 4: Police Verification (Optional) ---- */}
          {step === 4 && (
  <form
    onSubmit={handleSubmitAll}
    className="space-y-6 md:space-y-7"
  >
    {/* Upload Section */}
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Police Verification
        </h3>
        <p className="mt-1 text-sm md:text-base text-gray-600">This step is optional. You can upload documents in PDF or PNG format.</p>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <label className="block text-sm md:text-base font-medium text-gray-700">
          Upload Police Verification Document
          <span className="ml-1 text-xs text-gray-500">(optional)</span>
        </label>
        
        <div className="relative">
          <input 
            type="file" 
            accept="application/pdf, image/png" 
            onChange={handlePoliceVerificationFile} 
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-3 file:px-4
              file:rounded-xl file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              file:transition file:duration-200
              file:cursor-pointer
              border border-gray-300 rounded-xl shadow-sm
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Max file size: 5MB • Accepted: PDF, PNG</p>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
      <button
        type="button"
        onClick={() => setStep(3)}
        className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 font-medium text-sm md:text-base flex items-center justify-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>
      
      <button
        type="submit"
        disabled={isLoading}
        className={`px-6 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 font-medium text-sm md:text-base flex items-center justify-center ${
          isLoading 
            ? "bg-blue-400 cursor-not-allowed" 
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        }`}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Submit All
          </span>
        )}
      </button>
    </div>
  </form>
)}
          </>
        )}
      </div>
      {/* Tailwind utility classes for input and buttons */}
      <style>
        {`
        .input {
          @apply border border-gray-300 rounded-md px-3 py-2 w-full text-base bg-gray-50 mt-1 mb-2 transition-colors focus:border-blue-500 focus:bg-white outline-none;
        }
        .btn-primary {
          @apply bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-2 rounded-md font-semibold border-none shadow hover:from-blue-700 hover:to-blue-900 transition-all;
        }
        .btn-secondary {
          @apply bg-gray-200 text-gray-900 px-6 py-2 rounded-md font-semibold border-none hover:bg-gray-300 transition-all;
        }
        `}
      </style>
    </div>
  );
}