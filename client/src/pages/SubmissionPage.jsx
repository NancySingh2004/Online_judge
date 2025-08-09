import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"; // ✅ Add this

const SubmissionPage = () => {
  const { problemId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/submissions/${problemId}`);
        setSubmissions(res.data);
      } catch (err) {
        console.error("❌ Error fetching submissions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  if (loading) return <p className="text-center p-4">⏳ Loading submissions...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Submission History</h2>
      {submissions.length === 0 ? (
        <p>No submissions found for this problem.</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Submitted At</th>
              <th className="p-2 border">Language</th>
              <th className="p-2 border">Verdict</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub, idx) => (
              <tr key={idx}>
                <td className="p-2 border">{new Date(sub.submittedAt).toLocaleString()}</td>
                <td className="p-2 border">{sub.language}</td>
                <td className={`p-2 border font-semibold ${
                  sub.verdict === "Accepted" ? "text-green-600" :
                  sub.verdict === "Wrong Answer" ? "text-red-500" :
                  "text-yellow-500"
                }`}>
                  {sub.verdict}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubmissionPage;
