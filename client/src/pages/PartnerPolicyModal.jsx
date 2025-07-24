import { useState } from "react";
import axios from "axios";

export default function PartnerPolicyModal({ partner, refreshPartner }) {
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAccept = async () => {
    setSubmitting(true);
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/partners/accept-policies`,
      { privacyAccepted: true, termsAccepted: true },
      { headers: { Authorization: `Bearer ${localStorage.getItem("partnerToken")}` } }
    );
    await refreshPartner();
    setSubmitting(false);
  };

  if (partner.privacyAccepted && partner.termsAccepted) return null;

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
