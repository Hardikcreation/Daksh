// src/pages/Logout.jsx
import { useEffect } from "react";

const Logout = () => {
  useEffect(() => {
    localStorage.removeItem("callcentreToken");
    window.location.href = "/login";
  }, []);

  return <p>Logging out...</p>;
};

export default Logout;
