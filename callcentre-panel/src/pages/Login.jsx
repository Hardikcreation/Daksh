import { useState } from "react";
import { FiUser, FiLock } from "react-icons/fi"; // Icons (optional)

const Login = () => {
  const [form, setForm] = useState({ id: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const { id, password } = form;

    if (id === "Callcentre@daksh.com" && password === "CallCentre@daksh123") {
      localStorage.setItem("callcentreToken", "secure-auth-token");
      window.location.href = "/dashboard";
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-700">
          Call Centre Login
        </h2>

        {error && (
          <p className="text-red-600 text-sm text-center font-medium bg-red-100 p-2 rounded">
            {error}
          </p>
        )}

        <div className="flex items-center border border-gray-300 rounded px-3 py-2">
          <FiUser className="text-gray-400 mr-2" />
          <input
            type="text"
            name="id"
            placeholder="Enter Email or ID"
            className="w-full outline-none"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            required
          />
        </div>

        <div className="flex items-center border border-gray-300 rounded px-3 py-2">
          <FiLock className="text-gray-400 mr-2" />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            className="w-full outline-none"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
        >
          Login
        </button>

        <p className="text-xs text-gray-400 text-center">
          © {new Date().getFullYear()} Daksh Support System
        </p>
      </form>
    </div>
  );
};

export default Login;
