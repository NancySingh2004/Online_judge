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
    { day: "Mon", solved: false },
    { day: "Tue", solved: false },
    { day: "Wed", solved: false },
    { day: "Thu", solved: false },
    { day: "Fri", solved: false },
    { day: "Sat", solved: false },
    { day: "Sun", solved: false },
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

        const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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
                {getGreeting()}, {user?.full_name || "Coder"}!
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

            {/* Weekly Attendance / Streak Tracker */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-10"
            >
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">
                Weekly Attendance
              </h3>

              <div className="flex justify-between gap-3 mb-4">
                {progressData.map((d) => (
                  <div key={d.day} className="flex flex-col items-center">
                    <button
                      onClick={() => markDay(d.day)}
                      className={`w-14 h-14 rounded-full text-white font-bold transition
                        ${
                          d.solved
                            ? "bg-yellow-400"
                            : "bg-gray-600"
                        } hover:scale-105 hover:bg-yellow-500`}
                    >
                      {d.day.slice(0, 3)}
                    </button>
                    <span className="mt-1 text-gray-300 text-sm">
                      {d.solved ? "✔" : ""}
                    </span>
                  </div>
                ))}
              </div>

             {/* Mini Line Streak Graph */}
            <div className="bg-gray-800 rounded-2xl shadow-lg p-4 w-full max-w-sm mt-6">
  <h4 className="text-gray-400 text-sm mb-3 font-semibold">Weekly Streak Wave</h4>

  <svg width="100%" height="80">
    {/* Wave Line */}
    <motion.path
      fill="none"
      stroke="#FACC15"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      d={progressData
        .map((d, i) => {
          const x = (i * 100) / (progressData.length - 1);
          const baseY = 40;
          const amplitude = d.solved ? 15 : 5; // solved day wave higher
          const y = baseY - amplitude * Math.sin((i / (progressData.length - 1)) * Math.PI);
          return `${x},${y}`;
        })
        .reduce((acc, point, idx) => {
          if (idx === 0) return `M${point}`;
          return `${acc} L${point}`;
        }, "")}
    />

    {/* Points */}
    {progressData.map((d, i) => {
      const x = (i * 100) / (progressData.length - 1) + "%";
      const baseY = 40;
      const amplitude = d.solved ? 15 : 5;
      const y = baseY - amplitude * Math.sin((i / (progressData.length - 1)) * Math.PI);
      return (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r="4"
          fill={d.solved ? "#FACC15" : "#4B5563"}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.1 }}
        />
      );
    })}
  </svg>

  {/* Weekday Labels */}
  <div className="flex justify-between mt-2 text-gray-300 text-xs">
    {progressData.map((d) => (
      <span key={d.day}>{d.day.slice(0, 3)}</span>
    ))}
  </div>

  <p className="text-gray-200 text-sm mt-2">
    Current streak: <span className="text-yellow-400 font-semibold">{computeStreak()}🔥</span>
  </p>
</div>


            </motion.div>

            {/* User Profile */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">
                Profile Info
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-gray-200">
                <p>
                  <strong>Name:</strong> {user?.name || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
