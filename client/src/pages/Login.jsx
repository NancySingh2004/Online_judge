import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
      } else {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Server error, try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background Grid */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-0 z-0">
        {Array.from({ length: 12 * 12 }).map((_, i) => (
          <div key={i} className="border border-gray-700 opacity-20 animate-pulse"></div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md p-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <FaSignInAlt className="mx-auto text-5xl text-yellow-400 mb-2 hover:animate-pulse" />
          <motion.h1
            className="text-3xl font-extrabold text-white mb-2 
                       bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 
                       bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            Login
          </motion.h1>
          <p className="text-gray-300 mt-2">
            Access your Online Judge account 🚀
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { name: "email", type: "email", placeholder: "Email Address", icon: <FaEnvelope /> },
            { name: "password", type: "password", placeholder: "Password", icon: <FaLock /> },
          ].map((field, i) => (
            <div key={i} className="relative">
              <div className="absolute left-3 top-3 text-gray-400">{field.icon}</div>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-600 bg-gray-900 text-gray-200
                           focus:ring-2 focus:ring-yellow-400 outline-none transition duration-300 hover:border-yellow-400"
              />
            </div>
          ))}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 
                       text-gray-900 py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-yellow-400 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
