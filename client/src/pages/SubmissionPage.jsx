// SubmissionPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const SubmissionPage = () => {
  const { problemId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCode, setSelectedCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const openModal = (code) => {
    setSelectedCode(code || "// Code not available");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCode("");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-blue-700 text-lg font-bold animate-pulse">⏳ Loading submissions...</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-sans relative bg-gray-900 min-h-screen text-gray-200">
      <h2 className="text-4xl font-extrabold mb-6 text-yellow-400 tracking-tight">
        Submission History
      </h2>

      {submissions.length === 0 ? (
        <p className="text-center text-gray-400 text-lg py-6">
          No submissions found for this problem.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-700">
          <table className="min-w-full bg-gray-800 text-gray-200">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 border-b border-gray-600 uppercase tracking-wider">
                  Submitted At
                </th>
                <th className="text-left py-3 px-4 border-b border-gray-600 uppercase tracking-wider">
                  Language
                </th>
                <th className="text-left py-3 px-4 border-b border-gray-600 uppercase tracking-wider">
                  Verdict
                </th>
                <th className="text-left py-3 px-4 border-b border-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-700 transition-colors duration-200"
                >
                  <td className="py-3 px-4 border-b border-gray-600">
                    {new Date(sub.submittedAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-600">{sub.language}</td>
                  <td
                    className={`py-3 px-4 border-b border-gray-600 font-semibold ${
                      sub.verdict === "Accepted"
                        ? "text-green-500"
                        : sub.verdict === "Wrong Answer"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {sub.verdict}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-600">
                    <button
                      onClick={() => openModal(sub.sourceCode)}
                      className="bg-yellow-500 text-gray-900 px-3 py-1 rounded hover:bg-yellow-400 transition"
                    >
                      View Code
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto p-6 relative"
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-200 hover:text-red-500 font-bold text-xl"
            >
              ✖
            </button>
            <h3 className="text-2xl font-bold mb-4 text-yellow-400">Submission Code</h3>
            <SyntaxHighlighter
              language="javascript" // aap dynamic kar sakte ho language ke hisaab se
              style={oneDark}
              wrapLongLines={true}
              className="rounded-lg text-sm"
            >
              {selectedCode}
            </SyntaxHighlighter>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SubmissionPage;
