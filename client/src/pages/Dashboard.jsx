import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UserCircleIcon,
  CodeBracketIcon,
  ArrowRightCircleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { io } from "socket.io-client";
import { FaPlus, FaBars } from "react-icons/fa";

import "./Dashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const socket = io(API_BASE_URL, { transports: ["websocket", "polling"] });

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState([
    { day: "Mon", solved: 0 },
    { day: "Tue", solved: 0 },
    { day: "Wed", solved: 0 },
    { day: "Thu", solved: 0 },
    { day: "Fri", solved: 0 },
    { day: "Sat", solved: 0 },
    { day: "Sun", solved: 0 },
  ]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch(`${API_BASE_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        if (data.total_solved_history) setProgressData(data.total_solved_history);
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    socket.on("connect", () => console.log("Connected to Socket.IO server:", socket.id));

    socket.on("new_submission", (data) => {
      setProgressData((prev) => {
        const newData = [...prev];
        const dayIndex = new Date(data.submittedAt).getDay();
        const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIndex];
        const dayObj = newData.find((d) => d.day === dayName);
        if (dayObj) dayObj.solved += 1;
        return newData;
      });
    });

    return () => socket.off("new_submission");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning ";
    if (hour < 18) return "Good Afternoon ";
    return "Good Evening ";
  };

  const menuItems = [
    { name: "Profile", icon: UserCircleIcon, path: "/profile" },
    { name: "Problems", icon: CodeBracketIcon, path: "/problems" },
  ];

  return (
    <div className="dashboard-container">
      {/* Mobile Sidebar Toggle */}
      <button className="mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <FaBars size={20} />
      </button>

      {/* Background Grid */}
      <div className="bg-grid">
        {Array.from({ length: 144 }).map((_, i) => (
          <div key={i} className="border border-gray-700 opacity-20 animate-pulse"></div>
        ))}
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "active" : ""}`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-yellow-400">OJ Dashboard</h1>
          <div className="mt-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <div
                  key={item.name}
                  onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition
                    ${active
                      ? "bg-yellow-400 text-gray-900 font-semibold"
                      : "text-gray-300 hover:text-yellow-400 hover:bg-gray-700"
                    }`}
                >
                  <Icon className="w-6 h-6" />
                  <span>{item.name}</span>
                </div>
              );
            })}
            <Link
              to="/add"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition"
            >
              <FaPlus /> Add Problem
            </Link>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="m-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            <div className="stats-grid mt-6">
              <div className="h-24 bg-gray-700 rounded"></div>
              <div className="h-24 bg-gray-700 rounded"></div>
              <div className="h-24 bg-gray-700 rounded"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Welcome */}
            <div className="mb-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-semibold text-yellow-400"
              >
                {getGreeting()}, {user?.full_name || "Coder"}!
              </motion.h2>
              <p className="text-gray-400 text-sm">Ready to code and compete 💻</p>
            </div>

            {/* Dashboard Stats */}
            <div className="stats-grid mb-10">
              <motion.div whileHover={{ scale: 1.03 }} className="bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center gap-4 cursor-pointer transition">
                <div className="p-3 bg-yellow-400 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <h4 className="text-gray-400 text-sm">Total Solved</h4>
                  <p className="text-2xl font-semibold text-yellow-400">{user?.total_solved || 0}</p>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} className="bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center gap-4 cursor-pointer transition">
                <div className="p-3 bg-pink-500 rounded-lg">
                  <CodeBracketIcon className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <h4 className="text-gray-400 text-sm">Recent Submission</h4>
                  <p className="text-md text-gray-200">
                    #{user?.last_submission_id || "--"} - {user?.last_submission_name || "No submissions yet"}
                  </p>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} className="bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center justify-between cursor-pointer transition">
                <div>
                  <h4 className="text-gray-400 text-sm">Continue Solving</h4>
                  <p className="text-md font-medium text-gray-200">Challenge Awaits!</p>
                </div>
                <button onClick={() => navigate("/problems")} className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
                  <ArrowRightCircleIcon className="w-6 h-6" />
                </button>
              </motion.div>
            </div>

            {/* Weekly Progress Graph */}
            <motion.div whileHover={{ scale: 1.02 }} className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-10">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">Weekly Progress</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                  <XAxis dataKey="day" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderRadius: "8px", border: "none" }} itemStyle={{ color: "#fff" }} />
                  <Line type="monotone" dataKey="solved" stroke="#facc15" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* User Profile */}
            <motion.div whileHover={{ scale: 1.02 }} className="bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">Profile Info</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-gray-200">
                <p><strong>Name:</strong> {user?.name || "N/A"}</p>
                <p><strong>Email:</strong> {user?.email}</p>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
