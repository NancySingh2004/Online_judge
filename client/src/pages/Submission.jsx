import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

  const fetchSubmissions = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch("http://localhost:5000/api/user/submissions", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        // assuming data is already sorted by backend, no need to reverse
        setSubmissions(data);
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case "Accepted":
        return "text-green-600 bg-green-100";
      case "Wrong Answer":
        return "text-red-600 bg-red-100";
      case "Runtime Error":
        return "text-yellow-600 bg-yellow-100";
      case "Compilation Error":
        return "text-purple-600 bg-purple-100";
      case "Time Limit Exceeded":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Submission History</h1>
      <div className="overflow-x-auto bg-white rounded-xl shadow-md p-4">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Problem</th>
              <th className="px-4 py-2">Verdict</th>
              <th className="px-4 py-2">Language</th>
              <th className="px-4 py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length > 0 ? (
              submissions.map((sub, index) => (
                <tr key={sub._id} className="border-b text-sm">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 text-blue-600 font-medium">{sub.problem_name}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded ${getVerdictColor(sub.verdict)} text-sm font-semibold`}
                    >
                      {sub.verdict}
                    </span>
                  </td>
                  <td className="px-4 py-2 uppercase">{sub.language}</td>
                  <td className="px-4 py-2">
                    {new Date(sub.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-400 py-6">
                  No submissions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
