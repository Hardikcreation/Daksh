import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/auth/verify-email`, {
        email,
        verificationCode: code
      });
      alert("Email verified! You can now login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Invalid verification code.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
      <form onSubmit={handleVerify} className="space-y-4">
        <input
          type="text"
          placeholder="Enter Verification Code"
          className="w-full p-2 border rounded"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Verify Email
        </button>
      </form>
    </div>
  );
}
