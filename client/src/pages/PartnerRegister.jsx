import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiUser, FiPhone, FiMail, FiLock, FiArrowLeft } from "react-icons/fi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default function PartnerRegister() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    category: "",
    otp: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isValidPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isValidPassword(form.password)) {
      setError("Password must be at least 8 characters, include uppercase, lowercase, number, and symbol.");
      return;
    }
    try {
      setIsLoading(true);
      setError("");
      await axios.post(`${BASE_URL}/api/partners/register`, form, {
        withCredentials: true,
      });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError("");
      const res = await axios.post(
        `${BASE_URL}/api/partners/verify`,
        {
          email: form.email,
          otp: form.otp,
        },
        { withCredentials: true }
      );
      localStorage.setItem("partnerToken", res.data.token);
      navigate("/upload-documents");
    } catch (err) {
      setError(err.response?.data?.message || "OTP Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Join as a Partner</h2>
              <p className="opacity-90 mt-1 text-sm sm:text-base">
                {step === 1 ? "Create your partner account" : "Verify your email"}
              </p>
            </div>
            {step === 2 && (
              <button
                onClick={handleBack}
                className="p-2 rounded-full hover:bg-indigo-700 transition-colors"
                aria-label="Go back"
              >
                <FiArrowLeft size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input id="name" type="text" placeholder="John Doe" required className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Service Category</label>
                <select id="category" required className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select a category</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Driver">Driver</option>
                  <option value="Beauty & Wellness">Beauty & Wellness</option>
                  <option value="Appliance Repair">Appliance Repair</option>
                  <option value="Paramedics">Paramedics</option>
                  <option value="Physiotherapists">Physiotherapists</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Painter">Painter</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input id="phone" type="tel" placeholder="9876543210" required pattern="[6-9]{1}[0-9]{9}" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input id="email" type="email" placeholder="john@example.com" required className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    minLength="8"
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className={`w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center ${isLoading ? 'opacity-75' : 'hover:bg-indigo-700'}`}>
                {isLoading ? 'Sending OTP...' : 'Get Verification OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-600">We've sent a 6-digit OTP to <span className="font-semibold">{form.email}</span></p>
                <p className="text-sm text-gray-500 mt-1">Check your spam folder if you don't see it</p>
              </div>

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                <input id="otp" type="text" inputMode="numeric" pattern="\d{6}" placeholder="123456" required maxLength="6" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg tracking-widest font-mono" onChange={(e) => setForm({ ...form, otp: e.target.value })} />
              </div>

              <button type="submit" disabled={isLoading} className={`w-full bg-green-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center ${isLoading ? 'opacity-75' : 'hover:bg-green-700'}`}>
                {isLoading ? 'Verifying...' : 'Verify Account'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm sm:text-base">
              {step === 1 ? (
                <>Already have an account? <button onClick={() => navigate("/partner-login")} className="text-indigo-600 hover:text-indigo-800 font-medium transition">Login here</button></>
              ) : (
                <>Didn't receive OTP? <button onClick={handleBack} className="text-indigo-600 hover:text-indigo-800 font-medium transition">Resend OTP</button></>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}