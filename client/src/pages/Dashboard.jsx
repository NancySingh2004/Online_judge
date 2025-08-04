import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircleIcon, CodeBracketIcon, ArrowRightCircleIcon } from "@heroicons/react/24/outline";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const res = await fetch("http://localhost:5000/api/user/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data);
    } else {
      navigate("/login");
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

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col justify-between">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">OJ Dashboard</h1>
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <UserCircleIcon className="w-6 h-6" />
              <span className="font-medium">Profile</span>
            </div>
           <div
  onClick={() => navigate("/submissions")}
  className="flex items-center gap-3 text-gray-700 cursor-pointer hover:text-blue-600"
>
  <CodeBracketIcon className="w-6 h-6" />
  <span className="font-medium">Submissions</span>
</div>
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
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800">
            Welcome, {user?.full_name || "User"}!
          </h2>
          <p className="text-sm text-gray-500">Ready to code and compete 💻</p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h4 className="text-gray-500 text-sm">Total Solved</h4>
            <p className="text-2xl font-semibold text-blue-600">12</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h4 className="text-gray-500 text-sm">Recent Submission</h4>
            <p className="text-md text-gray-700">#145 - Two Sum ✔️</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <h4 className="text-gray-500 text-sm">Continue Solving</h4>
              <p className="text-md font-medium text-gray-700">Challenge Awaits!</p>
            </div>
            <button
              onClick={() => navigate("/problems")}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              <ArrowRightCircleIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* User Details Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Profile Info</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-gray-700">
            <p><strong>User ID:</strong> {user?.user_id}</p>
            <p><strong>Email:</strong> {user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
