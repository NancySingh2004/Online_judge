import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  UserCircleIcon,
  CodeBracketIcon,
  ArrowRightCircleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { FaPlus, FaBars } from "react-icons/fa";

import "./Dashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState([
    { day: "Sun", solved: false },
    { day: "Mon", solved: false },
    { day: "Tue", solved: false },
    { day: "Wed", solved: false },
    { day: "Thu", solved: false },
    { day: "Fri", solved: false },
    { day: "Sat", solved: false },
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

        const weekDays = [ "Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const today = new Date();
        const dayIndex = today.getDay(); // 0 = Sunday
        const weeklyData = weekDays.map((day, i) => {
          const date = new Date();
          date.setDate(today.getDate() - (dayIndex - i));
          const dateStr = date.toISOString().split("T")[0];

          const attended = data.attendance?.some((a) => a.date === dateStr);
          return { day, solved: attended };
        });
        setProgressData(weeklyData);
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

  const markDay = async (dayName) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/user/markAttendance`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ day: dayName }),
      });
      if (res.ok) fetchProfile();
      else alert("Failed to mark day");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const computeStreak = () => {
    let streak = 0;
    let maxStreak = 0;
    for (let i = 0; i < progressData.length; i++) {
      if (progressData[i].solved) streak++;
      else streak = 0;
      maxStreak = Math.max(maxStreak, streak);
    }
    return maxStreak;
  };

  useEffect(() => {
    fetchProfile();
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
      <button
        className="mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FaBars size={20} />
      </button>

      {/* Background Grid */}
      <div className="bg-grid">
        {Array.from({ length: 144 }).map((_, i) => (
          <div
            key={i}
            className="border border-gray-700 opacity-20 animate-pulse"
          ></div>
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
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition
                    ${
                      active
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
                {getGreeting()}, {user?.name || "Coder"}!
              </motion.h2>
              <p className="text-gray-400 text-sm">
                Ready to code and compete 💻
              </p>
            </div>

            {/* Dashboard Stats */}
            <div className="stats-grid mb-10">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center gap-4 cursor-pointer transition"
              >
                <div className="p-3 bg-yellow-400 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <h4 className="text-gray-400 text-sm">Total Solved</h4>
                  <p className="text-2xl font-semibold text-yellow-400">
                    {user?.total_solved || 0}
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center gap-4 cursor-pointer transition"
              >
                <div className="p-3 bg-pink-500 rounded-lg">
                  <CodeBracketIcon className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <h4 className="text-gray-400 text-sm">Recent Submission</h4>
                  <p className="text-md text-gray-200">
                    #{user?.last_submission_id || "--"} -{" "}
                    {user?.last_submission_name || "No submissions yet"}
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center justify-between cursor-pointer transition"
              >
                <div>
                  <h4 className="text-gray-400 text-sm">Continue Solving</h4>
                  <p className="text-md font-medium text-gray-200">
                    Challenge Awaits!
                  </p>
                </div>
                <button
                  onClick={() => navigate("/problems")}
                  className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
                >
                  <ArrowRightCircleIcon className="w-6 h-6" />
                </button>
              </motion.div>
            </div>

         <motion.div
  whileHover={{ scale: 1.02 }}
  className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-10"
>
  <h3 className="text-xl font-semibold mb-6 text-yellow-400">
    Weekly Attendance
  </h3>
{/* Attendance Buttons */}
  <div className="flex justify-between gap-3 md:gap-4 mb-6 px-1">
    {progressData.map((d) => (
      <div key={d.day} className="flex flex-col items-center w-full">
        <button
          onClick={() => markDay(d.day)}
          className={`w-full md:w-20 py-2 md:py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center
            ${
              d.solved
                ? "bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 shadow-lg hover:scale-105 hover:brightness-110"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600 hover:scale-105"
            }`}
        >
          {d.day.slice(0, 3)}
        </button>
        <span className="mt-2 text-gray-300 text-sm">
          {d.solved ? "✔" : ""}
        </span>
      </div>
    ))}
  </div>
{/* Mini Streak Graph with Floating Animation */}
<div className="w-full mt-6 bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 shadow-xl border border-gray-700 backdrop-blur-md">
  <h3 className="text-gray-300 text-sm font-semibold mb-3 tracking-wide">
    Weekly Progress
  </h3>
  <svg width="100%" height="200" viewBox="0 0 100 200" preserveAspectRatio="none">
    {/* Square Grid Background */}
    <defs>
      <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#374151" strokeWidth="0.4" />
      </pattern>
      <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
        <rect width="50" height="50" fill="url(#smallGrid)" />
        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#4B5563" strokeWidth="0.7" />
      </pattern>

      {/* Line + Area Gradient */}
      <linearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#FB923C" />
      </linearGradient>
      <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(250,204,21,0.4)" />
        <stop offset="100%" stopColor="rgba(250,204,21,0)" />
      </linearGradient>
    </defs>

    {/* Background Grid */}
    <rect width="100%" height="200" fill="url(#grid)" />

    {/* Floating Wave Line */}
    <motion.g
      animate={{ y: [0, -5, 0, 5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.path
        fill="url(#fillGradient)"
        stroke="url(#waveGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
        d={(() => {
          const amplitude = 35;
          const baseline = 100;
          let path = `M0,${baseline}`;
          progressData.forEach((d, i) => {
            const x = (i * 100) / (progressData.length - 1);
            const y =
              baseline -
              amplitude *
                Math.sin((i / progressData.length) * Math.PI * 2) *
                (d.solved ? 1 : 0.4);
            path += ` L${x},${y}`;
          });
          path += " L100,200 L0,200 Z";
          return path;
        })()}
      />

      {/* Points */}
      {progressData.map((d, i) => {
        const amplitude = 35;
        const baseline = 100;
        const x = (i * 100) / (progressData.length - 1);
        const y =
          baseline -
          amplitude *
            Math.sin((i / progressData.length) * Math.PI * 2) *
            (d.solved ? 1 : 0.4);
        return (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill={d.solved ? "#FACC15" : "#6B7280"}
            className={d.solved ? "drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" : ""}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.15 }}
          >
            <title>
              {d.day}: {d.solved ? "Solved ✅" : "Not Solved ❌"}
            </title>
          </motion.circle>
        );
      })}
    </motion.g>
  </svg>

  {/* Streak Info */}
  <div className="mt-5 flex items-center justify-between">
    <p className="text-gray-300 text-sm">Current Streak</p>
    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-3 py-1 text-sm font-semibold text-yellow-400 shadow-inner">
      {computeStreak()} 🔥
    </span>
  </div>
</div>


</motion.div>


            <motion.div
    whileHover={{ scale: 1.01, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
    
    // Updated container to be flexible and align items
    className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6 md:p-8 flex items-center justify-between"
  >
    {/* HEADER SECTION: Avatar and Primary Info */}
<div className="flex items-center space-x-6 pb-6 border-b border-gray-700/50 mb-6">
  {/* Avatar (Initials or Image) */}
  <div className="relative w-20 h-20 flex-shrink-0">
    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-indigo-500 animate-pulse opacity-30"></div>
    <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-4xl font-extrabold text-white shadow-lg ring-2 ring-purple-400/40 hover:scale-105 transition-transform duration-300">
      {user?.name ? user.name[0].toUpperCase() : <div className="w-8 h-8" />}
    </div>
  </div>

  {/* Name and Role */}
  <div>
    <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
      {user?.name || "User Profile"}
    </h3>
    <span className="inline-flex items-center px-3 py-1 mt-2 text-sm font-medium rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-sm">
      {user?.role || "System Member"}
    </span>
  </div>
</div>

    {/* DETAILS GRID SECTION: Enhanced Visuals */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 text-gray-300">
      
      {/* 1. Email Field */}
<div className="group flex items-center gap-4 p-4 rounded-2xl bg-gray-900/70 backdrop-blur-md border border-gray-700 hover:border-indigo-500 transition-all duration-300 shadow-lg hover:shadow-indigo-500/20">
  {/* Icon with gradient circle */}
  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md group-hover:scale-110 transition-transform duration-300">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 12H8m0 0l4-4m-4 4l4 4m6-8a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  </div>

  {/* Text content */}
  <div className="flex flex-col">
    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
      Email
    </span>
    <p className="text-base md:text-lg font-bold text-white group-hover:text-indigo-400 transition-colors duration-300 break-words">
      {user?.email || "N/A"}
    </p>
  </div>
</div>

      
   

      {/* 4. Status Indicator */}
      <div className="flex items-start space-x-3">
        <div className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
        <div className="flex flex-col">
          <strong className=" mb-2 text-sm uppercase tracking-wider text-gray-400 ">Status</strong>
          <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-0.5 text-sm font-semibold text-green-400">
            Active
          </span>
        </div>
      </div>
    </div>
   
    
    
  </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
