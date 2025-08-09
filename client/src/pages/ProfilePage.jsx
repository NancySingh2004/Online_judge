import React, { useEffect, useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [solved, setSolved] = useState(0);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(true);

  // Fetch profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_BASE_URL}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error("Profile fetch failed:", err))
      .finally(() => setLoading(false));
  }, []);

  // Fetch submissions + solved count
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_BASE_URL}/api/user/submissions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setSubmissions(data.submissions || []);
        setSolved(data.problemsSolved || 0);
      })
      .catch(err => console.error("Submissions fetch failed:", err))
      .finally(() => setSubLoading(false));
  }, []);

  if (loading)
    return <p className="text-center p-6 text-gray-500">⏳ Loading profile...</p>;

  if (!user)
    return <p className="text-center p-6 text-red-500">⚠️ Failed to load user data.</p>;

  const total = submissions.length;
  const accepted = submissions.filter(s => s.verdict === "Accepted").length;
  const wrong = submissions.filter(s => s.verdict === "Wrong Answer").length;
  const recent = submissions.slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow space-y-6">
      <h2 className="text-3xl font-bold text-blue-700">👤 Profile</h2>

      {/* Info */}
      <div className="grid sm:grid-cols-2 gap-6 text-gray-700">
        <p><strong>Full Name:</strong> {user.full_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.user_id}</p>
        <p><strong>Role:</strong> {user.role || "N/A"}</p>
        <p><strong>Joined:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
      </div>

      {/* Stats */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">📊 Submission Stats</h3>
        {subLoading ? (
          <p className="text-sm text-gray-500">Loading submissions...</p>
        ) : (
          <div className="grid sm:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-100 p-4 rounded">
              <p className="text-xl font-bold text-blue-700">{total}</p>
              <p className="text-sm text-gray-600">Total Submissions</p>
            </div>
            <div className="bg-green-100 p-4 rounded">
              <p className="text-xl font-bold text-green-700">{accepted}</p>
              <p className="text-sm text-gray-600">Accepted</p>
            </div>
            <div className="bg-red-100 p-4 rounded">
              <p className="text-xl font-bold text-red-700">{wrong}</p>
              <p className="text-sm text-gray-600">Wrong Answers</p>
            </div>
            <div className="bg-purple-100 p-4 rounded">
              <p className="text-xl font-bold text-purple-700">{solved}</p>
              <p className="text-sm text-gray-600">Problems Solved</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Submissions */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">🕒 Recent Activity</h3>
        {recent.length === 0 ? (
          <p className="text-sm text-gray-500">No recent submissions.</p>
        ) : (
          <ul className="space-y-2">
            {recent.map((s, i) => (
              <li key={i} className="p-3 border rounded bg-gray-50">
                <p><strong>Problem:</strong> {s.problemName}</p>
                <p><strong>Verdict:</strong>{" "}
                  <span className={`font-semibold ${s.verdict === "Accepted" ? "text-green-600" : "text-red-600"}`}>
                    {s.verdict}
                  </span>
                </p>
                <p><strong>Time:</strong> {new Date(s.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
