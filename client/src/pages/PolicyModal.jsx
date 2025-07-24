import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PolicyModal({ user, refreshUser }) {
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.privacyAccepted && user.termsAccepted) {
      localStorage.setItem("policiesAccepted", "true");
    }
  }, [user.privacyAccepted, user.termsAccepted]);

  const handleAccept = async () => {
    setSubmitting(true);
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/users/accept-policies`,
      { privacyAccepted: true, termsAccepted: true },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    await refreshUser(); // refetch user data
    setSubmitting(false);
  };

  if (user.privacyAccepted && user.termsAccepted) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Please Accept Our Policies</h2>
        <div className="mb-4">
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={privacyChecked}
              onChange={e => setPrivacyChecked(e.target.checked)}
            />
            I have read and accept the <a href="/privacy" target="_blank" className="text-blue-600 underline">Privacy Policy</a>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={termsChecked}
              onChange={e => setTermsChecked(e.target.checked)}
            />
            I have read and accept the <a href="/terms" target="_blank" className="text-blue-600 underline">Terms & Conditions</a>
          </label>
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold disabled:opacity-50"
          disabled={!privacyChecked || !termsChecked || submitting}
          onClick={handleAccept}
        >
          {submitting ? "Saving..." : "Accept and Continue"}
        </button>
      </div>
    </div>
  );
}
