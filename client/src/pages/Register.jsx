import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful!");
      } else {
        alert(data.msg || "Registration failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Server error!");
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
          <FaUserPlus className="mx-auto text-5xl text-yellow-400 mb-2 hover:animate-pulse" />
          <motion.h1
            className="text-3xl font-extrabold text-white mb-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            Create Account
          </motion.h1>
          <p className="text-gray-300 mt-2">
            Join Online Judge and start solving problems today 🚀
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { name: "name", type: "text", placeholder: "Full Name", icon: <FaUser /> },
            { name: "email", type: "email", placeholder: "Email Address", icon: <FaEnvelope /> },
            { name: "password", type: "password", placeholder: "Password", icon: <FaLock /> },
            { name: "confirmPassword", type: "password", placeholder: "Confirm Password", icon: <FaLock /> },
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
            className="w-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-gray-900 py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition"
          >
            Sign Up
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-400 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
