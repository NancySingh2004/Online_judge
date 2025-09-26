import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-blue-700 text-lg font-bold animate-pulse">⏳ Loading submissions...</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-sans">
      <h2 className="text-4xl font-extrabold mb-6 text-violet-800 tracking-tight">
        SUBMISSION HISTORY
      </h2>

      {submissions.length === 0 ? (
        <p className="text-center text-gray-600 text-lg py-6">
          No submissions found for this problem.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-blue-100">
              <tr>
                <th className="text-left py-3 px-4 border-b text-gray-700 uppercase tracking-wider">
                  Submitted At
                </th>
                <th className="text-left py-3 px-4 border-b text-gray-700 uppercase tracking-wider">
                  Language
                </th>
                <th className="text-left py-3 px-4 border-b text-gray-700 uppercase tracking-wider">
                  Verdict
                </th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="py-3 px-4 border-b text-gray-800">
                    {new Date(sub.submittedAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-800">{sub.language}</td>
                  <td
                    className={`py-3 px-4 border-b font-semibold ${
                      sub.verdict === "Accepted"
                        ? "text-green-600"
                        : sub.verdict === "Wrong Answer"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {sub.verdict}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubmissionPage;
