import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UserCircleIcon,
  CodeBracketIcon,
  ArrowRightCircleIcon,
  ChartBarIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col justify-between">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">OJ Dashboard</h1>
          <div className="mt-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <div
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer 
                    ${
                      active
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                >
                  <Icon className="w-6 h-6" />
                  <span>{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="m-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        {loading ? (
          // 🔄 Skeleton Loader
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-gray-800">
                {getGreeting()}, {user?.full_name || "Coder"}!
              </h2>
              <p className="text-sm text-gray-500">
                Ready to code and compete 💻
              </p>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-gray-500 text-sm">Total Solved</h4>
                  <p className="text-2xl font-semibold text-blue-600">
                    {user?.total_solved || 0}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CodeBracketIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="text-gray-500 text-sm">Recent Submission</h4>
                  <p className="text-md text-gray-700">
                    #{user?.last_submission_id || "--"} -{" "}
                    {user?.last_submission_name || "No submissions yet"}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="text-gray-500 text-sm">Continue Solving</h4>
                  <p className="text-md font-medium text-gray-700">
                    Challenge Awaits!
                  </p>
                </div>
                <button
                  onClick={() => navigate("/problems")}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                >
                  <ArrowRightCircleIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* User Details */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Profile Info
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-gray-700">
                <p>
                   <strong>Name:</strong> {user?.name || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
