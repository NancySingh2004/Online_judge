import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Always remove old token before attempting login
  localStorage.removeItem("token");

  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form)
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("token", data.token);
    navigate("/dashboard");
  } else {
    alert(data.message || "Login failed");
  }
};


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="EMAIL"
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="PASSWORD"
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring"
            onChange={handleChange}
            required
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
